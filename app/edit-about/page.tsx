import type { Metadata } from "next";
import CopyEditor from "@/components/copy-editor/CopyEditor";
import { DEFAULT_ABOUT_COPY, EDITOR_SECTIONS } from "@/lib/about-copy";
import { getAboutCopy } from "@/lib/about-copy-server";

/**
 * `/edit-about` — a tela em que a cliente edita os textos da About.
 *
 * Sem login, por pedido (23-09). `noindex` e fora do sitemap; o `robots.ts`
 * também a exclui. A copy inicial vem do servidor para a tela abrir já
 * preenchida, sem piscar; o resto (salvar) é o `CopyEditor`, no cliente.
 *
 * ⚠️ O QUE SE SALVA AQUI TAMBÉM MUDA A `/our-clients`: os quatro números da
 * seção "The four numbers" são os mesmos da faixa "By the numbers" de lá. Isso
 * é de propósito — ver `lib/about-copy.ts`.
 */
export const metadata: Metadata = {
  title: "Edit About page text | Corporate DNA",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditAboutPage() {
  const copy = await getAboutCopy();
  return (
    <CopyEditor
      initial={copy}
      defaults={DEFAULT_ABOUT_COPY}
      sections={EDITOR_SECTIONS}
      apiPath="/api/about-copy"
      guideDir="edit-about-guide"
      siteHref="/about"
      title="About page text"
    />
  );
}
