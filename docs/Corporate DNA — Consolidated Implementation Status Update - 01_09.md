# Corporate DNA — Consolidated Implementation Status

**In response to the consolidated brief of 27 Aug 2026, and to Guli's design passes of 29 and 31 Aug.** Prepared by: Dev em Dobro. Date: 2026-09-01. Scope: the public website only (the content system is a separate project that the site feeds from).

> This update supersedes the 30-08 status. The brief remains the single source of truth: where it conflicts with earlier direction on content, architecture or design, the brief wins. Where it conflicts with the design mock, we have said so explicitly rather than choosing quietly.

**Target was 1 September 2026 — today.** The build side of that target is met: everything in Part A is live on the review site, and the eight Solutions are now in its database rather than only in the schema. **What is not met is content.** Part B is no longer a list of refinements; it is the set of empty fields that keeps eight Solution pages and eight case studies from being publishable. Part C is what is still with Guli.

---

## How to read this

Part A is what has been built. **Parts B and C are the ones that matter for the date**: what we need from CDNA, and what is still with Guli. Everything after them is context.

**Everything in Part A is on the review site now**, including the navigation change and both of Guli's design passes. Two things to know before you look, neither of them a design question:

- **The Solutions menu now lists the eight confirmed names**, in the order of your 27-08 email. This was the one gap flagged in the 30-08 update and it closed today: the switch-over was applied to the review site's database. The retired entries — Inclusion & Diversity, Asian Talent Development, Leadership Development, Talent & Succession — were unpublished rather than deleted, and every line of their text was carried across to the Solution that replaces them.
- **The ticker is live with the first two entries**, recovered from the old site's strip and filtered by item 17's 2023 cut — see B10.

| Label | Meaning |
| :---- | :---- |
| **CDNA** | Waiting on CDNA — new text, a fact to confirm, or a sign-off (any client name, logo, quote or figure). |
| **Guli** | Waiting on creative direction before it can be built. |
| **Us** | Ours to do — no new build or sign-off needed. |
| **After launch** | Safe to add once the site is live. |

---

# Part A — Delivered

## Since the 27-08 brief

1. **The eight Solutions have a home in the content system** — the five blocks and a flagship field, ready to hold them. The entries themselves followed on 01-09; see item 18.
2. **The five Solution blocks are editable** → *The Challenge → The Outcome → How Corporate DNA Helps → Evidence → Start a Conversation*. The old free-form body is retained but demoted to "further detail (optional)".
3. **The case header band is editable and rendering** → *Countries · Participants/Leaders · Reach/Scale · Intervention · Impact*, at the top of the case before the story. Blank slots do not appear.
4. **Three new content areas** → Partnerships (item 12), the running ticker (item 17) and individual client testimonial videos (item 13).
5. **Team Climate Assessment removed** from "Proprietary frameworks and diagnostics we own".
6. **Quote guidance built into the editor** — quote fields carry an on-screen note that they must be testimonials about Corporate DNA and need approval before publishing.
7. **Navigation aligned to item 3.** "Home" appears explicitly; "Our Solutions" and "Our Books" renamed. Insights and the "Start a Conversation" button left the header, as neither appears in the brief's list; Insights stays reachable from the footer, because item 18 requires the Reports & Resources capability to be preserved and a page nothing links to is preserved in name only. Our Partnerships and Our Team have routes but stay out of the menu until their content arrives.

## Since Guli's 29-08 design pass

