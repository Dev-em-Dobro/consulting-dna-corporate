import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import InsightsLibrary from "@/components/insights/InsightsLibrary";
import Reveal from "@/components/Reveal";
import TypeLabel from "@/components/TypeLabel";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { getInsightListEntries } from "@/lib/cms/map";
import { paperReadingMinutes } from "@/lib/insights-copy";
import { INSIGHTS_RESOURCE_FILES } from "@/lib/insights-copy";
import { getInsightsCopy } from "@/lib/insights-copy-server";
import { getHomeCopy } from "@/lib/home-copy-server";
import { ArrowUpRight, Download } from "lucide-react";
import Link from "next/link";
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
  const rheaBook = { ...books[0], ...homeCopy.book, headline: books[0].name, kicker: "Rhea Leckie · Bloomsbury, 2012", cover: "/book-cover-home-transparent.png" };
  const restoredBook = {
    "name": "The Restored Organization: Six Ways to Humanize Workplace Culture and Transform Results",
    "headline": "The Restored Organization: Six Ways to Humanize Workplace Culture and Transform Results",
    "cover": "/nitin-restored-organization.png",
    "kicker": "Nitin Goil and Sebastian Anthony · Notion Press, 2025",
    "body": [
        "The Restored Organization offers a refreshing approach and a powerful guide for leaders, HR professionals, and change-makers, ready to address dysfunctional cultures and create workplaces where both people and performance can thrive. Drawing on research, neuroscience, and over 100 interviews with global organizations, the book introduces the FLOWER Framework™ that describes six ways (petals) to humanize workplace cultures and transform results.",
        "Whether your organization is facing talent issues, disengagement, or lack of productivity, this book offers real stories, actionable strategies and examples of companies from 14 different countries and 16 diverse industries. The Restored Organization is more than a leadership book. It’s a call to action for those who believe people and performance can grow together."
    ],
    "buyUrl": "https://www.amazon.com/dp/B0F9PY7YQ1?lv=shuf&channelId=510&plpRedirect=mhFallback"
};
  const articleSlug = "why-leadership-development-must-now-teach-systems-awareness-and-systems-navigati";
  const featuredArticle = insights.find((entry) => entry.slug === articleSlug);
  const libraryArticles = insights.filter((entry) => entry.slug !== articleSlug);

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
          imageAlt="Leadership books on a shelf"
          imagePosition="object-left md:object-[72%_25%]"
          imageFilter="brightness-[.9]"
          mobileVisual={
            <div
              className="absolute inset-x-0 top-[clamp(78px,12svh,100px)] h-[min(44svh,320px)] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
            >
              <Image
                src="/insights/insights-hero-bookshelf.jpg"
                alt=""
                width={1672}
                height={941}
                sizes="(max-width: 767px) 190vw, 0px"
                className="absolute -right-5 top-1/2 h-[125%] w-auto max-w-none origin-[68%_center] -translate-x-1 -translate-y-1/2 scale-[1.2]"
              />
              <div className="absolute inset-0 bg-ink/15" />
            </div>
          }
        />

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
        {/* Articles library: hidden while the CMS list is empty (01-10), and
            shown again as soon as a published insight is returned. Cover image
            is optional on cards  -  InsightCard already falls back to a grey
            placeholder when `coverUrl` is missing. */}
        {libraryArticles.length > 0 && (
          <section id="library" className="bg-white">
            <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
              <TypeLabel>{copy.library.label}</TypeLabel>
              <h2 className="sr-only">{copy.library.label}</h2>
              <div className="mt-10">
                <InsightsLibrary insights={libraryArticles} labels={copy.library} />
              </div>
            </div>
          </section>
        )}

        <section id="thought-leadership" className="bg-paper">
          <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-16">
            <TypeLabel>{copy.thoughtLeadership.label}</TypeLabel>
            {/* Nov 2026: the large heading repeated the label above it, so only
                the label stays visible; the h2 remains for screen readers. */}
            <h2 className="sr-only">{copy.thoughtLeadership.label}</h2>

            <div className="mt-10 grid gap-px bg-line md:grid-cols-2">
              {copy.thoughtLeadership.resources.map((resource, index) => (
                <Reveal key={INSIGHTS_RESOURCE_FILES[index]}>
                  <article className="group flex h-full min-h-[420px] flex-col bg-white p-7 transition-colors duration-300 hover:bg-ink md:p-9">
                    <div className="flex items-start justify-between gap-6">
                      <span className="text-[12px] font-semibold tracking-[1.8px] text-brand">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[1.4px] text-muted transition-colors group-hover:text-white/55">
                        PDF · <time dateTime="2026">2026</time> · {resource.pagesLabel} · <span>{`${paperReadingMinutes[INSIGHTS_RESOURCE_FILES[index]]} min read`}</span>
                      </span>
                    </div>

                    {/* Text on the left, the PDF's first page on the right. */}
                    <div className="mt-8 grid grid-cols-[minmax(0,1fr)_96px] items-start gap-6 sm:grid-cols-[minmax(0,1fr)_132px] md:gap-8">
                      <div>
                        <h3 className="font-serif text-[27px] font-semibold leading-[1.08] tracking-[-0.45px] text-ink transition-colors group-hover:text-white md:text-[30px]">
                          {resource.title}
                        </h3>
                        <p className="mt-5 text-[15px] leading-[1.65] text-muted transition-colors group-hover:text-white/70">
                          {resource.description}
                        </p>
                      </div>
                      <Image src={INSIGHTS_RESOURCE_FILES[index].replace(/\.pdf$/, ".webp")} alt={`Cover of ${resource.title}`} width={264} height={374} sizes="132px" className="aspect-[1632/2309] w-full border border-line bg-white object-cover object-top shadow-sm" />
                    </div>

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
              {featuredArticle && <Reveal>
                <article className="group flex h-full min-h-[420px] flex-col border-t-4 border-brand bg-white p-7 transition-colors duration-300 hover:bg-ink md:p-9">
                  <div className="flex items-start justify-between gap-6">
                    <span className="text-[12px] font-semibold tracking-[1.8px] text-brand">{String(copy.thoughtLeadership.resources.length + 1).padStart(2, "0")}</span>
                    <span className="text-[11px] font-semibold uppercase tracking-[1.4px] text-brand transition-colors group-hover:text-brand-light">Article · <time dateTime={featuredArticle.publishedAt}>{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(featuredArticle.publishedAt))}</time> · {featuredArticle.readingMinutes} min read</span>
                  </div>
                  <div className="mt-8 grid grid-cols-[minmax(0,1fr)_96px] items-start gap-6 sm:grid-cols-[minmax(0,1fr)_132px] md:gap-8">
                    <div>
                      <h3 className="font-serif text-[27px] font-semibold leading-[1.08] tracking-[-0.45px] text-ink transition-colors group-hover:text-white md:text-[30px]">{featuredArticle.title}</h3>
                      <p className="mt-5 text-[15px] leading-[1.65] text-muted transition-colors group-hover:text-white/70">Why developing individual leaders is not enough when organisational systems prevent change.</p>
                    </div>
                    <Image src="/insights/systems-awareness-cover.jpg" alt="" width={264} height={374} sizes="132px" className="aspect-[1632/2309] w-full border border-line object-cover shadow-sm" />
                  </div>
                  <div className="mt-auto pt-10">
                    <p className="mb-5 text-[11px] font-semibold uppercase tracking-[1.4px] text-muted transition-colors group-hover:text-white/55">{copy.thoughtLeadership.authorPrefix} {featuredArticle.author}</p>
                    <Link href={`/insights/${featuredArticle.slug}`} className="inline-flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.8px] text-ink transition-colors hover:text-brand group-hover:text-white group-hover:hover:text-brand">
                      Read article <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
                    </Link>
                  </div>
                </article>
              </Reveal>}
            </div>
          </div>
        </section>

        <section id="books" className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-16">
            <TypeLabel>Books</TypeLabel>
            <div className="mt-10 grid gap-8 xl:grid-cols-2 [&_figure]:float-none [&_figure]:mx-auto [&_figure]:w-full [&_figure]:max-w-[270px]">
              <BookCard
                book={rheaBook}
                headingLevel="h2"
                coverShadow={false}
              >
                <BookEndorsements limit={2} />
              </BookCard>
              <BookCard book={restoredBook} headingLevel="h2" coverShadow={false}>
                {/* Same endorsement format as the first book: dash, name, role on its own line. */}
                <BookEndorsements items={[{ quote: "The Restored Organization is all about leading with heart, and vision. It offers practical advice and real-world strategies to help you build a culture that supports well-being, encourages accountability, and fosters continuous growth. If you’re looking to create a workplace where people thrive, this book is your guide.", name: "Piyush Gupta", title: "Ex-CEO, DBS Bank, Chairman - Keppel, Mandai Wildlife Group and SMU" }, { quote: "In a culture that often puts performance over people, The Restored Organization reminds us that genuine progress is fuelled by trust, respect, and authenticity. It’s the perfect guide for leaders who value the human side of work as much as the bottom line.", name: "Dr. Anna A. Tavis", title: "Department Chair, Human Capital Management, New York University" }]} />
              </BookCard>
            </div>
          </div>
        </section>

      </SiteShell>
    </div>
  );
}
