import { BarChart3, Users, type LucideIcon } from "lucide-react";
import { pillarIcon } from "@/components/solutions/SolutionPillars";
import Reveal from "@/components/Reveal";
import type { ServiceTwoSystems, ServiceSystemItem } from "@/lib/services";

/**
 * "TWO SYSTEMS. ONE FUTURE." — a faixa de abertura do layout de Family Business
 * Consulting (24-09).
 *
 * O desenho tem três colunas: o painel VERMELHO da família à esquerda, o painel
 * ESCURO do negócio à direita e, entre os dois, o diagrama de Venn com o fecho
 * em caixa alta. Sob cada painel, uma fileira de ícones com rótulo e uma linha
 * (cinco à esquerda, seis à direita).
 *
 * ⚠️ NÃO É O `SolutionPillars` COM CABEÇALHO. Aquela fileira é uma lista de
 * palavras soltas sob o bloco "How we work"; aqui cada item tem rótulo E
 * descrição, e as duas fileiras existem para serem COMPARADAS entre si — é o
 * que o Venn no meio afirma. Achatar as duas numa fileira só perderia a
 * oposição, que é o argumento inteiro da faixa.
 *
 * ⚠️ O AZUL-ESCURO DO PAINEL "THE BUSINESS" VIROU `ink`. O layout usa um
 * azul-marinho que não existe no sistema de cor do site (só há `brand`,
 * `brand-light`, `ink`, `ink-2`, `paper`, `line`, `muted`), e cravar o hex do
 * arquivo criaria uma cor nova que nenhuma outra página tem. O contraste que o
 * desenho procura — campo quente contra campo frio — sobrevive em `ink`.
 *
 * ⚠️ OS ÍCONES DOS ITENS VÊM DO MAPA DE `SolutionPillars`, via `pillarIcon`,
 * casando pelo RÓTULO EXATO. É a mesma regra de `SolutionInflectionPoints`:
 * aquele mapa é a busca única do site, e um segundo mapa aqui seria o começo de
 * "o mesmo conceito com dois glifos em páginas diferentes". Rótulo sem linha no
 * mapa cai no círculo de fallback, que é o aviso visual de que faltou.
 */
const PANEL_ICONS: Record<string, LucideIcon> = {
  /* Chaves genéricas, como nos mapas de `SolutionSteps` e `SolutionProof`: o
     dado diz qual glifo quer. São os dois do layout — o grupo de pessoas no
     painel da família, as barras no painel do negócio. */
  people: Users,
  chart: BarChart3,
};

