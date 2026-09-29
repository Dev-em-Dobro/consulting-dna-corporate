import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import EmptyNotice from "@/components/EmptyNotice";
import InsightsLibrary from "@/components/insights/InsightsLibrary";
import Reveal from "@/components/Reveal";
import TypeLabel from "@/components/TypeLabel";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { getInsightListEntries } from "@/lib/cms/map";
import { INSIGHTS_RESOURCE_FILES } from "@/lib/insights-copy";
import { getInsightsCopy } from "@/lib/insights-copy-server";
import { Download } from "lucide-react";
import { books } from "@/lib/books";
import BookCard from "@/components/books/BookCard";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getInsightsCopy();
  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    alternates: localeAlternates("/insights"),
  };
}
export const revalidate = 300;

export default async function InsightsPage() {
  const [insights, copy] = await Promise.all([getInsightListEntries(), getInsightsCopy()]);

  return (
    /* A LINGUAGEM NOVA CHEGA AQUI em 11-09, a pedido: menu flutuante, herói de
       sangria total e a tipografia editorial  -  a mesma estrutura de /services e
       /team. Esta era a última página do menu ainda em NavV1 + Poppins com um
       cabeçalho branco de 820px, e a diferença aparecia justamente na troca:
       sair de Services e cair aqui parecia mudar de site.

       ⚠️ A TIPOGRAFIA MUDA A BIBLIOTECA JUNTO. O `editorialFontClass` vale para
       a árvore inteira, então os cards do `InsightsLibrary` deixam a Poppins e
       passam a Geist + Source Serif. É o efeito pretendido, e é por isso que
       esta linha está no wrapper e não só no herói. */
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell footerTopBorder floatingNav>
        {/* O TÍTULO É O QUE JÁ ESTAVA NA PÁGINA  -  "Let's share some insights."
            Ele sobe do `<h1>` de 820px para o herói, sem uma palavra nova.

            ⏳ SEM SUBTÍTULO, e isso é falta de conteúdo, não de desenho. O
            `subtitle` deste herói é a "banner statement" do outline de Services,
            uma frase que diz o que está em jogo; para Insights não existe frase
            equivalente escrita pelo cliente, e inventá-la seria copy nossa numa
            página que é toda dele. A descrição de metadados aqui do lado serve
            ao buscador e foi escrita para isso  -  promovê-la a texto de herói é
            outra decisão, e é dele.

            A FOTO É A PADRÃO das páginas de serviço. Vale o mesmo que está
            escrito no componente: uma foto repetida lê como identidade, um slot
            vazio lê como site inacabado  -  e ela some sozinha no dia em que esta
            página ganhar a sua. */}
        <SolutionHero
          eyebrow={copy.hero.eyebrow}
          title={copy.hero.title.replace(/\.$/, "")}
          imageUrl="/insights/insights-hero.png"
        />

        <section id="thought-leadership" className="bg-paper">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
            <TypeLabel>{copy.thoughtLeadership.label}</TypeLabel>
            <h2 className="font-serif mt-5 max-w-[720px] text-[34px] font-semibold leading-[1.04] tracking-[-0.8px] text-ink sm:text-[42px] md:text-[52px]">
              {copy.thoughtLeadership.heading}
            </h2>

            <div className="mt-12 grid gap-px bg-line md:mt-16 md:grid-cols-3">
              {copy.thoughtLeadership.resources.map((resource, index) => (
                <Reveal key={INSIGHTS_RESOURCE_FILES[index]}>
                  <article className="group flex h-full min-h-[420px] flex-col bg-white p-7 transition-colors duration-300 hover:bg-ink md:p-9">
                    <div className="flex items-start justify-between gap-6">
                      <span className="text-[12px] font-semibold tracking-[1.8px] text-brand">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[1.4px] text-muted transition-colors group-hover:text-white/55">
                        PDF · {resource.pagesLabel}
                      </span>
                    </div>

                    <h3 className="font-serif mt-16 text-[27px] font-semibold leading-[1.08] tracking-[-0.45px] text-ink transition-colors group-hover:text-white md:text-[30px]">
                      {resource.title}
                    </h3>
                    <p className="mt-5 text-[15px] leading-[1.65] text-muted transition-colors group-hover:text-white/70">
                      {resource.description}
                    </p>

                    <div className="mt-auto pt-10">
                      <p className="mb-5 text-[11px] font-semibold uppercase tracking-[1.4px] text-muted transition-colors group-hover:text-white/55">
                        {copy.thoughtLeadership.authorPrefix} {resource.author}
                      </p>
                      <a
                        href={INSIGHTS_RESOURCE_FILES[index]}
                        download
                        className="inline-flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.8px] text-ink transition-colors hover:text-brand group-hover:text-white group-hover:hover:text-brand"
                      >
                        {copy.thoughtLeadership.downloadLabel}
                        <Download aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
                      </a>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="books" className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
            <TypeLabel>Books</TypeLabel>
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <BookCard
                book={{ ...books[0], cover: "/book-cover-home-transparent.png" }}
                headingLevel="h2"
                coverShadow={false}
              />
              <article className="border border-line bg-ink p-8 text-white md:p-10">
                <p className="text-[12px] font-semibold uppercase tracking-[1.6px] text-brand-light">Nitin Goil</p>
                <h2 className="font-serif mt-4 text-[32px] font-semibold leading-[1.08] tracking-[-0.4px]">
                  The Restored Organization
                </h2>
                <p className="mt-3 text-[15px] font-medium text-white/80">FLOWER</p>
                <p className="mt-6 text-[15px] leading-[1.65] text-white/75">
                  The Restored Organization offers a refreshing approach and a powerful guide for leaders, HR professionals, and change-makers, ready to address dysfunctional cultures and create workplaces where both people and performance can thrive. Drawing on research, neuroscience, and over 100 interviews with global organizations, the book introduces the FLOWER Framework that describes six ways (petals) to humanize workplace cultures and transform results.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ⚠️ A BIBLIOTECA FOI PARA 1440px EM 12-09, e isto REVERTE o que eu
            tinha escrito aqui em 11-09. O argumento era "1440 é medida de grade
            e isto é uma lista para ler, a 1440 as linhas ficariam longas
            demais". Ele está errado, e o erro foi olhar para a largura do
            CONTAINER em vez de para a largura do CARD.

            A biblioteca já é uma grade de três colunas. Dentro de 820px cada
            card ficava com ~256px, que é estreito para título mais resumo  -  os
            cards espremidos, não as linhas longas. A 1440 com `px-10` sobram
            1360, e três colunas com `gap-6` dão ~437px por card. A medida de
            leitura que eu queria proteger é a do CARD, e ela melhorou ao abrir
            o container, não piorou.

            O que some junto: o desalinhamento com o resto do site. Todas as
            outras páginas novas correm em 1440, e esta era a única em 820  -  o
            rótulo e os cards começavam 310px adentro enquanto tudo o mais
            começa em 40px. */}
        <section id="library" className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
            <TypeLabel>{copy.library.label}</TypeLabel>
            <h2 className="sr-only">{copy.library.label}</h2>
            <div className="mt-10">
            {insights.length === 0 ? (
              <EmptyNotice>{copy.library.empty}</EmptyNotice>
            ) : (
              <InsightsLibrary insights={insights} labels={copy.library} />
            )}
            </div>
          </div>
        </section>
      </SiteShell>
    </div>
  );
}
