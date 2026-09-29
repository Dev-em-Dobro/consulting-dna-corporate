import Link from "next/link";
import SiteShell from "@/components/SiteShell";

export type Crumb = { label: string; href?: string };

/**
 * Shared shell for the scaffolded routes. Renders the site chrome (nav + footer)
 * and an empty, brand-consistent hero. The actual page structure is added later —
 * pass `children` to drop real content in once the layout is defined.
 */
export default function PagePlaceholder({
  eyebrow,
  title,
  description,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <SiteShell>
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-24">
            {crumbs && crumbs.length > 0 && (
              <nav
                aria-label="Breadcrumb"
                className="mb-6 flex flex-wrap items-center gap-2 text-[12.5px] font-medium text-muted"
              >
                {crumbs.map((c, i) => (
                  <span key={c.label} className="flex items-center gap-2">
                    {c.href ? (
                      <Link href={c.href} className="hover:text-brand">
                        {c.label}
                      </Link>
                    ) : (
                      <span className="text-ink/70">{c.label}</span>
                    )}
                    {i < crumbs.length - 1 && (
                      <span className="text-ink/25">/</span>
                    )}
                  </span>
                ))}
              </nav>
            )}

            <div className="mb-2.5 flex items-baseline gap-3">
              <span className="inline-block h-0.5 w-9 bg-brand" />
              <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">
                {eyebrow}
              </span>
            </div>
            <h1 className="mb-4 max-w-[820px] text-[32px] sm:text-[38px] md:text-[46px] font-bold leading-[1.08] tracking-[-1px] text-ink">
              {title}
            </h1>
            {description && (
              <p className="max-w-[640px] text-lg leading-[1.55] text-muted">
                {description}
              </p>
            )}

            {children ? (
              <div className="mt-14">{children}</div>
            ) : (
              <div className="mt-14 flex items-center gap-4 border border-dashed border-line bg-paper/60 px-7 py-8 text-[13.5px] text-muted">
                <span className="inline-block h-2 w-2 flex-none rounded-full bg-brand" />
                Page structure to be defined, content coming next.
              </div>
            )}
        </div>
      </section>
    </SiteShell>
  );
}
