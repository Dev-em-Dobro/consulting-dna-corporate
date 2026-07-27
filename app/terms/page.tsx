import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo/alternates";
import LegalView from "@/components/views/LegalView";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Terms of Service — Corporate DNA",
    description:
      "The terms governing your use of the Corporate DNA Consulting website.",
    alternates: localeAlternates("/terms"),
  };
}
export const revalidate = 300;

export default async function TermsPage() {
  return (
    <LegalView cmsKey="terms" eyebrow="Terms" fallbackTitle="Terms of Service" />
  );
}
