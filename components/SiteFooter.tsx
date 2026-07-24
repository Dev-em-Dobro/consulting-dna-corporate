import Link from "next/link";

const mainLinks = [
  { label: "What we solve", href: "/#solve" },
  { label: "Our approach", href: "/#approach" },
  { label: "Our people", href: "/#people" },
  { label: "Executive coaching", href: "/solutions/executive-coaching" },
  { label: "Client impact", href: "/#impact" },
  { label: "Insights", href: "/insights" },
];

const utilityLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Terms of Service", href: "/terms" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-white text-ink">
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
