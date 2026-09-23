import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo/alternates";
import PagePlaceholder from "@/components/PagePlaceholder";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Interviews | CorporateDNA",
    description:
      "Full client interviews on leadership, culture and transformation with the executives behind CorporateDNA's flagship engagements.",
    alternates: localeAlternates("/interviews"),
    // Placeholder page: it is linked from the case "Hear the complete interview"
    // CTA, so it must resolve, but a thin page with no interviews on it should
    // not be indexed. Drop this once the interview content lands (and add the
    // route to app/sitemap.ts at the same time).
    robots: { index: false, follow: true },
  };
}

// Page for the full client interviews (linked from the case "Hear the complete
// interview" CTA). Structure to be defined once the interview content is ready.
export default async function InterviewsPage() {
  return (
    <PagePlaceholder
      eyebrow="Interviews"
      title="The complete client interviews."
      description="Full-length conversations behind our flagship case studies."
      crumbs={[{ label: "Home", href: "/" }, { label: "Interviews" }]}
    />
  );
}
