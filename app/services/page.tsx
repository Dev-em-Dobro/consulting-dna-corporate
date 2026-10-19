import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import ServiceCard from "@/components/solutions/ServiceCard";
import SolutionCta from "@/components/solutions/SolutionCta";
import TypeLabel from "@/components/TypeLabel";
import Reveal from "@/components/Reveal";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { getServicesIndexCopy } from "@/lib/services-index-copy-server";
import { getServicesWithCopy } from "@/lib/service-pages-copy-server";
/* 23-09 (main): a foto da Rhea  -  golfe, tênis e futebol  -  substituiu o skyline
   que a /about e a /services dividiam. Só nesta página; a padrão
   `service-hero-fallback.jpg` segue nas outras rotas do SolutionHero. */
import heroPhoto from "@/public/hero/hero-services.jpeg";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Our Services | CorporateDNA",
    description:
      "Real impact for individuals, leaders, teams and organisations, ten ways in, each starting with what is at stake for the business.",
    alternates: localeAlternates("/services"),
  };
}

/**
 * O índice de serviços  -  outline de 09-09, §3.1: "hero, then ten cards in a
 * grid", e uma faixa de parceiros embaixo.
 *
 * O QUE SAIU DAQUI. A versão anterior lia os cards do CMS (`SolutionBoxList`,
 * com o sistema de caixas pretas que o Guli desenhou em 29-08) e era liderada
 * pelo `outcome`. Os dez do outline não estão no CMS, então a lista agora vem de
 * `lib/services.ts`  -  a caixa de abertura daquele arquivo explica a troca.
 *
 * O CARD LIDERA PELA BANNER STATEMENT, e não pelo outcome, porque é o que a
 * sub-linha promete: "Everyone starts with what is at stake for the business."
 * A banner statement é justamente a frase que diz o que está em jogo; o outcome
 * é a página de dentro.
 *
 * ⚠️ ERAM DUAS COLUNAS ATÉ 14-09, e o raciocínio de então fica registrado
 * porque ele não estava errado: em três colunas a última fileira dos dez cards
 * ficaria com um card sozinho, e a medida mais larga de duas acomodava as banner
 * statements, que têm duas linhas em quase todas. A cliente pediu QUATRO na
 * daily, e quatro resolve o mesmo problema por outro caminho  -  4 + 4 + 2 fecha
 * a última fileira com um par, não com um órfão. O que se paga é a medida: ver
 * a caixa na própria grade.
 */
/* ⚠️ VIROU `async` EM 23-09: as duas leituras abaixo vão ao Vercel Blob. A
   copy desta página vem de `/edit-services`, e a dos dez cards vem da tela
   de cada serviço  -  o nome e o sub-título do card são os mesmos que abrem a
   página interna, e editá-los em dois lugares daria duas fontes para o mesmo
   texto. Ver `lib/service-pages-copy.ts`. */
