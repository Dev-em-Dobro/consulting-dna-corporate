import Image from "next/image";
import Link from "next/link";
import Counter from "@/components/Counter";
import Reveal from "@/components/Reveal";
import { factIsMeasure, type ServiceFact, type ServiceTestimonial } from "@/lib/services";

/**
 * Bloco 4 do outline — Evidence. Uma faixa escura em até três colunas: o caso
 * com seus números, a foto e a citação do cliente.
 *
 * ⚠️ A HISTÓRIA ABAIXO DESCREVE O DESENHO ANTERIOR — quatro cards de mesmo
 * tamanho em faixa de largura inteira —, e fica porque é o registro das rodadas
 * de escolha. O que sobreviveu delas está marcado no fim desta caixa.
 *
 * ESCOLHIDO EM 10-09 depois de quatro rodadas em `/evidence-tests` (rota
 * descartável). O caminho importa porque duas decisões foram REVERTIDAS:
 *
 *   1ª  Nove tratamentos gerais — cards com borda, cards com fio de luz, card
 *       único com foto, versão clara, foto retrato sangrando, logo do cliente
 *       como assunto. Escolhida: a grade assimétrica, com um número em destaque.
 *   2ª  Cinco variações da assimétrica, com o nome do cliente em texto.
 *   3ª  A assimétrica foi DESCARTADA: "um dado maior que os outros pode parecer
 *       que ele é mais importante e acho que não é a ideia". Os quatro voltam a
 *       ter o mesmo peso.
 *   4ª  Seis cores de card, sobre a referência `card ref services.png` (canto
 *       arredondado, gradiente diagonal, ícone em badge). Escolhida a mais
 *       sóbria — sem gradiente de cor, só borda e um preenchimento de luz — e
 *       SEM os ícones que a referência traz.
 *
 * ⚠️ A HIERARQUIA PLANA CONTRARIA O OUTLINE, e isso é decisão de composição do
 * cliente, não descuido nosso. Dos cinco fatos que `caseFacts()` monta, quatro
 * respondem "quanto foi grande?" (países, participantes, alcance, duração) e um
 * responde "funcionou?" (impacto). O outline de Services critica exatamente essa
 * indistinção sobre este mesmo caso: "The figures are scale, not impact. 150
 * leaders and 18 months tell a reader how big it was, not whether it worked.
 * Heineken needs one number that says what changed." Se o assunto voltar numa
 * call, é este o texto a citar.
 *
 * ⚠️ O QUE NÃO SE PERDE: o `Impact` continua sendo o PRIMEIRO card. Este bloco
 * fazia `.slice(0, 4)` sobre a lista, que termina justamente no impacto — o
 * quinto caía sempre, e o quinto é o único que prova. No Heineken isso
 * significava publicar "12 países, 450 líderes, global, 18 meses" e esconder
 * "45% higher promotion rate". A correção da ordem fica; o que mudou foi só o
 * peso visual.
 *
 * DEGRADA VAZIO, porque nove dos dez serviços não têm caso ainda: sem
 * `caseSlug` a página não renderiza o bloco; sem fato nenhum, sai só o título e
 * o link; com menos de quatro, a grade encolhe sozinha.
 *
 * ⚠️ A FAIXA VIROU TRÊS COLUNAS EM 16-09, e a citação do cliente entrou como a
 * terceira delas — os cards de largura inteira acima descrevem o desenho
 * anterior, e a decisão de 10-09 que vale daqui para frente é a do PESO IGUAL
 * entre os números, não a do cartão. Os números continuam com o mesmo peso
 * entre si; o que saiu foi a moldura de cartão, que não cabe numa coluna de
 * 5/12. Ver os comentários no corpo do componente.
 */
