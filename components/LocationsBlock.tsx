"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { offices as defaultOffices, type Office } from "@/lib/offices";
import LocationsCarousel from "./LocationsCarousel";
import TypeLabel from "./TypeLabel";

// Keep Leaflet out of the initial homepage bundle — it only loads when the
// section scrolls into view (see the IntersectionObserver below).
const LocationsMap = dynamic(() => import("./LocationsMap"), { ssr: false });

/**
 * Homepage "Our offices" block (feature 003): a non-interactive Leaflet map with a
 * pin, a city carousel, and the active office's contact details. Falls back to a
 * plain office list when the map can't load (network / tile error).
 */
export default function LocationsBlock({
  offices = defaultOffices,
  eyebrow = "Our Global Presence",
  context = "From our established hubs in London, Singapore, Dubai and Riyadh, together with our Americas presence, Corporate DNA brings global perspective and locally relevant delivery to leadership challenges across 36 countries.",
  tone = "paper",
  maxWidthClass = "max-w-[1200px]",
  typeLabel = false,
  align = "left",
  showMap = true,
  showEmail = false,
}: {
  offices?: Office[];
  eyebrow?: string;
  context?: string;
  /**
   * Largura do container do cabeçalho e da lista de fallback.
   *
   * Existe desde 10-09, quando a home subiu de 1200 para 1440: este bloco
   * continuava em 1200 e passava a abrir 120px à direita de todas as seções
   * vizinhas, o que numa faixa de cor só lê como defeito de alinhamento.
   *
   * Prop com o padrão antigo, e não uma troca do número aqui dentro, porque o
   * bloco também roda na /our-clients, na /team e na /home-v3, que seguem
   * em 1200 — mudar a constante alinharia a home e desalinharia as outras três.
   * Mesmo padrão do `maxWidthClass` da NavV2.
   *
   * Só o cabeçalho e o fallback mudam: o mapa e o carrossel são presos em
   * 560px por desenho próprio e não acompanham a coluna da página.
   */
  maxWidthClass?: string;
  /**
   * Renderiza o rótulo pelo <TypeLabel> (14px/500/1,3px) em vez do span local
   * de 13px/600/2px, acompanhando o `tone` para o contraste sobre fundo escuro.
   *
   * Existe para a home, que em 10-09 adotou o TypeLabel em todos os rótulos de
   * seção. Desligado por padrão: /our-clients, /team e /home-v3 renderizam
   * este bloco com o rótulo de antes. Mesmo padrão de `maxWidthClass`.
   */
  typeLabel?: boolean;
  /**
   * Alinhamento do cabeçalho — o rótulo e o parágrafo de contexto.
   *
   * O CORPO DESTE BLOCO SEMPRE FOI CENTRADO: o mapa é preso em 560px com
   * `mx-auto`, e a régua de cidades, o carrossel e o endereço vivem na mesma
   * coluna de 560, todos com `text-center`. Só o cabeçalho corria à esquerda,
   * na largura da página. Com `center` o bloco inteiro passa a ter um eixo só.
   *
   * `left` por padrão porque é o que /our-clients e /home-v3 têm hoje, e
   * porque na home o cabeçalho alinha com as seções vizinhas — mesmo critério
   * de `maxWidthClass` e `typeLabel`.
   */
  align?: "left" | "center";
  /**
   * Ground the block sits on. `dark` is Guli's 31-08 fix for the homepage,
   * where this block and the book block above it were both light grey and
   * adjacent — the same collision he solved on Client Impact with red.
   *
   * A prop rather than a change to the component, because the block also runs
   * on Our Clients and Our Team, where it has different neighbours (a
   * black-and-white photograph, and the footer) and no collision to fix.
   * Darkening those uninvited would be inventing a decision he did not make.
   *
   * `ink-2` and not `ink`: the book block's card directly above is `ink`, so
   * reusing it would rhyme two dark masses across a thin paper gap. `ink-2` is
   * the darker of the two and reads as the "quase preto" he asked for.
   */
  tone?: "paper" | "dark";
  /**
   * O mapa Leaflet no topo do bloco. `false` deixa só a "faixa de baixo" — a
   * régua de cidades, o carrossel e o endereço da cidade ativa.
   *
   * EXISTE PARA A /about, 14-09. Pedido da Maliha na daily (item 4): *"I did
   * like on the original landing page that it was scrolling for the addresses
   * — without the map, if we can have just the bottom bit."* Ela estava
   * olhando a home, onde este bloco roda inteiro.
   *
   * PROP E NÃO COMPONENTE NOVO porque o que ela quer é ESTE bloco menos uma
   * camada: a mesma lista de escritórios, o mesmo auto-avanço, o mesmo
   * carrossel e a mesma reserva de altura que impede o endereço de sacudir a
   * página ao trocar de cidade. Recortar isso para um arquivo à parte criaria
   * dois lugares para consertar o dia em que um endereço mudar.
   *
   * O QUE O `false` DESLIGA JUNTO, e é de graça: o `next/dynamic` do Leaflet
   * nunca é chamado, então a /about não baixa o mapa nem os tiles. O
   * `IntersectionObserver` que existia só para adiar esse import continua
   * rodando e não custa nada — e volta a servir no dia em que alguém ligar o
   * mapa aqui.
   *
   * ⚠️ O SWIPE LATERAL MORA NO MAPA. Sem ele, no telefone a troca de cidade
   * fica com os controles do próprio carrossel e com a régua de cidades, que
   * são botões de verdade — não é regressão de acessibilidade, o swipe sempre
   * foi o atalho e nunca o único caminho.
   */
  showMap?: boolean;
  /**
   * Acrescenta o e-mail da cidade ativa sob o endereço e o telefone.
   *
   * EXISTE PARA A /about, 14-09, e é o que impede uma PERDA DE CONTEÚDO ao
   * trocar a lista estática de escritórios por este bloco (item 4): a lista de
   * lá publicava cidade, endereço, telefone E e-mail, e o painel daqui sempre
   * mostrou os três primeiros. O campo já existe no tipo `Office` desde sempre;
   * o que faltava era alguém renderizar.
   *
   * `false` POR PADRÃO de propósito. A home, a /our-clients e a /home-v3
   * rodam este bloco há semanas sem e-mail por cidade, e ligar isso para as
   * três de uma vez seria mudar três páginas por causa de uma quarta — o mesmo
   * critério de `maxWidthClass`, `typeLabel` e `align`.
   */
  showEmail?: boolean;
}) {
  const dark = tone === "dark";
  const centered = align === "center";
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  // Leaflet + Esri World Light Gray tiles need no token; fallback is used only on a real error.
  const [mapFailed, setMapFailed] = useState(false);
  // Auto-advance pauses permanently once the visitor takes control, and while hovered.
  const [userTook, setUserTook] = useState(false);
  const [hovered, setHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const active = offices[activeIndex];

  /**
   * A ALTURA RESERVADA PARA O PAINEL DE ENDEREÇO, em pixels.
   *
   * ⚠️ ISTO É O CONSERTO DO "RODAPÉ QUE DANÇA", e já era o propósito do
   * `min-h-[128px]` que estava aqui — ele só tinha virado um número velho. 128
   * menos os 32 do `pt-8` deixam 96px de conteúdo, e quatro linhas a 15px com
   * entrelinha 1,7 medem 102. Ou seja: as cidades de quatro linhas ESTOURAVAM a
   * reserva e a caixa crescia, enquanto Miami — duas linhas de endereço, sem
   * telefone — cabia dentro dela. Trocar de cidade mexia a página inteira, e na
   * /about, onde este bloco fecha a seção, isso puxa o rodapé para cima.
   *
   * ⚠️ O NÚMERO NÃO PODE SER FIXO PORQUE A LISTA NÃO É. Este bloco roda com
   * três conjuntos diferentes: a /about passa a lista do documento do cliente
   * (Riade tem três linhas, Riade e Miami não têm telefone) e liga o e-mail; a
   * /our-clients e a /home-v3 passam `lib/offices.ts` e não ligam. Um literal
   * serve a um dos três e desalinha os outros dois — foi exatamente o que
   * aconteceu com o 128.
   *
   * Então ele é MEDIDO A PARTIR DOS DADOS, pelo pior caso da lista recebida:
   *   • cada linha de endereço: 25,5px (15px x 1,7)
   *   • telefone, se ALGUMA cidade tiver: 4px de `mt-1` + 25,5
   *   • e-mail, se `showEmail`: 4px de `mt-1` + 25,5
   * O `+ 32` no fim é o `pt-8` do contêiner, que entra na conta porque o projeto
   * roda `box-sizing: border-box`.
   *
   * O PIOR CASO É A COMBINAÇÃO, não a cidade mais alta: reserva-se o máximo de
   * linhas de endereço MAIS telefone MAIS e-mail, ainda que nenhuma cidade tenha
   * as três coisas ao mesmo tempo. É o que garante que acrescentar um telefone
   * que falta — o de Dubai e o de Riade estão pendentes com o cliente — não
   * volte a fazer a página pular.
   *
   * ⚠️ A CONTA PRESSUPÕE QUE NADA QUEBRA EM DUAS LINHAS. Conferido nos dados de
   * hoje: a linha mais longa ("2888 King Fahd Road, Saudi Journalists") mede
   * ~285px e o e-mail mais longo ~248px, contra 342px de coluna no telefone mais
   * estreito. Um endereço novo bem mais longo que esses reabre o problema, e o
   * lugar de perceber é aqui.
   */
  const addressMinHeight =
    Math.ceil(
      Math.max(...offices.map((o) => o.addressLines.length)) * 25.5 +
        (offices.some((o) => o.tel) ? 29.5 : 0) +
        (showEmail ? 29.5 : 0),
    ) + 32;

  // A visitor-driven office change: take over from the auto-advance.
  const selectOffice = (i: number) => {
    setUserTook(true);
    setActiveIndex(i);
  };
  // Swipe left/right on the map itself (mobile) → change office, wrapping around,
  // reusing the same camera + pin animation as the carousel.
  const touch = useRef<{ x: number; y: number } | null>(null);
  const go = (delta: number) => {
    setUserTook(true);
    setActiveIndex((i) => (i + delta + offices.length) % offices.length);
  };

  // Auto-advance through the offices to convey global reach (FR-602). Runs only
  // while the section is in view, motion is allowed, the visitor hasn't taken
  // over, and the block isn't hovered. Wraps infinitely (last → London).
  useEffect(() => {
    if (!inView || reduceMotion || userTook || hovered || offices.length < 2) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % offices.length);
    }, 6000);
    return () => clearInterval(id);
  }, [inView, reduceMotion, userTook, hovered, offices.length]);

  // Lazy-mount the map only when the section is near the viewport (protect LCP).
  useEffect(() => {
    if (!sectionRef.current) return;
    const el = sectionRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Honor the OS reduced-motion preference (jump instead of fly).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="offices"
      className={dark ? "bg-ink-2" : "bg-paper"}
    >
      <div className="py-24">
        <div className={`mx-auto mb-12 ${maxWidthClass} px-6 md:px-10`}>
          {typeLabel ? (
            /* `justify-center` E NÃO `text-center` no pai: o rótulo é um par
               régua+palavra dentro de um flex. Centrar o texto do contêiner não
               move um flex item; o que move é o eixo principal. O `TypeLabel`
               aceita classes de layout exatamente para isto. */
            <TypeLabel onDark={dark} className={centered ? "justify-center" : ""}>
              {eyebrow}
            </TypeLabel>
          ) : (
            <div
              className={`flex items-baseline gap-3 ${centered ? "justify-center" : ""}`}
            >
              <span className="inline-block h-0.5 w-9 bg-brand" />
              <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">
                {eyebrow}
              </span>
            </div>
          )}
          {context ? (
            /* `mx-auto` MAIS `text-center`: o primeiro centra a CAIXA de 640px
               na página, o segundo centra as linhas dentro dela. Só o primeiro
               deixaria um parágrafo alinhado à esquerda no meio da tela — que é
               o desalinhamento de sempre, movido de lugar. */
            <p
              className={`mt-4 max-w-[640px] text-[15px] leading-[1.6] md:text-[16px] ${
                centered ? "mx-auto text-center" : ""
              } ${dark ? "text-white/70" : "text-muted"}`}
            >
              {context}
            </p>
          ) : null}
        </div>

        {mapFailed ? (
          <div className={`mx-auto ${maxWidthClass} px-6 md:px-10`}>
            <OfficeGrid offices={offices} dark={dark} />
          </div>
        ) : (
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Map — full-bleed on mobile (no side gaps), centered + contained on
                desktop. Fixed height avoids layout shift when it lazily mounts.
                Horizontal swipe changes office; `touch-pan-y` keeps the page
                scrolling vertically. */}
            {showMap && (
              <div
                className={`relative h-[340px] w-full touch-pan-y overflow-hidden border-y bg-[#e9e6e3] md:mx-auto md:h-[360px] md:max-w-[560px] md:border ${
                  dark ? "border-white/15" : "border-line"
                }`}
                onTouchStart={(e) => {
                  touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                }}
                onTouchEnd={(e) => {
                  if (!touch.current) return;
                  const dx = e.changedTouches[0].clientX - touch.current.x;
                  const dy = e.changedTouches[0].clientY - touch.current.y;
                  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
                    go(dx < 0 ? 1 : -1);
                  }
                  touch.current = null;
                }}
              >
                {inView && (
                  <LocationsMap
                    office={active}
                    animate={!reduceMotion}
                    onError={() => setMapFailed(true)}
                    className="h-full w-full"
                  />
                )}
              </div>
            )}

            {/* `mt-8` É O VÃO ATÉ O MAPA, e some junto com ele: sem mapa, a
                régua de cidades é o primeiro elemento do corpo e quem dá a
                distância até o cabeçalho é o `mb-12` lá de cima. Com os dois, o
                bloco abria 32px a mais que qualquer outra seção. */}
            <div
              className={`mx-auto max-w-[560px] px-6 ${showMap ? "mt-8" : ""}`}
            >
              {/* All-office index strip + divider — mirrors the legacy "our
                  offices" header so every city is visible at a glance, not just
                  the active one in the carousel. Each name selects its office. */}
              <div
                className={`mb-8 border-b pb-6 ${
                  dark ? "border-white/20" : "border-muted/30"
                }`}
              >
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px] font-semibold uppercase tracking-[2px]">
                  {offices.map((o, i) => (
                    <span key={o.slug} className="flex items-center gap-x-3">
                      {i > 0 && (
                        <span
                          aria-hidden
                          className={dark ? "text-white/30" : "text-muted/40"}
                        >
                          ·
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => selectOffice(i)}
                        aria-current={i === activeIndex ? "true" : undefined}
                        className={
                          "cursor-pointer transition-colors " +
                          (i === activeIndex
                            ? dark
                              ? "text-white"
                              : "text-ink"
                            : dark
                              ? "text-white/50 hover:text-white"
                              : "text-muted hover:text-ink")
                        }
                      >
                        {o.city}
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <LocationsCarousel
                offices={offices}
                activeIndex={activeIndex}
                onChange={selectOffice}
                tone={tone}
              />

              {/* Divider above the address mirrors the one under the office
                  strip, so the active city name sits framed between two lines.

                  A ALTURA RESERVADA vem de `addressMinHeight`, medida a partir
                  da lista recebida — a caixa dele, lá em cima, tem a conta e o
                  histórico do número fixo que ela substitui.

                  `style` E NÃO CLASSE porque o valor é calculado: a Tailwind gera
                  folha estática e não tem como emitir uma classe por conjunto de
                  escritórios. */}
              <div
                style={{ minHeight: `${addressMinHeight}px` }}
                className={`mt-8 border-t pt-8 text-center ${
                  dark ? "border-white/20" : "border-muted/30"
                }`}
              >
                <p
                  className={`text-[15px] leading-[1.7] ${
                    dark ? "text-white/70" : "text-muted"
                  }`}
                >
                  {active.addressLines.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                {active.tel && (
                  <p
                    className={`mt-1 text-[15px] leading-[1.7] ${
                      dark ? "text-white/70" : "text-muted"
                    }`}
                  >
                    Tel: {active.tel}
                  </p>
                )}
                {showEmail && (
                  /* VERMELHO, como todo endereço de e-mail clicável do site — é
                     a única linha deste painel que é ação, e não dado.

                     O `<wbr>` depois do @ vem da lista da /about, de onde este
                     campo migrou: a coluna aqui tem 560px e o domínio cabe
                     inteiro, mas no telefone ela cai para a largura da tela
                     menos 48px e é depois do @ que o navegador tem de quebrar.
                     Sem a dica ele quebraria dentro de "corporatedna". */
                  <a
                    href={`mailto:${active.email}`}
                    className={`mt-1 inline-block break-words text-[15px] leading-[1.7] transition-colors ${
                      dark
                        ? "text-brand-light hover:text-white"
                        : "text-brand hover:text-brand-dark"
                    }`}
                  >
                    {active.email.split("@")[0]}@<wbr />
                    {active.email.split("@")[1]}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/** Static fallback used when the map can't load — mirrors the previous grid. */
function OfficeGrid({ offices, dark }: { offices: Office[]; dark: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-x-20 gap-y-4 sm:grid-cols-2">
      {offices.map((o) => (
        <div key={o.slug} className="py-8">
          <h3
            className={`mb-4 text-[22px] font-bold uppercase tracking-[0.5px] ${
              dark ? "text-white" : "text-ink"
            }`}
          >
            {o.city}
          </h3>
          <p
            className={`text-[15px] leading-[1.7] ${
              dark ? "text-white/70" : "text-muted"
            }`}
          >
            {o.addressLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </p>
          {o.tel && (
            <p
              className={`mt-1 text-[15px] leading-[1.7] ${
                dark ? "text-white/70" : "text-muted"
              }`}
            >
              Tel: {o.tel}
            </p>
          )}
          <span className="mt-6 block h-[3px] w-8 bg-brand" />
        </div>
      ))}
    </div>
  );
}
