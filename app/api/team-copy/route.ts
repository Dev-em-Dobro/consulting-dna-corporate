import { teamCopyStore } from "@/lib/team-copy-server";
import { createCopyRoute } from "@/lib/page-copy/route";

/**
 * A API do editor `/edit-team`. O corpo do handler é a fábrica em
 * `lib/page-copy/route.ts`, compartilhada com `/api/home-copy` e
 * `/api/about-copy` — inclusive a caixa sobre NÃO HAVER AUTENTICAÇÃO.
 *
 * Revalida só `/team`: nenhuma outra página lê esta copy. (A About tem o bloco
 * "The people behind it", mas ele tem texto próprio, em `lib/about-copy.ts`.)
 */
export const dynamic = "force-dynamic";

export const { GET, POST } = createCopyRoute({
  key: "team",
  store: teamCopyStore,
  revalidate: ["/team"],
});
