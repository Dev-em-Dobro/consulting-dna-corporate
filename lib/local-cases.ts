/**
 * Case studies supplied in the 29-09 task list. They are not in the CMS yet,
 * so the site serves them from here until a content owner publishes the same
 * slug upstream. Quote portraits were not in the Drive pack.
 */
const PUBLISHED_AT = "2026-09-29T00:00:00.000Z";

function article(partial: {
  slug: string;
  tags: string[];
  title: string;
  headline: string;
  logoUrl: string;
  coverUrl?: string;
  quote?: string;
  quoter?: string;
  facts: { label: string; value: string }[];
  body: { challenge: string; approach: string; outcome: string };
  story: {
    challengeHeadline: string;
    approachHeadline: string;
    outcomeHeadline: string;
    impactFigures: { value: string; label: string }[];
    scaleFigures: string[];
    services: string[];
    service: string;
    additionalContent?: string;
  };
}) {
  return partial;
}

export const LOCAL_CASES = [
  article({
    slug: "shell-women-leaders",
    tags: ["Women in Leadership"],
    title: "Shell",
    headline: "Advancing Women Leaders & Building a Diverse Leadership Pipeline",
    logoUrl: "/logos/client-logos/shell.png",
    quote:
      "My heartfelt congratulations to this amazing team for winning us a GOLD in leading our Women in Leadership Program globally . This transformational program has had and will continue to have a deep impact for our women. I am very grateful for this opportunity to work with all of you.",
    quoter: "Lynn Lee, Global VP Diversity, Equity and Inclusion, Shell",
    facts: [
      { label: "Participants / Leaders", value: "8,000 women" },
      { label: "Impact", value: "96% facilitator impact" },
    ],
    body: {
      challenge:
        "Shell wanted to accelerate the advancement of women leaders globally, strengthening the pipeline from early career through to senior leadership. The ambition went beyond developing individual women: shift the system, strengthen succession and create the conditions for women to progress and thrive.",
      approach:
        "CDNA created a multi-year global women's leadership ecosystem spanning early, mid and senior career populations. The experience combined Inner & Outer Game development, immersive learning, peer and executive coaching, sponsorship and action learning, with senior leaders actively engaged in creating the conditions for progression.",
      outcome:
        "A stronger and more connected pipeline of women leaders, with greater confidence, enterprise perspective and readiness to step into broader roles. The work moved beyond simply developing women to advancing women and shaping the system around them.",
    },
    story: {
      challengeHeadline: "Accelerate women globally, and shift the system.",
      approachHeadline: "A multi-year women's leadership ecosystem.",
      outcomeHeadline: "Advancing women, and shaping the system around them.",
      impactFigures: [
        { value: "8,000", label: "women impacted across three levels and multiple geographies" },
        { value: "96%", label: "facilitator impact" },
        { value: "70+", label: "Net Promoter Score" },
        { value: "Gold", label: "Brandon Hall Group award for Diversity, Equity & Inclusion" },
      ],
      scaleFigures: [
        "Who we worked with: 8,000 women across three career levels and multiple geographies, supported by managers, sponsors and senior leaders.",
      ],
      services: [],
      service: "women-in-leadership",
      additionalContent:
        "A sustained global partnership that embedded women's development as part of Shell's wider leadership and inclusion agenda.",
    },
  }),
  article({
    slug: "dubai-holding-leadership-accountability",
    tags: ["Manager Development"],
    title: "Dubai Holding",
    headline: "Embedding Leadership Accountability Across Eight Business Units",
    logoUrl: "/logos/client-logos/dubai-holding.png",
    facts: [
      { label: "Countries", value: "21 countries" },
      { label: "Impact", value: "100% leadership accountability adoption" },
    ],
    body: {
      challenge:
        "As Dubai Holding consolidated a diverse portfolio, the challenge was to create one stronger leadership culture across eight distinct business units with different legacy systems, nationalities and management practices. The priority was to strengthen accountability, performance discipline and leadership capability while retaining the strengths of a highly diverse organisation.",
      approach:
        "CDNA designed an integrated Manager Development and Leadership Accountability Framework, identifying nine leadership and three management sub-tiers with differentiated development pathways. Manager Acceleration Labs, onboarding journeys, coaching and leadership clinics built accountability, enterprise mindset, execution discipline and people influence. Capstone projects moved development directly into live business challenges.",
      outcome:
        "A more unified leadership culture with greater clarity around what leaders were accountable for and how leadership should show up across the portfolio. Common leadership language and behaviours helped connect diverse businesses, while development pathways created greater consistency in how managers were onboarded, developed and supported.",
    },
    story: {
      challengeHeadline: "One leadership culture across eight business units.",
      approachHeadline: "A Manager Development and Leadership Accountability Framework.",
      outcomeHeadline: "A common language for how leadership shows up.",
      impactFigures: [
        { value: "100%", label: "leadership accountability adoption across business units" },
        { value: "94%", label: "measurable improvement in manager performance and behavioural consistency" },
        { value: "8", label: "business units on one leadership approach" },
        { value: "121", label: "nationalities across 21 countries" },
      ],
      scaleFigures: [
        "Who we worked with: leaders and managers across 8 business units, 21 countries and 121 nationalities, spanning both newly appointed and established leaders.",
      ],
      services: [],
      service: "manager-development",
    },
  }),
  article({
    slug: "heineken-inner-outer-game",
    tags: ["Senior Leadership"],
    title: "Heineken",
    headline: "Building the Inner & Outer Game of Leadership",
    logoUrl: "/logos/client-logos/heineken.png",
    quote:
      "[Programme] by CDNA delivered our Top150 was amazing... after 12 months, inner game work with our Top 150 continues to resonate deeply... thanks for the amazing work you and CDNA team put into this... it has been and is transforming our organization...!",
    quoter: "Dolf van den Brink, CEO, HEINEKEN International",
    facts: [
      { label: "Participants / Leaders", value: "Top 150" },
      { label: "Impact", value: "45% higher promotion rate" },
    ],
    body: {
      challenge:
        "Heineken was navigating significant enterprise transformation, with a new strategy and refreshed Group Executive Team. The challenge was to equip its Top 150 leaders globally to lead through complexity, accelerate transformation and sustain business performance, while strengthening the leadership pipeline beneath them.",
      approach:
        "CDNA designed and delivered a global leadership journey blending the Inner and Outer Game of leadership. The experience combined immersive learning, executive coaching, peer learning and action-learning projects tied directly to live business priorities. Delivered virtually and through an intensive in-person experience in Lausanne, the journey moved deliberately from insight to application and embedded leadership habits over time.",
      outcome:
        "The work went beyond a leadership programme. The Inner and Outer Game became language leaders continued to use well after the formal experience ended, helping create a stronger shared approach to leading themselves, their teams and transformation across Heineken.",
    },
    story: {
      challengeHeadline: "Lead the Top 150 through enterprise transformation.",
      approachHeadline: "Inner and Outer Game, from insight to application.",
      outcomeHeadline: "The legacy",
      impactFigures: [
        { value: "92%", label: "rated the programme exceptional for leadership effectiveness" },
        { value: "82%", label: "of action-learning projects delivered measurable business impact" },
        { value: "70%", label: "demonstrated measurable improvement in leadership behaviours" },
        { value: "45%", label: "higher promotion rate among participants versus non-participants over three years" },
        { value: "+12", label: "points employee engagement on average within participants' teams" },
      ],
      scaleFigures: [
        "Who we worked with: Top 150 global leaders, including Country GMs and Functional Leaders, alongside leadership populations across four regions.",
      ],
      services: [],
      service: "senior-leadership-development",
    },
  }),
];

const bySlug = new Map(LOCAL_CASES.map((c) => [c.slug, c]));

export function localCaseArticle(slug: string) {
  return bySlug.get(slug) ?? null;
}

export function localCaseListEntries() {
  return LOCAL_CASES.map((c) => ({
    slug: c.slug,
    client: c.title,
    tags: c.tags,
    challenge: c.body.challenge,
    metricValue: c.story.impactFigures[0]?.value,
    metricLabel: c.story.impactFigures[0]?.label,
    impactFigures: c.story.impactFigures,
    publishedAt: PUBLISHED_AT,
    logoUrl: c.logoUrl,
    headline: c.headline,
    quote: c.quote,
    quoter: c.quoter,
    service: c.story.service,
  }));
}
