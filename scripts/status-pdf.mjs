// Builds a DNA-branded HTML from the consolidated status markdown, ready for
// Chrome headless --print-to-pdf. Brand tokens mirror app/globals.css:
// brand #d84339, ink #373234, paper #f3f3f3, line #ece9e6, muted #6b6b6b,
// typeface Poppins.
//
// Run: node scripts/status-pdf.mjs <in.md> <out.html> [meta-html] [footer-text]
// The cover blurb and footer default to the 10-08 edition, so the original
// invocation still reproduces that document byte for byte; later editions pass
// their own. Both are interpolated raw — they are ours, not user input.
import { readFileSync, writeFileSync } from "node:fs";
import { marked } from "marked";

const [, , inPath, outPath, metaArg, footerArg] = process.argv;

const META =
  metaArg ??
  `<strong>Prepared by Beto &amp; Cadu / Dev em Dobro.</strong>
      In response to the consolidated brief of 05 Aug 2026. First sent 2026-08-06 —
      <strong>updated 2026-08-10, post-delivery.</strong> Scope: the public website only.`;

const FOOTER =
  footerArg ??
  "Corporate DNA — Making Leadership Real · Dev em Dobro · Status update 10/08/2026";
const md = readFileSync(inPath, "utf8");
const logo = readFileSync("public/cdna-logo-horizontal.svg", "utf8");
const logoData =
  "data:image/svg+xml;base64," + Buffer.from(logo).toString("base64");

// Strip the H1 (rendered in our own cover header) and the first two intro
// paragraphs so they can be styled as a lede block.
// `\r?` on both patterns: on a Windows checkout the source arrives CRLF, and
// JavaScript's `.` does not match `\r`, so `/^#\s+.*\n/` silently fails to strip
// the leading H1 — the title then renders twice, once on the cover and once at
// the head of the body.
const lines = md.split(/\r?\n/);
const h1 = lines.find((l) => l.startsWith("# "))?.replace(/^#\s+/, "").trim() ?? "";
const body = md.replace(/^#\s+.*\r?\n/, "");

marked.setOptions({ gfm: true, breaks: false });
let html = marked.parse(body);

// Tag "Done / live" and "Requires CDNA" phrases so we can pill-style them via CSS
// is overkill here; instead keep it simple and readable in the template.

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
<style>
  @page { size: A4; margin: 20mm 16mm 18mm 16mm; }

  :root {
    --brand: #d84339;
    --brand-dark: #b5342b;
    --ink: #373234;
    --ink-2: #2f2b2c;
    --paper: #f3f3f3;
    --line: #ece9e6;
    --muted: #6b6b6b;
  }

  * { box-sizing: border-box; }

  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  body {
    font-family: "Poppins", system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    color: var(--ink);
    font-size: 10.5pt;
    line-height: 1.55;
    margin: 0;
    font-weight: 400;
  }

  /* --- Cover --------------------------------------------------------------- */
  .cover {
    position: relative;
    background: var(--ink);
    color: #fff;
    padding: 40px 40px 36px;
    margin: 0 0 30px;              /* contained within @page margins — no bleed */
    border-radius: 12px;
    overflow: hidden;
  }
  .cover::after {                  /* red accent stripe down the left edge */
    content: "";
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 6px;
    background: var(--brand);
  }
  .cover .brandbar {
    width: 60px; height: 4px; background: var(--brand);
    border-radius: 2px; margin-bottom: 26px;
  }
  .cover img.logo {
    height: 40px; width: auto; display: block;
    margin-bottom: 30px;
    filter: brightness(0) invert(1);   /* white lockup on dark cover */
  }
  .cover h1 {
    font-size: 27pt; line-height: 1.12; font-weight: 700;
    margin: 0 0 14px; letter-spacing: -0.01em; max-width: 30ch;
    color: #fff;                        /* override the dark global h1 color */
    border-bottom: none; padding: 0; page-break-before: avoid;
  }
  .cover .eyebrow {
    font-size: 8.5pt; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--brand); font-weight: 600; margin: 0 0 10px;
  }
  .cover .meta {
    font-size: 9pt; color: rgba(255,255,255,.72); max-width: 74ch;
    line-height: 1.6; margin: 18px 0 0;
  }
  .cover .meta strong { color: #fff; font-weight: 600; }

  /* --- Typography --------------------------------------------------------- */
  h1, h2, h3 { font-weight: 700; color: var(--ink-2); letter-spacing: -0.01em; }

  h1 {                                  /* "Part A / B ..." top-level */
    font-size: 17pt; margin: 34px 0 14px; padding-bottom: 8px;
    border-bottom: 2px solid var(--brand);
    page-break-before: always;
  }
  h1:first-of-type { page-break-before: avoid; }

  h2 {
    font-size: 13pt; margin: 26px 0 10px; color: var(--brand-dark);
    page-break-after: avoid;
  }
  h3 {
    font-size: 11pt; margin: 20px 0 8px; color: var(--ink-2);
    page-break-after: avoid;
  }

  p { margin: 0 0 10px; }

  a { color: var(--brand-dark); text-decoration: none; }

  strong { font-weight: 600; color: var(--ink-2); }

  ul, ol { margin: 0 0 12px; padding-left: 20px; }
  li { margin: 0 0 5px; }
  li::marker { color: var(--brand); }

  hr {
    border: none; border-top: 1px solid var(--line);
    margin: 22px 0;
  }

  blockquote {
    margin: 14px 0; padding: 12px 16px;
    background: var(--paper); border-left: 4px solid var(--brand);
    border-radius: 0 6px 6px 0; color: var(--ink);
  }
  blockquote p { margin: 0; }

  /* --- Tables ------------------------------------------------------------- */
  table {
    width: 100%; border-collapse: collapse; margin: 14px 0 18px;
    font-size: 9.5pt; page-break-inside: avoid;
  }
  thead th {
    background: var(--ink); color: #fff; text-align: left;
    font-weight: 600; padding: 8px 10px; font-size: 9pt;
  }
  tbody td {
    padding: 7px 10px; border-bottom: 1px solid var(--line);
    vertical-align: top;
  }
  tbody tr:nth-child(even) { background: #fafafa; }

  /* Keep list items and headings from breaking awkwardly across pages */
  li, blockquote { page-break-inside: avoid; }

  .footer-note {
    margin-top: 34px; padding-top: 14px; border-top: 1px solid var(--line);
    font-size: 8.5pt; color: var(--muted); text-align: center;
  }
</style>
</head>
<body>
  <header class="cover">
    <img class="logo" src="${logoData}" alt="Corporate DNA" />
    <p class="eyebrow">Implementation Status</p>
    <h1>${h1}</h1>
    <div class="brandbar"></div>
    <p class="meta">${META}</p>
  </header>

  <main>
    ${html}
  </main>

  <p class="footer-note">${FOOTER}</p>
</body>
</html>`;

writeFileSync(outPath, page, "utf8");
console.log("wrote", outPath);
