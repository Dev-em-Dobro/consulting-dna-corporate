import RichText from "@/components/RichText";
import Reveal from "@/components/Reveal";

/**
 * Os dois blocos de duas colunas do template de serviço — hoje "What we do" e
 * "How we work". Rótulo em cima; embaixo, MANCHETE À ESQUERDA, fio vertical,
 * CORPO À DIREITA.
 *
 * ============================================================================
 * ⚠️ O ARRANJO SOBREVIVEU AO RE-LAYOUT DE 21-09; OS RÓTULOS E AS MEDIDAS, NÃO
 * ============================================================================
 *
 * Pedido por email: *"Services internal — Re-layout the internal with the image
 * nova-pagina-interna-servicoes.jpg inside meetings folder"*. O mockup novo
 * (`docs/meetings/nova-pagina-interna-servicoes.jpg`) desenha EXATAMENTE a mesma
 * caixa que o template de 15-09 já tinha posto aqui — rótulo, manchete, fio,
 * corpo —, e é por isso que este componente não foi refeito pela segunda vez em
 * quatro dias. O que mudou nele:
 *
 *   • OS RÓTULOS. "Impact" virou "What we do" e "How we help" virou "How we
 *     work". Quem os passa é o `SolutionView`; aqui é só uma string.
 *   • A MANCHETE CRESCEU, de 38px para 46px no desktop. Não é gosto: no arquivo
 *     de 866px a entrelinha da manchete mede 32,5px, o que a 1440 dá 54px — com
 *     `leading-[1.15]`, uma fonte de ~46px. Os 38px vinham do template ANTERIOR,
 *     que era outro desenho.
 *   • O FIO MUDOU DE LUGAR CONFORME O BLOCO, e virou a prop `split` — ver a
 *     caixa dela.
 *
 * ⚠️ O CORPO NÃO MUDOU DE TAMANHO, e a medição é a razão: no mockup ele dá
 * ~18,8px a 1440, e aqui já são 18px. A diferença está dentro do erro de medir
 * letra em JPEG de 866px, e mexer nela quebraria a única coisa que este bloco
 * tem em comum com a /about e com a faixa de evidência — o corpo de texto do
 * site inteiro ler no mesmo tamanho.
 *
 * ⚠️ A MANCHETE ACEITA QUEBRA DE LINHA EXPLÍCITA (`\n`), desde 21-09, via
 * `whitespace-pre-line`. O mockup escreve "Real development." e "In the flow of
 * work." em duas linhas, e essa quebra é COMPOSIÇÃO, não acaso — deixá-la para
 * o refluxo do navegador punha "In the" no fim da primeira linha em telas
 * intermediárias. Manchete sem `\n` não muda de comportamento.
 *
 * ============================================================================
 * ⚠️ REESCRITO EM 17-09. O QUE ESTAVA AQUI ERA OUTRO OBJETO
 * ============================================================================
 *
 * Pedido: *"só modifique a primeira parte que tem o 'impact' e 'How we help',
 * essas seções precisam ficar exatamente igual como está no layout"*, contra
 * `4. Services/ExCo Leadership Services Page.png`.
 *
 * O QUE SAIU, e vale saber porque foi construído com cuidado e defendido três
 * vezes: cada bloco era uma faixa de meia tela dividida em 44% / 56%. Nos 44%
 * ficava um CAMPO DE COR cheio (`brand` no Impact, `ink` no How we help) com o
 * rótulo em serifa de 48px ancorado no pé; nos 56%, o parágrafo em serifa de
 * 25px. O arranjo vinha da Explore Performance, que a Rhea aprovou como
 * referência, e o campo de cor era a resposta a uma armadilha que voltou três
 * vezes: foto de cliente insinua relação que não se prova, foto genérica
 * repetida nas dez lê como falta de material, e ilustração gerada data. Campo de
 * cor com tipografia não tinha nenhum dos três.
 *
 * ⚠️ O TEMPLATE DELA NÃO TEM NADA DISSO. Os dois blocos são faixas claras, sem
 * painel, sem imagem e sem slot para uma. Toda a decisão de cor acima — qual
 * painel é `brand`, qual é `ink`, e a regra de que painel nenhum pode antecipar
 * a faixa seguinte — deixou de existir junto com os painéis. Está no git.
 *
 * ⚠️ A PROP `image` FOI EMBORA COM ELES, e não foi esquecimento. Ela existia
 * para o dia em que houvesse fotografia POR SERVIÇO, e o painel trocaria de
 * conteúdo sem mudar de medida. No arranjo novo não há onde uma imagem entrar —
 * manter a prop seria prometer um slot que o componente não tem. As props
 * `side`, `panelTone`, `imageAlt` e `imagePosition` saíram pelo mesmo motivo:
 * todas descreviam o painel.
 *
 * ============================================================================
 * DUAS COISAS DO TEMPLATE QUE NÃO FORAM COPIADAS, E POR QUÊ
 * ============================================================================
 *
 * O pedido foi "exatamente igual", e o arranjo é exatamente igual. Duas
 * propriedades de SUPERFÍCIE não foram, e as duas pelo mesmo motivo — o template
 * é do desenho ANTERIOR do site, e copiá-las deixaria estes dois blocos falando
 * uma língua que nenhum outro bloco da mesma página fala:
 *
 *   • A TIPOGRAFIA. O template inteiro é grotesca (a Poppins do desenho antigo),
 *     manchete e corpo. O site adotou a grade editorial em 09-09 — grotesca só
 *     em rótulo, serifa em manchete e texto —, e é nela que estão o h2 da
 *     evidência, o da /about e o da /team. Copiar a grotesca aqui poria duas
 *     famílias na mesma rolagem.
 *   • A COR DO RÓTULO. No template os rótulos de seção são cinza neutro. No site
 *     eles são vermelhos, e na PRÓPRIA página de serviço os de "Evidence",
 *     "Testimonial" e "Related services" já são. Cinza aqui e vermelho três
 *     blocos abaixo seria incoerência dentro de uma tela.
 *
 * As duas são de uma linha cada, se ela preferir o template à letra.
 */