8. **Homepage — the new hierarchy (items 1 and 2).** "Keeping Leadership Real" is the headline, with the approved sub-line, and CEOs, CHROs & CLOs now appear on the first screen. "When the stakes are high" moved into the sub-line, as the brief asks. The logo wall and the statistics moved above "What we solve", so the page runs Claim → Proof → Explanation, and **90% Chairman/CXO now leads the figures** instead of 18 years.
9. **"Keeping Leadership Real" is now explained, not just asserted.** A block sits under the hero carrying the six terms from item 1 — real pressures, real politics, real choices, real judgement, real people, real consequences — and nothing else. A framing sentence would have been invented copy. **Its treatment changed on 01-09 and is still with Guli** — see C1.
10. **The running ticker is back at the top of the page**, directly under the navigation, where the old site carried it. It now carries the two entries from the old strip that clear item 17's 2023 cut — see B10.
11. **The compiled testimonial video has been removed** from the public site (item 13). The modular structure for individual films is built and waiting.
12. **Solutions now use the black boxes** (item 5), in a modern reading of the old site's treatment.
13. **Our Clients rebuilt** (item 8), in the order the item sets out: the logo wall first for immediate credibility, then **Client Stories** — the branded client bands — for depth, then the real global-footprint map and the closing photograph you supplied. **As far as build goes we consider this page finished — it needs your confirmation rather than more work.**
14. **Our Impact rebuilt** (item 9) in the sequence the mock lays out: figures → "Our clients say" → Our Social Impact → per-engagement results → Awards.
15. **The 5H explorer rebuilt** (item 10) with **all 25 dimensions**, transcribed from your own wheel. Content sits above the controls, at a fixed height, with the Inner/Outer Game rule inverting as you move between them.
16. **Our Identity now carries the seven blocks item 4 lists** — including Our Purpose, Keeping Leadership Real and the 5H reference, none of which existed. All are deliberately empty; see Part B.
17. **A separate `Headline` field for case studies.** The mock leads a case on its outcome rather than the client's name. The client name field also resolves the brand logo and the band colour, so the two are now separate fields — writing the headline into the old one silently removed both.

## Since the 30-08 update

18. **The eight Solutions are now live in the review site's database**, published, in the order of your 27-08 email: ExCo / Top 150, Culture Transformation, Talent Development, Manager Development, Women in Leadership, High Performing Teams, HRLT Effectiveness, Executive Coaching. Until today the site was still serving the pre-brief set. The twelve older entries were unpublished, not deleted, and their text, banners and proof blocks were carried across.

19. **Manager Development exists as a Solution for the first time.** It had been folded into a single entry called "High-Performing Teams & Manager Impact". Item 5 lists the two separately and item 6 gives them different flagship cases, so we split them. It has no text of its own yet, because there was no source page to carry across.

20. **Four flagship cases are wired**: Heineken to ExCo / Top 150, GSK to Culture Transformation and to High Performing Teams, Shell to Women in Leadership. The other four are in B5.

21. **The case header band is populated for GSK, Heineken and Unilever** — countries, participants, reach and intervention. The figures were not written by us: all three cases already carried an "At a glance" list inside the body text, which is exactly what the band was built for. We moved it into the fields and removed the duplicate from the prose. **The Impact slot is empty in all three, and in five of the other cases** — see B14.

22. **Redirects updated for the retired Solutions.** The old site's `/our-services/…` URLs pointed at pages that no longer exist. Asian Talent Development now resolves to Talent Development. Two of them need a decision from you rather than a default — see B12.

23. **Guli's 31-08 pass is applied**: Client Impact on the brand colour, the offices block darkened to separate it from the book card, photography filling its frame instead of letterboxing, and the diagonal CTA sweep rebuilt so the red crosses the button rather than leaving a wedge.

24. **The "Keeping Leadership Real" block is now one continuous sentence**, per Guli's answer today. The heading and the cycling line carry the same size and sit at normal line spacing: *"Our purpose is to make leadership real. Real pressures…"* On phones it breaks where he specified. It had been a heading with a smaller line underneath, which read as a caption rather than the sentence continuing.

25. **The hero's opening line was unreadable and is fixed.** *"Global leadership advisory & executive coaching"* sat in the brand red over the photograph, at a measured contrast of **1.29:1** — the red and that sky are almost the same brightness, so the line effectively disappeared. It is now white, at 6.3:1. The brand red stays in the hero where it works: as the fill behind "Results, Not Promises." This follows what we already do on the other dark sections, and it is worth knowing that on that photograph there is no readable version of the red — darkening the image enough to carry it would cost the iceberg.

---

# Part B — What we need from CDNA

Ordered by what most holds the launch.

### B1 · Our Identity — the whole page **[CDNA]**

Seven blocks are built and every one is empty. This is the largest content dependency in the project, and the page where we would most prefer not to guess.

**Item 4 of your 27-08 e-mail sets this page out in detail**, which helped a great deal: Our Purpose, Our Story, Our Values, Keeping Leadership Real, the London origin story, the founder point of view, and the 5H as part of who we are — with two conditions we have respected. **London sits inside the company story rather than standing as an isolated founder quote**, and the 5H is referenced here only, with the full explanation kept on Our Approach. The structure on the site now matches that list. What is missing is the text.

