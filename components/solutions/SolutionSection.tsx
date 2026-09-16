import Image, { type StaticImageData } from "next/image";
import RichText from "@/components/RichText";
import Reveal from "@/components/Reveal";

/**
 * Um bloco de conteúdo do template de serviço: rótulo, título e texto de um
 * lado, imagem do outro — e a imagem SANGRA para fora da tela.
 *
 * DE ONDE VEM O TRATAMENTO. Da Explore Performance
 * (`/what-we-do/charting-your-future/`), que a Rhea aprovou como referência e o
 * cliente usa como régua. Lá a página inteira é feita de blocos assim,
 * alternando o lado da imagem a cada seção. Três coisas fazem o trabalho:
 *
 *   1. A IMAGEM NUNCA É UM RETÂNGULO CONTIDO. Ela é cortada pela borda da
 *      janela, não por um container. É o que dá o ritmo — sem isso a página
 *      vira uma pilha de cards.
 *   2. O LADO ALTERNA. Imagem à esquerda num bloco, à direita no seguinte.
 *   3. O TEXTO OCUPA MEIA TELA, com medida curta. Não é coluna centrada.
 *
 * ⚠️ O OUTLINE DE SERVICES NÃO DEU DIREÇÃO VISUAL. A seção 3.2 fixa os seis
 * blocos e a ordem deles, e é só isso: das três pastas que a Maliha mandou em
 * 09-09, Services é a única sem uma imagem sequer — Approach veio com mockup de
 * página inteira, Team veio com retratos. Então a ordem é dela e o desenho é
 * nosso, o que também quer dizer que isto aqui ainda não foi visto por ela.
 *
 * ⚠️ HOJE O PAINEL NÃO TEM FOTO NENHUMA, e isso é decisão de 12-09: ele é um
 * campo de cor com o nome do bloco em corpo grande. Não existe fotografia por
 * serviço, e o material que existe (`docs/Content.zip`, lote de 11/06) é quase
 * todo em sede de cliente com a marca deles na parede — usar aquilo como
 * ilustração genérica insinuaria uma relação que a foto não prova, além de
 * expor cliente sem consentimento. O herói usa a única foto do lote sem marca
 * visível. Passar `image` é a única edição quando material próprio chegar.
 */
