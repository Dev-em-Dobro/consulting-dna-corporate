import Image from "next/image";
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

                     ⚠️ HOJE NADA CAI AQUI. O Senior Leadership Development é o
                     único serviço com `audiences`, e desde 21-09 os três
                     cartões dele têm fotografia. O ramo fica porque é ele que
                     permite publicar os outros nove sem esperar foto — ver
                     `image` em `ServiceAudience`.

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

                {/* ⬅ AS DUAS SOBREPOSIÇÕES — 21-09, do recorte que ela mandou: o
                    rótulo no canto superior esquerdo e as três palavras no
                    inferior direito, brancas sobre a fotografia.

                    ⚠️ SÓ COM FOTO. Sem `image` o quadro é o campo de cor, e ele
                    JÁ escreve o rótulo como marca d'água — desenhar a
                    sobreposição por cima dele seria o mesmo texto duas vezes no
                    mesmo quadro, uma delas ilegível sobre a outra.

                    O RÓTULO É `aria-hidden` E A CREDENCIAL NÃO, e a diferença é
                    de conteúdo, não de estilo: o rótulo se repete logo abaixo da
                    foto, em vermelho, e anunciá-lo duas vezes faria o leitor de
                    tela dizer "Executive teams, Executive teams". As três
                    palavras não existem em nenhum outro lugar do cartão —
                    escondê-las seria perder conteúdo. */}
                {a.image ? (
                  <>
                    {/* O ESCURECIMENTO É O QUE GARANTE O CONTRASTE, e ele nasce
                        nas DUAS pontas porque é nas duas que há texto. O miolo
                        fica limpo (`transparent` dos 32% aos 58%), que é onde
                        moram os rostos das três fotos — um véu chapado sobre a
                        imagem inteira apagaria justamente o que ela mostra.

                        SEM ELE O BRANCO NÃO SE SUSTENTA em duas das três: o
                        rótulo da sala de reunião cai sobre a janela ao pôr do
                        sol, e a credencial da mulher falando cai sobre o ombro
                        claro do homem à direita. No recorte dela essas duas
                        linhas já são as mais fracas. */}
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(38,36,37,.55)_0%,rgba(38,36,37,.12)_32%,rgba(38,36,37,.12)_58%,rgba(38,36,37,.62)_100%)]"
                    />
                    <span
                      /* ⚠️ NÃO É MAIS `aria-hidden`, desde 21-09. Era, enquanto
                         o rótulo vermelho abaixo da foto repetia este texto;
                         aquele bloco saiu a pedido (ver a caixa na coluna de
                         texto), e este virou a ÚNICA ocorrência do nome do
                         público no cartão. Escondê-lo agora seria apagar
                         "Executive teams" para quem usa leitor de tela.

                         A MEDIDA VEM DO RECORTE: no desenho "EXECUTIVE TEAMS"
                         ocupa ~45% da largura do cartão, o que a 437px (a medida
                         do cartão a 1440) dá ~16px com 1,5px de entreletra.
                         Abaixo de `lg` o cartão cai para ~181px e o rótulo mais
                         longo ("Top 100 – 150 leaders", 21 caracteres) não cabe
                         em 16px — daí os dois degraus. Ele pode quebrar em duas
                         linhas nas telas estreitas, e quebrar é melhor que
                         transbordar. */
                      className="absolute left-0 top-0 p-4 text-[12px] font-bold uppercase leading-[1.25] tracking-[1.5px] text-white sm:text-[13px] lg:p-5 lg:text-[16px]"
                    >
                      {a.label}
                    </span>
                    {a.credential && a.credential.length > 0 ? (
                      <span
                        /* `text-right` E ALINHADO À DIREITA: as três linhas têm
                           comprimentos bem diferentes ("Bigger" contra "Bolder
                           leadership"), e é a borda direita comum que as faz ler
                           como um bloco em vez de três frases soltas. */
                        className="absolute bottom-0 right-0 p-4 text-right text-[10px] font-bold uppercase leading-[1.5] tracking-[1.5px] text-white lg:p-5 lg:text-[11px]"
                      >
                        {a.credential.map((line) => (
                          /* Uma linha por `<span>` em bloco, e não `<br/>`: o
                             leitor de tela lê as três como uma sequência, e a
                             quebra continua sendo do desenho em vez de depender
                             da largura disponível. */
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-7 md:p-8">
                {/* ⛔ O ÍCONE E O RÓTULO VERMELHO SAÍRAM DAQUI EM 21-09, a pedido:
                    *"aquela parte que tem o Executive Teams e o logo pode tirar
                    das 3 caixas"*.

                    O QUE OS TORNOU DISPENSÁVEIS foi a sobreposição na foto,
                    feita horas antes: o nome do público passou a viver no canto
                    superior esquerdo da imagem, então o rótulo aqui embaixo
                    dizia pela segunda vez, a 30px de distância, o que a foto já
                    dizia. O cartão agora abre direto no título em serifa.

                    O QUE SAIU, para quem precisar reverter: o ícone `Users` do
                    lucide a `size={44}` e traço 1.5 (o mesmo símbolo nos três,
                    porque é o que o desenho mostra — três ícones diferentes
                    afirmariam uma distinção que ele recusa), o `<p>` do rótulo em
                    `text-brand` com 1,3px de entreletra, e o filete de 40x2 em
                    `bg-brand/40` abaixo dele. O `import { Users }` saiu junto.

                    ⚠️ ISSO MUDOU A ACESSIBILIDADE DA FOTO, e as duas coisas têm
                    de andar juntas: o rótulo sobreposto era `aria-hidden`
                    justamente porque este aqui o repetia. Sem este, aquele é a
                    ÚNICA ocorrência do nome do público no cartão — mantê-lo
                    escondido apagaria "Executive teams" para quem usa leitor de
                    tela. O `aria-hidden` de lá saiu no mesmo commit.

                    ⚠️ E DEIXOU O CARTÃO SEM RÓTULO QUANDO NÃO HÁ FOTO. Hoje isso
                    não acontece — o único serviço com `audiences` tem as três
                    fotografias —, mas um serviço novo com `audiences` e sem
                    `image` cairia no campo de cor, que escreve o rótulo como
                    marca d'água a 15% de opacidade: decorativo, não legível. Se
                    esse caso aparecer, o conserto é devolver o rótulo AQUI só
                    para ele, não para os três. */}

                {/* `h3` — ver a caixa no topo do arquivo sobre a escada de
                    cabeçalhos. 26px a 1440 é a medida do arquivo: as duas linhas
                    do cartão do meio distam 19px a 866, o que dá 32px de
                    entrelinha a 1440 e, com `leading-[1.2]`, uma fonte de ~26. */}
                {/* SEM `mt-6`: aquele respiro separava o título do rótulo que
                    saiu. Agora o `h3` é a primeira coisa da caixa, e o
                    afastamento do topo é o `p-7 md:p-8` do próprio contêiner —
                    somar os dois abriria um vazio de 52px entre a foto e a
                    primeira letra. */}
                <h3 className="font-serif text-[22px] font-semibold leading-[1.2] tracking-[-0.2px] text-ink md:text-[26px]">
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
