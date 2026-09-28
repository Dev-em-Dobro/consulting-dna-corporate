import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import TypeLabel from "@/components/TypeLabel";
import EmptyNotice from "@/components/EmptyNotice";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { getImpactCopy } from "@/lib/impact-copy-server";
import { getCaseListEntries } from "@/lib/cms/map";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getImpactCopy();
  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    alternates: localeAlternates("/our-impact"),
  };
}
export const revalidate = 300;

const TERRAGRN_PHOTOS = Array.from({ length: 10 }, (_, i) =>
  `/impact/terragon/${String(i + 1).padStart(2, "0")}.jpeg`,
);

export default async function OurImpactPage() {
  const [cases, copy] = await Promise.all([getCaseListEntries(), getImpactCopy()]);
  // Only engagements that actually carry a published figure — a proof page that
  // renders blank metrics proves nothing.
  const measured = cases.filter((c) => c.metricValue);

  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
    <SiteShell footerTopBorder floatingNav>
      <SolutionHero
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        subtitle={copy.hero.subtitle}
        imageUrl="/impact/terragon/07.jpeg"
      />

      {/* ── Our clients say: held, not filled (see the file header) ────── */}
      <section id="testimonials" className="bg-brand text-white">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <h2 className="font-serif max-w-[680px] text-[28px] font-semibold leading-[1.15] tracking-[-0.4px] sm:text-[36px] md:text-[40px]">
            {copy.testimonials.heading}
          </h2>
          <p className="mt-6 max-w-[62ch] text-[16px] leading-[1.7] text-white/85">
            {copy.testimonials.body}
          </p>
        </div>
      </section>

      {/* ── Our Social Impact ─────────────────────────────────────────────
          Pulled across from the old site, as in Guli's mock. He deliberately
          did not bring the full copy: "nem vou pegar, porque eles estão falando
          'evitar o scroll em excesso' — e é um textaço" (14:41). This is the
          opening paragraph only, with the carousel treatment he gave the loose
          stills (14:17).

          ⚠️ Old-site copy, not re-approved in this cycle. */}
      <section id="social-impact" className="bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
          <TypeLabel>{copy.social.label}</TypeLabel>
          <h2 className="font-serif mt-4 max-w-[18ch] text-[32px] font-semibold leading-[1.12] tracking-[-0.4px] text-ink sm:text-[40px] md:text-[48px]">
            {copy.social.heading}
          </h2>
          <div className="mt-10 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
            <div className="space-y-5 text-[17px] leading-[1.7] text-muted md:text-[18px]">
              {copy.social.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {TERRAGRN_PHOTOS.map((src, index) => (
                <div
                  key={src}
                  className={`relative overflow-hidden bg-paper ${index === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}
                >
                  <Image
                    src={src}
                    alt="TERRAGRN"
                    fill
                    sizes={index === 0 ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 1024px) 20vw, 50vw"}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Per-engagement results — the mock's "impact stories" ───────── */}
      <section id="results" className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <TypeLabel>{copy.results.label}</TypeLabel>
          <h2 className="font-serif max-w-[680px] text-[28px] font-semibold leading-[1.15] tracking-[-0.4px] text-ink sm:text-[36px] md:text-[40px]">
            {copy.results.heading}
          </h2>

          {measured.length === 0 ? (
            <EmptyNotice className="mt-8">
              {copy.results.empty}
            </EmptyNotice>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {measured.map((c) => (
                <Link
                  key={c.slug}
                  href={`/cases/${c.slug}`}
                  className="group flex flex-col bg-white p-7 transition-colors hover:bg-paper"
                >
                  <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-brand">
                    {c.client}
                  </span>
                  <span className="mt-4 text-[40px] font-bold leading-none tracking-[-1px] text-ink">
                    {c.metricValue}
                  </span>
                  {c.metricLabel && (
                    <span className="mt-3 flex-1 text-[15px] leading-[1.55] text-muted">
                      {c.metricLabel}
                    </span>
                  )}
                  <span className="mt-6 text-[14px] font-semibold text-brand underline underline-offset-4">
                    {copy.results.linkLabel}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

    </SiteShell>
    </div>
  );
}
