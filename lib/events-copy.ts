import type { EditorSection } from "./page-copy/fields.ts";
import { fieldsForCopy } from "./page-copy/structured.ts";

export const DEFAULT_EVENTS_COPY = {
  upcoming: {
    label: "What's next",
    heading: "Upcoming events",
    body: "Upcoming events to be posted here",
  },
};

export type EventsCopy = typeof DEFAULT_EVENTS_COPY;

export const EDITOR_SECTIONS: EditorSection[] = [
  {
    id: "upcoming",
    title: "Upcoming events",
    anchor: "/events#upcoming-events",
  },
].map((section) => ({
  id: section.id,
  title: section.title,
  anchor: section.anchor,
  fields: fieldsForCopy(DEFAULT_EVENTS_COPY[section.id as keyof EventsCopy], section.id),
}));
