# Corporate DNA — Consolidated Implementation Status

**In response to the consolidated brief of 27 Aug 2026 (final review with Rhea and the team; the eight core Solutions confirmed).** Prepared by: Beto & Cadu / Dev em Dobro. Date: 2026-08-27. Scope: the public website only (the content system is a separate project that the site feeds from).

> This update supersedes the 10-08 status for anything the 27-08 brief addresses. The brief is treated as the single source of truth: where it conflicts with earlier direction on content, architecture or design, the brief wins.

**Target: 1 September 2026** — three working days from this update.

---

## How to read this

Every item is tagged with who owns the next move. *(CDNA = the Corporate DNA content owners; "content system" = the tool your team uses to edit page text.)*

| Label | Meaning |
| :---- | :---- |
| **Done (live on beta)** | Built, deployed and validated on the current beta site. |
| **Requires CDNA content or approval** | Waiting on CDNA — needs new text, a fact/number to be confirmed, or a sign-off before it can go live (e.g. any client name, logo, quote or figure). |
| **Requires design** | Waiting on Guli's creative direction before it can be built. |
| **Content-system edit (our team)** | A text edit our team makes directly in the content system — no new build, no CDNA sign-off unless the wording itself is CDNA's. |
| **Recommended immediately after launch** | Safe to add right after a solid launch. |
| **Impact on scope or timeline** | A note about scope or timing, not a task in itself. |

---

## Part A — What this brief changes from the 05 Aug brief

Recorded so the reversals are visible, since several were reviewed and approved in their earlier form. All five are being actioned.

| Was (05-08, currently live) | Becomes (27-08) |
| :---- | :---- |
| Headline retained as "When the stakes are high, leadership must become real." | **"Keeping Leadership Real"** is the primary proposition; the earlier line moves into the narrative. |
| Navigation of seven items | Navigation of nine items, with a materially different information architecture. |
| Compiled testimonial reel retained, heading "What global leaders say about us" | Compiled reel **removed**; replaced by individual, per-client testimonial videos. |
| Seven outcome-led Solutions (CEO & Top Team Transformation, Talent & Succession, CHRO / HRLT Effectiveness…) | **Eight confirmed Solutions** with different names (see Part E). |
| `About` as a single area; `Client Impact` as a single area | `About` splits into **Our Identity** + **Our Team**; `Client Impact` splits into **Our Clients** + **Our Impact**. |

---

## Part B — Delivered today (27 August)

**Status: built, type-checked and building clean.**

We have split the brief into **content structure**, which we build now because it depends on no design decision, and **page layout**, which goes to Guli first so he can propose it and agree it with you before it reaches the site. That way you review a design rather than a live page.

**Content structure — done:**

5. **Team Climate Assessment removed** from "Proprietary frameworks and diagnostics we own" → it is no longer presented as proprietary IP. This also closes the "name & overview pending CDNA confirmation" flag it had carried since 06-08. **Done**.
7. **Navigation, first pass** → "Home" now appears as an explicit item alongside the clickable logo; "Solutions" is now "Our Solutions"; "Our Books" is promoted to top level and pluralised. **Done**.
8. **Three new content areas** → Partnerships (item 12), the running ticker (item 17) and individual client testimonial videos (item 13) are now manageable in the content system with the fields the brief specifies. Partnerships requires the "what this partnership enables for our clients" answer, because the brief is explicit that a logo or an announcement is not enough. **Done — ready for content.**
9. **Case header band is now editable** → every case can carry *Countries · Participants/Leaders · Reach/Scale · Intervention · Impact*, and the case page opens with them before the story, exactly in that order. Slots left blank simply do not appear. **Done — ready for your team to fill in.**
10. **The five Solution blocks are now editable** → each Solution page is structured as *The Challenge → The Outcome → How Corporate DNA Helps → Evidence → Start a Conversation*, with a field to nominate the one flagship case per Solution. The old free-form body is retained but demoted to "further detail (optional)", with a note in the editor that the brief asks for radically shorter pages. **Done — ready for re-authoring.**
11. **Quote guidance built into the editor** → the quote fields on cases and Solutions now carry an on-screen note that they must be testimonials about Corporate DNA rather than generic client corporate quotes, and that they require CDNA approval before publishing. **Done**.

