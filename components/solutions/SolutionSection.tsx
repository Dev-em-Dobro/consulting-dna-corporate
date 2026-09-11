import Image, { type StaticImageData } from "next/image";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import RichText from "@/components/RichText";

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
 * A IMAGEM É PLACEHOLDER, e não descuido: não existe fotografia por serviço, e
 * o material que existe (`docs/Content.zip`, lote de 11/06) é quase todo em
 * sede de cliente com a marca deles na parede — usar aquilo como ilustração
 * genérica insinuaria uma relação que a foto não prova, além de expor cliente
 * sem consentimento. O herói usa a única foto do lote sem marca visível.
 * Trocar `<ImagePlaceholder>` por `<Image fill>` é a única edição quando o
 * material próprio chegar.
 */
export default function SolutionSection({
  label,
  html,
  side,
  tone = "white",
  image,
  imageAlt = "",
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
}) {
  const imageLeft = side === "left";

  /* SEM FOTO, O BLOCO NÃO VIRA UM SLOT VAZIO — vira um bloco tipográfico.
     Decidido em 11-09, e a razão é o CMS: `solutionSchema` tem UM campo de
     imagem (`bannerMediaId`, o herói) e nenhum por bloco. As fotos que estavam
     aqui eram import fixo, as MESMAS nas dez páginas, e portanto a única coisa
     da página que o cliente não poderia trocar quando assumir o conteúdo —
     justamente a que mais ocupa tela.

     Some a alternância de lado, que existia para dar ritmo entre fotos. O ritmo
     passa a vir dos fundos (branco → `paper` → `ink` na evidência → vermelho no
     CTA), que é o mesmo recurso que a About usa.

     O prop `image` continua aqui de propósito: quando existir fotografia POR
     SERVIÇO — e aí com campo de mídia por bloco no CMS — é passar a foto e o
     layout de duas colunas volta sem mais nada.

     A FOTO FOI PEDIDA AO CLIENTE: `docs/mensagem-grupo-fotos-servicos-11-09.
     ENVIAR.txt`, oferecida como sugestão de desenho e não como pendência de
     lançamento. Se vier material, o campo de mídia por bloco no CMS é a nossa
     parte do trabalho. */
  if (!image) {
    return (
      <section className={tone === "paper" ? "bg-paper" : "bg-white"}>
        <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-20 md:grid-cols-[1fr_1.6fr] md:gap-16 md:px-10 md:py-24">
          <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
            {label}
          </p>
          <RichText
            html={html}
            className="max-w-[760px] font-serif text-[20px] leading-[1.55] text-ink md:text-[24px]"
          />
        </div>
      </section>
    );
  }

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

          O que se perde: em monitor largo a foto deixa de tocar a borda, então
          o bloco lê como cartão largo em vez de faixa. O que se ganha: a borda
          esquerda da imagem cai na MESMA linha vertical do logo, do título do
          herói e do rodapé.

          `lg:flex` e não `grid`: as duas metades precisam ter a mesma altura e
          encostar uma na outra, e é mais simples com duas caixas de 50%.

          `lg` e não `md`: em tablet retrato (768) meia largura dá 384px para o
          texto, e a medida fica curta demais — três a quatro palavras por linha.
          Até `lg` os dois empilham, imagem em cima. */}
      <div
        className={`mx-auto max-w-[1440px] lg:flex lg:items-stretch ${
          imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
        }`}
      >
        {/* `sizes="(min-width:1024px) 50vw, 100vw"`: até `lg` os blocos empilham
            e a imagem ocupa a largura toda; de `lg` para cima ela é metade. */}
        <div className="relative min-h-[260px] lg:min-h-[440px] lg:w-1/2">
          {image ? (
            <Image
              src={image}
              alt={imageAlt}
              aria-hidden={imageAlt ? undefined : true}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
          ) : (
            <ImagePlaceholder className="absolute inset-0 h-full w-full" label="Imagem" />
          )}
        </div>

        {/* O PADDING ASSIMÉTRICO alinha o texto com o resto da página: o lado
            que encosta na borda externa leva os mesmos `px-6/md:px-10` do herói
            e do rodapé, e o lado que encosta na imagem leva um respiro maior,
            para o texto não colar na foto. */}
        <div
          className={`flex items-center px-6 py-16 md:px-10 lg:w-1/2 lg:py-24 ${
            imageLeft ? "lg:pl-14 xl:pl-20" : "lg:pr-14 xl:pr-20"
          }`}
        >
          <div className="max-w-[520px]">
            <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
              {label}
            </p>
            {/* `font-serif` no corpo — é o par da grade editorial: grotesca no
                rótulo, serifa no texto. Ver `lib/fonts.ts`. */}
            <RichText
              html={html}
              className="mt-5 font-serif text-[18px] leading-[1.6] text-ink md:text-[19px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
