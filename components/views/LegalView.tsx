import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import content from "@/lib/legal-content.json";
import translated from "@/lib/legal-content-pt.json";

type PolicyKey = keyof typeof content;
type Block = { type: string; text: string; href?: string };

function PolicyBody({ blocks, policy }: { blocks: Block[]; policy: PolicyKey }) {
  const elements: React.ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === "list") {
      const items: string[] = [];
      while (blocks[i]?.type === "list") items.push(blocks[i++].text);
      i--;
      elements.push(<ul key={`list-${i}`} className="list-disc space-y-2 pl-6 text-[16px] leading-[1.75] text-muted marker:text-brand">{items.map((item) => <li key={item}>{item}</li>)}</ul>);
    } else if (block.type === "heading") {
      elements.push(<h2 key={i} id={policy === "cookies" && block.text.startsWith("3.") ? "your-choice" : undefined} className="scroll-mt-28 pt-7 font-serif text-[25px] font-semibold leading-tight text-ink md:text-[30px]">{block.text}</h2>);
    } else if (block.type === "link") {
      const button = block.href === "/cookies#your-choice";
      elements.push(<p key={i} className="text-[15px] font-semibold text-brand">{button ? <CookieSettingsButton label={block.text} /> : block.href?.startsWith("/") ? <Link href={block.href}>{block.text}</Link> : <a href={block.href} target="_blank" rel="noopener noreferrer">{block.text}</a>}</p>);
    } else {
      elements.push(<p key={i} className="text-[16px] leading-[1.75] text-muted md:text-[17px]">{block.text}</p>);
    }
  }
  return <div className="space-y-5">{elements}</div>;
}

/** The supplied documents are versioned with the site so these pages have complete copy. */
export default function LegalView({ cmsKey }: { cmsKey: PolicyKey }) {
  const english = content[cmsKey];
  const portuguese = translated[cmsKey];
  const ptBlocks = english.blocks.map((block, index) => ({ ...block, text: portuguese.blocks[index] }));
  return <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
    <SiteShell floatingNav footerTopBorder>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-36 md:px-10 md:pb-20 md:pt-44">
          <p className="mb-5 text-[13px] font-semibold uppercase tracking-[1.5px] text-brand-light">CorporateDNA Consulting</p>
          <div data-no-translate className="locale-en-only"><h1 className="max-w-[950px] font-serif text-[40px] font-semibold leading-[1.05] md:text-[58px]">{english.title}</h1><p className="mt-5 max-w-[750px] text-[17px] leading-relaxed text-white/75 md:text-[20px]">{english.subtitle}</p><p className="mt-8 text-[13px] text-white/60">{english.updated}</p><p className="mt-1 text-[13px] text-white/60">Website: corporatednaconsulting.com</p></div>
          <div data-no-translate className="locale-pt-only"><h1 className="max-w-[950px] font-serif text-[40px] font-semibold leading-[1.05] md:text-[58px]">{portuguese.title}</h1><p className="mt-5 max-w-[750px] text-[17px] leading-relaxed text-white/75 md:text-[20px]">{portuguese.subtitle}</p><p className="mt-8 text-[13px] text-white/60">{portuguese.updated}</p><p className="mt-1 text-[13px] text-white/60">Site: corporatednaconsulting.com</p></div>
        </div>
      </section>
      <article className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <div data-no-translate className="locale-en-only max-w-[850px]"><PolicyBody blocks={english.blocks} policy={cmsKey} /></div>
        <div data-no-translate className="locale-pt-only max-w-[850px]"><PolicyBody blocks={ptBlocks} policy={cmsKey} /></div>
      </article>
    </SiteShell>
  </div>;
}
