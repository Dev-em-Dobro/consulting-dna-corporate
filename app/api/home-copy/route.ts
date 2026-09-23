import { homeCopyStore } from "@/lib/home-copy-server";
import { createCopyRoute } from "@/lib/page-copy/route";

/**
 * A API do editor `/edit-home`. O corpo do handler é a fábrica em
 * `lib/page-copy/route.ts`, compartilhada com `/api/about-copy` — inclusive a
 * caixa sobre NÃO HAVER AUTENTICAÇÃO, que continua valendo aqui.
 *
 * Revalida só `/`: a copy da home não alimenta nenhuma outra página.
 */
export const dynamic = "force-dynamic";

export const { GET, POST } = createCopyRoute({
  key: "home",
  store: homeCopyStore,
  revalidate: ["/"],
});
