"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

type LogoMarqueeProps = {
  /** File names inside /public/logos, e.g. "shell.png". */
  logos: string[];
  /** Seconds for one full loop. Lower = faster. */
  duration?: number;
  /** Scroll right-to-left by default; set true to reverse. */
  reverse?: boolean;
  /**
   * A esteira sobre fundo CLARO — entrou em 17-09, quando a Clients & Impact
   * trocou o paredão parado por esta esteira (*"na seção 'Trusted by global
   * organisations' trocar os clientes pela barra animada de clientes da home"*).
   *
   * ⚠️ O QUE MUDA É SÓ A CAIXA DO LOGO, e a razão é de leitura: na home a
   * esteira corre sobre `bg-ink`, e é o `bg-white` de cada célula que desenha o
   * cartão. Sobre uma seção branca esse mesmo branco não desenha nada — vira um
   * retângulo invisível com um respiro de 190px que ninguém vê. Aqui a célula
   * fica transparente e quem separa os logos é o próprio vão.
   *
   * ⚠️ A MÁSCARA DE ESMAECIMENTO NÃO MUDA e não precisa mudar: ela é uma
   * `mask-image`, que corta o ALFA da esteira inteira. Funciona igual sobre
   * qualquer fundo, e é por isso que ela não aparece nesta prop.
   *
   * ⏳ SE ELA QUISER A FAIXA ESCURA IGUAL À DA HOME, é tirar este `onLight` e
   * pôr `bg-ink` na seção — uma palavra de cada lado. O que segura o claro hoje
   * é o ritmo da página: a faixa nasce colada no herói, que já é escuro, e duas
   * massas escuras encostadas não têm divisa entre si.
   */
  onLight?: boolean;
};

const label = (file: string) =>
  file.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");

export default function LogoMarquee({
  logos,
  duration = 42,
  reverse = false,
  onLight = false,
}: LogoMarqueeProps) {
  const track = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      // Intentionally ignore prefers-reduced-motion: this ambient logo loop is
      // a decorative brand element and must always animate (matching the hero
      // intro, which also always runs). iOS "reduce motion" would otherwise
      // freeze it.
      // Two identical copies render side by side; shifting the track by 50%
      // of its width produces a seamless, gapless loop.
      tween.current = gsap.fromTo(
        track.current,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration, ease: "none", repeat: -1 }
      );
      return () => {
        tween.current?.kill();
      };
    },
    { scope: track, dependencies: [duration, reverse] }
  );

  const sequence = [...logos, ...logos];
  const fade =
    "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)";

  return (
    <div
      className="w-full overflow-hidden"
      style={{ maskImage: fade, WebkitMaskImage: fade }}
    >
      <div ref={track} className="flex w-max items-center">
        {sequence.map((file, i) => (
          <div
            key={i}
            aria-hidden={i >= logos.length}
            className={`mx-3 flex h-[84px] w-[190px] shrink-0 items-center justify-center px-6 ${
              onLight ? "" : "rounded-xl bg-white"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/logos/${file}`}
              alt={label(file)}
              loading="lazy"
              className="max-h-[52px] w-auto max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
