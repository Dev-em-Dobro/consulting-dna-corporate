import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.jpg";
import wordmark from "@/public/cdna-logo-text-white.png";
import { siteNav } from "@/lib/nav";

export default function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-white text-ink/70">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-14 md:px-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex items-start gap-7 sm:contents">
          <Link href="/v1" className="flex flex-none items-center gap-3.5">
            <Image
              src={logo}
              alt="Corporate DNA"
              className="h-14 w-14 rounded-full object-cover ring-1 ring-ink/10"
            />
            <Image
              src={wordmark}
              alt="Corporate DNA Consulting"
              className="h-11 w-auto invert"
            />
          </Link>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3.5 sm:flex sm:flex-wrap sm:gap-[26px]">
            {siteNav.map((item) => (
              <Link
                key={item.label}
                href={item.href ?? "#"}
                className="text-[12.5px] font-medium tracking-[0.4px] text-ink/70 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="text-[12.5px] text-ink/45">
          Making Leadership Real · Results Not Promises
        </div>
      </div>
    </footer>
  );
}
