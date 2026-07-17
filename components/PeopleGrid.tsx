"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Person = {
  name: string;
  role: string;
  img: string;
  location?: string;
  bio: string[];
  values?: string;
  strengths?: string;
  specialties?: string[];
  trackRecord?: string[];
  clients?: string;
  languages?: string;
  skills?: string[];
};

const people: Person[] = [
  {
    name: "Rhea Leckie",
    role: "Founder & CEO of CDNA",
    img: "/rhea.jpg",
    bio: [
      "Rhea Leckie is the Founder-CEO of CorporateDNA Consulting, with its European HQ in London and its APAC HQ in Singapore. An international thought leader in leadership, culture, inclusion and high-performing teams, she is a trusted advisor to an ivy-league clientele including Goldman Sachs, Vodafone, Heineken and Coca-Cola.",
      "Born in London and having spent formative years in India, Rhea has worked and lived in over 20 countries. While at PricewaterhouseCoopers UK she was appointed one of their youngest directors at 31, and has a consistent track record of working with management boards for over 20 years — Chairmen, CEOs, HRDs and high-performing teams.",
      "She is the author of the bestseller Leadership: It's in your DNA (Bloomsbury, 2012), and a regular commentator and speaker featured in the Wall Street Journal, The Economist, Management Today and The Telegraph.",
    ],
    specialties: [
      "Culture transformation",
      "Leadership development",
      "Talent & succession",
      "Inclusion & diversity",
      "Executive coaching",
    ],
    clients:
      "Heineken, Unilever, Goldman Sachs, Morgan Stanley, Aviva, Coca-Cola, Microsoft, Vodafone",
    values:
      "Courage · Creativity · Fun · Spirituality · Curiosity · Legacy · Family · Love",
    languages: "Speaks four languages",
    skills: [
      "MBA and neuroscience practitioner",
      "Accredited executive coach — INSEAD, Cranfield and Ashridge",
      "Author of Leadership: It's in your DNA (Bloomsbury)",
    ],
  },
  {
    name: "Guilherme Mendes",
    role: "CEO of Americas",
    img: "/guilherme.jpg",
    bio: [
      "Guilherme Mendes is CEO of Corporate DNA Americas, leading the firm's expansion across North and Latin America. He brings a rare combination of global executive leadership, commercial sharpness and transformation depth, built across more than two decades.",
      "He has lived and worked across Latin America, North America, Europe and Asia, visited more than 75 countries, and led multicultural teams for over 20 years. Operating at the intersection of growth and complexity, he has owned $700M+ P&Ls, turned around underperforming units, and built high-impact teams and go-to-market engines across multiple industries.",
      "After years of transforming businesses from the inside, he chose this chapter to expand his impact from one enterprise to many — helping CEOs and leadership teams across the Americas make stronger, more sustainable decisions and build human-centric cultures of trust, accountability and performance.",
    ],
    values:
      "Family · Health · Fun · Growth · Independence · Creativity · Freedom · Appearance",
    specialties: [
      "CEO, CHRO, board and senior-team advisory",
      "Leadership transformation at the intersection of growth and complexity",
      "P&L turnarounds, go-to-market acceleration and value creation",
      "Human-centric, high-performance multicultural teams",
    ],
    trackRecord: [
      "P&Ls above $700M",
      "Turnaround at PPG Silicas while protecting key customers and supply",
      "Positive EBITDA turnaround at Tintas Renner / PPG South America after years of losses",
      "Heineken volume doubled in ~2.5 years; later led sales capability across 24 Asian markets",
      "8% organic growth on a >$300M PMI P&L; USA expansion at Axur",
    ],
    clients:
      "Axur, PPG, Heineken, Philip Morris International, AB InBev, HSBC",
    languages: "English · Portuguese · Spanish",
  },
  {
    name: "Genevieve James",
    role: "Head of Asia",
    img: "/gen.jpg",
    bio: [
      "Genevieve is a Gallup Certified Strengths Coach, performance consultant and facilitator with an Asia focus and deep European experience across cross-cultural teams.",
      "She works with C-level executives, managers and graduates on team-performance-focused facilitation and coaching, developing actionable plans that address both business and individual needs — spanning HR strategy, organisational design, restructuring and human-performance projects across industries.",
    ],
    values:
      "Courage · Freedom · Health · Knowledge · Justice · Wisdom · Professionalism · Humour",
    strengths: "Strategic · Learner · Achiever · Analytical · Responsibility",
    specialties: [
      "Gallup Certified Strengths Coach and facilitator",
      "Asia focus, European experience, cross-cultural teams",
      "C-level executives, managers and graduates",
      "HR strategy, organisational design and development",
      "Process redesign and human-capital expansion",
    ],
    clients:
      "GSK, Kellogg's, Heineken, Schroders, Manulife, PICC, Accenture, BHP, ANZ Bank, Intercontinental Hotels, ZALORA, Philip Morris, Coca-Cola, Diageo, Transport for London, AON, Nestlé Nespresso",
    languages: "English · French",
  },
  {
    name: "Jon-Paul Pritchard",
    role: "Thought Leadership & Innovation",
    img: "/jp.jpg",
    bio: [
      "JP is a global talent-acquisition leader with a background in behavioural assessment design and leadership selection, having led teams throughout Asia and Europe.",
      "He blends executive experience at Dyson, Cisco and Toll Group with consulting across large FMCG, pharmaceutical and tech organisations, and is a recognised specialist on the Asian talent landscape.",
    ],
    values:
      "Empathy · Compassion · Persistence · Accountability · Courage · Integrity · Humour · Creativity",
    strengths: "Strategic · Ideation · Futuristic · Positivity · Self-Assurance",
    specialties: [
      "Global talent acquisition and organisational talent strategy",
      "Behavioural assessment design and leadership selection",
      "Succession planning and process design",
      "Leadership coaching",
      "Inclusion & diversity",
    ],
    clients:
      "Executive: Dyson, Cisco, Toll Group · Consulting: Heineken, Unilever, GSK, Shunkhlai Group",
    languages: "English",
    skills: [
      "Marshall Goldsmith Stakeholder Centered Coaching",
      "Master's — INSEAD Consulting & Coaching for Change (Clinical Organisational Psychology)",
      "Behavioural interviewer, specialist on Asian talent",
    ],
  },
  {
    name: "Phil Paul",
    role: "Senior Facilitator & Coach",
    img: "/phil.jpg",
    bio: [
      "Phil is a senior executive coach for CEOs, GMs, Directors and Functional VPs, delivering integrated whole-person coaching for transformational results across an executive's inner and outer life.",
      "A senior career in the TelCo/IT industry lends an insider lens on the challenges leaders face inside fast-changing, ambitious organisations.",
    ],
    values:
      "Family · Health · Fun · Growth · Independence · Creativity · Freedom · Appearance",
    specialties: [
      "Senior executive coaching — CEO, GMs, Directors, VPs",
      "Integrated whole-person coaching for transformational results",
      "Flexible formats — walk-with-coach, habit setting, beliefs work",
      "Leadership team facilitation",
    ],
    clients:
      "Shell, Unilever, SingTel, Heineken, Coca-Cola, GSK, British Telecom, Taj Group of Hotels",
    languages: "English",
    skills: [
      "Master Performance Coach (ICF certified)",
      "Master NLP Practitioner and Certified NLP Coach",
      "Hogan, SDI and TKI certified",
      "B.Sc. Engineering and MBA — University of Glasgow",
    ],
  },
  {
    name: "Mike Jackson",
    role: "Head of UK & Europe",
    img: "/mike.jpg",
    bio: [
      "Mike is a certified solutions-focused executive coach for senior executives, CEOs and leadership teams, and an ICF Singapore Chapter Ambassador.",
      "Former APAC Managing Director at Bloomberg Media and at MEC/Wavemaker (WPP), he has been based in Singapore since 2008 and has spoken at over 50 conferences worldwide. He is a lead advisor on enterprise leadership transformation programmes working with 50+ SME CEOs and owners.",
    ],
    values:
      "Courage · Passion · Dedication · Integrity · Loyalty · Empathy · Family · Cooperation",
    strengths: "Strategic · Empathetic · Positivity · Team-Oriented · Dedicated",
    specialties: [
      "Solutions-focused executive coaching for CEOs and leadership teams",
      "Enterprise leadership transformation for SME CEOs and owners",
      "Guest lecturer, NUS Business School",
      "Ex-APAC MD, Bloomberg Media and MEC/Wavemaker (WPP)",
    ],
    clients:
      "Kellanova, Google, Shell, Amplifon, Unilever, JLL, Frasers Property, NUS, Dentsu, WPP, Bloomberg, Shopee, Chevron, Publicis",
    languages: "English",
    skills: ["Certified Executive Coach (ICF)", "MA in Marketing"],
  },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[1.5px] text-brand">
        {label}
      </div>
      {children}
    </div>
  );
}

