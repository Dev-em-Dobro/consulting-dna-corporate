/**
 * Botão de envio com o efeito do segundo componente do 21st (`hover-button`),
 * mandado em 10-09 depois que o `arrow-fill` foi descartado.
 *
 * O EFEITO: no repouso, um quadrado de vermelho mais CLARO na ponta direita do
 * botão, com a seta branca dentro. No hover o quadrado ESTICA para a esquerda
 * até encher o botão, e a seta fica exatamente onde estava.
 *
 * A COR levou quatro rodadas em 10-09, e a conclusão vale escrita porque o
 * caminho tem uma armadilha:
 *
 *   1º  ink            — escuro demais, e nada a ver com a referência.
 *   2º  `brand-light`  — claro, mas "rosa demais".
 *   3º  `brand-dark`   — leitura errada do pedido: escureci quando o que
 *                        incomodava era o rosa, não a claridade. Hover é mais
 *                        claro, não mais escuro.
 *   4º  `BLOCK` abaixo — claro E vermelho.
 *
 * A ARMADILHA: "menos rosa" não se resolve escurecendo. O `brand-light` puxa
 * para o salmão porque tem saturação relativamente baixa (67%) numa claridade
 * alta (68%) — vermelho claro e pouco saturado LÊ como rosa. A saída é subir a
 * saturação e baixar um pouco a claridade, mantendo o tom acima do botão:
 *
 *     brand         hsl(4, 68%, 54%)   #d84339   o botão
 *     brand-light   hsl(4, 67%, 68%)   #e47e77   o "rosa" recusado
 *     BLOCK         hsl(4, 72%, 60%)   #e25950   claro, saturado, vermelho
 *
 * Cor local e não token do `globals.css` de propósito: ela existe para este
 * bloco e não deve virar oferta para o resto do site sem alguém decidir isso.
 * Vai por `style` inline porque a cor NÃO anima — só a largura anima, por
 * classe —, então não há risco de inline vencer de um `group-hover:`.
 *
 * ⚠️ CONTRASTE, e este é o preço que a escolha cobra. Branco sobre o BLOCK dá
 * 3,63:1. Para a SETA está certo: ícone pede 3:1. Para o RÓTULO fica abaixo dos
 * 4,5:1 que texto pede, e não há como consertar mantendo o pedido — QUALQUER
 * vermelho mais claro que o botão piora o branco, e o próprio botão já está em
 * 4,39:1 com branco (condição que o site tem hoje, fora deste componente). Se
 * for para resolver, o caminho é o rótulo escurecer no hover (uma classe:
 * `group-hover:text-ink`), ao custo de o texto trocar de cor.
 *
 * É outro mecanismo, muito mais simples que o do `arrow-fill`, e vale dizer no
 * que ele é diferente — as três coisas caras do outro não existem aqui:
 *
 *  • Anima UMA propriedade só: `width`. Não há `inset` de quatro lados, não há
 *    raio virando canto reto, não há `clip-path`.
 *  • O rótulo NÃO troca de cor. Lá ele era escrito DUAS VEZES e recortado por
 *    `clip-path` para mudar de cor exatamente na borda da varredura; aqui ele é
 *    branco antes e depois, e o bloco passa por baixo dele.
 *  • A seta não tem par nem faz crossfade. É uma só, parada.
 *
 * COMO O BLOCO CRESCE PARA A ESQUERDA: ele está preso pela DIREITA (`right-1`)
 * e não tem `left`. Aumentar a largura de uma caixa ancorada à direita empurra a
 * borda esquerda dela para longe — então crescer a largura é varrer para a
 * esquerda. Não precisa de `transform` nem de `left` animado.
 *
 * POR QUE A SETA NÃO SE MEXE: o bloco é `flex ... justify-end`, então a seta
 * mora no fim dele. O fim é a borda direita, que é justamente a borda que está
 * ancorada e não se move. O bloco cresce por trás dela.
 *
 * SEM FOLGA NENHUMA — e este é o ponto em que a implementação SE AFASTA do
 * original de propósito, decidido em 10-09.
 *
 * No arquivo do 21st o bloco fica a 4px das bordas (`right-1`, `h-12` num botão
 * de `h-[56px]`) e cresce só até `calc(100% - 8px)`, deixando um filete da cor
 * do botão em volta. Aqui o bloco vai de `inset-y-0 right-0` até `w-full`:
 * encosta em cima, embaixo e nos dois lados, e no fim da animação cobre o botão
 * inteiro. Não sobra filete.
 *
 * Foram duas rodadas até acertar isto, então vale deixar escrito para ninguém
 * "consertar" de volta: primeiro veio com os 4px do original, depois foi para
 * 6px por leitura errada do pedido, e o certo era zero. O bloco preenchendo o
 * canto todo é a decisão.
 *
 * O `z-10` DO RÓTULO SÓ FUNCIONA PORQUE O BOTÃO É FLEX. `z-index` não vale para
 * elemento `static`… exceto para item de flex, que é o caso do span aqui. Sem
 * isso o bloco absoluto passaria POR CIMA do texto, porque conteúdo posicionado
 * pinta acima de conteúdo estático. O original depende dessa regra sem dizer;
 * o `relative` abaixo torna a coisa explícita e à prova de alguém tirar o flex.
 *
 * Duração: o original não declara nenhuma, então vale o padrão do Tailwind, que
 * é 150ms. Ficou como está de propósito, para o teste ser do componente deles e
 * não de um ajuste meu — trocar é acrescentar `duration-300` na classe do bloco.
 *
 * Do arquivo original saíram o `cn` e o caminho `components/ui`: são convenção
 * de shadcn, e este projeto não é shadcn (não tem `lib/utils` nem a pasta).
 */

