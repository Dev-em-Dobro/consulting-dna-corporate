/**
 * A entrada do herói — a timeline que a home roda no `load`, agora em um lugar
 * só para que outras páginas possam rodar a MESMA.
 *
 * De onde ela vem: estava dentro de `HeroV2.tsx`, escrita ali desde a V1. Saiu
 * daqui em 11-09, quando a /about pediu a mesma entrada. As curvas, as
 * distâncias e as sobreposições são as de lá, sem um número mudado — o ponto da
 * extração é exatamente que não haja dois conjuntos de números para ajustar.
 *
 * ⚠️ OS ALVOS NASCEM ESCONDIDOS, e isto é o que torna a função obrigatória e
 * não decorativa. `app/globals.css` zera a opacidade de `.h-bar`, `.h-eyebrow`,
 * `.h-title`, `.h-sub` e `.h-cta` sob `html.js`, para que nada pisque montado
 * antes de o GSAP assumir. Quem põe uma dessas classes numa página e NÃO roda
 * esta timeline publica um bloco invisível. Por isso quem chama precisa de um
 * disparo garantido — ver o `gate` em `HeroIntro.tsx` e em `HeroV2.tsx`, os dois
 * com prazo de segurança.
 *
 * POR QUE `root` E NÃO SELETOR SOLTO: a versão anterior passava as strings
 * direto para o GSAP e contava com o escopo do `gsap.context`. Funciona, mas
 * amarra a função a ser chamada dentro de um contexto, e faz o GSAP reclamar no
 * console ("target not found") em toda página que não tenha os cinco elementos
 * — a /about, por exemplo, não tem `.h-bar` nem `.h-cta`. Consultando o `root`
 * dá para simplesmente não criar o tween que não tem alvo.
 */
import { gsap } from "gsap";

/**
 * Monta a entrada PAUSADA e devolve. Quem chama decide quando tocar.
 *
 * `fromTo` e não `from`: os alvos começam escondidos pelo CSS, então o estado
 * final visível tem de ser dito por extenso — com `from`, o GSAP leria o valor
 * escondido como destino e animaria de escondido para escondido.
 */
export function buildHeroIntro(root: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: "power4.out" }, paused: true });
  const find = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

  const bar = find(".h-bar");
  const eyebrow = find(".h-eyebrow");
  const title = find(".h-title");
  const sub = find(".h-sub");
  const cta = find(".h-cta");

  // A régua cresce a partir da esquerda, e é ela que dá a partida.
  if (bar.length) {
    tl.fromTo(
      bar,
      { autoAlpha: 0, scaleX: 0, transformOrigin: "left" },
      { autoAlpha: 1, scaleX: 1, duration: 0.6 },
      0,
    );
  }
  // As posições relativas ("-=0.3") se medem do fim do tween ANTERIOR, então
  // elas continuam valendo quando um alvo não existe: sem a régua, o rótulo
  // simplesmente abre a timeline. É o motivo de as sobreposições estarem em
  // relativo e não em tempo absoluto.
  if (eyebrow.length) {
    tl.fromTo(
      eyebrow,
      { autoAlpha: 0, x: -12 },
      { autoAlpha: 1, x: 0, duration: 0.5 },
      bar.length ? "-=0.3" : 0,
    );
  }
  if (title.length) {
    tl.fromTo(
      title,
      { autoAlpha: 0, y: 46, skewY: 2 },
      { autoAlpha: 1, y: 0, skewY: 0, duration: 1 },
      tl.duration() ? "-=0.15" : 0,
    );
  }
  if (sub.length) {
    tl.fromTo(
      sub,
      { autoAlpha: 0, y: 26 },
      { autoAlpha: 1, y: 0, duration: 0.8 },
      tl.duration() ? "-=0.6" : 0,
    );
  }
  if (cta.length) {
    tl.fromTo(
      cta,
      { autoAlpha: 0, y: 22 },
      { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.6 },
      tl.duration() ? "-=0.5" : 0,
    );
  }

  return tl;
}
