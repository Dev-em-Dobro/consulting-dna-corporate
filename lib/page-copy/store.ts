import "server-only";
import { del, list, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ZodType } from "zod";
import { mergeCopy } from "./merge.ts";

/**
 * ONDE O QUE A CLIENTE SALVA FICA GUARDADO — uma loja por PÁGINA, mesmo código.
 *
 * Na Vercel o sistema de arquivos é somente leitura, então o JSON vai para o
 * Vercel Blob (loja `cdna-home-copy`, criada em 23-09 e ligada ao projeto; o
 * `BLOB_READ_WRITE_TOKEN` chega pelo ambiente). Sem token — na máquina de quem
 * desenvolve sem `vercel env pull` — cai num arquivo local em `.data/`, que
 * está no .gitignore.
 *
 * A LOJA É UMA SÓ PARA TODAS AS PÁGINAS; o que separa é o PREFIXO do nome
 * (`home-copy/…`, `about-copy/…`). Criar uma loja por página não traria
 * isolamento nenhum que o prefixo já não dê, e dobraria o número de tokens a
 * configurar em dois projetos da Vercel.
 *
 * ⚠️ UM ARQUIVO NOVO POR SALVAMENTO, e não um arquivo sobrescrito. A primeira
 * versão (23-09, de manhã) sobrescrevia `home-copy.json` e furava o cache com
 * `?v=<uploadedAt>`; não bastou — a CDN do Blob continuou servindo a versão
 * velha por até um minuto depois de salvar, e a cliente recarregava a home e
 * via o texto antigo. Com um nome novo a cada versão (`home-copy/<ts>.json`),
 * a URL nunca esteve em cache, e a leitura é a versão que acabou de subir.
 * Quem diz qual é a mais nova é o `list()` (chamada de API, sem CDN), pela
 * ordem do nome: o timestamp vem com zeros à esquerda para ordenar como texto.
 *
 * De brinde, as últimas `KEEP` versões ficam guardadas — é um histórico
 * mínimo. As mais velhas são apagadas depois de cada gravação.
 */
const KEEP = 20;
const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/**
 * ⚠️⚠️ A LEITURA É CACHEADA, E ISSO É UMA CORREÇÃO DE CUSTO — 23-09, à tarde.
 *
 * O DEFEITO: `readSaved()` chama `list()` para descobrir qual é a versão mais
 * nova, e o `list()` do Vercel Blob é uma OPERAÇÃO AVANÇADA — a classe cara,
 * com cota apertada. Como a leitura acontecia a cada render, o custo era
 * proporcional ao TRÁFEGO, e não ao número de edições. Pior: várias páginas
 * leem duas lojas (a `/our-clients` lê `about` e `clients`; a interna de
 * serviço lia `service-pages` duas vezes, no `generateMetadata` e no corpo), e
 * cada `next build` prerenderiza ~27 dessas leituras de uma vez.
 *
 * Foi assim que uma tarde de desenvolvimento — seis builds, os prints do guia,
 * os testes de fumaça — consumiu 1,6 mil das 2 mil operações do mês, sem um
 * único visitante. O desenho não sobreviveria a um dia de tráfego real.
 *
 * O CONSERTO, em três camadas:
 *
 *   1. `unstable_cache` com TAG. O resultado vai para o Data Cache do Next e é
 *      servido de lá. Quem invalida é o `POST` da rota, por `revalidateTag`,
 *      no mesmo instante em que a cliente salva — então o custo passa a ser
 *      proporcional às EDIÇÕES (uma leitura do Blob por salvamento), e não ao
 *      tráfego. O `revalidate` é só um teto de segurança, para o caso de uma
 *      invalidação se perder.
 *   2. `cache()` do React, que junta num só os vários `read()` do MESMO render.
 *   3. A versão é buscada com `force-cache` em vez de `no-store`. Isso era
 *      seguro desde sempre e eu não tinha percebido: o nome do arquivo carrega
 *      um timestamp, então CADA VERSÃO TEM URL PRÓPRIA e nunca esteve em cache
 *      antes. O `no-store` original defendia de um problema que a URL única já
 *      resolve — ver a caixa acima sobre a CDN servir versão velha.
 *
 * ✅ DE BRINDE, ISSO CONSERTA O PRERENDER. O `no-store` fazia a leitura estourar
 * durante o `next build` (`Dynamic server usage`), o erro era engolido e a
 * página saía com o PADRÃO — ou seja, depois de todo deploy o site publicava o
 * texto de código até o ISR regenerar. Dentro do `unstable_cache` a leitura
 * acontece no build e o HTML já sai com o que a cliente salvou.
 *
 * ⏳ SE UM DIA ISTO PRECISAR DE MAIS: o primitivo certo para "config pequena,
 * lida a todo request" é o Edge Config, cuja leitura não é cobrada por
 * operação. São ~33 KB de copy contra um teto de 512 KB, então caberia. Não foi
 * feito agora porque o cache resolve o custo sem migração e sem token novo.
 */
