import { clientsCopyStore } from "@/lib/clients-copy-server";
import { createCopyRoute } from "@/lib/page-copy/route";

/** A API da tela `/edit-clients`. Revalida só a Clients & Impact. */
export const dynamic = "force-dynamic";

export const { GET, POST } = createCopyRoute({
  key: "clients",
  store: clientsCopyStore,
  revalidate: ["/our-clients"],
});
