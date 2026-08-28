/**
 * Brand-red accent rule + label sitting above a section heading.
 *
 * Lifted out of the old /about page when it split into Our Identity and Our
 * Team (27-08 brief, items 4 and 15) so both halves — and the new Our Clients /
 * Our Impact / Our Partnerships pages — share one definition instead of
 * re-declaring the same markup per page. The brand red reads on both the white
 * and the `bg-ink` sections, so there is no light/dark variant.
 */
export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="inline-block h-0.5 w-9 bg-brand" />
      <span className="text-[12.5px] font-semibold uppercase tracking-[2px] text-brand">
        {children}
      </span>
    </div>
  );
}
