import type { Metadata } from "next";
import HomeEditor from "@/components/home-editor/HomeEditor";
import { getHomeCopy } from "@/lib/home-copy-server";

/**
 * `/edit-home` — a tela em que a cliente edita os textos da home.
 *
 * Sem login, por pedido (23-09). `noindex` e fora do sitemap; o `robots.ts`
 * também a exclui. A copy inicial vem do servidor para a tela abrir já
 * preenchida, sem piscar; o resto (salvar) é o `HomeEditor`, no cliente.
 */
export const metadata: Metadata = {
  title: "Edit home page text | Corporate DNA",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditHomePage() {
  const copy = await getHomeCopy();
  return <HomeEditor initial={copy} />;
}
