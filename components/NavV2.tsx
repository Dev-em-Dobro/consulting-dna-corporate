"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
 * Nav da home (`/`), da `/about` e da `/home-v3`. Desde 10-09, quando a V2
 * virou o site, este é o menu que a maioria das páginas novas usa; a NavV1
 * segue no `SiteShell`, servindo o resto do site e a `/home-v1`.
 *
 * Nasceu como cópia da NavV1 com uma mudança: a barra deixa de ser uma
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
/**
 * `maxWidthClass` — a largura do container quando `wide` está desligado.
 *
 * Nasceu em 08-09 para a /about-v2, que levou o conteúdo para 1440px e pediu
 * este menu transparente: com o padrão de 1200 o logo ficaria 120px à direita
 * da borda do título, o mesmo defeito que a prop `wide` resolveu para a
 * /home-v3, só que num tamanho intermediário.
 *
 * Prop com valor padrão em vez de trocar o número aqui dentro: a /home-v2 usa
 * este mesmo componente e continua em 1200. Mudar a constante alinharia a
 * about e desalinharia a home no mesmo commit.
 */
/**
 * `outlined` — o menu na tipografia do teste de 09-09, com o Contact virando
 * botão vermelho sólido e os demais itens ganhando uma régua vermelha no hover.
 *
 * Pedido de 09-09 para a /about-v2, junto com o teste de tipografia: o menu em
 * caixa alta 11,5px é parte do que a Rhea chama de "quadrado demais". Aqui ele
 * vira Geist 400 em caixa baixa, 16px — os valores medidos no menu da própria
 * Explore, e não os da grade escrita. Ver o comentário de `linkType`.
 *
 * ⚠️ O NOME DA PROP FICOU MAIOR QUE A COISA. Ela nasceu para dar CONTORNO
 * vermelho a cada item, e o contorno foi rejeitado no mesmo dia: oito caixas
 * vermelhas em fila sobre a foto do herói leem como formulário. O que ficou é a
 * tipografia + o Contact sólido + a régua de hover (`.navlink` no globals.css).
 * Se o teste for aprovado e isto virar o menu de verdade, o nome muda junto.
 *
 * O CONTACT É O ÚNICO SÓLIDO, e é o que sustenta a hierarquia: os outros sete
 * não têm fundo nenhum, então o vermelho cheio marca a ação primária sozinho —
 * era o que o contorno branco fazia antes, com menos ênfase.
 *
 * Prop, e não um NavV3 copiado, pela mesma razão que `wide` e `maxWidthClass`:
 * a diferença é um punhado de classes, e a /home-v2 e a /home-v3 usam este
 * arquivo. Desligado por padrão — quem não pedir continua com o menu de antes.
 *
 * Só o cabeçalho de desktop muda. O painel do telefone abre sobre `bg-brand`
 * sólido, onde régua vermelha é invisível por definição.
 */
