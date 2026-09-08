"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { applyEnvClasses } from "@/lib/hero-intro";
import CyclingCredential from "@/components/CyclingCredential";
import type { TickerEntry } from "@/lib/cms/map";
import heroPhoto from "@/public/dna-time/dna-time-06.jpeg";

/**
 * Herói da /home-v3, seguindo a TRIONN (`ref 10.png`).
 *
 * É irmão da HeroV2, não evolução dela: as duas existem ao mesmo tempo para o
 * grupo comparar dois caminhos. A V2 segue a Explore Performance (fundo de
 * vídeo visível, texto centrado na vertical, botões preenchidos); esta segue
 * uma estética oposta. Nenhuma das duas toca a home no ar.
 *
 * ── O MAPEAMENTO, item a item ──────────────────────────────────────────────
 *
 * A regra do pedido de 07-09 foi "com os elementos que a nossa hero já tem".
 * Então nada foi inventado: cada peça da referência recebeu uma peça nossa.
 *
 *   TRIONN                              nosso
 *   ─────────────────────────────────   ──────────────────────────────────────
 *   Título no CANTO SUPERIOR ESQUERDO,  o mesmo h1, movido para cima. Ele já
 *   enorme, peso leve, terminando em    termina em ponto — coincidência boa,
 *   ponto                               porque o ponto final é decisão nossa
 *                                       de 01-09 e é padrão da TRIONN também
 *   Dois links de texto com filete e    os nossos dois CTAs, que deixam de ser
 *   seta ("DISCUSS YOUR PROJECT →")     botões preenchidos e viram links
 *   Caixa com borda no canto inferior   as duas credenciais Brandon Hall, que
 *   direito ("EST. 2012 | 14+ YEARS")   na V2 são uma faixa abaixo do herói
 *   Parágrafo curto sob a caixa         o nosso subtítulo, que sai de baixo do
 *                                       título e desce para o canto
 *   Objeto 3D no meio do vazio          o iceberg do vídeo — ver a ressalva
 *   Bolinha de scroll no canto inferior um marcador igual, canto inferior
 *   esquerdo                            esquerdo
 *   Dica de interação no rodapé central NÃO copiado: é interação exclusiva do
 *                                       site deles, não temos equivalente
 *
 * O eyebrow não tem par na referência (ela não usa nenhum). Ficou, porque é
 * elemento nosso e o pedido foi usar o que temos — e no registro tipográfico
 * daquele site, caixa alta pequena com tracking largo é justamente o que ele
 * mais usa.
 *
 * ── A RESSALVA QUE IMPORTA ─────────────────────────────────────────────────
 *
 * O que faz o herói da TRIONN funcionar é um OBJETO iluminado boiando em preto:
 * o miolo da tela é vazio, e o olho vai para as quinas onde está o texto. Para
 * imitar isso o fundo tem de ir a quase preto — e é aí que o nosso material não
 * colabora.
 *
 * No nosso clipe o CÉU é quase tão claro quanto o iceberg. Medido sobre o
 * poster, com o tratamento abaixo: o céu assenta em ~#292929 e o iceberg em
 * ~#2d2d2d. São quatro pontos de diferença — ou seja, escurecendo o quanto a
 * referência pede, o iceberg PARA DE SER SUJEITO e vira textura. O herói fica
 * bonito e quase liso, mas quem espera ver um iceberg não vê.
 *
 * Isso não tem conserto por CSS: `contrast()` sobe os dois juntos, porque a
 * separação não existe no material. Ter aqui o que a referência tem exigiria um
 * objeto com luz própria contra fundo escuro — no caso deles, um 3D feito para
 * isso. É decisão de arte, não de código, e é a pergunta que esta rota coloca.
 */