- **Our Purpose.** The item asks it to preserve "cut through complexity, connect the present and deliver the truth — real problems and real solutions". We looked for that sentence across the current site and could not find it, so in practice this is writing it rather than preserving it.
- **Our Story**, with London and the founder's point of view *inside* the narrative.
- **Our Values.**
- **Keeping Leadership Real** — what it means, as part of the identity. The homepage now leads on this line.
- **The 5H as part of who we are** — a short reference only.
- **Why We Are Different** — still with Rhea, JP and Nitin since the 05-08 brief.

**When would you be able to send us this text?** We ask early because this is the one page where we would rather not write on your behalf. We could put something readable together, or shorten the old site's text until it fits the seven blocks, but neither feels right here. Our Identity is where the company says who it is, and anything we drafted would be our reading of Corporate DNA rather than yours — you would most likely want to rewrite it. The old site does not help us much either: three of the seven blocks have no equivalent there, and the sentence item 4 asks us to preserve is not on it.

**Direction would help us more than a draft to approve.** For each of the seven blocks: the text that should be there — or, where you would prefer us to shape it, the raw material and the points it has to make, in your words. London is the clearest example: we know it belongs inside the story rather than beside it, and the story itself is yours to tell.

**And then the design.** Guli has not drawn this screen yet. Our suggestion, if it works for you, is to take it in that order — you confirm the text that goes in, and Guli designs the page around the text that actually exists. Designing the blocks empty and fitting the copy in afterwards tends to leave the layout fighting the length of the text, and item 16 asks for less scrolling, which is a decision about how much text there is before it is a decision about type.

**Question:** "Why We Are Different" is not in item 4's list of seven. Does it stay on the page?

### B2 · Our Impact — one gap, not three questions **[CDNA]**

We had three open questions here. Your 12-08 e-mail answers two of them, and we had not carried it through. You authorised six figures there:

> 18 years · 36 countries · 75 faculty · 90% Chairman/CXO-sponsored · **70+ executive-team interventions** · **1,000+ coaching clients**

The last two appear nowhere on the site yet. With the six in hand, the page resolves almost on its own — they separate into two groups of three:

| **What the firm is** | **What the firm has done** |
| :------------------- | :------------------------- |
| 18 years | 90% Chairman/CXO-sponsored |
| 36 countries | 70+ executive-team interventions |
| 75 faculty | 1,000+ coaching clients |

*Our proposal, for you to confirm or correct:* the left column is **impact statistics**, the right is the scale of the work, and **"measurable results" is the umbrella over both rather than a third band**. That answers the second question, and it also settles Guli's concern that two similar figure bands would sit awkwardly in sequence — these two are different in kind, so they can be treated differently.

**The gap is real and it is narrower than we thought: none of the six is a *programme outcome*.** All six describe scale, reach or seniority. A programme outcome says what changed for the client — NPS, engagement, talent promoted mid-programme. Those existed on the old site and are **not** among the figures you authorised.

So the only thing genuinely missing for this page is two or three programme results with a source behind them. There is exactly one in the system today, and it is the right shape: **Shell's 88% Net Promoter Score.** Two or three more like it finish the page.

**"Evidence across regions"** stays undefined in the brief. Our reading is that it is the same cases, grouped by the regions they ran in — which we already hold as data. Confirm and we build it; say otherwise and we drop the heading.

### B3 · Three claims on Our Approach — **done, no longer a question**

We had this listed as open. It was not: your 12-08 e-mail already decided it, and we had not applied it. Your words there:

> "I have also instructed the developers to remove the unsupported 5H claims referring to 95%, 26 countries and 'over ten years' unless anyone can provide a reliable source."

No source came in the three weeks since, so we applied the instruction on 01-09, in the four places those claims appeared — page metadata, the FAQ answer, the hero line and the body copy:

- **"across 26 countries" → "across 36 countries".** Corrected rather than removed: 36 is the figure you authorised, and this was the one straight contradiction on the site.
- **"95% of our clients cite 5H®…" → removed.**
- **"Over ten years…" → removed.**

**One thing worth recording, in case it should come back.** The 95% is not an old version of the 90%. **90% is work sponsored by Chairman/CXO; 95% is clients who cite 5H as the secret of our success** — two different measurements. It went for want of a source, not because it contradicted anything, and it returns the day someone can point to one. The same applies to "over ten years", which described the age of the 5H rather than of the firm.

