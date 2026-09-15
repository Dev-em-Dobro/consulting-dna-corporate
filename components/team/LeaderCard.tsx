"use client";

import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";
import PersonModal, { type Person } from "@/components/PersonModal";
import type { Leader } from "@/lib/team";

/**
 * O card de uma pessoa da liderança — REFEITO EM 14-09 sobre o mockup que a
 * Maliha subiu no Drive durante a daily (`docs/mockup-team-maliha-14-09-2026.png`,
 * item 16 da transcrição).
 *
 * O QUE MUDOU. A citação SAI DE BAIXO DO NOME e vai para O LADO do retrato, num
 * cartão claro com aspas vermelhas grandes. Debaixo da foto ficam só nome, cargo
 * e região — mais o botão "+" que o mockup desenha ali.
 *
 * ⚠️ CONTINUA TRÊS POR LINHA. O "um card por linha" foi SUGESTÃO do Guli na call
 * ("do you want it maybe just one person in each line?"), não pedido dela: ela
 * respondeu apontando para o próprio mockup, que é 3 por linha, e o
 * `CDNA_04_Team.docx` escreve "portrait grid, three across". O que muda é a
 * posição da quote, e só.
 *
 * ================================================================
 * O "+" ABRE O PERFIL EM POP-UP — 15-09
 * ================================================================
 * É o que o `CDNA_04_Team.docx` pede para o bloco 2, em letra: *"portrait grid,
 * three across. Name, role, region, **short bio on click or hover**."* O botão
 * que o mockup desenha sob a foto é esse gesto, e o pop-up é o mesmo
 * `PersonModal` que a home usava — extraído do `PeopleGrid` para os dois lerem
 * o mesmo perfil.
 *
 * ⏸️ ELE ABRIU A QUOTE ENTRE 14-09 E 15-09, e o porquê fica registrado porque a
 * pergunta volta: naquele momento a bio não estava localizada, e cortar a quote
 * em 8 linhas era o único trabalho honesto que havia para o botão — as quotes
 * vão de 140 a 271 caracteres e a fileira inteira ficava com a altura da mais
 * longa. A bio estava no CMS o tempo todo, nos mesmos registros que a home lê;
 * o que faltava era ligar as duas fontes, e é o que o `cmsSlug` faz.
 *
 * ⚠️ A BIO É DO CMS, NÃO DO WORD. São dois conteúdos diferentes e vale não
 * confundi-los: o CMS traz o perfil (bio longa, valores, forças, especialidades,
 * histórico), e o que o documento marca como HOLD é o **bloco 3, Perspectives** —
 * uma frase NOVA por pessoa, resposta a "what do you believe about leadership
 * that most people in this industry get wrong?". Essa continua sem existir, e
 * foi procurada em todos os cinco `.docx` do pacote de 15-09.
 *
 * POR QUE ISTO É CLIENT COMPONENT: só pelo estado de aberto/fechado do pop-up.
 */
