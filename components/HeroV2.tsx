"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { applyEnvClasses, isTouchDevice } from "@/lib/hero-intro";
import heroPhoto from "@/public/dna-time/dna-time-06.jpeg";
import CyclingCredential from "@/components/CyclingCredential";
import type { TickerEntry } from "@/lib/cms/map";

/**
 * Hero da /home-v2 — a versão para o grupo comparar, seguindo a referência
 * Explore Performance que a Rhea mandou em 03-09.
 *
 * É uma CÓPIA da HeroV1, não um refactor: a home que está no ar não pode mudar
 * enquanto isto é só uma proposta. Se a V2 for aprovada, o caminho é promover
 * este arquivo e apagar o outro; se não for, apaga-se este.
 *
 * O que muda em relação à V1, e por quê:
 *  - Texto alinhado à esquerda, não centrado — é o padrão da referência.
 *  - Foto escurecida de verdade (§4.1 da leitura: "o texto branco some sobre o
 *    céu claro do iceberg" — a crítica mais direta que ela fez ao primeiro
 *    segundo do site).
 *  - Acento coral só em marcação: filete, eyebrow, ponto final e a borda do
 *    selo. Nunca como área.
 *  - Subtítulo em serifa (§2.1 da leitura) — a família vem da página, não daqui.
 *  - A faixa que rolava dá lugar a um selo fixo, legível, com contexto.
 *
 * NÃO HÁ MAIS VÍDEO NENHUM — e chegou aqui em dois passos, no mesmo dia 07-09.
 *
 * 1º  Saiu a INTRO. Antes o clipe rodava inteiro com a página vazia e só ao
 *     terminar é que congelava no primeiro frame e o conteúdo entrava — o
 *     visitante esperava o vídeo acabar para ver o site. Virou fundo em loop,
 *     com o conteúdo entrando junto no carregamento.
 * 2º  Saiu o CLIPE. O loop expôs o que ninguém tinha conferido: o
 *     `hero-intro.mp4` não é plano de fundo, é um filme institucional de ~20s
 *     com LEGENDAS GRAVADAS na imagem e fade para preto no fim. Em loop, as
 *     legendas dele rodavam por baixo do nosso título e a tela sumia no preto a
 *     cada 20 segundos. Hoje o fundo é uma fotografia real da CDNA — a mesma
 *     que a V3 usa, escolhida e justificada em HeroV3.tsx.
 *
 * Consequências que sobraram, todas de propósito:
 *
 *  - Sem `data-hero="intro"`, então NENHUMA das regras de intro do globals.css
 *    pega aqui (fundo branco durante o clipe, trava de 56,25vw no telefone,
 *    troca poster↔canvas). O valor é `v2` justamente para não casar nem com
 *    `[data-hero="intro"]` nem com `:not([data-hero])` — as duas famílias de
 *    regra de lá. O globals.css é compartilhado com a HeroV1: mexer nele
 *    mudaria a home no ar, então ele não foi tocado.
 *  - O escurecimento (`.h-bg`) não anima mais: ele precisa estar lá no primeiro
 *    frame, senão o texto branco nasce por cima da parte clara da imagem — que é
 *    exatamente a crítica §4.1 que esta versão existe para resolver.
 *  - A sequência de frames em canvas do telefone morreu junto com a intro, e a
 *    decisão que ficou em aberto o dia inteiro (poster parado × 3,8 MB de MP4 no
 *    4G) MORREU JUNTO COM O CLIPE. Sem vídeo em lugar nenhum, telefone e desktop
 *    mostram a mesma fotografia e não há o que decidir.
 */
