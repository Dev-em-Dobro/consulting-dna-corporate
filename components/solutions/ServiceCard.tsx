import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/services";

/**
 * Um serviço como card — o do índice `/services`.
 *
 * ⚠️ TEM UM CONSUMIDOR SÓ, e a história explica por quê. Ele saiu de dentro de
 * `app/services/page.tsx` em 11-09 para ser usado também no pé de cada página
 * de serviço, numa grade com as outras nove. Aquele bloco foi removido no mesmo
 * dia — o outline não o pedia, e a caixa em `SolutionView` guarda o raciocínio.
 * O card ficou extraído porque o índice lê melhor assim e porque, se a grade
 * voltar, ela volta usando isto e não uma cópia.
 *
 * SEM PROP DE NÍVEL DE CABEÇALHO. Ele chegou a ter uma (`h2` no índice, `h3` no
 * pé), e ela saiu junto com o único caso que a justificava. Se a grade voltar,
 * ela precisa de `h3` para não quebrar a escada de cabeçalhos sob o rótulo da
 * seção — e aí a prop volta com ela, em vez de ficar aqui sem uso esperando.
 *
 * O CARD INTEIRO É O LINK, não só o nome: um alvo de clique do tamanho do card é
 * o que funciona no telefone, onde estas fileiras viram uma coluna só.
 *
 * ================================================================
 * REFEITO EM 15-09 SOBRE O DESENHO DA MALIHA
 * ================================================================
 * O `4. Services/Example.png` do pacote do Drive é a landing de Services como
 * ela a quer, e respondeu de uma vez o que a daily de 14-09 tinha deixado meio
 * dito. O card passa a ter QUATRO partes, nesta ordem:
 *
 *   1. UMA IMAGEM em 16:10, no topo. É o item 12 ("a bit of image, just to call
 *      out each of the services"). Seis dos dez têm arquivo; os outros quatro
 *      caem no campo de cor — ver `cardImage` em `lib/services.ts`.
 *   2. O NÚMERO, 01 a 10, em vermelho. Ele não é enfeite: o outline fecha a
 *      ordem dos dez em letra ("Count and order are both settled"), e numerar é
 *      o que torna essa ordem visível em vez de implícita.
 *   3. O TÍTULO e a banner statement, como já eram.
 *   4. "LEARN MORE", que era "Explore". A troca é dela, no desenho.
 *
 * ⚠️ A COPY DO CARD NO DESENHO DELA NÃO É A NOSSA, e ficamos com a nossa de
 * propósito. O mockup escreve "Build a pipeline deep enough that your next
 * leaders are ready before you need them"; o nosso card mostra "Build the
 * leadership pipeline before the business needs it", que é a BANNER STATEMENT
 * do `CDNA_03_Services.docx` e do `WEBSITE SERVICE COPY.xlsx` — os dois marcam
 * essa frase como FINAL. As do mockup são reescritas soltas, sem fonte em
 * documento nenhum. Se ela quiser as do desenho, é campo novo e pedido de copy,
 * não improviso aqui.
 *
 * ================================================================
 * A ESCADA `xl:` É A GRADE DE QUATRO DE 14-09
 * ================================================================
 * O índice passou de duas colunas para quatro (item 10: *"four four four going
 * across"*), e isso não é só a grade que muda — o card encolhe de ~660px para
 * ~278px numa página de 1280. Os números de tipografia foram dimensionados para
 * a medida larga, então cada um tem um degrau `xl:` PARA BAIXO: título 27→21px,
 * corpo 17→15px, respiro 40→28px. Abaixo de `xl` a página segue em duas colunas
 * e o card é exatamente o que era.
 */
