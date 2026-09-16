import SolutionHero from "@/components/solutions/SolutionHero";
import SolutionSection from "@/components/solutions/SolutionSection";
import SolutionPillars from "@/components/solutions/SolutionPillars";
import SolutionEvidence from "@/components/solutions/SolutionEvidence";
import SolutionCta from "@/components/solutions/SolutionCta";
import Reveal from "@/components/Reveal";
import ServiceCard from "@/components/solutions/ServiceCard";
import { paragraphs, services, type Service } from "@/lib/services";

/**
 * O template de página de serviço — "one template, ten instances".
 *
 * A ORDEM É A DO TEMPLATE DELA, e hoje é esta:
 *
 *   1. Hero            — nome, banner statement, imagem
 *   2. Impact          — o que muda no negócio      (era "The Outcome")
 *   3. How we help     — a intervenção              (era "How CDNA Helps")
 *   4. Pilares         — os termos da frase acima, com ícone
 *   5. Evidence        — o caso-carro-chefe, seus números e a citação
 *   6. Let's talk      — o convite, POR SERVIÇO
 *   7. Related services — quatro cards, do template dela
 *
 * ⚠️ O CONVITE VOLTOU PARA O FIM EM 16-09, E ISSO DESFAZ UM PEDIDO DELA DE
 * 15-09 — leia isto antes de "corrigir" a ordem de volta. Em 15-09 ela pediu o
 * convite ANTES da evidência, e a leitura virou "o que muda / como fazemos /
 * vamos conversar", com o caso e a citação como prova para quem não fechou ali.
 * O template que ela mesma mandou (`4. Services/ExCo Leadership Services
 * Page.png`) fecha com evidência → CTA, e a decisão da call de 16-09 foi seguir
 * o template. Ou seja: a ata de 15-09 continua dizendo o contrário desta ordem,
 * de propósito — quem a ler daqui a um mês não está diante de uma regressão,
 * está diante de uma decisão posterior. A NOSSA, de 16-09, contra o pedido dela
 * de 15-09 e a favor do desenho dela de 15-09.
 *
 * O QUE A VOLTA FAZ COM A LEITURA: o convite é de novo o fim da página, e chega
 * depois da prova em vez de antes dela — "o que muda / como fazemos / deu certo
 * aqui / vamos conversar". A faixa vermelha volta a ser o clímax de cor — e
 * passou a ser o ÚNICO campo de cor cheia da página depois que a evidência
 * ficou branca, em 16-09, o que só reforça o papel dela ali.
 *
 * ⚠️ O BLOCO 6 DO OUTLINE (Testimonial) DEIXOU DE SER SEÇÃO EM 16-09: a citação
 * virou a terceira coluna da faixa de evidência, ao lado da prova a que se
 * refere, como no template dela. O porquê está na caixa da prop `testimonial`
 * em `SolutionEvidence`.
 *
 * Os dois rótulos encurtaram em 15-09, seguindo os cabeçalhos da planilha dela
 * ("IMPACT OF THE WORK", "WHAT CDNA DOES TO HELP").
 *
 * O CONTEÚDO VEM DE `lib/services.ts`, não do CMS — o porquê está na caixa de
 * abertura daquele arquivo. Aqui isso aparece em duas coisas: os blocos de
 * evidência e de convite finalmente têm dado (a strapline e a linha do CTA não
 * existiam no CMS, e essa faixa vinha mostrando o texto padrão), e "The
 * Challenge" some. (A numeração acima mudou com a ordem; por isso a referência
 * aqui é pelo nome do bloco, não pelo número.)
 *
 * ⚠️ "THE CHALLENGE" SAIU. O template de cinco blocos do brief de 27-08 abria com
 * ele; o de 09-09 não tem esse bloco — o herói passou a carregar a "banner
 * statement", e é ela que ocupa aquele lugar.
 */
