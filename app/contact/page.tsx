import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import ContactForm from "@/components/ContactForm";
import TypeLabel from "@/components/TypeLabel";
import Reveal from "@/components/Reveal";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { offices } from "@/lib/offices";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact — Corporate DNA",
    description:
      "Tell us the leadership challenge you are facing. Offices in London, Miami, Singapore, Dubai and Riyadh.",
    alternates: localeAlternates("/contact"),
  };
}

/**
 * A página de contato — rota própria desde 11-09.
 *
 * ATÉ HOJE CONTACT SÓ EXISTIA COMO SEÇÃO DA HOME (`#contact`), e `/contact` era
 * um 308 para lá. Isso tinha um custo concreto: é a página que as pessoas
 * procuram pelo nome, é a que entra em assinatura de e-mail e em diretório, e
 * não havia endereço para mandar — só a home com âncora no fim. A seção da home
 * FICA: ela é ponto de conversão no fim daquela leitura, e as duas conviverem é
 * normal. O que muda é que agora existe destino.
 *
 * ⚠️ O REDIRECT TINHA DE SAIR DO `next.config.mjs` ANTES DESTA PÁGINA EXISTIR.
 * `["/contact", "/#contact"]` estava lá, e redirect é avaliado ANTES do
 * filesystem — com ele no lugar, este arquivo nunca seria alcançado e a rota
 * continuaria pulando para a home. É a mesma armadilha que a caixa do
 * `/our-clients` já descreve naquele arquivo.
 *
 * REFERÊNCIA: a /contact da Explore Performance, pedida em 11-09. O que veio de
 * lá é a ESTRUTURA — abrir com a conversa, o formulário com respiro próprio, e
 * os escritórios como contato direto em vez de só um endereço de e-mail. O que
 * NÃO veio: a faixa de números com selos de prêmio, os dois cards de produto
 * ("Book an Everest Experience", "Request a Programme Demo") e o depoimento com
 * badges no pé. Os dois cards são oferta deles e não temos equivalente; a faixa
 * de números repetiria o que a /our-impact já faz.
 *
 * ⚠️ FALTA A SEÇÃO "O QUE ACONTECE DEPOIS QUE VOCÊ ESCREVE", e a ausência é
 * decisão. É a melhor ideia da página da Explore — três passos numerados que
 * respondem "no que eu estou me metendo" antes de a pessoa enviar. Mas são três
 * blocos de copy nova, e o pedido do Guli em 29-08 foi parar de gerar copy com
 * IA. Escrever aqui seria exatamente isso. A frase que a home já tem ("a
 * considered, confidential point of view — not a sales pitch") é a semente, e
 * está no herói; os três passos precisam das palavras deles.
 *
 * TODA A COPY DESTA PÁGINA JÁ EXISTIA. O título e a linha de apoio do herói são
 * os da seção `#contact` da home, sem uma palavra mudada. O resto são rótulos
 * funcionais.
 */
export default function ContactPage() {
  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell footerTopBorder floatingNav>
        <SolutionHero
          eyebrow="Contact"
          title="What is changing, and where does leadership need to go?"
          subtitle="Tell us the leadership challenge you are facing. We will respond with a considered, confidential point of view — not a sales pitch."
        />

        {/* O FORMULÁRIO NÃO DIVIDE ESPAÇO COM TEXTO, ao contrário da home. Ali
            ele fica numa coluna ao lado de uma frase que o justifica, porque
            chega no fim de uma leitura longa; aqui a pessoa veio para escrever,
            e o herói já disse o que aquela coluna dizia.

            ⚠️ COLUNA DE 820px CENTRADA, e não os 1440 do herói. A primeira
            versão deixou o card na grade larga e o resultado foi um formulário
            de 720px sozinho com meia página vazia à direita. 1440 é MEDIDA DE
            GRADE — serve aos cinco cards de escritório logo abaixo —, e isto
            aqui é um campo para PREENCHER. É o mesmo critério, e a mesma
            medida, que a /insights e a /cases já usam para conteúdo de coluna
            única; o rótulo desce junto para dentro da coluna, então o bloco
            tem eixo próprio coerente em vez de um rótulo órfão lá na margem. */}
        <section className="bg-paper">
          <div className="mx-auto max-w-[820px] px-6 py-20 md:px-10 md:py-24">
            <TypeLabel>Send us a message</TypeLabel>
            <Reveal className="mt-12">
              {/* O `submit` fica no padrão `flat`, e não no `hover-fill` da
                  home: aquele botão é ink sobre vermelho e nasceu para o fundo
                  escuro de lá. Aqui o fundo é `paper` e o card é branco. */}
              <ContactForm />
            </Reveal>
          </div>
        </section>

        {/* OS ESCRITÓRIOS COMO CONTATO DIRETO — endereço, telefone e e-mail
            para copiar, e não o mapa.

            ⚠️ DE PROPÓSITO NÃO É O `LocationsBlock`. O mapa interativo com
            carrossel já é uma seção da HOME; repeti-lo aqui seria a mesma peça
            duas vezes. E ele responde outra pergunta — "onde vocês estão no
            mundo" — enquanto quem abre /contact quer o dado para AGIR: discar,
            mandar e-mail, colar num convite de calendário. Por isso `tel:` e
            `mailto:` de verdade em vez de texto solto.

            DUBAI E RIYADH SAEM SEM TELEFONE porque `lib/offices.ts` tem `tel:
            null` nos dois. A linha some em vez de virar traço ou "—": campo
            vazio anunciado é pior que campo ausente numa página de contato. */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
            <TypeLabel>Offices</TypeLabel>
            <Reveal className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {offices.map((o) => (
                <div key={o.slug} className="border-t border-line pt-6">
                  <h2 className="font-serif text-[22px] font-semibold leading-[1.2] tracking-[-0.2px] text-ink md:text-[24px]">
                    {o.city}
                  </h2>
                  <p className="mt-1 text-[13px] font-medium uppercase tracking-[1.3px] text-brand">
                    {o.country}
                  </p>
                  <address className="mt-5 not-italic font-serif text-[16px] leading-[1.6] text-muted">
                    {o.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                  <div className="mt-5 flex flex-col gap-1.5 text-[15px] leading-[1.5]">
                    {o.tel && (
                      /* `tel:` sem espaço nem hífen — o formato de exibição é
                         para ler, o do href é para o telefone discar. */
                      <a
                        href={`tel:${o.tel.replace(/[^+\d]/g, "")}`}
                        className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-brand"
                      >
                        {o.tel}
                      </a>
                    )}
                    <a
                      href={`mailto:${o.email}`}
                      className="break-all text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-brand"
                    >
                      {o.email}
                    </a>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      </SiteShell>
    </div>
  );
}
