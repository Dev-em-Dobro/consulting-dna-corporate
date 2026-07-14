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

export default function Home() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <div className="mx-auto flex min-h-screen max-w-[1100px] flex-col justify-center px-10 py-24">
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
      </div>
    </main>
  );
}
