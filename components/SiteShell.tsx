import NavV1 from "@/components/NavV1";
import SiteFooter from "@/components/SiteFooter";
import { buildSiteNav } from "@/lib/nav-server";

/** Site chrome (sticky nav + footer) wrapping a page's content. */
export default async function SiteShell({
  children,
  footerTopBorder = false,
}: {
  children: React.ReactNode;
  footerTopBorder?: boolean;
}) {
  const nav = await buildSiteNav();
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-white">
      <NavV1 items={nav} />
      <main className="flex-1">{children}</main>
      <SiteFooter topBorder={footerTopBorder} />
    </div>
  );
}
