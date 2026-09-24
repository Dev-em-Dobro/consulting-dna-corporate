import {
  ArrowLeftRight,
  BadgeCheck,
  Brain,
  Circle,
  ClipboardCheck,
  Compass,
  BarChart3,
  Cog,
  FileBarChart,
  Crosshair,
  Gavel,
  GitBranch,
  GitFork,
  Handshake,
  Landmark,
  Layers,
  Lightbulb,
  Megaphone,
  MessageSquare,
  MessagesSquare,
  Milestone,
  Mountain,
  MoveUpRight,
  Network,
  Repeat,
  Scale,
  Search,
  ShieldCheck,
  Shuffle,
  Sprout,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  UsersRound,
  Waypoints,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/Reveal";

/**
 * A faixa de pilares sob o bloco "How we work" — hoje, a FILEIRA DE ÍCONES
 * SEPARADOS POR FILETES do mockup de 21-09 (`docs/meetings/nova-pagina-interna-
 * servicoes.jpg`), pedido por email: *"Services internal — Re-layout the
 * internal with the image nova-pagina-interna-servicoes.jpg inside meetings
 * folder"*.
 *
 * ============================================================================
 * ⚠️ O QUE O RE-LAYOUT DE 21-09 MUDOU AQUI
 * ============================================================================
 * A faixa já era ícone + rótulo centrados sobre `paper`, e continua sendo. O
 * que mudou é que os itens deixaram de flutuar numa grade solta e passaram a
 * ser COLUNAS DE UMA FILEIRA SÓ, divididas por filetes verticais de altura
 * cheia — no arquivo de 866px há sete filetes (x=111, 208, 314, 393, 492, 601,
 * 722) para oito itens, e nenhum antes do primeiro nem depois do último.
 *
 * ⚠️ O DESENHO TEM OITO ITENS E O NOSSO DADO TEM CINCO, e isso é decisão de
 * CONTEÚDO, não um layout que não coube. O mockup lista "Immersions · Live
 * business challenges · Mastery Labs · Coaching · Peer learning · Leadership
 * experiments · Everyday habits · Measurement"; três desses não existem na
 * frase de `howWeHelp` de serviço nenhum, e os `pillars` são, por regra, as
 * palavras dessa frase. O raciocínio inteiro e o caminho de volta estão na
 * caixa de `pillars` do Senior Leadership Development, em `lib/services.ts`.
 *
 * ⚠️ AS LARGURAS DO DESENHO SÃO DESIGUAIS (de 73 a 121px a 866, conforme o
 * rótulo) e aqui as colunas são IGUAIS. Foi escolha: com colunas de conteúdo,
 * "Coaching" fica com metade da largura de "Leadership experiments" e os
 * filetes param de marcar um ritmo — viram um acaso do texto. Numa fileira de
 * quatro a seis itens, que é o que os dez serviços têm, a grade igual é o que
 * mais se parece com o desenho.
 *
 * Abaixo do `lg` a fileira quebra em duas ou três colunas e OS FILETES SOMEM.
 * Não é omissão: `divide-x` põe borda em todo filho menos o primeiro, e numa
 * grade de duas linhas isso desenha um traço órfão no começo da segunda linha,
 * onde não há vizinho à esquerda para separar. Um filete que separa um item do
 * nada é pior do que nenhum.
 *
 * A HISTÓRIA ANTERIOR DESTA FAIXA, que continua valendo:
 *
 * A faixa nasceu dos cartões com ícone do template de 15-09 (`4. Services/ExCo
 * Leadership Services Page.png`).
 *
 * ⚠️ O ÍCONE SUBSTITUIU O NUMERAL EM 16-09, a pedido interno, e a caixa antiga
 * dizia o contrário — fica o registro de por que ela caiu. O argumento de então
 * era que o projeto não tinha biblioteca de ícones e que ícone genérico
 * repetido nos dez lê como template comprado; o `01`, `02` … dava marcador e
 * ritmo sem afirmar nada. O que mudou: o `lucide-react` entrou como dependência
 * (é a biblioteca que este time já usa) e o mapa abaixo dá um ícone ESPECÍFICO
 * a cada um dos ~50 rótulos, então não há repetição genérica. O mockup dela
 * mostra ícone, e era o único ponto em que a faixa divergia dele.
 *
 * ⚠️ TODOS EM `text-brand`, ENQUANTO O MOCKUP OS PINTA DE CORES VARIADAS
 * (roxo, vermelho, âmbar, azul-marinho, grafite). A escolha é nossa e é por
 * consistência: o resto do site usa o vermelho da marca como única cor de
 * acento, e cinco acentos diferentes numa faixa só criariam uma paleta que não
 * existe em nenhuma outra página. Se ela pedir as cores do mockup, é trocar a
 * classe por uma cor no mapa.
 *
 * ⚠️ `bg-paper` PARA CONTINUAR O BLOCO DE CIMA, que é o "How we work" e também é
 * paper — e o mockup de 21-09 confirmou isso pixel a pixel: a faixa #f7f3f0 do
 * arquivo começa no rótulo "HOW WE WORK" e só termina depois desta fileira.
 * Aqui as duas faixas encostadas são o efeito desejado: a lista pertence
 * àquele bloco, não é uma seção nova. O que separa as duas é o respiro do topo,
 * e não uma troca de fundo nem uma régua — as duas foram tentadas e saíram em
 * 16-09. O corte de verdade vem depois, na faixa vermelha do CTA (a evidência
 * ficou branca no mesmo dia).
 *
 * Lista vazia (ou ausente) não renderiza nada — sem slot tracejado e sem título
 * órfão, pela mesma régua do resto das páginas de serviço.
 */

/**
 * Rótulo → ícone. O CONJUNTO É FECHADO HOJE: os dez serviços de `lib/services.ts`
 * somam 47 rótulos distintos, todos aqui, e o teste de `pillars` fixa de quatro
 * a seis por serviço. Não é um mapa aberto por acaso — os rótulos são PALAVRAS
 * DA CLIENTE, copiadas literalmente da frase de "how we help" (ver a caixa do
 * campo `pillars` em `lib/services.ts`), então rótulo novo só aparece quando o
 * texto dela muda.
 *
 * ⚠️ QUANDO ISSO ACONTECER, o rótulo cai no `FALLBACK_ICON` e a faixa continua
 * de pé — sem buraco no lugar do ícone e sem quebrar o build. Quem acrescentar
 * copy nova acrescenta a linha aqui; o círculo é o aviso visual de que faltou.
 */
const PILLAR_ICONS: Record<string, LucideIcon> = {
  /* ✅ OS OITO DA FILEIRA DO SENIOR LEADERSHIP DEVELOPMENT — 21-09. Os ícones
     foram LIDOS DO DESENHO dela (`nova-pagina-interna-servicoes.jpg`), um a um,
     e não escolhidos por afinidade com a palavra: pessoas, alvo com flecha,
     engrenagem, balão de fala, pessoas, lâmpada, barras em alta, documento com
     gráfico.

     ⚠️ DOIS DELES SÃO PESSOAS NO DESENHO — "Immersions" e "Peer learning" — e
     aqui saem com glifos DIFERENTES (`Users` e `UsersRound`). No arquivo dela os
     dois desenhos também diferem entre si (três cabeças agrupadas contra três
     figuras lado a lado), mas a diferença é sutil demais para sobreviver a
     22px; dois glifos idênticos numa fileira de oito leriam como erro de
     copiar e colar.

     ⚠️ "Mastery Labs" COM L MAIÚSCULO é chave PRÓPRIA, e convive com a
     "Mastery labs" minúscula logo abaixo. O mapa casa por string exata: são as
     grafias de dois documentos diferentes dela (o desenho de 21-09 e a planilha
     de copy), e os ícones também diferem — engrenagem no desenho, gráfico em
     alta na leitura antiga. Unificar as duas sem ela pedir seria escolher qual
     dos documentos dela está errado. */
  Immersions: Users,
  "Live business challenges": Target,
  "Mastery Labs": Cog,
  "Peer learning": UsersRound,
  "Leadership experiments": Lightbulb,
  /* BARRAS, e não a seta de tendência que este rótulo puxaria por associação.
     O desenho mostra três barras ascendentes; a primeira versão saiu com
     `TrendingUp` e a comparação lado a lado com o arquivo pegou a troca. */
  "Everyday habits": BarChart3,
  Measurement: FileBarChart,

  /* Top 150 Leadership Development — os CINCO `pillars`, que esta página deixou
     de renderizar em 21-09 (a fileira passa por `practices`; ver a caixa daquele
     campo). Ficam porque os `pillars` continuam sendo o caminho de volta.
     Seguem o próprio mockup dela: pessoas, balão de fala, alvo, rede, gráfico
     em alta. */
  "Immersive experiences": Users,
  Coaching: MessageSquare,
  "Real business challenges": Target,
  /* ⚠️ "Peer learning" MUDOU DE ÍCONE EM 21-09 (era `Network`) e subiu para o
     bloco dos oito, acima: o rótulo é o MESMO nos dois desenhos dela, e uma
     chave só não pode ter dois ícones. O desenho mostra pessoas, não um
     diagrama de rede — e este rótulo só aparece neste serviço, então a troca
     não alcança nenhuma outra página. */
  "Mastery labs": TrendingUp,

  /* Culture Transformation */
  Leaders: UserCheck,
  Teams: Users,
  "Organisational rituals": Repeat,
  "The flow of work": Workflow,

  /* Talent Development */
  Assessment: ClipboardCheck,
  "Stretch experiences": Mountain,
  "Business challenges": Target,
  "Deliberate practice": Repeat,

  /* Manager Development */
  "Setting direction": Compass,
  "Making decisions": GitBranch,
  "Developing people": Sprout,
  "Managing performance": TrendingUp,
  "Navigating difficult conversations": MessagesSquare,
  "Leading through change": Waypoints,

  /* Women in Leadership */
  "Leadership identity": BadgeCheck,
  "Enterprise influence": Megaphone,
  "Strategic networks": Network,
  "Readiness for bigger roles": MoveUpRight,

  /* High Performing Teams */
  Trust: Handshake,
  "Constructive challenge": MessagesSquare,
  "Decision rights": Gavel,
  Accountability: ShieldCheck,
  Alignment: Crosshair,
  Execution: Zap,

  /* HRLT Effectiveness */
  "Business judgement": Scale,
  "Strategic alignment": Crosshair,
  "Horizontal working": ArrowLeftRight,
  Influence: Megaphone,

  /* ⬅ OS SEIS RESULTADOS DA HRLT — 24-09, quando aquela página saiu de uma
     implementação própria e passou a usar o template. Eles NÃO são `pillars`
     (não são palavras da frase de `howWeHelp`, que é a regra daquele campo):
     são `evidenceSummary.outcomes`, e desenham a grade de ícone + rótulo acima
     dos logos. Moram neste mapa porque `pillarIcon` é a busca única do site —
     ver a caixa dela.

     ⚠️ OS GLIFOS REPETEM OS DOS RÓTULOS CURTOS DE PROPÓSITO, e é o pedido de
     24-09 em ação (*"o mesmo ícone para o mesmo conceito em todas as páginas"*):
     "Stronger strategic influence" leva o mesmo megafone de "Influence", "More
     consistent execution…" o mesmo raio de "Execution", e "Greater alignment…"
     a mesma mira de "Alignment". Uma frase e a palavra que a resume não podem
     ter símbolos diferentes na mesma página. */
  "Stronger strategic influence": Megaphone,
  "Faster and better decision-making": GitBranch,
  "Greater alignment and collective impact": Crosshair,
  "Higher employee and manager engagement": Users,
  "More consistent execution of people priorities": Zap,
  "A future-ready HR function": Compass,

  /* Judgement in AI */
  "Critical thinking": Brain,
  Judgement: Scale,
  Curiosity: Search,
  "Sense-making": Lightbulb,
  "Ethical reasoning": ShieldCheck,
  "Decision-making under uncertainty": GitBranch,

  /* Executive Coaching */
  Complexity: Shuffle,
  Transition: Milestone,
  Relationships: Handshake,
  Performance: TrendingUp,
  "Leadership scale": Layers,

  /* Family Business Consulting */
  Governance: Landmark,
  "Leadership transitions": Milestone,
  Succession: GitFork,
};

/** Rótulo fora do mapa fechado acima. Ver a caixa do mapa. */
const FALLBACK_ICON: LucideIcon = Circle;

/**
 * O ícone de um rótulo, para quem desenha uma fileira de ícone + texto FORA
 * desta seção — hoje, os `outcomes` da faixa de evidência da HRLT.
 *
 * ⚠️ EXPORTA A BUSCA, E NÃO O MAPA. Quem importar o `Record` acaba mexendo nele
 * de outro arquivo, e o mapa é fechado de propósito (ver a caixa dele): os
 * rótulos são palavras da cliente e só mudam quando o texto dela muda. Com uma
 * função, o único jeito de acrescentar ícone continua sendo escrever a linha
 * aqui, junto do comentário que explica de onde o glifo veio.
 */
export const pillarIcon = (label: string): LucideIcon =>
  PILLAR_ICONS[label] ?? FALLBACK_ICON;

export default function SolutionPillars({ items }: { items?: string[] }) {
  const pillars = (items ?? []).filter((p) => p.trim());
  if (pillars.length === 0) return null;

  return (
    <section className="bg-paper">
      {/* ⚠️ GANHOU PADDING NO TOPO EM 16-09, a pedido, e antes não tinha nenhum.
          O raciocínio de então era que o respiro já vinha do `py-16 lg:py-28` da
          coluna de texto do bloco acima, e somar os dois abriria um buraco. Na
          tela a conta não fechou: sem régua separando (ver abaixo) e com os itens
          centralizados, a lista subia e encostava no parágrafo, e as duas coisas
          liam como um bloco de texto só. O respiro passou a ser o que separa.

          ⚠️ TOPO E PÉ IGUAIS, e foi a segunda correção do mesmo dia: o topo entrou
          menor que o pé (10/16 contra 20/24) para "compensar" o padding do bloco
          de cima, e na tela a faixa ficou visivelmente descentrada dentro da
          própria banda. A simetria é o que faz a lista ler como um bloco
          próprio, que é o que ela passou a ser quando perdeu a régua. `py-20
          md:py-24` é a mesma medida das outras seções desta página. */}
      <Reveal className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
        {/* ⚠️ `<ul>`/`<li>` E NÃO `<div>`, desde 16-09: os pilares são
            literalmente a enumeração da frase do bloco acima ("immersive
            experiences, coaching, real business challenges, peer learning and
            mastery labs"), e o `SolutionBoxList` nesta mesma pasta já usa lista
            pelo mesmo motivo. Em leitor de tela isso dá a contagem ("lista com
            5 itens") de graça, que é justamente o que o numeral fazia no visual
            e o ícone deixou de fazer. */}
        {/* ⚠️ `lg:gap-x-0` ANDA JUNTO COM O `lg:divide-x`, e esquecê-lo é o erro
            óbvio: com calha, a borda nasce colada à borda ESQUERDA do item e a
            calha inteira fica de um lado só dela — o filete deixa de estar entre
            os dois itens e passa a estar encostado num deles. Sem calha, o
            respiro vem do `lg:px-5` de cada item e o traço cai no meio.

            Abaixo do `lg` a calha volta (`gap-x-8`) e os filetes não existem —
            ver a caixa no topo do arquivo sobre o traço órfão na segunda linha.

            `minmax(150px,…)` e não os 180px de antes: com seis pilares e a
            largura que sobra depois do `px-5` de cada um, 180 forçava a grade a
            quebrar em duas linhas justamente nas telas de 1024–1200, que é onde
            o desenho ainda cabe numa fileira só. */}
        <ul className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] lg:gap-x-0 lg:divide-x lg:divide-line">
          {pillars.map((p) => {
            const Icon = PILLAR_ICONS[p] ?? FALLBACK_ICON;
            /* ⚠️ CENTRALIZADO E SEM A RÉGUA, desde 16-09, a pedido. Cada item
               tinha um `border-t` e alinhava à esquerda, como no template dela.
               As duas coisas saíram juntas porque são a mesma decisão: a régua
               existia para dar um topo comum aos itens quando o rótulo quebrava
               em número diferente de linhas, e centralizado o alinhamento passa
               a ser o eixo vertical de cada célula da grade — o ícone marca o
               topo e o rótulo pendura embaixo dele.

               O QUE SE PERDEU, para quem for reverter sabendo: com rótulos de
               alturas diferentes ("Trust" contra "Decision-making under
               uncertainty"), o pé da fileira fica irregular. Com a régua isso
               não aparecia, porque o olho lia o topo alinhado. */
            return (
              <li key={p} className="text-center lg:px-5">
                {/* ⚠️ DECORATIVO: o rótulo logo abaixo diz a mesma coisa, então
                    anunciar o ícone seria repetir o item duas vezes por pilar.

                    ⚠️ 40 NÃO É A ALTURA DO DESENHO — o lucide compõe dentro de um
                    quadro 24×24 com folga, e o traçado ocupa uns 16 desses 24.
                    `size={40}` põe na tela ~27px de desenho; no mockup de 21-09
                    o ícone mede 27×19 a 866, uns 45×32 a 1440, o que pediria
                    `size` perto de 48. Ficou em 40 porque a 48 o ícone fica mais
                    alto que duas linhas de rótulo e a fileira passa a ler como
                    uma tira de ícones com legenda, e não como uma lista.

                    Subiu de 28 em 21-09: o valor antigo vinha do mockup de
                    15-09, onde cada pilar era um CARTÃO e o ícone dividia espaço
                    com uma caixa. Numa fileira nua ele é a única peça gráfica.

                    Traço 1.5 — fino o bastante para não competir com o corpo
                    serifado do rótulo, e é o que os dois desenhos mostram. */}
                <Icon
                  aria-hidden
                  size={40}
                  strokeWidth={1.5}
                  className="mx-auto block text-brand"
                />
                {/* O RÓTULO FICOU EM SERIFA, e o mockup de 21-09 concorda: as
                    oito legendas dele são serifadas, não versalete de grotesca —
                    são NOME DE COISA, não rótulo de seção. A medida também
                    aguentou a conferência: a caixa alta da legenda mede ~8px a
                    866, o que a 1440 dá uns 20px de fonte, e aqui já são 19/21. */}
                <p className="mt-3 font-serif text-[19px] leading-[1.25] tracking-[-0.2px] text-ink md:text-[21px]">
                  {p}
                </p>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