export default function SolutionSection({
  label,
  html,
  side,
  tone = "white",
  image,
  imageAlt = "",
  imagePosition = "object-center",
  panelTone = "ink",
}: {
  label: string;
  html: string;
  /** Lado da IMAGEM. O texto vai para o lado oposto. */
  side: "left" | "right";
  tone?: "white" | "paper";
  /**
   * A foto do bloco. Sem ela, cai no slot tracejado.
   *
   * ⚠️ AS QUE ESTÃO EM USO SÃO DE EXEMPLO, não escolha editorial: saíram do
   * acervo `public/dna-time/`, que é material próprio da CDNA já publicado no
   * site (o PhotoCarousel usa o mesmo lote). Vale registrar o que foi
   * DESCARTADO e por quê, porque a mesma armadilha vai reaparecer quando
   * alguém for trocar estas: quase todo o acervo tem marca de terceiro à vista
   * — Frasers Property e ShenMei nas paredes do lote de 11/06, IMD nos cordões
   * e no prédio, YPO chapado como faixa na própria imagem. Usar aquilo como
   * ilustração genérica insinua uma relação que a foto não prova.
   */
  image?: StaticImageData;
  /** Vazio quando a foto é decorativa — o texto ao lado já diz o que ela mostra. */
  imageAlt?: string;
  /**
   * `object-position` do painel, em classe do Tailwind.
   *
   * EXISTE PORQUE O PAINEL É ALTO E ESTREITO: 44% de largura por uma tela de
   * altura é um retrato, e `object-cover` sobre um arquivo apaisado joga fora
   * as laterais. Onde a imagem é recortada deixa de ser detalhe — com o padrão
   * `object-center`, uma foto cujo assunto está em cima ou embaixo simplesmente
   * some. Cada bloco escolhe o seu.
   */
  imagePosition?: string;
  /**
   * A cor do painel quando NÃO há foto. Ignorado quando há.
   *
   * ⚠️ NÃO É ESCOLHA LIVRE, é ritmo de página. A página de serviço fecha em
   * `bg-brand` (o `SolutionCta`) e tem a evidência em `bg-ink`. Dois painéis da
   * mesma cor aqui ou anulam a diferença entre os blocos, ou antecipam uma
   * faixa que vem depois. Por isso o Outcome vai de `ink` e o How We Help de
   * `brand`: o escuro antes do vermelho constrói na direção do convite final,
   * em vez de repeti-lo antes da hora.
   */
  panelTone?: "ink" | "brand";
}) {
  const imageLeft = side === "left";

  /* ⚠️ O ARRANJO COM FOTO MUDOU EM 12-09 — é a variação 10 de `/service-tests`,
     escolhida depois de dez tratamentos postos lado a lado. O que ela tem, e
     por que cada peça está aqui:

     UMA TELA CHEIA POR BLOCO (`lg:min-h-svh`). Antes eram 440px de altura
     mínima e os dois blocos cabiam quase juntos numa rolagem, o que os fazia
     ler como uma pilha. Com uma tela cada, a troca de bloco é a própria
     rolagem. `svh` e não `vh` pela mesma razão do herói: no telefone `100vh`
     conta a tela COM a barra de endereço retraída e a base fica escondida.

     A ALTURA VAI NO CONTAINER INTERNO, não na `<section>`. É ele que carrega o
     `items-stretch`, então é dele que o painel de imagem herda "ocupe a altura
     toda"; posta na seção, a foto ficaria com a altura do parágrafo.

     56/44 E NÃO 50/50. Meia tela para um parágrafo de quatro linhas deixava a
     coluna curta e a foto larga demais; com 56% o texto respira e a imagem
     continua sendo metade da composição.

     O QUE FOI TESTADO E DESCARTADO, para ninguém refazer: um corte DIAGONAL na
     borda interna do painel (variação 9). O ângulo não era o problema — o
     problema é que em cima e embaixo o corte seguia reto, então entre um bloco
     e outro passava uma linha horizontal que fatiava as duas diagonais pela
     metade. Movê-la para a emenda entre as seções resolvia, mas com tela cheia
     ela deixou de ter função: o que a diagonal dizia era onde um bloco acaba e
     o outro começa, e a altura já diz isso sozinha.

     ⚠️ SÓ DE `lg` PARA CIMA. Empilhado no telefone, duas telas cheias viram
     quatro, e o visitante rola quatro telas para ler dois parágrafos.

     ⚠️ 55svh DESDE 16-09, e era 78. O template de serviço que ela mandou mostra
     a página inteira em pouco mais de uma tela e meia, e com 78svh cada um
     destes dois blocos comia quase uma tela sozinho. O rótulo desceu junto (68
     → 48px) porque em painel mais baixo ele encostava nas bordas. */
  return (
    <section className={tone === "paper" ? "bg-paper" : "bg-white"}>
      {/* ⚠️ CONTIDO EM 1440, NÃO EM SANGRIA TOTAL — mudado em 10-09 a pedido.
          A Explore, que é a referência de arranjo, deixa a foto ser cortada pela
          borda da JANELA. Aqui ela para no mesmo `max-w-[1440px]` de todos os
          outros blocos do site, e é a decisão certa por consistência: a /about
          fez exatamente esta troca em 09-09, quando o cliente pediu o contrário
          da Explore ("a foto fica CONTIDA no mesmo max-w-[1440px], inclusive em
          telas maiores que isso"). Duas páginas com regra oposta de sangria
          seriam dois sites.

          `lg:flex` e não `grid`: as duas colunas precisam ter a mesma altura e
          encostar uma na outra, e é mais simples com duas caixas.

          `lg` e não `md`: em tablet retrato (768) meia largura dá 384px para o
          texto, e a medida fica curta demais — três a quatro palavras por linha.
          Até `lg` os dois empilham, imagem em cima. */}
      <div
        className={`mx-auto flex max-w-[1440px] flex-col lg:items-stretch ${image ? "lg:min-h-svh" : "lg:min-h-[55svh]"}  ${
          imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
        }`}
      >
        {/* O PAINEL — foto quando existe uma, CAMPO DE COR quando não existe.
            É o mesmo lugar e a mesma medida nos dois casos, e é isso que faz o
            dia da troca ser uma linha.

            ⚠️ SEM FOTO NÃO É SLOT VAZIO NEM PLACEHOLDER TRACEJADO. A página é
            de venda e vai ao ar assim; caixa tracejada anuncia obra inacabada
            para quem nunca vai saber o que deveria estar ali. O campo cheio com
            o nome do bloco em corpo grande é uma composição ACABADA que por
            acaso não tem foto — e continua sendo, se foto nenhuma chegar.

            POR QUE O RÓTULO MUDA DE LADO. Ele era uma linha de 14px no alto da
            coluna de texto. Aqui vira o assunto do painel, em serifa grande, e
            SAI da coluna de texto — dizer duas vezes, uma pequena e outra
            grande, seria a mesma palavra competindo consigo. O parágrafo fica
            sozinho do outro lado, que é o que ele precisa.

            NO PÉ E NÃO CENTRADO: o campo é alto, e texto no meio de um retângulo
            colorido lê como placa. Ancorado embaixo, o vazio acima vira margem
            deliberada — é a composição da referência do Prisma, onde o tipo
            grande mora no rodapé da imagem. */}
        <div
          className={`relative flex min-h-[280px] items-end lg:min-h-0 lg:w-[44%] ${
            image ? "" : panelTone === "brand" ? "bg-brand" : "bg-ink"
          }`}
        >
          {image ? (
            <Image
              src={image}
              alt={imageAlt}
              aria-hidden={imageAlt ? undefined : true}
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className={`object-cover ${imagePosition}`}
            />
          ) : (
            <p className="font-serif px-6 pb-12 pt-16 text-[38px] font-semibold leading-[1.02] tracking-[-1px] text-white md:px-10 md:text-[58px] lg:pb-16 lg:text-[48px]">
              {label}
            </p>
          )}
        </div>

        {/* O PADDING ASSIMÉTRICO alinha o texto com o resto da página: o lado
            que encosta na borda externa leva os mesmos `px-6/md:px-10` do herói
            e do rodapé, e o lado que encosta na imagem leva um respiro maior,
            para o texto não colar na foto. */}
        <div
          className={`flex items-center px-6 py-16 md:px-10 lg:w-[56%] lg:py-28 ${
            imageLeft ? "lg:pl-16 xl:pl-24" : "lg:pr-16 xl:pr-24"
          }`}
        >
          <div className="max-w-[560px]">
            {/* A RÉGUA DE 36×2 ABRE A COLUNA agora que o rótulo saiu daqui. Ela
                é a mesma do rótulo do herói, e sem ela o parágrafo começaria no
                nada: num bloco de uma tela, um texto solto no meio do branco não
                tem onde encostar. Dois traços iguais na mesma tela — este e o do
                herói — é o que faz os blocos lerem como uma família. */}
            <span className="block h-0.5 w-9 bg-brand" />
            {/* `font-serif` no corpo — é o par da grade editorial: grotesca no
                rótulo, serifa no texto. Ver `lib/fonts.ts`. */}
            <RichText
              html={html}
              className="mt-7 font-serif text-[21px] leading-[1.55] text-ink md:text-[25px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
