import type { Metadata } from "next";
import LegalView from "@/components/views/LegalView";

export const metadata: Metadata = { title: "Privacy Policy — Corporate DNA", alternates: { canonical: "/privacy" } };
export const revalidate = 300;

export default function PrivacyPage() {
  return (
    <LegalView cmsKey="privacy" eyebrow="Privacy" fallbackTitle="Privacy Policy" />
  );
}
