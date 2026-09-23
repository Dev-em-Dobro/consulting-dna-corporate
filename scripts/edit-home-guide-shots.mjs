/**
 * Tira um print de cada seção da home para o guia visual de `/edit-home`.
 *
 * Saída: `public/edit-home-guide/<seção>.jpg`, uma por seção do editor
 * (`EDITOR_SECTIONS` em lib/home-copy.ts). O editor mostra a imagem ao lado
 * dos campos daquela seção.
 *
 * Rodar com o dev server no ar (porta 3006), depois de qualquer mudança de
 * layout na home:
 *
 *   node scripts/edit-home-guide-shots.mjs [http://localhost:3006]
 *
 * Usa o Chrome instalado na máquina via puppeteer-core (sem baixar navegador).
 * `prefers-reduced-motion: reduce` desliga o Reveal e os giros, para a foto
 * sair com tudo visível em vez de no meio de uma animação.
 */
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3006";
const OUT = path.join(process.cwd(), "public", "edit-home-guide");
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find(existsSync);
if (!CHROME) throw new Error("Chrome/Edge não encontrado");

// id do editor → seletor da seção na home. O herói é a primeira <section>.
const SECTIONS = [
  ["hero", "#top"],
  ["solve", "#solve"],
  ["credibility", "#credibility"],
  ["impact", "#impact"],
  ["people", "#people"],
  ["book", "#book"],
  ["contact", "#contact"],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 120_000 });
  await sleep(2500);

  // Fecha o banner de cookies e esconde o selo de dev do Next: os dois saíam
  // por cima das seções nos prints.
  await page.evaluate(() => {
    const accept = [...document.querySelectorAll("button")].find((b) => /^accept$/i.test(b.textContent?.trim() ?? ""));
    accept?.click();
    const style = document.createElement("style");
    style.textContent =
      "nextjs-portal,[aria-label=\"Chat with us on WhatsApp\"]{display:none!important}";
    document.head.appendChild(style);
  });
  await sleep(600);

  // Rola a página inteira uma vez para carregar imagens preguiçosas e disparar
  // o que ainda dependa de scroll.
  await page.evaluate(async () => {
    const step = 600;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await sleep(800);

  for (const [id, selector] of SECTIONS) {
    const el = await page.$(selector);
    if (!el) {
      console.warn("seção não encontrada:", id, selector);
      continue;
    }
    await el.evaluate((n) => n.scrollIntoView({ block: "start" }));
    await sleep(900);
    const file = path.join(OUT, `${id}.jpg`);
    await el.screenshot({ path: file, type: "jpeg", quality: 82 });
    console.log("ok", id, "->", path.relative(process.cwd(), file));
  }
} finally {
  await browser.close();
}
