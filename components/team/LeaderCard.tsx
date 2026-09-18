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
    /* A VIRADA É EM `xl` (1280) — baixou de 1440 em 15-09, junto com a grade da
       página, a pedido: em 1440 qualquer laptop de 1366 caía em duas colunas, e
       o pedido foi três por linha.

       O QUE DECIDE O LIMIAR é a medida da quote, não o dispositivo. Em três
       colunas de 1280, o cartão fica com 172px e a caixa de texto com 132 — ~16
       caracteres por linha. Estreito, mas é onde a referência dela também anda
       (~20 a 1440, com linhas do tipo "Leadership isn't" / "about having"). A
       1024 a mesma conta dá 11 caracteres, e aí não dá.

       Abaixo de `xl` o card volta a ser EMPILHADO (foto, nome, quote embaixo),
       que é o desenho que já estava no ar — só que a quote agora é o cartão
       claro em vez do filete à esquerda. A conta por largura está no comentário
       da grade, em `app/team/page.tsx`. */
    <article className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.14fr)_minmax(0,1fr)] xl:gap-x-4">
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

            O PISO É UMA PROPORÇÃO, e não um `min-h` em pixels — 15-09, depois
            de o retrato sair baixo demais. `aspect-[3/4]` CONTINUA VALENDO
            acima de 1440 e vira a altura MÍNIMA da foto; o `grow` só a estica
            além disso quando a quote ao lado pede mais.

            É `grow` E NÃO `flex-1`, e a diferença é o que faz isto funcionar:
            `flex-1` é `flex: 1 1 0%`, e a base zero descarta a altura vinda da
            proporção — a foto passaria a ter só o que sobrasse da fileira, que
            é como ela ficava baixa nas fileiras de quote curta. Com `grow` a
            base continua sendo a da proporção e o crescimento é por cima dela.

            SE A PROPORÇÃO PEDIR MAIS QUE A FILEIRA, quem cresce é a fileira: a
            altura de uma linha de grade é o maior dos dois lados, então o
            cartão de quote é que estica. Nunca há corte.

            3:4 E NÃO 4:5, que era o valor anterior: a foto ganha ~7% de altura
            na mesma largura. Vale nos dois regimes — empilhado abaixo de 1440 e
            partido acima.

            ================================================================
            ⚠️ O `grow` SAIU EM 18-09 — pedido da daily: *"the images on
            section 'Leadership' should be the same height"*.
            ================================================================
            Era ele que fazia as seis fotos saírem com alturas diferentes. Duas
            causas, e nenhuma delas é a proporção dos ARQUIVOS (o `object-cover`
            no quadro ignora isso):

              1. ENTRE FILEIRAS: a fileira tem a altura da quote mais longa dela
                 (140 a 271 caracteres), e a foto crescia até encostar no cartão.
                 Quotes diferentes → fileiras diferentes → fotos diferentes.
              2. NA MESMA FILEIRA: a foto é o que sobra depois do bloco do nome,
                 e o cargo ocupa 1 ou 2 linhas ("Head of UKEE" contra "CEO,
                 Founder, Author, Head of MENA") — 20px de diferença que iam
                 direto para a altura da foto do vizinho.

            E o custo escondido: em 1280 a foto chegava a 196×424 (0,46:1), uma
            tira vertical em que um retrato quadrado — que é como os novos de
            18-09 chegaram — mostraria só a faixa do nariz.

            AGORA A PROPORÇÃO É FIXA, 3:4, em todos os regimes. 3:4 e não 4:5
            por três motivos: é a mesma proporção do `PeopleRoster` logo abaixo
            e do `PersonModal` (uma só proporção de retrato na página); mantém
            o invariante de 17-09 de o retrato de apoio nunca ser maior que o
            da liderança nas DUAS dimensões (em 4:5 a Nicole/Carol/Maliha
            sairiam 4px mais altas que a liderança em 1440); e nenhum dos seis
            arquivos perde cabeça — quatro são 4:5 e cedem 6% nas laterais, o
            JP (0,83) cede 10%, e os dois novos, quadrados, cedem 25% de largura
            já recortada no arquivo. Nunca há corte vertical.

            O QUE VOLTA COM ISSO é o que a caixa acima descreveu em 14-09: o
            cartão rosa, esticado pela grade, passa abaixo do bloco do nome
            quando a quote é longa. A grade em `app/team/page.tsx` ganhou
            `sm:auto-rows-fr` para as duas fileiras terem a mesma altura, então
            esse excedente é o MESMO nos seis cards — silhueta idêntica, e não
            seis variações. É o preço de "mesma altura", e foi o pedido.

            ⚠️ E DE 3:4 PASSOU A 7:10 na revisão do mesmo 18-09 (*"ficou bom,
            mas pode aumentar levemente a altura das imagens"*): ~7% mais alto,
            uns 20px em 1440. Os três motivos do 3:4 acima ficam assim: (a) a
            liderança deixa de ter a MESMA proporção do `PeopleRoster` (3:4),
            mas continua sendo o retrato maior da página nas duas dimensões, que
            era o invariante que importava; (b) os seis arquivos (4:5, 0,83 e
            3:4) são todos MAIS LARGOS que 7:10, então o corte segue lateral —
            nunca vertical, nunca cabeça; (c) o cartão rosa ganha 20px de folga
            para a quote antes de passar abaixo do bloco do nome. */}
        <div className="relative aspect-[7/10] overflow-hidden bg-paper">
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
            {/* A RESERVA DE ALTURA É DO PAR CARGO+REGIÃO, e não do cargo.
                Desde 18-09 o bloco reserva linhas para o "+" e o pé da ficha
                saírem na mesma altura nos seis cards: dos seis cargos, dois
                quebram em duas linhas nas colunas de 1280–1440 ("CEO, Founder,
                Author, Head of MENA" e "Head of Thought Leadership &
                Innovation"), e sem reserva o bloco dos outros quatro terminava
                20px antes — o mesmo desalinhamento que a foto tinha, em
                miniatura. `lh` é a altura da própria linha, então a reserva
                acompanha o `leading`.

                ⚠️ A RESERVA ERA NO CARGO (`min-h-[2lh]` no `<p>` dele) e
                saiu de lá na revisão do mesmo dia: nos quatro cargos de uma
                linha a linha vazia ficava ENTRE o cargo e a região ("CEO
                Americas" / vão / "Americas"), e a ficha lia como três coisas
                soltas. Agora cargo e região são vizinhos imediatos e a reserva
                é do contêiner dos dois — `min-h-[3lh]` = cargo em até duas
                linhas + região —, então a linha vazia, quando existe, fica
                DEPOIS da região, onde não separa nada. Altura total do bloco é
                a mesma de antes; só o vão mudou de lugar. */}
            <div className="mt-1 min-h-[3lh] text-[14px] leading-[1.45] text-muted">
              <p>{person.role}</p>
              <p>{person.region}</p>
            </div>
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
      <div className="mt-6 bg-[#fcf2f0] px-5 py-6 xl:mt-0">
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
          /* ⚠️ A FOTO DO POP-UP É A DO CARD, sobrescrevendo a do CMS — 15-09.
             Sem isto a pessoa clica num retrato e abre outro: o `photoUrl` do
             CMS é a LEVA ANTIGA (o do Guilherme está gravado como
             `whatsapp-image-2026-07-25`, o do Nitin como `...-07-27`), e os
             oficiais que a Maliha mandou em 09-09 e 15-09 moram em
             `lib/team.ts`. Subir os novos pelo admin de produção não é possível
             desta máquina, então quem concilia as duas fontes é esta linha.

             É A MESMA CORREÇÃO QUE A HOME FAZIA com `officialPortrait(p.name)`,
             e sem o `?? profile.img` pelo mesmo motivo dela: quem não tiver
             retrato oficial abre o pop-up nas INICIAIS, em vez de voltar a
             publicar a foto velha. Foi a instrução — "as que não tiver pode
             deixar sem por enquanto". Hoje os seis têm.

             ⏳ QUANDO O CMS FOR ATUALIZADO, esta linha sai e o `profile` volta a
             bastar sozinho. */
          <PersonModal
            person={{ ...profile!, img: person.portrait }}
            onClose={() => setOpen(false)}
          />,
          document.body,
        )}
    </article>
  );
}
