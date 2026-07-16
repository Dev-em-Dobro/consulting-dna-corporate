import Image from "next/image";
import Link from "next/link";
import wordmark from "@/public/cdna-logo-text-white.png";
import logo from "@/public/logo.jpg";
import methodology from "@/public/5H-methodology.jpg";
import HeroV2 from "@/components/HeroV2";
import NavV2 from "@/components/NavV2";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import Counter from "@/components/Counter";

const navItems = [
  { label: "What We Solve", href: "#solve" },
  { label: "Executive Coaching", href: "#solve" },
  { label: "Our Approach", href: "#approach" },
  { label: "Client Impact", href: "#impact" },
  { label: "Our People", href: "#people" },
  { label: "Insights", href: "#solve" },
];

const clientLogos = ["Heineken", "Shell", "Frasers Property", "GSK", "Harvard", "Imperial"];

const challenges = [
  { num: "01", title: "CEO & executive performance", body: "Support for new and established CEOs and C-suite leaders navigating transitions, first 100 days and sustained top-team pressure." },
  { num: "02", title: "Executive-team alignment", body: "Aligning senior teams behind strategy so decisions move faster and the organisation feels one coherent leadership voice." },
  { num: "03", title: "Leadership succession & talent", body: "Building credible successors and the enterprise leadership pipeline before the seat, not after the gap appears." },
  { num: "04", title: "Enterprise transformation & culture", body: "Closing the gap when transformation is moving faster than leadership capability and culture can currently sustain." },
];

const differentiators = [
  { n: "1", title: "Identity and habits, not skills alone", body: "We change how leaders think and behave under pressure, so improvement holds long after the programme ends." },
  { n: "2", title: "High-stakes, senior-level experience", body: "Advisors trusted at board and C-suite level in genuinely high-stakes conversations." },
  { n: "3", title: "Proprietary 5H & DNA 360 method", body: "A rigorous, measurable framework — not a generic coaching approach borrowed from elsewhere." },
  { n: "4", title: "Global insight, local delivery", body: "A 75-strong faculty delivering consistently across 36 countries, tuned to regional context." },
];

const cases = [
  { client: "Heineken", sector: "FMCG", challenge: "Accelerate the readiness and advancement of high-potential leaders across the group.", metric: "45%", metricLabel: "higher promotion rate for programme participants" },
  { client: "Frasers Property", sector: "Real estate", challenge: "Retain critical leadership talent through a period of strategic change.", metric: "85%", metricLabel: "talent retention among participating leaders" },
  { client: "Shell", sector: "Energy", challenge: "Scale women's leadership development across a global engineering workforce.", metric: "2,582", metricLabel: "women leaders impacted across the programme" },
];

const people = [
  { name: "Leadership Advisor", role: "Founder & Senior Partner" },
  { name: "Leadership Advisor", role: "Partner, Executive Coaching" },
  { name: "Leadership Advisor", role: "Partner, Enterprise Transformation" },
  { name: "Leadership Advisor", role: "Head of Global Faculty" },
];

const formFields = [
  { label: "Name", placeholder: "Your full name", type: "text", autoComplete: "name" },
  { label: "Work email", placeholder: "name@company.com", type: "email", autoComplete: "email" },
  { label: "Organisation", placeholder: "Company name", type: "text", autoComplete: "organization" },
];

