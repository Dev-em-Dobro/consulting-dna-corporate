import type { EditorSection } from './page-copy/fields.ts';
import { fieldsForCopy } from './page-copy/structured.ts';

export const DEFAULT_IMPACT_COPY = {
  "metadata": {
    "title": "Our Impact | CorporateDNA",
    "description": "The measured outcomes of CorporateDNA's work, from individual client engagements to social impact."
  },
  "hero": {
    "eyebrow": "Our Impact",
    "title": "Leadership change, measured where it matters.",
    "subtitle": "The results behind individual engagements, and our wider social impact."
  },
  "testimonials": {
    "heading": "Our clients say",
    "body": "Awaiting testimonials about CorporateDNA, in the John Murphy / Jorge Gardino mould, rather than generic corporate quotes, each approved by CDNA before publishing."
  },
  "social": {
    "label": "Our Social Impact",
    "heading": "TERRAGRN",
    "paragraphs": [
      "CorporateDNA is committed to being a force for good in the world. Our mission is to make transformative impact through humanity, honesty, and purpose. In acting on our deeply held values of social awareness, sustainability, and boldness, we have partnered with TERRAGRN, an organization dedicated to sustainable community-led agroforestry.",
      "CorporateDNA is honored to be a part of TERRAGRN’s mission for climate action, sustainability, and community-centric economic development. As of 2022, Rhea Leckie, CorporateDNA’s CEO & Founder, has joined TERRAGRN as a Strategic Advisor and Board Member. CorporateDNA is a strategic partner in developing and accelerating TERRAGRN’s climate and sustainability journey, committed to finance support and embed regenerative business models to help TERRAGRN achieve breakthrough results and greatness, in service of the extensive good of its goals and impact.",
      "CorporateDNA Consulting is proud backing an enterprise that demonstrates what extraordinary leadership and pathbreaking thinking can achieve when applied to some of the world’s most complex challenges. In Mpumalanga, South Africa, TERRAGRN is pioneering a model for regenerating degraded landscapes by bringing together nature restoration, community livelihoods, commercial value chains and carbon finance within a scalable enterprise.",
      "What began as a bold idea is now delivering tangible results on the ground, creating jobs, developing new economic opportunities and restoring productive landscapes in partnership with local communities. In 2026, TERRAGRN was named a winner through the World Economic Forum’s UpLink platform, providing global recognition for its approach to building a regenerative economy.",
      "For CorporateDNA, TERRAGRN represents the kind of leadership we believe creates sustained growth: the courage to challenge conventional models, the ability to turn pathbreaking ideas into execution, and the vision to create enduring value for business, society and nature. Our early investment reflects our commitment to backing extraordinary leaders and ideas with the potential to shape what comes next."
    ]
  },
  "results": {
    "label": "Measured outcomes",
    "heading": "What changed, per engagement.",
    "empty": "No published case carries a measured result yet, the figures appear here as cases are authored.",
    "linkLabel": "Read the case"
  }
};

export type ImpactCopy = typeof DEFAULT_IMPACT_COPY;

export const EDITOR_SECTIONS: EditorSection[] = [
  {
    "id": "metadata",
    "title": "Search and browser title",
    "anchor": "/our-impact"
  },
  {
    "id": "hero",
    "title": "Hero",
    "anchor": "/our-impact"
  },
  {
    "id": "testimonials",
    "title": "Client testimonials",
    "anchor": "/our-impact#testimonials"
  },
  {
    "id": "social",
    "title": "TERRAGRN social impact",
    "anchor": "/our-impact#social-impact"
  },
  {
    "id": "results",
    "title": "Measured outcomes",
    "anchor": "/our-impact#results"
  }
].map((section) => ({
  id: section.id, title: section.title, anchor: section.anchor,
  fields: fieldsForCopy(DEFAULT_IMPACT_COPY[section.id as keyof ImpactCopy], section.id),
}));