### B4 · Sign-off on the 25 5H dimensions **[CDNA]**

**Where to look:** they are the line that cycles inside Guli's new Inner & Outer Game section on Our Approach. Each of the five faculties carries five of the wheel's twenty-five dimensions, rotating one after another. What needs your sign-off is that text, not the design around it.

The names are transcribed from your own wheel artwork and reproduced verbatim, lower-case and all. They are your proprietary IP and nothing reaches production without approval.

**One thing in there is ours, and you may want it different: the order.** The wheel is a circle with no beginning, and the mock does not fix a sequence, so we read each faculty along its arc in the direction its labels run. If you want a different order within any faculty, tell us and it is a one-line change.

### B5 · Solutions content **[CDNA]** — *the largest single gap*

Each Solution has five blocks. **The Challenge** carries text brought forward from the old pages, **Evidence** and **Start a Conversation** are automatic, and the two in the middle are empty in all eight: **The Outcome** (what changes in the business) and **How Corporate DNA Helps** (the intervention, in a sentence). That is sixteen fields, and they are what stands between eight built pages and eight publishable ones.

They are not blank on screen: each reads *"Pending final copy from CDNA"*, deliberately, so you can see the field exists rather than finding white space.

Three specifics:

- **Talent Development still says "We shape Asian leaders".** Your brief removed "Asian" from the name; the body text stayed. It needs a new sentence from you.
- **Manager Development has no text at all**, because the Solution did not exist before today.
- **The flagship case for Manager Development and Executive Coaching** — the two marked TBC in item 6. And **Frasers Property and adidas do not exist as case studies**, so Talent Development and HRLT Effectiveness have no flagship either, despite item 6 naming one for each.

### B6 · Testimonials about Corporate DNA **[CDNA]**

Item 7 requires quotes to be testimonials about the work, not generic corporate quotes. We have now read all eight currently on the case studies, and **all eight are the second kind** — Emma Walmsley on culture, Dolf van den Brink on renewal, Sunny Jain on purpose. None mentions Corporate DNA.

One detail makes the ask concrete. **Your brief names John Murphy as an example of the right kind of quote.** The quote attributed to him in the system is *"We continue to invest for sustainable growth in the future…"*, which is the generic kind. So a better Murphy quote exists somewhere. If there is one of those per client — the John Murphy and Jorge Gardino standard the brief sets — it resolves the evidence block across every case at once.

Item 7 also states that no name, logo, quote or metric reaches production without CDNA approval, so these eight need replacing before launch rather than after.

### B7 · Approvals on Our Clients **[CDNA]**

- The client names and logos on the page.
- The closing line — *"We cut cross cultural boundaries…"* — taken from the old site for the mock, not re-approved this cycle.

### B8 · Our Partnerships **[CDNA]**

The route and the content area exist and are empty. What we need is the list confirmed — Harvard, Imperial, Emeld AI, Explore Performance, TerraGrin, plus any other validated relationship — and, for each one, the answer to item 12's own question: *what does this partnership enable for our clients?* The item is explicit that logos and announcements are not enough, so the copy is the page.

**Our recommendation is the same as for Our Identity: text and images first, design after.** We suggest Guli only draws this screen once the partnership copy and the images are in hand, and designs it around what actually arrives. How many partnerships there are, how long each description runs, and whether each has a usable image are all things that change the layout — designing before they are known would very likely mean doing it twice.

### B9 · Our Team assets **[CDNA]**

Item 15: the group photograph of the six-person leadership team, the black-and-white individual portraits, and the final list of who appears. The page has a route but stays out of the menu until these arrive.

**And a question item 15 does not answer, because it is not its subject.** Item 15 scopes black and white to the team portraits. But the photograph you sent for the foot of Our Clients is also black and white, while the Social Impact carousel on Our Impact runs in colour. Is black and white the treatment for photography across the site, or does it stay on the portraits as item 15 words it? We are asking rather than deciding, since either answer is defensible and the two pages currently disagree.

### B10 · Ticker content, 2023 onwards **[CDNA]**

The strip is built and sits under the navigation, reproducing the old site's treatment — dark band, white text, underlined only where an item links out. What it carries is item 17's list: awards, new regions, new offices, new partnerships and milestones, 2023 onwards.

