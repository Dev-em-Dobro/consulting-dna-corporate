import type { Metadata } from "next";
import CopyEditor from "@/components/copy-editor/CopyEditor";
import { DEFAULT_TEAM_COPY, EDITOR_SECTIONS } from "@/lib/team-copy";
import { getTeamCopy } from "@/lib/team-copy-server";

/**
 * `/edit-team` — a tela em que a cliente edita os textos da Our Team.
 *
 * Sem login, por pedido (23-09). `noindex` e fora do sitemap; o `robots.ts`
 * também a exclui. A copy inicial vem do servidor para a tela abrir já
 * preenchida, sem piscar; o resto (salvar) é o `CopyEditor`, no cliente.
 *
 * ⚠️ NOMES E FOTOS DAS PESSOAS NÃO ESTÃO AQUI, de propósito — ver a caixa em
 * `lib/team-copy.ts`. Dos seis líderes entram cargo, região e a frase.
 */
export const metadata: Metadata = {
  title: "Edit Team page text | Corporate DNA",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditTeamPage() {
  const copy = await getTeamCopy();
  return (
    <CopyEditor
      initial={copy}
      defaults={DEFAULT_TEAM_COPY}
      sections={EDITOR_SECTIONS}
      apiPath="/api/team-copy"
      guideDir="edit-team-guide"
      siteHref="/team"
      title="Team page text"
    />
  );
}
