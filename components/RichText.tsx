/**
 * Renders CMS-authored HTML body fields (`body`, `summary`, `problemStatement`).
 * Content is first-party — authored by trusted editors behind the CMS admin auth — so it is
 * rendered directly. If untrusted authorship ever becomes a concern, swap in a sanitiser
 * (e.g. isomorphic-dompurify) here without touching call sites.
 */
export default function RichText({
  html,
  className = "",
}: {
  html?: string;
  className?: string;
}) {
  if (!html) return null;
  return (
    <div
      className={
        "space-y-4 text-[17px] leading-[1.7] text-muted [&_a]:text-brand [&_a:hover]:underline [&_strong]:text-ink [&_h2]:mt-8 [&_h2]:text-[24px] [&_h2]:font-bold [&_h2]:text-ink [&_ul]:list-disc [&_ul]:pl-5 " +
        className
      }
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
