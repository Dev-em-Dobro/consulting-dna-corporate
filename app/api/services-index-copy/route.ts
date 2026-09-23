import { servicesIndexCopyStore } from "@/lib/services-index-copy-server";
import { createCopyRoute } from "@/lib/page-copy/route";

/** A API da tela `/edit-services`. Revalida só a listagem. */
export const dynamic = "force-dynamic";

export const { GET, POST } = createCopyRoute({
  key: "services-index",
  store: servicesIndexCopyStore,
  revalidate: ["/services"],
});
