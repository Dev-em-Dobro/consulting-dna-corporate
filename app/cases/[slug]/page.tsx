import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import CaseView, { hasStoryModel } from "@/components/views/CaseView";
import { localeAlternates } from "@/lib/seo/alternates";
import { firstDescription } from "@/lib/seo/description";
import { articleLd, breadcrumbLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/JsonLd";
import { getCaseArticle, getCaseCards, getCaseListEntries } from "@/lib/cms/map";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";

export const revalidate = 300;

export async function generateStaticParams() {
  const cases = await getCaseCards();
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCaseArticle(slug);
  const title = c ? `${c.title} — Corporate DNA` : "Case study — Corporate DNA";
  const description = firstDescription([c?.intro]);
  return {
    title,
    description,
    alternates: localeAlternates(`/cases/${slug}`),
    openGraph: {
      title,
      description,
      type: "article",
      ...(c?.coverUrl ? { images: [c.coverUrl] } : {}),
    },
    ...(c?.coverUrl ? { twitter: { images: [c.coverUrl] } } : {}),
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = await getCaseArticle(slug);
  if (!c) notFound();

  /* OS RELACIONADOS DO BLOCO 05, na régua do desenho: *"explore more client
     stories in consumer goods & retail"* — mesma família, não "os dois mais
     recentes". Sem classificação de setor no CMS (`facets.industry` está vazio
     nos quinze), a família disponível é o SERVIÇO, que é a ligação que a
     planilha dela realmente escreve.

     Dois passos, e o segundo importa: primeiro os cases do mesmo serviço; se
     não fecharem dois, completa com os demais. Um bloco "related" que aparece
     com um card só, ou que some quando o serviço é único, dá a impressão de
     biblioteca vazia — e ela não está. */
  const todos = (await getCaseListEntries()).filter((e) => e.slug !== slug);
  const mesmoServico = todos.filter((e) => e.service && e.service === c.story.service);
  const related = [...mesmoServico, ...todos.filter((e) => !mesmoServico.includes(e))]
    .slice(0, 2);

  const jsonLd = [
    breadcrumbLd([
      // "Client Impact" as an area name is retired by the 27-08 brief, which
      // splits it into Our Clients and Our Impact; the library itself keeps its
      // route and is now named for what it holds.
      { name: "Case Studies", path: "/cases" },
      { name: c.title, path: `/cases/${slug}` },
    ]),
    articleLd({
      headline: c.title,
      path: `/cases/${slug}`,
      description: firstDescription([c.intro]),
      image: c.coverUrl,
    }),
  ];

  return (
    /* A FONTE EDITORIAL ENTRA AQUI, como na /about, na /services e na
       Clients & Impact: o layout de 16-09 é serifado nas manchetes, e sem este
       embrulho a página cairia na Poppins do resto do site. */
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      {/* ⚠️ `floatingNav` SÓ NO LAYOUT NOVO. A nav flutuante existe para pousar
          sobre o herói ESCURO de sangria total; nos seis cases antigos o topo é
          branco, e ali ela some — o menu fica branco sobre branco e sobra o logo
          com o botão Contact, que foi exatamente o que apareceu na Shell quando
          a prop entrou para todos. */}
      <SiteShell footerTopBorder floatingNav={hasStoryModel(c)}>
        <JsonLd data={jsonLd} />
        <CaseView c={c} related={related} />
      </SiteShell>
    </div>
  );
}
