"use client";

import { useState } from "react";
import Link from "next/link";
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

export default function NavV1({ items = siteNav }: { items?: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-brand text-white">
      <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between gap-6 px-6 md:px-10">
        <Link
          href="/"
          className="flex flex-none items-center gap-3"
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cdna-logo-light.svg"
            alt="Corporate DNA"
            className="h-12 w-auto"
          />
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center justify-end gap-[30px] md:flex">
          {items.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative -top-[2px]">
                <Link
                  href={item.href ?? "#"}
                  aria-haspopup="true"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11.5px] font-semibold uppercase leading-none tracking-[0.6px] text-white underline-offset-[6px] transition-colors duration-200 group-hover:underline"
                >
                  {item.label}
                  <Chevron className="transition-transform duration-200 group-hover:rotate-180" />
                </Link>
                {/* dropdown — opacity + pointer-events (not `invisible`) so the
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
                className="inline-flex items-center whitespace-nowrap text-[11.5px] font-semibold uppercase leading-none tracking-[0.6px] text-white underline-offset-[6px] transition-colors duration-200 hover:underline"
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
          className="-mr-2 flex h-11 w-11 cursor-pointer items-center justify-center text-white md:hidden"
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
          className="border-t border-white/15 bg-brand md:hidden"
        >
          <div className="mx-auto flex max-w-[1200px] flex-col px-6 pb-5 pt-1">
            {items.map((item) =>
              item.children ? (
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
