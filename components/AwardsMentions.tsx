"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Awards and Mentions" — the awards & credentials that until now lived only in
 * the sales presentation (spec 009). Logos are local assets under
 * /public/awards; the copy followed the client's `docs/Group 2.png` design.
 *
 * ================================================================
 * ⚠️ VIROU BANNER EM 14-09
 * ================================================================
 * Pedido da Maliha na daily (item 34): *"awards and mentions, I'm thinking maybe
 * we just have it as a banner rather than calling out that we were the finalists
 * or the semi-finalists — even though that's what we were."*
 *
 * O QUE ERA. Cinco FILEIRAS de largura cheia, cada uma com o nome do prêmio em
 * 30px, a distinção em vermelho maiúsculo ("FINALIST 2008"), o logo à direita e
 * um filete vermelho curto separando. Ocupava a altura de uma tela e meia, e a
 * linha que ela mandou tirar era o segundo elemento mais visível de cada
 * fileira.
 *
 * O QUE É AGORA. UMA faixa: o título e os cinco logos em régua, com nome e ano
 * embaixo de cada um. Mesma altura de uma faixa de parceiros, que é o objeto que
 * "banner" descreve.
 *
 * O `distinction` CONTINUA NO TIPO E NOS DADOS, e não é esquecimento. Dois dos
 * cinco não são "finalista" coisa nenhuma — "Top 10 Indian women leader in the
 * UK" e "Best international leadership consulting firm" são prêmios ganhos, e é
 * plausível que ela queira esses de volta quando revisar a lista com a Ria
 * (item 35: *"our awards are a bit outdated, it's 2008, I will speak to Ria"*).
 * Apagar o campo agora obrigaria a redigitar cinco distinções depois. Ele
 * simplesmente não é renderizado.
 *
 * Title and logos animate in as the band scrolls into view. Motion is gated on
 * `prefers-reduced-motion`, so this component owns its animation instead of
 * using the shared <Reveal>.
 */

type Award = {
  name: string;
  /**
   * The distinction earned, e.g. "Finalist".
   *
   * ⏸️ NÃO RENDERIZADO DESDE 14-09 — é exatamente a linha que a cliente pediu
   * para sair. Fica no dado; ver a caixa do componente.
   */
  distinction: string;
  year: string;
  logo: string;
};

const awards: Award[] = [
  {
    name: "Women of the Future Awards",
    distinction: "Finalist",
    year: "2008",
    logo: "/awards/women-of-the-future.png",
  },
  {
    name: "HSBC Start-up Stars",
    distinction: "Semi finalist",
    year: "2009",
    logo: "/awards/hsbc-start-up-stars.png",
  },
  {
    name: "British Indian Awards",
    distinction: "Finalist",
    year: "2008",
    logo: "/awards/british-indian-awards.png",
  },
  {
    name: "Women Entrepreneur",
    distinction: "Top 10 Indian women leader in the UK",
    year: "2021",
    logo: "/awards/women-entrepreneur-india.png",
  },
  {
    name: "Corporate Excellence Awards",
    distinction: "Best international leadership consulting firm",
    year: "2022",
    logo: "/awards/corporate-excellence-awards.png",
  },
];

