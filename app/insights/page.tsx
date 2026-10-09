import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import InsightsLibrary from "@/components/insights/InsightsLibrary";
import Reveal from "@/components/Reveal";
import TypeLabel from "@/components/TypeLabel";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { getInsightListEntries } from "@/lib/cms/map";
import { INSIGHTS_RESOURCE_FILES } from "@/lib/insights-copy";
import { getInsightsCopy } from "@/lib/insights-copy-server";
import { getHomeCopy } from "@/lib/home-copy-server";
import { Download } from "lucide-react";
import { books } from "@/lib/books";
import BookCard from "@/components/books/BookCard";
import BookEndorsements from "@/components/BookEndorsements";
import Image from "next/image";

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
  const [insights, copy, homeCopy] = await Promise.all([
    getInsightListEntries(),
    getInsightsCopy(),
    getHomeCopy(),
  ]);
  const rheaBook = { ...books[0], ...homeCopy.book, cover: "/book-cover-home-transparent.png" };

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
        {/* 01-10: título novo e a foto da estante (gerada, enviada à tarde),
            em sangria total: o lado esquerdo escuro da foto recebe o texto e
            os livros ficam à direita. Filtro mais leve que o padrão para as
            capas não apagarem. */}
        <SolutionHero
          eyebrow={copy.hero.eyebrow}
          title={copy.hero.title.replace(/\.$/, "")}
          imageUrl="/insights/insights-hero-bookshelf.jpg"
          imagePosition="object-[72%_25%]"
          imageFilter="brightness-[.9]"
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
            <div className="mt-10 grid gap-8">
              <BookCard
                book={rheaBook}
                headingLevel="h2"
                coverShadow={false}
              >
                <BookEndorsements />
              </BookCard>
              <article className="border border-line bg-ink p-8 text-white md:p-12">
                <p className="text-[12px] font-semibold uppercase tracking-[1.6px] text-brand-light">Nitin Goil</p>
                <h2 className="font-serif mt-4 text-[32px] font-semibold leading-[1.08] tracking-[-0.4px]">
                  The Restored Organization: Six Ways to Humanize Workplace Culture and Transform Results
                </h2>
                <p className="mt-3 text-[14px] text-white/60">Notion Press, 2025</p>
                {/* No mobile a capa vem ANTES do texto  -  mesma ordem do BookCard
                    do primeiro livro. No desktop a capa fica à direita. */}
                <div className="mt-7 grid gap-x-12 md:grid-cols-[minmax(0,1fr)_minmax(220px,340px)]">
                  <figure className="relative mx-auto mb-8 aspect-[1198/1313] w-full max-w-[340px] md:order-2 md:mb-0 md:mx-0 md:justify-self-end">
                    <Image
                      src="/nitin-restored-organization.png"
                      alt="Cover of The Restored Organization by Nitin Goil and Sebastian Anthony"
                      fill
                      sizes="(min-width: 768px) 340px, 80vw"
                      className="object-contain object-top"
                    />
                  </figure>
                  <div className="md:order-1">
                    <div className="space-y-5 text-[15px] leading-[1.7] text-white/80">
                      <p>The Restored Organization offers a refreshing approach and a powerful guide for leaders, HR professionals, and change-makers, ready to address dysfunctional cultures and create workplaces where both people and performance can thrive. Drawing on research, neuroscience, and over 100 interviews with global organizations, the book introduces the FLOWER Framework™ that describes six ways (petals) to humanize workplace cultures and transform results.</p>
                      <p>Whether your organization is facing talent issues, disengagement, or lack of productivity, this book offers real stories, actionable strategies and examples of companies from 14 different countries and 16 diverse industries. The Restored Organization is more than a leadership book. It’s a call to action for those who believe people and performance can grow together.</p>
                    </div>
                    <a href="https://www.amazon.com/dp/B0F9PY7YQ1?lv=shuf&channelId=510&plpRedirect=mhFallback" target="_blank" rel="noopener noreferrer" className="mt-8 inline-block bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-[0.5px] text-white transition-colors hover:bg-brand-dark">Buy on Amazon</a>
                  </div>
                </div>
                <div className="mt-12 grid gap-8 border-t border-white/20 pt-8 md:grid-cols-2">
                  <blockquote className="border-l-2 border-brand pl-5 text-[15px] leading-[1.7] text-white/80">
                    <p>“The Restored Organization is all about leading with heart, and vision. It offers practical advice and real-world strategies to help you build a culture that supports well-being, encourages accountability, and fosters continuous growth. If you’re looking to create a workplace where people thrive, this book is your guide.”</p>
                    <footer className="mt-3 text-[13px] font-semibold text-white">Piyush Gupta, Ex-CEO, DBS Bank, Chairman - Keppel, Mandai Wildlife Group and SMU</footer>
                  </blockquote>
                  <blockquote className="border-l-2 border-brand pl-5 text-[15px] leading-[1.7] text-white/80">
                    <p>“In a culture that often puts performance over people, The Restored Organization reminds us that genuine progress is fuelled by trust, respect, and authenticity. It’s the perfect guide for leaders who value the human side of work as much as the bottom line”.</p>
                    <footer className="mt-3 text-[13px] font-semibold text-white">Dr. Anna A. Tavis, Department Chair, Human Capital Management, New York University</footer>
                  </blockquote>
                  <blockquote className="border-l-2 border-brand pl-5 text-[15px] leading-[1.7] text-white/80">
                    <p>In today’s fragmented world, bringing culture change is the ‘hardest of tasks’ that demands the ‘softest of skills’ for leaders. At the heart of it all stands human behaviour, still being discovered in the world of AI and acting as a transformative glue. The Restored Organization is a must-read book that highlights the vital areas of restoring and reviving an organisational culture, before it is too late.</p>
                    <footer className="mt-3 text-[13px] font-semibold text-white">KV Rao, Chairman, Tata International, Singapore</footer>
                  </blockquote>
                  <blockquote className="border-l-2 border-brand pl-5 text-[15px] leading-[1.7] text-white/80">
                    <p>“The Restored Organization is your ultimate guide to thriving in the digital age. It challenges you to rethink your approach and foster a culture of innovation, collaboration, and people-centricity. A must-read for visionary leaders eager to shape the future of work.”</p>
                    <footer className="mt-3 text-[13px] font-semibold text-white">Tian Chong Ng, CEO, Singtel, Singapore</footer>
                  </blockquote>
                </div>
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
        {/* ⛔ SEM ARTIGOS, SEM SEÇÃO  -  01-10, a pedido: *"remove the Articles
            section"*, porque ainda não há nenhum. Ela não foi apagada: volta
            sozinha quando o primeiro artigo for publicado no CMS. O texto
            continua no editor (`/edit-insights`, "Article library"), e o
            `library.empty` fica sem uso enquanto esta regra valer. */}
        {insights.length > 0 && (
          <section id="library" className="bg-white">
            <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
              <TypeLabel>{copy.library.label}</TypeLabel>
              <h2 className="sr-only">{copy.library.label}</h2>
              <div className="mt-10">
                <InsightsLibrary insights={insights} labels={copy.library} />
              </div>
            </div>
          </section>
        )}
      </SiteShell>
    </div>
  );
}
