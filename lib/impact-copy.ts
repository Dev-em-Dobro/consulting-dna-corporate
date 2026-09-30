import type { EditorSection } from './page-copy/fields.ts';
import { fieldsForCopy } from './page-copy/structured.ts';

/* Sections and words follow the CorporateDNA × TERRAGRN partnership sheet of
   29-09; colours and type stay the site's own. */
export const DEFAULT_IMPACT_COPY = {
  "metadata": {
    "title": "Our Impact | CorporateDNA",
    "description": "CorporateDNA's partnership with TERRAGRN: restoring landscapes, creating livelihoods and building a more sustainable future in South Africa."
  },
  "hero": {
    "eyebrow": "Our Partnership",
    "title": "People. Planet. Lasting Impact.",
    "body": "Since 2021, CorporateDNA has been committed to being a force for good, partnering with TERRAGRN to restore landscapes, create livelihoods and build a more sustainable future."
  },
  "stats": {
    "items": [
      { "value": "10+", "label": "million trees", "detail": "across 5,000+ hectares in the next 5 years" },
      { "value": "5,000+", "label": "hectares", "detail": "of land" },
      { "value": "Jobs", "label": "& livelihoods", "detail": "for local communities" },
      { "value": "Climate", "label": "action", "detail": "and biodiversity" }
    ]
  },
  "recognition": {
    "label": "Global Recognition",
    "heading": "World Economic Forum UpLink Winner 2026",
    "body": "In 2026, TERRAGRN was named a winner through the World Economic Forum’s UpLink platform, providing global recognition for its approach to building a regenerative economy.",
    "ctaLabel": "Learn more"
  },
  "partnership": {
    "label": "Our Partnership",
    "heading": "A shared commitment to a better future",
    "body": "CorporateDNA is a strategic partner, providing early investment, leadership support and expertise to help accelerate TERRAGRN’s climate and sustainability journey and embed regenerative business models that deliver value for people, nature and the planet."
  },
  "agroforest": {
    "label": "What TERRAGRN is doing in South Africa",
    "heading": "A scalable agroforest for people and planet",
    "paragraphs": [
      "TERRAGRN is leasing land from the local community to plant a sustainable, biodiversity-compliant agroforest of 10+ million trees across 5,000+ hectares of land by 2030.",
      "One-third of the integrated system will be non-invasive varieties of bamboo, while the rest will include fruit trees, cereal crops, indigenous cover crops (intercrops) and indigenous trees, creating a diverse, resilient and productive landscape.",
      "We have a project underway in South Africa. We are also planning, discussing and negotiating other future projects."
    ]
  },
  "model": {
    "label": "Why this partnership matters",
    "heading": "A model for regenerative growth",
    "body": "In Mpumalanga, South Africa, TERRAGRN is pioneering a model for regenerating degraded landscapes by bringing together nature restoration, community livelihoods, commercial value chains and carbon finance within a scalable enterprise.",
    "mapRegion": "Mpumalanga",
    "mapCountry": "South Africa"
  },
  "areas": {
    "label": "Our impact areas",
    "items": [
      { "title": "Ecological Regeneration", "body": "Restoring degraded landscapes and biodiversity." },
      { "title": "Climate & Carbon Sequestration", "body": "Nature-based solutions to accelerate climate action." },
      { "title": "Social Development", "body": "Creating jobs and new economic opportunities for local communities." },
      { "title": "Commercial Value Chains", "body": "Sustainable, scalable business models for long-term impact." }
    ]
  }
};

export type ImpactCopy = typeof DEFAULT_IMPACT_COPY;

export const EDITOR_SECTIONS: EditorSection[] = [
  { "id": "metadata", "title": "Search and browser title", "anchor": "/our-impact" },
  { "id": "hero", "title": "Hero", "anchor": "/our-impact" },
  { "id": "stats", "title": "Four headline figures", "anchor": "/our-impact#figures" },
  { "id": "recognition", "title": "World Economic Forum recognition", "anchor": "/our-impact#recognition" },
  { "id": "partnership", "title": "A shared commitment", "anchor": "/our-impact#recognition" },
  { "id": "agroforest", "title": "The agroforest in South Africa", "anchor": "/our-impact#agroforest" },
  { "id": "model", "title": "A model for regenerative growth", "anchor": "/our-impact#model" },
  { "id": "areas", "title": "Impact areas", "anchor": "/our-impact#areas" }
].map((section) => ({
  id: section.id, title: section.title, anchor: section.anchor,
  fields: fieldsForCopy(DEFAULT_IMPACT_COPY[section.id as keyof ImpactCopy], section.id),
}));
