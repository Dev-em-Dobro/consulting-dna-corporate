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
 * àquele bloco, não é uma seção nova. O corte vem depois, na faixa escura da
 * evidência.
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
      {/* Sem padding no topo: o respiro já vem do `py-16 lg:py-28` da coluna de
          texto do bloco acima. Somar os dois abriria um buraco entre a frase e a
          lista que ela desdobra. */}
      <Reveal className="mx-auto max-w-[1440px] px-6 pb-20 md:px-10 md:pb-24">
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
            return (
              <li key={p} className="border-t border-ink/12 pt-5">
                {/* ⚠️ DECORATIVO: o rótulo logo abaixo diz a mesma coisa, então
                    anunciar o ícone seria repetir o item duas vezes por pilar.
                    28px com traço 1.5 é a medida do mockup — traço fino o
                    bastante para não competir com o corpo serifado do rótulo. */}
                <Icon
                  aria-hidden
                  size={28}
                  strokeWidth={1.5}
                  className="block text-brand"
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
