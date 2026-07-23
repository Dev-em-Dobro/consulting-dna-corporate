import Image from "next/image";
import methodology from "@/public/5H-methodology.jpg";
import HeroV1 from "@/components/HeroV1";
import NavV1 from "@/components/NavV1";
import Reveal from "@/components/Reveal";
import LogoMarquee from "@/components/LogoMarquee";
import Counter from "@/components/Counter";
import PeopleGrid from "@/components/PeopleGrid";
import SiteFooter from "@/components/SiteFooter";
import { getPeople } from "@/lib/cms/map";
import { buildSiteNav } from "@/lib/nav-server";
import ContactForm from "@/components/ContactForm";

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

// `caseSlug` deep-links a card to its published case detail page. Only Shell has
// a case in the CMS today; the others fall back to the flagship-cases listing.
const cases: {
  client: string; sector: string; challenge: string;
  metric: string; metricLabel: string; caseSlug?: string;
}[] = [
  { client: "Heineken", sector: "FMCG", challenge: "Accelerate the readiness and advancement of high-potential leaders across the group.", metric: "45%", metricLabel: "higher promotion rate for programme participants" },
  { client: "Frasers Property", sector: "Real estate", challenge: "Retain critical leadership talent through a period of strategic change.", metric: "85%", metricLabel: "talent retention among participating leaders" },
  { client: "Shell", sector: "Energy", challenge: "Scale women's leadership development across a global engineering workforce.", metric: "2,582", metricLabel: "women leaders impacted across the programme", caseSlug: "case-1d007617" },
];

const offices = [
  {
    city: "London",
    address: "60 St Martin's Ln, Covent Garden, London WC2N 4JS",
    tel: "+44 20 3755 5329",
  },
  {
    city: "Miami",
    address:
      "1221 Brickell Avenue, Suite 900, Miami, Florida, 33131, United States of America",
    tel: "+1 305-374-4611",
  },
  {
    city: "Singapore",
    address:
      "The Great Room, Afro Asia, 63 Robinson Road, Level 8, Singapore 068894",
    tel: "+65 6995 2480",
  },
  {
    city: "Dubai",
    address:
      "Sheikh Rashid Tower, 4th Floor, Dubai World Trade Centre, Dubai — United Arab Emirates",
    tel: null,
  },
  {
    city: "Saudi Arabia",
    address:
      "2888 King Fahd Road, Saudi Journalists Association Building, 2nd Floor, Al Sahafah, Dist. 13671 Riyadh, Kingdom of Saudi, 13321, RASA6101",
    tel: null,
  },
];

