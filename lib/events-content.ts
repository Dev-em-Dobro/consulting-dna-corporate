import "server-only";
import { getList } from "@/lib/cms/client";
import { events as staticEvents, type LeadershipEvent } from "@/lib/events";

type CmsEvent = Record<string, unknown>;

function text(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function mapEvent(item: CmsEvent): LeadershipEvent | null {
  const slug = text(item.slug);
  const title = text(item.title);
  const category = text(item.category);
  const kind = text(item.kind);
  const dateLabel = text(item.dateLabel);
  if (!slug || !title || !category || !kind || !dateLabel) return null;

  const links = Array.isArray(item.links)
    ? item.links.flatMap((value) => {
        if (!value || typeof value !== "object") return [];
        const link = value as Record<string, unknown>;
        return typeof link.label === "string" && typeof link.href === "string"
          ? [{ label: link.label, href: link.href }]
          : [];
      })
    : [];

  return {
    slug,
    title,
    category,
    kind: item.status === "past" ? "Speaker event" : kind,
    dateLabel,
    location: text(item.location) || undefined,
    summary: text(item.summary) ?? "",
    overview: strings(item.overview),
    topics: strings(item.topics),
    image: text(item.imageUrl) || undefined,
    imageAlt: text(item.imageAlt) || undefined,
    gallery: staticEvents.find((event) => event.slug === slug)?.gallery,
    links,
    status: item.status === "past" ? "past" : "upcoming",
    featured: item.featured === true,
  };
}

export async function getEvents(): Promise<LeadershipEvent[]> {
  const result = await getList<CmsEvent>("events", { pageSize: 100 });
  const managed = result?.items.map(mapEvent).filter((event): event is LeadershipEvent => event !== null) ?? [];
  if (managed.length === 0) return staticEvents;

  const staticBySlug = new Map(staticEvents.map((event) => [event.slug, event]));
  const merged = managed.map((event) => {
    const local = staticBySlug.get(event.slug);
    if (!local) return event;
    return {
      ...event,
      summary: event.summary || local.summary,
      location: event.location || local.location,
      image: event.image || local.image,
      imageAlt: event.imageAlt || local.imageAlt,
      overview: event.overview.length > 0 ? event.overview : local.overview,
    };
  });
  const seen = new Set(merged.map((event) => event.slug));
  return [...staticEvents.filter((event) => !seen.has(event.slug)), ...merged];
}

export async function getEvent(slug: string): Promise<LeadershipEvent | undefined> {
  return (await getEvents()).find((event) => event.slug === slug);
}
