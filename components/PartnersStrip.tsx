/**
 * A FAIXA DAS MARCAS PARCEIRAS — uma só para o site inteiro.
 *
 * ⚠️ POR QUE ELE EXISTE (21-09). O bloco nasceu dentro de
 * `app/services/page.tsx` e a cliente pediu que a home passasse a mostrar o
 * mesmo desenho: *"Have similar layout to in partnership with as services
 * page"*, e na anotação da mesma call — *"a seção de parceiros tem que ser
 * igual a seção da listagem de serviços"*. "Igual" feito por cópia dura um
 * commit: a primeira correção de marca sai num lado só e as duas telas
 * divergem em silêncio. Então a lista, as alturas e o arranjo das fileiras
 * vivem AQUI, e as duas páginas montam o mesmo componente.
 *
 * COMO CADA TELA USA:
 *   • `/services` — dentro da seção escura de Partners, que já tem rótulo
 *     (`TypeLabel`) e `h2` próprios. Vai sem `label` e no tom `dark`, direto
 *     sobre o `bg-ink` da seção.
 *   • home — o bloco é introduzido pela linha "In partnership with" e mora
 *     numa seção branca, então vai com `label` e no tom `light`.
 *
 * ⏳ A LISTA AINDA É CÓDIGO. O outline pede que as duas telas leiam "from one
 * CMS partner collection so the two pages cannot drift" — isso depende do tipo
 * `partnership` no CMS e da migração 0007. Enquanto ela não roda, este arquivo
 * é a fonte única; quando rodar, é ele que passa a buscar, e as páginas não
 * mudam.
 */

type PartnerLogo = {
  src: string;
  alt: string;
  /**
   * A ALTURA É POR MARCA e vive junto do arquivo a que se refere, em vez de
   * solta no JSX: são pares arquivo+altura, e separá-los é como um deles passa
   * a apontar para a altura do vizinho na primeira reordenação.
   *
   * Altura própria, e não uma altura comum como no mural de clientes: lá são 27
   * logotipos-palavra de proporção parecida, e altura igual é o que os faz pesar
   * igual. Aqui convivem logotipo-palavra muito largo (Explore Performance,
   * 5,5:1) e BRASÃO quase quadrado (Imperial, 0,9:1) — na mesma altura o
   * primeiro fica seis vezes mais largo que o segundo e o brasão some.
   */
  className: string;
  /**
   * Versão que lê em cartão branco. A de `src` é a reversa, branca, feita para
   * o fundo escuro da /services. `invert` pinta de preto um wordmark branco
   * (CLO100, YPO) — o arquivo colorido desses dois não existe aqui.
   */
  onLight?: { src: string; className: string; invert?: boolean };
};

