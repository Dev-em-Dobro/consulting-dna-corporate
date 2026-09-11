import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionView from "@/components/views/SolutionView";
import { serviceFromSolutionVM } from "@/lib/services";
import InsightView from "@/components/views/InsightView";
import CaseView from "@/components/views/CaseView";
import RegionView from "@/components/views/RegionView";
import { getPreview } from "@/lib/cms/map";

/**
 * Draft preview with the real site design (D5). The CMS admin "Preview" button
 * links here with a short-lived signed token; this route forwards the token to
 * the CMS draft endpoint and renders the draft through the same view components
 * the live pages use. Never indexed, never cached.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Preview — Corporate DNA",
  robots: { index: false, follow: false },
};

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { type, id } = await params;
  const { token } = await searchParams;
  if (!token) notFound();

  const result = await getPreview(type, id, token);
  if (!result) notFound();

  return (
    <SiteShell>
      <div className="bg-amber-400 px-4 py-2 text-center text-xs font-bold uppercase tracking-[1.5px] text-black">
        Preview · draft — not yet published
      </div>
      {/* `serviceFromSolutionVM`: as páginas de serviço saíram do CMS em 11-09
          (ver `lib/services.ts`), então o rascunho precisa ser traduzido para o
          formato novo antes de entrar no mesmo template. */}
      {result.kind === "solution" && (
        <SolutionView service={serviceFromSolutionVM(result.vm)} />
      )}
      {result.kind === "insight" && <InsightView i={result.vm} />}
      {result.kind === "case" && <CaseView c={result.vm} />}
      {result.kind === "region" && (
        <RegionView
          name={result.vm.name}
          city={result.vm.city}
          body={result.vm.body}
        />
      )}
    </SiteShell>
  );
}
