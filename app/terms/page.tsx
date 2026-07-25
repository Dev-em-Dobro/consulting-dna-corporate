import type { Metadata } from "next";
import LegalView from "@/components/views/LegalView";

export const metadata: Metadata = { title: "Terms of Service — Corporate DNA", alternates: { canonical: "/terms" } };
export const revalidate = 300;

export default function TermsPage() {
  return (
    <LegalView cmsKey="terms" eyebrow="Terms" fallbackTitle="Terms of Service" />
  );
}
