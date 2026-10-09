import { CASE_HERO_COVERS } from "./case-hero-covers";

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
  headline?: string;
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
    markets?: string;
    partnershipYears?: string;
    moreQuotes?: { quote: string; quoter?: string }[];
  };
}) {
  return partial;
}

export const LOCAL_CASES = [
  // Reviewed = Yes in CaseStudiesv2.xlsx (9 Oct 2026). The CMS has no case
  // record yet; keep the approved story available without inventing a logo,
  // photograph or achieved impact figures.
  article({
    slug: "shunkhlai",
    tags: ["Family Business Consulting"],
    title: "Shunkhlai",
    headline: "Turning a family group into one enterprise.",
    logoUrl: "",
    facts: [{ label: "Countries", value: "Mongolia" }],
    body: {
      challenge:
        "Shunkhlai's challenge sat at every level of the group at once. HoldCo was led by a single voice without clear shared accountability, while business units operated in silos. HR and strategy capability needed strengthening, and limited learning opportunities constrained growth across the group.",
      approach:
        "The work is designed as one connected enterprise programme. It begins with a review of HoldCo structure, mandates and leadership roles, then extends into the business units through leader development and focused performance management. HR and strategy capability are built in parallel, supported by a Skills Academy for leadership and core teams.",
      outcome:
        "The intended outcome is a group that leads as one enterprise rather than a portfolio of separate businesses. The programme aims to strengthen shared ownership, collaboration, decision-making and succession as the group's long-term vision takes hold.",
    },
    story: {
      challengeHeadline: "A group led by a single voice, running as separate businesses.",
      approachHeadline: "Rebuilding the centre, then growing leaders and capability outwards.",
      outcomeHeadline: "From single voice and silos to shared ownership.",
      markets: "Mongolia; Group HoldCo and business unit portfolio",
      impactFigures: [],
      scaleFigures: ["Chairman, HoldCo leadership, business unit CEOs and leadership teams across four connected workstreams."],
      services: ["Family Business Consulting", "Enterprise Leadership", "Succession and Leadership Pipeline"],
      service: "family-business-consulting",
    },
  }),
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
  /* 01-10: os cases do site antigo voltam, um por um. A FONTE É A PLANILHA
     `CaseStudiesv1.xlsx` (Drive, aba "Service by Client"), linha Shell /
     Women in Leadership: eyebrow, figuras, challenge e what we did vêm dela.
     O que a linha deixa em branco (resultados e citação) vem da página antiga
     (corporatednaconsulting.com/our-clients/shell), para não perder nada.
     Títulos de seção ficam vazios onde a planilha não os escreve. É OUTRO case
     que o `shell-women-leaders` acima. */
  article({
    slug: "shell",
    tags: ["Women in Leadership"],
    title: "Shell",
    headline: "Talent Acceleration Program for Asia (TAPA)",
    logoUrl: "/logos/client-logos/shell.png",
    coverUrl: "/cases/shell-tapa-cover.jpg",
    quote:
      "I’m a firm believer in pushing for Asian talent. The fact that we are so far from headquarters means we have to work harder on visibility. Otherwise, they don’t know who you are",
    quoter: "Leslie Hayward, HR Director",
    facts: [
      { label: "Countries", value: "16 nationalities" },
      { label: "Impact", value: "88% Net Promoter Score" },
    ],
    body: {
      challenge:
        "Shell Asia was a fast growing collection of markets inside a business headquartered in the Netherlands and incorporated in the UK. APAC wanted its talent visible at the centre. Separately, a 50:50 gender ratio at intake meant every year's cohort had to build the funnel rather than simply refill it.",
      approach:
        "TAPA, launched in 2019, started from the leadership narrative of delegates across 16 nationalities, filmed so each leader could find their own leadership identity rather than adopt a house style. One cohort ran in room before COVID and one fully virtual after, with impact holding consistently across both formats. The women in leadership work ran separately and at much greater scale, across the ML cohorts and the Powering You track.",
      outcome:
        "With an 88% Net Promoter Score at the end of the TAPA program, all participating leaders were able to identify and transform their limiting beliefs, fears and insecurities into purpose. By leading from a place of purpose and value, they have seen growth, grounded leadership and productivity that’s higher than ever before.",
    },
    story: {
      challengeHeadline: "",
      approachHeadline: "",
      outcomeHeadline: "",
      markets: "Asia, 16 nationalities",
      partnershipYears: "From 2019",
      impactFigures: [
        { value: "88%", label: "Net Promoter Score (TAPA, 2019 to 2020)" },
        { value: "96%", label: "facilitator impact (women in leadership work)" },
        { value: "70%", label: "Net Promoter Score (women in leadership work)" },
      ],
      scaleFigures: [
        "16 nationalities",
        "Across 2 cohorts, 45 high potentials were chosen from Australia, Brunei, China, India, Indonesia, Japan, Malaysia, Myanmar, New Zealand, Pakistan, Philippines, Singapore, South Korea, Taiwan, Thailand, Vietnam.",
      ],
      services: [],
      service: "women-in-leadership",
    },
  }),
  /* 01-10: mesma regra do Shell acima  -  planilha `CaseStudiesv1.xlsx`
     primeiro, página antiga (backup em `docs/backup-cms-cases-legados-2026-09-17.json`)
     para o que a linha deixa em branco. Capa recortada do print da página
     antiga. Na planilha: Aviva FINAL; Coca-Cola, Levi's e Unilever em HOLD. */
  article({
    slug: "aviva",
    tags: ["Women in Leadership"],
    title: "Aviva",
    headline: "The board looked nothing like the customers it was trying to win.",
    logoUrl: "/logos/client-logos/aviva.png",
    coverUrl: "/cases/aviva-cover.jpg",
    quote: "I came away feeling incredibly proud and energized.",
    facts: [
      { label: "Countries", value: "16 countries" },
      { label: "Impact", value: "70%+ of delegates promoted" },
    ],
    body: {
      challenge:
        "By 2017 Aviva's growth story ran through a younger and more Asian consumer base than its own leadership reflected. That is a commercial problem before it is a values problem: a board that cannot see its customer makes slower and narrower decisions, and the gap compounds quietly through every layer of succession beneath it. Aviva wanted a serious, visible new lens on inclusion, and wanted it to begin at the top rather than in a policy document circulated downward. The emphasis was on closing gender, ethnic and generational gaps in the talent pipeline. The harder part was that the board would have to do its own work first, in the room, with its own life stories and its own biases on the table, before asking anyone else to.",
      approach:
        "The design principle was that inclusion cannot be delegated downward. A board that has done its own work can ask for change credibly. One that has not is running a communications exercise. Four workstreams:\n- Start with the board, not the pipeline\n- Make bias personal before making it structural\n- Pair the inner game with hard commercial skill\n- Sponsor at director level, not mentor at a distance\n\nThree phases, 2017 to 2018 with the Group PLC Board, 2016 to 2020 with over 100 women through Accelerating Women Leaders, then ALIO and Canada to 2023.\n\n**Track 1: Inclusion and Diversity for the Group PLC Board (2017-2018).** Sponsored by the Executive Chairman Sir Adrian Montague, to help shape an Inclusive Legacy. The workshops defined the Inclusion ambition for Aviva and carried an element of personal reflection for the Board to reposition themselves by representing the new Asian and millennial consumer base, working with both Executive and Non-Executive members on individual life stories and unconscious biases.\n\n**Track 2: Accelerating Women Leaders (2016-2020).** Sponsored by Group HR Director Sarah Morris, with over 100 women at Senior Leadership and Senior Management levels over 3 years. The inner work included Personal Brand Impact, Courageous Leadership and Authenticity. The harder skills included Commercial Acumen, Decision Making, Creative Problem Solving, Collaboration, Networking and the Feedback Cycle.",
      outcome:
        "More than seven in ten programme delegates were promoted, and Aviva is now led in several commercial roles by women who came through the journey. That is the distinction the whole programme rests on: not that more women attended something, but that more women were given businesses to run. Inclusive leadership is embedded at board, executive committee and senior level, with a visibly stronger succession pipeline behind it. The Canadian board and executive committee work extended the same approach into a second market, and the group chief executive who followed had come through it.",
    },
    story: {
      challengeHeadline: "The board looked nothing like the customers it was trying to win.",
      approachHeadline: "Inner game and outer game, run at two levels at once.",
      outcomeHeadline: "",
      markets: "UK, Canada and Asia",
      partnershipYears: "2016 to 2023",
      impactFigures: [
        { value: "70%+", label: "of delegates promoted (Accelerating Women Leaders)" },
        { value: "350+", label: "women leaders impacted (ALIO phase)" },
      ],
      scaleFigures: ["16 countries (UK, Canada and Asia)", "3 phases across seven years (2016 to 2023)"],
      services: [],
      service: "women-in-leadership",
      moreQuotes: [
        { quote: "The CDNA workshops were fantastic." },
        {
          quote:
            "Truly embracing diversity goes beyond appreciating people for who they are, regardless of their background. It's about recognizing the breadth of talent, expertise and perspectives they bring to the table. Instead of integrating them into a common culture, it's about celebrating the differences and empowering people to share their uniqueness. This is what we mean by \"inclusive diversity\", which lies at the heart of how we do business at Aviva.",
          quoter: "Chris Wei, Global Chairman of Aviva Digital and Executive Chairman, Aviva Asia",
        },
        {
          quote:
            "Thank you so much for the fantastic two workshops you ran in Canada this week. We had a great morning with Rhea and Jamie and the independents really got engaged and excited. The involvement was excellent and it was a great session. We had a number of clear action items to help redefine our role and how we spend our time.",
          quoter: "Aviva Canada Board, led by Maurice Tulloch (became Group CEO, Aviva)",
        },
      ],
    },
  }),
  article({
    slug: "coca-cola",
    tags: ["High Performing Teams"],
    title: "Coca-Cola",
    logoUrl: "/logos/client-logos/coca-cola.png",
    coverUrl: "/cases/coca-cola-cover.jpg",
    quote:
      "Great feedback on the CorporateDNA facilitation of our Asia Pacific Leadership Team - level of engagement and key themes that were generated was great work!",
    quoter: "John Murphy, President, APAC, Coca-Cola",
    facts: [
      { label: "Countries", value: "32 markets" },
      { label: "Participants / Leaders", value: "18 APAC leadership team members" },
    ],
    body: {
      challenge:
        "In 2018 Coca-Cola introduced a new set of behaviours and performance indicators globally, and formed a new APAC leadership team responsible for 32 markets. The team was experienced but assembled, which meant no shared starting line and cross functional silos inherited from previous roles.",
      approach:
        "Appointed by the APAC president to distil four global mindsets into everyday behaviours, then run them through the regional leadership team and down into country level. In the same 18 month period, an equivalent journey with the Japan leadership team as the business built toward the Tokyo Olympics.",
      outcome:
        "**Track 1 (Regional Transformation): Coca-Cola APAC.** Over 18 APAC LT leaders at the helm of the region were able to directly apply their learnings from the program and saw increased performance and motivation in their team members as they were held accountable through growth dialogues and were inspired to be catalysts in shaping perception and organizational culture:\n- Clear messaging and alignment of 2018 behaviours and mindsets.\n- A sense of renewed confidence in individual leaders as credible, functional owners.\n- Making bold, agile decisions by breaking out of parent-child dynamics; becoming open to challenges.\n- Actively engaging in cross-functional interdependency rather than in siloes, and a smooth transition into Matrix team leadership.\n- Living a consumer-driven culture, each market being an engine of growth.\n- A winning culture for the APAC leadership team.\n\n**Track 2 (Country Transformation): Coca-Cola Japan.** Over 25 LT leaders in Coca-Cola Japan were able to tap into their strengths and manage interferences, such as fears, insecurities and limiting beliefs. There was a deep and neglected need for emotional assurance and authenticity in the leadership team that was unleashed in this transformation. Results reported included:\n- Emotional needs of being included, understood, and supported were nurtured and created a sustainable environment of psychological safety.\n- Inspired to innovate and create a speak-up culture.\n- Invigorated courage.\n- Executed acceleration plans to deliver breakthrough performance for Coca-Cola's leadership in the Tokyo Olympics.",
    },
    story: {
      challengeHeadline: "",
      approachHeadline: "",
      outcomeHeadline: "",
      markets: "APAC, 32 markets, and Japan",
      partnershipYears: "From 2018, 18 months",
      impactFigures: [
        { value: "18", label: "APAC leadership team members" },
        { value: "32", label: "markets" },
        { value: "25", label: "leadership team members, Japan" },
        { value: "18", label: "months" },
      ],
      scaleFigures: [],
      services: [],
      service: "high-performing-teams",
      moreQuotes: [
        {
          quote:
            "Thank you for the great couple of days with my Japan LT, and the DNA fitness report which summarizes well the key findings and priorities. Refreshing breakthroughs!",
          quoter: "Jorge Garduno, Coca-Cola, Japan",
        },
        {
          quote:
            "We continue to invest for sustainable growth in the future, and we remain very focused on raising the performance bar everywhere to capture the opportunity available to us.",
          quoter: "John Murphy, Chief Financial Officer and Executive Vice-President, Global Executive Team, Coca-Cola",
        },
      ],
    },
  }),
  article({
    slug: "levis",
    tags: ["Executive Coaching"],
    title: "Levi Strauss & Co.",
    logoUrl: "/logos/client-logos/levis.png",
    coverUrl: "/cases/levis-cover.jpg",
    quote: "The impact has truly been profound.",
    facts: [
      { label: "Countries", value: "Greater China" },
      { label: "Participants / Leaders", value: "36 leaders" },
    ],
    body: {
      challenge:
        "Levi Strauss opened its first Beacon flagship store in Wuhan in 2019. Within months the Greater China leadership team was reconfigured under a new managing director, working through the start of the pandemic in the city where it began. Trust and collaboration had to be built while unlearning siloed, pressure driven ways of working.",
      approach:
        "An intensive leadership development and executive coaching programme across 2018 to 2020 with 36 leaders, focused on integrating the team, aligning organisational values with individual mindsets, and building resilience that would hold under genuine crisis rather than in a workshop.",
      outcome:
        "36 leaders in the China leadership team were able to directly apply their learnings from the program and saw increased performance and motivation in their team members. CorporateDNA acted as allies and coaches through this personal and organizational development journey, where these leaders were inspired to be catalysts in shaping organizational culture and behaviours:\n- A team that possesses the readiness and credibility to successfully deliver large-scale growth in the China market, multiple times.\n- A renewed reputation as a Winning Team, and recognition in global leadership and by the CEO of Levi Strauss for their deep and committed transformation.\n- A sustainable and psychologically safe working relationship in the team, fuelled by connection, motivation, and based on what each leader values the most.\n- Clear alignment of organizational values and mindsets, that opened hearts and built self-awareness, for breakthrough performance during a crisis.\n- A sense of a strengthened inner self in each leader, with resilient business mindsets that put the organization first.\n- The agility and confidence to bring a positive spin to adversity and frustrations; to fail forward so that a legacy can be built upon challenges faced today.\n- A 'dream team' and winning culture for the Levi Strauss China leadership team.",
    },
    story: {
      challengeHeadline: "",
      approachHeadline: "",
      outcomeHeadline: "",
      markets: "Greater China",
      partnershipYears: "2018 to 2020",
      impactFigures: [
        { value: "36", label: "leaders, Greater China leadership team" },
        { value: "3", label: "years, 2018 to 2020" },
      ],
      scaleFigures: [],
      services: [],
      service: "executive-coaching",
      moreQuotes: [
        {
          quote:
            "It was a series of great sessions filled with \"Super-Charge\". It was awesome the way you lead this, and I thoroughly enjoyed it. I'm confident you will both challenge and develop us, and we will be all the stronger for it. Not all of it is comfortable but it is what we need!",
          quoter: "Greater China LT, Levi Strauss & Co.",
        },
        {
          quote:
            "We continue to embrace disruption, which could be the best stimulus for transformation. Change is usually hard but in a moment of crisis, it is a given. This crisis also gives us unique opportunities to take moves which in normal times could have been impossible.",
          quoter: "Amy Yang, Managing Director of Greater China, Levi Strauss & Co.",
        },
      ],
    },
  }),
  article({
    slug: "unilever",
    tags: ["High Performing Teams"],
    title: "Unilever",
    logoUrl: "/logos/client-logos/unilever.png",
    coverUrl: "/cases/unilever-cover.jpg",
    quote:
      "Our people have been our absolute priority throughout 2020, and because of them we've been able to meet the needs of consumers and grow our business.",
    quoter: "Leena Nair, Chief HR Officer, Unilever",
    facts: [
      { label: "Countries", value: "6 countries, four continents" },
      { label: "Impact", value: "3 flagship programmes rolled out globally" },
    ],
    body: {
      challenge:
        "From 2020 to 2021 Unilever merged supply chain and procurement under a new leadership team led by a global executive team member, in the middle of a pandemic that was disrupting both functions at once. The team had to become a team and deliver a merger simultaneously.\n\nThe work spanned 4 culturally and commercially diverse continents and 6 countries, including North America, South America (Argentina), Europe (Italy), the U.K., and Asia (Singapore and the Philippines). The mandate focused on key areas of change:\n- Ambitioning and purpose-setting.\n- Stakeholder-centricity: understanding stakeholder needs, setting expectations against dependencies and timelines, and feedback.\n- Clarity in communication, working processes, and alignment on new standards of leadership.",
      approach:
        "A two part inner and outer game model applied to the Standards of Leadership, then built into three flagship programmes rolled out globally as Unilever's partner: Leading Through Change for intact teams, Partnering Through Change for teams supporting a transformation, and Thriving Through Change for line leaders at any scale. Separately, a three month coaching journey with the Philippines board, and two days of delivery designed in 24 hours after the merger team had stalled for two months.\n\nHow we have partnered with Unilever globally:\n- Inner and Outer Game: Leaders and Teams\n- Leading through Change\n- Partnering through Change\n- Thriving through Change\n- Board Development Coaching: Unilever Philippines\n- Commercial Operations: Change Transformation",
      outcome:
        "Through the work we undertake with Unilever across teams and businesses, the results include:\n- A deepened sense of shared purpose, alignment of expectations and team goals, understanding and authenticity through sharing best and worst selves, and exploring points of friction and vulnerabilities.\n- A greater capacity for agility and decisiveness, through renewed intent, interdependent partnerships, validating areas of focus, establishing objectives, and points of integration.\n- Psychological safety through courageous conversations, defining and celebrating success, milestones, and proof points to see the shifts that are needed to win, and overcoming fears and limitations.\n- An increased focus on building stakeholder-centricity.\n- General Managers owning and living the transformation with courage, authenticity, and grit.\n- Building a visible change mindset at the grassroots.\n\nBeing purpose and values-led enabled Unilever to make quicker, conscious decisions in a challenging global landscape, revitalized the organization and a sustainable way of working, and emerged stronger through the Standards of Leadership expected of individual leaders.",
    },
    story: {
      challengeHeadline: "",
      approachHeadline: "",
      outcomeHeadline: "",
      markets: "6 countries, four continents",
      partnershipYears: "2020 to 2021",
      impactFigures: [
        { value: "3", label: "flagship programmes rolled out globally" },
        { value: "6", label: "countries, four continents" },
      ],
      scaleFigures: [],
      services: [],
      service: "high-performing-teams",
      moreQuotes: [
        {
          quote:
            "Putting purpose at the heart of all our brands is not only the right thing to do; we know it drives superior performance and growth.",
          quoter: "Sunny Jain, President, Beauty & Personal Care, Unilever",
        },
      ],
    },
  }),
];

const bySlug = new Map(LOCAL_CASES.map((c) => [c.slug, c]));

export function localCaseArticle(slug: string) {
  const article = bySlug.get(slug);
  return article
    ? { ...article, heroCoverUrl: CASE_HERO_COVERS[slug] ?? article.coverUrl }
    : null;
}

export function localCaseListEntries() {
  return LOCAL_CASES.map((c) => ({
    slug: c.slug,
    client: c.title,
    coverUrl: c.coverUrl ?? CASE_HERO_COVERS[c.slug],
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
