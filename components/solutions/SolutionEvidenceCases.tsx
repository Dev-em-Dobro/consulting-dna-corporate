import Reveal from "@/components/Reveal";
import { factIsMeasure, type ServiceEvidenceCases } from "@/lib/services";

/**
 * OS TRÊS CARTÕES DE CLIENTE DA FAIXA "EVIDENCE" — layout de Women’s
 * Leadership Development (`women leadership.jpeg`, 24-09).
 *
 * Cada cartão é uma prova fechada em si: o logo da marca, o nome do programa,
 * uma linha de resultado, TRÊS medidas lado a lado, uma tira de recortes
 * (anos, países, região) e a legenda do que mudou.
 *
 * ============================================================================
 * ⚠️ POR QUE É UMA TERCEIRA FAIXA DE EVIDÊNCIA, E NÃO UMA PROP DAS OUTRAS DUAS
 * ============================================================================
 * O `SolutionEvidence` conta UM caso por extenso (parágrafo, foto, citação). O
 * `SolutionEvidenceSummary` afirma UM resultado e usa os logos como lastro,
 * numa fileira só. Esta faixa afirma TRÊS resultados independentes, um por
 * cliente, cada um com as suas medidas e o seu recorte de tempo e geografia —
 * as medidas não são comparáveis entre os cartões (6.300 pessoas, 96% de
 * impacto, 70 de NPS), e é por isso que elas não podem entrar na fileira
 * intercalada do `Summary`, que trata cada célula como uma medida da MESMA
 * afirmação.
 *
 * ⚠️ AS TRÊS SÃO EXCLUDENTES NA PÁGINA. Todas escrevem o rótulo "Evidence" e
 * ocupam o mesmo lugar; `SolutionView` desempata e `tests/services.test.ts`
 * fixa a regra.
 *
 * ⚠️ FUNDO BRANCO E LOGO EM COR ORIGINAL, como no `Summary` e pela mesma razão:
 * os PNG de `public/logos/` são as marcas para fundo claro, e sobre `ink`
 * exigiriam a plaqueta branca que `SolutionEvidence` registra como testada e
 * descartada. O vermelho das medidas é o `brand` cheio — a regra de uma linha
 * do `globals.css` (`brand` em fundo claro, `brand-light` em fundo escuro).
 *
 * ⛔ SEM LINK PARA CASE. O layout não desenha nenhum, e a régua de sempre vale:
 * link para case despublicado é 404 em cima do logo de um cliente. Quando
 * houver página para as três marcas, o caminho é o do `EvidenceLogo` do
 * `Summary` — envolver o `<img>` num `Link` com `aria-label` próprio.
 */
