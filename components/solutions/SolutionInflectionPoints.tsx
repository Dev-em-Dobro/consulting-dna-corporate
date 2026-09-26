import { pillarIcon } from "@/components/solutions/SolutionPillars";
import Reveal from "@/components/Reveal";
import type { ServiceInflectionPoints } from "@/lib/services";

/**
 * A GRADE DE LADRILHOS DO "THE INFLECTION POINTS" — layout do Talent
 * Development, 24-09.
 *
 * O desenho é de duas colunas: à esquerda o rótulo, a manchete e a linha de
 * apoio; à direita uma grade 4×2 de ladrilhos, cada um com um glifo e o nome do
 * momento, alternando vermelho cheio e cinza claro como um tabuleiro.
 *
 * ⚠️ É PARENTE DA FILEIRA DE PILARES, E NÃO A MESMA COISA — vale a distinção
 * antes de alguém "unificar" os dois. `SolutionPillars` é uma fileira de itens
 * NUS (ícone em vermelho sobre o fundo da faixa, filete entre um e outro), e
 * ela enumera o que o serviço FAZ. Aqui cada item é um LADRILHO com campo de
 * cor, e o que a grade enumera é o que acontece com o CLIENTE — os momentos em
 * que o talento emperra. Fundir os dois obrigaria um deles a mudar de desenho.
 *
 * ⚠️ OS ÍCONES VÊM DO MAPA DE `SolutionPillars`, via `pillarIcon`, e é de
 * propósito: aquele mapa é a busca única do site por rótulo, e um segundo mapa
 * aqui seria o começo de "o mesmo conceito com dois glifos em páginas
 * diferentes", que a daily pediu para acabar. Rótulo sem linha no mapa cai no
 * círculo de fallback, que é o aviso visual de que faltou.
 */
export default function SolutionInflectionPoints({
  item,
}: {
  item?: ServiceInflectionPoints;
}) {
  const points = (item?.items ?? []).filter((p) => p.trim());
  if (!item || points.length === 0) return null;

  return (
    <section className="bg-white">
      {/* ⚠️ PADDING NO TOPO TAMBÉM, desde 24-09, e a razão mudou no mesmo dia: a
          faixa nasceu sem ele porque continuava o bloco "What we do" logo
          acima, como os cartões de público. Aquele bloco SAIU desta página a
          pedido (`hideWhatWeDo`), e sem um topo próprio a grade de ladrilhos
          encostaria no herói de sangria total — o rótulo vermelho a ~0px da
          dobra. Ela é uma faixa autônoma agora, com rótulo e manchete
          próprios, e o respiro simétrico é o que as outras faixas autônomas
          desta página já usam. */}
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
        {/* A COLUNA DE TEXTO É A MENOR DAS DUAS (1 contra 1,7), que é a
            proporção do layout: a grade ocupa cerca de dois terços da largura
            porque são quatro ladrilhos lado a lado, e um texto de manchete
            curta não precisa de mais que um terço.

            `items-start` porque as duas colunas têm alturas diferentes e o
            texto se alinha ao TOPO da grade, não ao centro dela — centrado, a
            manchete flutuaria no meio de uma grade de duas fileiras. */}
        <Reveal className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-14">
          <div>
            {item.label?.trim() ? (
              <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
                {item.label}
              </p>
            ) : null}
            {/* `h2` — a faixa é irmã das outras seções da página, não
                subordinada a nenhuma delas. `whitespace-pre-line` pela mesma
                razão do `SolutionSection`: a quebra da manchete é do desenho,
                escrita como `\n` no dado, e não da largura da janela. */}
            <h2
              className={`whitespace-pre-line font-serif text-[28px] font-semibold leading-[1.15] tracking-[-0.3px] text-ink md:text-[36px] ${
                item.label?.trim() ? "mt-6" : ""
              }`}
            >
              {item.headline}
            </h2>
            {item.lead?.trim() ? (
              <p className="mt-4 max-w-[38ch] font-serif text-[16px] leading-[1.6] text-muted md:text-[18px]">
                {item.lead}
              </p>
            ) : null}
          </div>

          {/* ⚠️ O TABULEIRO É CALCULADO PARA QUATRO COLUNAS, que é a medida do
              layout, e a conta está no `% 4`: um ladrilho é vermelho quando a
              soma da linha com a coluna é par. Em duas colunas (abaixo de `lg`)
              a mesma conta deixa de desenhar tabuleiro e vira listra vertical —
              e isso é aceitável de propósito, porque a alternância é ritmo
              visual, não informação. Nenhum ladrilho diz nada por ser vermelho.

              ⚠️ NÃO REORDENE OS ITENS PARA "ARRUMAR" AS CORES. A ordem é a do
              desenho e o dado não carrega cor nenhuma; quem quiser outro padrão
              muda esta linha, não a lista. */}
          <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {points.map((point, i) => {
              const Icon = pillarIcon(point);
              const red = ((i % 4) + Math.floor(i / 4)) % 2 === 0;
              return (
                <li
                  key={point}
                  className={`flex min-h-[112px] flex-col items-center justify-center gap-3 p-4 text-center md:min-h-[128px] md:p-5 ${
                    red ? "bg-brand text-white" : "bg-paper text-ink"
                  }`}
                >
                  {/* DECORATIVO: o rótulo logo abaixo diz a mesma coisa —
                      mesma regra da fileira de pilares e da grade de
                      resultados. */}
                  <Icon aria-hidden size={28} strokeWidth={1.5} />
                  {/* GROTESCA E NÃO SERIFA, ao contrário do rótulo dos pilares:
                      lá a legenda é NOME DE COISA ("Coaching"), aqui é uma
                      condição do negócio escrita como etiqueta, e o desenho a
                      mostra em caixa mista de grotesca dentro do campo de cor.
                      A 13/14px com duas linhas, a serifa sobre vermelho perde
                      definição. */}
                  <p className="text-[13px] font-medium leading-[1.3] md:text-[14px]">
                    {point}
                  </p>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