function PersonModal({ person, onClose }: { person: Person; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={person.name}
    >
      <div
        className="relative my-auto w-full max-w-[880px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center bg-white/80 text-2xl leading-none text-ink transition-colors hover:bg-brand hover:text-white md:text-ink"
        >
          ×
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr]">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#e9e6e3] md:aspect-auto">
            <Image
              src={person.img}
              alt={person.name}
              fill
              sizes="300px"
              className="object-cover object-top"
            />
            <div className="absolute bottom-0 left-0 h-[5px] w-12 bg-brand" />
          </div>

          <div className="max-h-[80vh] overflow-y-auto px-7 py-8 md:px-9 md:py-10">
            <h2 className="text-[26px] font-bold leading-tight tracking-[-0.5px] text-ink">
              {person.name}
            </h2>
            <p className="mb-6 mt-1 text-[14px] font-semibold uppercase tracking-[1px] text-brand">
              {person.role}
            </p>

            <div className="space-y-4 text-[15px] leading-relaxed text-muted">
              {person.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-8 space-y-7">
              {person.specialties && (
                <Field label="Specialist areas">
                  <ul className="space-y-1.5">
                    {person.specialties.map((s, i) => (
                      <li
                        key={i}
                        className="relative pl-4 text-[14.5px] leading-snug text-ink/80 before:absolute before:left-0 before:top-[9px] before:h-1.5 before:w-1.5 before:bg-brand"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </Field>
              )}

              {person.trackRecord && (
                <Field label="Selected track record">
                  <ul className="space-y-1.5">
                    {person.trackRecord.map((s, i) => (
                      <li
                        key={i}
                        className="relative pl-4 text-[14.5px] leading-snug text-ink/80 before:absolute before:left-0 before:top-[9px] before:h-1.5 before:w-1.5 before:bg-brand"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </Field>
              )}

              {person.clients && (
                <Field label="Client experience">
                  <p className="text-[14.5px] leading-relaxed text-ink/80">
                    {person.clients}
                  </p>
                </Field>
              )}

              <div className="grid gap-7 sm:grid-cols-2">
                {person.values && (
                  <Field label="Values">
                    <p className="text-[14.5px] leading-relaxed text-ink/80">
                      {person.values}
                    </p>
                  </Field>
                )}
                {person.strengths && (
                  <Field label="Strengths">
                    <p className="text-[14.5px] leading-relaxed text-ink/80">
                      {person.strengths}
                    </p>
                  </Field>
                )}
                {person.languages && (
                  <Field label="Languages">
                    <p className="text-[14.5px] leading-relaxed text-ink/80">
                      {person.languages}
                    </p>
                  </Field>
                )}
              </div>

              {person.skills && (
                <Field label="Skills & credentials">
                  <ul className="space-y-1.5">
                    {person.skills.map((s, i) => (
                      <li
                        key={i}
                        className="relative pl-4 text-[14.5px] leading-snug text-ink/80 before:absolute before:left-0 before:top-[9px] before:h-1.5 before:w-1.5 before:bg-brand"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </Field>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PeopleGrid() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <div className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-3">
        {people.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className="group block cursor-pointer text-left"
            aria-label={`View ${p.name}'s profile`}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[#e9e6e3]">
              <Image
                src={p.img}
                alt={`${p.name} — ${p.role}`}
                fill
                sizes="(min-width: 768px) 380px, 50vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="px-4 pb-4 text-[12px] font-semibold uppercase tracking-[1.5px] text-white">
                  View profile →
                </span>
              </div>
              <div className="absolute bottom-0 left-0 h-[5px] w-9 bg-brand" />
            </div>
            <h3 className="mb-0.5 mt-4 text-[17px] font-semibold text-ink transition-colors group-hover:text-brand">
              {p.name}
            </h3>
            <p className="text-[13.5px] leading-snug text-muted">{p.role}</p>
          </button>
        ))}
      </div>

      {active !== null && (
        <PersonModal person={people[active]} onClose={() => setActive(null)} />
      )}
    </>
  );
}
