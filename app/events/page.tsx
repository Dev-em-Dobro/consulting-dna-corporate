import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import EmptyNotice from "@/components/EmptyNotice";
import { localeAlternates } from "@/lib/seo/alternates";

/**
 * `noindex, follow` ENQUANTO NÃO HOUVER EVENTO. É o mesmo tratamento de
 * `/our-partnerships` e `/interviews`: a rota tem de responder, porque está no
 * menu, mas uma página fina sem conteúdo não se entrega ao buscador. O `follow`
 * fica para os links do rodapé continuarem valendo.
 *
 * Aqui a condição é CRAVADA e não calculada, e a diferença é o motivo: em
 * `/our-partnerships` o `noindex` depende de `partnerships.length === 0`,
 * então a página volta ao índice sozinha na primeira publicação do CMS. Não há
 * tipo "events" no CMS para contar, então não existe o que perguntar — no dia
 * em que o conteúdo chegar, alguém apaga esta linha e acrescenta `/events` ao
 * `app/sitemap.ts` no mesmo commit (os dois têm de concordar).
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Events | CorporateDNA",
    description:
      "Where CorporateDNA convenes leaders, the sessions, forums and gatherings behind our leadership advisory.",
    alternates: localeAlternates("/events"),
    robots: { index: false, follow: true },
  };
}

/**
 * `/events` — a página nasceu VAZIA, e isso é a resposta inteira ao pedido.
 *
 * O PEDIDO DE 21-09 FOI DE NAVEGAÇÃO: *"mudar book para events"* (anotação da
 * reunião; o e-mail da cliente não menciona Events em lugar nenhum). O que
 * mudou foi o item do menu — `lib/nav.ts`, onde antes havia `Books` —, e nada
 * mais veio junto. Não há programação, nem data, nem descrição, nem tipo
 * "events" no CMS (`lib/cms/`) de onde puxar qualquer coisa.
 *
 * ENTÃO POR QUE EXISTE. Um item de menu precisa de destino: sem esta rota,
 * clicar em "Events" dá 404 — que é pior que uma tela honestamente vazia, e é
 * exatamente o que o pedido não pede. O `EmptyNotice` diz ao visitante que o
 * conteúdo não chegou, e diz ao cliente, que é quem revisa esta página, o que
 * falta mandar.
 *
 * O PADRÃO É O DE `/awards` e `/our-partnerships`: PageHero + EmptyNotice, na
 * coluna de 820px, sem a tipografia editorial. Deliberado — essas são as rotas
 * que ainda não migraram para a linguagem nova (SolutionHero + Geist/Source
 * Serif), e uma página de scaffold entrando já na linguagem nova enquanto as
 * vizinhas de mesma natureza continuam na antiga só espalharia mais a divisão.
 * Quando o conteúdo chegar, esta migra com elas.
 *
 * ⏳ O TÍTULO É COPY NOSSA, como em toda página de scaffold do site. Vale o
 * aceite do cliente junto com o conteúdo — se ele mandar uma linha, ela ganha.
 * SEM SUBTÍTULO pela mesma razão registrada na /insights: o `subtitle` é uma
 * frase que diz o que está em jogo, e não existe frase dele para Events. Duas
 * linhas inventadas numa página sem conteúdo seriam duas vezes o problema.
 */
export default function EventsPage() {
  return (
    <SiteShell>
      <PageHero eyebrow="Events" title="Where we bring leaders together." />

      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-20 md:px-10 md:py-24">
          <EmptyNotice>
            Events are pending from CDNA. The 21-09 request moved this item into
            the menu; the programme itself, sessions, dates and descriptions, has not arrived yet, so nothing is published here.
          </EmptyNotice>
        </div>
      </section>
    </SiteShell>
  );
}
