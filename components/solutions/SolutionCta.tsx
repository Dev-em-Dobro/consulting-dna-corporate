/**
 * Bloco 6 do outline — "Start a Conversation", por serviço.
 *
 * É A ÚNICA MUDANÇA ESTRUTURAL QUE O OUTLINE PEDE. Na letra dele: "The shared
 * CTA band still runs on every other page, but service pages now carry their own
 * strapline, line and link. It is the difference between a generic invitation
 * and one written for the buyer already reading about their problem, and the
 * sheet supplies all thirty parts."
 *
 * Trinta partes = três por serviço, dez serviços. Para a ExCo:
 *   strapline  Individual accountability. Collective enterprise performance.
 *   linha      Build a senior leadership community that improves decision
 *              quality, alignment and execution speed across functions,
 *              markets and geographies.
 *   link       Talk to us about your enterprise leaders →
 *
 * ⚠️ OS TRÊS CAMPOS NÃO EXISTEM NO CMS, e é por isso que esta faixa ainda mostra
 * o texto padrão. O `solutionSchema` (`corporate-dna-cms/lib/content/types.ts`)
 * tem title, problemStatement, outcome, howWeHelp, body, flagshipCaseSlug,
 * proofRefs e resources — e um comentário dizendo "Start a Conversation → the
 * site's standing CTA", ou seja, a faixa compartilhada. Não dá para contornar
 * gravando as chaves direto no banco: o Zod do CMS DESCARTA chave desconhecida
 * em vez de dar erro, então na primeira vez que alguém salvasse pelo admin o
 * texto sumiria em silêncio. Precisa de migração no CMS antes.
 *
 * A ESTRUTURA JÁ ESTÁ AQUI de propósito: quando os campos existirem, é passar
 * três props e apagar os padrões. O layout não muda.
 */
import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function SolutionCta({
  strapline,
  line,
  ctaLabel,
  ctaHref,
  compact = false,
}: {
  strapline?: string;
  line?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /**
   * ⚠️ A FAIXA ENCOLHE SÓ NA PÁGINA INTERNA DE SERVIÇO, 18-09, a pedido na
   * daily. O padrão continua `py-20 md:py-24` (80/96px); com `compact` passa a
   * `py-6 md:py-8` (24/32px). Nasceu 48/56 e encolheu duas vezes na revisão
   * do mesmo dia (*"pode diminuir mais ainda"*, *"diminui mais a altura"*); na
   * terceira rodada o padding já era pouco e o que sobrava de altura era o AR
   * INTERNO, então `compact` também aperta o miolo — e na quarta rodada
   * (*"diminuir o tamanho da fonte tbm"*) a tipografia inteira desce um
   * degrau: rótulo 12px em vez de 14, título 22/26px em vez de 30/38, linha
   * 15/16 em vez de 18/19, botão `text-xs` com `px-6 py-3` em vez de `text-sm`
   * com `px-7 py-3.5`, e os `mt` caem de 5/5/10 para 2/2/5.
   * É prop, e não a troca do padrão, porque este
   * componente é compartilhado — Services index, Our clients, Team e
   * `CaseStory` também o renderizam — e o pedido foi só para a interna de
   * serviço (`SolutionView`), que é a única que passa `compact`. O conteúdo é
   * o mesmo nos dois casos; só o ar acima e abaixo muda.
   */
  compact?: boolean;
}) {
  return (
    <section className="bg-brand text-white">
      <div
        className={`mx-auto max-w-[1440px] px-6 md:px-10 ${
          compact ? "py-6 md:py-8" : "py-20 md:py-24"
        }`}
      >
        {/* O `Reveal` fica na caixa INTERNA, e não na de 1440: os filhos diretos
            dele têm de ser o rótulo, o título, a linha e o botão. Posto na caixa
            de fora, o único filho seria esta `div` e a faixa inteira entraria
            de uma vez, que é o que ela já fazia. */}
        <Reveal className="max-w-[720px]">
          <p className={`font-medium uppercase tracking-[1.3px] text-white/70 ${compact ? "text-[12px]" : "text-[14px]"}`}>
            Let’s talk
          </p>
          <h2
            className={`font-serif font-semibold leading-[1.15] tracking-[-0.2px] ${
              compact ? "mt-2 text-[22px] md:text-[26px]" : "mt-5 text-[30px] md:text-[38px]"
            }`}
          >
            {strapline ?? "Ready to start the conversation?"}
          </h2>
          {line && (
            <p
              className={`max-w-[620px] font-serif leading-[1.55] text-white/85 ${
                compact ? "mt-2 text-[15px] md:text-[16px]" : "mt-5 text-[18px] md:text-[19px]"
              }`}
            >
              {line}
            </p>
          )}
          {/* Botão BRANCO sobre o vermelho da marca, e não vermelho sobre
              branco: sobre `bg-brand` um botão vermelho desapareceria, e um
              botão vazado (borda branca, fundo transparente) dá 1:1 de contraste
              de área — lê como desabilitado. */}
          <Link
            href={ctaHref ?? "/#contact"}
            className={`inline-block bg-white font-semibold uppercase tracking-[0.5px] text-brand transition-colors hover:bg-ink hover:text-white ${
              compact ? "mt-5 px-6 py-3 text-xs" : "mt-10 px-7 py-3.5 text-sm"
            }`}
          >
            {ctaLabel ?? "Start a Conversation"}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
