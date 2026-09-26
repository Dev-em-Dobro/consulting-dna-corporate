import {
  ArrowRight,
  BarChart3,
  Brain,
  CalendarDays,
  ChevronsRight,
  Compass,
  CircleCheck,
  Cog,
  Eye,
  ClipboardCheck,
  FastForward,
  FileText,
  Globe,
  Laptop,
  Lightbulb,
  MessageCircle,
  Mountain,
  Network,
  Search,
  Smartphone,
  Sprout,
  Target,
  TrendingUp,
  Trophy,
  Users,
  UsersRound,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import type { ServiceStep } from "@/lib/services";

/**
 * A FILEIRA DE PASSOS DE "HOW WE WORK" — o percurso de seis etapas do layout de
 * Manager Development (`docs/meetings/manager-development-24-09.jpeg`, 24-09).
 *
 * Cada passo é: um disco rosa claro com o ícone, o título em negrito e a
 * descrição. Entre um passo e o seguinte, uma seta vermelha apontando para a
 * direita.
 *
 * ⛔ O NUMERAL SAIU EM 24-09, a pedido: *"na seção How we work pode tirar os
 * numeros"*. Era um disco vermelho cheio com o número em branco, encostado no
 * canto superior esquerdo do disco do ícone, como o layout desenha.
 *
 * ⚠️ O `<ol>` FICA, e isto não é descuido. A lista continua sendo uma
 * SEQUÊNCIA — é o que as setas dizem visualmente, e é o que o `<ol>` diz a quem
 * usa leitor de tela ("item 1 de 6"). Tirar o numeral tirou a marcação VISUAL
 * da ordem; trocar para `<ul>` tiraria a ordem de vez, para quem só tem o
 * texto. O numeral era `aria-hidden` justamente porque o `<ol>` já dizia aquilo.
 *
 * ============================================================================
 * ⚠️ ISTO NÃO É O `SolutionPillars`, E A DIFERENÇA É DE SIGNIFICADO
 * ============================================================================
 * Aquela fileira é uma LISTA: itens de igual peso, sem ordem, separados por
 * filetes. Esta é uma SEQUÊNCIA: as setas encadeiam um passo ao seguinte, e o
 * `<ol>` diz o mesmo a quem usa leitor de tela. Reordenar a lista de lá muda a ordem de leitura; reordenar a
 * de cá muda o que a CDNA afirma que acontece primeiro.
 *
 * Por isso os dois convivem, e por isso `steps` tem precedência sobre
 * `practices`/`pillars` em `SolutionView`: uma página não mostra as duas.
 *
 * ⚠️ AS SETAS SÓ EXISTEM A PARTIR DE `lg`. Abaixo disso a grade quebra em duas
 * ou três fileiras, e a seta do primeiro item de cada fileira nova apontaria
 * para o vazio à esquerda. É a mesma armadilha que o filete do `SolutionPillars`
 * tem, e a mesma solução.
 */
const STEP_ICONS: Record<string, LucideIcon> = {
  /* AS CHAVES SÃO GENÉRICAS ("people", "laptop") e não o nome do passo, ao
     contrário do mapa de `SolutionPillars`, que casa pelo rótulo exato. A razão
     é que aqui o dado JÁ diz qual ícone quer — os passos do layout não têm
     relação óbvia entre título e glifo ("Habit nudges" é um telefone), então
     derivar do texto seria adivinhar. */
  people: Users,
  peers: UsersRound,
  laptop: Laptop,
  speech: MessageCircle,
  document: FileText,
  phone: Smartphone,

  /* ⬅ OS SETE DA HRLT — 24-09, quando aquela página saiu de uma implementação
     própria e passou a usar este componente.

     ⚠️ AS CHAVES SÃO O VOCABULÁRIO COMUM QUE A DAILY PEDIU: *"o mesmo ícone
     para o mesmo conceito em todas as páginas"*. Por isso `growth` é a mesma
     seta que sobe que o `SolutionProof` usa para "Business proof" — o conceito
     ali e aqui é o mesmo (o que muda como resultado), e duas setas diferentes
     para ele seriam a divergência que o pedido quer acabar.

     ⚠️ DOIS DELES NÃO SÃO OS GLIFOS QUE A PÁGINA ANTIGA MOSTRAVA, e a troca é
     deliberada: lá "Ways of Working" e "Measure" eram os dois `BarChart3`, o
     mesmo desenho para "como o time trabalha junto" e para "medir progresso".
     Barras medem; fluxo de trabalho é `Workflow`. O glifo repetido vinha de uma
     página escrita à mão, sem mapa que obrigasse a escolher. */
  search: Search,
  document_check: ClipboardCheck,
  tools: Wrench,
  chart: BarChart3,
  sprout: Sprout,
  workflow: Workflow,
  growth: TrendingUp,
  globe: Globe,

  /* Os aceleradores e dois passos do Talent Development — 24-09. Lidos do
     layout, um a um: montanha, alvo com flecha, olho, e o troféu do sétimo
     passo. "Accountability" e "Talent Identification" caem em `people`, que já
     existia — mesmo conceito, mesmo glifo, que é a regra da daily. */
  mountain: Mountain,
  target: Target,
  eye: Eye,
  trophy: Trophy,

  /* Os quatro diferenciais e dois passos do Executive Coaching — 24-09, lidos
     do layout. `mindset` é o cérebro do lucide no lugar da cabeça com coração
     que o desenho traz (não existe equivalente no conjunto), e `network` é o
     mesmo glifo que `SolutionPillars` já usa para "Strategic networks" — mesmo
     conceito, mesmo símbolo, que é a regra da daily. */
  mindset: Brain,
  network: Network,
  check: CircleCheck,
  forward: ChevronsRight,
  /* O "Extend (optional)" do layout é o ⏩ de dois triângulos, não as duas
     divisas de `forward`. */
  fast_forward: FastForward,

  /* ⬅ OS DOIS QUE FALTAVAM PARA OS SEIS PASSOS DA FAMILY BUSINESS CONSULTING —
     24-09, lidos do layout: a lâmpada do "Prepare" e a engrenagem do "Build".
     Os outros quatro daquela sequência (`search`, `document`, `people`,
     `chart`) já estavam aqui, que é o vocabulário comum da daily funcionando.

     ⚠️ `cog` NÃO É `tools`. A chave existente desenha uma CHAVE INGLESA, que a
     HRLT usa para ferramenta; a engrenagem é o glifo que o `SolutionProof` já
     dá ao conceito de PROCESSO ("Operating proof"), e é esse o sentido aqui. */
  lightbulb: Lightbulb,
  cog: Cog,

  /* ⬅ OS DOIS QUE FALTAVAM PARA A FILEIRA DE Women’s Leadership Development —
     24-09, lidos do layout: o calendário da duração e a bússola dos mentores
     externos. Os outros cinco daquela fileira (`people`, `peers`, `laptop`,
     `speech`, `network`) já estavam aqui.

     ⚠️ `compass` REPETE O GLIFO QUE `SolutionPillars` DÁ A "A future-ready HR
     function" e que o `SolutionSteps` da HRLT já usa como `globe`? NÃO: `globe`
     é o mundo e este é a bússola, que o mapa de pilares usa para ORIENTAÇÃO
     ("Setting direction"). Mentor externo é quem aponta a direção de fora, e é
     esse o sentido — a regra da daily de um glifo por conceito. */
  calendar: CalendarDays,
  compass: Compass,
};

/** O glifo de uma chave do mapa acima — para quem desenha a mesma anatomia fora
 *  deste componente (os diferenciais ao lado do "What we do"). */
export function stepIcon(key?: string): LucideIcon | undefined {
  return key ? STEP_ICONS[key] : undefined;
}

export default function SolutionSteps({
  items,
  /**
   * ⚠️ ESTA FILEIRA É UMA SEQUÊNCIA? — 24-09, com a migração da HRLT.
   *
   * `true` (o padrão) é o que este arquivo sempre foi: `<ol>`, seta ligando
   * cada item ao anterior, e a ordem AFIRMA alguma coisa — "Discover" vem antes
   * de "Embed" porque o trabalho acontece nessa ordem.
   *
   * `false` é uma LISTA de itens de igual peso com a mesma anatomia (disco,
   * ícone, título, descrição): os cinco eixos que a HRLT fortalece
   * (`capabilities`) não têm ordem, e numerá-los ou ligá-los por seta afirmaria
   * uma progressão que não existe.
   *
   * ⚠️ POR QUE UMA PROP E NÃO UM COMPONENTE NOVO. A régua deste projeto separa
   * peças quando elas diferem em SIGNIFICADO *e* em anatomia — é o argumento da
   * caixa acima sobre `SolutionPillars`, que é ícone nu com filetes e não disco
   * com descrição. Aqui as duas partilham tudo menos a seta e o elemento de
   * lista; um segundo arquivo seria a cópia que este repositório já apagou uma
   * vez, em 21-09, "esperando divergir na primeira vez que alguém ajustasse um
   * dos dois".
   *
   * ⚠️ O `<ul>`/`<ol>` MUDA JUNTO, e é a metade que se esquece: a seta é a marca
   * VISUAL da ordem e o `<ol>` é a marca para quem usa leitor de tela ("item 1
   * de 5"). Tirar só a seta deixaria a lista anunciando uma ordem que o desenho
   * não mostra.
   */
  sequence = true,
  /**
   * O DISCO VERMELHO COM O NÚMERO, sobre o disco do ícone — 24-09, com o layout
   * do Executive Coaching.
   *
   * ⚠️ ELE SAIU EM 24-09 E VOLTA AQUI COMO EXCEÇÃO, não como reversão. A daily
   * daquele dia mandou tirar a numeração *no Manager Development* (*"as setas
   * já mostram a progressão"*), e é por isso que o padrão é `false`. O layout do
   * Executive Coaching desenha os sete passos numerados — dois desenhos
   * diferentes para a mesma fileira, e o dado é que decide qual sai.
   *
   * ⚠️ SÓ FAZ SENTIDO COM `sequence`: numerar uma lista sem ordem afirmaria uma
   * progressão que não existe. A guarda está no `&&` do render.
   */
  numbered = false,
  /**
   * O GLIFO NU, EM TINTA, SEM O DISCO ROSA — 24-09, com o layout do Executive
   * Coaching, onde o número vermelho fica no canto de cima e o ícone escuro
   * logo abaixo dele. Só vale no arranjo `stacked`; o Family Business, que
   * também é numerado, continua com o disco.
   */
  plainIcons = false,
  /**
   * O fundo da faixa. `paper` (padrão) é o de sempre: a fileira continua o bloco
   * "How we work", que também é paper, sem emenda entre os dois.
   *
   * `white` existe para a fileira que pertence ao "What we do" — os
   * `capabilities` da HRLT dividem a faixa BRANCA com aquele bloco, pela mesma
   * razão que os cartões de público e as trilhas dividem: no desenho eles são
   * parte dele, não uma seção nova.
   */
  tone = "paper",
  label,
  headline,
  lead,
  flow,
  note,
  variant = "stacked",
}: {
  items?: ServiceStep[];
  sequence?: boolean;
  numbered?: boolean;
  plainIcons?: boolean;
  tone?: "paper" | "white";
  /**
   * O RÓTULO, A MANCHETE E A LINHA DE APOIO ACIMA DA FILEIRA — 24-09, com os
   * aceleradores do Talent Development.
   *
   * ⚠️ OS TRÊS NASCEM VAZIOS DE PROPÓSITO. Nas duas páginas que já usavam este
   * componente a fileira vem COLADA num `SolutionSection` que acabou de
   * escrever rótulo e manchete — dar cabeçalho próprio a ela ali escreveria a
   * segunda manchete do mesmo assunto a 40px da primeira. O caso novo é o
   * oposto: os aceleradores são faixa autônoma, sem bloco de duas colunas por
   * cima, e sem isto entrariam na página sem nada que os anuncie.
   */
  label?: string;
  headline?: string;
  lead?: string;
  /**
   * A FAIXA VERMELHA DO PÉ — a linha de fluxo que o layout desenha abaixo dos
   * sete passos: *"From business need → to talent bet → to readiness → to
   * measurable value."*
   *
   * ⚠️ NÃO É UM OITAVO PASSO, e é por isso que não entra em `items`: ela RESUME
   * a sequência inteira numa frase. Na lista, faria o leitor de tela anunciar
   * oito itens onde há sete etapas.
   */
  flow?: string;
  /**
   * A LINHA DE NOTA ABAIXO DA FILEIRA — 24-09, com o layout de Women’s
   * Leadership Development: *"Learning is deliberately connected to the real
   * roles, relationships, career moments and organisational systems women are
   * navigating every day."*
   *
   * ⚠️ NÃO É O `flow`, e os dois não se substituem. Aquele é um campo VERMELHO
   * CHEIO que resume uma sequência numa frase com setas; esta é uma nota de
   * rodapé em corpo pequeno, atrás de um filete vermelho, que qualifica a
   * fileira inteira. Postos na mesma peça, a página teria dois fechos para a
   * mesma lista.
   */
  note?: string;
  /**
   * COMO CADA ITEM SE ARRUMA DENTRO DA CÉLULA — 24-09, a pedido, com os
   * aceleradores do Talent Development: *"pode deixar mais parecido com o
   * layout com os icones a esquerda e o titulo e texto a [direita], com uma
   * linha dividindo cada um"*.
   *
   * `stacked` (o padrão) é o que este arquivo sempre foi: disco do ícone no
   * topo, título e descrição embaixo, tudo centrado. É o desenho dos passos de
   * "How we work" e dos eixos da HRLT, e não muda.
   *
   * `aside` é o dos quatro aceleradores: o glifo à ESQUERDA, o título e a
   * descrição à direita dele, alinhados à esquerda, e um filete vertical entre
   * uma célula e a seguinte.
   *
   * ⚠️ POR QUE UMA PROP E NÃO UM COMPONENTE NOVO: a régua deste projeto separa
   * peças quando elas diferem em SIGNIFICADO *e* em anatomia. Aqui o
   * significado é o mesmo (uma lista de itens de igual peso, com ícone, título
   * e descrição) e as partes são as mesmas — muda o eixo em que elas se
   * empilham. É o mesmo argumento da prop `sequence`, logo acima.
   *
   * ⚠️ O DISCO ROSA SAI NO `aside`, e é leitura do layout, não economia: ali o
   * glifo é desenhado NU, maior, encostado no filete da esquerda. Com disco,
   * uma fileira de quatro células estreitas ficaria com quatro bolas rosa
   * disputando com o título vermelho ao lado.
   *
   * ⚠️ `aside` NÃO COMBINA COM `sequence`: a seta que liga um passo ao seguinte
   * é `absolute` sobre a borda esquerda da célula, que é exatamente onde o
   * filete e o ícone passam a morar. Hoje nenhum serviço pede os dois; se um
   * pedir, a seta é que tem de mudar de lugar.
   */
  variant?: "stacked" | "aside";
}) {
  const steps = (items ?? []).filter((s) => s.title.trim());
  if (steps.length === 0) return null;

  const List = sequence ? "ol" : "ul";
  const aside = variant === "aside";

  return (
    /* `bg-paper`, como a fileira de pilares: a faixa quente começa no rótulo
       "How we work" e só termina depois desta lista, sem emenda entre as duas.
       É o que o layout mostra. Ver a prop `tone` para a exceção. */
    <section className={tone === "white" ? "bg-white" : "bg-paper"}>
      <Reveal
        className={`mx-auto max-w-[1440px] px-6 pb-20 md:px-10 md:pb-24 ${
          /* O TOPO SÓ EXISTE COM CABEÇALHO: sem ele a faixa continua sendo o
             pé do bloco de duas colunas acima, e um `pt` abriria um buraco
             entre o parágrafo e os ícones. */
          label || headline || lead ? "pt-20 md:pt-24" : ""
        }`}
      >
        {label?.trim() ? (
          <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
            {label}
          </p>
        ) : null}
        {headline?.trim() ? (
          /* `h2` e `whitespace-pre-line` pela mesma conta do `SolutionSection`:
             a quebra da manchete é do desenho, escrita no dado. */
          <h2
            className={`whitespace-pre-line font-serif text-[26px] font-semibold leading-[1.15] tracking-[-0.3px] text-ink md:text-[32px] ${
              label?.trim() ? "mt-6" : ""
            }`}
          >
            {headline}
          </h2>
        ) : null}
        {lead?.trim() ? (
          <p className="mt-4 max-w-[62ch] font-serif text-[16px] leading-[1.6] text-muted md:text-[18px]">
            {lead}
          </p>
        ) : null}

        {/* ⚠️ DUAS GRADES, E A DIFERENÇA NÃO É SÓ O NÚMERO DE COLUNAS — ver a
            prop `variant`. No `aside` cada célula tem um bloco de texto ao lado
            do ícone, então ela precisa de MUITO mais largura: `minmax(150px…)`
            poria quatro aceleradores em quatro colunas de 150px com o título
            vermelho quebrando em três linhas. Daí o piso de 280px, que a 1440
            dá as quatro numa fileira e a 1024 as põe em duas.

            ⚠️ OS FILETES SÓ EXISTEM A PARTIR DE `lg`, e andam com `lg:gap-x-0`:
            é a mesma dupla do `SolutionPillars`, pelas mesmas duas razões — com
            calha o traço nasce colado na borda de um dos itens em vez de ficar
            no meio, e em grade de duas linhas a borda esquerda desenha um
            filete órfão no começo da linha de baixo. */}
        <List
          className={`grid gap-y-12 ${
            aside
              ? "grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lg:gap-x-0 lg:divide-x lg:divide-line"
              : "grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] lg:gap-x-0"
          } ${label || headline || lead ? "mt-14" : ""}`}
        >
          {steps.map((step, i) => {
            const Icon = step.icon ? STEP_ICONS[step.icon] : undefined;
            return (
              <li
                key={`${step.title}-${i}`}
                className={
                  aside
                    ? "relative flex items-start gap-4 text-left lg:px-7"
                    : "relative text-center lg:px-4"
                }
              >
                {/* A SETA LIGA ESTE PASSO AO ANTERIOR, então não existe no
                    primeiro.

                    ⚠️ `top-7` E NÃO `top-1/2`: ela se alinha ao CENTRO do disco
                    do ícone, que mede 56px e começa no topo da célula — 28px é
                    a metade dele. Centrada na CÉLULA a seta desceria para o
                    meio da descrição, e como as descrições têm uma, duas ou
                    três linhas, as cinco setas sairiam em alturas diferentes.

                    ⚠️ ERA `top-9` ATÉ O NUMERAL SAIR, em 24-09: o disco do
                    ícone começava 8px abaixo, empurrado pelo disco do número.
                    Tirar o numeral sem mexer aqui deixaria as setas 8px baixas
                    — a conta anda junto com a altura do que está acima. */}
                {/* ⚠️ `sequence &&` — ver a prop. Sem ordem a afirmar, a seta
                    sai junto com o `<ol>`: as duas são a mesma marcação da
                    progressão, uma para o olho e outra para o leitor de tela. */}
                {sequence && i > 0 ? (
                  <ArrowRight
                    aria-hidden
                    size={20}
                    strokeWidth={2}
                    className="absolute left-0 top-7 hidden -translate-x-1/2 -translate-y-1/2 text-brand lg:block"
                  />
                ) : null}

                {/* ⚠️ O `relative` SAIU COM O NUMERAL: ele existia só para
                    ancorar o disco do número, que era `absolute`. A seta, que
                    também é `absolute`, se ancora no `<li>` e não aqui. */}
                {/* ⬅ O GLIFO NU DO `aside` — ver a prop `variant`. `mt-1`
                    porque ele se alinha à PRIMEIRA LINHA do título ao lado, e
                    não ao topo da caixa: sem isso, um título de duas linhas
                    deixaria o ícone visivelmente alto. `shrink-0` porque o
                    bloco de texto ao lado é quem deve ceder largura. */}
                {aside ? (
                  Icon ? (
                    <Icon
                      aria-hidden
                      size={40}
                      strokeWidth={1.25}
                      className="mt-1 shrink-0 text-brand"
                    />
                  ) : null
                ) : (
                <div className="relative mx-auto h-14 w-14">
                  {/* ⚠️ `aria-hidden`: o `<ol>` já diz a ordem, e anunciá-la de
                      novo faria o leitor de tela ler "1, item 1 de 7". O disco
                      MORDE o do ícone (`-left-1 -top-1`) em vez de ficar acima
                      dele, que é o que o layout desenha — e é o que mantém a
                      seta em `top-7`, alinhada ao centro do ícone. */}
                  {sequence && numbered ? (
                    <span
                      aria-hidden
                      className={`absolute z-10 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-[12px] font-semibold leading-none text-white ${
                        plainIcons ? "-left-3 -top-3" : "-left-1 -top-1"
                      }`}
                    >
                      {i + 1}
                    </span>
                  ) : null}
                  {/* O DISCO DO ÍCONE é rosa muito claro (`brand/10`) com o
                      glifo em `brand`. No layout ele é um círculo de fundo
                      lavado — o mesmo recurso do visto das trilhas, invertido:
                      lá o disco é cheio e o glifo é branco. */}
                  {plainIcons ? (
                    <span className="flex h-14 w-14 items-center justify-center">
                      {Icon ? (
                        <Icon aria-hidden size={36} strokeWidth={1.5} className="text-ink" />
                      ) : null}
                    </span>
                  ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
                    {Icon ? (
                      <Icon aria-hidden size={26} strokeWidth={1.5} className="text-brand" />
                    ) : null}
                  </span>
                  )}
                </div>
                )}

                {/* ⚠️ O TÍTULO TROCA DE TRATAMENTO NO `aside`, e é leitura do
                    layout: lá ele é VERMELHO EM CAIXA ALTA, e não o texto
                    escuro dos passos. A caixa alta é do desenho e mora aqui,
                    não no dado — em `lib/services.ts` os quatro estão escritos
                    "Grit", "Impact & Identity"…, que é como se lê e como o
                    editor de copy os mostra. `uppercase` no CSS mantém as duas
                    coisas verdadeiras ao mesmo tempo.

                    ⚠️ E O BLOCO INTEIRO É `min-w-0`: sem isso, uma palavra
                    longa numa célula de grade estreita transborda a coluna em
                    vez de quebrar. */}
                <div className={aside ? "min-w-0" : ""}>
                  <p
                    className={
                      aside
                        ? "text-[13px] font-semibold uppercase leading-[1.3] tracking-[0.8px] text-brand md:text-[14px]"
                        : "mt-4 text-[14px] font-semibold leading-[1.3] text-ink md:text-[15px]"
                    }
                  >
                    {step.title}
                  </p>
                  {step.body && (
                    <p
                      className={
                        aside
                          ? "mt-3 font-serif text-[13px] leading-[1.5] text-ink/70 md:text-[14px]"
                          : "mx-auto mt-2 max-w-[22ch] font-serif text-[13px] leading-[1.4] text-ink/70 md:text-[14px]"
                      }
                    >
                      {step.body}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </List>

        {/* ⬅ A FAIXA DE FLUXO — ver a prop `flow`.

            ⚠️ AS SETAS SÃO TEXTO AQUI, e não o glifo do lucide que liga os
            passos logo acima. Não é descuido nem inconsistência: lá a seta é um
            ELEMENTO GRÁFICO entre duas células de uma grade, e é `aria-hidden`
            porque o `<ol>` já diz a ordem. Aqui ela está DENTRO de uma frase
            corrida escrita no dado — "from business need → to talent bet" é uma
            frase só, e partir a string para injetar um ícone entre os pedaços
            faria o leitor de tela ler quatro fragmentos soltos.

            O CAMPO É VERMELHO CHEIO e a página só tem outro no CTA. É o que o
            layout mostra, e funciona porque a faixa é uma LINHA: um campo de
            cor de uma linha não disputa com o clímax de cor do pé da página,
            marca o fim da sequência. */}
        {/* ⚠️ A FAIXA É UMA SETA, e não um retângulo — 24-09, a pedido: *"o
            vermelho é uma seta apontando pra direita"*. No layout ela termina
            em PONTA, como uma flâmula: o campo vermelho é a própria seta, e é
            isso que faz a sequência "terminar" à direita em vez de só acabar.

            ⚠️ É `clip-path` E NÃO UM TRIÂNGULO EM `::after`, porque a ponta
            precisa acompanhar a ALTURA da faixa — no telefone a frase quebra em
            duas linhas e um triângulo de altura fixa deixaria um degrau na
            emenda. Com o recorte, a ponta é sempre metade da altura, qualquer
            que ela seja.

            ⚠️ O `pr` EXTRA É PARTE DA MESMA CONTA: o recorte come 28px da
            direita, e sem folga a última palavra ficaria por baixo da ponta.
            O texto fica centrado no RETÂNGULO, que é onde o layout o põe.

            ⚠️ A PONTA É DECORATIVA e não é anunciada: quem usa leitor de tela
            recebe a frase, que já traz as setas escritas no dado. */}
        {flow?.trim() ? (
          <p className="mt-12 bg-brand px-6 py-4 pr-12 text-center text-[15px] font-medium leading-[1.4] text-white [clip-path:polygon(0_0,calc(100%-28px)_0,100%_50%,calc(100%-28px)_100%,0_100%)] md:text-[17px]">
            {flow}
          </p>
        ) : null}

        {/* ⬅ A NOTA DE RODAPÉ — ver a prop `note`. Filete vermelho à esquerda,
            corpo pequeno, largura de leitura: no layout ela fecha a fileira sem
            competir com ela. */}
        {note?.trim() ? (
          <p className="mt-12 max-w-[80ch] border-l-2 border-brand pl-5 font-serif text-[15px] leading-[1.6] text-muted md:text-[16px]">
            {note}
          </p>
        ) : null}
      </Reveal>
    </section>
  );
}
