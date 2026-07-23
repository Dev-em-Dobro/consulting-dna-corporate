/**
 * Dark hero band used by content pages (Solutions, 5H Framework, …).
 * The sticky red nav sits above it, matching the wireframes.
 */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28">
        {eyebrow && (
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[12.5px] font-semibold uppercase tracking-[2px] text-brand">
              {eyebrow}
            </span>
          </div>
        )}
        <h1 className="max-w-[900px] text-[38px] sm:text-[48px] md:text-[60px] font-bold leading-[1.03] tracking-[-1.5px] text-white [text-wrap:balance]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-[620px] text-lg leading-[1.5] text-white/75 md:text-xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
