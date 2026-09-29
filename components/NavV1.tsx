"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteNav, type NavItem } from "@/lib/nav";

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function NavV1({
  items = siteNav,
  theme = "brand",
}: {
  items?: NavItem[];
  theme?: "brand" | "light";
}) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const light = theme === "light";

  const isActive = (href?: string) => {
    if (!href || href.includes("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b ${
        light ? "border-line bg-white text-ink" : "border-transparent bg-brand text-white"
      }`}
    >
      {/* 1440px, e não os 1200px históricos, desde 08-09.
          O conteúdo da /about-v2 subiu para 1440 e o logo ficava 120px à direita
          da borda do título numa tela de 1600  -  a barra e o conteúdo têm de
          correr na mesma margem, senão parece defeito.

          ⚠️ ESTA BARRA É DE TODAS AS PÁGINAS. As demais ainda têm conteúdo em
          1200, então nelas a relação agora está INVERTIDA: a barra é mais larga
          que o conteúdo. É a mesma quantidade de desalinhamento de antes, do
          outro lado, e some quando o resto do site migrar para 1440.
          O painel do menu no telefone (mais abaixo) segue em 1200 de propósito:
          ele só aparece abaixo de `lg`, onde nem 1200 nem 1440 chegam a valer. */}
      <div
        className={`mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 md:px-10 ${
          light ? "h-[56px]" : "h-[76px]"
        }`}
      >
        <Link
          href="/"
          className="flex flex-none items-center gap-3"
          onClick={() => setOpen(false)}
        >
          {/* A MARCA COMPLETA desde 15-09  -  item 1. O raciocínio inteiro (por
              que PNG, por que a altura é menor até `xl`, e a conta de largura a
              1024) está na NavV2, que é a outra barra do site e tem o orçamento
              mais apertado das duas. Aqui a conta é a mesma com folga maior: o
              menu desta barra mede 773px, e a 1024 sobram 840 para ele com o
              logo em `h-8`. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={light ? "/cdna-logo-full.png" : "/cdna-logo-full-light.png"}
            alt="CorporateDNA Consulting"
            className={light ? "h-[33px] w-auto" : "h-[37px] w-auto xl:h-[47px]"}
          />
        </Link>

        {/* desktop nav  -  `lg` (1024px) and not `md` (768px). Measured with the
            08-09 menu: the row is 773px wide, and with the logo and its gap it
            needs ~944px before it stops running past the right edge. On `md` the
            overflow was clipped rather than scrolled, so the item that vanished
            was the last one  -  the Contact button. A hamburger on a tablet beats
            a CTA that is silently not there. */}
        <nav className={`hidden items-center justify-end lg:flex ${light ? "gap-[26px]" : "gap-[30px]"}`}>
          {items.map((item) =>
            item.cta ? (
              // Outline and not a filled block: this bar is already solid brand
              // in V1 and sits over the hero photo in V2/V3, so a white border
              // is the one treatment that reads as a button on both without a
              // per-header variant. Fills white on hover.
              <Link
                key={item.label}
                href={item.href ?? "#"}
                className={`inline-flex items-center whitespace-nowrap rounded-full border px-5 py-3 text-[11.5px] font-semibold uppercase leading-none tracking-[0.6px] transition-colors duration-200 ${
                  light
                    ? "border-brand bg-brand text-white hover:border-brand-dark hover:bg-brand-dark"
                    : "border-white/70 text-white hover:border-white hover:bg-white hover:text-brand"
                }`}
              >
                {item.label}
              </Link>
            ) : item.children ? (
              <div key={item.label} className="group relative -top-[2px]">
                <Link
                  href={item.href ?? "#"}
                  aria-haspopup="true"
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 pb-1 text-[11.5px] font-semibold uppercase leading-none tracking-[0.6px] underline-offset-[6px] transition-colors duration-200 ${
                    light
                      ? isActive(item.href)
                        ? "border-brand text-ink"
                        : "border-transparent text-ink hover:border-brand"
                      : "border-transparent text-white group-hover:underline"
                  }`}
                >
                  {item.label}
                  <Chevron className="transition-transform duration-200 group-hover:rotate-180" />
                </Link>
                {/* dropdown  -  opacity + pointer-events (not `invisible`) so the
                    links stay focusable for keyboard nav and reveal on focus */}
                <div className="pointer-events-none absolute right-0 top-full pt-4 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                  <div className="min-w-[248px] border border-line bg-white py-2 text-ink shadow-xl">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-5 py-2.5 text-[13px] font-medium tracking-[0.2px] text-ink/80 transition-colors hover:bg-paper hover:text-brand"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href ?? "#"}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`inline-flex items-center whitespace-nowrap border-b-2 pb-1 text-[11.5px] font-semibold uppercase leading-none tracking-[0.6px] underline-offset-[6px] transition-colors duration-200 ${
                  light
                    ? isActive(item.href)
                      ? "border-brand text-ink"
                      : "border-transparent text-ink hover:border-brand"
                    : "border-transparent text-white hover:underline"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="v1-mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className={`-mr-2 flex h-11 w-11 cursor-pointer items-center justify-center lg:hidden ${
            light ? "text-ink" : "text-white"
          }`}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* mobile panel */}
      {open && (
        <nav
          id="v1-mobile-nav"
          className="border-t border-white/15 bg-brand lg:hidden"
        >
          <div className="mx-auto flex max-w-[1200px] flex-col px-6 pb-5 pt-1">
            {items.map((item) =>
              item.cta ? (
                // Filled here, unlike the desktop outline: the panel is a stack
                // of bordered rows, and an outlined button inside it would just
                // read as one more row.
                <Link
                  key={item.label}
                  href={item.href ?? "#"}
                  onClick={() => setOpen(false)}
                  className="mt-5 flex items-center justify-center bg-white px-5 py-3.5 text-[15px] font-semibold uppercase tracking-[0.6px] text-brand"
                >
                  {item.label}
                </Link>
              ) : item.children ? (
                <div key={item.label} className="border-b border-white/10">
                  <button
                    type="button"
                    aria-expanded={openGroup === item.label}
                    onClick={() =>
                      setOpenGroup((g) => (g === item.label ? null : item.label))
                    }
                    className="flex w-full cursor-pointer items-center justify-between py-3.5 text-[15px] font-semibold uppercase tracking-[0.6px] text-white"
                  >
                    {item.label}
                    <Chevron
                      className={
                        "transition-transform duration-200 " +
                        (openGroup === item.label ? "rotate-180" : "")
                      }
                    />
                  </button>
                  {openGroup === item.label && (
                    <div className="pb-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block py-2.5 pl-4 text-[14px] font-medium tracking-[0.3px] text-white/85"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href ?? "#"}
                  onClick={() => setOpen(false)}
                  className="border-b border-white/10 py-3.5 text-[15px] font-semibold uppercase tracking-[0.6px] text-white"
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
