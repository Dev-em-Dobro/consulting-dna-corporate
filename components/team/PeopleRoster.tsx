import Image from "next/image";
import type { RosterPerson } from "@/lib/team";

/**
 * RETRATO + NOME, EM GRADE. O objeto mais simples desta página, e o mesmo nos
 * dois lugares onde entrou em 17-09: os senior programme managers, logo abaixo
 * da liderança, e a lista da Global faculty, que tomou o lugar dos cartões de
 * região. As duas listas moram em `lib/team.ts`, com a procedência de cada uma.
 *
 * ⚠️ NÃO É O `PeopleGrid`, e a distância entre os dois é o que justifica o
 * arquivo novo. Aquele é um COMPONENTE DE CLIENTE: guarda estado de qual pessoa
 * está aberta e monta um `PersonModal` em portal, porque o `CDNA_04_Team.docx`
 * pede "short bio on click" para a liderança. Aqui não há bio para abrir — a
 * tabela da cliente traz nome, região e um link para um .pptx que não está no
 * site. Um modal que abre vazio é pior que nenhum, e um componente de cliente
 * para renderizar 23 imagens estáticas manda JavaScript à toa para a página.
 * Este é de SERVIDOR e não tem `useState` nenhum.
 *
 * ⏳ SE AS BIOS CHEGAREM, o caminho é migrar estas listas para o `Person` do
 * `PersonModal` e voltar a usar o `PeopleGrid` — não é ganhar modal aqui.
 */
