import Link from "next/link";
import { siteNav } from "@/lib/nav";

// Footer primary links come from the single nav source (lib/nav.ts) so the
// footer and header menu never drift apart (FR-411). Top-level items that have
// their own route are shown; menu-only parents without an href are skipped.
// `cta` is a header-only flag  -  Contact appears here as a plain link like the
// rest, because a footer has no primary action to single out.
//
// Our Impact is appended explicitly, taking the slot Insights used to hold.
// The 08-09 structure folds two pages into one header item (`Clients & Impact`
// → /our-clients), which leaves /our-impact with nothing linking to it. A page
// nothing links to is preserved in name only, for readers and for crawlers
// alike, so the footer is where it stays reachable. Insights no longer needs
// the same treatment  -  it is back in the header, and would otherwise appear
// twice down here.
const mainLinks = [
  ...siteNav
    .filter((item): item is { label: string; href: string } => typeof item.href === "string")
    .map((item) => ({ label: item.label, href: item.href })),
];

export default function SiteFooter({ topBorder = false }: { topBorder?: boolean }) {
  return (
    <footer className={`bg-white text-ink${topBorder ? " border-t-2 border-brand" : ""}`}>
      <div className="mx-auto grid max-w-[980px] grid-cols-1 gap-8 px-6 py-12 sm:grid-cols-[1fr_1.4fr] md:px-10 md:py-14">
        <Link href="/" className="flex h-fit flex-none items-center">
          {/* A MARCA COMPLETA desde 15-09  -  mesma troca do header (item 1), aqui
              na versão para fundo claro, que é o que o rodapé é.

              ⚠️ ESTE ARQUIVO VEIO DE UM JPEG COM FUNDO BRANCO CHAPADO, não de
              um PNG transparente como o do header  -  foi o que ela mandou. Ele
              foi aparado e reescrito em PNG, e continua com o branco por trás:
              não dá para simplesmente torná-lo transparente, porque o branco
              também é a COR DA HÉLICE dentro do círculo vermelho, e um recorte
              por cor abriria buracos no meio da marca. Sobre este rodapé, que é
              branco, a diferença é invisível.

              SE O RODAPÉ MUDAR DE COR, esta linha quebra e o conserto não é
              aqui: é pedir o vetor à Maliha. Fica anotado.

              `h-16` VIROU `h-12` EM 15-09, junto com o header e pelo mesmo
              motivo: com a marca completa o logo ficou grande demais. Aqui não
              há aperto de largura  -  a coluna é `auto` numa grade `[auto_1fr]`
              de 1200 com 80px de vão  - , então o que manda é o peso visual.
              A 48px de altura a marca ocupa 120px, contra os 89px do letreiro
              antigo em `h-16`: continua maior, e é para continuar, porque
              ganhou o símbolo. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cdna-logo-full.png"
            alt="CorporateDNA Consulting"
            className="h-[58px] w-auto"
          />
        </Link>

        <nav aria-label="Footer navigation">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-left">
            {mainLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[13px] font-semibold uppercase tracking-[1.5px] text-ink/80 transition-colors hover:text-brand"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className="bg-ink px-6 py-5 text-white/80">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 text-[12px] md:px-4">
          <span>© Corporate DNA Consulting. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <a href="https://www.linkedin.com/company/corporatedna-consulting/home/" target="_blank" rel="noopener noreferrer" aria-label="CorporateDNA Consulting on LinkedIn" className="inline-flex items-center gap-1.5 hover:text-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.266 2.37 4.266 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