export default function NavV2({
  items = siteNav,
  wide = false,
  maxWidthClass = "max-w-[1200px]",
  outlined = false,
  activeHref,
}: {
  items?: NavItem[];
  wide?: boolean;
  maxWidthClass?: string;
  outlined?: boolean;
  /**
   * Qual item marcar como ativo, quando a rota atual não é a do item.
   *
   * Existe por causa da /about-v2: ela É a página About, mas mora numa rota de
   * proposta, e o item do menu aponta para `/our-identity`. Sem isto o menu
   * ficaria sem nenhum item marcado justamente na página que o pedido de 09-09
   * cita ("quando estiver na página about, marcar o menu"). A página declara o
   * que ela representa, em vez de a nav adivinhar.
   *
   * Sem a prop, vale a rota real — então quando isto virar a /about de verdade
   * o comportamento continua certo e a prop simplesmente sai.
   */
  activeHref?: string;
}) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const current = activeHref ?? pathname;

  /**
   * Um item está ativo se a rota atual é a dele ou vive debaixo dela.
   *
   * As duas exclusões não são detalhe — sem elas o menu marca a coisa errada em
   * toda página do site:
   *
   *   • HREF COM `#` nunca casa. "Books" aponta para `/#book` e "Contact" para
   *     `/#contact`: os dois são a HOME com uma âncora, e casar por prefixo os
   *     deixaria ativos em qualquer lugar. Âncora não é página.
   *   • HREF `/` só casa exato. Todo caminho começa com "/", então prefixo aqui
   *     marcaria a home em todas as rotas do site ao mesmo tempo.
   *
   * O prefixo com barra (`/solutions/` e não `/solutions`) é o que faz o item
   * Services acender também nas páginas filhas que vêm do CMS, sem acender numa
   * rota vizinha que só compartilhe o começo do nome.
   */
  const isActive = (href?: string) => {
    if (!href || !current || href.includes("#")) return false;
    if (href === "/") return current === "/";
    return current === href || current.startsWith(href + "/");
  };

  /* Tipografia dos itens. Sair da CAIXA ALTA é metade do efeito: 11,5px em
     maiúsculas com peso 600 é o que dá o ar de barra corporativa, e é ele que
     a referência da Explore Performance não tem.

     PESO 400, e não os 500 da grade de 09-09. A grade escreve "Botões, menu,
     links de navegação — Geist 500, 16px, espaçamento 0,5px"; medido no menu da
     própria Explore, que é a referência de onde a grade saiu, os itens são
     **Platform Web 400, 16px, `letter-spacing: normal`**. A grade endureceu os
     dois valores no caminho. Aqui vale a medida, não a transcrição — e por isso
     o espacejamento de 0,5px também caiu junto.

     400 é o mais leve que dá para usar sem mexer no carregamento: a Geist é
     baixada nesta página com 400/500/600/700. Ela tem 100–300, mas cada peso é
     um arquivo a mais na primeira dobra, e 300 em corpo de 15px sobre foto já
     começa a sumir — o menu é branco sobre imagem, não preto sobre branco.

     A família não é declarada aqui: a página envolve a árvore inteira com a
     Geist trocando o `--font-sans` local, então este componente continua
     dizendo apenas `font-sans` e serve às duas páginas sem saber de fonte.

     16px EM TODA A FAIXA, sem degrau responsivo — e isso só passou a caber por
     causa do peso. Medido: a 500 o menu dava 893px a 16px e estourava o tablet
     de 1024, onde o espaço livre (container menos o logo de 67px e o vão de
     24px) é de 853px; a solução na época foi cair para 14,5px de 1024 a 1279.
     A 400 o mesmo menu mede 748px. Sobram 105px em 1024, com folga de sobra
     para a seta de ~18px que o item Services ganha quando o CMS responde — o
     que o teste local, com o CMS fora do ar, esconde.

     Ou seja: aliviar o peso pagou o corpo de letra. É por isso que o degrau
     `xl:` saiu em vez de virar um número menor. */
  const linkType = outlined
    ? "font-serif text-[16px] font-normal"
    : "text-[11.5px] font-semibold uppercase tracking-[0.6px]";

  /* O BOTÃO É UM DEGRAU MAIS PESADO QUE OS LINKS — 500 contra 400, mesmo corpo.
     Não é escolha nossa: medido no header da Explore, os itens são peso 400 e o
     "Get In Touch" é 500. É a hierarquia sendo dita duas vezes, pelo fundo cheio
     e pelo peso, que é o que faz um botão continuar lendo como botão mesmo
     quando o texto dele tem o mesmo tamanho dos vizinhos. */
  const ctaType = outlined
    ? "font-serif text-[16px] font-medium"
    : "text-[11.5px] font-semibold uppercase tracking-[0.6px]";

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
          wide ? "w-full" : maxWidthClass
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
            Contact button with it.

            O VÃO CAI DE 30px PARA 26px na variante `outlined` porque o rótulo
            cresceu: 11,5px em caixa alta contra 16px em caixa baixa. Vão
            fixo com corpo maior aperta o menu sem que ninguém tenha mexido no
            vão. As larguras estão no comentário de `linkType`, acima. */}
        <nav
          className={`hidden items-center justify-end lg:flex ${
            outlined ? "gap-[26px]" : "gap-[30px]"
          }`}
        >
          {items.map((item) =>
            item.cta ? (
              // Contorno branco no padrão — um botão que funciona tanto sobre a
              // faixa vermelha quanto sobre a foto, que é justamente por que ele
              // é contorno e não preenchimento (mesmo tratamento da NavV1).
              // Em `outlined` ele vira vermelho SÓLIDO: com os sete vizinhos
              // agora também encapsulados, contorno não distingue mais nada, e
              // a única forma de o Contact continuar lendo como a ação primária
              // é ser o único cheio.
              <Link
                key={item.label}
                href={item.href ?? "#"}
                className={
                  outlined
                    ? `inline-flex items-center whitespace-nowrap border border-brand bg-brand px-4 py-2.5 leading-none text-white transition-colors duration-200 hover:border-brand-dark hover:bg-brand-dark ${ctaType}`
                    : `inline-flex items-center whitespace-nowrap border border-white/70 px-4 py-2.5 leading-none text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-brand ${ctaType}`
                }
              >
                {item.label}
              </Link>
            ) : item.children ? (
              // ALINHAMENTO DO ITEM COM SETA — corrigido em 09-09, medido.
              //
              // Ele nascia 3px acima dos vizinhos, e eram duas causas somadas:
              //
              //   2px  do `-top-[2px]` que estava aqui. Ele compensava um estado
              //        antigo do menu, e o próprio comentário anterior já
              //        avisava que "encapsulados, os oito têm a mesma altura de
              //        caixa e o ajuste vira desalinhamento". Era o caso.
              //   1px  do wrapper. Ele é um `div` de bloco e herda `line-height:
              //        24px`, enquanto o link dentro dele tem 16px. Sendo o
              //        wrapper o item flex da barra, o link ficava ancorado na
              //        LINHA DE BASE dessa caixa de 24px em vez de centrado
              //        nela — os vizinhos são links de 16px direto, sem caixa
              //        intermediária.
              //
              // `flex items-center` no wrapper elimina a caixa de linha: o link
              // passa a ser filho flex e é alinhado pelo mesmo algoritmo que
              // posiciona os outros oito. Medido depois: diferença 0,0px.
              //
              // Vale para as três páginas que usam esta barra — /about-v2,
              // /home-v2 e /home-v3.
              <div
                key={item.label}
                className="group relative flex items-center"
              >
                <Link
                  href={item.href ?? "#"}
                  aria-haspopup="true"
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={
                    outlined
                      ? `navlink inline-flex items-center gap-1.5 whitespace-nowrap leading-none text-white transition-colors duration-200 ${
                          isActive(item.href) ? "navlink--active" : ""
                        } ${linkType}`
                      : `inline-flex items-center gap-1.5 whitespace-nowrap leading-none text-white underline-offset-[6px] transition-colors duration-200 group-hover:underline ${
                          isActive(item.href) ? "underline" : ""
                        } ${linkType}`
                  }
                >
                  {outlined && <span aria-hidden className="navlink__rule" />}
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
                aria-current={isActive(item.href) ? "page" : undefined}
                className={
                  outlined
                    ? `navlink inline-flex items-center whitespace-nowrap leading-none text-white transition-colors duration-200 ${
                        isActive(item.href) ? "navlink--active" : ""
                      } ${linkType}`
                    : `inline-flex items-center whitespace-nowrap leading-none text-white underline-offset-[6px] transition-colors duration-200 hover:underline ${
                        isActive(item.href) ? "underline" : ""
                      } ${linkType}`
                }
              >
                {outlined && <span aria-hidden className="navlink__rule" />}
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

      {/* ── Painel do telefone ────────────────────────────────────────
          ABERTURA SUAVE — 09-09. Antes era `{open && (...)}`: montagem
          condicional, sem transição possível. O painel aparecia e sumia de um
          quadro para o outro, e no telefone isso lê como a página tendo pulado.

          Agora ele fica SEMPRE MONTADO e o que muda é o estado. A altura anima
          pelo truque de grade — `grid-rows-[0fr]` para `grid-rows-[1fr]`, com
          `overflow-hidden` no filho. É a única forma de animar até "a altura do
          conteúdo" sem medir nada em JS nem cravar um `max-height` chutado, que
          é o defeito clássico deste componente: chuta baixo e corta o menu,
          chuta alto e a animação fica lenta no fim, parada, esperando o tempo
          acabar.

          `invisible` acompanha o fechado, e não é enfeite: sem ele o painel
          continua no fluxo de foco, e quem navega por teclado ou leitor de tela
          entra em oito links invisíveis depois do botão do menu. Com
          `visibility` na transição, ele só some DEPOIS da animação — daí o
          `transition-[grid-template-rows,opacity,visibility]`.

          O `aria-hidden` segue o mesmo estado, para leitor de tela e foco
          contarem a mesma história.

          ⚠️ CURVA ASSIMÉTRICA — a duração e a easing moram DENTRO das strings de
          cada estado, e não na classe comum, de propósito.

          A primeira versão usava `ease-out` nos dois sentidos e o fechamento
          ficou travado. `ease-out` é `cubic-bezier(0, 0, 0.2, 1)`: começa rápido
          e tem cauda longa. Entrando isso é o certo — o conteúdo chega depressa
          e assenta devagar. Saindo é o defeito: o painel colapsa quase todo no
          primeiro terço e o último pedaço se arrasta enquanto o dedo já saiu do
          botão. A saída pede o contrário, `ease-in`, e menos tempo: 200ms contra
          300ms. Fechar tem de parecer imediato; abrir é que pode ter graça. */}
      <nav
        id="v1-mobile-nav"
        aria-hidden={!open}
        className={`grid border-t border-white/15 bg-brand transition-[grid-template-rows,opacity,visibility] lg:hidden ${
          open
            ? "visible grid-rows-[1fr] opacity-100 duration-300 ease-out"
            : "invisible grid-rows-[0fr] opacity-0 duration-200 ease-in"
        }`}
      >
        <div className="overflow-hidden">
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
                  {/* Mesmo truque de grade do painel, e pela mesma razão: aqui
                      são oito filhos de altura variável, então qualquer
                      `max-height` seria chute. 250ms contra os 300 do painel —
                      é um movimento menor, dentro de outro que já está
                      acontecendo, e igualar os dois faria o submenu parecer
                      atrasado.

                      CURVA ASSIMÉTRICA, como no painel: `ease-out` para entrar,
                      `ease-in` e mais curto para sair. Ver a explicação lá em
                      cima — a mesma cauda que trava o fechamento do painel
                      travava o deste submenu. */}
                  <div
                    className={`grid transition-[grid-template-rows] ${
                      openGroup === item.label
                        ? "grid-rows-[1fr] duration-250 ease-out"
                        : "grid-rows-[0fr] duration-200 ease-in"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            tabIndex={openGroup === item.label ? undefined : -1}
                            className="block py-2.5 pl-4 text-[14px] font-medium tracking-[0.3px] text-white/85"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
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
        </div>
      </nav>
    </header>
  );
}
