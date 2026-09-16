import {
  ArrowLeftRight,
  BadgeCheck,
  Brain,
  Circle,
  ClipboardCheck,
  Compass,
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
  Waypoints,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/Reveal";

/**
 * A faixa de pilares sob o bloco "How we help" — os cartões com ícone do
 * template de 15-09 (`4. Services/ExCo Leadership Services Page.png`).
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
 * ⚠️ `bg-paper` PARA CONTINUAR O BLOCO DE CIMA, que é o "How we help" e também é
 * paper. Aqui as duas faixas encostadas são o efeito desejado: a lista pertence
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
  /* Top 150 Leadership Development — estes cinco seguem o próprio mockup dela
     (pessoas, balão de fala, alvo, rede, gráfico em alta). */
  "Immersive experiences": Users,
  Coaching: MessageSquare,
  "Real business challenges": Target,
  "Peer learning": Network,
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
        <ul className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
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
              <li key={p} className="text-center">
                {/* ⚠️ DECORATIVO: o rótulo logo abaixo diz a mesma coisa, então
                    anunciar o ícone seria repetir o item duas vezes por pilar.
                    28px com traço 1.5 é a medida do mockup — traço fino o
                    bastante para não competir com o corpo serifado do rótulo. */}
                <Icon
                  aria-hidden
                  size={28}
                  strokeWidth={1.5}
                  className="mx-auto block text-brand"
                />
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
