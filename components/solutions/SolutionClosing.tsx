import Reveal from "@/components/Reveal";
import type { ServiceClosing } from "@/lib/services";

/**
 * O FECHO CENTRADO — a última coisa que o mockup de 21-09 desenha
 * (`docs/meetings/nova-pagina-interna-servicoes.jpg`), pedido por email:
 * *"Services internal — Re-layout the internal with the image nova-pagina-
 * interna-servicoes.jpg inside meetings folder"*.
 *
 * Duas linhas em serifa, centradas, com um filete vermelho de cada lado: a
 * primeira em tinta escura, a segunda em vermelho. No Senior Leadership
 * Development, *"Different organisations. Different transformations."* e
 * *"Leadership that makes it happen."*
 *
 * ⚠️ ISTO NÃO É O CTA, e vale dizer antes que alguém tente fundir os dois. Não
 * tem botão, não tem link e não pede nada — é uma assinatura, do mesmo tipo que
 * fecha um anúncio impresso. O `SolutionCta`, a faixa vermelha com botão, NÃO
 * APARECE neste desenho: o mockup termina exatamente aqui, e tudo o que a página
 * tem depois (evidência, convite, related services) ficou sem referência
 * visual. A caixa de abertura de `SolutionView` registra essa fronteira.
 *
 * ============================================================================
 * O QUE FOI MEDIDO NO ARQUIVO
 * ============================================================================
 * Num documento de 866px: a linha escura ocupa as linhas 966–982 e a vermelha
 * 988–1007, e os dois filetes correm na linha 986 — ou seja, no CENTRO VERTICAL
 * do par, não na base nem no topo. Daí o `items-center` num flex de três peças,
 * em vez de um pseudo-elemento ancorado ao texto.
 *
 * Os filetes vão de x=46 a 210 e de x=655 a 819, com o texto entre 230 e 640 —
 * isto é, eles ocupam a sobra dos dois lados (`flex-1`) com um respiro de ~20px
 * a 866, uns 33 a 1440, que é o `gap-8`.
 *
 * A SEGUNDA LINHA É UM DEGRAU MAIOR QUE A PRIMEIRA no desenho (entrelinha de
 * 22px a 866, com a caixa da vermelha mais alta que a da escura), e a ordem
 * importa: é a linha vermelha que carrega a frase, a escura é a preparação.
 * Copiar as duas no mesmo corpo achataria isso.
 *
 * ⚠️ OS FILETES SOMEM NO TELEFONE (`hidden sm:block`). Numa tela de 390px o
 * texto centrado já ocupa a largura inteira e `flex-1` daria a cada filete uns
 * 10px — dois cotocos vermelhos ladeando o texto, que leem como defeito de
 * renderização e não como régua.
 *
 * Sem `closing` no serviço, o bloco não renderiza — a mesma guarda dos pilares,
 * dos cartões de público e da evidência. Hoje um dos dez tem.
 */
export default function SolutionClosing({ closing }: { closing?: ServiceClosing }) {
  if (!closing?.lead?.trim() || !closing?.accent?.trim()) return null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
        {/* `stagger={false}`: os filhos diretos são filete, texto e filete, e
            escaloná-los faria os dois traços entrarem em tempos diferentes de
            cada lado da mesma frase. O bloco é uma peça só. */}
        <Reveal stagger={false} className="flex items-center gap-8">
          <span aria-hidden className="hidden h-px flex-1 bg-brand/50 sm:block" />
          {/* `<p>` E NÃO CABEÇALHO: é uma assinatura, não um título de seção — não
              há conteúdo "sob" ela, e um `h2` aqui prometeria ao leitor de tela
              uma seção que não existe. */}
          <p className="text-center [text-wrap:balance]">
            <span className="block font-serif text-[22px] font-medium leading-[1.25] tracking-[-0.2px] text-ink md:text-[30px]">
              {closing.lead}
            </span>
            <span className="mt-1 block font-serif text-[24px] font-medium leading-[1.25] tracking-[-0.2px] text-brand md:text-[33px]">
              {closing.accent}
            </span>
          </p>
          <span aria-hidden className="hidden h-px flex-1 bg-brand/50 sm:block" />
        </Reveal>
      </div>
    </section>
  );
}
