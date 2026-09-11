import NavV1 from "@/components/NavV1";
import NavV2 from "@/components/NavV2";
import SiteFooter from "@/components/SiteFooter";
import { buildSiteNav } from "@/lib/nav-server";

/** Site chrome (sticky nav + footer) wrapping a page's content. */
export default async function SiteShell({
  children,
  footerTopBorder = false,
  floatingNav = false,
}: {
  children: React.ReactNode;
  footerTopBorder?: boolean;
  /**
   * Troca a barra vermelha (NavV1) pelo menu transparente que flutua sobre o
   * herói (NavV2) — o mesmo da home e da /about.
   *
   * É OPT-IN, e não o novo padrão, porque as duas barras convivem de propósito
   * enquanto a migração não termina: 21 rotas ainda são NavV1 + Poppins, e
   * trocar o padrão aqui mudaria todas de uma vez sem ninguém ter pedido.
   *
   * ⚠️ AS DUAS OCUPAM ESPAÇO DIFERENTE, e quem liga isto precisa saber. A NavV1
   * é `sticky` e come 76px do fluxo; a NavV2 é `absolute` e não ocupa nada —
   * ela flutua POR CIMA da primeira seção. Ligar esta prop sem acertar o topo
   * do herói faz o conteúdo nascer debaixo do menu. A convenção que a /about
   * usa e que o <SolutionHero> segue: `min-h-svh` cheio mais `pt-[76px]`.
   *
   * `relative` no wrapper é o que ancora a NavV2: sem um ancestral posicionado
   * ela se prenderia ao documento inteiro em vez desta árvore.
   */
  floatingNav?: boolean;
}) {
  const nav = await buildSiteNav();
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white">
      {floatingNav ? (
        <NavV2 items={nav} maxWidthClass="max-w-[1440px]" outlined />
      ) : (
        <NavV1 items={nav} />
      )}
      <main className="flex-1">{children}</main>
      <SiteFooter topBorder={footerTopBorder} />
    </div>
  );
}
