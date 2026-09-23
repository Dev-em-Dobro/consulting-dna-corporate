import type { Metadata } from "next";
import Link from "next/link";
import { SHOW_SERVICE_PAGE_EDITORS } from "@/lib/service-pages-copy";

/**
 * `/edit` — o índice das telas de edição de texto.
 *
 * EXISTE PARA A CLIENTE TER UMA URL SÓ. Com `/edit-home` e `/edit-about` já são
 * dois endereços para decorar, e mandar dois links por WhatsApp é o começo de
 * mandar quatro. Daqui ela chega nas duas, e o rótulo "Corporate DNA" da barra
 * de cada editor volta para cá.
 *
 * ⚠️ SEM LOGIN, como as duas telas que ele lista. `noindex`, fora do sitemap e
 * bloqueado no `robots.ts` — o que não é proteção, só higiene: quem tiver a URL
 * edita. A caixa em `lib/page-copy/route.ts` conta o porquê e onde fechar.
 *
 * ESTÁTICO de propósito: não lê copy nenhuma, então não precisa de
 * `force-dynamic` como as outras duas.
 */
export const metadata: Metadata = {
  title: "Edit page text | Corporate DNA",
  robots: { index: false, follow: false },
};

const PAGES = [
  {
    href: "/edit-home",
    title: "Home page",
    body: "Headline, what we solve, the client impact cards, our people, the book and the contact block.",
  },
  {
    href: "/edit-about",
    title: "About page",
    body: "Headline, the four numbers, our purpose and promise, the values, the regions and the offices.",
    note: "The four numbers also appear on the Clients & Impact page — editing them here changes both.",
  },
  {
    href: "/edit-team",
    title: "Team page",
    body: "Headline, the leadership and faculty headings, the job title, region and quote of each leader, the four DNA experience cards and the closing band.",
    note: "Names and photos are not editable here — send those to us.",
  },
  {
    href: "/edit-services",
    title: "Services page",
    /* ⏸️ AS DEZ INTERNAS SAÍRAM DAQUI em 23-09 — ver `SHOW_SERVICE_PAGE_EDITORS`
       em `lib/service-pages-copy.ts`. Enquanto a bandeira estiver desligada,
       este cartão fala só da listagem, que é o que a cliente alcança. */
    body: SHOW_SERVICE_PAGE_EDITORS
      ? "Headline, the “What we do” label, the Partners block and the closing band — plus a way in to each of the ten service pages."
      : "Headline, the “What we do” label, the Partners block and the closing band.",
    note: SHOW_SERVICE_PAGE_EDITORS
      ? "Each service page has its own screen, listed at the foot of that one."
      : "The ten individual service pages are not editable yet — send us those changes.",
  },
  {
    href: "/edit-clients",
    title: "Clients & Impact page",
    body: "Headline, the heading of every section, the “A force for good” block, the footprint labels and the closing band.",
    note: "The four numbers in the dark band are edited on the About page; the case studies and quotes come from the CMS.",
  },
];

export default function EditIndexPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Mesmo motivo da caixa no `CopyEditor`: o banner de cookies e o botão do
          WhatsApp vêm do layout raiz e não fazem sentido numa tela de trabalho. */}
      <style>{`[aria-label="Cookie consent"],[aria-label="Chat with us on WhatsApp"]{display:none!important}`}</style>
      <div className="mx-auto max-w-[760px] px-6 py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-brand">Corporate DNA</p>
        <h1 className="mt-1 text-[28px] font-semibold leading-tight">Edit the website text</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Choose a page, change any text and click <strong className="text-ink">Save changes</strong>. The website
          updates within a few seconds. Leave a field empty to restore its original text.
        </p>

        <ul className="mt-10 space-y-4">
          {PAGES.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="block border border-line bg-white px-6 py-5 transition-colors hover:border-brand"
              >
                <span className="flex items-baseline justify-between gap-4">
                  <span className="text-[18px] font-semibold">{p.title}</span>
                  <span aria-hidden className="text-[14px] text-brand">
                    Edit →
                  </span>
                </span>
                <span className="mt-1.5 block text-[14px] leading-relaxed text-muted">{p.body}</span>
                {p.note && <span className="mt-2 block text-[13px] leading-relaxed text-brand">{p.note}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