export default function SolutionEvidence({
  caseSlug,
  caseTitle,
  body,
  facts,
  testimonial,
  imageUrl,
}: {
  /**
   * Ausente quando a evidência não tem página de caso para abrir — os três
   * clientes que o outline cita e que não estão no acervo (Vodafone, adidas,
   * GSK Mexico) e o resumo da prática de coaching, que não é um caso. Sem ele o
   * bloco fecha no texto e nos números, sem link morto.
   */
  caseSlug?: string;
  caseTitle?: string;
  body?: string;
  facts?: ServiceFact[];
  /**
   * A citação do cliente — TERCEIRA COLUNA desta faixa desde 16-09, e não mais
   * seção própria. Ela existe em um dos dez serviços, e uma faixa inteira para
   * um caso em dez é uma seção que nove páginas mostram vazia ou pulam. No
   * template dela a citação mora aqui, ao lado da prova a que se refere.
   *
   * ⏳ NOVE DOS DEZ NÃO TÊM CITAÇÃO, e o outline diz por quê: "Nine of the ten
   * have no publishable testimonial. Four have one identified but not chosen:
   * adidas, GSK Mexico, Heineken and Vodafone. Only Executive Coaching has text
   * that can ship." Escolher aquelas quatro frases é pendência de CONTEÚDO do
   * cliente — o trabalho mais barato que mais muda estas páginas —, e esta é a
   * única lista delas no componente.
   */
  testimonial?: ServiceTestimonial;
  /** A capa do caso, quando existe. Sem ela a faixa fica sem a coluna do meio. */
  imageUrl?: string;
}) {
  const all = (facts ?? []).filter((f) => f.value?.trim());
  const impact = all.filter((f) => f.label === "Impact");
  const shown = [...impact, ...all.filter((f) => f.label !== "Impact")].slice(0, 4);

  /* AS TRÊS COLUNAS SE REAJUSTAM SOZINHAS, porque as quatro combinações existem
     no ar: cinco serviços não têm evidência nenhuma, quatro têm evidência sem
     caso ligado, um tem caso e um tem citação. */
  const hasImage = Boolean(imageUrl);
  const hasQuote = Boolean(testimonial);
  const caseSpan = hasImage || hasQuote ? "lg:col-span-5" : "lg:col-span-12";
  const imageSpan = hasQuote ? "lg:col-span-4" : "lg:col-span-7";
  const quoteSpan = hasImage ? "lg:col-span-3" : "lg:col-span-7";

  return (
    <section className="bg-ink text-white">
      {/* Os filhos diretos deste `Reveal` são o rótulo e a grade das três
          colunas — e a grade entra como UM bloco, não coluna a coluna: os
          números têm o mesmo peso por decisão de 10-09, e escaloná-los daria a
          um deles a primazia de chegar primeiro, que é a hierarquia que aquela
          decisão desfez. */}
      <Reveal className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
        <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand-light">
          Evidence
        </p>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className={caseSpan}>
            {/* O nome do cliente como TEXTO, não como logo. A plaquinha de logo
                foi TESTADA E DESCARTADA, e o registro fica para não voltar como
                ideia nova: os arquivos de `public/logos/` são as marcas em cores
                originais para fundo claro, e sobre escuro exigiriam uma plaqueta
                branca — um retângulo claro competindo com o resto da faixa. */}
            <h2 className="font-serif text-[30px] font-semibold leading-[1.15] tracking-[-0.2px] text-white md:text-[38px]">
              {caseTitle ?? "The flagship client story"}
            </h2>

            {/* O parágrafo do outline — o que o trabalho foi, antes dos números.
                Nos cinco serviços com evidência ele existe; no caminho do CMS,
                não, e aí o bloco vai direto do título para os números. */}
            {body && (
              <p className="mt-6 font-serif text-[17px] leading-[1.6] text-white/80 md:text-[18px]">
                {body}
              </p>
            )}

            {/* OS NÚMEROS PERDERAM O CARTÃO, 16-09. Eles eram quatro caixas com
                borda e gradiente numa faixa de largura inteira; numa coluna de
                5/12 as caixas ficariam estreitas demais para o valor e o rótulo.
                O template dela mostra os números em linha, separados por régua.

                ⚠️ O VERMELHO CONTINUA SENDO O `brand-light`, E A CONTA FOI
                REFEITA porque o fundo mudou. Os números antigos (2,66:1 e
                4,20:1) eram medidos sobre o preenchimento do CARTÃO — `ink` com
                um gradiente de luz branca por cima, fundo efetivo ~#3c3739 —, e
                o cartão deixou de existir. Sobre `ink` puro (#373234), que é o
                fundo de hoje, valem as medidas já registradas na caixa de
                `--color-brand-light` em `app/globals.css`:

                  brand      #d84339   2,87:1   ✗
                  brand-lt   #e47e77   4,53:1   ✓

                A conclusão não muda — o tom claro é o que se usa —, mas o
                vermelho cheio reprova aqui por 2,87, não por 2,66.

                A RÉGUA DOS 24px É O QUE SUSTENTA ISSO, e ela ficou mais
                necessária depois que o número encolheu de 38/48px para 32/38px
                nesta mesma reescrita: o mínimo para texto GRANDE é 3,0, e a
                partir de 24px todo texto é grande para a norma. O número segue
                acima do corte com folga nos dois breakpoints, e o `brand-light`
                passa até na régua de 4,5 do texto normal.

                MEDIDA E PALAVRA SEGUEM COM TRATAMENTOS DIFERENTES, e quem decide
                é `factIsMeasure` — vale ler a caixa dele em `lib/services.ts`,
                porque "N-1 embedded" já derrubou uma versão dessa regra. A
                palavra fica BRANCA e num corpo intermediário: pintar "Management
                activated" de vermelho em corpo de manchete transformaria um
                passo de uma sequência em título, e a cascata da GSK são quatro
                passos de igual peso. Ela também é a única que pode quebrar em
                duas linhas, e por isso mantém entrelinha de TEXTO
                (`leading-[1.25]`) e não de número (`leading-[1.02]` no
                `Counter`). */}
            {shown.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-6 border-t border-white/12 pt-8">
                {shown.map((f, i) => (
                  /* Pela posição, não pelo rótulo: o rótulo é opcional (a
                     "cascade line" da GSK não tem) e repetiria vazio. */
                  <div key={i} className="min-w-[120px]">
                    {factIsMeasure(f) ? (
                      <Counter
                        value={f.value}
                        className="block font-semibold leading-[1.02] tracking-[-1.5px] text-brand-light text-[32px] md:text-[38px]"
                      />
                    ) : (
                      <div className="text-[19px] font-semibold leading-[1.25] tracking-[-0.3px] text-white md:text-[21px]">
                        {f.value}
                      </div>
                    )}
                    {f.label && (
                      <div className="mt-2 max-w-[200px] font-serif text-[14px] leading-[1.45] text-white/75">
                        {f.label}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {caseSlug && (
              <Link
                href={`/cases/${caseSlug}`}
                className="mt-10 inline-flex items-center gap-2 border-b border-brand-light/50 pb-1 text-[14px] font-medium uppercase tracking-[1.3px] text-brand-light transition-colors hover:border-brand-light hover:text-white"
              >
                Read the client story <span aria-hidden>→</span>
              </Link>
            )}
          </div>

          {imageUrl && (
            <div className={imageSpan}>
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={imageUrl}
                  alt=""
                  aria-hidden
                  fill
                  /* O `sizes` ACOMPANHA A LARGURA REAL DA COLUNA, que depende da
                     citação: com ela a foto é 4/12 (~33vw), sem ela é 7/12
                     (~58vw) — e é esse o caso de nove dos dez serviços. Fixar
                     33vw faria o Next servir, nessas nove, um arquivo dimensionado
                     para um terço da tela numa caixa de quase dois terços. */
                  sizes={
                    hasQuote
                      ? "(min-width: 1024px) 33vw, 100vw"
                      : "(min-width: 1024px) 58vw, 100vw"
                  }
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {testimonial && (
            <figure className={`${quoteSpan} border-white/12 lg:border-l lg:pl-8`}>
              <p className="text-[13px] font-medium uppercase tracking-[1.3px] text-brand-light">
                Testimonial
              </p>
              <blockquote className="mt-6 font-serif text-[19px] leading-[1.5] text-white md:text-[21px]">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-5 text-[13px] font-medium uppercase not-italic tracking-[1.3px] text-white/60">
                {testimonial.attribution}
              </figcaption>
            </figure>
          )}
        </div>
      </Reveal>
    </section>
  );
}
