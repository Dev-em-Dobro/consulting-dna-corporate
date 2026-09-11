import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionView from "@/components/views/SolutionView";
import { localeAlternates } from "@/lib/seo/alternates";
import { serviceLd, breadcrumbLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/JsonLd";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { getService, services } from "@/lib/services";

/**
 * Página de serviço — "one template, ten instances" (outline de 09-09, §3.2).
 *
 * DEIXOU DE LER O CMS em 11-09. O conteúdo agora é `lib/services.ts`, e o porquê
 * está na caixa de abertura daquele arquivo: os dez serviços do outline não
 * existem no CMS (dois são novos, três mudaram de nome, dois saíram) e os campos
 * do bloco 6 também não. Consequência prática aqui: a rota virou estática de
 * verdade — sem `revalidate`, sem fetch, e `generateStaticParams` devolve os dez
 * na hora do build em vez de perguntar ao CMS.
 */
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

/** Toda rota que não está nos dez é 404 — os slugs velhos têm 301 no next.config. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  const title = service ? `${service.title} — Corporate DNA` : "Solution — Corporate DNA";
  return {
    title,
    description: service?.banner,
    alternates: localeAlternates(`/solutions/${slug}`),
    openGraph: { title, description: service?.banner },
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const jsonLd = [
    breadcrumbLd([
      { name: "Solutions", path: "/solutions" },
      { name: service.title, path: `/solutions/${slug}` },
    ]),
    serviceLd({
      name: service.title,
      path: `/solutions/${slug}`,
      description: service.banner,
    }),
  ];

  return (
    /* A TIPOGRAFIA EDITORIAL ENTRA AQUI, e não no `layout.tsx`: as páginas que
       continuam em Poppins não devem baixar fonte que não usam. Ver a caixa de
       comentário em `lib/fonts.ts`.

       Vale para a árvore inteira, incluindo a NavV2 e o SiteFooter, que
       continuam sem saber que existe fonte nova — é a variável que faz o
       trabalho, não uma classe em cada elemento. */
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell footerTopBorder floatingNav>
        <JsonLd data={jsonLd} />
        <SolutionView service={service} />
      </SiteShell>
    </div>
  );
}