export default function SolutionView({ service }: { service: Service }) {
  return (
    <>
      <SolutionHero
        /* "Our Services", e não "Our Solutions": o menu acertado com o cliente
           em 08-09 chama a área de Services, e o índice abre com o mesmo rótulo.
           A rota segue `/solutions` de propósito — ver a caixa em `lib/nav.ts`
           sobre por que os caminhos não foram renomeados atrás dos rótulos. */
        eyebrow="Our Services"
        title={service.title}
        subtitle={service.banner}
      />

      {/* SEM IMAGEM NOS DOIS BLOCOS, e isto é a decisão de 12-09 — não um slot
          esperando arquivo. O painel é um CAMPO DE COR com o nome do bloco em
          corpo grande.

          COMO SE CHEGOU AQUI. Uma ilustração gerada chegou a entrar nos dois
          (a hélice sobre a Terra, em recortes diferentes), e antes dela havia
          fotografia de evento. Postas cinco direções lado a lado, esta foi a
          escolhida, e o argumento é o mais simples de todos: é a única que não
          pode ficar brega, não depende de arquivo que ainda não existe, e é
          DIFERENTE em cada uma das dez páginas de graça — porque o que preenche
          o campo é o nome do bloco, não uma imagem repetida.

          O QUE ISSO FECHA: a armadilha que voltou três vezes neste arquivo. Foto
          de cliente insinua relação que ela não prova; foto genérica repetida
          nas dez lê como falta de material; ilustração gerada resolve os dois e
          cria um terceiro, que é datar. Campo de cor com tipografia não tem
          nenhum dos três.

          ⚠️ O `image` CONTINUA SENDO PROP e o layout já sabe recebê-lo. No dia
          em que houver fotografia POR SERVIÇO — com campo de mídia por bloco no
          CMS, que é a nossa parte — é passar a imagem e o painel troca de
          conteúdo sem mudar de medida. Ver `docs/mensagem-grupo-fotos-servicos-
          11-09.ENVIAR.txt`, onde isso foi pedido ao cliente como sugestão de
          desenho e não como pendência de lançamento. */}
      {/* ⚠️ OS RÓTULOS MUDARAM EM 15-09, a pedido: "The Outcome" virou
          **Impact** e "How Corporate DNA Helps" virou **How we help**. Eles
          seguem os cabeçalhos da planilha dela, que chama as duas colunas de
          "IMPACT OF THE WORK" e "WHAT CDNA DOES TO HELP" — encurtados, porque
          aqui o rótulo é renderizado em corpo grande dentro do painel de cor e o
          nome antigo ocupava duas linhas.

          ⚠️ A MEDIDA CAIU PARA 48px NO DESKTOP EM 16-09 (`SolutionSection`, que
          hoje é 38px / 58px no md / 48px no lg) — eram 68px quando os rótulos
          foram encurtados. O motivo do encurtamento NÃO caiu junto: em 48px o
          nome antigo continua ocupando duas linhas no painel, e o corpo menor só
          reduz a folga que teria para caber.

          ⚠️ OS PAINÉIS NÃO VOLTARAM AO QUE ERAM QUANDO O CTA FECHAVA A PÁGINA, e
          a distribuição de hoje (`brand` no Impact, `ink` aqui) é agora uma
          escolha própria, não mais a consequência mecânica da ordem de 15-09.
          Isto foi REAVALIADO em 16-09, quando o CTA desceu de novo.

          A SEQUÊNCIA DE FUNDOS COM A ORDEM DE HOJE: herói `ink` → branco
          (Impact, painel `brand`) → paper (How we help, painel `ink`) → paper
          (pilares) → branco (evidência, clara desde 16-09) → `brand` (CTA) →
          branco (related).

          A regra do `SolutionSection` é que painel nenhum pode antecipar a faixa
          que vem depois, e a distribuição de hoje não antecipa nenhuma:

            • Trocar (ink no Impact) poria painel escuro ENCOSTADO no herói, que
              é `bg-ink` com foto escurecida. Escuro contra escuro, distância
              zero, logo na primeira dobra. É a única violação em jogo, e é cara.
            • Manter (ink aqui) deixa o painel escuro como o único respiro de
              peso no meio da página, agora que a evidência clareou. Ele ocupa
              44% da largura e não tem faixa escura nenhuma depois para antecipar.

          ⚠️ ISTO MUDOU DE NATUREZA EM 16-09. Enquanto a evidência era `ink`, o
          argumento a favor de manter era de DISTÂNCIA (o painel escuro ficava
          uma faixa acima de uma faixa escura, separado pelos pilares). Com a
          evidência branca, o conflito simplesmente não existe mais — e a decisão
          continua a mesma por um motivo novo, não pelo antigo.

          O `brand` do Impact e o `brand` do CTA ficam a três blocos um do outro,
          que é a maior distância que esta página permite, e o par lê como pinça
          de abertura e fecho em vez de repetição. */}
      <SolutionSection
        label="Impact"
        html={paragraphs(service.outcome)}
        side="left"
        tone="white"
        panelTone="brand"
      />

      <SolutionSection
        label="How we help"
        html={paragraphs(service.howWeHelp)}
        side="right"
        tone="paper"
        panelTone="ink"
      />

      <SolutionPillars items={service.pillars} />

      {/* ⚠️ A CITAÇÃO AGORA DEPENDE DA EVIDÊNCIA. Ela é a terceira coluna desta
          faixa desde 16-09, então serviço com citação e sem evidência não
          mostraria a citação. Hoje não existe esse caso — os dois com citação
          (Executive Coaching e Top 150) também têm evidência —, e o dia em que
          existir, a decisão é dar a ele um bloco de evidência ou devolver a
          faixa própria. */}
      {service.evidence && (
        <SolutionEvidence
          caseSlug={service.evidence.caseSlug}
          caseTitle={
            service.evidence.title
              ? `${service.evidence.client} — ${service.evidence.title}`
              : service.evidence.client
          }
          body={service.evidence.body}
          facts={service.evidence.facts}
          testimonial={service.testimonial}
          imageUrl={service.evidence.image}
        />
      )}

      {/* ⚠️ O CONVITE VOLTOU PARA CÁ EM 16-09, DESFAZENDO O PEDIDO DE 15-09 que
          o tinha subido para antes da evidência — o porquê inteiro está na caixa
          de abertura deste arquivo, e vale ler antes de mover isto de novo. Em
          resumo: o pedido de 15-09 era dela, o template de 15-09 também é dela e
          fecha com evidência → CTA, e a call de 16-09 escolheu o template. Nos
          cinco serviços sem evidência o CTA continua vindo logo depois dos
          pilares, como antes. */}
      <SolutionCta
        strapline={service.cta.strapline}
        line={service.cta.line}
        ctaLabel={service.cta.label}
      />

      {/* ✅ "RELATED SERVICES" VOLTOU EM 15-09, e voltou pelo caminho que a nota
          anterior exigia: como PEDIDO do cliente, não como decisão nossa.

          A HISTÓRIA, porque ela é o argumento. Esta grade existiu, entre a
          citação e o CTA, e saiu em 11-09 pela mesma régua que tirou o mural de
          clientes do índice — o §3.2 do outline fecha a página em seis blocos e
          o sexto é o convite, então estrutura extra era decisão do cliente e não
          nossa. Ficou escrito aqui que, se voltasse, voltaria "reinstalando o
          `ServiceCard` numa grade de três colunas". O template que ela mandou em
          15-09 (`4. Services/ExCo Leadership Services Page.png`) fecha a página
          exatamente com este bloco, sob o título "Related services".

          O ARGUMENTO A FAVOR, que sempre esteve de pé: sem ele a página termina
          no CTA, e quem não quiser falar com a gente naquele instante não tem
          para onde ir além do menu ou do botão de voltar. São dez serviços de
          públicos sobrepostos — quem lê Manager Development é candidato a High
          Performing Teams.

          QUATRO, E NÃO NOVE. O template dela mostra quatro cards. Nove seria a
          lista inteira outra vez, no pé de cada uma das dez páginas, e isso não
          é "related", é o índice repetido. `slice(0, 4)` sobre as outras nove na
          ordem do documento.

          ⚠️ AS QUATRO SÃO AS PRIMEIRAS DA LISTA, não uma escolha editorial de
          afinidade. O documento não diz quais serviços se relacionam com quais,
          e inventar esse mapa seria afirmar parentesco comercial que ninguém
          definiu — no template dela, as quatro ao pé do ExCo são Culture
          Transformation, Team Effectiveness, Organisational Transformation e
          Executive Coaching, e duas dessas nem são serviços desta lista. Quando
          o mapa vier, é trocar este `slice` por um campo `related` no dado.

          `headingLevel` NÃO EXISTE MAIS no `ServiceCard`, então os títulos aqui
          saem como `h2` — que é o mesmo nível dos outros blocos desta página e
          não quebra a escada de cabeçalhos, porque o rótulo "Related services"
          abaixo é um `<p>`, não um cabeçalho. */}
      {/* ⚠️ BRANCO DESDE 15-09, e era `paper`. Na ordem daquele dia este bloco
          vinha logo depois da faixa de citação, que também era `paper` — duas
          faixas cinzas encostadas viram uma massa só e o corte entre os assuntos
          some. Desde 16-09 a citação não é mais faixa e o CTA voltou a ser o
          último bloco antes daqui, então o vizinho de cima é SEMPRE o vermelho —
          nas dez páginas, com ou sem evidência. O branco continua sendo o degrau
          certo contra ele. */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
          <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
            Related services
          </p>
          <Reveal className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {services
              .filter((s) => s.slug !== service.slug)
              .slice(0, 4)
              .map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
          </Reveal>
        </div>
      </section>

    </>
  );
}
