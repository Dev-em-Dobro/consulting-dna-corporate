import type { Metadata } from "next";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import TypeLabel from "@/components/TypeLabel";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { getImpactCopy } from "@/lib/impact-copy-server";

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
  const copy = await getImpactCopy();

  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
    <SiteShell footerTopBorder floatingNav>
      <SolutionHero
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        subtitle={copy.hero.subtitle}
        imageUrl="/impact/terragon/07.jpeg"
      />

      {/* ── Our Social Impact ─────────────────────────────────────────────
          Pulled across from the old site, as in Guli's mock. He deliberately
          did not bring the full copy: "nem vou pegar, porque eles estão falando
          'evitar o scroll em excesso'  -  e é um textaço" (14:41). This is the
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

    </SiteShell>
    </div>
  );
}
