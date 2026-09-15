import Link from "next/link";
import type { Service } from "@/lib/services";

/**
 * Um serviço como card — o do índice `/services`.
 *
 * ⚠️ TEM UM CONSUMIDOR SÓ, e a história explica por quê. Ele saiu de dentro de
 * `app/services/page.tsx` em 11-09 para ser usado também no pé de cada página
 * de serviço, numa grade com as outras nove. Aquele bloco foi removido no mesmo
 * dia — o outline não o pede, e a caixa em `SolutionView` guarda o raciocínio.
 * O card ficou extraído porque o índice lê melhor assim e porque, se a grade
 * voltar, ela volta usando isto e não uma cópia.
 *
 * SEM PROP DE NÍVEL DE CABEÇALHO. Ele chegou a ter uma (`h2` no índice, `h3` no
 * pé), e ela saiu junto com o único caso que a justificava. Se a grade voltar,
 * ela precisa de `h3` para não quebrar a escada de cabeçalhos sob o rótulo da
 * seção — e aí a prop volta com ela, em vez de ficar aqui sem uso esperando.
 *
 * O CARD LIDERA PELA BANNER STATEMENT, e não pelo outcome, porque é o que a
 * sub-linha do índice promete: "Everyone starts with what is at stake for the
 * business." A banner statement é justamente a frase que diz o que está em jogo;
 * o outcome é a página de dentro.
 *
 * O CARD INTEIRO É O LINK, não só o nome: um alvo de clique do tamanho do card é
 * o que funciona no telefone, onde estas fileiras viram uma coluna só.
 *
 * ================================================================
 * A ESCADA `xl:` É A GRADE DE QUATRO DE 14-09
 * ================================================================
 * O índice passou de duas colunas para quatro (item 10 da daily: *"four four
 * four going across"*), e isso não é só a grade que muda — o card encolhe de
 * ~660px para ~278px numa página de 1280. Todos os números abaixo foram
 * dimensionados para a medida larga e, sem revisão, o card em quatro colunas
 * fica com 198px de texto dentro de 80px de padding.
 *
 * Por isso cada valor tem um degrau `xl:` PARA BAIXO, e não uma escala nova:
 *   • `p-10` → `p-7`. 28px de respiro num card de 278 é a mesma proporção que
 *     40px num de 660. O texto volta a ter 222px de medida.
 *   • Título 27px → 21px. "Top 150 Leadership Development" (30 caracteres) cabe
 *     em três linhas a 21px; a 27px passa de quatro e o card vira título.
 *   • Corpo 17px → 15px. A banner statement mais longa tem 78 caracteres, o que
 *     a 15px dá cinco linhas — a mesma altura que ela já tinha a 17px em duas
 *     colunas com 520px de medida.
 *
 * ABAIXO DE `xl` NADA MUDOU. Até 1279 a página segue em duas colunas e o card é
 * exatamente o que era.
 */
export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col border border-line bg-white p-8 transition-colors hover:border-brand/40 md:p-10 xl:p-7"
    >
      <h2 className="font-serif text-[24px] font-semibold leading-[1.2] tracking-[-0.2px] text-ink md:text-[27px] xl:text-[21px]">
        {service.title}
      </h2>
      <p className="mt-4 max-w-[520px] font-serif text-[16px] leading-[1.6] text-muted md:text-[17px] xl:mt-3 xl:text-[15px]">
        {service.banner}
      </p>
      {/* `mt-auto` EMPURRA O "EXPLORE" PARA O PÉ DO CARD. Em duas colunas os
          cards de uma fileira tinham alturas parecidas e os 28px fixos bastavam;
          em quatro, a fileira mistura título de uma linha com título de três, e
          o `stretch` da grade deixa todos com a altura do mais alto — o link
          nascia no meio do card em uns e no pé em outros. Com `mt-auto` os
          quatro "Explore" da fileira caem na mesma linha.

          OS 28px VIRARAM `pt-7`, e não continuam `mt-7`: `mt-auto` e `mt-7` são
          a MESMA propriedade, então só um deles valeria. Como padding, a
          distância mínima até a banner statement fica garantida mesmo no card em
          que não sobra folga nenhuma para o `auto` empurrar. */}
      <span className="mt-auto inline-flex items-center gap-2 pt-7 text-[13px] font-medium uppercase tracking-[1.3px] text-brand">
        Explore
        <span aria-hidden className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}