/**
 * O tratamento de cor do herói.
 *
 * NÃO É GRADIENTE — e essa foi a correção de 07-09. Duas tentativas antes desta
 * erraram o alvo, e vale registrar por quê, para ninguém refazer o caminho:
 *
 *   1ª  Gradiente horizontal + véu chapado de ink por cima de tudo. O véu
 *       escurecia por igual, inclusive a metade direita, onde não há texto para
 *       proteger — não dava para ver o clipe que agora é fundo permanente.
 *   2ª  Só gradientes (lateral, rodapé, topo), sem véu. Melhorou a visibilidade
 *       e errou o efeito: a referência não tem degradê nenhum no herói.
 *
 * O que a Explore Performance faz é um FILTRO DE COR UNIFORME sobre a imagem
 * inteira — como um vidro colorido na frente do vídeo. O deles é azul oceano.
 *
 * O nosso é CINZA ESCURO (decidido em 07-09, depois de uma rodada avermelhada
 * que não vingou). O tom é #262425, da mesma família quente do token `--color-ink`
 * (#373234), só que mais escuro — não é um cinza azulado nem neutro de fábrica.
 *
 * São dois passos, e os dois são uniformes (nenhum tem direção):
 *
 *   FILTRO   `saturate()` + `brightness()` aplicados na própria mídia. O
 *            `saturate` é o passo que quase ninguém lembra e sem ele nada
 *            funciona: o material é um iceberg em mar AZUL SATURADO, e um
 *            lavado cinza por cima de azul forte não dá cinza, dá azul
 *            acinzentado. Para LER como cinza, a saturação tem de cair quase a
 *            zero — por isso os valores aqui são bem mais baixos que os da
 *            rodada avermelhada, onde sobrar um resto de cor não atrapalhava.
 *   LAVADO   Uma chapada cinza-escura por cima, que assenta o conjunto.
 *
 * O `brightness` é o que segura a legibilidade, e ele não é gosto: a área do
 * texto cai em cima do CÉU, que é a parte mais clara do quadro (ver o poster).
 * Sem escurecer, texto branco sobre céu claro é exatamente a crítica §4.1 que
 * esta versão existe para resolver.
 *
 * O pedido junto com o cinza foi "deixa o vídeo aparecendo atrás", então esta
 * rodada é deliberadamente clara. Escolhido o `soft` em 07-09, entre três que
 * foram ao ar para comparação. Os dois descartados ficam aqui porque a escolha
 * é de gosto e pode voltar atrás:
 *
 *     medium   saturate(.12) brightness(.60)   rgba(38,36,37,.30)
 *     strong   saturate(.06) brightness(.52)   rgba(38,36,37,.40)
 *
 * CONTRASTE — e aqui o `soft` cobra o preço de ser o mais claro dos três.
 *
 * A região do texto fica em luminância ~0,175, contra ~0,117 do `medium`. Isso
 * põe o texto branco em 4,67:1: passa no mínimo de 4,5:1, mas com quase nada de
 * folga. Duas consequências, e nenhuma é opinião:
 *
 *   1. O subtítulo TEVE de virar branco puro. Ele era `text-white/85`, e a 85%
 *      sobre este fundo dava 3,88:1 — REPROVADO. Não dava para deixar: 21px em
 *      peso normal não conta como "texto grande" pela WCAG (o corte é 24px), e
 *      21px é justamente o tamanho no desktop.
 *   2. O eyebrow segue branco. O coral (#f4796d) aqui dá 2,4:1.
 *
 * ATENÇÃO — ESTES NÚMEROS FORAM MEDIDOS SOBRE O ICEBERG, QUE NÃO É MAIS O FUNDO.
 *
 * Quando a fotografia substituiu o clipe, no fim de 07-09, os valores do filtro
 * foram mantidos por decisão: eles foram escolhidos a olho e aprovados, e trocar
 * junto com a imagem misturaria duas variáveis numa comparação que existe
 * justamente para isolar variáveis. Mas o cálculo de contraste acima vale para o
 * céu do iceberg, não para esta foto.
 *
 * O ponto a vigiar é específico: nesta versão o texto é centrado na vertical, à
 * esquerda, e nessa região a foto tem a PLATEIA SENTADA — mais escura que o céu
 * era, o que ajuda, porém cheia de rostos pequenos, o que atrapalha de outro
 * jeito. A V3 não tem esse problema porque lá o título fica no topo, onde a foto
 * é parede limpa.
 *
 * Se o texto ficar ruidoso ou fraco aqui, há dois caminhos e eles não são
 * equivalentes: baixar o `brightness` de .68 para ~.60 escurece tudo, ou mudar o
 * `object-position` da <Image> tira a plateia de baixo do texto sem escurecer
 * nada. O segundo preserva a foto; o primeiro sacrifica.
 */
/**
 * LAVADO COM DIREÇÃO — testado a pedido, no fim de 07-09.
 *
 * Era uma chapada só (`rgba(38,36,37,.22)`), sem direção nenhuma, porque a
 * Explore Performance não tem degradê no herói e a versão chapada foi a que
 * acertou o efeito depois de duas tentativas erradas. Agora é escuro na esquerda,
 * onde o texto mora, clareando até a direita.
 *
 * Vale dizer o que isso é: uma DIVERGÊNCIA deliberada da referência, não uma
 * volta atrás. O que mudou entre uma coisa e outra foi o fundo — o degradê foi
 * descartado quando atrás havia um clipe de iceberg, cujo lado direito era mar
 * vazio e não ganhava nada em aparecer mais. Nesta foto o lado direito tem a
 * sala inteira: palco, facilitadora, luz quente. Clarear ali mostra o que a
 * imagem tem de melhor, e escurecer a esquerda ajuda o texto num ponto onde a
 * foto é ruidosa (é ali que fica a plateia, cheia de rostos pequenos).
 *
 * As paradas seguem o texto, não a estética. Numa tela de 1920 o bloco de texto
 * cai entre ~21% e ~60% da largura, porque o container é 1200px centrado e o
 * texto ocupa 760px dele. Por isso o escuro segura firme até 62% e só então
 * abre. Se o container mudar de largura, estas paradas precisam mudar junto.
 *
 * Ganho de contraste, estimado: na esquerda o branco sai de ~9,4:1 (chapada
 * .22) para ~12,3:1. Nenhum dos dois reprovava; o que o degradê resolve não é
 * contraste, é RUÍDO — menos rosto aparecendo por trás da letra.
 *
 * O filtro da mídia continua uniforme e intocado. Quem ganhou direção foi só o
 * lavado, que é a segunda camada.
 */