**Homepage layout — with Guli, not yet on the site:**

The homepage hierarchy the brief calls for — the "Keeping Leadership Real" headline, a short visual treatment of *real pressures, real politics, real choices, real judgement, real people, real consequences*, and proof moving ahead of explanation — is composition, not content. Guli will propose it and agree it with you before it is applied, so the published homepage is unchanged for now. The compiled testimonial video (item 13) therefore also stays up until that pass lands, since removing it changes the page's shape.

**Requires design**

---

## Part C — Preserved, as the brief requires (item 18)

No action needed; confirmed in place.

Headless architecture · content system · security (lead-form time-trap and per-IP rate limiting) · Cloudflare/cutover · analytics and SEO (metadata, canonicals, sitemap, structured data, legacy redirects) · responsive foundation · **editable statistics** · **author approval controls** · **Reports & Resources capability** · proof components (the "Client Perspective" block on Solution pages) · multilingual readiness · reusable components · infrastructure ownership · the 5H Framework and its 25 dimensions under Our Approach · awards · the Paul Polman endorsement in the Book section.

---

## Part D — Requires design (Guli)

The six priorities named in the brief. Nothing here will be invented in code ahead of the design.

1. **Homepage visual hierarchy** — the Claim → Proof → Explanation ordering.
2. **Solutions visual system** — recovering the force of the old site's black boxes / coloured bars in a modern interpretation.
3. **5H visual language** — the 5H wheel, Inner Game / Outer Game, the five Hs and the 25 dimensions reading as one visual system. Today the unexplained highlighting of a single H and the DNA-strand imagery read as disconnected.
4. **Our Clients / Our Impact** — the logo wall for immediate credibility, and a highly visual impact page (numbers, quotes, proof blocks).
5. **Team treatment** — group photograph, black-and-white portraits, natural expressions.
6. **Overall reduction of text and scrolling**, and recovery of visual energy.

> **Impact on scope or timeline.** Design is the real critical path. If the direction lands after Friday 28 August, what goes live on 1 September is the new architecture and new copy running on the current visual system, with the visual expression following the week after.

---

## Part E — Requires CDNA content, assets or approval

Ordered by what blocks the launch.

1. **Flagship case for Manager Development and for Executive Coaching** — both marked TBC in the brief. The other six are set: Heineken, GSK (×2), Frasers Property, Shell, adidas.
2. **Approval of every client name, logo, quote and metric** before production, per the brief.
3. **Testimonials about Corporate DNA** rather than generic corporate quotes — in the John Murphy / Jorge Gardino mould. Existing generic quotes need replacing, which is content re-authoring.
4. **Our Partnerships copy** — for each partnership, what it enables for clients (Harvard, Imperial, Emeld AI, Explore Performance, TerraGrin). The brief notes names and final text are still to be validated.
5. **Team assets** — group photograph, black-and-white portraits, and the final list of who appears.
6. **Ticker content**, 2023 onwards — awards, new regions, new offices, new partnerships, milestones.
7. **Re-authoring of the eight Solutions** in the content system, in the short five-block format: The Challenge / The Outcome / How Corporate DNA Helps / Evidence / Start a Conversation. The confirmed names are: ExCo / Top 150 · Culture Transformation · Talent Development · Manager Development · Women in Leadership · High Performing Teams · HRLT Effectiveness · Executive Coaching. Inclusion & Diversity and Asian Talent Development are retired as core Solutions, with any useful content absorbed into the eight.
8. **Case discovery taxonomy** — with industry no longer the primary logic, cases need re-tagging against the new Solutions. **Content-system edit (our team)**, but it depends on point 7 landing first.
9. **The approval list sent on 06 August is still outstanding** — the inconsistent figures (95% / 26 countries / ten years / ©2021 against the corporate 36 countries / 18 years). Until it returns, those figures stay as they are.

---

## Part F — Recommended immediately after launch

Explicitly unblocked by the brief; none of it holds 1 September.

- The three new testimonials (Dyson, adidas, one TBC).
- The new contemporary Corporate DNA video built around *Keeping Leadership Real*, replacing the Heineken/founder video. The structure can be prepared now; production follows.
- Remaining individual testimonial videos (Yolanda/Heineken, Andrew Morovski, Sonali, Fred/adidas) as they arrive through the content system.
- Accessible captions (.vtt) for the video content.
- Fine pruning of legacy redirects using the client's Google Search Console.

