import Image from "next/image";
import type { CaseListEntry } from "@/lib/cms/map";
import { services } from "@/lib/services";

/**
 * "Breadth by service" — a matriz cliente × serviço da imagem 1 do drive.
 *
 * O QUE ELA PROVA, e por isso está aqui: o paredão de logos mostra QUANTOS
 * clientes; esta grade mostra QUANTA COISA fazemos para o mesmo cliente. É o
 * argumento de profundidade da página, e é o que ela descreveu na call —
 * *"this will be the kind of layout we want, where we've got the breadth by
 * service"*.
 *
 * ⚠️ PLOTA SÓ O QUE ESTÁ PUBLICADO. Cada ponto é um case study no CMS cujo
 * `serviceLabel` bate com um serviço de `lib/services.ts`. Não há ponto
 * "inferido": a grade é uma afirmação sobre trabalho feito para clientes
 * nomeados e não pode ser preenchida por impressão.
 *
 * ⚠️ POR ISSO ELA AINDA ESTÁ RALA, e a causa não é o componente. Os nove cases
 * aprovados em 16-09 trazem o rótulo certo; os seis antigos (shell, aviva,
 * levis, coca-cola, unilever, heineken) carregam o vocabulário da geração
 * passada — "Leadership & Culture Transformation", "Talent & Succession" — que
 * não bate com serviço nenhum de hoje e por isso não plota. Retaguear esses
 * seis é o que enche a grade, e é pedido aberto com a cliente.
 *
 * ⚠️ O MOCKUP TEM PONTO CINZA ALÉM DO ESCURO, sugerindo um segundo nível de
 * engajamento. Ficou de fora de propósito: não existe no conteúdo nada que
 * distinga "fizemos" de "fizemos um pouco", e inventar o grau enfraqueceria o
 * ponto cheio, que é o que carrega a prova. Quando ela mandar a informação —
 * ela ficou de mandar —, é uma terceira condição no `dot`.
 *
 * SÓ AS COLUNAS COM ALGUM PONTO. Dos dez serviços, a grade mostra os que têm ao
 * menos um case: uma coluna inteiramente vazia não informa "não fazemos", só
 * estreita as outras e deixa a tabela com cara de formulário incompleto.
 */
export default function BreadthMatrix({ entries }: { entries: CaseListEntry[] }) {
  // Cliente → serviços evidenciados. O mesmo cliente pode ter mais de um case
  // (a Frasers Property tem dois), e na grade ele é UMA linha — o logo repetido
  // em duas fileiras leria como erro de dados.
  const byClient = new Map<string, { logoUrl?: string; services: Set<string> }>();
  for (const e of entries) {
    if (!e.service) continue;
    const row = byClient.get(e.client) ?? { logoUrl: e.logoUrl, services: new Set<string>() };
    row.services.add(e.service);
    row.logoUrl ??= e.logoUrl;
    byClient.set(e.client, row);
  }

  const columns = services
    .map((s) => s.title)
    .filter((title) => [...byClient.values()].some((r) => r.services.has(title)));

  const rows = [...byClient.entries()]
    // ⚠️ SÓ QUEM PLOTA ALGUM PONTO. Filtrar as colunas vazias não basta: um
    // cliente cujo único serviço é do vocabulário antigo ("Talent & Succession")
    // não bate com nenhuma coluna e sairia como uma FILEIRA INTEIRA EM BRANCO —
    // que é pior que a ausência, porque afirma visualmente que não fizemos nada
    // para aquele cliente. Enquanto os seis cases antigos não forem retagueados,
    // eles ficam fora da grade; continuam na grade de cases logo abaixo.
    .filter(([, row]) => columns.some((title) => row.services.has(title)))
    // Quem tem mais serviços primeiro: a grade abre provando amplitude, e uma
    // linha de um ponto só no topo daria a impressão contrária logo de cara.
    .sort((a, b) => b[1].services.size - a[1].services.size || a[0].localeCompare(b[0]));

  if (!rows.length || !columns.length) return null;

  return (
    /* ROLAGEM HORIZONTAL NO TELEFONE. Uma matriz não cabe em 390px sem virar
       ilegível, e a alternativa usual — empilhar em cartões por cliente — perde
       exatamente o que a matriz faz, que é comparar linhas entre si. */
    <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr>
            <th
              scope="col"
              className="w-[168px] border border-line bg-white px-4 py-3 text-[11px] font-semibold uppercase tracking-[1.3px] text-muted"
            >
              Select clients
            </th>
            {columns.map((title) => (
              <th
                key={title}
                scope="col"
                className="border border-line bg-white px-3 py-3 text-center align-bottom text-[11.5px] font-medium leading-[1.25] text-ink"
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([client, row], i) => (
            <tr key={client} className={i % 2 ? "bg-paper/60" : "bg-white"}>
              <th scope="row" className="border border-line px-4 py-3.5">
                {row.logoUrl ? (
                  <Image
                    src={row.logoUrl}
                    alt={client}
                    width={120}
                    height={40}
                    /* `max-w` além da altura: os arquivos vão de um círculo
                       (BT) a uma marca larga e baixa (Morgan Stanley), e só
                       travar a altura deixa a primeira coluna com logos de
                       pesos visuais muito diferentes. */
                    className="h-7 w-auto max-w-[120px] object-contain object-left opacity-80 grayscale"
                  />
                ) : (
                  /* Sem arquivo de logo, o nome em texto. Metade dos clientes
                     novos (DP World, Ma'aden, Frasers) não tem PNG no acervo, e
                     uma célula vazia apagaria a linha inteira. */
                  <span className="text-[13.5px] font-medium text-ink">{client}</span>
                )}
              </th>
              {columns.map((title) => (
                <td key={title} className="border border-line px-3 py-3.5 text-center">
                  {row.services.has(title) ? (
                    <>
                      <span
                        aria-hidden
                        className="inline-block h-[9px] w-[9px] rounded-full bg-ink"
                      />
                      {/* O ponto é gráfico: quem navega por áudio precisa da
                          palavra. `sr-only` diz o que o ponto significa sem
                          acrescentar nada à tela. */}
                      <span className="sr-only">{`${client}: ${title}`}</span>
                    </>
                  ) : (
                    <span className="sr-only">Not included</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