**We went and got the old strip rather than asking you to write a new one.** It has nine items. Applying the 2023 cut that item 17 sets — your cut, not ours — two survive, and both are live on the review site now:

> GOLD — Brandon Hall DE&I Award for Best Advance in Leadership Development for Women **2023**
> GOLD — Brandon Hall Best Leadership Development for Talent Acceleration Programme for Asian Leaders **2024**

**Five fall outside the cut, and all five are awards:** Corporate Excellence Awards 2022, Women Entrepreneur India 2021, British Indian Awards 2015, HSBC UK Start-Up Awards 2009, Women of the Future Awards 2008.

*Our reading:* they do not disappear, they move. The old strip was doing two jobs at once — ticker and award list — and the new site separates them, with an Awards section of its own where the 2008 and 2009 entries belong. If you agree, there is nothing to decide here: the older awards go to Awards, the ticker keeps 2023 onwards.

**Three things left, and they are short:**

- **Two dates.** "CDNA Signs Partnership Agreement with Harvard Business Impact" and "CDNA Opens new Office in Saudi Arabia" carry no year on the old strip. They are the two items that fit item 17 best — a new partnership and a new office — but without a date we cannot tell whether they clear 2023. Send the dates and they go in the same day.
- **Where those two should link.** Both pointed at WordPress posts that do not exist on the new site. Three options: recreate them as Insights, point the partnership at Our Partnerships and the office at the offices block, or carry them with no link. We would take the third for launch — a link that dies at the domain cutover is worse than none.
- **Whether two lines is enough.** With your cut, the strip opens with two entries. If you want more density, that is the one thing here we cannot source: milestones from 2023 onwards that were never on the old strip.

### B11 · Proprietary frameworks and diagnostics **[CDNA]**

Which ones go in. The structure is prepared and empty, as the brief asks.

### B12 · Decisions **[CDNA]**

- **The case listing filter.** The mock shows an industry dropdown as the main way in, which item 6 rules out. It works as a secondary filter with discovery by Solution leading — but not as drawn.
- **Awards now appears on both the homepage and Our Impact.** Guli moved it to Our Impact but never showed a homepage mock, and item 2 wants proof early on the homepage. One place or both?
- **Two retired URLs, and a reading we would like corrected if it is wrong.** Item 5 removed Leadership Development and Inclusion & Diversity, so `/our-services/leadership-development` and `/our-services/inclusion_diversity` lost their destinations. Both are still indexed on the live domain today, so they need somewhere to land at cutover or they become errors.

  We have pointed both at the Solutions index, and on Leadership Development that is a deliberate choice rather than a placeholder. Re-reading the old page, it was an umbrella: individual and collective leadership, a "whole person" approach, no defined audience. Its substance now sits across at least three of the eight — ExCo / Top 150, Manager Development and Talent Development. Sending it to any single one of them would deliver most of that traffic to a page covering a fraction of what the visitor searched for, which is worse than the index.

  **If you think one Solution genuinely inherits most of what that page was, tell us and we will point it there.** Otherwise it stays on the index, which is the honest answer for a retired umbrella.

### B13 · How content should reach us, and in what order **[CDNA]**

**The order matters more than it looks, and we would ask for content before design on the pages that have neither.** On Our Identity, Our Partnerships and Our Team — and on any other page you think risks reading as generic — the text should reach us first, and Guli should lay it out afterwards. Not the reverse.

Item 15 makes this point in your own words about the team portraits: avoid treatments that leave people looking artificial or AI-generated. The same applies to writing, and the symptom is identical. When the shape is fixed first, the words get written to fit the shape, and that is exactly when a page starts to sound like any other consultancy.

There is also a practical cost, and it has already been paid twice on this project. A pass of homepage work was reverted on 28 August because it had been applied before you approved it. And on the 29 August call Guli changed his own position for the same reason: he had proposed that we draft and you correct, and concluded that Rhea will want to see it first regardless, because pre-written-then-corrected text had already caused rework. If Guli designs Our Identity now, he is designing for seven blocks of unknown length; when the real text arrives at a different length and in a different voice, the layout is rebuilt. Two rounds of design instead of one, and it is the expensive round.

**It does not need to arrive polished.** Raw material works — bullet points, an old document, a recording of someone talking through it. What blocks us is not the absence of finished prose; it is the absence of your substance. The polishing we can do together afterwards.

Do you send it already validated, or do we propose and you review? We ask because this has caused rework before, and we assume Rhea will want to see it either way. The answer changes our week.

