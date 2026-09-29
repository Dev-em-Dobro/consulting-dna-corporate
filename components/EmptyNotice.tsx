/**
 * Graceful empty state for CMS-backed lists/pages with no content yet — and the
 * same treatment for copy still pending CDNA approval, which reads identically
 * to a visitor and identically to us: a slot that is deliberately not filled.
 *
 * `className` is appended so callers can add spacing when the notice follows a
 * heading, without each page re-declaring the dashed-border markup.
 */
export default function EmptyNotice({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-4 border border-dashed border-line bg-paper/60 px-7 py-8 text-[13.5px] text-muted ${className}`}
    >
      <span className="inline-block h-2 w-2 flex-none rounded-full bg-brand" />
      {/* Wrapped, not spread: this is a flex row, so a notice written with any
          markup in it — <strong>, a link — would otherwise turn each fragment
          into its own flex item and break the sentence into columns. */}
      <span>{children}</span>
    </div>
  );
}