export default function PeopleRoster({
  people,
  size = "sm",
  mono = false,
}: {
  people: RosterPerson[];
  /**
   * `lg` são os programme managers (dois em 17-09; três desde 18-09, com a
   * Nicole Phoon — na grade de seis colunas eles ocupam a metade esquerda, e
   * a conta da caixa abaixo não muda); `sm` são os 23 da faculty.
   *
   * ⚠️ O QUE MUDA É A DENSIDADE DA GRADE, e não o desenho do card — um card
   * diferente por tamanho faria a página ter dois objetos "retrato + nome"
   * quase iguais, que é como se ganha inconsistência de graça.
   *
   * ⚠️ E DESDE 17-09 O NOME É A ÚNICA COISA QUE OS SEPARA em tela larga. Com o
   * `lg` caindo para seis colunas (a caixa abaixo), os dois tamanhos passaram a
   * render o MESMO retrato de 213px a partir de 1280 — sobrou o corpo do nome,
   * 17px contra 15px. Mantido de propósito: são duas pessoas nomeadas logo
   * abaixo da liderança, não dois dos vinte e três da faculty, e o degrau de
   * 2px é o que ainda diz isso. Abaixo de 1280 as grades divergem de novo (três
   * colunas contra cinco).
   *
   * DOIS CARDS NUNCA OCUPAM A LINHA INTEIRA: em `lg` a grade é de SEIS colunas
   * e as duas pessoas ficam no terço esquerdo. É deliberado — a seção é de
   * APOIO à liderança, e dois retratos esticados a meia página cada pesariam
   * mais que os seis de cima.
   *
   * ⚠️ SEIS, E NÃO QUATRO, DESDE 17-09 — a pedido: *"elas não podem ser
   * maiores que as imagens da seção The team behind the work"*. Com quatro
   * colunas o retrato de apoio ficava MAIOR que o da liderança, e isso invertia
   * a hierarquia que a seção inteira existe para dizer. A liderança tem o
   * retrato estreito porque o card dela se parte em retrato + quote
   * (`minmax(0,1.14fr)_minmax(0,1fr)`, `gap-x-4`): num laptop de 1440 o retrato
   * dela mede ~224px, e quatro colunas aqui davam 328px.
   *
   * A CONTA, medida em cada quebra (largura do retrato, em px):
   *
   *     viewport   liderança   4 colunas   6 colunas
   *         768       332         336 ✗       219
   *        1280       196         288 ✗       187
   *        1366       211         310 ✗       201
   *        1440       224         328 ✗       213
   *
   * O `md:grid-cols-3` no meio existe pelo 768: em duas colunas o retrato
   * batia 336px contra os 332px da liderança — 4px, que ninguém vê, mas é o
   * mesmo defeito em miniatura, e o degrau conserta sem custo.
   *
   * ⚠️ O INVARIANTE É "NUNCA MAIOR QUE O RETRATO DA LIDERANÇA", não "seis
   * colunas". Quem mexer no `LeaderCard` — na proporção do par, no `gap-x` ou
   * no limiar de três colunas — mexe no teto daqui, e a tabela acima é a conta
   * a refazer.
   */
  size?: "sm" | "lg";
  /** Faculty fica em preto e branco. Associates e liderança, não. */
  mono?: boolean;
}) {
  if (people.length === 0) return null;

  const grid =
    size === "lg"
      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6";

  return (
    <ul className={`grid gap-x-4 gap-y-8 ${grid}`}>
      {people.map((p) => (
        <li key={p.name}>
          {/* `bg-[#e9e6e3]` É O MESMO DO `PeopleGrid`: enquanto a imagem não
              chega, o quadro já tem a cor dela em vez de um buraco branco. Os
              retratos vêm de um .docx e variam MUITO de resolução (de 190px a
              2048px de largura), então o quadro é quem manda na medida e a foto
              se ajusta por `object-cover`.

              `object-top` E NÃO `object-center`: são todos retratos de pessoa, e
              quando o recorte 3:4 não bate com a foto quem tem de sobrar é o
              tronco, nunca o alto da cabeça. */}
          <div className="relative aspect-[3/4] overflow-hidden bg-[#e9e6e3]">
            <Image
              src={p.portrait}
              alt={p.name}
              fill
              sizes={
                size === "lg"
                  ? "(min-width: 1024px) 15vw, (min-width: 768px) 30vw, 50vw"
                  : "(min-width: 1280px) 17vw, (min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
              }
              className={`object-cover object-[center_22%]${mono ? " grayscale" : ""}`}
            />
            {/* A RÉGUA VERMELHA NO PÉ é o mesmo objeto do `PeopleGrid`, e é o
                que amarra estas duas grades novas às que já existiam na página.
                Sem ela os retratos leem como fotos soltas num fundo. */}
            <div className="absolute bottom-0 left-0 h-[5px] w-9 bg-brand" />
          </div>

          {/* ⚠️ O NOME É VERMELHO DESDE 21-09 — *"nome em vermelho do team"*.
              Vale para as três listas de pessoas da página (esta duas vezes,
              mais o `LeaderCard`), e é `text-brand`, o token que o site usa
              para vermelho sobre fundo claro. A régua no pé do retrato continua
              sendo a mesma cor: o nome passa a ler como continuação dela, que é
              o que o pedido queria.

              ⚠️ O CONTRASTE MEDIDO, porque esta é a pior das três posições:
              #d84339 tem luminância 0,189, o que dá 4,39:1 sobre BRANCO (os
              programme managers, que estão na seção branca da liderança) e
              3,96:1 sobre o `paper` (#f3f3f3) da Global faculty, que é onde os
              nomes são menores ainda. O mínimo AA para este corpo (15–17px) é
              4,5 — ou seja, nenhuma das duas passa folgada, e a da faculty
              fica 12% abaixo. É o teto da cor, não um ajuste que se faça pelo
              fundo: a caixa do `--color-brand-light` em `globals.css` mostra
              que 4,39 sobre branco puro é o melhor que este vermelho consegue
              em qualquer lugar.

              MANTIDO MESMO ASSIM, e o registro é para quem revisar: o pedido é
              da cliente e é sobre A COR DA MARCA. Se a régua de 4,5 tiver de
              ser cumprida à risca, a saída é `text-brand-dark` (#b5342b — mesma
              matiz, 3,9° contra 3,8°) nos TRÊS lugares de uma vez, que devolve
              6,0:1 no branco e 5,7:1 no `paper`. O que não se faz é corrigir só
              a faculty: dois vermelhos diferentes para o mesmo objeto na mesma
              página é pior que os 0,5 que faltam.

              ⚠️ `h4` E NÃO `h3` DESDE 21-09. As duas chamadas desta grade
              passaram a viver sob um `h3`: os programme managers sob "Supported
              by a team of senior program managers." e a faculty sob o
              cabeçalho de cada região. Nome de pessoa como `h3` ali empataria
              com o título que o agrupa, e a árvore de cabeçalhos deixaria de
              dizer quem está dentro de quê. */}
          <h4
            className={`mt-3.5 font-semibold leading-snug text-brand ${
              size === "lg" ? "text-[17px]" : "text-[15px]"
            }`}
          >
            {p.name}
          </h4>
          {p.meta && (
            <p className="mt-0.5 text-[13px] leading-snug text-muted">{p.meta}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
