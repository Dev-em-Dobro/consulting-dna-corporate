import type { StaticImageData } from "next/image";

export type LeadershipEvent = {
  slug: string;
  title: string;
  category: string;
  kind: string;
  dateLabel: string;
  location?: string;
  summary: string;
  overview: string[];
  topics: string[];
  image?: string | StaticImageData;
  imageAlt?: string;
  /** 01-10: mostra a imagem inteira (sem recorte)  -  para artes com logo no pé. */
  imageContain?: boolean;
  featured?: boolean;
  gallery?: { src: string; alt: string }[];
  links?: { label: string; href: string }[];
  status: "past" | "upcoming";
};

export const events: LeadershipEvent[] = [
  {
    slug: "executive-series-collective-judgement-2026-09-18",
    title: "Executive Series",
    category: "cDNA",
    kind: "Speaker event",
    dateLabel: "18 September 2026",
    summary:
      "Our focus was collective judgement in the AI era: what happens to executive judgement when AI becomes another voice in the room.",
    overview: [
      "Together, we explored three questions that are becoming increasingly important for leadership teams.",
      "What stood out was that the most valuable conversations did not come from immediate agreement. They came from challenge, different perspectives and working through disagreement together.",
      "In the AI era, judgement is not simply an individual leadership strength. It is becoming a collective capability for executive teams and boards. We also shared our insights paper, Collective Executive Judgement in the AI Era, drawing on conversations with 150+ senior leaders and our work with executive teams and boards.",
    ],
    topics: [
      "Who wins when AI and your gut disagree?",
      "What is your judgement default, and what might you be missing?",
      "Why might disagreement produce better judgement than agreement?",
    ],
    image: "/events/executive-series-2026-09-18.jpg",
    imageAlt: "Executive Series, 18 September 2026",
    links: [{ label: "Insights paper", href: "/events/collective-executive-judgement.pdf" }],
    status: "past",
  },
  {
    slug: "chro-nexus-forum-2026-09-07",
    title: "CHRO Nexus Forum",
    category: "Nitin",
    kind: "Speaker event",
    dateLabel: "7 September 2026",
    summary:
      "Nitin joined the 3rd edition of the CHRO Nexus Forum in Kuala Lumpur, organised by UOA Academy.",
    overview: [
      "It was great to be back in KL meeting clients. This visit was more special as Nitin was invited to attend the 3rd edition of the CHRO Nexus Forum, a gathering of top CHROs from the region.",
    ],
    topics: [],
    image: "/events/nitin/chro-nexus.jpg",
    imageAlt: "CHRO Nexus Forum in Kuala Lumpur",
    links: [{ label: "Read the note", href: "https://lnkd.in/p/gQZEfbdg" }],
    status: "past",
  },
  {
    slug: "talent-4-conference-2026-08",
    title: "Marcus Evans Talent 4.0 Conference",
    category: "Nitin",
    kind: "Speaker event",
    dateLabel: "4-5 August 2026",
    summary:
      "Opening keynote in Kuala Lumpur on hybrid leadership with AI.",
    overview: [
      "In today's world, everyone's building a hybrid workplace. But almost nobody's building a hybrid talent strategy. 39% of core workplace skills are expected to change by 2030, and 6 in 10 employees will need reskilling within just three years.",
    ],
    topics: [],
    image: "/events/nitin/marcus-evans.jpg",
    imageAlt: "Marcus Evans Talent 4.0 Conference",
    links: [{ label: "Read the note", href: "https://lnkd.in/p/gcbQ2YZm" }],
    status: "past",
  },
  {
    slug: "economic-times-singapore-2026-07-24",
    title: "Economic Times Conference",
    category: "Nitin",
    kind: "Speaker event",
    dateLabel: "24 July 2026",
    location: "Singapore",
    summary: "Masterclass: The Chief Human-AI Officer: Redefining the CHRO Role.",
    overview: [
      "Yesterday, HR's mandate was digital transformation. Today, that has expanded to AI transformation. Tomorrow, the mandate shifts again, to Human-AI transformation, where ethics and bias will need to be addressed in every decision. That is building efficiency with meaning.",
    ],
    topics: [],
    image: "/events/nitin/economic-times-singapore.jpg",
    imageAlt: "Economic Times masterclass in Singapore",
    links: [{ label: "Read the note", href: "https://lnkd.in/p/g3QheTXF" }],
    status: "past",
  },
  {
    slug: "economic-times-philippines-2026-06-05",
    title: "Economic Times Conference",
    category: "Nitin",
    kind: "Speaker event",
    dateLabel: "5 June 2026",
    location: "Philippines",
    summary: "Masterclass on the rise of the Chief Human-AI Officer.",
    overview: [
      "The session explored how HR has transitioned from efficiency with systems, to efficiency with people, and efficiency with meaning.",
    ],
    topics: [],
    image: "/events/nitin/economic-times-philippines.jpg",
    imageAlt: "Economic Times masterclass in the Philippines",
    links: [
      {
        label: "Read the note",
        href: "https://www.linkedin.com/posts/nitingoil_it-was-great-to-be-back-in-the-philippines-activity-7469047315383627777-1szf",
      },
    ],
    status: "past",
  },
  {
    slug: "hr-tech-conference-singapore-2026-05-06",
    title: "HR Tech Conference",
    category: "Nitin",
    kind: "Speaker event",
    dateLabel: "6 May 2026",
    location: "Singapore",
    summary: "Keynote: Chief Courage Officer: Why HR must lead with courage in a human centred organisation.",
    overview: [
      "The keynote explored how courage is HR's new leadership currency, how ownership rebuilds trust, and how accountability anchors leadership impact.",
    ],
    topics: [],
    image: "/events/nitin/hr-tech.jpg",
    imageAlt: "HR Tech Conference in Singapore",
    links: [
      {
        label: "Read the note",
        href: "https://www.linkedin.com/posts/nitingoil_humanness-activity-7457784641911967744-YTgC",
      },
    ],
    status: "past",
  },
  {
    slug: "speaker-event-2026-09-23",
    title: "Speaker event",
    category: "Mike",
    kind: "Speaker event",
    dateLabel: "23 September 2026",
    summary: "",
    overview: [],
    topics: [],
    image: "/events/mike-jackson-1.jpg",
    imageAlt: "Speaker event, 23 September 2026",
    gallery: [
      { src: "/events/mike-jackson-2.jpg", alt: "Mike presenting at the CLO100 event" },
      { src: "/events/mike-jackson-3.jpg", alt: "Participants attending Mike's CLO100 session" },
    ],
    status: "past",
  },
  {
    slug: "executive-series-singapore-2026-06-11",
    title: "Executive Series",
    category: "cDNA",
    kind: "Speaker event",
    dateLabel: "11 June 2026",
    location: "Singapore",
    summary: "A privilege to host the first CDNA Executive Series, with Frasers.",
    overview: [],
    topics: [],
    image: "/events/executive-series-11-june-2026.jpg",
    imageAlt: "CorporateDNA Executive Series with Frasers in Singapore, 11 June 2026",
    status: "past",
  },
  /* 01-10: "CLO Impact Residency" saiu  -  duplicava o evento do Mike (CLO100). */
  {
    slug: "executive-series-singapore-2026-12-11",
    title: "Executive Series Singapore",
    category: "cDNA",
    kind: "Upcoming event",
    dateLabel: "11 December 2026",
    location: "Singapore",
    summary: [
      "Our Executive Series are an intimate, off-the record conversations with senior business leaders, heads of HR, Talent and learning, to explore the leadership, culture and technological shifts facing organizations today.",
      "After two successful events this year, we will be ending the year with our final one on December 11. If you’re a CHRO and not part of our community, please drop us a note and will make sure to include you in the invite.",
    ].join("\n\n"),
    image: "/events/executive-series-2026-12-11.jpg",
    imageAlt: "CorporateDNA Executive Series, 11 December 2026",
    imageContain: true,
    overview: [],
    topics: [],
    status: "upcoming",
  },
];

export function getEventBySlug(slug: string) {
  return events.find((event) => event.slug === slug);
}