/**
 * O TETO DE SEGURANÇA, E POR QUE ELE É DE UM DIA E NÃO DE UMA HORA.
 *
 * Quem mantém a copy fresca é a invalidação por tag, no salvamento. Este número
 * só existe para o caso de uma invalidação se perder — um salvamento no meio de
 * um deploy, por exemplo. Mas ele NÃO É DE GRAÇA: quando o prazo vence, a
 * próxima visita paga um `list()` por chave.
 *
 * ⚠️ UMA HORA ERA CARO DEMAIS, e foi assim que este arquivo nasceu na primeira
 * tentativa de conserto. São SEIS chaves (home, about, team, services-index,
 * clients, service-pages): a uma hora, isso dá 6 × 24 = 144 operações por dia,
 * ou ~4.300 por mês, contra uma cota de 2.000. O cache resolvia o custo por
 * tráfego e reintroduzia o mesmo estouro pela porta dos fundos.
 *
 * A UM DIA são 6 × 30 = 180 por mês, e a conta fecha com folga. O preço é a
 * janela de obsolescência no cenário raro de uma invalidação perdida — e mesmo
 * nele a cliente conserta salvando de novo, e todo deploy repopula o cache.
 *
 * ⏳ SE PRECISAR DE MAIS FOLGA, a alavanca seguinte não é este número: é juntar
 * as seis chaves numa só. Um `list()` por atualização em vez de seis derrubaria
 * também o custo de cada deploy (medido em 14). Não foi feito porque a conta já
 * fecha, e uma chave só faria todo salvamento reescrever a copy do site inteiro.
 */
const READ_CACHE_SECONDS = 86_400;

export type CopyStore<T> = {
  /** A copy como deve ser renderizada: o salvo por cima do padrão. */
  read: () => Promise<T>;
  /** Valida e grava o objeto inteiro. Lança se o schema reprovar. */
  save: (input: unknown) => Promise<T>;
  /**
   * A tag do Data Cache desta loja. Quem salva TEM de invalidá-la — é o que a
   * fábrica em `./route.ts` faz. Sem isso, a cliente salva e não vê nada mudar
   * por até uma hora.
   */
  tag: string;
};

/**
 * `key` é o nome da página (`home`, `about`) e decide tanto o prefixo no Blob
 * quanto o arquivo local. ⚠️ TROCAR A CHAVE DE UMA PÁGINA JÁ NO AR ABANDONA O
 * QUE ELA SALVOU: as versões velhas continuam na loja, com o prefixo antigo, e
 * a página volta a renderizar o padrão.
 */
export function createCopyStore<T>({
  key,
  defaults,
  schema,
}: {
  key: string;
  defaults: T;
  schema: ZodType<T>;
}): CopyStore<T> {
  const prefix = `${key}-copy/`;
  const localFile = path.join(process.cwd(), ".data", `${key}-copy.json`);
  const versionName = () => `${prefix}${String(Date.now()).padStart(16, "0")}.json`;

  async function listVersions() {
    const { blobs } = await list({ prefix, limit: 1000 });
    return blobs
      .filter((b) => b.pathname.endsWith(".json"))
      .sort((a, b) => (a.pathname < b.pathname ? 1 : -1)); // mais nova primeiro
  }

  async function readSaved(): Promise<unknown> {
    try {
      if (hasBlob()) {
        const [latest] = await listVersions();
        if (!latest) return null;
        /* `force-cache` e não `no-store`: a URL é única por versão. Ver a
           caixa "A LEITURA É CACHEADA", item 3. */
        const res = await fetch(latest.url, { cache: "force-cache" });
        if (!res.ok) return null;
        return await res.json();
      }
      return JSON.parse(await readFile(localFile, "utf8"));
    } catch (err) {
      if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return null;
      console.warn(`[${key}-copy] read failed:`, (err as Error)?.message);
      return null;
    }
  }

  const tag = `page-copy:${key}`;

  const readFresh = async (): Promise<T> => {
    const saved = await readSaved();
    return saved ? mergeCopy(defaults, schema, saved) : defaults;
  };

  /* As duas camadas de cache, de fora para dentro: `cache()` junta as chamadas
     do mesmo render; `unstable_cache` guarda entre renders, até a tag cair. */
  const readCached = unstable_cache(readFresh, [tag], {
    tags: [tag],
    revalidate: READ_CACHE_SECONDS,
  });
  const read = cache(() => readCached());

  return {
    tag,
    read,
    async save(input: unknown) {
      const copy = schema.parse(input);
      const json = JSON.stringify(copy, null, 2);
      if (hasBlob()) {
        await put(versionName(), json, {
          access: "public",
          addRandomSuffix: false,
          contentType: "application/json",
        });
        // Poda das versões antigas. Falhar aqui não pode falhar o salvamento.
        try {
          const old = (await listVersions()).slice(KEEP);
          if (old.length) await del(old.map((b) => b.url));
        } catch (err) {
          console.warn(`[${key}-copy] prune failed:`, (err as Error)?.message);
        }
      } else {
        await mkdir(path.dirname(localFile), { recursive: true });
        await writeFile(localFile, json, "utf8");
      }
      return copy;
    },
  };
}