/**
 * RECALCULADO em 07-09, quando o fundo deixou de ser o clipe do iceberg e passou
 * a ser uma fotografia real (ver o comentário da <Image> lá embaixo).
 *
 * Os valores antigos — `saturate(.08) contrast(1.35) brightness(.34)` com lavado
 * a 55% — foram calibrados para um céu quase branco e existiam para empurrar o
 * iceberg até o quase-preto da referência. Aplicados a esta foto eles apagariam
 * a sala inteira, e aí a foto não serviria para nada: o motivo de ela estar aqui
 * é justamente DAR PARA VER que é uma sessão da CDNA acontecendo.
 *
 * A conta que define o teto de claridade é o eyebrow coral. A parede do canto
 * superior esquerdo — onde o título mora — está por volta de luminância 0,36 no
 * original. Descendo para `brightness(.5)` mais lavado a 40%, ela assenta em
 * ~0,031, e ali o coral (#f4796d) dá 4,87:1: passa no mínimo de 4,5:1 com alguma
 * folga. Em `brightness(.58)` a foto fica visivelmente melhor, mas o coral cai
 * para 4,07:1 e REPROVA — e aí o eyebrow teria de virar branco, perdendo o ganho
 * que esta versão tinha sobre a V2.
 *
 * `saturate(.5)` e não quase-zero como no iceberg: aqui a dessaturação total
 * mataria a luz quente da sala, que é o que faz a foto parecer um lugar real.
 * Meio caminho mantém o ar tratado sem virar preto e branco.
 *
 * As luminâncias acima são estimadas por leitura da imagem, não medidas pixel a
 * pixel — se ao olhar a parede parecer clara demais sob o texto, o número a
 * mexer é o `brightness`, e o custo de subir está explicado acima.
 */
/**
 * ALINHADO COM A V2 em 07-09, a pedido: "o mesmo tratamento da hero na 3".
 *
 * O filtro agora é idêntico ao da HeroV2 (`saturate(.65) brightness(.68)`) e o
 * lavado tem a mesma estrutura de duas camadas. O ganho é de método, não de
 * gosto: com o tratamento igual nas duas rotas, a ÚNICA variável entre
 * `/home-v2` e `/home-v3` passa a ser o layout. Quem comparar as duas está
 * comparando uma coisa só, que é como comparação devia funcionar.
 *
 * O QUE ISSO CUSTOU, e é bom estar escrito: o ar quase preto que esta versão
 * tinha acabou. Ele vinha de `brightness(.5)` com lavado chapado a 40%, e era o
 * que aproximava o herói da TRIONN. Com o tratamento da V2 a foto fica bem mais
 * clara e a V3 vira "o layout da TRIONN", não "a estética da TRIONN". Foi
 * escolha consciente; voltar é trocar estes dois valores.
 *
 * AS PARADAS DO DEGRADÊ NÃO FORAM COPIADAS — foram refeitas. Copiar seria
 * repetir aqui o erro que a V2 acabou de corrigir, ao contrário. Lá o container
 * é 1200px centrado e o texto começa a ~20% da largura; aqui o herói é de
 * sangria e o texto começa a 40px da borda, ou seja ~2%, terminando por volta
 * dos 50% (o bloco tem `max-w-[920px]`). Então o platô escuro precisa começar
 * imediatamente e abrir mais cedo do que na V2.
 *
 * CONSEQUÊNCIA DE CONTRASTE, medida: nesta versão o texto fica no TOPO, sobre a
 * parede clara da foto — região bem mais luminosa que a plateia sentada onde o
 * texto da V2 cai. Com o tratamento novo essa área assenta em ~0,047 (contando
 * também a faixa do menu, que aqui se sobrepõe ao texto justamente por ele estar
 * no alto). Branco ali dá 10,8:1, folgado. Mas o eyebrow coral cai para 4,05:1 e
 * REPROVA no mínimo de 4,5:1 — por isso ele virou branco, como o da V2. O coral
 * sobrevive no filete, no ponto final, nos cartões de credencial e, desde o
 * pedido de 07-09, na seta do CTA secundário.
 *
 * REPARE NO PADRÃO dessa lista: onde o coral fica direto sobre a fotografia ele
 * só sobrevive por ser grande (o ponto final) ou por ser fino e curto (o
 * filete). Todo elemento coral que precisa ser lido em qualquer posição ganhou
 * vidro escuro por baixo — os cartões primeiro, o CTA secundário depois, pelo
 * mesmo motivo e com a mesma receita. A régua está medida no comentário dos CTAs.
 *
 * O CTA PRIMÁRIO SAIU DESSA CONTA no mesmo dia, quando virou botão preenchido
 * de `bg-brand`. Ele não disputa mais com a fotografia: cobre. É a única área de
 * cor da dobra, e a razão está escrita no comentário dele.
 */
