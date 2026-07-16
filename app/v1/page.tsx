import Image from "next/image";
import Link from "next/link";
import wordmark from "@/public/cdna-logo-text-white.png";
import logo from "@/public/logo.jpg";
import methodology from "@/public/5H-methodology.jpg";
import HeroV1 from "@/components/HeroV1";
import NavV1 from "@/components/NavV1";
import Reveal from "@/components/Reveal";
import LogoMarquee from "@/components/LogoMarquee";
import Counter from "@/components/Counter";

const navItems = [
  { label: "What We Solve", href: "#solve" },
  { label: "Executive Coaching", href: "#solve" },
  { label: "Our Approach", href: "#approach" },
  { label: "Client Impact", href: "#impact" },
  { label: "Our People", href: "#people" },
  { label: "Insights", href: "#solve" },
];

// Curated wall of the largest / most globally recognisable clients — Aramco leads.
const orderedLogos = [
  "aramco.png", "alphabet.png", "microsoft.png", "visa.png", "shell.png",
  "nestle.png", "coca_cola.png", "unilever.png", "bp.png", "hsbc.png",
  "disney.png", "pfizer.png", "novartis.png", "sanofi.png", "rio_tinto.png",
  "anglo_american.png", "goldman_sachs.png", "morgan_stanley.png", "citi.png", "standard_chartered.png",
  "chanel.png", "rolls_royce.png", "aston_martin.png", "mclaren.png", "lego.png",
  "adidas.png", "dyson.png",
];

const logoRowSplit = Math.ceil(orderedLogos.length / 2);
const logoRow1 = orderedLogos.slice(0, logoRowSplit);
const logoRow2 = orderedLogos.slice(logoRowSplit);

const book = {
  title: "Leadership: it's in your DNA",
  subtitle: "The book behind the method",
  body: "The thinking that underpins our work with CEOs and executive teams — how leadership becomes real when the stakes are highest, drawn from the 5H methodology and two decades of board-level practice.",
};

const stats = [
  { value: "18", label: "Years advising senior leaders" },
  { value: "36", label: "Countries of global delivery" },
  { value: "75", label: "Faculty of senior practitioners" },
  { value: "90%", label: "Work sponsored by Chairman / CXO" },
];

const challenges = [
  { num: "01", title: "CEO & executive performance", body: "Support for new and established CEOs and C-suite leaders navigating transitions, first 100 days and sustained top-team pressure." },
  { num: "02", title: "Executive-team alignment", body: "Aligning senior teams behind strategy so decisions move faster and the organisation feels one coherent leadership voice." },
  { num: "03", title: "Leadership succession & talent", body: "Building credible successors and the enterprise leadership pipeline before the seat, not after the gap appears." },
  { num: "04", title: "Enterprise transformation & culture", body: "Closing the gap when transformation is moving faster than leadership capability and culture can currently sustain." },
];

const differentiators = [
  { n: "1", title: "Identity and habits, not skills alone", body: "We change how leaders think and behave under pressure, so improvement holds long after the programme ends." },
  { n: "2", title: "High-stakes, senior-level experience", body: "Advisors who have operated at board and C-suite level and are trusted in genuinely high-stakes conversations." },
  { n: "3", title: "Proprietary 5H and DNA 360 methodology", body: "A rigorous, measurable framework — not a generic coaching approach borrowed from elsewhere." },
  { n: "4", title: "Global insight with local delivery", body: "A 75-strong faculty delivering consistently across 36 countries, tuned to regional context." },
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
  { label: "Name", placeholder: "Your full name" },
  { label: "Work email", placeholder: "name@company.com" },
  { label: "Organisation", placeholder: "Company name" },
];

