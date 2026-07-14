import Link from "next/link";

const versions = [
  {
    href: "/v1",
    tag: "Version 1",
    title: "Bold & Red",
    desc: "Full-brand layout with a red navigation, dark credibility band and the 5H framework on a dark canvas.",
    accent: "#d84339",
  },
  {
    href: "/v2",
    tag: "Version 2",
    title: "Clean & Editorial",
    desc: "Split hero, light navigation and an airier editorial layout with sticky rails and generous whitespace.",
    accent: "#373234",
  },
];

const changes = [
  {
    label: "Positioning",
    before: "A menu of seven equal-weight training offers.",
    after: "A global leadership advisory & executive coaching firm.",
  },
  {
    label: "Navigation",
    before: "Company-led — Identity, Services (7 sub-services), Approach, News…",
    after: "Buyer-led — What We Solve, Executive Coaching, Our Approach, Client Impact…",
  },
  {
    label: "Homepage sequence",
    before: "Competing messages and pathways.",
    after: "Category → problem → method → people → proof → next step. Eight sections, each doing one job.",
  },
  {
    label: "Proof",
    before: "Impressive, but buried further down the page.",
    after: "Within the first two screens — stats, logos, a testimonial and the Heineken / Frasers / Shell cases.",
  },
  {
    label: "Contact",
    before: "A nine-field form with generic CTAs.",
    after: "Four fields and a human button — “Start a confidential conversation”.",
  },
  {
    label: "Visual system",
    before: "No disciplined premium system (4.5/10).",
    after: "One palette, Poppins throughout, generous whitespace and a consistent grid.",
  },
  {
    label: "Facts & copy",
    before: "Conflicting figures (60/62/65/75 faculty, 25 vs 36 countries) and grammar slips.",
    after: "One canonical set — 18 · 36 · 75 · 70+ · 1,000+ · 90% — and clean, consistent British English.",
  },
];

const notes = [
  {
    title: "Motion",
    body: "More animation than the audit's “restraint” — but all of it respects prefers-reduced-motion, with no layout shift.",
  },
  {
    title: "People & photography",
    body: "Named leaders, real headshots, approved logos and one named testimonial are still to be added (currently placeholders).",
  },
  {
    title: "Out of scope",
    body: "The urgent search/security issue lives on the old WordPress site — a separate ops task, not part of this Next.js build.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <div className="mx-auto max-w-[1100px] px-10">
        <section className="flex min-h-screen flex-col justify-center py-24">
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[12.5px] font-semibold uppercase tracking-[2px] text-white/70">
              Corporate DNA · Homepage designs
            </span>
          </div>
          <h1 className="mb-4 max-w-[760px] text-5xl font-bold leading-[1.05] tracking-[-1.2px] text-white">
            Two homepage versions. <span className="text-brand">Pick one.</span>
          </h1>
          <p className="mb-14 max-w-[560px] text-lg leading-relaxed text-white/75">
            Both are the same content and brand — presented through two distinct
            design directions. Open each to compare.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {versions.map((v) => (
              <Link
                key={v.href}
                href={v.href}
                className="group relative flex flex-col justify-between overflow-hidden border border-white/15 bg-ink-2 p-9 transition-colors hover:border-white/40"
              >
                <span
                  className="absolute left-0 top-0 h-1 w-full"
                  style={{ background: v.accent }}
                />
                <div>
                  <div className="mb-5 text-[12px] font-semibold uppercase tracking-[2px] text-brand">
                    {v.tag}
                  </div>
                  <h2 className="mb-3 text-2xl font-bold tracking-[-0.4px] text-white">
                    {v.title}
                  </h2>
                  <p className="text-[15px] leading-relaxed text-white/70">
                    {v.desc}
                  </p>
                </div>
                <div className="mt-8 text-[13px] font-bold uppercase tracking-[0.5px] text-white transition-transform group-hover:translate-x-1">
                  View {v.tag} →
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-24">
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[12.5px] font-semibold uppercase tracking-[2px] text-white/70">
              What changed · V1 against the audit
            </span>
          </div>
          <h2 className="mb-4 max-w-[760px] text-4xl font-bold leading-[1.1] tracking-[-1px] text-white">
            Rebuilt against the July 2026 website audit.
          </h2>
          <p className="mb-14 max-w-[640px] text-lg leading-relaxed text-white/75">
            The audit's verdict:{" "}
            <span className="text-white">
              “Corporate DNA is a much stronger firm than the current website
              makes it appear.”
            </span>{" "}
            The gap was positioning, hierarchy, editing and proof placement — not
            technology. V1 executes that fix, moving the homepage from roughly
            <span className="text-white"> 4.5/10</span> toward its
            <span className="text-brand"> 8/10+</span> potential.
          </p>

          <div className="grid gap-5">
            {changes.map((c) => (
              <div
                key={c.label}
                className="border border-white/12 bg-ink-2 p-7"
              >
                <div className="mb-5 text-[12px] font-semibold uppercase tracking-[2px] text-brand">
                  {c.label}
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[1.5px] text-white/40">
                      Before
                    </div>
                    <p className="text-[15px] leading-relaxed text-white/55 line-through decoration-white/20">
                      {c.before}
                    </p>
                  </div>
                  <div>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[1.5px] text-brand">
                      In V1
                    </div>
                    <p className="text-[15px] leading-relaxed text-white/85">
                      {c.after}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <div className="mb-6 text-[12px] font-semibold uppercase tracking-[2px] text-white/50">
              Known caveats & what's next
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {notes.map((n) => (
                <div
                  key={n.title}
                  className="border-l-2 border-brand/60 bg-white/[0.03] px-5 py-4"
                >
                  <div className="mb-2 text-[14px] font-bold text-white">
                    {n.title}
                  </div>
                  <p className="text-[13.5px] leading-relaxed text-white/60">
                    {n.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
