import type { Metadata } from "next";
import Link from "next/link";
import CopyEditor from "@/components/copy-editor/CopyEditor";
import { DEFAULT_SERVICES_INDEX_COPY, EDITOR_SECTIONS } from "@/lib/services-index-copy";
import { getServicesIndexCopy } from "@/lib/services-index-copy-server";
import { EDITABLE_SERVICES, SHOW_SERVICE_PAGE_EDITORS } from "@/lib/service-pages-copy";

/**
 * `/edit-services` — a tela da LISTAGEM de serviços.
 *
 * As dez páginas internas têm cada uma a sua, em `/edit-services/<slug>`; a
 * lista delas fica abaixo do editor, porque é daqui que a cliente chega nelas
 * (o índice `/edit` também as lista).
 *
 * ⏸️ ESSA LISTA ESTÁ ESCONDIDA desde 23-09 — ver `SHOW_SERVICE_PAGE_EDITORS`,
 * em `lib/service-pages-copy.ts`, que também diz como trazê-la de volta. As
 * rotas continuam funcionando; o que sai daqui é o caminho até elas.
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
        note={
          SHOW_SERVICE_PAGE_EDITORS
            ? "The ten cards on this page take their name and sub-headline from each service’s own page — edit those below."
            : "The ten cards on this page take their name and sub-headline from each service’s own page — send us those changes for now."
        }
      />
      {/* FORA DO <CopyEditor> de propósito: ele é a tela de um objeto de copy, e
          esta lista não edita nada. Fica depois dele, com o mesmo fundo. */}
      {SHOW_SERVICE_PAGE_EDITORS && (
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
      )}
    </>
  );
}
