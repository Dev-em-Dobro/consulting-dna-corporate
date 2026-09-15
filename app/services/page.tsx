import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import ServiceCard from "@/components/solutions/ServiceCard";
import SolutionCta from "@/components/solutions/SolutionCta";
import TypeLabel from "@/components/TypeLabel";
import Reveal from "@/components/Reveal";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { services } from "@/lib/services";
/* O MESMO ARQUIVO DA /about, importado e não copiado: é literalmente "the same
   backdrop" que ela pediu, e um segundo arquivo com outro nome garantiria que
   as duas páginas divergissem no dia em que o original dela chegar. */
import skylinePhoto from "@/public/about-hero.jpeg";

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
              /about, e o arquivo é o `about-hero.jpeg` que ela mesma mandou em
              08-09: Big Ben, Marina Bay, Burj Khalifa e Kingdom Centre com a
              hélice de DNA atravessando o céu.

            SÓ AQUI, e não no `SolutionHero`. A padrão continua servindo as outras
            dez rotas: ela reclamou desta página, e trocar o fallback mudaria a
            /team, a /books e as oito de serviço sem pedido nenhum.

            ⚠️ O ARQUIVO É QUASE QUADRADO — 1373x1145 (1,2:1), 229 KB, e veio
            pelo WhatsApp. Na /about isso é contornado com uma caixa de 72% presa
            à direita; AQUI O HERÓI É DE SANGRIA TOTAL, então numa dobra de ~1,9:1
            o `object-cover` escala pela largura e corta ~38% da altura. O que
            sobra no quadro é a faixa do meio, que é onde moram o skyline e a
            hélice — é o recorte que interessa —, mas o upscale num monitor de
            1920 é 1,4x. Vale o mesmo pedido que já está anotado na /about:
            perguntar à Maliha o ORIGINAL dela, e não a cópia do WhatsApp.

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

                ⏳ FALTA A IMAGEM DE CADA CARD (item 12: *"a bit of image, just
                to call out each of the [services]"*). Os arquivos estão na lista
                que foi para ela e ainda não chegaram; quando chegarem, entram no
                `ServiceCard` e a grade não muda. */}
            <Reveal className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
              {services.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </Reveal>
          </div>
        </section>

        {/* PARCEIROS — §3.1 do outline, a faixa sob a grade.
            ⚠️ SEM AS DUAS MARCAS. O documento pede "two partner marks left, copy
            right", e não existe arquivo de logo da Harvard Business Impact nem
            do Imperial College em `public/logos/`. Nome de instituição é marca
            registrada com regra de uso própria, então não se improvisa com
            imagem achada: a faixa sai só com a copy até os arquivos (e o aceite
            de uso) chegarem, e o lugar das marcas já está reservado à esquerda.

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
        <section className="bg-white">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-20 md:grid-cols-[1fr_1.4fr] md:gap-16 md:px-10 md:py-24">
            <div>
              <TypeLabel>Partners</TypeLabel>
              <h2 className="font-serif mt-5 max-w-[420px] text-[28px] font-semibold leading-[1.15] tracking-[-0.3px] text-ink md:text-[34px]">
                The work is ours. The partners are chosen.
              </h2>
            </div>
            <div className="max-w-[640px] space-y-5 font-serif text-[17px] leading-[1.7] text-muted md:text-[18px]">
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