/** A fileira de itens de um painel. */
function SystemItems({ items }: { items: ServiceSystemItem[] }) {
  return (
    /* ⚠️ TRÊS POR LINHA NO DESKTOP, e não os cinco/seis numa fileira só do
       desenho: ao lado do Venn cada painel tem ~500px, e seis itens nisso
       davam ~85px por rótulo — espremido, e o `auto-fit` ainda deixava um
       órfão na segunda linha. 3+2 e 3+3 mantêm as duas fileiras com a mesma
       anatomia. O filete é `border-l` fora do primeiro de cada linha, porque
       o `divide-x` riscaria também a borda esquerda da segunda linha. */
    <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:gap-x-0 lg:gap-y-10">
      {items.map((item) => {
        const Icon = pillarIcon(item.label);
        return (
          <li
            key={item.label}
            className="text-center lg:border-l lg:border-line lg:px-4 lg:[&:nth-child(3n+1)]:border-l-0"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
              {/* DECORATIVO: o rótulo logo abaixo diz a mesma coisa. */}
              <Icon aria-hidden size={22} strokeWidth={1.5} className="text-brand" />
            </span>
            <p className="mt-3 text-[13px] font-semibold leading-[1.25] text-ink md:text-[14px]">
              {item.label}
            </p>
            {item.body ? (
              <p className="mt-2 font-serif text-[12px] leading-[1.45] text-ink/70 md:text-[13px]">
                {item.body}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

/** Um painel: a barra de cor com título e linha de apoio, o corpo, a fileira. */
function SystemPanel({
  tone,
  title,
  lead,
  body,
  icon,
  items,
}: {
  tone: "brand" | "ink";
  title: string;
  lead: string;
  body: string;
  icon?: string;
  items: ServiceSystemItem[];
}) {
  const Icon = icon ? PANEL_ICONS[icon] : undefined;
  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center gap-4 px-6 py-4 text-white md:gap-5 md:px-7 ${
          tone === "brand" ? "bg-brand" : "bg-ink"
        }`}
      >
        {Icon ? (
          <Icon aria-hidden size={34} strokeWidth={1.5} className="shrink-0" />
        ) : null}
        <div>
          {/* `h3` sob o `h2` do rótulo da faixa, mantendo a escada de
              cabeçalhos — mesma regra dos cartões de público. */}
          <h3 className="text-[19px] font-semibold uppercase leading-[1.15] tracking-[0.4px] md:text-[22px]">
            {title}
          </h3>
          <p className="mt-1 font-serif text-[14px] leading-[1.35] text-white/85 md:text-[15px]">
            {lead}
          </p>
        </div>
      </div>

      <p className="mt-6 font-serif text-[15px] leading-[1.6] text-ink md:text-[16px]">
        {body}
      </p>

      <div className="mt-8">
        <SystemItems items={items} />
      </div>
    </div>
  );
}

/**
 * O DIAGRAMA DE VENN — dois círculos sobrepostos, o da família em `brand` e o do
 * negócio em `ink`, com a lente hachurada.
 *
 * ⚠️ SVG INLINE E NÃO IMAGEM, de propósito: o conteúdo dos dois círculos é
 * TEXTO da cliente ("VALUES RELATIONSHIPS LEGACY"), e num PNG ele deixaria de
 * ser legível, traduzível e editável. É o mesmo argumento que manteve o
 * lettering fora do herói do Talent Development.
 */
function SystemVenn({ venn }: { venn: ServiceTwoSystems["venn"] }) {
  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 320 180"
        role="img"
        aria-label={`${venn.leftTitle}: ${venn.leftWords.join(", ")}. ${venn.rightTitle}: ${venn.rightWords.join(", ")}.`}
        className="h-auto w-full max-w-[320px]"
      >
        <defs>
          <pattern
            id="two-systems-hatch"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="6"
              strokeWidth="2.4"
              className="stroke-brand"
            />
          </pattern>
          {/* A LENTE é a interseção: o círculo da esquerda recortado pelo da
              direita. */}
          <clipPath id="two-systems-lens">
            <circle cx="196" cy="90" r="78" />
          </clipPath>
        </defs>

        <circle cx="124" cy="90" r="78" className="fill-brand" />
        <circle cx="196" cy="90" r="78" className="fill-ink" />
        <g clipPath="url(#two-systems-lens)">
          <circle cx="124" cy="90" r="78" className="fill-white" />
          <circle cx="124" cy="90" r="78" fill="url(#two-systems-hatch)" />
        </g>

        {/* O texto é `aria-hidden` porque o `aria-label` do `<svg>` já o lê por
            inteiro — sem isso, o leitor de tela anunciaria as sete palavras
            duas vezes. */}
        {/* `uppercase` no grupo: o dado guarda a copy em caixa natural, como
            todos os outros rótulos do site, e a caixa alta é do desenho. */}
        <g aria-hidden fill="#fff" textAnchor="middle" className="uppercase">
          <text x="92" y="76" fontSize="13" fontWeight="600" letterSpacing="0.6">
            {venn.leftTitle}
          </text>
          {venn.leftWords.map((word, i) => (
            <text key={word} x="92" y={94 + i * 13} fontSize="9" letterSpacing="0.4">
              {word}
            </text>
          ))}
          <text x="228" y="76" fontSize="13" fontWeight="600" letterSpacing="0.6">
            {venn.rightTitle}
          </text>
          {venn.rightWords.map((word, i) => (
            <text key={word} x="228" y={94 + i * 13} fontSize="9" letterSpacing="0.4">
              {word}
            </text>
          ))}
        </g>
      </svg>

      {/* O fio curto que liga o diagrama ao fecho — é o que o layout desenha. */}
      <span aria-hidden className="mt-6 block h-8 w-px bg-line" />
      <p className="mt-6 text-center text-[15px] font-semibold uppercase leading-[1.4] tracking-[0.4px] text-ink md:text-[16px]">
        {venn.note}
      </p>
      <span aria-hidden className="mt-5 block h-0.5 w-9 bg-brand" />
    </div>
  );
}

export default function SolutionTwoSystems({
  item,
}: {
  item?: ServiceTwoSystems;
}) {
  if (!item) return null;
  const family = item.family.items.filter((i) => i.label.trim());
  const business = item.business.items.filter((i) => i.label.trim());
  if (family.length === 0 && business.length === 0) return null;

  return (
    /* ⚠️ PADDING NO TOPO desde 24-09: o "What we do" saiu da página a pedido
       (`hideWhatWeDo`) e esta faixa encosta direto no herói de sangria total. */
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
        {item.label?.trim() ? (
          <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
            {item.label}
          </p>
        ) : null}

        {/* O VENN É A COLUNA DO MEIO, e ela tem largura fixa porque o diagrama
            tem medida própria — dar-lhe uma fração da grade faria os dois
            círculos encolherem junto com a janela até a copy dentro deles
            deixar de ser legível. 260px e não os 320 do desenho, para sobrar
            largura aos ícones dos painéis. Abaixo de `lg` as três colunas
            empilham na ordem família → venn → negócio, que é a ordem de
            leitura do desenho. */}
        <Reveal
          className={`grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_260px_minmax(0,1fr)] lg:gap-8 xl:gap-10 ${
            item.label?.trim() ? "mt-10" : ""
          }`}
        >
          <SystemPanel
            tone="brand"
            title={item.family.title}
            lead={item.family.lead}
            body={item.family.body}
            icon={item.family.icon}
            items={family}
          />

          {/* `lg:pt-16` alinha o diagrama ao CORPO dos painéis, e não ao topo
              deles: as barras de cor dos dois lados têm altura própria, e o
              Venn centrado na coluna inteira nasceria acima delas. */}
          <div className="lg:pt-16">
            <SystemVenn venn={item.venn} />
          </div>

          <SystemPanel
            tone="ink"
            title={item.business.title}
            lead={item.business.lead}
            body={item.business.body}
            icon={item.business.icon}
            items={business}
          />
        </Reveal>
      </div>
    </section>
  );
}