const HERO_V3_TINT = {
  filter: "saturate(.65) brightness(.68)",
  wash: [
    // 1. Faixa do menu — mesma da V2, e aqui ela trabalha dobrado: além da nav,
    //    é sobre o topo que o título desta versão mora.
    "linear-gradient(to bottom,",
    "rgba(38,36,37,.50) 0%,",
    "rgba(38,36,37,.36) 8%,",
    "rgba(38,36,37,.18) 18%,",
    "rgba(38,36,37,.05) 30%,",
    "rgba(38,36,37,0) 42%),",
    // 2. Lavado lateral, com as paradas puxadas para a esquerda pelo motivo
    //    explicado acima: aqui o texto começa na borda, não a 20% dela.
    "linear-gradient(to right,",
    "rgba(38,36,37,.70) 0%,",
    "rgba(38,36,37,.62) 48%,",
    "rgba(38,36,37,.44) 64%,",
    "rgba(38,36,37,.16) 82%,",
    "rgba(38,36,37,.06) 100%)",
  ].join(" "),
};

/**
 * A CREDENCIAL DO CANTO — um cartão só, que ALTERNA entre as entradas do ticker.
 * O componente é o `CyclingCredential`, compartilhado com a V2; o porquê de ele
 * ser compartilhado, e não copiado como o resto das propostas, está no cabeçalho
 * dele. Aqui fica só o que é decisão DESTA versão: onde o cartão mora.
 *
 * Como chegou aqui, em três passos no mesmo 07-09, porque a ordem explica o
 * desenho:
 *
 *  1º  Eram duas credenciais escritas à mão, copiadas da V2.
 *  2º  Saiu a de 2023 a pedido, e sobrou um cartão fixo.
 *  3º  O cartão passou a alternar entre os itens do ticker, também a pedido.
 *
 * POR QUE VEIO DO CMS E NÃO DA MÃO. Conferido no ar em 07-09, as entradas do
 * ticker são EXATAMENTE os dois Brandon Hall que estavam escritos no código.
 * O texto à mão era, portanto, uma cópia do CMS que ninguém ia lembrar de
 * atualizar — e o passo 2 acabara de provar isso, porque tirar a credencial
 * daqui não tirou o prêmio do ticker da home no ar. Ligado no segmento, um
 * prêmio novo cadastrado pelo cliente entra no herói sozinho, e o problema de
 * "qual das duas mostrar" deixa de existir: mostra as duas, uma de cada vez.
 *
 * A COLISÃO COM O BANNER DE COOKIES ATRAVESSOU os três passos, medida em cada
 * um a 1440x900. A caixa é ancorada pela BASE, então o que muda a exposição é a
 * altura dela — e a altura mudou a cada passo, em direções diferentes:
 *
 *   1º duas credenciais   caixa 737→878 (141px)  banner cobre 63px = 45%
 *   2º uma credencial     caixa 789→860  (71px)  banner cobre 45px = 63%
 *   3º ligado ao ticker   caixa 768→878 (111px)  banner cobre 63px = 57%
 *
 * O passo 2 PIOROU: com um cartão só a caixa encolheu para dentro do banner, em
 * vez de para cima.
 *
 * ATENÇÃO AO PASSO 3: a altura dele NÃO É FIXA, e por isso a linha acima vale
 * para o conteúdo que está no CMS hoje (medida no alpha, duas entradas). Com a
 * pilha, a caixa toma a altura do MAIOR título do segmento — então cadastrar um
 * prêmio de nome comprido cresce a caixa para cima, e um segmento com títulos
 * curtos a encolhe. Medir isto no stub local dá outro número, porque a amostra
 * de lá tem cinco entradas de texto mais curto (lá deu 88px).
 *
 * Nada disso é conserto, e não está consertado: a base é ancorada e o banner
 * cobre sempre a mesma faixa. A correção de verdade é subir a base da caixa
 * acima da altura do banner, decisão de layout que não foi pedida. Enquanto não
 * for, o canto inferior direito é território disputado com a barra de cookies —
 * tensão da estética escolhida (a TRIONN empurra tudo para as quinas), não bug
 * de CSS.
 */