/** hsl(4, 72%, 60%) — ver a nota de cor no cabeçalho antes de trocar. */
const BLOCK = "#e25950";

export default function HoverFillSubmit({
  label,
  disabled = false,
}: {
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      // `flex` (e não o `inline-flex` do original) porque este botão ocupa a
      // largura do formulário. `justify-center` centra o rótulo na caixa de
      // conteúdo, que já exclui o `pr` — é o que o mantém longe do bloco.
      // `overflow-hidden` guarda o bloco dentro do botão.
      // O `pr` reserva a faixa do bloco MAIS uma folga, senão o rótulo centrado
      // encosta nele. Como o bloco agora vai até a borda, esse número é a
      // largura dele (52px) + 8px de respiro. No telefone tudo encolhe: é a
      // largura que decide se "Start a Conversation" cabe em uma linha.
      className="group relative mt-1 flex w-full cursor-pointer items-center justify-center overflow-hidden bg-brand py-4 pl-6 pr-[60px] text-sm font-bold uppercase tracking-[0.5px] text-white disabled:pointer-events-none disabled:opacity-60 max-sm:pl-3 max-sm:pr-[46px] max-sm:text-[13px] max-sm:tracking-[0.3px]"
    >
      {/* O rótulo é branco e NÃO muda — como no original. Sobre o BLOCK ele fica
          em 3,63:1, abaixo dos 4,5:1 de texto; a nota de contraste no cabeçalho
          explica por que não dá para consertar sem abrir mão do vermelho claro,
          e qual é a saída se um dia for para consertar. */}
      <span className="relative z-10">{label}</span>

      {/* O bloco. `inset-y-0 right-0` o cola no topo, na base e na direita; no
          hover a largura vai a `w-full` e ele cobre o botão inteiro. Sem folga
          em lugar nenhum — ver a nota no cabeçalho.

          A largura em repouso é a ALTURA do botão (52px), para o bloco ser um
          quadrado exato. Se o rótulo quebrar em duas linhas o botão cresce e o
          bloco vira retângulo — aceitável, porque ele continua colado nas
          bordas, que é o que importa aqui. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 flex w-[52px] items-center justify-end transition-[width] group-hover:w-full motion-reduce:transition-none max-sm:w-[40px]"
        style={{ backgroundColor: BLOCK }}
      >
        {/* ⚠️ A SETA É CENTRADA POR MARGEM, E NÃO POR `justify-center`, e a
            diferença importa: o bloco é `justify-end`, o que prende a seta na
            borda direita — a única borda que não se move quando o bloco cresce.
            Trocar para `justify-center` faria a seta escorregar até o meio do
            botão durante o hover, que é justamente o que não pode acontecer.

            Então a margem TEM de valer (largura do bloco − tamanho da seta) / 2,
            ou a seta fica torta. Aqui: (52 − 20) / 2 = 16px = `mr-4`; no
            telefone (40 − 16) / 2 = 12px = `mr-3`. Estava com 12px num bloco de
            52px, o que a deixava 4px à direita do centro — era essa a torta.
            Se mexer no tamanho do bloco ou do ícone, refaça a conta. */}
        <div className="mr-4 flex items-center justify-center max-sm:mr-3">
          {/* A seta é a do arquivo deles, path idêntico. Branca, a pedido:
              sobre o BLOCK ela mede 3,63:1, acima dos 3:1 que ícone pede. */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white max-sm:h-4 max-sm:w-4"
            viewBox="0 0 15 15"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.15 3.15a.5.5 0 0 1 .7 0l4 4a.5.5 0 0 1 0 .7l-4 4a.5.5 0 0 1-.7-.7L11.3 8H2.5a.5.5 0 0 1 0-1h8.8L8.15 3.85a.5.5 0 0 1 0-.7Z"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}