/**
 * SATURAÇÃO SUBIU DE .18 PARA .65 em 07-09, e o motivo é medido.
 *
 * O `.18` era herança do iceberg, onde existia por uma razão específica: o mar
 * era azul saturado, e um lavado cinza por cima de azul forte não dá cinza, dá
 * azul-acinzentado. Matar a cor original era pré-requisito para o cinza ler como
 * cinza.
 *
 * Numa fotografia de sala esse mesmo `.18` arranca tom de pele e luz quente.
 * Medida na imagem original: saturação média 0,305, mediana 0,206, percentil 90
 * em 0,729 — um terço dos pixels tem cor de verdade. Multiplicando por 0,18, a
 * média vai a ~0,055 e até os pixels mais vivos caem para ~0,13. Praticamente
 * monocromático, e aí não sobra motivo para a foto estar aqui: ela existe para
 * mostrar que é uma sessão da CDNA acontecendo, não um retângulo cinza.
 *
 * Foi isso, e não o degradê, que fez a mudança anterior parecer que "não mudou
 * nada": um lavado direcional por cima de uma imagem já achatada em cinza é
 * sutil por construção.
 *
 * SEM CUSTO DE CONTRASTE. `saturate()` preserva luminância — nada do que foi
 * medido acima muda por causa desta linha. É por isso que dava para subir sem
 * refazer conta nenhuma.
 *
 * Ficou em .65 e não no .5 da V3 de propósito: assim as duas propostas diferem
 * também na saturação, e a comparação ganha mais um eixo em vez de perder um.
 */
const HERO_TINT = {
  filter: "saturate(.65) brightness(.68)",
  //
  // DUAS CAMADAS EMPILHADAS. CSS aceita várias imagens de fundo separadas por
  // vírgula, e a PRIMEIRA da lista pinta por cima — daí a faixa do topo vir
  // antes do lavado lateral.
  wash: [
    // 1. Faixa do MENU. A NavV2 flutua sobre os primeiros 76px e não tem fundo
    //    próprio (só o dropdown e o menu do telefone têm). Com o lavado lateral
    //    clareando para a direita, os links da nav — que ficam justamente à
    //    direita — passaram a boiar sobre a parte clara da foto.
    //
    //    O pedido foi "sem parecer que foi mexido no fundo do menu", e é isso
    //    que dita a forma: a faixa não pode ter fim visível. Uma tira curta com
    //    corte seco cria uma linha horizontal atravessando o herói, que é
    //    exatamente o defeito a evitar. Por isso ela desce até 42% da altura da
    //    seção — uns 450px numa tela de 1080 — com paradas que afinam depressa
    //    no começo e devagar no fim (.50 → .36 → .18 → .05 → 0). O olho lê como
    //    "o topo é mais escuro", não como "tem uma barra ali".
    //
    //    Termina em 42% de propósito: o bloco de texto é centrado na vertical e
    //    começa por volta dos 40%, então a faixa acaba onde o texto começa e não
    //    soma escurecimento em cima do que já foi calibrado.
    "linear-gradient(to bottom,",
    "rgba(38,36,37,.50) 0%,",
    "rgba(38,36,37,.36) 8%,",
    "rgba(38,36,37,.18) 18%,",
    "rgba(38,36,37,.05) 30%,",
    "rgba(38,36,37,0) 42%),",
    // 2. O lavado LATERAL. As paradas foram refeitas em 07-09 porque a primeira
    //    versão errava o alvo — e o erro era de posição, não de intensidade.
    //
    //    Ela ia de .62 em 0% até .10 em 100%, caindo de forma constante. Só que
    //    0% é a BORDA DA JANELA, e o texto não começa ali: o container é 1200px
    //    centrado, então numa tela de 1920 o bloco de texto vai de ~20% a ~60%
    //    da largura, e num 1440 vai de ~10% a ~63%. Ou seja, o trecho mais
    //    escuro do degradê caía na margem vazia à esquerda, fora do container, e
    //    quando alcançava a primeira letra já tinha descido para ~.55. A rampa
    //    existia, mas não em cima do que ela deveria proteger.
    //
    //    Agora o escuro é um PLATÔ que atravessa a faixa do texto (.70 → .62 até
    //    os 40%), e a abertura acontece depois dele, entre 58% e 78% — que é
    //    justamente onde o texto acaba e o palco começa. O contraste entre as
    //    duas pontas ficou maior sem o herói ficar mais escuro no geral: subiu
    //    pouco na esquerda e abriu mais na direita.
    "linear-gradient(to right,",
    "rgba(38,36,37,.70) 0%,",
    "rgba(38,36,37,.62) 40%,",
    "rgba(38,36,37,.44) 58%,",
    "rgba(38,36,37,.16) 78%,",
    "rgba(38,36,37,.06) 100%)",
  ].join(" "),
};

