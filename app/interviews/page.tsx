import type { Metadata } from "next";
import PagePlaceholder from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "Interviews — Corporate DNA",
};

// Page for the full client interviews (linked from the case "Hear the complete
// interview" CTA). Structure to be defined once the interview content is ready.
export default function InterviewsPage() {
  return (
    <PagePlaceholder
      eyebrow="Interviews"
      title="The complete client interviews."
      description="Full-length conversations behind our flagship case studies."
      crumbs={[{ label: "Home", href: "/" }, { label: "Interviews" }]}
    />
  );
}