/**
 * AS CINCO MARCAS, EM DUAS FILEIRAS FIXAS — pedido de 21-09: *"Partners - HBI
 * and Imperial college on row 1"*, e na anotação *"dois logos pra cima harvard
 * e imperial college e os outros pra baixo"*.
 *
 * ⚠️ A QUEBRA É ESTRUTURAL, E NÃO `flex-wrap`. Antes as cinco eram um `ul` só
 * com quebra por largura: dava 3 + 2 na coluna da /services por acidente da
 * medida, e qualquer mudança de largura reembaralhava quem ficava em cima. O
 * pedido nomeia QUEM vai na fileira 1, então são duas listas de verdade. Dentro
 * de cada fileira o `flex-wrap` continua — no telefone elas empilham como
 * couber, que é o que se espera; o que a estrutura garante é que HBI e Imperial
 * nunca dividam linha com as outras três.
 *
 * Os arquivos em `public/logos/partners/` são DERIVADOS dos que a cliente
 * mandou na pasta `4. Services` do Drive. Três das cinco precisaram ser tratadas
 * para viver sobre fundo escuro, e isso fica anotado porque é alteração de marca
 * de terceiro:
 *   • HARVARD BUSINESS IMPACT veio SEM canal alfa — PNG de fundo branco com o
 *     escudo em traço preto. Sobre escuro seria um retângulo branco. O branco
 *     virou transparência e o traço preto virou branco: é a versão reversa da
 *     marca monocromática.
 *   • EXPLORE PERFORMANCE tem alfa, mas a tinta é cinza-escuro (luminância 56 de
 *     255) e some no escuro. Foi para branco inteiro — PERDE O AZUL do símbolo,
 *     que é o custo real desta escolha.
 *   • IMPERIAL COLLEGE tinha um fundo branco chapado por baixo do brasão. Só a
 *     chave de branco foi tirada; o brasão continua COLORIDO, porque brasão
 *     heráldico não tem versão reversa que preste — e colorido ele lê bem sobre
 *     escuro.
 *
 * ⏳ O IDEAL É PEDIR OS ARQUIVOS OFICIAIS EM VERSÃO REVERSA a cada marca. O que
 * está aqui é derivado por nós, e versão reversa de marca de terceiro
 * normalmente passa pelo dono dela. A PROCEDÊNCIA IMPORTA MAIS QUE O ARQUIVO:
 * estes vieram DA CLIENTE, na pasta que ela mesma montou, ou seja o aceite de
 * uso é dela. Quem trocar por um arquivo "melhor" achado na internet perde isso.
 *
 * ⏳ SÃO CINCO E ELA FALOU EM SEIS. A pasta do Drive tem estes cinco; o sexto
 * não chegou.
 */
const PARTNER_ROWS: PartnerLogo[][] = [
  /* ⚠️ A FILEIRA 1 CRESCEU UM DEGRAU (50/58 → 56/68). As duas alturas antigas
     foram calibradas para os brasões conviverem NUMA FILEIRA com três
     logotipos-palavra, onde crescer demais era dominar os vizinhos. Sozinhos na
     fileira, o problema se inverte: a 58px os dois brasões somam ~146px de
     largura contra ~495px da fileira de baixo, e a fileira que a cliente pediu
     para PROMOVER leria como duas estampinhas em cima de um bloco largo. Nos
     56/68 eles ganham a massa que a posição pede sem estourar a coluna. */
  [
    {
      src: "/logos/partners/harvard-business-impact.png",
      alt: "Harvard Business Impact",
      className: "h-[56px] md:h-[68px]",
      onLight: { src: "/logos/harvard_business_impact.png", className: "h-[88px] md:h-[104px]" },
    },
    {
      src: "/logos/partners/imperial-college-london.png",
      alt: "Imperial College London",
      className: "h-[56px] md:h-[68px]",
      onLight: { src: "/logos/partners/imperial-college-london.png", className: "h-[88px] md:h-[104px]" },
    },
  ],
  [
    {
      src: "/logos/partners/clo100.png",
      alt: "CLO100",
      className: "h-[34px] md:h-[40px]",
      onLight: { src: "/logos/partners/clo100.png", className: "h-[36px] md:h-[42px]", invert: true },
    },
    {
      src: "/logos/partners/ypo.png",
      alt: "YPO",
      className: "h-[34px] md:h-[40px]",
      onLight: { src: "/logos/partners/ypo.png", className: "h-[44px] md:h-[52px]", invert: true },
    },
    {
      src: "/logos/partners/explore-performance.png",
      alt: "Explore Performance",
      className: "h-[26px] md:h-[30px]",
      onLight: { src: "/logos/explore_performance.png", className: "h-[64px] md:h-[72px]" },
    },
  ],
];

