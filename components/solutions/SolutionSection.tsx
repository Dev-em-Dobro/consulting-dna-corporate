import RichText from "@/components/RichText";
import Reveal from "@/components/Reveal";

/**
 * Os dois primeiros blocos do template de serviço — Impact e How we help.
 * Rótulo em cima; embaixo, MANCHETE À ESQUERDA, fio vertical, CORPO À DIREITA.
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
}: {
  /** "Impact" / "How we help" — o rótulo pequeno no alto da faixa. */
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
   * ⚠️ OS DOIS TONS FICARAM COMO ESTAVAM: `white` no Impact, `paper` no How we
   * help. Não é inércia — é o que o template mostra. Lá o Impact é uma faixa um
   * degrau mais escura que o herói e o How we help divide a MESMA faixa com os
   * cinco pilares logo abaixo, sem emenda entre os dois. Como os pilares já são
   * `paper` e o pedido foi para não tocar neles, `paper` aqui é o que mantém a
   * emenda invisível. Trocar para branco abriria uma divisa onde o template não
   * tem nenhuma.
   */
  tone?: "white" | "paper";
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

        {/* ⚠️ AS PROPORÇÕES SÃO AS DO TEMPLATE, MEDIDAS NELE e convertidas, não
            estimadas. No arquivo de 1024px de largura a coluna da manchete ocupa
            372px e a do corpo 464px, com o fio vertical entre elas — ou seja
            44,5% contra 55,5% do conteúdo. `[1fr_1.25fr]` dá 44,4% / 55,6%.

            OS DOIS RESPIROS AO REDOR DO FIO SÃO DESIGUAIS NO TEMPLATE — 29px
            antes, 52px depois, o que a 1440 vira ~41 e ~73. Daí `lg:pr-10` (40)
            de um lado e `lg:pl-16` (64) do outro em vez de um `gap` simétrico: a
            assimetria é o que puxa o corpo para longe do fio e deixa a manchete
            quase encostada nele, que é o que se vê no desenho.

            ⚠️ O FIO É `border-l` NA COLUNA DA DIREITA, e não um elemento próprio.
            Um `<div>` de 1px precisaria de altura — e a altura certa é a da
            coluna mais alta, que muda com o texto. Como borda, ele acompanha
            sozinho, e some junto com o `lg:` quando as colunas empilham.

            EMPILHA ABAIXO DE `lg` porque a manchete é longa: a 768px, metade da
            largura dá ~330px e a frase do Top 150 quebraria em seis linhas. */}
        <div className="mt-8 grid gap-y-6 md:mt-10 lg:grid-cols-[1fr_1.25fr] lg:gap-y-0">
          {/* `h2` E NÃO `p`: esta é a manchete do bloco, e é ela que estrutura a
              página para quem navega por cabeçalhos. O rótulo acima é rótulo, não
              título — por isso ficou como `<p>`. */}
          <h2 className="font-serif text-[28px] font-semibold leading-[1.15] tracking-[-0.4px] text-ink md:text-[34px] lg:pr-10 lg:text-[38px]">
            {headline}
          </h2>

          <div className="lg:border-l lg:border-line lg:pl-16">
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
      </Reveal>
    </section>
  );
}