export default function SolutionEvidenceCases({
  item,
}: {
  item?: ServiceEvidenceCases;
}) {
  const cases = (item?.items ?? []).filter((c) => c.title.trim());
  if (!item || cases.length === 0) return null;

  return (
    /* O `id` REPETE O DAS OUTRAS DUAS FAIXAS DE EVIDÊNCIA: é endereço, não
       texto, e as três nunca convivem na mesma página. */
    <section id="evidence" className="bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
        <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
          {item.label ?? "Evidence"}
        </p>
        <h2 className="mt-6 max-w-[24ch] font-serif text-[28px] font-semibold leading-[1.15] tracking-[-0.3px] text-ink md:text-[36px]">
          {item.headline}
        </h2>
        {item.lead?.trim() ? (
          <p className="mt-4 max-w-[70ch] font-serif text-[16px] leading-[1.6] text-muted md:text-[18px]">
            {item.lead}
          </p>
        ) : null}

        {/* TRÊS COLUNAS SÓ A PARTIR DE `lg`. Cada cartão carrega uma fileira
            interna de três medidas, e a 640px essas nove células viram números
            de dois caracteres por linha. Abaixo de `lg` os cartões empilham e
            as medidas voltam a ter largura. */}
        <Reveal className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {cases.map((c) => (
            <article
              key={c.title}
              className="flex flex-col border border-line bg-white p-6 md:p-7"
            >
              <div className="flex items-center gap-4">
                {/* `<img>` CRU E NÃO `next/image`, pela mesma conta do
                    `SolutionEvidenceSummary`: o `next/image` exige
                    `width`/`height`, esse par vira a proporção da CAIXA, e as
                    marcas de `public/logos/` têm proporções muito diferentes
                    entre si. Com dois tetos e as duas medidas em `auto`, cada
                    marca encolhe até caber e as áreas ficam comparáveis.

                    ⚠️ O TETO AQUI É METADE DO DA OUTRA FAIXA (96/48 contra
                    240/86): lá as marcas SÃO a fileira; aqui elas dividem a
                    primeira linha do cartão com o nome do programa. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.logo.src}
                  alt={c.logo.alt}
                  loading="lazy"
                  className="h-auto max-h-[40px] w-auto max-w-[96px] shrink-0 md:max-h-[48px]"
                />
                <div className="min-w-0">
                  {/* O NOME DO CLIENTE SÓ EXISTE ONDE O LOGO NÃO O ESCREVE. No
                      layout a Shell mostra "SHELL" acima do nome do programa,
                      porque o logo dela é só a concha; a Kellanova e a Aviva
                      não mostram, porque o nome está no próprio lockup.
                      Repeti-lo ali seria dizer a marca duas vezes na mesma
                      linha. */}
                  {c.client?.trim() ? (
                    <p className="text-[12px] font-bold uppercase leading-[1.35] tracking-[1.2px] text-ink">
                      {c.client}
                    </p>
                  ) : null}
                  {/* `h3` sob o `h2` da faixa — a escada de cabeçalhos inteira. */}
                  <h3 className="text-[12px] font-bold uppercase leading-[1.35] tracking-[1.2px] text-ink">
                    {c.title}
                  </h3>
                </div>
              </div>

              <p className="mt-3 font-serif text-[15px] leading-[1.5] text-muted">
                {c.tagline}
              </p>

              {/* AS TRÊS MEDIDAS, separadas por filete vertical — a mesma
                  gramática da fileira do `SolutionEvidenceSummary`, em
                  miniatura.

                  ⚠️ NÚMERO EM TEXTO E NÃO `Counter`, ao contrário da outra
                  faixa: aqui os valores são "5–7", ">70%" e "6,300", e o
                  contador anima a parte numérica que encontra — com um
                  intervalo ou um sinal de maior ele conta até o número errado,
                  e a animação passaria a depender de como a cliente escreveu a
                  medida.

                  `factIsMeasure` continua decidindo o CORPO: uma medida existe
                  para ser vista de longe, uma palavra para ser lida. Hoje as
                  nove são medidas; a regra vale para a primeira que não for. */}
              <ul className="mt-6 grid grid-cols-3 divide-x divide-line border-y border-line py-5">
                {c.facts.map((f) => (
                  <li
                    key={`${f.value}-${f.label ?? ""}`}
                    className="px-2 text-center"
                  >
                    <p
                      className={`font-serif font-semibold leading-[1.1] text-brand ${
                        factIsMeasure(f)
                          ? "text-[24px] md:text-[28px]"
                          : "text-[16px] md:text-[18px]"
                      }`}
                    >
                      {f.value}
                    </p>
                    {f.label ? (
                      <p className="mt-2 font-serif text-[12px] leading-[1.3] text-ink/70">
                        {f.label}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>

              {/* A TIRA DE RECORTES — "5+ years | Global". São qualificadores da
                  prova, não medidas: dizem em quanto tempo e em que geografia
                  ela vale. */}
              {c.meta && c.meta.length > 0 ? (
                <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-medium uppercase tracking-[1.1px] text-brand">
                  {c.meta.map((m, i) => (
                    <li key={m} className="flex items-center gap-3">
                      {/* A BARRA É DESENHO, e por isso `aria-hidden`: a lista já
                          separa os itens para quem usa leitor de tela. */}
                      {i > 0 ? (
                        <span aria-hidden className="text-brand/40">
                          |
                        </span>
                      ) : null}
                      {m}
                    </li>
                  ))}
                </ul>
              ) : null}

              {/* `mt-auto` PARA AS LEGENDAS ALINHAREM ENTRE OS TRÊS CARTÕES: os
                  blocos de cima têm alturas diferentes (o título da Aviva tem
                  duas linhas, o da Shell uma), e sem isto a última frase de cada
                  cartão flutuaria numa altura diferente. */}
              <p className="mt-auto pt-5 font-serif text-[13px] leading-[1.5] text-muted">
                {c.note}
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
