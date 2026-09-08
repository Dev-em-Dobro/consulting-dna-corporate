"use client";

import { useState } from "react";
import Link from "next/link";
import { siteNav, type NavItem } from "@/lib/nav";

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/**
 * Nav da /home-v2 — cópia da NavV1 com uma mudança: a barra deixa de ser uma
 * faixa vermelha em cima da foto, passa a flutuar sobre ela e vai embora junto
 * com o herói quando a página rola.
 *
 * De onde vem: a Rhea não falou "tirem a barra", falou sobre caixas empilhadas
 * antes da imagem — o Guilherme traduziu na call interna `[02:52]`: "você tinha
 * o de cima com os menus, depois o de baixo com o que tá passando, depois vem a
 * imagem. Ela quer que você tenha tudo aberto pra ver a imagem, sem nenhuma
 * caixinha em volta". Tirar só o ticker resolve metade; a outra caixa é esta.
 *
 * `absolute` e não `sticky`/`fixed`, que é o que a NavV1 faz: medido no site de
 * referência em 03/09, o header deles é `position: absolute`, fundo
 * transparente, e some da tela ao rolar (a 1400px de rolagem ele está em
 * -1400). O menu existe na primeira dobra e devolve a tela inteira ao conteúdo
 * depois dela.
 *
 * Efeito colateral bom: sem barra por cima do conteúdo, não há mais o problema
 * de texto branco caindo sobre seção branca, então não existe estado de scroll,
 * listener, nem troca de cor. Menos código do que a versão anterior desta
 * mesma tela.
 *
 * Arquivo separado de propósito: a NavV1 é usada por TODAS as páginas do site,
 * e nenhuma delas pode mudar por causa desta proposta.
 */
/**
 * `wide` — larga a barra até as bordas da janela, em vez de prendê-la no
 * container de 1200px.
 *
 * Existe para a /home-v3 (07-09). Naquela referência o conteúdo encosta nas
 * laterais, e o herói de lá faz isso; se a nav continuasse centrada em 1200px, o
 * logo ficaria a ~390px da borda numa tela de 1900px enquanto o título começaria
 * a 40px. Os dois têm de correr na mesma margem, senão parece defeito.
 *
 * Opcional e desligado por padrão de propósito: a /home-v2 usa o mesmo
 * componente e não pode mudar. Prop em vez de um NavV3 copiado porque a
 * diferença é uma classe — duplicar 160 linhas por causa disso criaria dois
 * menus para manter em sincronia.
 *
 * Só o cabeçalho muda. O painel do menu no telefone continua em 1200px: ele
 * abre como lista de leitura, e largar linha de texto até a borda numa tela
 * grande piora a leitura em vez de melhorar.
 */
export default function NavV2({
  items = siteNav,
  wide = false,
}: {
  items?: NavItem[];
  wide?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  // Único caso que ainda pede fundo sólido: o menu aberto no telefone, senão os
  // itens caem por cima da foto e não se lê nenhum dos dois.
  return (
    <header
      className={`absolute top-0 z-50 w-full text-white ${
        open ? "bg-brand" : "bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex h-[76px] items-center justify-between gap-6 px-6 md:px-10 ${
          wide ? "w-full" : "max-w-[1200px]"
        }`}
      >
        <Link
          href="/"
          className="flex flex-none items-center gap-3"
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cdna-logo-light.svg"
            alt="Corporate DNA"
            className="h-12 w-auto"
          />
        </Link>

        {/* desktop nav — `lg`, same reason as NavV1: the 08-09 menu is 773px
            wide and gets clipped from the right on a `md` tablet, taking the
            Contact button with it. */}
        <nav className="hidden items-center justify-end gap-[30px] lg:flex">
          {items.map((item) =>
            item.cta ? (
              // Same outline treatment as NavV1 — over the hero photo here
              // rather than over the brand band, which is exactly why it is an
              // outline: one button that works on both backgrounds.
              <Link
                key={item.label}
                href={item.href ?? "#"}
                className="inline-flex items-center whitespace-nowrap border border-white/70 px-4 py-2.5 text-[11.5px] font-semibold uppercase leading-none tracking-[0.6px] text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-brand"
              >
                {item.label}
              </Link>
            ) : item.children ? (
              <div key={item.label} className="group relative -top-[2px]">
                <Link
                  href={item.href ?? "#"}
                  aria-haspopup="true"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11.5px] font-semibold uppercase leading-none tracking-[0.6px] text-white underline-offset-[6px] transition-colors duration-200 group-hover:underline"
                >
                  {item.label}
                  <Chevron className="transition-transform duration-200 group-hover:rotate-180" />
                </Link>
                {/* dropdown — opacity + pointer-events (not `invisible`) so the
                    links stay focusable for keyboard nav and reveal on focus */}
                <div className="pointer-events-none absolute right-0 top-full pt-4 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                  <div className="min-w-[248px] border border-line bg-white py-2 text-ink shadow-xl">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-5 py-2.5 text-[13px] font-medium tracking-[0.2px] text-ink/80 transition-colors hover:bg-paper hover:text-brand"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href ?? "#"}
                className="inline-flex items-center whitespace-nowrap text-[11.5px] font-semibold uppercase leading-none tracking-[0.6px] text-white underline-offset-[6px] transition-colors duration-200 hover:underline"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="v1-mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 flex h-11 w-11 cursor-pointer items-center justify-center text-white lg:hidden"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* mobile panel */}
      {open && (
        <nav
          id="v1-mobile-nav"
          className="border-t border-white/15 bg-brand lg:hidden"
        >
          <div className="mx-auto flex max-w-[1200px] flex-col px-6 pb-5 pt-1">
            {items.map((item) =>
              item.cta ? (
                <Link
                  key={item.label}
                  href={item.href ?? "#"}
                  onClick={() => setOpen(false)}
                  className="mt-5 flex items-center justify-center bg-white px-5 py-3.5 text-[15px] font-semibold uppercase tracking-[0.6px] text-brand"
                >
                  {item.label}
                </Link>
              ) : item.children ? (
                <div key={item.label} className="border-b border-white/10">
                  <button
                    type="button"
                    aria-expanded={openGroup === item.label}
                    onClick={() =>
                      setOpenGroup((g) => (g === item.label ? null : item.label))
                    }
                    className="flex w-full cursor-pointer items-center justify-between py-3.5 text-[15px] font-semibold uppercase tracking-[0.6px] text-white"
                  >
                    {item.label}
                    <Chevron
                      className={
                        "transition-transform duration-200 " +
                        (openGroup === item.label ? "rotate-180" : "")
                      }
                    />
                  </button>
                  {openGroup === item.label && (
                    <div className="pb-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block py-2.5 pl-4 text-[14px] font-medium tracking-[0.3px] text-white/85"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href ?? "#"}
                  onClick={() => setOpen(false)}
                  className="border-b border-white/10 py-3.5 text-[15px] font-semibold uppercase tracking-[0.6px] text-white"
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
