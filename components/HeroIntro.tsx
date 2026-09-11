"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { buildHeroIntro } from "@/lib/hero-timeline";
import { applyEnvClasses } from "@/lib/hero-intro";

gsap.registerPlugin(useGSAP);

/**
 * A entrada do herói da home, para um herói que não é o da home.
 *
 * O `Reveal` já cobre o resto da página, mas ele é disparado por ROLAGEM
 * (`ScrollTrigger`, `top 82%`) e o herói está acima da dobra — no primeiro
 * frame ele já está dentro do gatilho, então o que sairia dali é um fade
 * genérico, tudo junto, sem a escada que a home tem. Esta é a escada: régua,
 * rótulo, título, linha de apoio, botões, cada um entrando por cima do
 * anterior. A timeline é literalmente a mesma função (`lib/hero-timeline.ts`).
 *
 * COMO SE USA: as classes vão nos elementos DE DENTRO — `h-bar`, `h-eyebrow`,
 * `h-title`, `h-sub`, `h-cta`. As que não existirem são puladas.
 *
 * ⚠️ ESSAS CLASSES NASCEM COM `opacity: 0` (app/globals.css, sob `html.js`).
 * Quem as escreve sem este componente por volta publica texto invisível. É por
 * isso que o disparo abaixo tem prazo de segurança em vez de só escutar o
 * evento.
 *
 * O DISPARO ESPERA O PRELOADER, igual à home: o `Preloader` está no layout raiz
 * e roda em toda página, então animar na hora terminaria a entrada ATRÁS da
 * cortina e o conteúdo apareceria já montado quando ela subisse. O `setTimeout`
 * de 10s é a rede: se o evento `app:ready` não vier — preloader removido, erro
 * antes do disparo, aba em segundo plano — a entrada roda assim mesmo. Nenhum
 * caminho leva a conteúdo escondido para sempre.
 *
 * RODA TAMBÉM COM "REDUCE MOTION" LIGADO, e isto é decisão herdada da home
 * (`mm.add("all")` lá) e não esquecimento: a entrada é curta, é só o conteúdo
 * chegando, e não há paralaxe nem clipe segurando a página. Manter o mesmo
 * critério nas duas páginas é o que evita a home e a /about se comportarem
 * diferente na mesma preferência do sistema.
 */
export default function HeroIntro({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Repõe `js`/`touch` caso uma falha de hidratação as tenha apagado
      // (navegadores in-app — ver lib/hero-intro.ts). `useGSAP` é layout
      // effect, então isto acontece antes do próximo paint.
      applyEnvClasses();

      const tl = buildHeroIntro(scope.current!);

      let begun = false;
      const begin = () => {
        if (begun) return;
        begun = true;
        window.clearTimeout(gate);
        window.removeEventListener("app:ready", begin);
        tl.play();
      };
      const gate = window.setTimeout(begin, 10000);
      if (window.__appReady) {
        begin();
      } else {
        window.addEventListener("app:ready", begin, { once: true });
      }

      return () => {
        window.clearTimeout(gate);
        window.removeEventListener("app:ready", begin);
        tl.kill();
      };
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
