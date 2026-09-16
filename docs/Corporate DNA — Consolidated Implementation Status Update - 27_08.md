# Corporate DNA — Consolidated Implementation Status

**In response to the consolidated brief of 27 Aug 2026 (final review with Rhea and the team; the eight core Solutions confirmed).** Prepared by: Dev em Dobro. Date: 2026-08-28. Scope: the public website only (the content system is a separate project that the site feeds from).

> This update supersedes the 10-08 status for anything the 27-08 brief addresses. The brief is treated as the single source of truth: where it conflicts with earlier direction on content, architecture or design, the brief wins.

**Target: 1 September 2026.** Parts A and B are what stands between here and that date.

---

## How to read this

Part A is what has been built since the brief. **Parts B and C are the ones that matter for the date**: what we need from CDNA, and what we need from Guli. Everything after them is context — what is preserved, and what can follow later.

*(CDNA = the Corporate DNA content owners; "content system" = the tool your team uses to edit page text.)*

| Label | Meaning |
| :---- | :---- |
| **CDNA** | Waiting on CDNA — new text, a fact to confirm, or a sign-off (any client name, logo, quote or figure). |
| **Guli** | Waiting on creative direction before it can be built. |
| **Us** | Ours to do — no new build or sign-off needed. |
| **After launch** | Safe to add once the site is live. |

---

# Part A — Delivered (27–28 August)

Built, type-checked and building clean.

We split the brief into **content structure**, which depends on no design decision, and **page layout**, which goes to Guli first. That way CDNA reviews a design rather than a live page.

1. **The eight Solutions are registered** in the content system, in the brief's order, each with the five blocks and a flagship field. The four that did not exist — ExCo / Top 150, Talent Development, Manager Development, HRLT Effectiveness — were created as drafts, so nothing incomplete can reach the site.
2. **The five Solution blocks are editable** → *The Challenge → The Outcome → How Corporate DNA Helps → Evidence → Start a Conversation*. The old free-form body is retained but demoted to "further detail (optional)", with an editor note that the brief asks for much shorter pages.
3. **The case header band is editable** → *Countries · Participants/Leaders · Reach/Scale · Intervention · Impact*, rendering at the top of the case before the story, in that order. Blank slots simply do not appear.
4. **Three new content areas** → Partnerships (item 12), the running ticker (item 17) and individual client testimonial videos (item 13), with the fields the brief specifies. Partnerships requires the "what this enables for our clients" answer.
5. **Team Climate Assessment removed** from "Proprietary frameworks and diagnostics we own". This also closes the confirmation flag it had carried since 06-08.
6. **Quote guidance built into the editor** → quote fields now carry an on-screen note that they must be testimonials about Corporate DNA, and that they need CDNA approval before publishing.
7. **Navigation aligned to item 3** → "Home" appears explicitly alongside the clickable logo; "Solutions" becomes "Our Solutions"; "Our Books" is promoted to top level and pluralised. **Insights and the "Start a Conversation" button have been removed from the header**, since neither appears in the brief's list. Insights stays reachable from the footer — item 18 requires the Reports & Resources capability to be preserved, and a page nothing links to is preserved in name only. "Start a Conversation" continues as the closing block of every Solution page, as item 5 sets out. `Our Partnerships` and `Our Team` have their routes built but stay out of the menu until their content arrives: a menu item that opens an empty page is worse than one that arrives late.

---

# Part B — What we need from CDNA

Ordered by what most holds the launch.

| # | What | Why it blocks |
| :---- | :---- | :---- |
| 1 | **Copy for three Solutions**: ExCo / Top 150, Manager Development, HRLT Effectiveness | No content exists for these three. The other five are covered — see the note below. |
| 2 | **Approval of every client name, logo, quote and metric** | The brief is explicit that none of these reach production without sign-off. |
| 3 | **Testimonials about Corporate DNA**, in the John Murphy / Jorge Gardino mould | The existing quotes are generic corporate quotes; replacing them is content re-authoring, not editing. |
| 4 | **Our Partnerships copy** — what each partnership enables for clients (Harvard, Imperial, Emeld AI, Explore Performance, TerraGrin) | The brief marks names and final text as not yet validated, and says a logo alone is not enough. |
| 5 | **Team assets** — group photograph, black-and-white portraits, final list of who appears | Our Team cannot go live without them. |
| 6 | **Flagship cases** — see the note below | Four of the eight Solutions currently have no usable flagship. |
| 7 | **Ticker content**, 2023 onwards — awards, new regions, new offices, partnerships, milestones | The area is built and empty. |
| 8 | **What remains of the 06-08 approval list** — the `©2021` footer on Our Approach, the client-specific home metrics (Heineken 45%, Coca-Cola 43 leaders, Shell 2,582 women leaders) and the awards (names, dates, descriptions) | Until these return, they stay on the site as they are. |

**On the eight Solutions — and one question.** All eight now exist in the content system, in the brief's order, with the five blocks and the flagship field ready. Five of them already carry copy CDNA approved in the earlier cycle: Culture Transformation, Women in Leadership, High Performing Teams, Executive Coaching, and the Asian Talent Development material serving Talent Development. Since item 5 asks for radically shorter pages, the text largely exists — it is in the wrong format rather than missing.

So there are two ways to handle those five, and we would rather CDNA chose than assume:

- **We condense them**, working only from the copy CDNA already approved, and leave the result in the content system for CDNA to review and adjust. Faster, and it reduces the writing to the three Solutions in row 1. The caveat is that it means us editing wording Rhea signed off on — shortening is an editorial act, even when no new claim is introduced.
- **CDNA sends the shortened text**, and we place it. Slower, but the wording stays entirely in CDNA's hands.

