import Reveal from "@/components/Reveal";

/**
 * A FAIXA "ONE AMBITION" — a linha rosa do layout de Women’s Leadership
 * Development (`women leadership.jpeg`, 24-09), entre os cartões de público e
 * o "How we work".
 *
 * Uma frase só, em caixa alta, centrada, com um filete de cada lado, sobre um
 * campo rosa muito claro.
 *
 * ⚠️ NÃO É O `SolutionClosing`, e por isso é peça própria. Aquele é a
 * assinatura em SERIFA de duas linhas sobre branco, e o rótulo dele (`label`)
 * NOMEIA o bloco que vem abaixo ("Featured case study"). Esta é uma afirmação
 * de ambição: campo de cor, texto miúdo em versalete, e não anuncia nada — no
 * layout ela fecha os três cartões de público em vez de abrir a seção seguinte.
 * Fundir as duas exigiria uma prop de fundo, uma de família tipográfica e uma
 * de semântica, que é um componente com dois modos que não partilham nada.
 *
 * ⚠️ A COPY VEM EM CAIXA BAIXA E O VERSALETE É CSS. No dado a frase está
 * escrita como frase ("One ambition: stronger pipelines…") para que o /edit e
 * uma eventual tradução recebam texto legível; quem quiser mudar o desenho
 * mexe no `uppercase` daqui, não na copy.
 *
 * ⚠️ OS FILETES SOMEM NO TELEFONE, pela mesma conta do `SolutionClosing`: numa
 * tela estreita o texto já ocupa a largura inteira e o `flex-1` daria dois
 * cotocos de uns 10px, que leem como defeito.
 *
 * Sem `line` o bloco não renderiza — a mesma guarda dos outros campos
 * opcionais do template.
 */
export default function SolutionAmbition({ line }: { line?: string }) {
  if (!line?.trim()) return null;

  return (
    /* BRANCO POR FORA, ROSA POR DENTRO: a faixa divide a seção branca com os
       cartões de público logo acima (o campo de cor é a caixa, não a seção),
       e o `pb` daqui é o degrau até a faixa `paper` do "How we work". */
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-6 pb-20 md:px-10 md:pb-24">
        {/* `stagger={false}`: os filhos são filete, texto e filete — escaloná-los
            faria os dois traços entrarem em tempos diferentes. */}
        <Reveal
          stagger={false}
          className="flex items-center gap-6 bg-brand/5 px-6 py-5 md:gap-10 md:px-10"
        >
          <span aria-hidden className="hidden h-px flex-1 bg-brand/40 sm:block" />
          {/* `<p>` E NÃO CABEÇALHO: não há conteúdo "sob" esta frase, e um `h2`
              prometeria ao leitor de tela uma seção que não existe. */}
          <p className="text-center text-[12px] font-semibold uppercase leading-[1.6] tracking-[1.4px] text-ink md:text-[13px] md:tracking-[1.8px]">
            {line}
          </p>
          <span aria-hidden className="hidden h-px flex-1 bg-brand/40 sm:block" />
        </Reveal>
      </div>
    </section>
  );
}
