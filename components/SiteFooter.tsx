import Link from "next/link";
import { siteNav } from "@/lib/nav";

// Footer primary links come from the single nav source (lib/nav.ts) so the
// footer and header menu never drift apart (FR-411). Top-level items that have
// their own route are shown; menu-only parents without an href are skipped.
// `cta` is a header-only flag — Contact appears here as a plain link like the
// rest, because a footer has no primary action to single out.
//
// Our Impact is appended explicitly, taking the slot Insights used to hold.
// The 08-09 structure folds two pages into one header item (`Clients & Impact`
// → /our-clients), which leaves /our-impact with nothing linking to it. A page
// nothing links to is preserved in name only, for readers and for crawlers
// alike, so the footer is where it stays reachable. Insights no longer needs
// the same treatment — it is back in the header, and would otherwise appear
// twice down here.
const mainLinks = [
  ...siteNav
    .filter((item): item is { label: string; href: string } => typeof item.href === "string")
    .map((item) => ({ label: item.label, href: item.href })),
  { label: "Our Impact", href: "/our-impact" },
];

const utilityLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Terms of Service", href: "/terms" },
];

export default function SiteFooter({ topBorder = false }: { topBorder?: boolean }) {
  return (
    <footer className={`bg-white text-ink${topBorder ? " border-t-2 border-brand" : ""}`}>
      <div className="mx-auto grid max-w-[1200px] grid-cols-[auto_1fr] gap-6 px-6 py-16 sm:gap-20 md:px-10">
        <Link href="/" className="flex h-fit flex-none items-center">
          {/* A MARCA COMPLETA desde 15-09 — mesma troca do header (item 1), aqui
              na versão para fundo claro, que é o que o rodapé é.

              ⚠️ ESTE ARQUIVO VEIO DE UM JPEG COM FUNDO BRANCO CHAPADO, não de
              um PNG transparente como o do header — foi o que ela mandou. Ele
              foi aparado e reescrito em PNG, e continua com o branco por trás:
              não dá para simplesmente torná-lo transparente, porque o branco
              também é a COR DA HÉLICE dentro do círculo vermelho, e um recorte
              por cor abriria buracos no meio da marca. Sobre este rodapé, que é
              branco, a diferença é invisível.

              SE O RODAPÉ MUDAR DE COR, esta linha quebra e o conserto não é
              aqui: é pedir o vetor à Maliha. Fica anotado.

              `h-16` VIROU `h-12` EM 15-09, junto com o header e pelo mesmo
              motivo: com a marca completa o logo ficou grande demais. Aqui não
              há aperto de largura — a coluna é `auto` numa grade `[auto_1fr]`
              de 1200 com 80px de vão —, então o que manda é o peso visual.
              A 48px de altura a marca ocupa 120px, contra os 89px do letreiro
              antigo em `h-16`: continua maior, e é para continuar, porque
              ganhou o símbolo. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cdna-logo-full.png"
            alt="CorporateDNA Consulting"
            className="h-12 w-auto"
          />
        </Link>

        <nav className="flex justify-end">
          <div className="flex flex-col items-start gap-8 text-left sm:flex-row sm:gap-16">
          <div className="flex flex-col gap-3.5">
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
          <span
            aria-hidden="true"
            className="h-px w-[35%] self-start bg-brand sm:h-auto sm:w-px sm:self-stretch"
          />
          <div className="flex flex-col gap-3.5">
            {utilityLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[13px] font-semibold uppercase tracking-[1.5px] text-brand transition-colors hover:text-brand-dark"
              >
                {l.label}
              </Link>
            ))}
          </div>
          </div>
        </nav>
      </div>

      <div className="bg-ink py-6 text-center">
        <span className="text-[15px] font-medium tracking-[3px] text-white/70">
          Making Leadership Real
        </span>
      </div>
    </footer>
  );
}
