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
 * O QUE É AGORA. UMA faixa: o título e os logos em régua, com nome e ano embaixo
 * de cada um. Mesma altura de uma faixa de parceiros, que é o objeto que
 * "banner" descreve. São cinco em toda parte e SETE na home, que desde 21-09
 * abre a régua com os dois GOLD da Brandon Hall — ver `BRANDON_HALL` e a prop
 * `includeBrandonHall`.
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
   *
   * ⚠️ VOLTA A APARECER quando `showDistinction` estiver ligado, e só aí. O
   * item 34 mandava tirar "finalista" e "semifinalista"; ele não mandava
   * esconder que um prêmio foi GANHO. Ver `BRANDON_HALL`, abaixo.
   */
  distinction: string;
  /** Renderiza a `distinction` acima do nome. Só para prêmios ganhos. */
  showDistinction?: boolean;
  year: string;
  /**
   * Arquivo em /public/awards.
   *
   * OPCIONAL DESDE 21-09: os dois Brandon Hall entraram sem logo porque não
   * temos o arquivo. Sem ele a célula desenha um selo tipográfico no lugar —
   * ver o `<li>` lá embaixo. Assim que a CDNA mandar a arte, é só apontar o
   * campo para ela e o selo dá lugar ao logo, sem mexer em mais nada.
   */
  logo?: string;
};

/**
 * OS DOIS GOLD DA BRANDON HALL — 21-09: *"Remove Brandon hall pop up on hero
 * image add this to awards"*.
 *
 * DE ONDE ELES VIERAM: do cartão da quina do herói (o `CyclingCredential`, que
 * a home deixou de renderizar no mesmo dia). O texto é o par escrito à mão que
 * o componente guarda como fallback — ver `components/CyclingCredential.tsx`,
 * que continua vivo porque a /home-v3 ainda o usa.
 *
 * POR QUE ELES ABREM A RÉGUA, e não entram no fim da fila: são os únicos
 * prêmios recentes e GANHOS da lista. Dos cinco que já estavam aqui, três são
 * de 2008–2009 e eram "Finalist"/"Semi finalist" — foi exatamente isso que fez
 * a `HeroV2` recusar esta seção como credencial de primeira dobra, e o
 * comentário de lá continua registrando o argumento. Pôr os GOLD no fim seria
 * abrir a faixa por 2008 e fechar por 2024.
 *
 * A DISTINÇÃO "GOLD" APARECE, contra a regra dos outros cinco. Não é exceção
 * por gosto: o item 34 de 14-09 pediu para parar de anunciar COLOCAÇÃO
 * ("finalists", "semi-finalists") — *"even though that's what we were"*. "Gold"
 * é o oposto disso, é o prêmio ganho, e sem essa linha as duas entradas leem
 * como mais duas menções. O próprio comentário daquela mudança já previa este
 * caso ao explicar por que o campo `distinction` não foi apagado do tipo.
 *
 * ⚠️ SEM LOGO. `/public/awards/` não tem arte da Brandon Hall e não é coisa
 * que se invente — é o selo de um instituto. Enquanto ela não chega, a célula
 * mostra o selo tipográfico.
 *
 * ⚠️ OS NOMES ESTÃO ENCURTADOS, e o original fica escrito aqui para ninguém
 * achar que foi digitado errado. No cartão do herói eles vinham inteiros:
 *
 *   "Brandon Hall Best Leadership Development for Talent Acceleration
 *    Programme for Asian Leaders"
 *   "Brandon Hall DE&I Award for Best Advance in Leadership Development for
 *    Women"
 *
 * Lá cabiam porque o cartão era uma caixa deitada de 340px com três linhas de
 * texto corrido. Aqui a célula tem ~169px de largura e o nome é centrado
 * embaixo do selo: os dois títulos inteiros dariam oito linhas cada, contra as
 * duas ou três dos outros cinco, e a fileira inteira cresceria para acomodá-los
 * — uma faixa de prêmios com um prêmio três vezes mais alto que os vizinhos
 * deixa de ser faixa.
 *
 * Nada se perdeu: o texto completo continua no CMS (segmento `ticker`) e no
 * `FALLBACK` do `CyclingCredential`.
 */
