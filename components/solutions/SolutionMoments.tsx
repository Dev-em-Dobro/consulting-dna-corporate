import Reveal from "@/components/Reveal";
import type { ServiceMoments } from "@/lib/services";

/**
 * A GRADE DE CAIXAS CONTORNADAS — "The manager moments that matter", no layout
 * de 24-09 (`docs/meetings/manager-development-24-09.jpeg`).
 *
 * Dez caixas de contorno vermelho fino, texto centrado em serifa, em duas
 * fileiras de cinco.
 *
 * ⚠️ O RÓTULO VEM DO DADO, e não está escrito aqui. Nas outras faixas do
 * template o rótulo é genérico e do componente ("Evidence", "Related
 * services"); aqui ele NOMEIA o conteúdo, e um serviço diferente com uma grade
 * dessas escreveria outra coisa. Ver `ServiceMoments` em `lib/services.ts`.
 *
 * ⚠️ CINCO POR LINHA A PARTIR DE `lg`, fixo, a pedido de 24-09 — *"na seção the
 * manager moments precisa ter 5 cards por linha"*. Era `auto-fit` com
 * `minmax(190px,1fr)`, que deixava a grade decidir quantas cabiam: a 1440 dava
 * as cinco, mas entre 1024 e ~1200 caíam para quatro e a segunda fileira ficava
 * com seis, desmontando as duas fileiras de cinco do desenho.
 *
 * O QUE ISSO CUSTA, assumido: a 1024 cada caixa fica com ~190px, e "Having
 * difficult conversations" sai em três linhas. É por isso que o `min-h` das
 * caixas existe — as dez crescem juntas e o rodapé da fileira continua
 * alinhado. Abaixo de `lg` a grade volta a três e a duas colunas, onde cinco
 * não caberiam de jeito nenhum.
 *
 * ⚠️ AS CAIXAS TÊM ALTURA COMUM POR FILEIRA, de graça: numa grade, os itens de
 * uma mesma linha esticam para a altura do mais alto (`items-stretch` é o
 * padrão). É isso que mantém o desenho com o rodapé alinhado mesmo com rótulos
 * de uma e de duas linhas — foi conferido contra o arquivo, onde as dez caixas
 * medem o mesmo.
 *
 * Lista vazia (ou ausente) não renderiza nada.
 */
export default function SolutionMoments({ moments }: { moments?: ServiceMoments }) {
  const items = (moments?.items ?? []).filter((i) => i.trim());
  if (!moments || items.length === 0) return null;

  return (
    /* ⚠️ SEM `pt`, DESDE 24-09. A primeira versão tinha `py-16 md:py-20`, sob o
       raciocínio de que esta faixa tem rótulo próprio e portanto merecia respiro
       próprio. Na tela a conta não fechou: as trilhas logo acima já terminam com
       `pb`, as duas faixas são BRANCAS, e os dois espaços somam num vão de 144 a
       176px — contra os ~40px que o layout mostra entre o último cartão e este
       rótulo.

       QUEM DÁ O RESPIRO AGORA é o `pb` das trilhas, encolhido no mesmo commit.
       O `pb` daqui fica: ele separa esta faixa da de "How we work", que é
       `paper` e portanto tem borda visível — ali o espaço não soma com nada. */
    <section className="bg-white">
      <Reveal className="mx-auto max-w-[1440px] px-6 pb-16 md:px-10 md:pb-20">
        <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
          {moments.label}
        </p>
        {/* `<ul>`/`<li>` E NÃO `<div>`: são dez itens de igual peso, e em leitor
            de tela a lista dá a contagem de graça. Mesma decisão do
            `SolutionPillars`. */}
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <li
              key={item}
              /* `border-brand/45` E NÃO `border-brand` CHEIO: dez retângulos de
                 contorno vermelho saturado numa faixa branca viram uma grade
                 que grita mais alto que a manchete da seção. No layout o
                 contorno é visivelmente mais claro que os rótulos vermelhos da
                 mesma página. O TEXTO fica em `ink`, que é o que o desenho
                 mostra — contorno vermelho, texto escuro. */
              className="flex min-h-[86px] items-center justify-center border border-brand/45 px-4 py-5 text-center font-serif text-[15px] leading-[1.35] text-ink md:text-[17px]"
            >
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