export default async function V1() {
  const [people, nav] = await Promise.all([getPeople(), buildSiteNav()]);
  return (
    <div className="w-full overflow-x-hidden bg-white">
      {/* NAV */}
      <NavV1 items={nav} />

      {/* HERO */}
      <HeroV1 />

      {/* WHAT WE SOLVE — intro (moved directly below the hero) */}
      <section id="solve" className="bg-white">
        <Reveal className="mx-auto max-w-[1200px] px-10 py-24 md:text-center">
          <div className="mb-2.5 flex items-baseline gap-3 md:justify-center">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">What we solve</span>
          </div>
          <h2 className="mb-3 max-w-[720px] text-[30px] sm:text-[34px] md:text-[40px] font-bold leading-[1.1] tracking-[-0.8px] text-ink md:mx-auto">
            The high-stakes leadership challenges facing the enterprise.
          </h2>
          <p className="max-w-[620px] text-lg leading-[1.55] text-muted md:mx-auto">
            We start with what is at stake for the organisation — then bring the people, method and evidence to solve it.
          </p>
        </Reveal>
      </section>

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
        <div className="mx-auto max-w-[1200px] px-10 pb-20 pt-5">
          <Reveal className="mx-auto grid max-w-[760px] grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            {stats.map((s) => (
              <div key={s.label} className="flex items-start gap-5">
                <span className="mt-[26px] h-[3px] w-8 flex-none bg-brand" />
                <div>
                  <div className="text-[44px] md:text-[56px] font-bold leading-none tracking-[-1.5px] text-brand">
                    <Counter value={s.value} />
                  </div>
                  <div className="mt-2 text-[16px] font-medium leading-snug text-white/80">{s.label}</div>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CHALLENGES — hidden for now (set the guard to true to restore) */}
      {false && (
      <section id="challenges" className="bg-white">
        <Reveal className="mx-auto max-w-[1200px] px-10 pb-24 pt-4">
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
      )}

      {/* WHY CDNA — hidden for now (set the guard to true to restore) */}
      {false && (
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
      )}

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
                <div className="bg-ink px-[26px] py-[22px] text-white">
                  <div className="text-[19px] font-bold tracking-[0.5px]">{c.client}</div>
                  <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[1px] text-white/70">{c.sector}</div>
                </div>
                <div className="flex flex-1 flex-col px-[26px] py-7">
                  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-brand">Challenge</p>
                  <p className="mb-[22px] text-[15px] leading-[1.55] text-[#4a4548]">{c.challenge}</p>
                  <div className="mt-auto pt-[22px]">
                    <span className="mb-[18px] block h-[3px] w-9 bg-brand" />
                    <div className="text-[40px] md:text-[52px] font-bold leading-none tracking-[-1.5px] text-brand">
                      <Counter value={c.metric} />
                    </div>
                    <div className="mt-2.5 text-[14.5px] font-medium leading-snug text-ink">{c.metricLabel}</div>
                    <a
                      href={
                        c.caseSlug
                          ? `/solutions/flagship-cases/${c.caseSlug}`
                          : "/solutions/flagship-cases"
                      }
                      className="mt-4 inline-block text-[14px] font-semibold text-brand underline underline-offset-4 transition-colors hover:text-brand-dark"
                    >
                      read more here
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      {/* TESTIMONIALS — hidden for now (set the guard to true to restore) */}
      {false && (
      <section id="testimonials" className="bg-paper">
        <Reveal className="mx-auto max-w-[1200px] px-10 py-24">
          <div className="mb-2.5 flex items-baseline gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">Testimonials</span>
          </div>
          <h2 className="mb-3 max-w-[720px] text-[30px] sm:text-[34px] md:text-[40px] font-bold leading-[1.1] tracking-[-0.8px] text-ink">
            What leaders say after working with us.
          </h2>
          <p className="mb-12 max-w-[620px] text-lg leading-[1.55] text-muted">
            A rapid-fire wall of client voices.
          </p>
          <div className="flex min-h-[220px] items-center justify-center border border-dashed border-[#d9d5d1] bg-white/60 text-[13.5px] font-medium uppercase tracking-[1.5px] text-muted">
            Testimonials showcase — coming soon
          </div>
        </Reveal>
      </section>
      )}

      {/* 5H FRAMEWORK — hidden for now (set the guard to true to restore) */}
      {false && (
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
      )}

      {/* PEOPLE — hidden until the CMS has published people */}
      {people.length > 0 && (
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
          <PeopleGrid people={people} />
          <div className="flex flex-wrap items-center gap-x-14 gap-y-6 border-t border-line pt-10">
            <span className="text-[12px] font-semibold uppercase tracking-[2px] text-muted">In partnership with</span>
            <span className="text-[19px] font-bold text-ink">Harvard Business Impact</span>
            <span className="h-[22px] w-px bg-[#d9d5d1]" />
            <span className="text-[19px] font-bold text-ink">Imperial College London</span>
          </div>
        </Reveal>
        </section>
      )}

      {/* BOOK */}
      <section id="book" className="bg-paper">
        <Reveal className="mx-auto max-w-[1200px] pb-14 md:px-10 md:py-24">
          <div className="grid grid-cols-1 items-center gap-8 bg-ink text-white md:grid-cols-[auto_1fr] md:gap-12 md:border md:border-line md:p-14">
            <div className="relative aspect-[4/3] w-full overflow-hidden shadow-xl md:w-[440px]">
              <Image src="/book-cover.png" alt={book.title} fill sizes="(min-width: 768px) 440px, 100vw" className="object-cover" />
            </div>
            <div className="px-6 pb-10 md:px-0 md:pb-0">
              <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">{book.subtitle}</span>
              <h3 className="mb-4 mt-2 text-[26px] sm:text-[30px] font-bold leading-[1.15] tracking-[-0.6px] text-white">
                {book.title}
              </h3>
              <p className="mb-8 max-w-[560px] text-[17px] leading-[1.65] text-white/80">{book.body}</p>
              <a
                href="https://www.amazon.com/Leadership-Its-Your-Rhea-Duttagupta/dp/1408168340"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-[0.5px] text-white transition-colors hover:bg-brand-dark"
              >
                Buy on Amazon
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* OFFICES / REGIONS */}
      <section id="offices" className="bg-paper">
        <Reveal className="mx-auto max-w-[1200px] px-10 py-24">
          <div className="mb-12 flex items-baseline gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">Our offices</span>
          </div>
          <div className="grid grid-cols-1 gap-x-20 gap-y-4 sm:grid-cols-2">
            {offices.map((o) => (
              <div key={o.city} className="py-8">
                <h3 className="mb-4 text-[22px] font-bold uppercase tracking-[0.5px] text-ink">
                  {o.city}
                </h3>
                <p className="text-[15px] leading-[1.7] text-muted">{o.address}</p>
                {o.tel && (
                  <p className="mt-1 text-[15px] leading-[1.7] text-muted">Tel: {o.tel}</p>
                )}
                <span className="mt-6 block h-[3px] w-8 bg-brand" />
              </div>
            ))}
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
          </div>
          <ContactForm />
        </Reveal>
      </section>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
}
