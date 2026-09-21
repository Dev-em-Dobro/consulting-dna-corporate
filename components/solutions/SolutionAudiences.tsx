import Image from "next/image";
import { Users } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { ServiceAudience } from "@/lib/services";

/**
 * OS TRÊS CARTÕES DE PÚBLICO — o bloco novo do re-layout de 21-09, pedido por
 * email: *"Services internal — Re-layout the internal with the image
 * nova-pagina-interna-servicoes.jpg inside meetings folder"*.
 *
 * No desenho (`docs/meetings/nova-pagina-interna-servicoes.jpg`) eles vêm logo
 * abaixo do "What we do" e respondem A QUEM o serviço se destina: no Senior
 * Leadership Development, "EXECUTIVE TEAMS", "SLT / ET-1" e "TOP 100 – 150
 * LEADERS". Cada cartão tem cinco partes, nesta ordem: foto, ícone de linha
 * vermelho, rótulo em caixa alta com um traço embaixo, título curto em serifa e
 * um parágrafo.
 *
 * ============================================================================
 * O QUE FOI MEDIDO NO ARQUIVO, E NÃO ESTIMADO
 * ============================================================================
 * O mockup tem 866px de largura, com margens de 38 à esquerda e 36 à direita —
 * 792px de conteúdo. Os três cartões ocupam 38–292, 307–561 e 576–830: três
 * colunas iguais de 254px com 15px de calha entre elas. A 1440 isso dá uma
 * calha de 25px, que é o `gap-6` (24). A foto vai de y=421 a y=542 em cartões
 * que começam no mesmo y — 254 por 121, ou seja **~2:1**, e não o 16:10 do
 * `ServiceCard` do índice.
 *
 * ⚠️ OS TRÊS CARTÕES TÊM O MESMO FUNDO, e isto foi conferido pixel a pixel
 * justamente porque a leitura à distância diz o contrário. No arquivo os três
 * medem #f7f6f4 no miolo e as calhas entre eles medem #fefefe — ou seja, os
 * três são um campo claro sobre a faixa BRANCA do "What we do", e o primeiro
 * não é branco como parece num relance. Aqui isso vira `bg-paper` sobre
 * `bg-white`. (O papel do desenho é mais quente que o nosso token, e a razão de
 * não termos trocado o token está na caixa de `tone`, em `SolutionSection`.)
 *
 * ⚠️ SEM PADDING NO TOPO DA SEÇÃO, de propósito: a emenda com o "What we do" é
 * o `pb-20 md:pb-24` daquele bloco, e mais nada. No desenho os dois quase se
 * encostam (35px a 1440), e copiar esses 35px colaria os cartões no parágrafo —
 * o mockup inteiro tem o ritmo vertical comprimido em cerca de 2,5x contra o
 * do site, que é o ritmo que a cliente já aprovou nas outras telas. O que se
 * preserva é a INTENÇÃO: os cartões pertencem ao bloco de cima, e é por isso que
 * dividem a faixa branca com ele em vez de ganharem fundo próprio.
 *
 * ⚠️ SEM RÓTULO DE SEÇÃO PRÓPRIO — o desenho não desenha nenhum, e inventar um
 * ("Who we work with") seria copy nossa numa página onde tudo o mais é dela.
 * Consequência de acessibilidade, assumida: esta `<section>` não tem nome. Os
 * títulos dos cartões saem como `h3`, sob o `h2` do "What we do", o que mantém
 * a escada de cabeçalhos inteira.
 *
 * Lista vazia (ou ausente) não renderiza nada — a mesma guarda dos pilares e da
 * evidência. Hoje um dos dez serviços tem o conteúdo; ver `audiences` em
 * `lib/services.ts`.
 */
