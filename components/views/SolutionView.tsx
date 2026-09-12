import SolutionHero from "@/components/solutions/SolutionHero";
import SolutionSection from "@/components/solutions/SolutionSection";
import SolutionEvidence from "@/components/solutions/SolutionEvidence";
import SolutionCta from "@/components/solutions/SolutionCta";
import Reveal from "@/components/Reveal";
import { paragraphs, type Service, type ServiceTestimonial } from "@/lib/services";

/**
 * ⏳ OS DOIS BLOCOS APONTAM PARA O MESMO ARQUIVO HOJE, e os dois nomes existem
 * de propósito: quando o par definitivo chegar, é trocar um import cada e mais
 * nada — sem caçar uso dentro do JSX. Os recortes que os diferenciam estão no
 * ponto de uso, porque é lá que se vê o painel ao lado do texto.
 */
import outcomeImage from "@/public/solutions/dna-earth.jpg";
import helpsImage from "@/public/solutions/dna-earth.jpg";

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

      {/* A FOTO VOLTA AOS DOIS BLOCOS EM 12-09, e o que mudou desde 11-09 — quando
          ela saiu — não foi a opinião, foi a natureza do arquivo.

          O QUE TINHA SAÍDO, e por quê: eram duas FOTOGRAFIAS de evento, iguais
          nas dez páginas, e o `solutionSchema` só tem um campo de imagem (o do
          herói). Ou seja, eram a única coisa da página que o cliente não
          poderia trocar ao assumir o conteúdo — justamente a que mais ocupa
          tela. Pior: quase todo o acervo tem marca de terceiro à vista, e uma
          foto de cliente como ilustração genérica insinua uma relação que ela
          não prova.

          O QUE ENTRA NO LUGAR não é fotografia: é ILUSTRAÇÃO. Sem rosto, sem
          marca na parede, sem cliente exposto — e por isso pode repetir nas dez
          páginas sem o problema de antes. Ilustração repetida lê como
          identidade; fotografia repetida lê como falta de material. É a mesma
          distinção que a mensagem de fotos de 11-09 faz ao cliente.

          ⏳ AS DUAS SÃO A MESMA IMAGEM POR ENQUANTO, em recortes diferentes. O
          par definitivo — uma para o Outcome e outra para o How We Help — está
          para ser gerado. Quando chegar, é trocar os dois imports; o layout não
          muda.

          O RECORTE É O QUE DIFERENCIA os blocos hoje, e não é enfeite: o painel
          tem 44% de largura por uma tela de altura, ou seja, é um retrato alto
          recortando um arquivo apaisado. `34%` de altura pega a hélice; `66%`
          desce para as luzes de cidade. Mesma imagem, dois assuntos. */}
      <SolutionSection
        label="The Outcome"
        html={paragraphs(service.outcome)}
        side="left"
        tone="white"
        image={outcomeImage}
        imagePosition="object-[46%_34%]"
      />

      <SolutionSection
        label="How Corporate DNA Helps"
        html={paragraphs(service.howWeHelp)}
        side="right"
        tone="paper"
        image={helpsImage}
        imagePosition="object-[58%_66%]"
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

      {/* ⚠️ NÃO PONHA UMA GRADE DE "MORE SERVICES" AQUI. Ela chegou a existir,
          entre a citação e o CTA — as outras nove em `ServiceCard`, na ordem do
          documento, com a atual filtrada pelo slug — e saiu em 11-09 pela mesma
          régua que tirou o mural de clientes do índice: o §3.2 não pede. Ele
          fecha a página em seis blocos, e o sexto é o convite.

          O ARGUMENTO A FAVOR CONTINUA DE PÉ, e é por isso que fica escrito: a
          página termina no CTA, então quem não quiser falar com a gente naquele
          instante não tem para onde ir além do menu ou do botão de voltar. São
          dez serviços de públicos sobrepostos — quem lê Manager Development é
          candidato a High Performing Teams — e nada aqui diz que os outros
          existem.

          Diferente do mural, este bloco não afirmaria nada: são as nossas dez
          páginas com as banner statements que o próprio cliente escreveu. Mesmo
          assim é estrutura que o documento não pede, e isso é decisão dele.
          Se voltar, que volte como pedido — e aí é reinstalar o `ServiceCard`
          numa grade de três colunas com `headingLevel="h3"`, para não quebrar a
          escada de cabeçalhos sob o rótulo da seção. */}

      <SolutionCta
        strapline={service.cta.strapline}
        line={service.cta.line}
        ctaLabel={service.cta.label}
      />
    </>
  );
}
