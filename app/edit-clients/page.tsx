import type { Metadata } from "next";
import CopyEditor from "@/components/copy-editor/CopyEditor";
import { DEFAULT_CLIENTS_COPY, EDITOR_SECTIONS } from "@/lib/clients-copy";
import { getClientsCopy } from "@/lib/clients-copy-server";

/**
 * `/edit-clients` — a tela da Clients & Impact.
 *
 * ⚠️ OS QUATRO NÚMEROS DA FAIXA ESCURA NÃO ESTÃO AQUI: são os mesmos da About e
 * se editam em `/edit-about`. Ver a caixa em `lib/clients-copy.ts`.
 */
export const metadata: Metadata = {
  title: "Edit Clients & Impact page text | Corporate DNA",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditClientsPage() {
  const copy = await getClientsCopy();
  return (
    <CopyEditor
      initial={copy}
      defaults={DEFAULT_CLIENTS_COPY}
      sections={EDITOR_SECTIONS}
      apiPath="/api/clients-copy"
      guideDir="edit-clients-guide"
      siteHref="/our-clients"
      title="Clients & Impact page text"
      note="The four numbers in the dark band are the same four as on the About page — edit them in About, and both pages change together. The case studies and quotes come from the CMS."
    />
  );
}