export default function AwardsMentions({
  maxWidthClass = "max-w-[1200px]",
}: {
  /**
   * Largura do container da faixa.
   *
   * Existe desde 10-09, quando a home subiu de 1200 para 1440: a faixa
   * continuava em 1200 e passava a abrir 120px à direita das seções vizinhas.
   *
   * Prop com o padrão antigo em vez de trocar o número aqui: o componente
   * também roda na /our-impact, na /home-v1 e na /home-v3, que seguem em 1200.
   * Mesmo padrão do `maxWidthClass` da NavV2 e do LocationsBlock.
   */
  maxWidthClass?: string;
} = {}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Title sweeps in from the left as the band reaches the viewport.
        gsap.from("[data-awards-title]", {
          autoAlpha: 0,
          x: -64,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-awards-band]", start: "top 85%", once: true },
        });

        /* ⚠️ UM GATILHO SÓ, e não um por prêmio — 14-09. Enquanto eram cinco
           fileiras de largura cheia, cada uma entrava no viewport em momentos
           diferentes e precisava do próprio `ScrollTrigger`; a varredura em
           direções opostas (texto da esquerda, logo da direita) existia porque
           havia uma fileira inteira para atravessar.

           No banner os cinco logos estão LADO A LADO na mesma linha e entram na
           tela juntos. Cinco gatilhos disparariam no mesmo instante — cinco
           observadores fazendo o trabalho de um — e a varredura lateral não tem
           mais distância para correr. Vira um `stagger` da régua inteira, que é
           o movimento que uma faixa de logos pede: eles sobem em sequência, da
           esquerda para a direita. */
        gsap.from("[data-award-row]", {
          autoAlpha: 0,
          y: 28,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-awards-band]", start: "top 80%", once: true },
        });
      });

      // Reduce-motion: skip the directional sweeps and just fade each row/title
      // in as it scrolls into view.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.from("[data-awards-title]", {
          autoAlpha: 0,
          duration: 0.5,
          ease: "power1.out",
          scrollTrigger: { trigger: "[data-awards-band]", start: "top 85%", once: true },
        });

        gsap.from("[data-award-row]", {
          autoAlpha: 0,
          duration: 0.5,
          ease: "power1.out",
          stagger: 0.05,
          scrollTrigger: { trigger: "[data-awards-band]", start: "top 80%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section id="awards" ref={scope} className="bg-white">
      {/* Same box as the `#book` section: constrained on desktop, full-bleed on
          mobile (no horizontal padding below `md`). */}
      <div className={`mx-auto ${maxWidthClass} pb-14 md:px-10 md:py-24`}>
        {/* TUDO DENTRO DA MESMA FAIXA desde 14-09. Antes o `data-awards-band`
            era só a tarja do título e os prêmios corriam sobre o branco da
            página, abaixo dela. Um banner é UM objeto: título e logos moram na
            mesma caixa colorida, e é isso que faz a seção ler como faixa em vez
            de cabeçalho seguido de lista. */}
        <div data-awards-band className="overflow-hidden bg-brand px-6 py-12 md:px-14 md:py-16">
          <h2
            data-awards-title
            className="text-[38px] font-bold leading-[1.05] tracking-[-1px] text-white sm:text-[44px] md:text-[52px]"
          >
            {/* On mobile the title breaks as "Awards and" / "Mentions", per the
                design — so the break is explicit rather than left to wrapping. */}
            Awards and{" "}
            <span className="block sm:inline">Mentions</span>
          </h2>

          {/* CINCO EM RÉGUA a partir de `lg`, duas colunas no telefone. Cinco
              logos de 84px lado a lado precisam de ~620px; abaixo disso eles
              viram selos ilegíveis em vez de banner. */}
          <ul className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:mt-12 lg:grid-cols-5">
            {awards.map((a) => (
              <li
                key={a.name}
                data-award-row
                className="flex flex-col items-center text-center"
              >
                <div className="relative h-[84px] w-[84px] flex-none sm:h-[96px] sm:w-[96px]">
                  {/* `alt=""` — DECORATIVO DE PROPÓSITO. O nome do prêmio está
                      escrito logo abaixo, em texto de verdade; com alt o leitor
                      de tela anunciaria "Women of the Future Awards logo" e, na
                      linha seguinte, "Women of the Future Awards". */}
                  <Image
                    src={a.logo}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                </div>
                {/* BRANCO, e não `ink`: a faixa é `brand` por padrão e `ink` na
                    home (o override `[&_[data-awards-band]]:bg-ink` no wrapper
                    de lá). Branco é a única cor de texto que passa nos dois.

                    ⚠️ SEM A LINHA DE DISTINÇÃO. É o pedido do item 34 — era
                    aqui que se lia "FINALIST 2008". O ano fica: ele é fato
                    datado, não alegação de colocação. */}
                <p className="mt-4 text-[14px] font-semibold leading-[1.35] text-white">
                  {a.name}
                </p>
                <p className="mt-1 text-[12px] font-medium tracking-[1px] text-white/60">
                  {a.year}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
