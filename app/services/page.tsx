import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import ServiceCard from "@/components/solutions/ServiceCard";
import SolutionCta from "@/components/solutions/SolutionCta";
import TypeLabel from "@/components/TypeLabel";
import PartnersStrip from "@/components/PartnersStrip";
import Reveal from "@/components/Reveal";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { services } from "@/lib/services";
/* O MESMO ARQUIVO DA /about, importado e não copiado: é literalmente "the same
   backdrop" que ela pediu, e um segundo arquivo com outro nome garantiria que
   as duas páginas divergissem no dia em que o original dela chegar. */
import skylinePhoto from "@/public/skyline-dna.jpg";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Our Services — Corporate DNA",
    description:
      "Real impact for individuals, leaders, teams and organisations — ten ways in, each starting with what is at stake for the business.",
    alternates: localeAlternates("/services"),
  };
}

/**
 * O índice de serviços — outline de 09-09, §3.1: "hero, then ten cards in a
 * grid", e uma faixa de parceiros embaixo.
 *
 * O QUE SAIU DAQUI. A versão anterior lia os cards do CMS (`SolutionBoxList`,
 * com o sistema de caixas pretas que o Guli desenhou em 29-08) e era liderada
 * pelo `outcome`. Os dez do outline não estão no CMS, então a lista agora vem de
 * `lib/services.ts` — a caixa de abertura daquele arquivo explica a troca.
 *
 * O CARD LIDERA PELA BANNER STATEMENT, e não pelo outcome, porque é o que a
 * sub-linha promete: "Everyone starts with what is at stake for the business."
 * A banner statement é justamente a frase que diz o que está em jogo; o outcome
 * é a página de dentro.
 *
 * ⚠️ ERAM DUAS COLUNAS ATÉ 14-09, e o raciocínio de então fica registrado
 * porque ele não estava errado: em três colunas a última fileira dos dez cards
 * ficaria com um card sozinho, e a medida mais larga de duas acomodava as banner
 * statements, que têm duas linhas em quase todas. A cliente pediu QUATRO na
 * daily, e quatro resolve o mesmo problema por outro caminho — 4 + 4 + 2 fecha
 * a última fileira com um par, não com um órfão. O que se paga é a medida: ver
 * a caixa na própria grade.
 */
