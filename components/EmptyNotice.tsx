/** Graceful empty state for CMS-backed lists/pages with no content yet. */
export default function EmptyNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 border border-dashed border-line bg-paper/60 px-7 py-8 text-[13.5px] text-muted">
      <span className="inline-block h-2 w-2 flex-none rounded-full bg-brand" />
      {children}
    </div>
  );
}
