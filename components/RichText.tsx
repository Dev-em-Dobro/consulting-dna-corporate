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
  // Editors leave empty `<p><br></p>` paragraphs as blank lines. With `space-y`
  // spacing between blocks, those add a full extra line of gap — so drop any
  // paragraph that holds nothing but whitespace / <br> / &nbsp;.
  const clean = html.replace(
    /<p[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi,
    "",
  );
  if (!clean.trim()) return null;
  return (
    <div
      className={
        "space-y-4 text-[17px] leading-[1.7] text-muted [&_a]:text-brand [&_a:hover]:underline [&_strong]:text-ink [&_h2]:mt-8 [&_h2]:text-[24px] [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:text-[20px] [&_h3]:font-bold [&_h3]:text-ink [&_h3_strong]:text-ink [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_li]:pl-1 [&_li]:marker:text-brand [&_img]:my-6 [&_img]:block [&_img]:h-auto [&_img]:w-full [&_img]:border [&_img]:border-line " +
        className
      }
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
