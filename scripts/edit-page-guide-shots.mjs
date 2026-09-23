/**
 * Tira um print de cada seção do site para o guia visual dos editores de texto.
 *
 * Saída: `public/<pasta do guia>/<seção>.jpg`, uma por seção do editor
 * (`EDITOR_SECTIONS` em `lib/home-copy.ts`, `lib/about-copy.ts` e
 * `lib/team-copy.ts`). Cada editor mostra a imagem ao lado dos campos daquela
 * seção.
 *
 * Rodar com o dev server no ar (porta 3006), depois de qualquer mudança de
 * layout nas páginas:
 *
 *   node scripts/edit-page-guide-shots.mjs                    # todas as páginas
 *   node scripts/edit-page-guide-shots.mjs about              # só a About
 *   node scripts/edit-page-guide-shots.mjs about http://...   # noutra origem
 *
 * ERA `edit-home-guide-shots.mjs` até 23-09, quando a About, a Team, a listagem
 * de serviços e a Clients & Impact ganharam o mesmo editor. O que mudou: a lista
 * de seções virou uma TABELA POR PÁGINA, e o navegador é aberto uma vez só.
 *
 * ⚠️ AS DEZ INTERNAS DE SERVIÇO NÃO ESTÃO AQUI, de propósito: as telas delas não
 * têm coluna de print (decidido com o cliente em 23-09 — o template das dez é o
 * mesmo, e a foto custaria ~70 JPEGs versionados). Ver a prop `guideDir` do
 * `CopyEditor`.
 *
 * Usa o Chrome instalado na máquina via puppeteer-core (sem baixar navegador).
 * `prefers-reduced-motion: reduce` desliga o Reveal e os giros, para a foto
 * sair com tudo visível em vez de no meio de uma animação.
 */
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

/**
 * `id` da seção no editor → seletor no site.
 *
 * ⚠️ OS `id` TÊM DE BATER com os `EDITOR_SECTIONS` da página — é o nome do
 * arquivo que o editor pede. Seção sem print aparece com a imagem quebrada; por
 * isso o script avisa (e não falha) quando um seletor não existe na página.
 *
 * ALGUNS SELETORES NÃO SÃO A `<section>`, e isso é de propósito:
 *   • A About mostra a citação da Identity e os quatro cartões em telas
 *     separadas, porque a seção inteira não se lê na coluna de 440px do editor.
 *     Mesma coisa com o texto das regiões e os quatro tiles.
 *   • `#about-stats` é a faixa de números, que vive DENTRO da dobra do herói —
 *     o print do herói a inclui, e o dela isola a faixa.
 *   • Na Team, `#faculty-head` é só o cabeçalho da Global faculty: a seção
 *     inteira traz os vinte e três da faculty e teria uns 4.000px de altura.
 *     E `#leaders` isola a grade dos seis cards do resto da seção Leadership.
 */
const PAGES = {
  home: {
    url: "/",
    out: "edit-home-guide",
    sections: [
      ["hero", "#top"],
      ["solve", "#solve"],
      ["credibility", "#credibility"],
      ["impact", "#impact"],
      ["people", "#people"],
      ["book", "#book"],
      ["contact", "#contact"],
    ],
  },
  about: {
    url: "/about",
    out: "edit-about-guide",
    sections: [
      ["hero", "#about-hero"],
      ["stats", "#about-stats"],
      ["purpose", "#purpose"],
      ["promise", "#promise"],
      ["identity", "#identity-quote"],
      ["pillars", "#identity-pillars"],
      ["values", "#values"],
      ["regions", "#regions"],
      ["region-tiles", "#region-tiles"],
      ["offices", "#offices"],
      ["people", "#people"],
    ],
  },
  services: {
    url: "/services",
    out: "edit-services-guide",
    sections: [
      ["hero", "#services-hero"],
      ["what-we-do", "#what-we-do"],
      ["partners", "#partners"],
      ["cta", "#services-cta"],
    ],
  },
  clients: {
    url: "/our-clients",
    out: "edit-clients-guide",
    sections: [
      ["hero", "#clients-hero"],
      ["logos", "#clients"],
      ["numbers", "#numbers"],
      ["cases", "#case-studies"],
      ["voices", "#voices"],
      ["social-impact", "#social-impact"],
      ["footprint", "#footprint"],
      ["cta", "#clients-cta"],
    ],
  },
  team: {
    url: "/team",
    out: "edit-team-guide",
    sections: [
      ["hero", "#team-hero"],
      ["leadership", "#leadership"],
      ["leaders", "#leaders"],
      ["one-team", "#one-team"],
      ["faculty", "#faculty-head"],
      ["dna", "#dna-experience"],
      ["cta", "#team-cta"],
    ],
  },
};

const [arg1, arg2] = process.argv.slice(2);
const wanted = arg1 && PAGES[arg1] ? [arg1] : Object.keys(PAGES);
const BASE = (PAGES[arg1] ? arg2 : arg1) ?? "http://localhost:3006";
if (arg1 && !PAGES[arg1] && !arg1.startsWith("http")) {
  throw new Error(`página desconhecida: ${arg1} (use ${Object.keys(PAGES).join(" ou ")})`);
}

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find(existsSync);
if (!CHROME) throw new Error("Chrome/Edge não encontrado");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

  for (const key of wanted) {
    const { url, out, sections } = PAGES[key];
    const dir = path.join(process.cwd(), "public", out);
    mkdirSync(dir, { recursive: true });

    await page.goto(BASE + url, { waitUntil: "networkidle2", timeout: 120_000 });
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

    for (const [id, selector] of sections) {
      const el = await page.$(selector);
      if (!el) {
        console.warn("seção não encontrada:", key, id, selector);
        continue;
      }
      await el.evaluate((n) => n.scrollIntoView({ block: "start" }));
      await sleep(900);
      const file = path.join(dir, `${id}.jpg`);
      await el.screenshot({ path: file, type: "jpeg", quality: 82 });
      console.log("ok", key, id, "->", path.relative(process.cwd(), file));
    }
  }
} finally {
  await browser.close();
}