---

## Part G — Impact on 1 September: a two-wave proposal

The calendar, because it drives everything below:

| | |
| :---- | :---- |
| Thu 27 Aug | Brief received |
| Fri 28 Aug | |
| Sat 29 – Sun 30 Aug | Weekend |
| Mon 31 Aug | Screens submitted for CDNA approval |
| Tue 1 Sep | **Launch** — and the day of the review |

For the new visual expression to be live on 1 September, the chain is: design → CDNA approval (the brief is explicit that nothing reaches production without it, and Rhea holds final say on brand) → implementation → QA → deploy. If approval lands on the Tuesday, there is no day left to implement. Working backwards, we would need **approved** screens by Friday 28 — that is, design delivered today. This is calendar arithmetic, not a question of effort.

Two factors reinforce it. First, the approval cycle is not typically a single day — the list we sent on 06 August has been open for three weeks. Second, and more significant: **content blocks before design does.** Even with approved screens, we would still be missing the Partnerships copy (which the brief itself marks as not yet validated), the team photography, the two TBC flagship cases, and the re-authoring of the eight Solutions.

We therefore propose treating 1 September as an **architecture and content** release, with the visual redesign as a second milestone.

**Wave 1 — 1 September**

New proposition and copy (delivered), proof reordering (delivered), the new information architecture, the eight Solutions in the short five-block format, the case header fields (Countries → Participants → Reach → Intervention → Impact), the removals already made (Team Climate Assessment, compiled video), the running ticker and the Our Clients logo wall. Running on the current visual system.

Navigation live, with real content behind every item: `Home | Our Identity | Our Solutions | Our Approach | Our Clients | Our Impact | Our Books`.

`Our Partnerships` and `Our Team` will have their routes built and held out of the menu, going live as soon as validated text and photography arrive — with no further architecture work. Publishing the full navigation on day one would mean menu items that open empty pages, which is the opposite of "Does this feel unmistakably CorporateDNA?"

**Wave 2 — date to be set**

The 5H as a single visual system, the Solutions black boxes / coloured bars, Our Impact, and the team treatment. The date follows from design delivery plus your approval time — not from our build time. Everything structural will be ready to receive the design, so it becomes application rather than construction.

Guli has already been asked to start looking at this. The one piece still missing to set the date is his committed delivery date for the screens.

**To be clear on what wave 1 is not:** 1 September will not look identical to today. The ticker, the logo wall and the reduction of text and scrolling (item 16) are real visual gains that do not depend on new screens.

If CDNA prefers to hold everything for a single release, or to keep the full nine-item navigation on day one with partial pages, those are your calls — we would rather not take them unilaterally.

---

## Part H — Materially outside the agreed scope

Raised for a decision, not declined.

- **Our Books supporting multiple authors** — the agreed scope covered one book. Multi-author support is a new content type plus a listing page. Suggestion: ship "Our Books" in the plural on 1 September pointing at Rhea's book, and build the listing when a second book exists.
- **Dashboards on Our Impact** — if this means live data visualisation (filtering by region, industry or year), it is a new build. If it means a strong visual treatment of static numbers, it fits.
- **CMS-managed running ticker** — small, but a new content type.
- **Modular per-client video structure** — replaces a single embedded video with a managed collection; also a new content type.

---

## Part I — Open questions

1. **Insights is absent from the nine-item navigation.** It houses the editorial library and the Reports & Resources capability that item 18 asks us to preserve. Assumed to be an omission; kept live pending your confirmation.
2. **"Start a Conversation" is also absent.** It is the lead-capture call to action, wired to the form and to regional routing. Kept as the header button pending confirmation.
3. **Our News → Our Partnerships:** the new site has no "Our News" — the editorial area is Insights. Understood as Partnerships being a *new* area, with Insights continuing separately. Please confirm.
4. **Talent Development (global)** — does this close the outstanding "Asian Talent Development" question? Assumed yes, with the regional material absorbed into the global page.
5. **The 05-08 outcome-led taglines** — retired along with the old names, or retained underneath the eight confirmed names?
6. **GSK appearing against two Solutions** — please confirm these are clearly distinct interventions, as the brief requires.
