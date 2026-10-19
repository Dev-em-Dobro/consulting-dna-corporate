import type { EditorSection } from './page-copy/fields.ts';
import { fieldsForCopy } from './page-copy/structured.ts';

export const DEFAULT_INSIGHTS_COPY = {
  "metadata": {
    "title": "Insights | CorporateDNA",
    "description": "Perspectives on leadership, executive-team alignment, succession and enterprise transformation from CorporateDNA's senior advisory faculty."
  },
  "hero": {
    "eyebrow": "Insights",
    "title": "Insights for the moments that shape leadership"
  },
  "thoughtLeadership": {
    "label": "Thought Leadership",
    "heading": "Ideas for the moments that shape leadership.",
    "downloadLabel": "Download PDF",
    "authorPrefix": "By",
    "resources": [
      {
        "title": "Scaling Leadership Without Losing Its Humanity",
        "description": "A founder’s reflection on 19 years of building CorporateDNA, and what it has taught me about leadership, growth and the impact that lasts.",
        "author": "Rhea Leckie",
        "pagesLabel": "6 pages"
      },
      {
        "title": "5 Signals Your Leadership Team May Be Underperforming",
        "description": "A collection of high-performing individuals does not automatically create a high-performing leadership team.",
        "author": "Mike Jackson",
        "pagesLabel": "6 pages"
      },
      {
        "title": "When the Executive Team Changes, the System Changes",
        "description": "A CDNA insight paper on the psychological, social, cultural and identity transitions at the top table.",
        "author": "CorporateDNA Insights",
        "pagesLabel": "9 pages"
      }
    ]
  },
  "library": {
    "label": "Articles",
    "empty": "No insights published yet.",
    "filterLabel": "content",
    "filterAriaLabel": "Filter by content",
    "sortAriaLabel": "Sort by date",
    "newestLabel": "Newest first",
    "oldestLabel": "Oldest first",
    "noMatches": "No insights match your filters."
  }
};

export type InsightsCopy = typeof DEFAULT_INSIGHTS_COPY;

export const EDITOR_SECTIONS: EditorSection[] = [
  {
    "id": "metadata",
    "title": "Search and browser title",
    "anchor": "/insights"
  },
  {
    "id": "hero",
    "title": "Hero",
    "anchor": "/insights"
  },
  {
    "id": "thoughtLeadership",
    "title": "Thought leadership resources",
    "anchor": "/insights#thought-leadership"
  },
  {
    "id": "library",
    "title": "Article library (hidden until the first article is published)",
    "anchor": "/insights"
  }
].map((section) => ({
  id: section.id, title: section.title, anchor: section.anchor,
  fields: fieldsForCopy(DEFAULT_INSIGHTS_COPY[section.id as keyof InsightsCopy], section.id),
}));

export const INSIGHTS_RESOURCE_FILES = [
  "/resources/thought-leadership/scaling-leadership.pdf",
  "/resources/thought-leadership/five-signals-leadership-team.pdf",
  "/resources/thought-leadership/executive-transition.pdf"
];
