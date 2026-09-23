import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CopyEditor from "@/components/copy-editor/CopyEditor";
import {
  DEFAULT_SERVICE_PAGES_COPY,
  EDITABLE_SERVICES,
  sectionsFor,
} from "@/lib/service-pages-copy";
import { getServicePagesCopy } from "@/lib/service-pages-copy-server";

/**
 * `/edit-services/<serviço>` — uma tela por serviço.
 *
 * SÃO DEZ TELAS E UM OBJETO SÓ: cada uma mostra os campos daquele slug e salva
 * a copy das dez de volta. Ver a caixa em `lib/service-pages-copy.ts`.
 *
 * ⚠️ SEM PRINT DO GUIA aqui (`guideDir` ausente) — decidido com o cliente em
 * 23-09: o template das dez é o mesmo, e o "See on site ↗" de cada seção abre a
 * página real.
 *
 * Sem login, `noindex`, fora do sitemap e bloqueada no `robots.ts`, como as
 * outras telas de edição.
 */
export const metadata: Metadata = {
  title: "Edit service page text | Corporate DNA",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
/* ⚠️ `dynamicParams = false` para um slug inventado cair em 404 em vez de abrir
   um editor vazio que salvaria uma chave que nenhuma página lê. */
export const dynamicParams = false;

export function generateStaticParams() {
  return EDITABLE_SERVICES.map((s) => ({ slug: s.slug }));
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sections = sectionsFor(slug);
  if (!sections.length) notFound();
  const copy = await getServicePagesCopy();
  const name = copy.bySlug[slug]?.title ?? slug;

  return (
    <CopyEditor
      initial={copy}
      defaults={DEFAULT_SERVICE_PAGES_COPY}
      sections={sections}
      apiPath="/api/service-pages-copy"
      siteHref={`/services/${slug}`}
      title={`${name} — page text`}
      note="This service’s name and sub-headline also appear on its card on the Services page and in “Related services” at the foot of the other service pages."
    />
  );
}