/**
 * AS CREDENCIAIS SAÍRAM DAQUI em 07-09, e o que ficou é o registro do porquê.
 *
 * O que existia: uma lista escrita à mão com os dois GOLD da Brandon Hall (2023
 * e 2024), desenhada como uma faixa logo ABAIXO do herói. Ela nasceu presa na
 * base da <section> e saiu de lá no mesmo dia por ser "coisa demais na primeira
 * tela"; agora saiu por inteiro.
 *
 * O MOTIVO É O CARTÃO DA QUINA. O `CyclingCredential` mostra os mesmos prêmios,
 * um de cada vez, e vem do segmento `ticker` do CMS. Manter as duas peças era
 * dizer a mesma credencial duas vezes na mesma tela — e a versão à mão era a
 * pior das duas, porque era uma cópia do CMS que ninguém ia lembrar de
 * atualizar. A dívida que estava anotada aqui ("se a CDNA ganhar outro prêmio,
 * alguém tem de editar este arquivo") deixou de existir sozinha.
 *
 * O QUE SE PERDE, e é bom estar escrito: o cartão da quina não aparece no
 * telefone (ver o comentário dele, com a medição), então a V2 agora fica sem
 * credencial nenhuma no herói em telas pequenas. É a soma de duas decisões
 * separadas, não um descuido. O conserto barato, se incomodar, é deixar o cartão
 * visível no telefone empilhado abaixo dos botões — ao custo dos 40px de altura
 * que já foram medidos e recusados uma vez.
 *
 * O ARGUMENTO ORIGINAL CONTINUA VALENDO e é por isso que este texto fica: o
 * `AwardsMentions.tsx`, compartilhado com o site inteiro, tem cinco prêmios
 * cravados no código e três são de 2008–2009, com distinção "Finalist" e "Semi
 * finalist". Pôr "semifinalista, 2009" ao lado dos logos da Coca-Cola e da Shell
 * enfraquece o herói em vez de sustentá-lo. Os dois GOLD importam em particular
 * porque a Explore Performance, a referência que a Rhea mandou, ganhou o MESMO
 * prêmio: é o único terreno de comparação direta, e nele estávamos mostrando
 * 2009 contra o 2025 deles. Quem for promover a V2 precisa saber disso antes de
 * mexer no que o herói mostra.
 */

