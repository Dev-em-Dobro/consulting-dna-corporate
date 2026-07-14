"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import menuLogo from "@/public/logo-menu-v2.png";

type NavItem = { label: string; href: string };

export default function NavV2({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-6 px-6 sm:px-8 md:h-[78px] md:px-11">
        <Link
          href="#top"
          className="flex flex-none items-center"
          onClick={() => setOpen(false)}
        >
          <Image
            src={menuLogo}
            alt="Corporate DNA"
            className="h-[46px] w-auto md:h-[52px]"
            priority
          />
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center justify-end gap-7 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="whitespace-nowrap text-[12.5px] font-semibold uppercase tracking-[0.5px] text-[#4a4548] transition-colors hover:text-brand"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="whitespace-nowrap border-[1.5px] border-brand px-5 py-[9px] text-[12.5px] font-bold uppercase tracking-[0.5px] text-brand transition-colors hover:bg-brand hover:text-white"
          >
            Start a Conversation
          </a>
        </nav>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="v2-mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 flex h-11 w-11 items-center justify-center text-ink md:hidden"
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
          id="v2-mobile-nav"
          className="border-t border-line bg-white md:hidden"
        >
          <div className="mx-auto flex max-w-[1240px] flex-col px-6 pb-5 pt-1 sm:px-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-3.5 text-[15px] font-semibold uppercase tracking-[0.5px] text-ink"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-5 border-[1.5px] border-brand px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.5px] text-brand"
            >
              Start a Conversation
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
