import type { Metadata } from "next";
import Link from "next/link";
import CopyEditor from "@/components/copy-editor/CopyEditor";
import { DEFAULT_SERVICES_INDEX_COPY, EDITOR_SECTIONS } from "@/lib/services-index-copy";
import { getServicesIndexCopy } from "@/lib/services-index-copy-server";
import { EDITABLE_SERVICES } from "@/lib/service-pages-copy";

/**
 * `/edit-services` — a tela da LISTAGEM de serviços.
 *
 * As dez páginas internas têm cada uma a sua, em `/edit-services/<slug>`; a
 * lista delas fica abaixo do editor, porque é daqui que a cliente chega nelas
 * (o índice `/edit` também as lista).
 */
export const metadata: Metadata = {
  title: "Edit Services page text | Corporate DNA",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditServicesPage() {
  const copy = await getServicesIndexCopy();
  return (
    <>
      <CopyEditor
        initial={copy}
        defaults={DEFAULT_SERVICES_INDEX_COPY}
        sections={EDITOR_SECTIONS}
        apiPath="/api/services-index-copy"
        guideDir="edit-services-guide"
        siteHref="/services"
        title="Services page text"
        note="The ten cards on this page take their name and sub-headline from each service’s own page — edit those below."
      />
      {/* FORA DO <CopyEditor> de propósito: ele é a tela de um objeto de copy, e
          esta lista não edita nada. Fica depois dele, com o mesmo fundo. */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1360px] px-6 pb-20">
          <h2 className="text-[17px] font-semibold">The ten service pages</h2>
          <p className="mt-2 max-w-[640px] text-[15px] leading-relaxed text-muted">
            Each one has its own screen, with the text of that page.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {EDITABLE_SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/edit-services/${s.slug}`}
                  className="flex items-baseline justify-between gap-4 border border-line bg-white px-5 py-4 transition-colors hover:border-brand"
                >
                  <span className="text-[15px] font-medium">{s.title}</span>
                  <span aria-hidden className="text-[13px] text-brand">
                    Edit →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