export default function V2() {
  return (
    <div className="w-full overflow-x-hidden bg-white">
      {/* NAV (light, responsive) */}
      <NavV2 navItems={navItems} />

      {/* HERO (split) */}
      <HeroV2 />

      {/* LOGOS */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-5 px-6 sm:px-8 md:px-11 py-11">
          <span className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a8a29d]">
            Trusted by leadership teams at
          </span>
          <Marquee
            items={clientLogos}
            itemClassName="text-xl font-bold tracking-[0.5px] text-[#c3bdb8]"
          />
        </div>
      </section>

      {/* WHAT WE SOLVE (rail + list) */}
      <section id="solve" className="bg-white">
        <Reveal className="mx-auto grid max-w-[1240px] grid-cols-1 items-start gap-8 px-6 py-16 sm:px-8 md:grid-cols-[300px_1fr] md:gap-16 md:px-11 md:py-[104px]">
          <div className="md:sticky md:top-[110px]">
            <div className="mb-[18px] text-[12.5px] font-semibold uppercase tracking-[2px] text-brand">What we solve</div>
            <h2 className="text-[27px] font-bold leading-[1.15] tracking-[-0.6px] text-ink sm:text-[30px] md:text-[34px] md:leading-[1.12]">
              The high-stakes challenges facing the enterprise.
            </h2>
          </div>
          <div>
            {challenges.map((ch) => (
              <div key={ch.num} className="grid grid-cols-[64px_1fr] gap-6 border-t border-line py-[34px] hover:bg-[#fafafa]">
                <div className="text-base font-bold tracking-[1px] text-brand">{ch.num}</div>
                <div>
                  <h3 className="mb-2.5 text-[23px] font-semibold tracking-[-0.3px] text-ink">{ch.title}</h3>
                  <p className="max-w-[620px] text-base leading-[1.6] text-[#4a4548]">{ch.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* WHY CDNA (dark band) */}
      <section className="bg-ink text-white">
        <Reveal className="mx-auto max-w-[1240px] px-6 sm:px-8 md:px-11 py-16 md:py-[104px]">
          <div className="mb-3 flex items-baseline gap-3">
            <span className="inline-block h-0.5 w-[34px] bg-brand" />
            <span className="text-[12.5px] font-semibold uppercase tracking-[2px] text-white/70">Why Corporate DNA</span>
          </div>
          <h2 className="mb-12 max-w-[780px] text-[30px] sm:text-[34px] md:mb-14 md:text-[38px] font-bold leading-[1.1] tracking-[-0.7px] text-white">
            Four reasons senior teams choose us over a coaching directory.
          </h2>
          <div className="grid grid-cols-1 gap-px border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((d) => (
              <div key={d.n} className="bg-ink px-7 py-9">
                <div className="mb-[22px] text-[34px] font-bold leading-none text-brand">{d.n}</div>
                <h3 className="mb-2.5 text-[19px] font-semibold leading-[1.25] tracking-[-0.2px] text-white">{d.title}</h3>
                <p className="text-[15px] leading-[1.6] text-white/75">{d.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-paper">
        <Reveal className="mx-auto max-w-[960px] px-6 py-16 text-center sm:px-8 md:px-11 md:py-24">
          <div className="h-10 text-[64px] font-extrabold leading-none text-brand">&ldquo;</div>
          <p className="mb-[26px] text-[23px] leading-[1.4] sm:text-[27px] md:text-[30px] md:leading-[1.42] font-medium tracking-[-0.4px] text-ink [text-wrap:balance]">
            They advise at board level with rare candour, then hold our executive team to the change we committed to. The result was measurable within a year.
          </p>
          <footer className="text-sm font-medium text-muted">Group HR Director · Global consumer-goods company</footer>
        </Reveal>
      </section>

      {/* CLIENT IMPACT */}
      <section id="impact" className="bg-white">
        <Reveal className="mx-auto max-w-[1240px] px-6 sm:px-8 md:px-11 py-16 md:py-[104px]">
          <div className="mb-3 flex items-baseline gap-3">
            <span className="inline-block h-0.5 w-[34px] bg-brand" />
            <span className="text-[12.5px] font-semibold uppercase tracking-[2px] text-brand">Client impact</span>
          </div>
          <h2 className="mb-14 max-w-[720px] text-[30px] leading-[1.15] sm:text-[34px] md:text-[38px] md:leading-[1.1] font-bold tracking-[-0.7px] text-ink">
            Results, not promises — measured where it matters.
          </h2>
          <div className="grid grid-cols-1 border border-line md:grid-cols-3">
            {cases.map((c) => (
              <article key={c.client} className="flex flex-col border-b border-line px-[34px] py-10 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
                <div className="mb-7 flex items-baseline justify-between">
                  <span className="text-xl font-bold tracking-[0.5px] text-ink">{c.client}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[1px] text-[#a8a29d]">{c.sector}</span>
                </div>
                <div className="text-[60px] font-bold leading-none tracking-[-2px] text-brand">
                  <Counter value={c.metric} />
                </div>
                <div className="my-3 mb-[26px] text-[14.5px] font-medium leading-snug text-ink">{c.metricLabel}</div>
                <p className="mt-auto border-t border-line pt-[22px] text-sm leading-[1.55] text-muted">
                  <span className="font-bold text-brand">Challenge · </span>
                  {c.challenge}
                </p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 5H FRAMEWORK */}
      <section id="approach" className="bg-paper">
        <Reveal className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-10 px-6 py-16 sm:px-8 md:grid-cols-2 md:gap-[72px] md:px-11 md:py-[104px]">
          <div className="order-1 flex justify-center md:order-none">
            <Image src={methodology} alt="The 5H Framework methodology" className="h-auto w-full max-w-[560px] border border-line" />
          </div>
          <div>
            <div className="mb-3 flex items-baseline gap-3">
              <span className="inline-block h-0.5 w-[34px] bg-brand" />
              <span className="text-[12.5px] font-semibold uppercase tracking-[2px] text-brand">Our approach</span>
            </div>
            <h2 className="mb-5 text-[30px] leading-[1.15] sm:text-[34px] md:text-[38px] md:leading-[1.1] font-bold tracking-[-0.7px] text-ink">
              The 5H<span className="align-super text-xl font-semibold">®</span> Framework
            </h2>
            <p className="mb-[18px] text-[17px] leading-[1.65] text-[#4a4548]">
              Sustained leadership change comes from identity and habits — not skills alone. Our proprietary 5H methodology works across the{" "}
              <strong className="text-ink">inner game</strong> of the leader and the{" "}
              <strong className="text-ink">outer game</strong> of performance, so behaviour holds under real enterprise pressure.
            </p>
            <p className="mb-[30px] text-[17px] leading-[1.65] text-[#4a4548]">
              Paired with our DNA 360 Profiler, it turns diagnosis into a measurable development plan for individuals, teams and the wider organisation.
            </p>
            <a href="#contact" className="border-b-2 border-brand pb-1 text-sm font-bold uppercase tracking-[0.5px] text-ink hover:text-brand">
              Explore the methodology →
            </a>
          </div>
        </Reveal>
      </section>

      {/* PEOPLE + PARTNERSHIPS */}
      <section id="people" className="bg-white">
        <Reveal className="mx-auto max-w-[1240px] px-6 sm:px-8 md:px-11 py-16 md:py-[104px]">
          <div className="mb-3 flex items-baseline gap-3">
            <span className="inline-block h-0.5 w-[34px] bg-brand" />
            <span className="text-[12.5px] font-semibold uppercase tracking-[2px] text-brand">Our people</span>
          </div>
          <h2 className="mb-3 max-w-[720px] text-[30px] leading-[1.15] sm:text-[34px] md:text-[38px] md:leading-[1.1] font-bold tracking-[-0.7px] text-ink">
            Senior advisors who have sat where our clients sit.
          </h2>
          <p className="mb-12 max-w-[640px] text-lg leading-[1.55] text-muted">
            A leadership team of seasoned advisors, backed by a global faculty of 75 practitioners delivering across 36 countries.
          </p>
          <div className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            {people.map((p, i) => (
              <div key={i}>
                <div className="relative aspect-[3/4] overflow-hidden bg-[#e9e6e3]">
                  <div className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold uppercase tracking-[1px] text-[#c3bdb8]">
                    Portrait
                  </div>
                  <div className="absolute bottom-0 left-0 h-[5px] w-9 bg-brand" />
                </div>
                <h3 className="mb-0.5 mt-4 text-[17px] font-semibold text-ink">{p.name}</h3>
                <p className="text-[13.5px] leading-snug text-muted">{p.role}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-14 gap-y-6 border-t border-line pt-10">
            <span className="text-[12px] font-semibold uppercase tracking-[2px] text-muted">In partnership with</span>
            <span className="text-[19px] font-bold text-ink">Harvard Business Impact</span>
            <span className="h-[22px] w-px bg-[#d9d5d1]" />
            <span className="text-[19px] font-bold text-ink">Imperial College London</span>
          </div>
        </Reveal>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-brand text-white">
        <Reveal className="mx-auto grid max-w-[1240px] grid-cols-1 items-start gap-12 px-6 py-16 sm:px-8 md:grid-cols-[1.1fr_1fr] md:gap-[72px] md:px-11 md:py-[92px]">
          <div>
            <h2 className="mb-6 text-[32px] font-bold leading-[1.1] tracking-[-0.8px] text-white [text-wrap:balance] sm:text-[40px] md:text-[44px] md:leading-[1.08] md:tracking-[-1px]">
              What is changing, and where does leadership need to go?
            </h2>
            <p className="max-w-[460px] text-[19px] leading-[1.6] text-white/90">
              Tell us the leadership challenge you are facing. We will respond with a considered, confidential point of view — not a sales pitch.
            </p>
            <p className="mt-9 text-[15px] leading-[1.7] text-white/70">
              London · Miami · Singapore · Dubai · Riyadh
              <br />
              hello@corporatednaconsulting.com
            </p>
          </div>
          <form className="flex flex-col gap-4 bg-white p-[34px]">
            {formFields.map((f) => (
              <label key={f.label} className="flex flex-col gap-[7px]">
                <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-muted">{f.label}</span>
                <input
                  type={f.type}
                  name={f.autoComplete}
                  autoComplete={f.autoComplete}
                  inputMode={f.type === "email" ? "email" : undefined}
                  placeholder={f.placeholder}
                  className="min-h-[46px] border border-[#d9d5d1] bg-[#fafafa] px-3.5 py-3 text-[16px] text-ink outline-none focus:border-brand focus:bg-white"
                />
              </label>
            ))}
            <label className="flex flex-col gap-[7px]">
              <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-muted">
                What leadership challenge are you addressing?
              </span>
              <textarea
                rows={3}
                name="message"
                placeholder="A few lines is plenty."
                className="resize-y border border-[#d9d5d1] bg-[#fafafa] px-3.5 py-3 text-[16px] text-ink outline-none focus:border-brand focus:bg-white"
              />
            </label>
            <button
              type="button"
              className="mt-1 bg-ink px-4 py-4 text-sm font-bold uppercase tracking-[0.5px] text-white hover:bg-[#2a2627]"
            >
              Start a confidential conversation
            </button>
          </form>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-ink/10 bg-white text-ink/70">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-6 sm:px-8 md:px-11 py-14 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex items-start gap-7 sm:contents">
            <Link href="/" className="flex flex-none items-center gap-3.5">
              <Image
                src={logo}
                alt="Corporate DNA"
                className="h-14 w-14 rounded-full object-cover ring-1 ring-ink/10"
              />
              <Image src={wordmark} alt="Corporate DNA Consulting" className="h-11 w-auto invert" />
            </Link>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3.5 sm:flex sm:flex-wrap sm:gap-[26px]">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} className="text-[12.5px] font-medium tracking-[0.4px] text-ink/70 hover:text-ink">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <div className="text-[12.5px] text-ink/45">Making Leadership Real · Results Not Promises</div>
        </div>
      </footer>
    </div>
  );
}