export default function HeroV3({ ticker = [] }: { ticker?: TickerEntry[] }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      applyEnvClasses();
      const mm = gsap.matchMedia();

      mm.add("all", () => {
        // Reaproveita as classes `.h-*` da V1/V2 de propósito: elas já nascem
        // com `opacity: 0` no globals.css para quem tem JS, e é a timeline que
        // as revela. Usar nomes novos exigiria mexer no globals.css, que é
        // compartilhado com a home no ar — o que esta proposta não pode fazer.
        const tl = gsap.timeline({ defaults: { ease: "power4.out" }, paused: true });
        tl.fromTo(
          ".h-bar",
          { autoAlpha: 0, scaleX: 0, transformOrigin: "left" },
          { autoAlpha: 1, scaleX: 1, duration: 0.6 },
          0
        )
          .fromTo(
            ".h-eyebrow",
            { autoAlpha: 0, x: -12 },
            { autoAlpha: 1, x: 0, duration: 0.5 },
            "-=0.3"
          )
          // Entrada mais longa e mais suave que a da V2, e por um motivo: aqui
          // o título é o dobro do tamanho e de peso leve. O mesmo `y: 46` da V2
          // num corpo de 88px vira um solavanco.
          .fromTo(
            ".h-title",
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 1.2 },
            "-=0.15"
          )
          .fromTo(
            ".h-cta",
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.7 },
            "-=0.7"
          )
          .fromTo(
            ".h-sub",
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.8 },
            "-=0.5"
          );

        const cleanups: Array<() => void> = [() => tl.kill()];

        // Sem vídeo nesta versão, então some toda a máquina de autoplay que a
        // HeroV2 precisa manter: forçar `muted` antes do play para o iOS, os
        // ouvintes de `canplay`/`loadeddata`, o fallback de gesto do usuário e o
        // `preload="none"` para o telefone não baixar 3,8 MB. Fundo estático não
        // tem política de reprodução — não há o que negociar com o browser.
        //
        // Sobrou só a timeline, e o `start` existe para o gate do preloader
        // abaixo continuar tendo um lugar único para disparar.
        //
        // A rotação da credencial NÃO passa por aqui: ela mora no
        // `CyclingCredential` e escuta o mesmo `app:ready` por conta própria.
        // Foi de propósito — o componente é compartilhado com a V2, e um
        // mecanismo que depende de o herói lembrar de acioná-lo é um mecanismo
        // que a próxima página vai esquecer.
        const start = () => {
          tl.play();
        };

        let begun = false;
        const begin = () => {
          if (begun) return;
          begun = true;
          window.clearTimeout(gate);
          window.removeEventListener("app:ready", begin);
          start();
        };
        const gate = window.setTimeout(begin, 10000);
        if (window.__appReady) {
          begin();
        } else {
          window.addEventListener("app:ready", begin, { once: true });
        }
        cleanups.push(() => {
          window.clearTimeout(gate);
          window.removeEventListener("app:ready", begin);
        });

        return () => cleanups.forEach((fn) => fn());
      });

      return () => mm.revert();
    },
    { scope }
  );

  // `data-hero="v3"` pelo mesmo motivo do `v2`: não casar com
  // `[data-hero="intro"]` nem com `:not([data-hero])`, que são as duas famílias
  // de regra de intro do globals.css. Assim nenhuma delas pega aqui e o arquivo
  // compartilhado continua intocado.
  //
  // `bg-[#0b0a0b]` e não `bg-ink`: o ink (#373234) é cinza médio e ficaria
  // claro demais para o vazio que esta referência pede.
  return (
    <section
      ref={scope}
      id="top"
      data-hero="v3"
      className="relative flex min-h-screen flex-col overflow-hidden bg-[#0b0a0b]"
    >
      {/* FOTOGRAFIA REAL, NÃO O VÍDEO — e é a segunda coisa que esta rota testa.

          A V2 continua com o clipe do iceberg. A V3 usa `dna-time-06.jpeg`, do
          acervo que já está no repositório. Assim as duas rotas comparam duas
          coisas ao mesmo tempo: dois layouts E dois tipos de imagem.

          POR QUE ESTA FOTO, entre as 25 da pasta. É a única que mostra uma
          SESSÃO ACONTECENDO — facilitadora em pé no palco, um participante de pé
          com microfone, sala cheia em mesas redondas. Todas as outras são foto
          de turma posada, encarando a câmera. E "sessão acontecendo" é
          literalmente o que falta, segundo a análise da referência: "Nenhuma
          imagem mostra uma sessão acontecendo — sala, flip chart, facilitador em
          pé, grupo trabalhando".

          Também é o que o slot 01 do pedido de conteúdo descreve: "People and
          scale, outdoors or in a big room".

          Funciona como herói por um motivo estrutural, não estético: ninguém no
          primeiro plano encara a câmera disputando com o texto, e o canto
          superior esquerdo é parede limpa — que é exatamente onde o título desta
          versão fica. Nas fotos de turma o título cairia em cima de rostos.

          É PLACEHOLDER, e tem três dívidas registradas:
            · 1280px de largura, contra os 2400px que NÓS especificamos para o
              cliente. Serve num laptop, amolece em tela grande.
            · proporção 1,5 — um corte 16:9 come topo e base.
            · marca de cliente visível (roupas adidas). O nosso próprio pedido
              diz "Image rights cleared — client-site photography especially".
              Para revisão interna tudo bem; publicar sem checar, não.

          O substituto definitivo é o slot 01, que a Rhea se comprometeu a mandar
          na call de 03-09 ("if you tell me 30 images I will choose them").

          `priority` porque é o maior elemento da primeira dobra — é ele o LCP da
          página, e sem isso o Next o trataria como imagem comum. */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ filter: HERO_V3_TINT.filter }}
      >
        <Image
          src={heroPhoto}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden="true"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ backgroundImage: HERO_V3_TINT.wash }}
      />

      {/* A DISTRIBUIÇÃO NOS CANTOS é a diferença estrutural para a V2.
          Lá o bloco é um só, centrado na vertical. Aqui é `justify-between`:
          título encostado em cima, credenciais e scroll encostados embaixo, e o
          meio da tela deliberadamente vazio — que é o que dá o ar da
          referência. No telefone isso vira empilhamento normal.

          SEM CONTAINER CENTRADO (mudança de 07-09). Isto era
          `mx-auto max-w-[1400px]`, e numa tela de 1900px sobravam 250px de
          margem morta de cada lado: o conteúdo ficava "no meio", não nos cantos,
          e era justamente o que faltava para bater com a referência. Medindo a
          `ref 10.png`: numa tela de ~1880px o título começa a ~22px da borda e a
          caixa do canto termina a ~1851px. Margem de 1,5%, não de 13%.

          Agora é largura cheia com `px-6 md:px-10` — 40px no desktop, ~2% numa
          tela de 1900px. A NavV2 recebe `wide` na página por causa disso: as
          duas TÊM de correr na mesma margem, senão o logo fica indentado e o
          título encostado, e aí parece defeito e não decisão.

          Só o herói faz isso. As seções abaixo continuam nos containers de
          1200px que já tinham — a quebra de largura entre um herói de sangria e
          o conteúdo assentado é padrão comum e deliberado. */}
      <div className="relative z-10 flex w-full flex-1 flex-col px-6 pb-12 pt-[128px] md:px-10 md:pb-10 md:pt-[136px]">
        {/* TEXTO CENTRADO NA VERTICAL (07-09, a pedido).
            Antes o bloco ficava encostado no topo — era o traço mais literal da
            TRIONN, onde o título nasce colado na barra de navegação.

            O `flex-1 items-center` centra o texto no espaço que sobra ACIMA da
            base, e não na altura total da seção. A diferença é de uns 60px e é
            deliberada: centrar na altura total faria o bloco descer por cima dos
            cartões de credencial em telas baixas. O que se perde é purismo em
            relação à referência; o que se ganha é não ter sobreposição.

            Isto também mudou duas contas: a faixa do menu deixou de cair em cima
            do texto (ele saiu do topo) e o texto passou a ficar sobre a PLATEIA
            da foto, e não sobre a parede — a mesma região onde o texto da V2
            cai. */}
        <div className="flex flex-1 items-center">
        <div className="max-w-[920px]">
          {/* O EYEBROW VOLTOU A SER BRANCO em 07-09, junto com o alinhamento de
              tratamento com a V2.

              Ele chegou a ser coral, e era o único ganho que esta versão tinha
              sobre a outra: enquanto o fundo ia a quase preto, o #f4796d media
              5,6:1 aqui e dava para usar cor no texto. Com o tratamento da V2 —
              que é bem mais claro, para a fotografia aparecer — o mesmo coral
              cai para a casa de 4,1 a 4,6:1 dependendo de onde o texto assenta.
              Isso ou reprova no mínimo de 4,5:1 ou passa raspando, e 11px em
              caixa alta com tracking de 2,5px é o pior caso que existe.

              Branco resolve com folga larga e tem o efeito colateral de deixar
              as duas propostas iguais neste ponto — o que é bom, porque o que
              elas existem para comparar é layout, não cor de eyebrow. */}
          <div className="mb-8 flex items-center gap-3">
            <span className="h-bar inline-block h-px w-9 bg-[#f4796d]" />
            <span className="h-eyebrow text-[11px] font-medium uppercase tracking-[2.5px] text-white">
              Global leadership advisory &amp; executive coaching
            </span>
          </div>

          {/* PESO 300, e é a decisão tipográfica central desta versão.
              A V2 usa 600 porque lá o título fica sobre foto clara e um traço
              fino sumiria. Aqui o fundo é quase preto, então o fino sobrevive —
              e a referência é toda construída em cima disso: corpo enorme, peso
              leve, entrelinha curta. Poppins 300 já está carregado no layout.

              O corpo é maior que o da V2 (88 contra 56) porque nesta estética o
              título ocupa o lugar da imagem. Continua abaixo dos 110px da
              referência de propósito: a Poppins é 21% mais larga que a fonte
              deles no mesmo corpo nominal, medição que está registrada no
              comentário do título da HeroV2. */}
          <h1 className="h-title max-w-[13ch] text-[40px] font-light leading-[1.02] tracking-[-1px] text-white sm:text-[60px] md:text-[76px] lg:text-[88px]">
            Keeping Leadership&nbsp;Real<span className="text-brand">.</span>
          </h1>

          {/* O SUBTÍTULO VOLTOU PARA CÁ, debaixo do título (07-09).

              Ele tinha descido para o canto inferior direito, em 14px, para
              imitar o parágrafo curto que a TRIONN põe sob a caixa de
              credenciais. A troca desfaz essa parte do mapeamento de propósito:
              lá o parágrafo é uma legenda de rodapé, aqui ele é a frase que
              explica o que a empresa faz, e enfiada num canto em corpo pequeno
              ela deixava de ser lida.

              Maior do que era em qualquer das duas versões — 24px no desktop
              contra 21px da V2 e 14px do canto. Cabe porque o título desta
              versão é 88px e leve: um subtítulo de 21px embaixo dele pareceria
              legenda. A proporção entre os dois é que manda, não o número.

              `max-w-[620px]` é o mesmo da V2 e não é estético: o bloco em volta
              agora vai até 920px, e linha de texto corrido nessa largura passa
              do limite confortável de leitura.

              Branco a 80% e não a 70% como no canto: aqui ele é elemento
              principal, não nota de rodapé. Sobre este fundo dá 10:1. */}
          <p
            className="h-sub mt-8 max-w-[620px] text-[18px] leading-[1.55] text-white/80 sm:text-[20px] md:text-[24px]"
            style={{ fontFamily: "var(--font-serif-v2)" }}
          >
            We help CEOs, CHROs &amp; CLOs build real leadership when the stakes
            are high — through real conversations, real choices and real
            decisions that deliver in the moments that matter.
          </p>

          {/* OS CTAs: CASCA DE BOTÃO COM O CORAL EM MARCAÇÃO. Pedido de 07-09,
              em duas partes — "uns detalhes vermelhos pros botões da hero" e
              logo depois "deixa esses botões com um pouco mais de cara de botão
              também".

              O QUE ESTAVA AQUI ANTES era link puro com filete embaixo, copiado
              da TRIONN, e o comentário antigo defendia justamente o contrário:
              que sem botão preenchido o vermelho da marca saía da primeira
              dobra e ficava só no ponto final. Está revogado pelo pedido — mas
              só a conclusão, não o princípio. "Cor em marcação, nunca em área"
              (§2.2 da leitura da referência) continua valendo, e é por isso que
              o coral aqui é borda e seta, e não preenchimento como na V2.

              A MEDIÇÃO É QUE DECIDIU A FORMA, e vale registrar porque ela é o
              motivo de a casca existir. Coral solto sobre a fotografia não
              sobrevive nesta faixa. Medido a 1440x900 com os links ocultos, o
              fundo em volta deles:

                faixa inteira dos CTAs   média 4,82:1   pior pixel 2,71:1
                largada do 1º link       média 5,79:1   pior pixel 4,50:1
                largada do 2º link       média 3,91:1   pior pixel 2,88:1

              Ou seja: no pior ponto o coral fica abaixo até do mínimo de 3:1 de
              elemento gráfico, e — pior — o resultado MUDA COM A POSIÇÃO. Passa
              na largada de um link e reprova na do outro, porque a plateia é
              mais clara ali. Detalhe que só funciona em metade dos botões não é
              detalhe, é sorte.

              A casca resolveu isso. O vidro escuro é o MESMO recipiente dos
              cartões de credencial logo abaixo, que existem exatamente por este
              motivo — segurar cor sobre foto. Com chão próprio, o contraste do
              detalhe deixa de depender de que pedaço da fotografia está atrás
              dele, e deixa de quebrar se a foto for trocada.

              O PRIMÁRIO FOI ALÉM DA CASCA depois, quando o pedido virou fundo
              vermelho (ver mais abaixo) — e aí ele resolve o mesmo problema por
              cima: tinta chapada é o chão mais firme que existe, a foto some
              debaixo dela. Quem ainda depende da medição acima é o SECUNDÁRIO,
              que continua de vidro. Por isso os números ficam registrados: se um
              dia alguém quiser devolver o secundário a link puro sobre a foto,
              a resposta já está medida, e é não.

              O RÓTULO É BRANCO NOS DOIS, e isso não é conservadorismo: no vidro
              o branco dá 7,3:1 no pior pixel da faixa contra os 2,7:1 do coral.
              Quem carrega o significado fica na cor que aguenta; o coral fica no
              que é redundante (a seta é `aria-hidden`, o rótulo já diz tudo).

              CANTO RETO, como todo o resto desta versão — ver o comentário dos
              botões na HeroV2: "a pílula é da marca deles, o canto reto é da
              nossa".

              A HIERARQUIA ENTRE OS DOIS deixou de ser sutil em 07-09: "os botões
              estão meio apagados, pode colocar um com o fundo vermelho, o
              primeiro". O primário passou a ser PREENCHIDO.

              Isso revoga de vez o "cor em marcação, nunca em área" para este
              botão — e é bom que esteja escrito, porque foi princípio declarado
              aqui duas vezes. Foi decisão do Ricardo, não descuido. O que o
              princípio ainda governa é todo o resto da dobra: o eyebrow, o
              filete, o ponto final e o botão secundário seguem sem área de cor.

              O VERMELHO É O `bg-brand` (#d84339), não o coral #f4796d que os
              detalhes usam. Não é capricho: `bg-brand` é o vermelho do botão
              principal da V2 e da home que está no ar. Um vermelho novo só da V3
              faria a proposta divergir da marca num ponto que ninguém pediu para
              mudar — a comparação entre as versões tem de ser de layout.

              CONTRASTE, medido e não estimado: branco sobre #d84339 dá 4,39:1.
              Fica LOGO ABAIXO do mínimo de 4,5:1 para texto normal, e o rótulo
              daqui é 12px, que é texto normal com folga nenhuma. Não é regressão
              introduzida aqui — é a mesma tinta do botão que já está no ar, e
              portanto uma característica do site inteiro. Se algum dia isso for
              corrigido, a correção é trocar por `bg-brand-dark` (#b5342b), que
              já existe no `globals.css` como o hover deste mesmo botão e dá
              6,02:1. Uma palavra de mudança, e vale para os dois lugares.

              A SETA DO PRIMÁRIO VIROU BRANCA. Coral sobre vermelho preenchido
              seria invisível — as duas cores são vizinhas. No secundário, que
              continua de vidro, a seta segue coral.

              O SECUNDÁRIO GANHOU PESO junto ("apagados", no plural): borda de
              25% para 40% e vidro de 50% para 60%. Continua claramente o segundo
              botão, mas para de parecer desligado ao lado de um preenchido.

              O `min-w` fixo continua: com ele os dois alinham, e o rótulo de
              319px do primeiro para de ditar a largura do conjunto.

              Rótulos intocados: copy é da CDNA. */}
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-5">
            <a
              href="#contact"
              className="h-cta group flex items-center justify-between gap-8 border border-transparent bg-brand px-7 py-4 text-[12px] font-medium uppercase tracking-[1.5px] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] transition-colors hover:bg-brand-dark sm:min-w-[320px]"
            >
              Discuss a leadership challenge
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </a>
            <a
              href="/approach"
              className="h-cta group flex items-center justify-between gap-8 border border-white/40 bg-black/60 px-7 py-4 text-[12px] font-medium uppercase tracking-[1.5px] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-colors hover:border-white/70 hover:bg-black/70 sm:min-w-[220px]"
            >
              See the work
              <span
                aria-hidden="true"
                className="text-[#f4796d] transition-transform duration-300 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </a>
          </div>
        </div>
        </div>

        {/* A BASE. No desktop: marcador de scroll à esquerda, credenciais à
            direita, com o vazio entre os dois. No telefone tudo empilha e o
            marcador de scroll some — ele não faz sentido num aparelho onde
            rolar é o gesto natural.

            Só a caixa de credenciais mora aqui desde 07-09; o descritor que
            ficava embaixo dela subiu para junto do título. O canto ficou com uma
            peça só, o que se afasta um pouco da referência (lá são caixa +
            parágrafo) mas resolve o problema real: aquela frase é o que explica
            a empresa e não podia estar em 14px num canto.

            TENTADO E REVERTIDO em 07-09: cartões separados lado a lado,
            centrados na base da tela, com `flex-wrap` para aguentar entrar mais
            prêmios. Visto e descartado no mesmo dia — fica registrado só para
            ninguém propor de novo achando que é ideia nova.

            As duas peças entram com `.h-cta`, e não com `.h-sub` como antes: o
            `.h-sub` agora é do subtítulo lá em cima, e o que sobrou aqui embaixo
            faz mais sentido chegando junto com os links, no mesmo stagger. */}
        <div className="mt-20 flex flex-col gap-10 md:mt-0 md:flex-row md:items-end md:justify-between">
          <span
            aria-hidden="true"
            className="h-cta hidden h-7 w-7 shrink-0 rounded-full border border-white/30 md:block"
          />

          <div className="h-cta md:max-w-[420px]">
            {/* A caixa com borda do canto inferior direito da referência.

                ESTRUTURA EM DUAS CÉLULAS, como a de lá: a TRIONN põe
                "EST. 2012" numa célula estreita, um filete vertical, e o texto
                na célula larga ("14+ YEARS SHAPING DIGITAL DIRECTION"). Aqui a
                célula estreita virou o carimbo do prêmio — distinção em cima,
                ano embaixo — e a larga leva o título.

                Era uma pilha lisa (distinção · ano numa linha, título na outra)
                até 07-09. A troca é o que dá o ar de selo: a distinção deixa de
                ser prefixo de uma frase e vira etiqueta com espaço próprio.

                O texto é o do cliente, sem encurtar — `line-clamp-2` corta na
                tela e mantém inteiro no DOM para leitor de tela.

                ── O VIDRO ──────────────────────────────────────────────────
                Glassmorphism suave, pedido em 07-09. São quatro camadas, e
                cada uma faz uma coisa:

                  backdrop-blur-md   borra o vídeo ATRÁS do cartão. É o que
                                     realmente vende o vidro, e por isso o
                                     efeito só vive enquanto o clipe roda.
                  bg-black/45        o corpo do vidro. ESCURO, e não o
                                     `bg-white/5` que é o clichê do efeito —
                                     ver a nota de contraste abaixo. Era /25
                                     enquanto o herói ia a quase preto; subiu
                                     para /45 em 07-09, quando o tratamento da
                                     V2 clareou o fundo e o "GOLD" coral caiu
                                     para 3,9:1 sobre o vidro antigo. Com /45 ele
                                     volta a ~5,1:1. Escurecer o cartão salvou o
                                     acento sem tirar o efeito — foi o caminho
                                     mais barato entre esse e perder o coral.
                  border-white/15    a borda fina, a aresta do vidro.
                  inset 0 1px …/10   um fio de luz na quina de cima, simulando
                                     luz batendo na espessura da placa. É esse
                                     detalhe que separa "vidro" de "retângulo
                                     translúcido".

                POR QUE VIDRO ESCURO E NÃO CLARO. Com `bg-white/5` o fundo sob o
                texto sobe para luminância ~0,034 e o "GOLD" coral cai para
                4,65:1 — passa no mínimo de 4,5:1 raspando, e 11px em caixa alta
                com tracking é o pior caso que existe. Com `bg-black/25` o fundo
                DESCE para ~0,014 e o mesmo coral vai a 6,2:1. O vidro escuro é
                mais seguro e, num herói quase preto, também é o que parece
                certo — vidro fumê, não leitoso.

                CANTOS RETOS de propósito, apesar de o efeito quase sempre vir
                arredondado. É decisão de identidade já registrada no projeto
                (ver o comentário dos botões na HeroV2: "a pílula é da marca
                deles, o canto reto é da nossa"), e a caixa da própria TRIONN
                também é de canto reto. */}
            <CyclingCredential entries={ticker} />

          </div>
        </div>
      </div>
    </section>
  );
}
