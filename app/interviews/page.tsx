import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo/alternates";
import PagePlaceholder from "@/components/PagePlaceholder";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Interviews — Corporate DNA",
    description:
      "Full client interviews on leadership, culture and transformation with the executives behind Corporate DNA's flagship engagements.",
    alternates: localeAlternates("/interviews"),
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
