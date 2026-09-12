/**
 * Builds the site nav with the Services submenu populated.
 *
 * NÃO LÊ MAIS O CMS (11-09). O submenu vinha de `getSolutionCards()`, e isso
 * passou a ser um jeito de a home e o menu discordarem das páginas: o CMS
 * publica a taxonomia antiga (nove entradas, dois nomes que saíram, um
 * duplicado), enquanto as páginas de serviço são os dez do outline de 09-09. Um
 * menu listando serviço que não existe mais é link para 404 — ou para um 301, na
 * melhor das hipóteses.
 *
 * Continua async porque é isso que `SiteShell` espera, e porque a volta ao CMS
 * (quando os dez estiverem lá) não deve mexer em call site nenhum.
 */
import { siteNav, type NavItem } from "./nav";
import { services } from "./services";

export async function buildSiteNav(): Promise<NavItem[]> {
  const solutionChildren = services.map((s) => ({
    label: s.title,
    href: `/services/${s.slug}`,
  }));

  // Matched on `href`, not on the label: labels are copy and get renamed by the
  // client (the 27-08 brief turned "Solutions" into "Our Solutions"), while the
  // route is stable. A label match fails silently — the submenu just stops
  // appearing, with no error — which is exactly what happened after that rename.
  return siteNav.map((item) =>
    item.href === "/services"
      ? { ...item, children: [...(item.children ?? []), ...solutionChildren] }
      : item,
  );
}
