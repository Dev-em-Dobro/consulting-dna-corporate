import Image from "next/image";
import Link from "next/link";
import Counter from "@/components/Counter";
import Reveal from "@/components/Reveal";
import { factIsMeasure, type ServiceFact, type ServiceTestimonial } from "@/lib/services";

/**
 * Bloco 4 do outline — Evidence. Uma faixa clara em até três colunas: o caso
 * com seus números, a foto e a citação do cliente.
 *
 * ⚠️ A FAIXA ERA ESCURA E FICOU BRANCA em 16-09, a pedido, e é assim que o
 * template dela desenha. A troca não é só de `bg`: o vermelho do número passou
 * de `brand-light` para `brand` cheio pela regra do `globals.css` (claro →
 * `brand`, escuro → `brand-light`), e texto e réguas trocaram de `white/xx` para
 * `ink`/`muted`. Se um dia ela voltar a ser escura, os dois lados têm de voltar
 * juntos — meia volta deixa vermelho ilegível.
 *
 * ⚠️ E DE BRANCA PASSOU A `paper` EM 18-09, a pedido na daily. `paper` ainda é
 * fundo CLARO, então a regra acima não muda de lado: o vermelho segue `brand`
 * cheio, e texto e réguas seguem `ink`/`muted`. O que muda é a margem de
 * contraste — sobre #f3f3f3 o `brand` cai de 4,39:1 para ~3,99:1. Para os
 * números (≥32px, texto grande, mínimo 3,0) continua passando com folga; o
 * rótulo de 14px já estava abaixo do AA sobre branco e fica um pouco mais
 * abaixo aqui — é o mesmo caso dos outros rótulos vermelhos do site em fundo
 * `paper`, e se for corrigido é no token. Nenhum bloco interno usava `bg-paper`
 * ou `border-line`, então nada ficou invisível com a troca (as réguas são
 * `border-white/12`).
 *
 * ⚠️ E NO MESMO 18-09 O `paper` NÃO BASTOU: os pilares logo acima já são
 * `paper`, e as duas faixas se fundiam numa só — no localhost a mudança
 * "não pegava". O pedido foi *"um cinza mais escuro na seção"*, e ficou
 * `#e3dfdd`: cinza QUENTE, no mesmo matiz do `ink` e do `line` (#ece9e6),
 * um degrau abaixo do `line` (luminância 0,74 contra 0,82 do `line` e 0,90
 * do `paper`). É hex solto e não token pela mesma regra do painel de
 * partners: um só uso não justifica `--color-paper-2`; no segundo uso, vira.
 *
 * O QUE MUDOU JUNTO, e tem de andar junto: os três textos em `muted`
 * (#6b6b6b) caíam para 4,0:1 sobre este cinza — abaixo do AA de 4,5 para
 * texto corrido — e viraram `ink/75`, que dá ~4,9:1. O `brand` dos números
 * fica em 3,3:1, acima do mínimo 3,0 de texto grande (≥32px). Escurecer mais
 * do que isto derruba o vermelho; se a cliente quiser mais escuro ainda, a
 * faixa tem de virar ESCURA de vez (`ink`) e voltar a `brand-light` +
 * `white/xx`, como era antes de 16-09.
 *
 * ⚠️ E FOI O QUE ACONTECEU, ainda em 18-09. Na gravação da daily o pedido
 * para esta faixa é *"bolder — maybe another dark background with white
 * text"*, e o cinza médio era a leitura conservadora do resumo escrito. A
 * faixa volta a `ink` com os DOIS LADOS juntos, como a caixa de 16-09
 * avisa: rótulos, número em destaque e link em `brand-light`; título, nome
 * do fato e citação em `white`; texto corrido em `white/80`, legendas em
 * `white/70`; fios em `white/12`. A composição (grade assimétrica, foto,
 * citação) é a de 16-09, não a dos quatro cards de 10-09. Vizinhas: pilares
 * em `paper` acima, CTA em `brand` abaixo — claro → escuro → vermelho, sem
 * duas faixas escuras coladas.
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
 * peso visual — e, em 16-09, o CORTE EM QUATRO deixou de existir (o porquê está
 * no corpo do componente, onde `shown` é montado).
 *
 * DEGRADA VAZIO, porque cinco dos dez serviços não têm evidência ainda: sem
 * `caseSlug` o link some; sem fato nenhum, sai só o título e o texto; com menos
 * fatos, a linha encolhe sozinha.
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
   * seção própria. Ela existe em dois dos dez serviços, e uma faixa inteira para
   * dois casos em dez é uma seção que oito páginas mostram vazia ou pulam. No
   * template dela a citação mora aqui, ao lado da prova a que se refere.
   *
   * ⏳ SÓ UMA DAS DUAS É PUBLICÁVEL. O outline diz por quê: "Nine of the ten
   * have no publishable testimonial. Four have one identified but not chosen:
   * adidas, GSK Mexico, Heineken and Vodafone. Only Executive Coaching has text
   * that can ship." A segunda citação, a do Top 150, é o PLACEHOLDER DO MOCKUP
   * ("A quote from Dolf to be confirmed.") e está marcada como tal no dado —
   * ver a caixa dela em `lib/services.ts`. Escolher as quatro frases que faltam
   * é pendência de CONTEÚDO do cliente — o trabalho mais barato que mais muda
   * estas páginas —, e esta é a única lista delas no componente.
   */
  testimonial?: ServiceTestimonial;
  /**
   * A foto do caso, quando existe — sem ela a faixa fica sem a coluna do meio.
   * ⏳ Hoje só o Top 150 tem, e é um recorte provisório do mockup: a caixa do
   * campo `image` em `lib/services.ts` conta de onde veio e quando sai.
   */
  imageUrl?: string;
}) {
  /* ⚠️ O CORTE EM QUATRO SAIU EM 16-09, e a ORDEM ficou. Ele existia porque a
     grade tinha quatro células (`lg:grid-cols-4`) e o quinto fato não teria
     onde entrar; desde a reescrita desta faixa a linha é `flex flex-wrap` e
     absorve o quinto sem estourar nada. Manter o corte era manter um jeito
     SILENCIOSO de perder um fato — que é exatamente o defeito narrado no
     cabeçalho deste arquivo, quando o `.slice(0, 4)` sobre a lista terminada em
     "Impact" escondia o único número que provava o caso. Sem o corte, o pior
     que acontece com cinco é a linha quebrar.

     O "IMPACT" PRIMEIRO CONTINUA, agora só como ordem de leitura: o fato que diz
     se funcionou vem antes dos que dizem o tamanho. No dado de hoje nenhum
     serviço tem rótulo "Impact" — isto serve ao caminho do CMS, onde
     `caseFacts()` monta cinco na ordem fixa do brief e termina justamente nele. */
  const all = (facts ?? []).filter((f) => f.value?.trim());
  const impact = all.filter((f) => f.label === "Impact");
  const shown = [...impact, ...all.filter((f) => f.label !== "Impact")];

  /* AS TRÊS COLUNAS SE REAJUSTAM SOZINHAS, porque as quatro combinações existem
     no ar: cinco serviços não têm evidência nenhuma, três têm evidência sem foto
     nem citação, um tem citação (Executive Coaching) e um tem os dois (Top 150).

     ⚠️ O INVARIANTE É QUE CADA LINHA SOMA 12, e é por isso que os três valores
     saem juntos de uma linha só em vez de três ternários independentes: mexer em
     um deles é mexer nos outros dois, e escrito assim a conta fica visível de
     imediato. String vazia = a coluna não é renderizada naquele arranjo. */
  const hasImage = Boolean(imageUrl);
  const hasQuote = Boolean(testimonial);
  // caso · foto · citação — cada linha soma 12
  const [caseSpan, imageSpan, quoteSpan] =
    hasImage && hasQuote ? ["lg:col-span-5", "lg:col-span-4", "lg:col-span-3"]
    : hasImage           ? ["lg:col-span-5", "lg:col-span-7", ""]
    : hasQuote           ? ["lg:col-span-5", "", "lg:col-span-7"]
    :                      ["lg:col-span-12", "", ""];

  // `ink` desde 18-09 (era `bg-white`; passou por `paper` e `#e3dfdd` no mesmo
  // dia); o porquê e a regra de cores estão no cabeçalho.
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

                ⚠️ O VERMELHO É O `brand` CHEIO DESDE 16-09, e a troca veio junto
                com o fundo. Esta faixa era `ink` e passou a ser BRANCA a pedido;
                a regra que decide o token está na caixa de `--color-brand-light`
                em `app/globals.css` e é de uma linha: **`brand` em fundo claro,
                `brand-light` em fundo escuro**. Inverter isso aqui reprovaria —
                `brand-light` sobre branco é o mesmo erro que `brand` sobre `ink`,
                só espelhado. As medidas moram lá e não se repetem aqui: numeral
                duplicado fora da fonte envelhece em silêncio, que é o defeito que
                esta rodada já veio consertar uma vez.

                ⚠️ O RÓTULO DE 14px FICA A 4,39:1, um fio abaixo dos 4,5 do AA
                para texto normal — e 4,39 é o TETO desta cor, porque contra
                branco puro ela não vai além disso (a conta está no `globals.css`).
                Não é desvio local: é o mesmo caso de todos os rótulos vermelhos
                do site sobre fundo claro, incluindo o "Related services" três
                blocos abaixo. Se um dia isso for corrigido, corrige-se no token,
                não aqui.

                A RÉGUA DOS 24px É O QUE SUSTENTA ISSO, e é ela que só existe
                aqui: o mínimo de contraste para texto GRANDE é mais frouxo que o
                de texto normal, e a partir de 24px todo texto é grande para a
                norma. O número ficou mais necessário de conferir depois que
                encolheu de 38/48px para 32/38px nesta mesma reescrita — segue
                acima dos 24px com folga nos dois breakpoints, e é por essa régua
                que ele passa: em 32px, o teto de 4,39:1 do `brand` está muito
                acima do mínimo de 3,0 do texto grande.

                MEDIDA E PALAVRA SEGUEM COM TRATAMENTOS DIFERENTES, e quem decide
                é `factIsMeasure` — vale ler a caixa dele em `lib/services.ts`,
                porque "N-1 embedded" já derrubou uma versão dessa regra. A
                palavra fica em `ink` e num corpo intermediário: pintar "Management
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
                      <div className="mt-2 max-w-[200px] font-serif text-[14px] leading-[1.45] text-white/70">
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
                     (~58vw).

                     ⏳ HOJE SÓ O PRIMEIRO RAMO ACONTECE: cinco serviços chegam a
                     renderizar esta faixa, um único tem foto (o Top 150, com o
                     recorte provisório do mockup) e esse um também tem citação.
                     O segundo ramo é para quando as fotos da cliente chegarem
                     para os outros — oito dos dez não têm citação nenhuma, e
                     fixar 33vw faria o Next servir neles um arquivo dimensionado
                     para um terço da tela numa caixa de quase dois terços. */
                  sizes={
                    hasQuote
                      ? "(min-width: 1024px) 33vw, 100vw"
                      : "(min-width: 1024px) 58vw, 100vw"
                  }
                  /* ⚠️ RECORTE À DIREITA, a pedido em 16-09. A caixa é 4:5 e a
                     foto de hoje é 2:1, então o `object-cover` mostra só 40% da
                     largura dela — qual 40% é o que esta classe decide.

                     ⏳ ESTA É UMA PROP DE ARQUIVO, NÃO DE COMPONENTE, e vale
                     rever quando a foto definitiva chegar: `object-right` está
                     certo para a imagem que está aqui agora e pode estar errado
                     para a próxima. No dia em que houver foto por serviço, isto
                     vira campo do dado ao lado de `evidence.image`. */
                  className="object-cover object-right"
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
              <figcaption className="mt-5 text-[13px] font-medium uppercase not-italic tracking-[1.3px] text-white/70">
                {testimonial.attribution}
              </figcaption>
            </figure>
          )}
        </div>
      </Reveal>
    </section>
  );
}