Our recommendation is the first, with CDNA reviewing everything in the content system before anything is published. Either way, nothing goes live without sign-off.

**On the flagship cases.** The brief maps one flagship per Solution (item 6). Four of the eight are resolved and already set in the content system: ExCo / Top 150 → Heineken, Culture Transformation → GSK, Women in Leadership → Shell, High Performing Teams → GSK. The remaining four are not:

- **Manager Development** and **Executive Coaching** — marked TBC in the brief.
- **Talent Development → Frasers Property** and **HRLT Effectiveness → adidas** — named in the brief, but **neither exists as a case study** in the content system. We have left the field empty rather than point at something that does not resolve.

Also for confirmation: the brief maps **GSK against two Solutions**. It allows this where the interventions are clearly distinct — please confirm they are.

---

# Part C — What we need from Guli

The six priorities the brief names. None of this will be invented in code ahead of the design.

| # | What | Note |
| :---- | :---- | :---- |
| 1 | **Homepage visual hierarchy** | The Claim → Proof → Explanation ordering. The most cascading of the six. |
| 2 | **Solutions visual system** | The old site's black boxes / coloured bars in a modern reading. Defines cards, detail pages, and probably carries into Our Clients and Our Impact. |
| 3 | **Our Clients / Our Impact** | The logo wall for immediate credibility; a highly visual impact page — numbers, quotes, proof blocks. |
| 4 | **Team treatment** | Group photograph, black-and-white portraits, natural expressions. Depends on CDNA assets (Part B, row 5). |
| 5 | **5H visual language** | The wheel, Inner Game / Outer Game, the five Hs and the 25 dimensions reading as one system. Note that **the wheel and the 25 dimensions are not on the new site** — they live on the old `/our-approach` and would need rebuilding, so this is more work than a restyle. The most self-contained of the six, though: it can come last without blocking anything. |
| 6 | **Reduction of text and scrolling**, recovery of visual energy | Applies across the site. |

**One constraint worth flagging before he draws.** The content structure is already built, and it **fixes how many fields exist**: the case band has exactly five values, and a Solution page has exactly five blocks, both in the brief's order. A design built around a different number of slots would have no content behind it.

**Working model agreed on 28-08:** Guli proposes in Figma and agrees it with CDNA; only then do we apply it to the site. That is why the published homepage is unchanged for now.

---

# Part D — Preserved, as item 18 requires

No action needed; confirmed in place.

Headless architecture · content system · security (lead-form time-trap and per-IP rate limiting) · Cloudflare/cutover · analytics and SEO (metadata, canonicals, sitemap, structured data, legacy redirects) · responsive foundation · **editable statistics** · **author approval controls** · **Reports & Resources capability** · proof components · multilingual readiness · reusable components · infrastructure ownership · the 5H Framework under Our Approach · awards · the Paul Polman endorsement in the Book section.

**One correction we should flag.** Item 10 asks us to keep the 5H wheel and its 25 dimensions. On checking, **the wheel is not on the new site** — it exists only on the old one, at `/our-approach`. What the new site carries is the DNA-helix diagram of the Inner Game / Outer Game and the five Hs; the segmented wheel with the 25 named dimensions (Critical Thinking, Decision Making, Empathy, Accountability, Transparency and so on, five per H, around a CORE of values, beliefs and drivers) was never rebuilt. So this is a build item, not a preservation one — it belongs with Guli's 5H work in Part C rather than here.

---

# Part E — 1 September: production, or review?

This is the decision we most need, because it changes the plan.

`corporatednaconsulting.com` still serves the previous site — what has been under review is a staging URL. So "launch" can mean two things.

**If it means going live in production on the 1st**, the date is tight. Not because of the domain: pointing it at the new platform is two DNS records, a matter of minutes, and we have held the necessary Cloudflare access since 13 August. The pressure is that it leaves roughly one working day to apply whatever content and design arrive, run QA, and for CDNA to review a large set of changes.

**Our suggestion is to treat Monday 31 August as a review release.** Everything goes up in a review environment; CDNA navigates it and sends adjustments. As the outstanding content arrives we apply it, CDNA does one further review round, and we publish on approval. Publishing itself is quick — it is releasing something already seen and signed off, rather than reviewing something already public.

If CDNA prefers to hold 1 September as a firm publication date, that works too. It depends on the content and the review arriving in time.

---

# Part F — Recommended immediately after launch

Explicitly unblocked by the brief; none of it holds the date.

- The three new testimonials (Dyson, adidas, one TBC).
- The new contemporary Corporate DNA video built around *Keeping Leadership Real*, replacing the Heineken/founder video. Structure can be prepared now; production follows.
- Remaining individual testimonial videos (Yolanda/Heineken, Andrew Morovski, Sonali, Fred/adidas) as they arrive.
- Accessible captions (.vtt) for video content.
- Fine pruning of legacy redirects using Google Search Console.

---

# Part G — Materially outside the agreed scope

Raised for a decision, not declined.

- **Our Books supporting multiple authors** — the agreed scope covered one book. Suggestion: ship "Our Books" in the plural pointing at Rhea's book, and build the listing when a second book exists.
- **Dashboards on Our Impact** — live data visualisation (filtering by region, industry, year) is a new build. A strong visual treatment of static numbers fits.
- **CMS-managed running ticker** and **modular per-client video structure** — both small, but both new content types that were not in scope.
