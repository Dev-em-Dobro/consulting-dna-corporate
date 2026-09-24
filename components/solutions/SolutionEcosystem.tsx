import Image from "next/image";
import Reveal from "@/components/Reveal";
import type { ServiceEcosystem } from "@/lib/services";

/**
 * A FAIXA DO ECOSSISTEMA — o "How we work" do layout de Culture Transformation
 * (`docs/meetings/culture-transformation-24-09.jpeg`, 24-09).
 *
 * Três colunas sobre campo `ink`: à esquerda o rótulo, a manchete em serifa e o
 * parágrafo; no meio o diagrama dos dez elementos; à direita, atrás de um fio
 * vertical, um título curto em caixa alta e um parágrafo.
 *
 * ============================================================================
 * ⚠️ ISTO SUBSTITUI O "HOW WE WORK" PADRÃO, E TAMBÉM A FILEIRA DE BAIXO
 * ============================================================================
 * Nas outras nove páginas aquela região são DUAS peças empilhadas: o
 * `SolutionSection` de duas colunas e, logo abaixo dele, a fileira de `steps`,
 * `practices` ou `pillars`. No layout de Culture as duas dão lugar a esta faixa
 * única — o rótulo "How we work" é escrito AQUI DENTRO, e não acima.
 *
 * Por isso `SolutionView` trata `ecosystem` como interruptor e não como bloco
 * extra: com ele, nem a seção nem a fileira renderizam. Um serviço que tivesse
 * os dois escreveria "How we work" duas vezes na mesma rolagem.
 *
 * ============================================================================
 * ⏳ O DIAGRAMA NÃO É NOSSO, E POR ENQUANTO NÃO EXISTE
 * ============================================================================
 * A daily de 24-09 é explícita: *"o diagrama do ecossistema elas vão redesenhar
 * e mandar (ideia do sol no centro e planetas orbitando, sem cores infantis)"*.
 * Ou seja, o desenho que está no JPEG é a versão que elas mesmas recusaram —
 * reproduzi-lo seria publicar o que foi pedido para trocar, e redesenhá-lo seria
 * fazer trabalho que já nasce descartado.
 *
 * Sem `diagram`, o meio da faixa é a CHAPA MARCADA — o mesmo recurso que a
 * evidência usa desde 17-09, e pelo mesmo motivo: o furo tem de ser visível na
 * revisão com a cliente em vez de passar por acabamento. Ver a caixa de
 * `diagram` em `lib/services.ts`.
 *
 * ⚠️ O PLACEHOLDER É DESENHADO EM CSS, e não é um arquivo. A evidência aponta
 * para `/services/evidence/evidence.PLACEHOLDER.jpg` porque aquele slot é uma
 * FOTOGRAFIA e uma chapa cinza no lugar dela lê como foto que não carregou.
 * Aqui o slot é um diagrama — uma peça de traço sobre campo escuro —, e um JPEG
 * cinza no meio de uma faixa `ink` seria um retângulo claro pedindo para ser
 * confundido com conteúdo. O contorno tracejado diz "isto vai ser preenchido"
 * sem fingir ser nada.
 *
 * ⚠️ OS DEZ ELEMENTOS NÃO SAEM AQUI. Eles moram dentro do diagrama, e a
 * transcrição deles fica no dado — ver `elements` em `lib/services.ts`, que
 * explica por que a lista está guardada sem ser renderizada.
 */
export default function SolutionEcosystem({ item }: { item?: ServiceEcosystem }) {
  if (!item?.headline.trim()) return null;

  return (
    /* `bg-ink`, medido no layout: a faixa é o único campo escuro do corpo desta
       página, entre a faixa branca dos cartões e a branca das provas. Na
       sequência de fundos ela ocupa o lugar que nas outras páginas é `paper` —
       ver a lista em `SolutionView`. */
    <section className="bg-ink">
      <Reveal className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
        {/* A GRADE É 1 / 1,6 / 0,9, aproximando o layout: o diagrama é a coluna
            mais larga porque é o assunto da faixa, e a coluna da direita é a
            mais estreita porque é um comentário sobre ele.

            ⚠️ SÓ A PARTIR DE `lg`. Abaixo disso as três empilham na ordem do
            DOM — texto, diagrama, comentário —, que é a ordem de leitura do
            layout. Tentar manter três colunas em tablet daria uma coluna de
            ~200px para um parágrafo de seis linhas. */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.6fr_0.9fr] lg:gap-10">
          <div>
            {/* O MESMO RÓTULO DAS OUTRAS PÁGINAS, em `brand-light` e não em
                `brand`: sobre `ink` o vermelho cheio dá 2,87:1 e não passa na
                régua de 3:1 — a conta está no `globals.css`, e é a mesma regra
                que o herói aplica. */}
            <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand-light">
              How we work
            </p>
            <h2 className="mt-8 font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.5px] text-white md:text-[42px]">
              {item.headline}
            </h2>
            <p className="mt-6 font-serif text-[16px] leading-[1.65] text-white/75 md:text-[17px]">
              {item.body}
            </p>
          </div>

          {/* O DIAGRAMA, ou a chapa que o espera. `aspect-[4/3]` é a proporção
              que ele ocupa no layout (~470x350 no arquivo de 1284), e vale para
              os dois estados: quando o arquivo chegar, a faixa não muda de
              altura e nada abaixo dela se desloca. */}
          <div className="relative aspect-[4/3] w-full">
            {item.diagram ? (
              <Image
                src={item.diagram}
                /* `alt=""` porque os dez elementos que o diagrama nomeia estão
                   transcritos no dado e a faixa já descreve o que ele mostra em
                   texto ("ten interconnected elements"). Quando o arquivo
                   definitivo chegar, vale reavaliar: se ele trouxer informação
                   que o texto ao lado não dá, o `alt` deixa de poder ser vazio. */
                alt=""
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-contain"
              />
            ) : (
              <div
                /* `aria-hidden` E NÃO UM AVISO PARA O LEITOR DE TELA: quem usa
                   leitor não tem um furo de diagrama, tem o texto das duas
                   colunas, que é auto-suficiente. Anunciar "placeholder" seria
                   expor à pessoa cega um detalhe de produção que a vidente vê
                   como uma caixa vazia e entende sozinha. */
                aria-hidden
                className="flex h-full w-full items-center justify-center rounded-sm border border-dashed border-white/25 px-6 text-center"
              >
                <span className="text-[12px] font-medium uppercase leading-[1.6] tracking-[1.5px] text-white/40">
                  Ecosystem diagram
                  <span className="mt-1 block">to be supplied</span>
                </span>
              </div>
            )}
          </div>

          {/* O FIO VERTICAL à esquerda desta coluna é o que o layout desenha, e
              ele só existe a partir de `lg`: empilhadas, as três colunas não têm
              nada à esquerda para separar, e o fio viraria um traço solto acima
              do texto. `pl-0 lg:pl-10` acompanha. */}
          <div className="lg:border-l lg:border-white/20 lg:pl-10">
            {/* CAIXA ALTA E NÃO SERIFA, ao contrário da manchete da esquerda: no
                layout as duas frases grandes desta faixa têm tratamentos
                diferentes de propósito — a da esquerda é o título do bloco, esta
                é uma legenda com voz de cartaz. */}
            <p className="text-[15px] font-bold uppercase leading-[1.45] tracking-[1.5px] text-white md:text-[16px]">
              {item.asideTitle}
            </p>
            <p className="mt-5 font-serif text-[15px] leading-[1.65] text-white/75 md:text-[16px]">
              {item.asideBody}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