export default function SolutionAudiences({ items }: { items?: ServiceAudience[] }) {
  const audiences = (items ?? []).filter((a) => a.label.trim() && a.title.trim());
  if (audiences.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-6 pb-20 md:px-10 md:pb-24">
        {/* `sm:grid-cols-3` E NÃO `md:`: três cartões de texto curto já cabem a
            640px, e a alternativa (uma coluna até 768) empilhava três blocos
            quase idênticos numa rolagem longa em tablet retrato. */}
        <Reveal className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {audiences.map((a) => (
            <article key={a.label} className="flex flex-col bg-paper">
              <div className="relative aspect-[2/1] w-full overflow-hidden bg-ink">
                {a.image ? (
                  <Image
                    src={a.image}
                    alt=""
                    fill
                    /* `alt=""` porque a foto é ATMOSFERA: o que identifica o
                       cartão é o rótulo logo abaixo, em texto. Descrever a
                       fotografia faria o leitor de tela anunciar o cartão duas
                       vezes — a mesma regra do `ServiceCard`. */
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover object-center"
                  />
                ) : (
                  /* CAMPO DE COR PARA QUEM NÃO TEM FOTO — o recurso que o
                     `ServiceCard` usa desde 12-09, e pelo mesmo motivo: não fica
                     brega, não depende de arquivo que não existe, e é diferente
                     em cada cartão de graça, porque o que preenche o quadro é o
                     rótulo do público.

                     ⏳ HOJE ELE É O ESTADO DE TODOS OS TRÊS. As fotografias do
                     mockup não vieram no pacote do Drive; ver `image` em
                     `ServiceAudience`.

                     `text-white/15` e `aria-hidden` pela mesma razão de lá: é
                     marca d'água, e é a repetição de um texto que já está
                     abaixo. */
                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-end p-6 font-serif text-[26px] font-semibold uppercase leading-[1.05] tracking-[-0.3px] text-white/15"
                  >
                    {a.label}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-7 md:p-8">
                <div className="flex items-center gap-4">
                  {/* ⚠️ O MESMO ÍCONE NOS TRÊS, e é o que o desenho mostra — o
                      grupo de três pessoas, em vermelho, nos três cartões. Não
                      há mapa rótulo → ícone aqui como há em `SolutionPillars`
                      porque não há o que mapear: os três cartões falam de
                      POPULAÇÕES de liderança, e a cliente escolheu dizer isso
                      com um símbolo só, repetido. Inventar três ícones
                      diferentes seria afirmar uma distinção que o desenho
                      recusa.

                      ⚠️ `size` NÃO É A ALTURA DO DESENHO. O lucide compõe dentro
                      de um quadro 24×24 com folga, e o `Users` ocupa uns 16 dos
                      24 em altura — ou seja, `size={44}` põe na tela um traçado
                      de ~29px. No arquivo o ícone mede 30×24 a 866, o que a 1440
                      daria ~40px de traçado, e o `size` equivalente seria 60.
                      Ficou em 44 porque a 60 o ícone passa a pesar mais que o
                      título do cartão — o desenho dela tem o ícone GRANDE, não
                      dominante, e 60 cruza essa linha. Traço 1.5, o mesmo dos
                      pilares. `aria-hidden` porque o rótulo ao lado diz a mesma
                      coisa. */}
                  <Users
                    aria-hidden
                    size={44}
                    strokeWidth={1.5}
                    className="shrink-0 text-brand"
                  />
                  <div>
                    <p className="text-[12px] font-medium uppercase leading-none tracking-[1.3px] text-brand">
                      {a.label}
                    </p>
                    {/* O TRAÇO EMBAIXO DO RÓTULO, e não ao lado dele como no
                        herói: no herói a régua e o rótulo formam uma linha só, e
                        aqui o lugar à esquerda já é do ícone. No arquivo ele
                        mede 26px de largura por 2 de altura, a 866 — uns 43×3 a
                        1440 —, começando no mesmo x do rótulo. `w-10` (40) é o
                        degrau mais próximo na escala.

                        `bg-brand/40` e não `bg-brand` cheio: no desenho este
                        filete é visivelmente mais claro que a letra do rótulo.
                        Ele é pontuação, não acento — se sair na cor cheia,
                        disputa com o ícone e com o título. */}
                    <span aria-hidden className="mt-2 block h-0.5 w-10 bg-brand/40" />
                  </div>
                </div>

                {/* `h3` — ver a caixa no topo do arquivo sobre a escada de
                    cabeçalhos. 26px a 1440 é a medida do arquivo: as duas linhas
                    do cartão do meio distam 19px a 866, o que dá 32px de
                    entrelinha a 1440 e, com `leading-[1.2]`, uma fonte de ~26. */}
                <h3 className="mt-6 font-serif text-[22px] font-semibold leading-[1.2] tracking-[-0.2px] text-ink md:text-[26px]">
                  {a.title}
                </h3>
                <p className="mt-4 font-serif text-[16px] leading-[1.6] text-muted">
                  {a.body}
                </p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