const BRANDON_HALL: Award[] = [
  {
    name: "Brandon Hall — Leadership Development",
    distinction: "Gold",
    showDistinction: true,
    year: "2024",
  },
  {
    name: "Brandon Hall — DE&I Leadership Development",
    distinction: "Gold",
    showDistinction: true,
    year: "2023",
  },
];

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
  includeBrandonHall = false,
  showYear = true,
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
  /**
   * Põe os dois GOLD da Brandon Hall na frente da régua.
   *
   * PROP, E NÃO ENTRADA FIXA NO ARRAY, pelo mesmo motivo do `maxWidthClass`
   * logo acima: esta faixa roda em quatro telas, e o pedido de 21-09 é sobre a
   * HOME — foi de lá que a Brandon Hall saiu (o cartão do herói) e é para cá
   * que ela foi. Ligar por padrão mexeria na /our-impact, na /home-v1 e na
   * /home-v3 sem ninguém ter pedido.
   *
   * ⏳ SE A CDNA QUISER OS DOIS EM TODO LUGAR — e é plausível, porque a lista de
   * prêmios inteira está para ser revista com a Ria (item 35 de 14-09) —, a
   * mudança é trocar este `false` por `true` e apagar a prop dos pontos de uso.
   */
  includeBrandonHall?: boolean;
  /**
   * Mostra o ano embaixo do nome.
   *
   * A home desliga isto desde 22-09 — a Maliha pediu para tirar as datas da
   * faixa. Prop, e não um corte no dado: /our-impact, /home-v1 e /home-v3
   * continuam datando cada prêmio, e o `year` segue no tipo para o dia em
   * que a lista for revista com a Ria.
   */
  showYear?: boolean;
} = {}) {
  const scope = useRef<HTMLElement>(null);
  const shown = includeBrandonHall ? [...BRANDON_HALL, ...awards] : awards;

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

          {/* A RÉGUA TEM TANTAS COLUNAS QUANTOS PRÊMIOS a partir de `lg`, e é
              por isso que as duas classes estão escritas por extenso: o
              Tailwind varre o código atrás de nomes de classe LITERAIS, então
              `lg:grid-cols-${n}` não geraria CSS nenhum.

              Cinco é o número de sempre; sete é a home desde 21-09, com os dois
              GOLD da Brandon Hall na frente. Deixar sete numa grade de cinco
              daria uma fileira cheia e uma sobra de dois encostada à esquerda,
              que é o desenho que faz uma faixa parecer quebrada.

              A LARGURA AINDA DÁ. Na home o container é 1440 menos `px-14` dos
              dois lados, ou seja 1328px; tirando seis vãos de 24px sobram
              ~169px por célula, contra os 96px do logo. Abaixo de `lg` nada
              muda: três colunas no tablet, duas no telefone. */}
          <ul
            className={`mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:mt-12 ${
              shown.length > 5 ? "lg:grid-cols-7" : "lg:grid-cols-5"
            }`}
          >
            {shown.map((a) => (
              <li
                key={a.name}
                data-award-row
                className="flex flex-col items-center text-center"
              >
                <div className="relative flex h-[84px] w-[84px] flex-none items-center justify-center sm:h-[96px] sm:w-[96px]">
                  {a.logo ? (
                    /* `alt=""` — DECORATIVO DE PROPÓSITO. O nome do prêmio está
                       escrito logo abaixo, em texto de verdade; com alt o leitor
                       de tela anunciaria "Women of the Future Awards logo" e, na
                       linha seguinte, "Women of the Future Awards". */
                    <Image
                      src={a.logo}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-contain"
                    />
                  ) : (
                    /* SELO TIPOGRÁFICO NO LUGAR DO LOGO QUE NÃO TEMOS.
                       A alternativa era deixar o buraco, e aí a célula perderia
                       os 96px de altura e desalinharia o nome dela em relação
                       ao das vizinhas — a régua inteira ficaria torta por causa
                       de um arquivo faltando.

                       Um círculo com a distinção dentro, porque é o que um selo
                       de prêmio é. `aria-hidden` pelo mesmo motivo do `alt=""`
                       acima: "GOLD" já é lido na linha de baixo. */
                    <span
                      aria-hidden="true"
                      className="grid h-[76px] w-[76px] place-items-center rounded-full border-2 border-white/40 text-[13px] font-bold uppercase tracking-[1.5px] text-white/85 sm:h-[86px] sm:w-[86px]"
                    >
                      {a.distinction}
                    </span>
                  )}
                </div>
                {/* BRANCO, e não `ink`: a faixa é `brand` por padrão e `ink` na
                    home (o override `[&_[data-awards-band]]:bg-ink` no wrapper
                    de lá). Branco é a única cor de texto que passa nos dois.

                    ⚠️ A LINHA DE DISTINÇÃO SÓ SAI PARA QUEM PEDE. É o pedido do
                    item 34 — era aqui que se lia "FINALIST 2008" nos cinco
                    antigos. Os dois GOLD a mostram porque colocação e prêmio
                    ganho não são a mesma alegação; ver a caixa do
                    `BRANDON_HALL`. O ano fica no dado e sai na tela quando
                    `showYear` está ligado — a home desliga desde 22-09. */}
                {a.showDistinction ? (
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-[2px] text-white">
                    {a.distinction}
                  </p>
                ) : null}
                <p
                  className={`text-[14px] font-semibold leading-[1.35] text-white ${
                    a.showDistinction ? "mt-1" : "mt-4"
                  }`}
                >
                  {a.name}
                </p>
                {showYear ? (
                  <p className="mt-1 text-[12px] font-medium tracking-[1px] text-white/60">
                    {a.year}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
