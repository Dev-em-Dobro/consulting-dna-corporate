import Link from "next/link";
import Counter from "@/components/Counter";
import Reveal from "@/components/Reveal";
import { factIsMeasure, type ServiceFact } from "@/lib/services";

/**
 * Bloco 4 do outline — Evidence. Quatro cards de mesmo tamanho sobre faixa
 * escura.
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
 */
export default function SolutionEvidence({
  caseSlug,
  caseTitle,
  body,
  facts,
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
}) {
  const all = (facts ?? []).filter((f) => f.value?.trim());
  const impact = all.filter((f) => f.label === "Impact");
  const shown = [...impact, ...all.filter((f) => f.label !== "Impact")].slice(0, 4);

  return (
    <section className="bg-ink text-white">
      {/* Os filhos diretos deste `Reveal` são o rótulo, o título, o parágrafo,
          a grade de cards e o link — e é nessa ordem que eles entram. A grade
          entra como UM bloco, não card a card: os quatro têm o mesmo peso por
          decisão de 10-09, e escaloná-los daria a um deles a primazia de chegar
          primeiro, que é a hierarquia que aquela decisão desfez. */}
      <Reveal className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
        <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand-light">
          Evidence
        </p>

        {/* O nome do cliente como TEXTO, não como logo. A plaquinha de logo foi
            testada e descartada: os arquivos de `public/logos/` são as marcas em
            cores originais para fundo claro, e sobre escuro exigiriam uma
            plaqueta branca — um retângulo claro competindo com os cards. */}
        <h2 className="font-serif mt-5 max-w-[820px] text-[30px] font-semibold leading-[1.15] tracking-[-0.2px] text-white md:text-[38px]">
          {caseTitle ?? "The flagship client story"}
        </h2>

        {/* O parágrafo do outline — o que o trabalho foi, antes dos números.
            Nos cinco serviços com evidência ele existe; no caminho do CMS, não,
            e aí o bloco vai direto do título para os cards, como antes. */}
        {body && (
          <p className="mt-6 max-w-[820px] font-serif text-[17px] leading-[1.6] text-white/80 md:text-[18px]">
            {body}
          </p>
        )}

        {shown.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
            {shown.map((f, i) => (
              /* `min-h` + `mt-auto` NO NÚMERO, e os dois juntos é que fazem o
                 trabalho. Os valores têm comprimentos muito diferentes — "12"
                 contra "45% higher promotion rate", que quebra em duas linhas —
                 e sem isso os cards sairiam de alturas diferentes, que é
                 exatamente o que a hierarquia plana existe para evitar.
                 Alinhados pela BASE, os rótulos dos quatro caem na mesma linha
                 independentemente de o valor ter uma ou duas linhas.

                 O preenchimento é um gradiente de LUZ, não de cor: branco a 7%
                 no topo indo a 2% na base. Sobre `ink` isso dá volume ao card
                 sem introduzir uma cor nova na página — foi a versão escolhida
                 contra cinco com gradiente vermelho, vinho e carvão. */
              <div
                /* Pela posição, não pelo rótulo: o rótulo é opcional (a
                   "cascade line" da GSK não tem) e repetiria vazio. */
                key={i}
                className="flex min-h-[150px] flex-col rounded-2xl border border-white/12 p-7 md:p-8"
                style={{
                  backgroundImage:
                    "linear-gradient(160deg, rgba(255,255,255,.07), rgba(255,255,255,.02))",
                }}
              >
                <div className="mt-auto">
                  {/* MEDIDA E PALAVRA NÃO TÊM O MESMO TRATAMENTO, decidido em
                      11-09 porque os números estavam pequenos demais para o que
                      são: eles são a prova da seção, e saíam do mesmo tamanho de
                      um subtítulo. Quem decide é `factIsMeasure` — e vale ler a
                      caixa dele em `lib/services.ts`, porque "N-1 embedded" já
                      derrubou uma versão dessa regra.

                      ⚠️ O VERMELHO É O `brand-light`, NÃO O DA MARCA, e aqui a
                      conta não é opcional. Medido sobre o preenchimento REAL do
                      card (não sobre `ink` puro — há um gradiente de luz branca
                      de 7% a 2% por cima dele, fundo efetivo ~#3c3739):

                        brand      #d84339   2,66:1   ✗
                        brand-lt   #e47e77   4,20:1   ✓
                        branco     #ffffff  11,68:1   ✓

                      O mínimo para texto GRANDE é 3,0, e a partir de 24px todo
                      texto é grande para a norma — então o número passa, com
                      folga, e o vermelho cheio reprovaria mesmo assim. É a
                      mesma razão pela qual a régua do rótulo desta seção já usa
                      o tom claro.

                      A PALAVRA FICA BRANCA e num corpo intermediário. Pintar
                      "Management activated" de vermelho a 48px transformaria um
                      passo de uma sequência em manchete, e a cascata da GSK são
                      quatro passos de igual peso. Ela também é a única que pode
                      quebrar em duas linhas, e por isso mantém entrelinha de
                      texto e não de número. */}
                  {factIsMeasure(f) ? (
                    <Counter
                      value={f.value}
                      className="block font-semibold leading-[1.02] tracking-[-1.5px] text-brand-light text-[38px] md:text-[48px]"
                    />
                  ) : (
                    <div className="text-[21px] font-semibold leading-[1.25] tracking-[-0.3px] text-white md:text-[23px]">
                      {f.value}
                    </div>
                  )}
                  {f.label && (
                    <div className="mt-3 font-serif text-[14px] leading-[1.45] text-white/75 md:text-[15px]">
                      {f.label}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {caseSlug && (
          <Link
            href={`/cases/${caseSlug}`}
            className="mt-12 inline-flex items-center gap-2 border-b border-brand-light/50 pb-1 text-[14px] font-medium uppercase tracking-[1.3px] text-brand-light transition-colors hover:border-brand-light hover:text-white md:mt-14"
          >
            Read the client story <span aria-hidden>→</span>
          </Link>
        )}
      </Reveal>
    </section>
  );
}