**And a related choice, now that the fields are ready: does CDNA type the content into the system directly, or send it to us to enter?** If it is you, tell us who and we will set up access and pass on the tutorial.

**One caveat on that, because it cannot be answered in one piece.** Most of the site is content-managed and you could edit it yourselves: Solutions, case studies, Our Impact, Our Team, Our Clients, Partnerships, Insights and Awards. **Our Identity and Our Approach are not.** Those two are built directly in the site's code, so their text has to come to us either way and we place it.

We raise it now rather than later so we do not agree on "CDNA fills it in" and then find the page that depends on you most was never covered.

### B14 · The Impact figure on the case studies **[CDNA]** — *the second largest gap*

Item 7 asks every case to open with Countries · Participants/Leaders · Reach/Scale · Intervention · Impact, and to lead with evidence rather than prose. Four of those five slots we could fill from your own material. **The fifth we could not: Impact is empty in seven of the eight cases.**

The single exception is Shell, which carries an **88% Net Promoter Score**. Everything else in the case studies is scale — how many countries, how many leaders, how many years of partnership. None of it says what changed for the client.

That is the figure the band is built to end on, and the one thing that turns a case study from a description into proof. If it exists in a closing deck, a programme report or an internal review, it would do more for the site than any other single item on this list.

### B15 · Where the testimonial films should live **[CDNA + Guli]**

Item 13 asked us to take the compiled video off the site and build a modular structure for individual films. Both are done. **What the item does not say is where the individual films appear**, and that decision has not been made — so today a film entered into the system would not show anywhere on the site.

Three candidates, and we do not think it is only one of them:

- **On the case study itself.** The film type carries a case reference, which suggests this was the original intent.
- **On Our Impact.** Item 9 lists client testimonials among that page's priorities.
- **On the homepage.** The compiled video left it and nothing took its place, while item 2 asks for proof early.

Our reading is the case page plus a selection on Our Impact. But that is a judgement about the site, not a deduction from the brief, so we would rather you and Guli settle it than have us choose quietly.


---

# Part C — What is still with Guli

Guli has seen this list. These are the six priorities the brief set for him.

| Priority | State |
| :---- | :---- |
| Homepage visual hierarchy | The reorder is done. **The "Keeping Leadership Real" block and two joins still need a design pass from Guli, if you want one** — see C1. |
| Solutions visual system | **Done**, applied. |
| 5H visual language | **Explorer done.** Four questions from item 10 remain open — see C2. |
| Our Clients / Our Impact | **Our Clients done. Our Impact is not** — see C3. |
| Team treatment | **Not started.** |
| Reduction of text and scrolling | Partly. See C4. |

**Two pages are not on that list** — Our Identity and Our Partnerships were not among the six — and neither has a design. In both cases our suggestion is the same: the design follows the content rather than preceding it. See B1 and B8.

### C1 · The homepage, three things **[Guli]**

**The "Keeping Leadership Real" block — changed on 01-09, and still open.** Item 1 asks for the explanation to be "curta e visual".

It was a two-by-three grid of six term cards. Guli's resolution today replaced it with **one line that types**, cycling the second word: *real pressures → real politics → real choices → real judgement → real people → real consequences*.

The reasoning, in case you are comparing against what you saw before: the grid put the word "real" on screen six times immediately under a hero that already says it five. One line keeps a single "Real" and moves the term. It is also the same sentence continuing from the heading above it rather than a caption underneath, so it is sized to the heading.

**The joining question is settled.** Asked whether the two sentences should read as one, Guli said yes — *"duas linhas do mesmo texto"* — and wrote out how it should break on a phone. That is applied; see item 24.

**What is still open is one lapsed request.** His 31-08 note asked for the term cards to turn red on hover. There are no cards now. If the typing line stays, that request needs a new form or it lapses.

**And two joins the reorder opened.** The new order satisfies item 2, but it cost the page some of its rhythm. The block above closed two of the four breaks. Two remain, and both change the colour rhythm of the whole page, which is why we have not touched them:

- "What we solve" and "Client Impact" are both pure white and now adjacent, with the alignment switching from centred to left mid-scroll. The dark band used to separate them.
- The same collision between the book block and the offices block.

### C2 · Item 10, three open points **[Guli + CDNA]**

