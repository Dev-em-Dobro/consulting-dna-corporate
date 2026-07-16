"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.jpg";
import wordmark from "@/public/cdna-logo-text-white.png";

type NavItem = { label: string; href: string };

export default function NavV1({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand text-white">
      <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between gap-6 px-6 md:px-10">
        <Link
          href="#top"
          className="flex flex-none items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src={logo}
            alt="Corporate DNA"
            className="h-[44px] w-[44px] rounded-full object-cover ring-1 ring-white/40"
            priority
          />
          <Image
            src={wordmark}
            alt="Corporate DNA Consulting"
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center justify-end gap-[30px] md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="whitespace-nowrap text-[11.5px] font-semibold uppercase tracking-[0.6px] text-white underline-offset-[6px] transition-colors duration-200 hover:underline"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="whitespace-nowrap rounded-full border-[1.5px] border-white/75 px-5 py-[9px] text-[11.5px] font-bold uppercase tracking-[0.6px] text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-brand"
          >
            Start a Conversation
          </a>
        </nav>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="v1-mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 flex h-11 w-11 items-center justify-center text-white md:hidden"
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
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-3.5 text-[15px] font-semibold uppercase tracking-[0.6px] text-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-5 rounded-full border-[1.5px] border-white/80 px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.6px] text-white"
            >
              Start a Conversation
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