export default function HeroV2({ ticker = [] }: { ticker?: TickerEntry[] }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Restore the `js`/`touch` classes in case a hydration failure wiped
      // them (in-app browsers — see lib/hero-intro.ts). useGSAP is a layout
      // effect, so this lands before the next paint.
      applyEnvClasses();
      const mm = gsap.matchMedia();


      // Opt-in on-device diagnostics: open the site with ?herodebug to get a
      // live overlay of detection + lifecycle on a real phone, no devtools
      // needed. Inert (null) without the query param.
      const debugEl = (() => {
        if (!window.location.search.includes("herodebug")) return null;
        const el = document.createElement("div");
        el.style.cssText =
          "position:fixed;left:8px;bottom:8px;z-index:2147483647;background:rgba(0,0,0,.85);color:#0f0;font:11px/1.45 monospace;padding:8px 10px;max-width:92vw;white-space:pre-wrap;pointer-events:none;border-radius:6px";
        document.body.appendChild(el);
        return el;
      })();
      const dbg = (msg: string) => {
        if (debugEl) debugEl.textContent += `${msg}\n`;
      };
      if (debugEl) {
        window.addEventListener("error", (e) => dbg(`ERR ${e.message}`));
        dbg(
          `mtp=${navigator.maxTouchPoints} vw=${window.innerWidth} ` +
            `touchClass=${document.documentElement.classList.contains("touch")} ` +
            `touchFn=${isTouchDevice()} ` +
            `reduceMotion=${window.matchMedia("(prefers-reduced-motion: reduce)").matches}`
        );
      }

      // "all": a entrada roda para todo mundo, inclusive com "Reduce Motion"
      // ligado — decisão de produto herdada da V1. Note que ela ficou bem menos
      // agressiva do que era: agora é só o conteúdo entrando, sem clipe
      // segurando a página.
      mm.add("all", () => {
        // Built paused e disparado no `begin()` lá embaixo — não porque haja
        // intro para esperar (não há mais), mas para não animar atrás do
        // preloader: se rodasse na hora, a entrada terminaria escondida e o
        // conteúdo apareceria já pronto quando a cortina subisse.
        const tl = gsap.timeline({ defaults: { ease: "power4.out" }, paused: true });
        // fromTo (not from): the targets start hidden via CSS, so we must state
        // the visible end explicitly — otherwise GSAP would read the hidden CSS
        // value as the destination and animate hidden -> hidden.
        //
        // `.h-bg` saiu da timeline: o véu escuro nasce pronto, porque tem de
        // estar lá no primeiro frame do vídeo. Ver o cabeçalho do arquivo.
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
          .fromTo(
            ".h-title",
            { autoAlpha: 0, y: 46, skewY: 2 },
            { autoAlpha: 1, y: 0, skewY: 0, duration: 1 },
            "-=0.15"
          )
          .fromTo(
            ".h-sub",
            { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, y: 0, duration: 0.8 },
            "-=0.6"
          )
          .fromTo(
            ".h-cta",
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.6 },
            "-=0.5"
          );

        const cleanups: Array<() => void> = [() => tl.kill()];

        // Toda a máquina de autoplay saiu junto com o vídeo, em 07-09: forçar
        // `muted` antes do `play()` para o iOS aceitar inline, os ouvintes de
        // `canplay`/`loadeddata`, o fallback de primeiro gesto quando o autoplay
        // é bloqueado, e o `preload="none"` que impedia o telefone de baixar
        // 3,8 MB de um MP4 que ele nunca mostraria. Fundo estático não tem
        // política de reprodução — não há o que negociar com o browser.
        //
        // Sobrou só a timeline. O `start` continua existindo para o gate do
        // preloader abaixo ter um lugar único onde disparar.
        const start = () => {
          tl.play();
        };

        // Gate on the preloader finishing; if it's absent or slow, start anyway.
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

  // ALTURA DO HERÓI: ele ocupa a tela inteira, como o da referência.
  //
  // Sem isto a seção tem a altura do conteúdo, então qualquer ajuste de
  // tipografia mexe em quanto da foto aparece — foi o que aconteceu ao descer o
  // título de 72 para 56: o herói encolheu junto e a seção branca de baixo subiu
  // para dentro da primeira tela, virando uma listra.
  //
  // O `min-h-screen` vale para TODO MUNDO, não só para o desktop. Na versão com
  // intro ele era limitado a `[html:not(.touch)]` porque no telefone o
  // globals.css prendia a seção em 56,25vw enquanto o clipe rodava, e um
  // min-height de 100vh ganharia dessa trava e quebraria o enquadramento. Sem
  // intro não há trava, e o herói de tela cheia é o que a referência faz nos
  // dois tamanhos.
  //
  // O retorno voltou a ser só a <section> em 07-09. Ele era um FRAGMENTO
  // enquanto a faixa de credenciais existia, porque ela era irmã do herói e não
  // filha — precisava ficar fora da <section> para cair na segunda dobra. A
  // faixa saiu (ver o bloco no topo do arquivo) e o fragmento perdeu a razão de
  // ser. Este comentário está aqui em cima, e não dentro do return, porque ali
  // já é contexto de JSX — `//` viraria texto na tela.
  return (
    <section
      ref={scope}
      id="top"
      data-hero="v2"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-ink"
    >
      {/* A MÍDIA. O FILME DO ICEBERG SAIU EM 07-09 — a mesma fotografia da V3
          passou a ser o fundo aqui também, a pedido.

          Isso encerra, de vez, o problema que dominou o dia: o `hero-intro.mp4`
          nunca foi um plano de fundo. É um filme institucional de ~20s com
          LEGENDAS GRAVADAS na imagem ("Beyond what we see", "The greatest
          leadership challenges are rarely on the surface", "Corporate DNA —
          Going Beyond the Surface") e fade para preto no fim. Em loop, essas
          legendas rodavam por baixo do nosso próprio título e a tela sumia no
          preto a cada 20 segundos. Sem vídeo, nada disso existe.

          O que a troca também apaga, e é bom que apague: a decisão em aberto do
          telefone (poster parado × 3,8 MB de MP4 no 4G). Não há mais vídeo em
          lugar nenhum, então as duas plataformas mostram a mesma coisa e não há
          o que decidir.

          A escolha da foto está explicada em HeroV3.tsx — é a única das 25 do
          acervo que mostra uma sessão acontecendo, e é placeholder até chegar o
          slot 01 que a Rhea se comprometeu a mandar.

          RESSALVA DE LAYOUT, que vale mais aqui do que na V3: nesta versão o
          bloco de texto é centrado na vertical, à esquerda — e nesta foto essa
          região é a PLATEIA SENTADA, cheia de rostos pequenos. Na V3 o título
          fica no topo, onde a foto é parede limpa. A mesma imagem, portanto,
          serve melhor ao layout da V3 do que ao desta. Se o texto aqui ficar
          ruidoso, os caminhos são descer o `brightness` do HERO_TINT ou mudar o
          `object-position` para tirar a plateia de baixo do texto.

          O ENQUADRAMENTO NO TELEFONE, corrigido em 07-09 a pedido ("quero que
          apareça mais a mulher no palco na direita"). A conta, porque o número
          não é chutado:

            A foto é 960x640, ou seja 3:2. Numa tela de 375x812 o `object-cover`
            escala pela ALTURA — 812 × 1,5 dá 1218px de largura desenhada, e a
            tela mostra 375 deles: 30,8% da imagem. Com `object-center` essa
            janela de 30,8% cai no meio da foto, que é exatamente onde está a
            plateia sentada. A mulher no palco está por volta dos 82% da largura
            (medido no desktop, onde a foto aparece inteira: ela ocupa de 1100 a
            1250px numa tela de 1440).

            Em `object-position: X%` a borda esquerda visível fica em
            (1218-375)/1218 × X, ou seja 0,692·X. Para a janela ficar centrada
            nos 82% preciso da borda esquerda em 82% - 15,4% = 66,2%, logo
            X = 66,2 / 69,2 ≈ 96%.

          Por que 96% e não `object-right` (100%): em 100% a janela vai de 69,2%
          a 100% e o centro dela cai nos 84,6% — a mulher fica descentralizada e
          a borda direita da foto encosta na borda da tela, o que endurece o
          enquadramento. 96% centra nela e ainda deixa uma sobra à direita.

          Só no telefone. No desktop a foto aparece INTEIRA na largura (1440/1,5
          = 960px de altura desenhada contra 900 de tela, ou seja o corte lá é
          vertical), então `object-position` horizontal não muda nada — mas
          `md:object-center` fica explícito para ninguém achar que os 96% valem
          para os dois tamanhos. */}
      <div
        className="h-media pointer-events-none absolute inset-0 z-0"
        style={{ filter: HERO_TINT.filter }}
      >
        <Image
          src={heroPhoto}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[96%_center] md:object-center"
          aria-hidden="true"
        />
      </div>

      {/* O lavado de cor: escuro na esquerda, clareando até a direita. É o
          segundo passo do tratamento — as paradas e o porquê da direção estão em
          HERO_TINT, no topo do arquivo.

          `backgroundImage` e não `backgroundColor`: gradiente é imagem de fundo
          em CSS, não cor. Trocar um pelo outro aqui não dá erro — simplesmente
          não pinta nada, e é o tipo de coisa que passa despercebida.

          Ele NÃO anima. Na versão com intro as camadas de escurecimento
          carregavam `h-bg` e entravam junto com o conteúdo, o que fazia sentido
          quando o clipe rodava "limpo" antes. Agora o texto branco nasce por
          cima da imagem desde o primeiro frame, e sem tratamento ele nasceria
          por cima da parte clara — a crítica §4.1 em pessoa. A classe `h-bg`
          saiu junto, para ninguém religar isso sem querer. */}
      <div
        className="h-wash pointer-events-none absolute inset-0 z-0"
        style={{ backgroundImage: HERO_TINT.wash }}
      />

      {/* O bloco é centrado pela seção (justify-center acima), então o padding
          vertical vira só a folga da barra de navegação, que flutua por cima
          dos primeiros 76px.

          Voltou a `md:pb-0` em 07-09: por algumas horas ele foi `md:pb-[132px]`
          para reservar a faixa de credenciais presa na base do herói. A faixa
          saiu da primeira dobra, então não há mais nada para reservar. */}
      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 pb-20 pt-[140px] md:px-10 md:pb-0 md:pt-[76px]">
        <div className="max-w-[760px]">
          {/* O EYEBROW É BRANCO, e isso mudou em 07-09 junto com o tratamento
              de cor. Vale a explicação porque a versão anterior deste comentário
              defendia o contrário.

              Enquanto o herói era escurecido com força, o coral clareado
              (#f4796d) media 7,8:1 aqui e dava para usar cor no texto. Com o
              filtro uniforme — que é mais claro de propósito, para o vídeo
              aparecer — a região do texto subiu para luminância ~0,117 e o mesmo
              coral caiu para 2,4:1. Reprova no mínimo de 4,5:1, e não é de
              raspão: 13px em caixa alta com tracking de 2px é o pior caso que
              existe para texto pequeno. Branco ali dá 6,3:1.

              Não é um caso novo no projeto: a HeroV1 também usa eyebrow branco,
              e pelo mesmo motivo (lá o coral sobre a foto clara media 1,29:1).

              O coral NÃO sumiu — ele fica no filete ao lado e no ponto final do
              título, que são marcação e não texto corrido. É exatamente a regra
              da referência: cor só na marcação, nunca como área. E a cor
              definitiva continua sendo do Guli, quando as fotos chegarem. */}
          <div className="mb-7 flex items-center gap-3">
            <span className="h-bar inline-block h-px w-9 bg-[#f4796d]" />
            <span className="h-eyebrow text-[13px] font-semibold uppercase tracking-[2px] text-white">
              Global leadership advisory &amp; executive coaching
            </span>
          </div>
          {/* Mesma copy da V1, palavra por palavra: é a working copy aprovada
              pelo cliente no briefing de 27-08, item 1. A V2 mexe no desenho,
              não no texto — e o texto do herói é o único da home que já está
              fechado, que é o motivo de ele ser o lugar seguro para propor
              layout antes de a Rhea devolver o conteúdo (a regra do Guli:
              conteúdo antes de layout, senão vira retrabalho).

              O ponto final em vermelho mantém a decisão de 01-09 (cd0753c: "o
              ponto final é da palavra vermelha") e por acaso é o mesmo padrão
              da referência, onde todo título termina em ponto.

              TAMANHO — medido nos dois sites em 1440px, não estimado.

              O nominal engana. A referência usa 64px e a nossa home também usa
              64px; a altura de caixa alta é praticamente a mesma (44px lá,
              45px aqui). Ou seja, as letras têm o mesmo tamanho.

              A diferença é a LARGURA da família. Medido em canvas, a mesma
              frase de teste no mesmo corpo de 64px:

                Platform Web (deles)   532px
                Poppins (nossa)        643px   → 21% mais larga

              A Poppins é geométrica e larga; ela ocupa um quinto a mais de
              linha pelo mesmo corpo nominal. Some a isso o peso 700 da home no
              ar (contra 500 deles) e o título parece bem maior, mesmo com o
              número igual.

              Por isso aqui o corpo é 56px, e não 64: a 56px a mesma frase mede
              563px, que é a largura óptica do título deles (532px). É o
              tamanho em que o nosso tipo LÊ como o da referência, em vez de
              medir como ele.

              Peso 600 e não 500 porque a Poppins em 500 sobre foto escura fica
              fina demais. Voltar para 64px é trocar um número nesta linha. */}
          <h1 className="h-title mb-7 text-[34px] font-semibold leading-[1.1] tracking-[-0.3px] text-white sm:text-[44px] md:text-[56px]">
            Keeping Leadership&nbsp;Real<span className="text-brand">.</span>
          </h1>
          {/* Serifa no corpo — o par tipográfico do item 2.1 da leitura da
              referência. A família vem da página (--font-serif-v2), não daqui,
              para trocar em um lugar só. Nota: a referência usa sans no título
              e serifa no corpo; o Guli falou em fonte mais expressiva para os
              títulos. São coisas compatíveis, mas o título continua em Poppins
              de propósito — display é decisão dele e vale para o site inteiro,
              não só para esta tela.

              BRANCO PURO, e não `text-white/85` como era: a 85% sobre o
              tratamento `soft` isto dava 3,88:1 e reprovava no mínimo de 4,5:1.
              21px em peso normal não conta como "texto grande" pela WCAG, que
              corta em 24px. Ver o bloco de contraste em HERO_TINT. */}
          <p
            className="h-sub mb-9 max-w-[620px] text-[19px] leading-[1.65] text-white md:text-[21px]"
            style={{ fontFamily: "var(--font-serif-v2)" }}
          >
            We help CEOs, CHROs &amp; CLOs build real leadership when the stakes
            are high — through real conversations, real choices and real
            decisions that deliver in the moments that matter.
          </p>
          {/* BOTÕES — medido, também em 1440px:

                referência   altura 50–52px · 16px · peso 500 · caixa normal ·
                             sem tracking · cantos 30px · "Explore Our Work"
                             tem 166px de largura
                home no ar   altura 52px · 14px · peso 700 · CAIXA ALTA ·
                             tracking +0,5px · cantos retos · "Discuss a
                             leadership challenge" tem 319px de largura

              A altura é a mesma. Nossa fonte é até MENOR (14 contra 16). O que
              faz o botão parecer grande é a largura: caixa alta mais tracking
              positivo mais negrito esticam o rótulo, e o nosso rótulo já é o
              dobro de palavras — 319px contra 166px, quase o dobro.

              Aqui: 15px, peso 600, caixa normal, sem tracking. Os cantos ficam
              retos de propósito — a pílula é da marca deles, o canto reto é da
              nossa, e trocar isso é decisão de identidade, não de calibragem.

              O que sobra e não é meu para mexer: o rótulo. "Discuss a
              leadership challenge" são quatro palavras onde a referência usa
              duas. Encurtar é copy, e copy é da CDNA. */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="h-cta bg-brand px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Discuss a leadership challenge
            </a>
            {/* Segundo CTA, como na referência ("Explore Our Work" ao lado do
                principal).

                DESTINO: /approach, decidido em 07-09. Antes apontava para
                /cases, pela leitura de que o trabalho a mostrar primeiro eram
                os casos.

                O RÓTULO FICOU DESALINHADO COM O DESTINO, e isso é de propósito
                — não é esquecimento. "See the work" promete trabalho feito, ou
                seja, casos; a página de destino agora explica o método (o 5H®,
                o inner/outer game, os diagnósticos). Quem clicar esperando
                cases vai cair noutro lugar.

                Não troquei o texto porque rótulo é copy, e copy é da CDNA — é a
                mesma regra que já vale para o botão principal aqui do lado
                ("Discuss a leadership challenge", quatro palavras onde a
                referência usa duas). Se o destino é para ficar, o rótulo natural
                é algo como "Our approach" ou "How we work", e isso se pede junto
                com o resto do conteúdo que está com a Rhea. */}
            <a
              href="/approach"
              className="h-cta border border-white/40 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              See the work
            </a>
          </div>
          {/* A assinatura "Making Leadership Real. Results, Not Promises." saiu
              do herói nesta versão.

              PRECISA SER DITO NO GRUPO, não é uma limpeza silenciosa: juntar as
              duas metades da assinatura dentro do herói foi pedido do cliente
              numa rodada anterior — está nos status de 05-08 e 10-08 como item
              entregue, e nós reportamos como feito. Tirar reverte uma entrega
              que eles pediram.

              O argumento a favor: na primeira dobra ela concorre com a headline
              e com o subtítulo, e a referência não tem nada equivalente ali. O
              argumento contra é o histórico acima.

              A assinatura não some do site: "Making Leadership Real." continua
              no rodapé (`SiteFooter.tsx`), e "Results, Not Promises." é o
              título da seção Client Impact. E ela está listada como texto atual
              da Home no documento de conteúdo, então a Rhea pode trazê-la de
              volta ao preencher. */}
        </div>
      </div>

      {/* O CARTÃO DE CREDENCIAL — EMBAIXO E À DIREITA, como o da V3.

          Ele já esteve ao lado do texto, centrado na vertical, e estava no lugar
          errado: o pedido era a quina, igual à V3. A diferença não é de gosto —
          ao lado do texto ele lê como parte do argumento, na quina lê como
          credencial de rodapé, que é o que ele é.

          POR QUE ABSOLUTO, e não mais uma coluna na linha do texto. O texto
          desta versão é centrado na vertical pela própria <section>
          (`justify-center`), então o container dele tem a altura do conteúdo e
          não a do herói. Dentro dele, "embaixo" seria a base do texto, não a
          base da tela. Ancorar na <section> é o que faz "embaixo" significar
          embaixo. A V3 não precisa disso porque lá a coluna já ocupa a altura
          toda e o bloco da quina é o último filho dela.

          VAI ATÉ A BORDA DA TELA, e isto foi uma correção de 07-09. A primeira
          versão prendeu o cartão à grade de 1200px, com o argumento de que tudo
          nesta versão mora nela e o cartão não devia ser o único a furá-la. O
          argumento estava certo e perdeu assim mesmo: medido, ele parava a 160px
          da borda da tela contra 40px do cartão da V3, e a 160px a peça não lê
          como quina — lê como um bloco solto flutuando dentro da grade. Quina é
          uma relação com a BORDA DA TELA, não com o container.

          Então aqui o invólucro é de largura cheia com `px-6 md:px-10`, que é
          exatamente o que a V3 usa (`components/HeroV3.tsx`, o container do
          herói). Os 40px de folga lateral passam a ser os mesmos nas duas, que é
          o que faz as duas quinas rimarem.

          `pb-10` são 40px até a base — o mesmo valor da folga lateral, e o mesmo
          `md:pb-10` que a V3 declara. Na V3 a folga medida sai menor (22px)
          porque lá o conteúdo da coluna transborda um pouco o padding; não vale
          copiar o número medido, vale copiar o valor declarado.

          `pointer-events-none` no invólucro porque ele atravessa a largura toda
          e não pode virar uma placa invisível sobre o herói; o cartão devolve o
          `auto` para si.

          SÓ NO DESKTOP (`hidden md:block`), e isto não é preguiça de responsivo.
          O pedido é uma quina, e no telefone não existe quina: o cartão viraria
          mais um bloco empilhado. Medido a 375x812 quando ele estava no fluxo,
          isso levava o herói a 852px — 40px além da tela — e devolvia exatamente
          o problema que a decisão de 07-09 resolveu ao tirar as credenciais da
          primeira dobra ("coisa demais na primeira tela: eyebrow, título,
          subtítulo, dois botões e mais duas credenciais").

          `h-cta` para entrar junto com os botões na timeline. Sem a classe, o
          cartão apareceria de cara enquanto o resto do herói ainda estivesse
          surgindo, e uma peça que já está lá antes de todas as outras lê como se
          não pertencesse à composição. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden md:block">
        <div className="w-full px-6 pb-10 md:px-10">
          <div className="flex justify-end">
            <CyclingCredential
              entries={ticker}
              className="h-cta pointer-events-auto w-[340px]"
            />
          </div>
        </div>
      </div>

    </section>
  );
}