- **The 5H wheel.** Our reading is that Guli's new Inner & Outer Game section *is* the wheel in a modern reading — Inner/Outer, the five Hs and the 25 dimensions in one system, which is what the item asks for. So the wheel does not return as an image. Please confirm.
- **The DNA-strand imagery.** The brief names it as one of the disconnected elements. It is still on the page, and Guli did not replace it. Now that the new section sits above it, does it stay or go?
- **"The highlighting of an H without explanation."** We could not identify what this refers to on the current page. Could you point at it?

### C3 · Our Impact is not finished **[Guli]**

Three things item 9 asks for have no treatment in the mock: **programme outcomes**, **evidence across regions** and **dashboards**. We do not know what "programme outcomes" is either, which is why B2 above has to be answered before this page can be finished.

Also: **Our Social Impact and Awards are not in item 9.** He brought both from the old site. It reads right to us, but you should confirm rather than us assume.

### C4 · Reduction of text and scrolling **[Guli + CDNA]**

Our Clients is shorter, and the shared page header now has a compact variant other pages can adopt. But the deeper reduction is content, not design. **What design delivers is less scrolling, which is not the same as less text.** The text itself was approved in the previous cycle, and cutting it unilaterally would break the brief's own rule.

---

# Part D — Preserved (item 18)

Verified: headless architecture, the content system, security, the Cloudflare/cutover path, analytics and SEO, the responsive foundation, editable statistics, author approval controls, Reports & Resources, proof components, multilingual readiness, reusable components and infrastructure ownership. Nothing was removed.

---

# Part E — Can follow immediately after launch

- The three new testimonials (Dyson, adidas, one more).
- The new Corporate DNA video around Keeping Leadership Real (item 14).
- The remaining individual testimonial films — once B15 settles where on the site they appear. The entry type is ready; what is missing is the destination, not the plumbing.
- Captions for video accessibility.

---

# Part F — Where 1 September actually landed

**On the build side the date is met.** Everything in Part A is on the review site. The one item this section listed a week ago as pending — the database switch that turns on Partnerships, the ticker and testimonial films in the editor — was applied today, along with the eight Solutions themselves.

**What is not met is content, and it is the only thing standing between here and a launch.** Every page that is built and empty stays empty until the text arrives. The two largest are B5, sixteen fields across the eight Solutions, and B14, the Impact figure on seven of the eight case studies. Our Identity is the clearest case of all: seven blocks, no copy, and a layout that we are recommending should follow the text rather than precede it. It carries two waits, not one.

**Still ours, and not waiting on anyone:** the lead form, which records enquiries without telling anybody — we have since established that this is a single unset setting rather than missing work, so it is quick; publishing today's code changes, which are written but not yet live; and the brand-logo field described in Part G, which the content system already offers and the site does not read.

**And one question we asked two cycles ago and have still not had answered:** does "launch on the 1st" mean the review site is complete, or the live domain switches over? Today `corporatednaconsulting.com` still serves the old site. The switch itself is quick — two DNS records — but the two readings need very different amounts of runway, and the date has now passed without the question being settled.

**One date that has appeared since, and that does have a hard edge.** The current hosting for the old WordPress site is cancelled and ends on **30 September**. Two things follow. A full backup of the old site has to be taken before then, or its content and media go with the server. And the one-to-two-week rollback window offered by the host is bounded by that date rather than counted from the cutover: a switch-over on 16 September still leaves the full two weeks, 23 September leaves one, and from 30 September there is no fallback at all. This is being handled with the provider in a separate thread and is not asking anything of you today, but it does put a shape on the launch window.

---

# Part G — Materially outside the agreed scope

**"Dashboards" (item 9),** if it means live data visualisation — filtering results by region, industry or year. That is a new build. If it means a strong visual treatment of static figures, it is inside scope and belongs to Guli.

**Knockout logo assets.** The client bands knock the brand mark out of the panel in white, as the mock does. The logo files we hold are opaque colour-on-white, so the knockout comes out monochrome — Heineken loses the red of its star. Matching the mock exactly needs each brand's own knockout asset, which is an asset request rather than a build.

Before anyone spends time on it, one correction that is ours rather than yours: the content system already carries a **Brand logo** and a **Brand colour** field on every case, and the site reads neither — it resolves the logo from a file we ship, matched on the client's name. A logo uploaded there today has no effect on the page. That wiring is a small change on our side and is in Part F.
