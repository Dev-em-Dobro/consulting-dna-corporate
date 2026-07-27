import Link from "next/link";
import { siteNav } from "@/lib/nav";

// Footer primary links come from the single nav source (lib/nav.ts) so the
// footer and header menu never drift apart (FR-411). Top-level items that have
// their own route are shown; menu-only parents without an href are skipped.
const mainLinks = siteNav
  .filter((item): item is { label: string; href: string } => typeof item.href === "string")
  .map((item) => ({ label: item.label, href: item.href }));

const utilityLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Terms of Service", href: "/terms" },
];

export default function SiteFooter({ topBorder = false }: { topBorder?: boolean }) {
  return (
    <footer className={`bg-white text-ink${topBorder ? " border-t-2 border-brand" : ""}`}>
      <div className="mx-auto grid max-w-[1200px] grid-cols-[auto_1fr] gap-6 px-6 py-16 sm:gap-20 md:px-10">
        <Link href="/" className="flex h-fit flex-none items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cdna-logo.svg"
            alt="Corporate DNA Consulting"
            className="h-16 w-auto"
          />
        </Link>

        <nav className="flex justify-end">
          <div className="flex flex-col items-start gap-8 text-left sm:flex-row sm:gap-16">
          <div className="flex flex-col gap-3.5">
            {mainLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[13px] font-semibold uppercase tracking-[1.5px] text-ink/80 transition-colors hover:text-brand"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <span
            aria-hidden="true"
            className="h-px w-[35%] self-start bg-brand sm:h-auto sm:w-px sm:self-stretch"
          />
          <div className="flex flex-col gap-3.5">
            {utilityLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[13px] font-semibold uppercase tracking-[1.5px] text-brand transition-colors hover:text-brand-dark"
              >
                {l.label}
              </Link>
            ))}
          </div>
          </div>
        </nav>
      </div>

      <div className="bg-ink py-6 text-center">
        <span className="text-[15px] font-medium tracking-[3px] text-white/70">
          Making Leadership Real
        </span>
      </div>
    </footer>
  );
}