export default async function SolutionsPage() {
  const [copy, services] = await Promise.all([
    getServicesIndexCopy(),
    getServicesWithCopy(),
  ]);
  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell footerTopBorder floatingNav>
        {/* Foto da Rhea, 23-09 (1600×600): golfe, tênis e futebol. Só nesta
            página. A padrão `service-hero-fallback.jpg` continua nas outras
            rotas do SolutionHero. `object-center` porque o texto fica no
            lavado da esquerda e o arquivo é bem mais largo que a dobra.

            O SKYLINE QUE ESTAVA AQUI  -  o mesmo da /about, pedido na daily de
            14-09  -  saiu com esta troca. O arquivo continua em
            `public/skyline-dna.jpg`, servindo a /about. */}
        {/* O wrapper existe pelo `id`: o <SolutionHero> não recebe um, e o
            script do guia visual do editor precisa de um alvo. */}
        <div id="services-hero">
        <SolutionHero
          eyebrow={copy.hero.eyebrow}
          title={copy.hero.title}
          subtitle={copy.hero.subtitle}
          imageUrl={heroPhoto}
          imagePosition="object-center"
        />
        </div>

        <section id="what-we-do" className="bg-paper">
          <div className="mx-auto max-w-[1440px] px-6 py-14 md:px-10 md:py-16">
            <TypeLabel>{copy.whatWeDo.label}</TypeLabel>
            {/* O `Reveal` ESCALONA OS DEZ CARDS, um atrás do outro, porque eles
                são filhos diretos dele  -  é para isso que o `stagger` do
                componente existe. Numa grade de dez, a entrada em cascata é o
                que diferencia uma lista longa de um paredão que aparece
                inteiro. */}
            {/* ⚠️ QUATRO COLUNAS DESDE 14-09, pedido da Maliha na daily (item
                10): *"we want to do four four four going across... and then the
                last two at the bottom."* São dez cards, então `grid-cols-4`
                entrega 4 + 4 + 2 sozinho  -  a "última fileira com dois" é
                consequência da conta, não uma regra escrita à mão.

                AS QUATRO SÓ VALEM DE `xl` PARA CIMA, e o `lg:grid-cols-2` que
                já existia FICA. Em quatro colunas a 1024px cada card tem 214px,
                e a banner statement (duas linhas em quase todas, a mais longa
                com 78 caracteres) quebraria em quatro palavras por linha. A 1280
                são 278px, que é a medida em que ela volta a ler. Até lá a página
                segue exatamente como estava no ar: uma coluna no telefone e no
                tablet, duas a partir de 1024.

                ✅ AS IMAGENS DOS CARDS ENTRARAM EM 15-09 (item 12). Ela
                respondeu *"use generic for now"*, então seis dos dez recebem as
                banners fotográficas do site antigo e os quatro restantes caem no
                campo de cor  -  a conta está em `cardImage`, em `lib/services.ts`.

                ⚠️ OS DOIS ÚLTIMOS OCUPAM DUAS COLUNAS, e é o que fecha a
                fileira. A fala dela foi "four four four going across and then
                the last two at the bottom", e o desenho que chegou depois
                (`4. Services/Example.png`) mostra o que isso quer dizer: os
                dois últimos não são cards estreitos sobrando numa fileira de
                quatro vagas, são cards LARGOS que dividem a fileira ao meio.
                4 + 4 + (2x2) fecha as três fileiras cheias.

                O `col-span` VAI NO PRÓPRIO CARD, e não num `<div>` em volta:
                os filhos diretos do `Reveal` são o que ele escalona, e embrulhar
                cada card trocaria o alvo da animação por uma caixa vazia.

                SÓ DE `xl` PARA CIMA. Abaixo disso a página é de duas colunas, e
                um `col-span-2` ali faria os dois últimos virarem faixas de
                largura total no meio de uma grade de dois. */}
            <Reveal className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
              {services.map((s, i) => (
                <ServiceCard
                  key={s.slug}
                  service={s}
                  index={i}
                  wideAtXl={i >= services.length - 2}
                />
              ))}
            </Reveal>
          </div>
        </section>

        {/* A FAIXA DE CONVITE FALTAVA AQUI, e era a única página nova sem uma:
            as dez páginas de serviço fecham com ela, a home fecha no formulário,
            a /about e a /team fecham no mapa  -  só o índice caía do bloco de
            parceiros direto no rodapé.

            SEM PROPS, de propósito. Este é o convite COMPARTILHADO do site
            ("Ready to start the conversation?" / "Start a Conversation"), que é
            o que os padrões do componente já trazem. As trinta partes escritas
            pelo cliente são POR SERVIÇO; o índice não é um serviço, e escrever
            uma strapline para ele seria copy nossa numa página onde todo o
            resto é dele. */}
        {/* ⚠️ ERA `<SolutionCta />` SEM PROP NENHUMA, caindo nos padrões do
            componente  -  a caixa acima explica por quê. Desde 23-09 as três
            partes vêm da copy, e os PADRÕES DELA são exatamente os do
            componente, transcritos em `lib/services-index-copy.ts`: enquanto
            a cliente não editar, esta faixa publica o mesmo que publicava.
            `line` vazio continua não desenhando o parágrafo. */}
        <div id="services-cta">
        <SolutionCta
          strapline={copy.cta.strapline}
          line={copy.cta.line || undefined}
          ctaLabel={copy.cta.ctaLabel}
        />
        </div>
      </SiteShell>
    </div>
  );
}
