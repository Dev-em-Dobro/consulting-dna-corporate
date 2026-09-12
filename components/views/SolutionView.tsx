import SolutionHero from "@/components/solutions/SolutionHero";
import SolutionSection from "@/components/solutions/SolutionSection";
import SolutionEvidence from "@/components/solutions/SolutionEvidence";
import SolutionCta from "@/components/solutions/SolutionCta";
import ServiceCard from "@/components/solutions/ServiceCard";
import TypeLabel from "@/components/TypeLabel";
import Reveal from "@/components/Reveal";
import {
  paragraphs,
  services,
  type Service,
  type ServiceTestimonial,
} from "@/lib/services";

/**
 * O pé de cada página de serviço — as outras nove.
 *
 * POR QUE ELE EXISTE: até 11-09 a página de serviço era um beco. Ela terminava
 * na faixa de CTA, e quem não quisesse falar com a gente naquele instante não
 * tinha para onde ir a não ser o menu ou o botão de voltar. São dez serviços
 * cujos públicos se sobrepõem — quem lê "Manager Development" é candidato a
 * "High Performing Teams" — e nada na página dizia que os outros existiam.
 *
 * FICA ANTES DO CTA, e não depois: o convite é o fim da página em todas as dez,
 * e empurrá-lo para o meio para terminar numa grade de navegação inverte a
 * prioridade. Aqui a ordem é: você leu este, aqui estão os outros, e agora o
 * convite.
 *
 * ⚠️ EXCLUI O SERVIÇO ATUAL pelo slug. Sem isso a grade mostraria dez, com a
 * página em que a pessoa já está no meio delas.
 *
 * NÃO É UMA LISTA DE "RELACIONADOS": não há dado de relação entre serviços em
 * lugar nenhum — nem no outline, nem no CMS —, e inventar uma afinidade
 * ("quem vê isto também vê aquilo") seria editorial nosso sem base. São as
 * outras nove, na ordem do documento, que é a ordem deliberada dele.
 */
function MoreServices({ currentSlug }: { currentSlug: string }) {
  const others = services.filter((s) => s.slug !== currentSlug);
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
        <TypeLabel>More services</TypeLabel>
        <Reveal className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {others.map((s) => (
            <ServiceCard key={s.slug} service={s} headingLevel="h3" />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

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
 * OS SEIS BLOCOS SÃO OS DO OUTLINE DE 09-09 (seção 3.2), nesta ordem:
 *   1. Hero               — nome, banner statement, imagem
 *   2. The Outcome        — o que muda no negócio
 *   3. How CDNA Helps     — a intervenção
 *   4. Evidence           — o caso-carro-chefe e seus números
 *   5. Testimonial        — condicional, existe em um dos dez
 *   6. Start a Conversation — por serviço, não a faixa compartilhada
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

      {/* SEM FOTO NOS DOIS BLOCOS — ver a caixa no topo do `SolutionSection`.
          Em resumo: eram duas imagens genéricas repetidas nas dez páginas, e o
          CMS não tem campo por bloco para o cliente trocá-las. */}
      <SolutionSection
        label="The Outcome"
        html={paragraphs(service.outcome)}
        side="left"
        tone="white"
      />

      <SolutionSection
        label="How Corporate DNA Helps"
        html={paragraphs(service.howWeHelp)}
        side="right"
        tone="paper"
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

      <MoreServices currentSlug={service.slug} />

      <SolutionCta
        strapline={service.cta.strapline}
        line={service.cta.line}
        ctaLabel={service.cta.label}
      />
    </>
  );
}