export default function LeaderCard({
  person,
  profile,
}: {
  person: Leader;
  /**
   * O perfil desta pessoa no CMS — nome, cargo, foto, bio em HTML e os campos
   * estruturados (valores, forças, especialidades, histórico, clientes,
   * idiomas, credenciais). É o que o pop-up mostra.
   *
   * AUSENTE = SEM BOTÃO "+". Acontece quando a pessoa não tem `cmsSlug`, quando
   * o CMS não responde ou quando a entrada some do ar. O card continua inteiro;
   * o que desaparece é o gesto — porque "+" abrindo um pop-up vazio é pior que
   * "+" nenhum.
   */
  profile?: Person;
}) {
  const [open, setOpen] = useState(false);

  return (
    /* A VIRADA É EM 1440, e não num breakpoint do Tailwind, porque ela é de
       MEDIDA e não de dispositivo: em três colunas de uma página de 1440 cada
       card tem 432px, que partidos em retrato + quote dão ≈210 e ≈222 — o mínimo
       em que a quote ainda tem ~30 caracteres por linha. A 1280 a mesma conta dá
       ≈185px de caixa e a serifa passa a quebrar em 4 palavras por linha.

       Abaixo de 1440 o card volta a ser EMPILHADO (foto, nome, quote embaixo),
       que é o desenho que já estava no ar — só que a quote agora é o cartão
       claro em vez do filete à esquerda. O mockup é uma tela de 1440; é ali que
       ele se cumpre. */
    <article className="grid grid-cols-1 min-[1440px]:grid-cols-[minmax(0,1.14fr)_minmax(0,1fr)] min-[1440px]:gap-x-4">
      <div className="flex flex-col">
        {/* ⚠️ A FOTO ESTICA ACIMA DE 1440, e não tem proporção fixa. Medido na
            referência: na primeira fileira ela sai 167x167 e na segunda 167x154
            — mesma largura, alturas diferentes. Quem manda na altura da fileira
            é o CARTÃO DE QUOTE, e a foto cresce até encostar nele; nas duas
            fileiras a diferença entre cartão e foto é constante (61 e 60px), que
            é a altura do bloco do nome.

            Com `aspect-[4/5]` fixo, que era o que estava aqui, a coluna da
            esquerda terminava antes e o cartão rosa ficava pendurado abaixo do
            nome — é o desalinhamento que se via na página.

            `min-h` NÃO É ENFEITE: sem piso, uma quote curta encolheria a fileira
            até a foto virar uma tira. 240px é a altura que a referência dá à
            foto (~225) com uma folga. Abaixo de 1440 o card empilha e volta ao
            4:5, que é onde a proporção fixa faz sentido. */}
        <div className="relative aspect-[4/5] overflow-hidden bg-paper min-[1440px]:aspect-auto min-[1440px]:min-h-[240px] min-[1440px]:flex-1">
          {person.portrait ? (
            <Image
              src={person.portrait}
              alt={`${person.name}, ${person.role}`}
              fill
              /* A coluna do retrato encolheu: era 1/3 da página e agora é ≈48%
                 de 1/3 acima de 1440. Os valores abaixo seguem a escada de
                 breakpoints deste card, não a da grade de antes. */
              sizes="(min-width: 1440px) 15vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              className={`object-cover ${person.portraitPosition ?? "object-center"}`}
            />
          ) : (
            /* Sem retrato — iniciais, e não um avatar genérico de silhueta: o
               card fica claramente à espera de uma foto em vez de fingir ter
               uma. */
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-serif text-[44px] font-semibold text-line">
                {person.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            </div>
          )}
        </div>

        {/* NOME, CARGO E REGIÃO EM TRÊS LINHAS, como o mockup — e não na linha
            única vermelha em caixa alta que estava aqui (`{role} · {region}`).
            Não é troca de gosto: "CEO, Founder, Author, Head of MENA · UAE" tem
            44 caracteres, e em caixa alta com `tracking-[1.3px]` isso ocupa três
            linhas numa coluna de 210px. Empilhado em caixa baixa ocupa duas e
            lê como ficha, que é o que o mockup mostra.

            `justify-between` põe o "+" na borda direita DA COLUNA DO RETRATO,
            que é onde o mockup o desenha — alinhado com o cargo, não com o
            nome. */}
        <div className="flex items-center justify-between gap-4 pt-5">
          <div className="min-w-0">
            {/* 18px e não 20: medido na referência, a altura de caixa alta do
                nome é 1,33x a do cargo, o que com o cargo em 14px dá ~19px. Em
                20px o nome ficava mais pesado que o da referência e o bloco
                inteiro passava dos ~81px que ela reserva. */}
            <h3 className="font-serif text-[18px] font-semibold leading-[1.2] tracking-[-0.2px] text-ink">
              {person.name}
            </h3>
            <p className="mt-1 text-[14px] leading-[1.45] text-muted">
              {person.role}
            </p>
            <p className="text-[14px] leading-[1.45] text-muted">
              {person.region}
            </p>
          </div>

          {profile && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              /* O rótulo acessível diz DE QUEM é o perfil: numa página com seis
                 botões idênticos, "Open" seis vezes não navega. O glifo é
                 `aria-hidden` porque "+" lido em voz alta não acrescenta nada a
                 quem já recebeu este rótulo. */
              aria-label={`View ${person.name}’s profile`}
              className="flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-full border border-brand text-[18px] leading-none text-brand transition-colors hover:bg-brand hover:text-white"
            >
              <span aria-hidden>+</span>
            </button>
          )}
        </div>
      </div>

      {/* O CARTÃO DA QUOTE. `#fcf2f0` é o `brand` a ~6% sobre branco — o rosa
          pálido do mockup. Não virou token do tema de propósito: é a única
          superfície do site com essa cor, e um `--color-*` novo convida a
          espalhá-la antes de alguém decidir que ela é do sistema.

          `mt-6` até 1440 (o card está empilhado, e este é o vão entre a ficha e
          a quote) e `mt-0` acima, onde ele passa a ser a coluna vizinha e o topo
          tem de bater com o topo do retrato. A altura cheia vem do `stretch` que
          a grade já dá — é o que faz os três cartões da fileira terminarem na
          mesma linha, mesmo com quotes de tamanhos diferentes. */}
      <div className="mt-6 bg-[#fcf2f0] px-5 py-6 min-[1440px]:mt-0">
        {/* AS ASPAS SÃO DECORAÇÃO, não pontuação — daí `aria-hidden`. Se elas
            fossem texto, o leitor de tela anunciaria uma abertura de citação que
            nunca fecha. O `blockquote` abaixo é quem diz que aquilo é uma
            citação, e ele faz isso sem glifo nenhum. */}
        <span
          aria-hidden
          className="font-serif block text-[46px] font-semibold leading-[0.6] text-brand"
        >
          &ldquo;
        </span>
        <blockquote className="mt-4">
          {/* ⚠️ SEM CORTE DE LINHAS desde 15-09. Até ali a quote era cortada em
              8 linhas e o "+" abria o resto — era o único trabalho honesto que
              havia para o botão enquanto não existia bio. Agora ele abre o
              perfil, e um corte sem gesto para desfazê-lo esconderia conteúdo.

              O QUE ISSO CUSTA, e é o que o corte evitava: as quotes vão de 140 a
              271 caracteres, então o cartão mais alto da fileira estica os
              outros dois. É o que o mockup mostra — cartões de mesma altura com
              o texto no topo — e é o preço certo a pagar aqui. */}
          <p className="font-serif text-[16px] leading-[1.6] text-ink">
            {person.quote}
          </p>
        </blockquote>
      </div>

      {/* O POP-UP VIVE NO `document.body`, via portal. Este card é uma célula de
          grade com `overflow-hidden` em ancestrais e contexto de empilhamento
          próprio; um `fixed inset-0` renderizado aqui dentro seria recortado
          pela célula em vez de cobrir a tela. Mesma montagem do `PeopleGrid`.

          `createPortal` SÓ DEPOIS DE ABERTO, e nunca no servidor: `open` começa
          `false`, então o primeiro render — que é o do servidor — não toca em
          `document`. */}
      {open &&
        createPortal(
          <PersonModal person={profile!} onClose={() => setOpen(false)} />,
          document.body,
        )}
    </article>
  );
}
