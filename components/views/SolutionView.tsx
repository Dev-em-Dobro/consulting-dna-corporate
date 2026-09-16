import SolutionHero from "@/components/solutions/SolutionHero";
import SolutionSection from "@/components/solutions/SolutionSection";
import SolutionPillars from "@/components/solutions/SolutionPillars";
import SolutionEvidence from "@/components/solutions/SolutionEvidence";
import SolutionCta from "@/components/solutions/SolutionCta";
import Reveal from "@/components/Reveal";
import ServiceCard from "@/components/solutions/ServiceCard";
import {
  paragraphs,
  services,
  type Service,
  type ServiceTestimonial,
} from "@/lib/services";


/**
 * Bloco 5 do outline — Testimonial. Uma citação de cliente sobre este serviço.
 *
 * Renderiza nada quando não há citação, que é o caso de nove dos dez hoje. O
 * outline conta o mesmo: "Nine of the ten have no publishable testimonial. Four
 * have one identified but not chosen: adidas, GSK Mexico, Heineken and Vodafone.
 * Only Executive Coaching has text that can ship."
 */
function ClientPerspective({ testimonial }: { testimonial: ServiceTestimonial }) {
  return (
    <section className="bg-paper">
      <Reveal className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
        <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
          Client Perspective
        </p>
        <figure className="mt-12 max-w-[900px]">
          <blockquote className="font-serif text-[22px] font-medium leading-[1.4] tracking-[-0.2px] text-ink [text-wrap:balance] sm:text-[26px] md:text-[30px]">
            “{testimonial.quote}”
          </blockquote>
          <figcaption className="mt-6 text-[13px] font-medium uppercase not-italic tracking-[1.3px] text-brand">
            {testimonial.attribution}
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}

/**
 * O template de página de serviço — "one template, ten instances".
 *
 * A ORDEM MUDOU EM 15-09, a pedido. Era a do outline de 09-09 (§3.2) — hero,
 * outcome, how we help, evidência, citação, convite. Agora é:
 *
 *   1. Hero            — nome, banner statement, imagem
 *   2. Impact          — o que muda no negócio      (era "The Outcome")
 *   3. How we help     — a intervenção              (era "How CDNA Helps")
 *   4. Let's talk      — o convite, POR SERVIÇO
 *   5. Evidence        — o caso-carro-chefe e seus números
 *   6. Testimonial     — condicional, existe em um dos dez
 *   7. Related services — quatro cards, do template dela
 *
 * O QUE A TROCA FAZ COM A LEITURA: o convite deixa de ser o fim da página e
 * passa a fechar o par de blocos de texto — "o que muda / como fazemos / vamos
 * conversar". O caso e a citação viram a prova que vem DEPOIS do convite, para
 * quem não fechou ali. Os dois rótulos encurtaram junto, seguindo os cabeçalhos
 * da planilha dela ("IMPACT OF THE WORK", "WHAT CDNA DOES TO HELP").
 *
 * O CONTEÚDO VEM DE `lib/services.ts`, não do CMS — o porquê está na caixa de
 * abertura daquele arquivo. Aqui isso aparece em duas coisas: os blocos 4, 5 e 6
 * finalmente têm dado (a strapline e a linha do CTA não existiam no CMS, e esta
 * faixa vinha mostrando o texto padrão), e "The Challenge" some.
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
          aqui o rótulo é renderizado em 68px dentro do painel de cor e o nome
          antigo ocupava duas linhas.

          ⚠️ OS PAINÉIS TROCARAM DE COR, e isso é consequência da nova ordem, não
          gosto. A regra registrada no `SolutionSection` é que dois painéis da
          mesma cor não podem antecipar a faixa que vem depois. Antes o CTA
          (`bg-brand`) fechava a página, então o `brand` podia ficar no segundo
          painel. Agora o CTA subiu e vem LOGO DEPOIS deste bloco: manter o
          painel vermelho aqui encostaria vermelho em vermelho. O `ink` passa
          para cá e o `brand` sobe para o Impact, onde fica separado da faixa
          por uma seção inteira. */}
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

      {/* ⚠️ O CONVITE SUBIU, 15-09, a pedido: ele vinha por último e agora fecha
          o par de blocos de texto, antes da evidência. A leitura passa a ser
          "o que muda / como fazemos / vamos conversar", e o caso e a citação
          ficam como a prova que vem DEPOIS do convite, para quem não fechou
          ali. */}
      <SolutionCta
        strapline={service.cta.strapline}
        line={service.cta.line}
        ctaLabel={service.cta.label}
      />

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
        />
      )}

      {service.testimonial && <ClientPerspective testimonial={service.testimonial} />}

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
      {/* ⚠️ BRANCO DESDE 15-09, e era `paper`. Com a nova ordem este bloco passou
          a vir logo depois da citação, que também é `paper` — duas faixas cinzas
          encostadas viram uma massa só e o corte entre os assuntos some. Quando
          o serviço não tem citação (oito dos dez), o vizinho de cima é a
          evidência, que é `ink`, e o branco continua sendo o degrau certo. */}
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
