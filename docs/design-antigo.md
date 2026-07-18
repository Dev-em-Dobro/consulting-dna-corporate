# CorporateDNA — Design System

Extracted from **corporatednaconsulting.com** (homepage). A bold, editorial consulting brand: primary red, deep aubergine, and a lime-yellow accent, set on generous light-grey and charcoal fields, with rounded geometric type and a recurring DNA / diagonal-stripe motif.

---

## 1. Color

### Brand core
| Token | Hex | Use |
|---|---|---|
| `--red` | `#D84339` | Primary brand. Top nav bar, footer CTA band, `CONTACT US` button, card separators, section accents |
| `--charcoal` | `#373234` | Logo wordmark, headings, dark section backgrounds ("Our Clients Say"), footer base, body-copy ink |
| `--aubergine` | `#592447` | Pull-quote box, "Our Values" section background, card accent borders |
| `--lime` | `#EFFF75` | High-energy accent: "Our Values" card fill, `LET'S GET STARTED` CTA |

### Supporting
| Token | Hex | Use |
|---|---|---|
| `--navy` | `#00246E` | Hero "DNA Partnership" diagonal band base |
| `--navy-mid` | `#204C8D` | Lighter blue in the striped band gradient |
| `--dna-green` | `#79C143` | 5H methodology DNA illustration, "growth" motif |
| `--paper` | `#F3F3F3` | Default light section background |
| `--white` | `#FFFFFF` | Cards, methodology section, contrast panels |
| `--ink-body` | `#3B3B3B` | Long-form body text on light backgrounds |
| `--ink-muted` | `#6B6B6B` | Captions, secondary labels, footer meta |

### Diagonal-stripe motif
The hero "DNA Partnership" band and footer flourishes layer bold diagonal bars of `--navy` and deep red (`#8A0203`) at roughly **35°**, evoking a DNA helix / crossing strands. Used as a full-bleed dark section divider.

---

## 2. Typography

Rounded, friendly **geometric sans** throughout — soft terminals, near-circular bowls (a/e/o), tall x-height. Closest web fallbacks: **Poppins / Quicksand / Filson Pro**.

```
--font-display: "Filson Pro", "Poppins", system-ui, sans-serif;  /* headings, CTAs */
--font-body:    "Filson Pro", "Poppins", system-ui, sans-serif;  /* copy */
```

The **DNA logo** pairs a light handwritten script ("corporate") stacked over an ultra-bold uppercase "DNA".

| Role | Treatment |
|---|---|
| Hero headline ("Results not Promises") | ~64px, bold, white, tight leading |
| Section titles ("5H®: OUR DNA METHODOLOGY", "OUR TEAM'S GLOBAL FOOTPRINT") | ~36–40px, bold, uppercase or title-case, red or charcoal |
| Card titles ("Our Values", "Boldness", "Trust") | ~24px, bold |
| Body | ~17–18px, regular, ~1.6 line-height, generous paragraph spacing |
| Nav / labels ("OUR IDENTITY", "OUR SERVICES") | ~13px, bold, uppercase, letter-spaced, two-line stacked |
| Pull-quote | ~26px, bold, white on aubergine, with oversized `"` glyph |

---

## 3. Layout & spacing

- **Wide, full-bleed sections** stacked vertically, each with its own background color to create rhythm: red → charcoal → photo → light-grey → striped-navy → white → green-photo → aubergine → charcoal → light-grey → red.
- Content contained to a **centered max-width (~1100–1200px)** with large vertical padding (~80–120px per section).
- **Two-column** intro (copy left / quote card right); **three-column** feature and values grids.
- Sticky top **nav bar** in red, logo centered, nav items split left/right, pill `CONTACT US` outline button at far right.

---

## 4. Components

### Icon feature bar
Charcoal (`#373234`) full-width strip directly under the hero: 7 evenly-spaced line icons (rocket, lightbulb, culture, teams, women, inclusion, talent) with two-line white labels. Thin vertical dividers between items.

### Cards
- **Feature cards** (over photo bg): white text on translucent dark, thin red rule separators.
- **Values grid**: white cards on aubergine field, each with a **colored left/top accent bar** (lime, aubergine, teal, red, purple) — one bright "Our Values" card is fully lime-filled.
- Cards are **sharp-cornered** (no border radius) — squared, editorial.

### Buttons
- **Primary CTA**: lime (`#EFFF75`) fill, charcoal text, squared corners — `LET'S GET STARTED`, `GET STARTED NOW →`.
- **Nav CTA**: transparent with white 1px outline, pill-rounded — `CONTACT US`.
- Buttons are uppercase, bold, letter-spaced.

### Pull-quote
Aubergine (`#592447`) block, oversized white quotation mark top-left, bold white quote, attribution in lighter weight below.

### Numbered steps
Circular white outline badges ("1", "2") beside stacked copy blocks, on the striped-navy band.

### Media grid
"Our Clients Say" — dark charcoal section, grid of video testimonial thumbnails with red YouTube-style play buttons.

### World map
"Global Footprint" — light section with a flat choropleth map, countries tinted in the brand red/coral family, pin markers.

---

## 5. Motifs & tone

- **DNA / helix**: the "5H" methodology uses a literal DNA-strand diagram (Inner Game / Outer Game) with colored nodes on green strands.
- **Diagonal energy bars** as dark dividers.
- **Squared, confident geometry** — minimal rounding except the nav CTA pill and logo.
- Copy tone: bold, human, first-person plural ("We make leadership real"), short declaratives, `®` on proprietary terms (5H®).

---

## 6. Footer

Red (`#D84339`) CTA band ("Be Part Of Our Success — Contact Us Today") with lime button, over a charcoal (`#373234`) footer holding office addresses (London / Singapore / Dubai), contact details, social icons, and a red `CONTACT US` button.
