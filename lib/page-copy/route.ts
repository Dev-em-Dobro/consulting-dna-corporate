import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import type { CopyStore } from "./store.ts";

/**
 * A API de um editor de página: GET devolve a copy em vigor (padrão + salvo),
 * POST valida, grava e manda as páginas afetadas regenerarem.
 *
 * ⚠️ SEM AUTENTICAÇÃO, de propósito e por pedido (23-09): a cliente entra e
 * salva sem login. É a mesma exposição de qualquer formulário público — quem
 * souber a URL troca o texto do site. Aceito como provisório até o CMS assumir;
 * se precisar fechar antes disso, o lugar é aqui, checando um segredo no header
 * — uma vez, para as duas rotas, que é metade do motivo de esta fábrica existir.
 *
 * ⚠️⚠️ QUEM SALVA TEM DE INVALIDAR A TAG DA LOJA, e é aqui que isso acontece.
 * Desde 23-09 a leitura do Blob é cacheada no Data Cache do Next, para o custo
 * ser proporcional às EDIÇÕES e não ao tráfego — a caixa em `./store.ts` conta
 * por que (um `list()` por render torrou 1,6 mil operações avançadas numa tarde
 * de desenvolvimento). O preço disso é esta linha: sem o `revalidateTag`, a
 * cliente salva, a página regenera e continua lendo a versão velha do cache por
 * até uma hora.
 *
 * A ORDEM IMPORTA: primeiro a tag (que invalida o DADO), depois os caminhos
 * (que invalidam as PÁGINAS). Ao contrário, a página regeneraria com o dado
 * velho ainda em cache e voltaria a ficar parada até a próxima invalidação.
 *
 * ⚠️ `revalidate` É UMA LISTA, e não o caminho da própria página. A copy da
 * About alimenta TAMBÉM a faixa "By the numbers" da Clients & Impact (os quatro
 * números são a mesma fonte desde 18-09 — ver `lib/stats.ts`). Revalidar só
 * `/about` deixaria a outra página publicando o número velho até o cache dela
 * expirar sozinho, que é exatamente a divergência que juntar as duas listas foi
 * feito para impedir.
 */
export function createCopyRoute<T>({
  key,
  store,
  revalidate,
}: {
  key: string;
  store: CopyStore<T>;
  revalidate: string[];
}) {
  return {
    async GET() {
      return NextResponse.json(await store.read(), { headers: { "cache-control": "no-store" } });
    },
    async POST(req: NextRequest) {
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
      }
      try {
        const saved = await store.save(body);
        /* 1. O DADO: derruba a leitura cacheada do Blob (ver a caixa acima).
              `{ expire: 0 }` e não um perfil nomeado: no Next 16 o segundo
              argumento diz quanta obsolescência ainda se aceita servir, e aqui
              a resposta é nenhuma — a cliente acabou de salvar e vai recarregar
              a página para conferir. */
        revalidateTag(store.tag, { expire: 0 });
        // 2. AS PÁGINAS: são estáticas e regeneram na próxima visita; sem isto,
        //    o salvo só apareceria quando o cache delas expirasse.
        for (const p of revalidate) revalidatePath(p);
        return NextResponse.json({ ok: true, copy: saved });
      } catch (err) {
        if (err instanceof ZodError) {
          return NextResponse.json({ error: "Some fields are invalid", issues: err.issues }, { status: 422 });
        }
        console.error(`[${key}-copy] save failed:`, err);
        return NextResponse.json({ error: "Could not save. Please try again." }, { status: 500 });
      }
    },
  };
}