export default function ServiceCard({
  service,
  index,
  className = "",
}: {
  service: Service;
  /**
   * Posição na lista, base zero — vira o "01" do card.
   *
   * PROP E NÃO CAMPO DO DADO: o número conta a POSIÇÃO NESTA GRADE, e o dado não
   * sabe em que grade está. Gravá-lo em `lib/services.ts` criaria dois lugares
   * para manter sincronizados no dia em que a ordem mudar — e a ordem já mudou
   * uma vez (Judgement in AI foi para a 8).
   */
  index: number;
  /**
   * Classes de POSIÇÃO NA GRADE, aplicadas ao próprio card.
   *
   * Existe para os dois últimos do índice, que ocupam duas colunas na grade de
   * quatro (`xl:col-span-2`). Vai no card e não num `<div>` em volta porque o
   * `Reveal` escalona os FILHOS DIRETOS dele — uma caixa intermediária roubaria
   * a animação do card.
   *
   * Só layout externo. Cor, borda e respiro interno são deste componente, e
   * sobrescrevê-los daqui é o caminho curto para dez cards que não combinam.
   */
  className?: string;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className={`group flex flex-col border border-line bg-white transition-colors hover:border-brand/40 ${className}`}
    >
      {/* A IMAGEM NÃO TEM PADDING, e o texto tem — é o que o desenho dela faz e
          é o que distingue este card do anterior: a foto encosta nas três
          bordas e o quadro branco começa abaixo dela. Por isso o `p-8` saiu do
          <Link> e foi para o <div> de texto. */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink">
        {service.cardImage ? (
          <Image
            src={service.cardImage}
            alt=""
            fill
            /* `alt=""` — a foto é ATMOSFERA, não informação. O que identifica o
               card é o título logo abaixo, em texto; descrever a fotografia
               faria o leitor de tela anunciar duas vezes o mesmo card. */
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          /* CAMPO DE COR PARA QUEM NÃO TEM FOTO — o mesmo recurso das páginas de
             dentro desde 12-09, e pelo mesmo motivo: não fica brega, não depende
             de arquivo que não existe, e é diferente em cada card de graça,
             porque o que preenche o quadro é o nome do serviço.

             `text-white/15` e não um cinza: a palavra é MARCA D'ÁGUA, tem de
             ficar no limiar do visível. Se ela competir com o título abaixo, o
             card passa a dizer o nome do serviço duas vezes com pesos
             parecidos. `aria-hidden` pelo mesmo motivo — é a repetição do
             título, não conteúdo novo. */
          <span
            aria-hidden
            className="absolute inset-0 flex items-end p-6 font-serif text-[34px] font-semibold leading-[1.05] tracking-[-0.5px] text-white/15"
          >
            {service.title}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-8 md:p-10 xl:p-7">
        {/* O NÚMERO. `tabular-nums` porque são dez numa grade e a largura do
            "1" contra a do "0" deslocaria o título de card para card. */}
        <span className="text-[13px] font-medium tabular-nums tracking-[1.3px] text-brand">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="font-serif mt-3 text-[24px] font-semibold leading-[1.2] tracking-[-0.2px] text-ink md:text-[27px] xl:text-[21px]">
          {service.title}
        </h2>
        <p className="mt-4 max-w-[520px] font-serif text-[16px] leading-[1.6] text-muted md:text-[17px] xl:mt-3 xl:text-[15px]">
          {service.banner}
        </p>
        {/* `mt-auto` EMPURRA O "LEARN MORE" PARA O PÉ DO CARD. Em duas colunas
            os cards de uma fileira tinham alturas parecidas e um respiro fixo
            bastava; em quatro, a fileira mistura título de uma linha com título
            de três, e o `stretch` da grade deixa todos com a altura do mais
            alto — o link nascia no meio do card em uns e no pé em outros. Com
            `mt-auto` os quatro da fileira caem na mesma linha.

            OS 28px VIRARAM `pt-7`, e não continuam `mt-7`: `mt-auto` e `mt-7`
            são a MESMA propriedade, então só um deles valeria. Como padding, a
            distância mínima até a banner statement fica garantida mesmo no card
            em que não sobra folga nenhuma para o `auto` empurrar. */}
        <span className="mt-auto inline-flex items-center gap-2 pt-7 text-[13px] font-medium uppercase tracking-[1.3px] text-brand">
          Learn more
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