export default function SolutionsPage() {
  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell footerTopBorder floatingNav>
        {/* ⚠️ O SKYLINE ENTROU EM 14-09 e resolve DOIS pedidos da mesma daily:
            • item 8 — *"definitely need to change this image because some of the
              girls have their eyes closed."* A foto que estava aqui é a
              `service-hero-fallback.jpg`, a padrão compartilhada por onze rotas,
              e é nela que estão as pessoas de olhos fechados.
            • item 9 — *"I'm thinking with the services, if we use the same
              backdrop as we did the skyline again."* "A outra página" é a
              /about, e o arquivo é o skyline que ela mesma mandou em
              08-09: Big Ben, Marina Bay, Burj Khalifa e Kingdom Centre com a
              hélice de DNA atravessando o céu.

            SÓ AQUI, e não no `SolutionHero`. A padrão continua servindo as outras
            dez rotas: ela reclamou desta página, e trocar o fallback mudaria a
            /team, a /books e as oito de serviço sem pedido nenhum.

            ✅ O ARQUIVO MELHOROU EM 15-09. A `about-hero.jpeg` era a cópia que
            o WhatsApp gerou — 229 KB de JPEG já recomprimido, com o céu em
            blocos e os pontos da hélice empastados. O pacote do Drive trouxe o
            PNG de origem (`1.About Page/ChatGPT Image Sep 8...png`, 2,2 MB), que
            virou `public/skyline-dna.jpg` com uma única compressão em q90.

            ⚠️ O QUE ISSO NÃO RESOLVE: a RESOLUÇÃO. O PNG tem os mesmos
            1373x1145 (1,2:1) do arquivo antigo — é a mesma imagem sem a segunda
            compressão, não uma maior. Num herói de sangria total com dobra de
            ~1,9:1 o `object-cover` escala pela largura e corta ~38% da altura
            (o que sobra é a faixa do meio, onde moram o skyline e a hélice, que
            é o recorte que interessa), mas num monitor de 1920 o upscale segue
            em 1,4x. O pedido pelo arquivo em largura de dobra continua de pé.

            `object-[50%_38%]` SOBE O ENQUADRAMENTO. Centrado, o corte tira 19%
            de cima e 19% de baixo, e a ponta do Burj ficava rente à borda
            superior enquanto sobrava água no pé. Subir para 38% devolve céu
            acima das torres — que é onde o `h1` mora, à esquerda. */}
        <SolutionHero
          eyebrow="Our Services"
          title="Real impact for individuals, leaders, teams and organisations."
          subtitle="Ten ways in. Everyone starts with what is at stake for the business."
          imageUrl={skylinePhoto}
          imagePosition="object-[50%_38%]"
        />

        <section id="what-we-do" className="bg-paper">
          <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
            <TypeLabel>What we do</TypeLabel>
            {/* O `Reveal` ESCALONA OS DEZ CARDS, um atrás do outro, porque eles
                são filhos diretos dele — é para isso que o `stagger` do
                componente existe. Numa grade de dez, a entrada em cascata é o
                que diferencia uma lista longa de um paredão que aparece
                inteiro. */}
            {/* ⚠️ QUATRO COLUNAS DESDE 14-09, pedido da Maliha na daily (item
                10): *"we want to do four four four going across... and then the
                last two at the bottom."* São dez cards, então `grid-cols-4`
                entrega 4 + 4 + 2 sozinho — a "última fileira com dois" é
                consequência da conta, não uma regra escrita à mão.

                AS QUATRO SÓ VALEM DE `xl` PARA CIMA, e o `lg:grid-cols-2` que
                já existia FICA. Em quatro colunas a 1024px cada card tem 214px,
                e a banner statement (duas linhas em quase todas, a mais longa
                com 78 caracteres) quebraria em quatro palavras por linha. A 1280
                são 278px, que é a medida em que ela volta a ler. Até lá a página
                segue exatamente como estava no ar: uma coluna no telefone e no
                tablet, duas a partir de 1024.

                ✅ AS IMAGENS DOS CARDS ENTRARAM EM 15-09 (item 12). Ela
                respondeu *"use generic for now"*, então seis dos dez recebem as
                banners fotográficas do site antigo e os quatro restantes caem no
                campo de cor — a conta está em `cardImage`, em `lib/services.ts`.

                ⚠️ OS DOIS ÚLTIMOS OCUPAM DUAS COLUNAS, e é o que fecha a
                fileira. A fala dela foi "four four four going across and then
                the last two at the bottom", e o desenho que chegou depois
                (`4. Services/Example.png`) mostra o que isso quer dizer: os
                dois últimos não são cards estreitos sobrando numa fileira de
                quatro vagas, são cards LARGOS que dividem a fileira ao meio.
                4 + 4 + (2x2) fecha as três fileiras cheias.

                O `col-span` VAI NO PRÓPRIO CARD, e não num `<div>` em volta:
                os filhos diretos do `Reveal` são o que ele escalona, e embrulhar
                cada card trocaria o alvo da animação por uma caixa vazia.

                SÓ DE `xl` PARA CIMA. Abaixo disso a página é de duas colunas, e
                um `col-span-2` ali faria os dois últimos virarem faixas de
                largura total no meio de uma grade de dois. */}
            <Reveal className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
              {services.map((s, i) => (
                <ServiceCard
                  key={s.slug}
                  service={s}
                  index={i}
                  className={
                    i >= services.length - 2 ? "xl:col-span-2" : undefined
                  }
                />
              ))}
            </Reveal>
          </div>
        </section>

        {/* PARCEIROS — §3.1 do outline, a faixa sob a grade.
            ✅ AS DUAS MARCAS CHEGARAM EM 15-09, no pacote do Drive, e com isso o
            §3.1 ("two partner marks left, copy right") fica cumprido — era o
            item 15 da daily, e a faixa vinha desde 11-09 só com a copy,
            guardando o lugar delas à esquerda.

            A PROCEDÊNCIA IMPORTA MAIS QUE O ARQUIVO. Nome de instituição é
            marca registrada com regra de uso própria, e a nota anterior aqui
            dizia que não se improvisa com imagem achada na internet. Estes dois
            vieram DA CLIENTE, na pasta que ela mesma montou — ou seja, o aceite
            de uso é dela, que é exatamente o que faltava. Se alguém trocar por
            um arquivo "melhor" achado fora, perde isso.

            O outline também pede que ela e a Home leiam "from one CMS partner
            collection so the two pages cannot drift" — isso depende do tipo
            `partnership` no CMS, que ainda espera a migração 0007. Enquanto não
            roda, o texto vive aqui. */}
        {/* ⚠️ NÃO PONHA O MURAL DE CLIENTES AQUI. Ele chegou a existir entre
            esta faixa e a grade — as mesmas duas fileiras da home, lendo de
            `lib/logos.ts` — e saiu em 11-09 por uma razão só: o §3.1 não pede.
            O outline lista herói, dez cards e a faixa de parceiros, e a página
            entrega isso.

            O argumento a favor era razoável (sem ele a página é dez cards de
            texto e um parágrafo, sem prova de nada), e pode voltar — mas como
            pedido ao cliente, não como decisão nossa. O mural é afirmação sobre
            clientes REAIS, e `lib/logos.ts` registra que cada nome ali é
            aprovação da CDNA, não mudança de código. Se voltar, que volte pelo
            mesmo caminho por onde entrou na home. */}
        {/* ── A SEÇÃO INTEIRA É ESCURA · 18-09 ─────────────────────────────
            *"trocar todo o fundo para um background cinza escuro seguindo o
            padrão das cores do site."* Era `bg-white` com só o painel das marcas
            escuro (o pedido de 17-09, hoje registrado na prop `tone` do
            `PartnersStrip`, que é o que a home ainda precisa); agora a faixa
            inteira vai de margem a margem em `bg-ink`, que é o escuro quente que
            as outras faixas escuras do site já usam (home §approach e §contact,
            /about §purpose e §people) — "padrão das cores do site" é isto, e não
            um cinza neutro novo.

            O QUE MUDA JUNTO COM O FUNDO, e por quê:
              • `text-white` na seção e no `h2` (era `text-ink`).
              • Parágrafos em `text-white/80`, que é como a home escreve texto
                corrido sobre `ink`. O `text-muted` (#6b6b6b) que estava aqui
                dá ~2,9:1 sobre `ink` e não passa no AA; `white/80` dá ~9:1.
              • `TypeLabel onDark`, que troca `brand` por `brand-light` na régua
                e na palavra — a regra do `globals.css`: `brand` em fundo claro
                não é legível como texto sobre `ink` (2,87:1).

            A VIZINHANÇA CONTINUA COM DIVISA: acima é o `bg-paper` da grade de
            serviços, abaixo é o `SolutionCta` em `bg-brand` (vermelho), então o
            `ink` não encosta em outra faixa do mesmo tom. */}
        <section className="bg-ink text-white">
          {/* ⚠️ ESTE BLOCO MUDOU DE ARRANJO DUAS VEZES EM 17-09, e o registro das
              duas fica porque a segunda só se entende contra a primeira:

                1. Nasceu em DUAS COLUNAS com o título e as marcas à ESQUERDA e o
                   texto à direita (`md:grid-cols-[1fr_1.4fr]`), que é o que o
                   outline desenhava.
                2. Foi para EMPILHADO a pedido — *"vamos colocar o titulo, texto
                   e logos um embaixo do outro"*.
                3. E voltou a duas colunas, MAS ESPELHADO: *"tenta colocar os
                   logos na direita, e o texto na esquerda"*. É o arranjo de hoje.

              O que o passo 2 deixou de herança, e por isso não foi trabalho
              perdido: o TÍTULO FICOU COM O TEXTO. No arranjo original ele morava
              com as marcas, do outro lado da página do parágrafo que ele
              introduz. Agora rótulo, título e texto são uma coluna só, e as
              marcas são a outra — que é a divisão que o conteúdo pede.

              ⚠️ A MEDIDA DO TEXTO É A COLUNA, e não um `max-w` escrito à mão. A
              versão empilhada precisava de `max-w-[720px]` porque a linha inteira
              tinha 1360px; aqui o grid já entrega ~694px. Um `max-w` além disso
              seria um número que não faz nada hoje e mente amanhã, quando a
              proporção das colunas mudar.

              `items-center` ALINHA O PAINEL AO MEIO DO TEXTO. Os dois blocos têm
              alturas parecidas (~300px o texto, ~270px o painel), então centrado
              eles leem como um par; encostados no topo, a diferença viraria um
              degrau visível no pé da direita. */}
          <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-20 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-16 md:px-10 md:py-24">
            <div>
              <TypeLabel onDark>Partners</TypeLabel>
              <h2 className="font-serif mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.3px] text-white md:text-[34px]">
                The work is ours. The partners are chosen.
              </h2>

              {/* ⏳ O TEXTO É O ANTIGO, E NOMEIA SÓ DOIS DOS CINCO. Ele fala de
                  Harvard Business Impact e Imperial College London, que eram as
                  duas marcas da versão anterior; o painel ao lado mostra cinco.
                  Ficou assim a pedido (*"pode deixar o texto como esta (…) o
                  texto eu peço pra ela depois"*), e é pendência de CONTEÚDO da
                  cliente — escrever a frase de CLO100, YPO e Explore Performance
                  por conta própria seria inventar a natureza de três parcerias
                  reais. */}
              <div className="mt-6 space-y-5 font-serif text-[17px] leading-[1.7] text-white/80 md:text-[18px]">
                <p>
                  Most work is designed and delivered by our own faculty. Where a bespoke
                  programme calls for more, we bring partners in by design rather than by
                  default.
                </p>
                <p>
                  Harvard Business Impact for faculty research and a digital delivery spine
                  that scales. Imperial College London for applied innovation and customised
                  executive education. Each joins where the programme needs what they bring,
                  and not otherwise.
                </p>
              </div>
            </div>

            {/* ── AS MARCAS · HOJE É O `PartnersStrip` ─────────────────────
                A coluna da direita deixou de montar os logos à mão em 21-09: a
                cliente pediu que a home mostrasse este mesmo bloco (*"Have
                similar layout to in partnership with as services page"*), e a
                lista, as alturas por marca e o arranjo das fileiras foram para
                `components/PartnersStrip.tsx`, que é o que as duas telas usam. O
                raciocínio de cada decisão viajou junto e está lá — inclusive o
                tratamento que três das cinco marcas precisaram para viver no
                escuro, que é alteração de marca de terceiro e não pode se perder.

                ⚠️ AS FILEIRAS AGORA SÃO 2 + 3, E POR PEDIDO. Eram 3 + 2 por
                acidente da largura: as cinco viviam num `flex-wrap` só e quebravam
                onde a coluna mandava. Em 21-09 ela nomeou quem fica em cima —
                *"Partners - HBI and Imperial college on row 1"* —, então a quebra
                virou estrutura dentro do componente.

                `tone="dark"` E SEM `label`: a seção inteira já é `bg-ink` (ver a
                caixa na abertura da `<section>`), então os logos ficam direto
                sobre ela, num tom só, que foi o pedido de 18-09 — *"tirar a cor
                de fundo dos logos"*. E o rótulo desta coluna seria um terceiro
                cabeçalho: o `TypeLabel` e o `h2` ao lado já apresentam o bloco.
                Na home é o contrário, e é para isso que as duas props existem. */}
            <PartnersStrip />
          </div>
        </section>

        {/* A FAIXA DE CONVITE FALTAVA AQUI, e era a única página nova sem uma:
            as dez páginas de serviço fecham com ela, a home fecha no formulário,
            a /about e a /team fecham no mapa — só o índice caía do bloco de
            parceiros direto no rodapé.

            SEM PROPS, de propósito. Este é o convite COMPARTILHADO do site
            ("Ready to start the conversation?" / "Start a Conversation"), que é
            o que os padrões do componente já trazem. As trinta partes escritas
            pelo cliente são POR SERVIÇO; o índice não é um serviço, e escrever
            uma strapline para ele seria copy nossa numa página onde todo o
            resto é dele. */}
        <SolutionCta />
      </SiteShell>
    </div>
  );
}
