import type { Metadata } from "next";
import CopyEditor from "@/components/copy-editor/CopyEditor";
import { DEFAULT_HOME_COPY, EDITOR_SECTIONS } from "@/lib/home-copy";
import { getHomeCopy } from "@/lib/home-copy-server";

/**
 * `/edit-home` — a tela em que a cliente edita os textos da home.
 *
 * Sem login, por pedido (23-09). `noindex` e fora do sitemap; o `robots.ts`
 * também a exclui. A copy inicial vem do servidor para a tela abrir já
 * preenchida, sem piscar; o resto (salvar) é o `CopyEditor`, no cliente.
 */
export const metadata: Metadata = {
  title: "Edit home page text | Corporate DNA",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditHomePage() {
  const copy = await getHomeCopy();
  return (
    <CopyEditor
      initial={copy}
      defaults={DEFAULT_HOME_COPY}
      sections={EDITOR_SECTIONS}
      apiPath="/api/home-copy"
      guideDir="edit-home-guide"
      siteHref="/"
      title="Home page text"
    />
  );
}
