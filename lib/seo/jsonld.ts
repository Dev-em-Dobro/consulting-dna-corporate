import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { offices, type Office } from "@/lib/offices";

/**
 * Structured-data (JSON-LD) builders shared across pages. Each returns a plain
 * object rendered by <JsonLd>. A single, stable @id lets every page reference
 * the same Organization node (publisher/provider) instead of repeating it.
 */

/** Stable node id for the publisher Organization, referenced site-wide. */
export const ORG_ID = `${SITE_URL}/#organization`;

/** Absolute URL for a root-relative path (single published locale = en). */
export const absUrl = (path: string) => `${SITE_URL}${path}`;

function postalAddress(o: Office) {
  return {
    "@type": "PostalAddress",
    streetAddress: o.addressLines.join(", "),
    addressLocality: o.city,
    addressCountry: o.country,
  };
}

/** Enriched Organization: real offices → address + contactPoint per location. */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: `${SITE_URL}/cdna-logo.svg`,
    // TODO: add verified social profiles when available (LinkedIn, X, …):
    // sameAs: ["https://www.linkedin.com/company/..."],
    address: offices.map(postalAddress),
    contactPoint: offices.map((o) => ({
      "@type": "ContactPoint",
      contactType: "sales",
      ...(o.tel ? { telephone: o.tel } : {}),
      email: o.email,
      areaServed: o.country,
      availableLanguage: "English",
    })),
  };
}

/** BreadcrumbList from an ordered list of { name, path } crumbs. */
export function breadcrumbLd(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absUrl(c.path),
    })),
  };
}

export function articleLd(a: {
  headline: string;
  path: string;
  description?: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.headline,
    ...(a.description ? { description: a.description } : {}),
    ...(a.image ? { image: [a.image] } : {}),
    mainEntityOfPage: absUrl(a.path),
    url: absUrl(a.path),
    inLanguage: "en",
    author: a.author ? { "@type": "Person", name: a.author } : { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    ...(a.datePublished ? { datePublished: a.datePublished } : {}),
    ...(a.dateModified ?? a.datePublished
      ? { dateModified: a.dateModified ?? a.datePublished }
      : {}),
  };
}

export function serviceLd(s: {
  name: string;
  path: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    ...(s.description ? { description: s.description } : {}),
    url: absUrl(s.path),
    serviceType: "Leadership advisory & executive coaching",
    provider: { "@id": ORG_ID },
    areaServed: "Worldwide",
  };
}

/**
 * FAQPage — one of the strongest GEO signals: AI engines extract self-contained
 * Q&A verbatim. The `question`/`answer` text MUST also be visible on the page
 * (Google policy), so pair this with a rendered FAQ section.
 */
export function faqLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

/** Person (E-E-A-T / entity signal), e.g. the founder, linked to the Org. */
export function personLd(p: {
  name: string;
  jobTitle?: string;
  path?: string;
  image?: string;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    ...(p.jobTitle ? { jobTitle: p.jobTitle } : {}),
    ...(p.path ? { url: absUrl(p.path) } : {}),
    ...(p.image ? { image: p.image } : {}),
    worksFor: { "@id": ORG_ID },
    ...(p.sameAs?.length ? { sameAs: p.sameAs } : {}),
  };
}

/** Book (the method's companion book). `url` defaults to the canonical /book. */
export function bookLd(b: {
  name: string;
  author: string;
  path?: string;
  description?: string;
  image?: string;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: b.name,
    author: { "@type": "Person", name: b.author },
    ...(b.description ? { description: b.description } : {}),
    ...(b.image ? { image: b.image } : {}),
    url: b.path ? absUrl(b.path) : SITE_URL,
    publisher: { "@id": ORG_ID },
    ...(b.sameAs?.length ? { sameAs: b.sameAs } : {}),
  };
}