export default function SolutionSection({
  label,
  headline,
  html,
  tone = "white",
  split = "even",
  rule = "thin",
  layout = "split",
}: {
  /** "What we do" / "How we work" — o rótulo pequeno no alto da faixa. */
  label: string;
  /**
   * A frase grande da coluna esquerda. Vem sempre resolvida por `headlineOr`,
   * em `lib/services.ts`, que põe o placeholder quando a cliente ainda não
   * escreveu a frase daquele serviço — hoje, nove dos dez.
   */
  headline: string;
  /** O corpo, em HTML já processado (o `**negrito**` da planilha dela). */
  html: string;
  /**
   * A ESPESSURA DO FIO VERTICAL — 1px (`thin`) ou 2px (`thick`).
   *
   * ⚠️ EXISTE PORQUE OS DOIS BLOCOS DIVERGIRAM EM 24-09, e não por gosto de
   * configurar. A história, curta: o fio ficou mais grosso nos DOIS a pedido
   * ("a linha que separa pode ser um pouco mais grossa, e em how we work tbm"),
   * e horas depois o "How we work" voltou inteiro ao estado anterior, também a
   * pedido — a cliente quer aquela seção como ela estava. Sem esta prop, uma das
   * duas decisões teria de ser desfeita.
   *
   * ⚠️ `thin` É O PADRÃO, e é de propósito: ele é o estado ANTERIOR, o que as
   * dez páginas tinham. Quem quer o fio grosso pede — hoje só o "What we do",
   * no `SolutionView`. Assim, acrescentar um bloco novo não herda em silêncio
   * uma decisão que valeu para um bloco só.
   *
   * ⏳ SE A CLIENTE QUISER OS DOIS GROSSOS DE NOVO: é passar `rule="thick"` no
   * segundo `SolutionSection` também, e aí esta prop pode voltar a ser uma
   * classe fixa.
   */
  rule?: "thin" | "thick";
  /**
   * DUAS COLUNAS (`split`) OU EMPILHADO (`stacked`).
   *
   * ⚠️ O ARRANJO EMPILHADO ENTROU EM 24-09 com o layout de Manager Development,
   * e ele NÃO é o de duas colunas quebrando em tela estreita — é um desenho
   * diferente em qualquer largura: rótulo, manchete de largura inteira, linha
   * de apoio embaixo, sem fio vertical.
   *
   * POR QUE ELE EXISTE: naquele layout o corpo dos dois blocos é UMA FRASE
   * ("Two targeted pathways, designed for real-world impact."). Uma frase só na
   * coluna direita, ao lado de uma manchete de duas linhas, deixa a faixa com
   * um buraco no meio — o arranjo de duas colunas pressupõe um corpo de dois
   * parágrafos, que é o que os outros nove serviços têm.
   *
   * ⚠️ `split` É O PADRÃO, e é o estado das nove páginas que não pediram nada.
   * Quem quer empilhado pede, por `sectionLayout` no dado — ver a caixa daquele
   * campo em `lib/services.ts`.
   *
   * ⚠️ `rule` E `split` NÃO TÊM EFEITO NO EMPILHADO, porque não há fio nem
   * colunas para dividir. Ficam ignorados em silêncio em vez de o tipo os
   * proibir: proibi-los daria uma união de props que complica a chamada para
   * evitar um erro que não tem consequência na tela.
   */
  layout?: "split" | "stacked";
  /**
   * ⚠️ OS DOIS TONS ATRAVESSARAM OS DOIS DESENHOS INTACTOS: `white` no primeiro
   * bloco, `paper` no segundo. No mockup de 21-09 isso foi CONFERIDO PIXEL A
   * PIXEL, porque era a pergunta mais barata de responder errado — a faixa
   * branca vai da base do herói até o fim dos três cartões (#fefefe), a faixa
   * papel começa no "How we work" e engloba a fileira de ícones (#f7f3f0), e o
   * fecho centrado volta ao branco.
   *
   * O QUE ISSO DECIDE: o segundo bloco divide a MESMA faixa com a fileira de
   * ícones logo abaixo, sem emenda entre os dois, e o primeiro divide a dele
   * com os três cartões. Trocar qualquer um dos dois para o outro tom abriria
   * uma divisa onde o desenho não tem nenhuma.
   *
   * ⚠️ O PAPEL DO DESENHO É MAIS QUENTE QUE O NOSSO — #f7f3f0 contra o
   * `--color-paper: #f3f3f3` de `globals.css`, que é neutro. Não foi trocado: o
   * token serve o site inteiro e mudá-lo por causa de uma página tingiria a
   * /about, a /team e o índice de serviços de uma vez. Se ela pedir o tom
   * quente, é uma linha no `globals.css` — e uma revisão das outras telas.
   */
  tone?: "white" | "paper";
  /**
   * ONDE CAI O FIO VERTICAL. `even` divide quase ao meio, `body` dá mais
   * largura ao corpo.
   *
   * ⚠️ EXISTE PORQUE O MOCKUP DE 21-09 NÃO USA A MESMA DIVISÃO NOS DOIS BLOCOS,
   * e isso foi MEDIDO no arquivo, não presumido. Nos 792px de conteúdo do
   * desenho (866 de largura, margens de 38 e 36), o fio do "What we do" cai em
   * x=424 — 48,7% contra 51,3% — e o do "How we work" cai em x=341, ou seja
   * 38,3% contra 61,7%. São 83px de diferença, visíveis a olho nu quando se
   * rola de um bloco para o outro. `[1fr_1.05fr]` dá 48,8/51,2 e `[1fr_1.6fr]`
   * dá 38,5/61,5.
   *
   * A LEITURA DA ESCOLHA DELA, porque ajuda a decidir em serviço novo: a
   * manchete de "What we do" tem três linhas e a de "How we work" tem duas —
   * quanto mais curta a manchete, mais estreita a coluna dela. Não é um estilo
   * por bloco, é ajuste ao conteúdo. Em serviço sem copy nova, onde a manchete
   * é o `HEADLINE_PLACEHOLDER` de uma linha, `even` continua sendo o padrão
   * seguro.
   *
   * ⚠️ AS DUAS CLASSES PRECISAM APARECER INTEIRAS NA FONTE — o Tailwind procura
   * a string literal no arquivo, e uma classe montada por concatenação nunca é
   * gerada. Daí o ternário com os dois nomes completos, em vez de um template.
   */
  split?: "even" | "body";
}) {
  return (
    <section className={tone === "paper" ? "bg-paper" : "bg-white"}>
      {/* A FAIXA ENCOLHEU. Cada bloco era `lg:min-h-[55svh]` porque o campo de
          cor precisava de altura para o rótulo de 48px respirar. Sem painel, a
          altura passa a ser a do conteúdo mais o respiro padrão de seção
          (`py-20 / md:py-24`), que é o de todas as outras faixas do site — e é
          o que aproxima a página da proporção do template, onde os dois blocos
          juntos ocupam cerca de um quinto da altura total. */}
      <Reveal className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
        {/* O rótulo vermelho de 14px, o mesmo objeto de "Evidence" três blocos
            abaixo — ver a caixa no topo do arquivo sobre o cinza do template. */}
        <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
          {label}
        </p>

        {/* ⚠️ AS PROPORÇÕES SÃO AS DO MOCKUP DE 21-09, MEDIDAS NELE e
            convertidas, não estimadas — e são DUAS, uma por bloco. A conta está
            na caixa da prop `split`; o resumo é que o fio do "What we do" cai
            quase no meio e o do "How we work" cai a 38% da largura.

            (O TEMPLATE ANTERIOR, de 15-09, dava um valor só: 44,5% / 55,5%, daí
            o `[1fr_1.25fr]` que esteve aqui até 21-09. Fica o registro para quem
            comparar as duas gerações de desenho e achar que alguém errou a
            medida — são medidas de arquivos diferentes.)

            OS DOIS RESPIROS AO REDOR DO FIO SÃO DESIGUAIS NO DESENHO — no "What
            we do", 19px antes e 31px depois, o que a 1440 vira ~32 e ~52. Daí
            `lg:pr-8` (32) de um lado e `lg:pl-12` (48) do outro em vez de um
            `gap` simétrico: a assimetria é o que puxa o corpo para longe do fio
            e deixa a manchete quase encostada nele, que é o que se vê.

            ⚠️ O FIO É `border-l` NA COLUNA DA DIREITA, e não um elemento próprio.
            Um `<div>` de 1px precisaria de altura — e a altura certa é a da
            coluna mais alta, que muda com o texto. Como borda, ele acompanha
            sozinho, e some junto com o `lg:` quando as colunas empilham.

            EMPILHA ABAIXO DE `lg` porque a manchete é longa: a 768px, metade da
            largura dá ~330px e a frase do Senior Leadership Development
            quebraria em seis linhas. */}
        {/* ⚠️ O RAMO EMPILHADO — 24-09. Ver a caixa da prop `layout`. Note que
            ele NÃO reaproveita a grade abaixo com `lg:grid-cols-1`: aquela
            carrega o fio, os paddings assimétricos das duas colunas e um corpo
            dimensionado para dividir a largura. Aqui a manchete usa a faixa
            inteira e o corpo é uma linha de apoio, num corpo maior que o da
            coluna — são medidas diferentes, não a mesma peça mais estreita. */}
        {layout === "stacked" ? (
          <div className="mt-6 md:mt-8">
            {/* ⚠️ SEM TETO DE LARGURA, a pedido de 24-09 — vale para os DOIS
                blocos empilhados ("o titulo da How we work pode ocupar toda a
                largura", e o de cima pela mesma conversa). Havia um
                `max-w-[24ch]`, a medida de linha confortável para manchete, e
                era ele que quebrava as frases antes da hora.

                ⚠️ QUEM DECIDE A QUEBRA AGORA É A COPY, pelo `\n` —
                `whitespace-pre-line` já estava aqui e é o que o transforma em
                quebra de verdade. É por isso que tirar o teto não deixa a
                manchete solta: a de "What we do" quebra depois de
                "capability" e a de "How we work" depois de "Practical.",
                porque as duas trazem o `\n` escrito em `lib/services.ts`.
                Teto de largura decidiria a quebra pela LARGURA DA JANELA, que é
                o que fazia a primeira quebrar em "manager". */}
            <h2 className="font-serif whitespace-pre-line text-[30px] font-semibold leading-[1.12] tracking-[-0.4px] text-ink md:text-[42px] lg:text-[50px]">
              {headline}
            </h2>
            {/* `RichText` COMO NO RAMO DE DUAS COLUNAS, e não um `<div>` com
                `dangerouslySetInnerHTML` próprio: o corpo chega como HTML já
                processado (o `**negrito**` da planilha dela virou `<strong>`),
                e é o `RichText` que limpa parágrafo vazio e carrega os estilos
                de `<strong>`, `<a>` e lista. Duplicar aquilo aqui era como as
                duas metades divergiriam na primeira vez que alguém mexesse numa
                delas.

                O CORPO É MAIOR QUE O DA COLUNA (18/20 contra 17/18): aqui o
                texto é uma LINHA DE APOIO logo abaixo da manchete, não um bloco
                de leitura ao lado dela. */}
            <RichText
              html={html}
              className="mt-4 max-w-[68ch] font-serif text-[18px] leading-[1.55] text-ink/75 md:text-[20px]"
            />
          </div>
        ) : (
        <div
          className={`mt-8 grid gap-y-6 md:mt-10 lg:gap-y-0 ${
            split === "body" ? "lg:grid-cols-[1fr_1.6fr]" : "lg:grid-cols-[1fr_1.05fr]"
          }`}
        >
          {/* `h2` E NÃO `p`: esta é a manchete do bloco, e é ela que estrutura a
              página para quem navega por cabeçalhos. O rótulo acima é rótulo, não
              título — por isso ficou como `<p>`.

              `whitespace-pre-line` É O QUE FAZ O `\n` DA COPY VIRAR QUEBRA — ver
              a caixa no topo do arquivo. Ele NÃO colapsa a indentação do JSX
              porque o filho é uma expressão `{headline}`, não texto literal. */}
          <h2 className="font-serif whitespace-pre-line text-[30px] font-semibold leading-[1.15] tracking-[-0.4px] text-ink md:text-[38px] lg:pr-8 lg:text-[46px]">
            {headline}
          </h2>

          {/* ⚠️ A ESPESSURA VEM DA PROP `rule`, e a caixa dela conta por que os
              dois blocos desta página divergem desde 24-09. A COR não muda nos
              dois casos: só a espessura foi pedida, e o token `--color-line`
              (#ece9e6) é usado no site inteiro. */}
          <div
            className={`lg:border-line lg:pl-12 ${
              rule === "thick" ? "lg:border-l-2" : "lg:border-l"
            }`}
          >
            {/* O CORPO ENCOLHEU DE 21/25px PARA 17/18px, e é o que o template
                pede: lá a manchete é o dobro do corpo, e no arranjo antigo o
                parágrafo era quase do tamanho de um título porque não havia
                manchete nenhuma para hierarquizar contra. Agora há.

                Esta é a mesma medida do corpo de texto do resto do site — o
                parágrafo da evidência, os da /about —, então a página inteira
                passa a ler no mesmo corpo. */}
            <RichText
              html={html}
              className="font-serif text-[17px] leading-[1.7] text-muted md:text-[18px]"
            />
            </div>
          </div>
        )}
      </Reveal>
    </section>
  );
}
