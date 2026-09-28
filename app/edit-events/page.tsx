import type { Metadata } from "next";
import CopyEditor from "@/components/copy-editor/CopyEditor";
import { DEFAULT_EVENTS_COPY, EDITOR_SECTIONS } from "@/lib/events-copy";
import { getEventsCopy } from "@/lib/events-copy-server";

export const metadata: Metadata = {
  title: "Edit Events page text | Corporate DNA",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function EditEventsPage() {
  const copy = await getEventsCopy();
  return (
    <CopyEditor
      initial={copy}
      defaults={DEFAULT_EVENTS_COPY}
      sections={EDITOR_SECTIONS}
      apiPath="/api/events-copy"
      siteHref="/events"
      title="Events page text"
      note="Edit the upcoming events notice here. Past events stay in the page until a new programme is supplied."
    />
  );
}
