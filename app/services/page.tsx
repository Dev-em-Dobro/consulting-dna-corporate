import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import ServiceCard from "@/components/solutions/ServiceCard";
import SolutionCta from "@/components/solutions/SolutionCta";
import TypeLabel from "@/components/TypeLabel";
import Reveal from "@/components/Reveal";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { services } from "@/lib/services";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Our Services — Corporate DNA",
    description:
      "Real impact for individuals, leaders, teams and organisations — ten ways in, each starting with what is at stake for the business.",
    alternates: localeAlternates("/services"),
  };
}

/**
 * O índice de serviços — outline de 09-09, §3.1: "hero, then ten cards in a
 * grid", e uma faixa de parceiros embaixo.
 *
 * O QUE SAIU DAQUI. A versão anterior lia os cards do CMS (`SolutionBoxList`,
 * com o sistema de caixas pretas que o Guli desenhou em 29-08) e era liderada
 * pelo `outcome`. Os dez do outline não estão no CMS, então a lista agora vem de
 * `lib/services.ts` — a caixa de abertura daquele arquivo explica a troca.
 *
 * O CARD LIDERA PELA BANNER STATEMENT, e não pelo outcome, porque é o que a
 * sub-linha promete: "Everyone starts with what is at stake for the business."
 * A banner statement é justamente a frase que diz o que está em jogo; o outcome
 * é a página de dentro.
 *
 * DUAS COLUNAS, e não três: são dez cards, e em três a última fileira fica com
 * um sozinho. Em duas, cinco fileiras cheias — e a medida mais larga acomoda as
 * banner statements, que têm duas linhas em quase todas.
 */
export default function SolutionsPage() {
  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell footerTopBorder floatingNav>
        <SolutionHero
          eyebrow="Our Services"
          title="Real impact for individuals, leaders, teams and organisations."
          subtitle="Ten ways in. Everyone starts with what is at stake for the business."
          scrollCueHref="#what-we-do"
          scrollCueLabel="Scroll to what we do"
        />

        <section id="what-we-do" className="bg-paper">
          <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
            <TypeLabel>What we do</TypeLabel>
            {/* O `Reveal` ESCALONA OS DEZ CARDS, um atrás do outro, porque eles
                são filhos diretos dele — é para isso que o `stagger` do
                componente existe. Numa grade de dez, a entrada em cascata é o
                que diferencia uma lista longa de um paredão que aparece
                inteiro. */}
            <Reveal className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {services.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </Reveal>
          </div>
        </section>

        {/* PARCEIROS — §3.1 do outline, a faixa sob a grade.
            ⚠️ SEM AS DUAS MARCAS. O documento pede "two partner marks left, copy
            right", e não existe arquivo de logo da Harvard Business Impact nem
            do Imperial College em `public/logos/`. Nome de instituição é marca
            registrada com regra de uso própria, então não se improvisa com
            imagem achada: a faixa sai só com a copy até os arquivos (e o aceite
            de uso) chegarem, e o lugar das marcas já está reservado à esquerda.

            O outline também pede que ela e a Home leiam "from one CMS partner
            collection so the two pages cannot drift" — isso depende do tipo
            `partnership` no CMS, que ainda espera a migração 0007. Enquanto não
            roda, o texto vive aqui. */}
        {/* ⚠️ NÃO PONHA O MURAL DE CLIENTES AQUI. Ele chegou a existir entre
            esta faixa e a grade — as mesmas duas fileiras da home, lendo de
            `lib/logos.ts` — e saiu em 11-09 por uma razão só: o §3.1 não pede.
            O outline lista herói, dez cards e a faixa de parceiros, e a página
            entrega isso.

            O argumento a favor era razoável (sem ele a página é dez cards de
            texto e um parágrafo, sem prova de nada), e pode voltar — mas como
            pedido ao cliente, não como decisão nossa. O mural é afirmação sobre
            clientes REAIS, e `lib/logos.ts` registra que cada nome ali é
            aprovação da CDNA, não mudança de código. Se voltar, que volte pelo
            mesmo caminho por onde entrou na home. */}
        <section className="bg-white">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-20 md:grid-cols-[1fr_1.4fr] md:gap-16 md:px-10 md:py-24">
            <div>
              <TypeLabel>Partners</TypeLabel>
              <h2 className="font-serif mt-5 max-w-[420px] text-[28px] font-semibold leading-[1.15] tracking-[-0.3px] text-ink md:text-[34px]">
                The work is ours. The partners are chosen.
              </h2>
            </div>
            <div className="max-w-[640px] space-y-5 font-serif text-[17px] leading-[1.7] text-muted md:text-[18px]">
              <p>
                Most work is designed and delivered by our own faculty. Where a bespoke
                programme calls for more, we bring partners in by design rather than by
                default.
              </p>
              <p>
                Harvard Business Impact for faculty research and a digital delivery spine
                that scales. Imperial College London for applied innovation and customised
                executive education. Each joins where the programme needs what they bring,
                and not otherwise.
              </p>
            </div>
          </div>
        </section>

        {/* A FAIXA DE CONVITE FALTAVA AQUI, e era a única página nova sem uma:
            as dez páginas de serviço fecham com ela, a home fecha no formulário,
            a /about e a /team fecham no mapa — só o índice caía do bloco de
            parceiros direto no rodapé.

            SEM PROPS, de propósito. Este é o convite COMPARTILHADO do site
            ("Ready to start the conversation?" / "Start a Conversation"), que é
            o que os padrões do componente já trazem. As trinta partes escritas
            pelo cliente são POR SERVIÇO; o índice não é um serviço, e escrever
            uma strapline para ele seria copy nossa numa página onde todo o
            resto é dele. */}
        <SolutionCta />
      </SiteShell>
    </div>
  );
}
