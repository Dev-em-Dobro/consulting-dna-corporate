import { eventsCopyStore } from "@/lib/events-copy-server";
import { createCopyRoute } from "@/lib/page-copy/route";

export const dynamic = "force-dynamic";
export const { GET, POST } = createCopyRoute({
  key: "events",
  store: eventsCopyStore,
  revalidate: ["/events"],
});