export default function PartnersStrip({
  label,
  tone = "dark",
  className = "",
  headingId,
}: {
  /**
   * A linha que introduz o bloco, se a tela não a tiver em volta. A home abre
   * com *"In partnership with"*; a /services vive numa seção que já tem
   * `TypeLabel` e `h2`, e ali um rótulo aqui seria um terceiro cabeçalho.
   */
  label?: string;
  /**
   * A COR DO FUNDO EM QUE A FAIXA FOI COLADA — e não uma escolha de estilo.
   * Três das cinco marcas só existem em BRANCO (ver a caixa de `PARTNER_ROWS`),
   * então em `light` elas não podem simplesmente pousar na seção clara: seriam
   * marcas invisíveis. O tom claro devolve o PAINEL CONTIDO ESCURO que a
   * /services usou entre 17-09 e 18-09 — *"pode deixar eles claros e colocar o
   * fundo da parte dos logos escuro pra dar visibilidade nos logos"*. Em `dark`
   * o painel não existe: a seção já é escura e os logos ficam direto sobre ela,
   * num tom só, que foi o pedido de 18-09 (*"tirar a cor de fundo dos logos"*).
   *
   * `featured` É SÓ A HOME, desde 23-09. O painel escuro saiu: a faixa virou
   * seção própria e cada marca senta num cartão branco. Harvard e Explore usam
   * o arquivo colorido de `/logos`; CLO100 e YPO continuam no wordmark branco,
   * pintado de preto. A /services não usa este tom.
   */
  tone?: "dark" | "light" | "featured";
  /** id do h2, para a seção da home apontar `aria-labelledby`. */
  headingId?: string;
  /** Espaçamento e divisa que pertencem à PÁGINA, não à faixa (a home a separa
   *  do que vem acima com `border-t`; a /services não). */
  className?: string;
}) {
  const onLight = tone === "light";
  const featured = tone === "featured";

  return (
    <div className={className}>
      {label && featured ? (
        <div>
          <span className="mb-5 block h-[3px] w-9 bg-brand" />
          <h2
            id={headingId}
            className="max-w-[16ch] font-serif text-[32px] font-medium leading-[1.15] text-ink md:text-[40px]"
          >
            {label}
          </h2>
        </div>
      ) : label ? (
        <span
          className={`block text-[12px] font-semibold uppercase tracking-[2px] ${
            onLight ? "text-muted" : "text-white/70"
          }`}
        >
          {label}
        </span>
      ) : null}

      {/* O PAINEL É O QUE MUDA ENTRE OS DOIS TONS, e só ele: mesmas fileiras,
          mesmas alturas, mesmos arquivos. */}
      <div
        className={[
          featured ? "mt-10 flex flex-col gap-5" : "flex flex-col items-center gap-y-8",
          !featured && label ? "mt-8" : "",
          /* `rounded-xl` porque é o raio que o resto do site usa; um valor novo
             aqui seria um canto que não combina com nenhum outro cartão. */
          onLight ? "rounded-xl bg-ink px-8 py-10" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* eslint-disable @next/next/no-img-element */}
        {PARTNER_ROWS.map((row) => (
          <ul
            key={row[0].src}
            className={
              featured
                ? `grid grid-cols-1 gap-5 ${row.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`
                : "flex flex-wrap items-center justify-center gap-x-10 gap-y-8"
            }
          >
            {row.map((l) => {
              const art = featured && l.onLight ? l.onLight : { src: l.src, className: l.className, invert: false };
              return (
                <li
                  key={l.src}
                  className={
                    featured
                      ? "flex min-h-[148px] items-center justify-center rounded-xl border border-line bg-white px-8 py-8"
                      : undefined
                  }
                >
                  {/* SEM `next/image`, mesmo critério do mural de clientes: são
                      PNG com transparência servidos a 180px de altura de arquivo
                      contra 26–68px de exibição, ou seja já há ~2,6x de folga para
                      tela densa. O `/_next/image` não tem o que otimizar num logo
                      de 20KB — só acrescentaria uma requisição de transformação. */}
                  <img
                    src={art.src}
                    alt={l.alt}
                    className={`w-auto ${art.className}${art.invert ? " brightness-0" : ""}`}
                  />
                </li>
              );
            })}
          </ul>
        ))}
        {/* eslint-enable @next/next/no-img-element */}
      </div>
    </div>
  );
}