export default function V1() {
  return (
    <div className="w-full overflow-x-hidden bg-white">
      {/* NAV */}
      <NavV1 navItems={navItems} />

      {/* HERO */}
      <HeroV1 />

      {/* CREDIBILITY */}
      <section className="bg-ink text-white">
        <div className="pb-[34px] pt-[70px]">
          <p className="mb-9 text-center text-[12px] font-semibold uppercase tracking-[2.5px] text-white/70">
            Trusted by leadership teams at
          </p>
          <div className="flex flex-col gap-5">
            <LogoMarquee logos={logoRow1} duration={logoRow1.length * 4.6} />
            <LogoMarquee logos={logoRow2} duration={logoRow2.length * 4.6} reverse />
          </div>
        </div>
        <div className="mx-auto max-w-[1200px] px-10 pb-10 pt-5">
          <Reveal className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-ink px-6 py-9 text-center">
                <div className="text-[36px] md:text-[46px] font-bold leading-none tracking-[-1px] text-brand">
                  <Counter value={s.value} />
                </div>
                <div className="mt-3 text-[13.5px] font-medium leading-snug text-white/80">{s.label}</div>
              </div>
            ))}
          </Reveal>
        </div>
        <div className="mx-auto max-w-[1200px] px-10 pb-20 pt-6">
          <Reveal stagger={false}>
            <blockquote className="mx-auto max-w-[900px] text-center">
              <div className="h-[34px] text-[56px] font-extrabold leading-none text-brand">&ldquo;</div>
              <p className="mb-[22px] text-[26px] font-medium leading-[1.5] tracking-[-0.2px] text-white [text-wrap:balance]">
                They advise at board level with rare candour, then hold our executive team to the change we committed to. The result was measurable within a year.
              </p>
              <footer className="text-sm font-medium text-white/60">Group HR Director · Global consumer-goods company</footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* WHAT WE SOLVE */}
      <section id="solve" className="bg-white">
        <Reveal className="mx-auto max-w-[1200px] px-10 py-24">
          <div className="mb-2.5 flex items-baseline gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">What we solve</span>
          </div>
          <h2 className="mb-3 max-w-[720px] text-[30px] sm:text-[34px] md:text-[40px] font-bold leading-[1.1] tracking-[-0.8px] text-ink">
            The high-stakes leadership challenges facing the enterprise.
          </h2>
          <p className="mb-[52px] max-w-[620px] text-lg leading-[1.55] text-muted">
            We start with what is at stake for the organisation — then bring the people, method and evidence to solve it.
          </p>
          <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2">
            {challenges.map((ch) => (
              <div key={ch.num} className="bg-white p-10 hover:bg-[#fafafa]">
                <div className="mb-[18px] text-[13px] font-bold tracking-[1px] text-brand">{ch.num}</div>
                <h3 className="mb-3 text-2xl font-semibold tracking-[-0.3px] text-ink">{ch.title}</h3>
                <p className="text-base leading-[1.6] text-[#4a4548]">{ch.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* WHY CDNA */}
      <section className="bg-paper">
        <Reveal className="mx-auto max-w-[1200px] px-10 py-24">
          <div className="mb-2.5 flex items-baseline gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">Why Corporate DNA</span>
          </div>
          <h2 className="mb-[52px] max-w-[760px] text-[30px] sm:text-[34px] md:text-[40px] font-bold leading-[1.1] tracking-[-0.8px] text-ink">
            Four reasons senior teams choose us over a coaching directory.
          </h2>
          <div className="grid grid-cols-1 gap-x-14 gap-y-10 md:grid-cols-2">
            {differentiators.map((d) => (
              <div key={d.n} className="flex items-start gap-[22px]">
                <div className="flex h-11 w-11 flex-none items-center justify-center border-[1.5px] border-brand text-base font-bold text-brand">
                  {d.n}
                </div>
                <div>
                  <h3 className="mb-2 text-[21px] font-semibold tracking-[-0.3px] text-ink">{d.title}</h3>
                  <p className="text-base leading-[1.6] text-[#4a4548]">{d.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CLIENT IMPACT */}
      <section id="impact" className="bg-white">
        <Reveal className="mx-auto max-w-[1200px] px-10 py-24">
          <div className="mb-2.5 flex items-baseline gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">Client impact</span>
          </div>
          <h2 className="mb-[52px] max-w-[720px] text-[30px] sm:text-[34px] md:text-[40px] font-bold leading-[1.1] tracking-[-0.8px] text-ink">
            Results, not promises — measured where it matters.
          </h2>
          <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
            {cases.map((c) => (
              <article key={c.client} className="flex flex-col border border-line">
                <div className="flex items-center justify-between bg-ink px-[26px] py-[22px] text-white">
                  <span className="text-[19px] font-bold tracking-[0.5px]">{c.client}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[1px] text-white/70">{c.sector}</span>
                </div>
                <div className="flex flex-1 flex-col px-[26px] py-7">
                  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-brand">Challenge</p>
                  <p className="mb-[22px] text-[15px] leading-[1.55] text-[#4a4548]">{c.challenge}</p>
                  <div className="mt-auto border-t border-line pt-[22px]">
                    <div className="text-[40px] md:text-[52px] font-bold leading-none tracking-[-1.5px] text-brand">
                      <Counter value={c.metric} />
                    </div>
                    <div className="mt-2.5 text-[14.5px] font-medium leading-snug text-ink">{c.metricLabel}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 5H FRAMEWORK */}
      <section id="approach" className="bg-ink text-white">
        <Reveal className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-[72px] px-10 py-24 md:grid-cols-2">
          <div>
            <div className="mb-2.5 flex items-baseline gap-3">
              <span className="inline-block h-0.5 w-9 bg-brand" />
              <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">Our approach</span>
            </div>
            <h2 className="mb-5 text-[30px] sm:text-[34px] md:text-[40px] font-bold leading-[1.1] tracking-[-0.8px] text-white">
              The 5H<span className="align-super text-xl font-semibold">®</span> Framework
            </h2>
            <p className="mb-[18px] text-[17px] leading-[1.65] text-white/80">
              Sustained leadership change comes from identity and habits — not skills alone. Our proprietary 5H methodology works across the{" "}
              <em className="font-semibold not-italic text-white">inner game</em> of the leader and the{" "}
              <em className="font-semibold not-italic text-white">outer game</em> of performance, so behaviour holds under real enterprise pressure.
            </p>
            <p className="mb-[30px] text-[17px] leading-[1.65] text-white/80">
              Paired with our DNA 360 Profiler, it turns diagnosis into a measurable development plan for individuals, teams and the wider organisation.
            </p>
            <a href="#contact" className="border-b-2 border-brand pb-1 text-sm font-bold uppercase tracking-[0.5px] text-white hover:text-brand">
              Explore the methodology →
            </a>
          </div>
          <div className="flex justify-center">
            <Image src={methodology} alt="The 5H Framework methodology" className="h-auto w-full max-w-[560px] border border-white/10" />
          </div>
        </Reveal>
      </section>

      {/* PEOPLE */}
      <section id="people" className="bg-white">
        <Reveal className="mx-auto max-w-[1200px] px-10 py-24">
          <div className="mb-2.5 flex items-baseline gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">Our people</span>
          </div>
          <h2 className="mb-3 max-w-[720px] text-[30px] sm:text-[34px] md:text-[40px] font-bold leading-[1.1] tracking-[-0.8px] text-ink">
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

      {/* BOOK */}
      <section id="book" className="bg-paper">
        <Reveal className="mx-auto max-w-[1200px] px-10 py-24">
          <div className="mb-10 flex items-baseline gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">The book</span>
          </div>
          <div className="grid grid-cols-1 items-center gap-12 border border-line bg-ink p-10 text-white md:grid-cols-[auto_1fr] md:p-14">
            <div className="relative mx-auto aspect-[3/4] w-[180px] overflow-hidden shadow-xl">
              <Image src="/book-cover.jpg" alt={book.title} fill sizes="180px" className="object-cover" />
            </div>
            <div>
              <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">{book.subtitle}</span>
              <h3 className="mb-4 mt-2 text-[26px] sm:text-[30px] font-bold leading-[1.15] tracking-[-0.6px] text-white">
                {book.title}
              </h3>
              <p className="mb-8 max-w-[560px] text-[17px] leading-[1.65] text-white/80">{book.body}</p>
              <a
                href="#contact"
                className="inline-block bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-[0.5px] text-white transition-colors hover:bg-brand-dark"
              >
                Request the book
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-brand text-white">
        <Reveal className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-[72px] px-10 py-[88px] md:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="mb-6 text-[32px] sm:text-[38px] md:text-[44px] font-bold leading-[1.08] tracking-[-1px] text-white [text-wrap:balance]">
              What is changing, and where does leadership need to go?
            </h2>
            <p className="mb-2 max-w-[460px] text-[19px] leading-[1.6] text-white/90">
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
                  type="text"
                  placeholder={f.placeholder}
                  className="border border-[#d9d5d1] bg-[#fafafa] px-3.5 py-3 text-[15px] text-ink outline-none focus:border-brand focus:bg-white"
                />
              </label>
            ))}
            <label className="flex flex-col gap-[7px]">
              <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-muted">
                What leadership challenge are you addressing?
              </span>
              <textarea
                rows={3}
                placeholder="A few lines is plenty."
                className="resize-y border border-[#d9d5d1] bg-[#fafafa] px-3.5 py-3 text-[15px] text-ink outline-none focus:border-brand focus:bg-white"
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
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-10 py-14 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
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
