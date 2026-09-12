import Link from "next/link";
import type { Service } from "@/lib/services";

/**
 * Um serviço como card — o do índice `/solutions`.
 *
 * ⚠️ TEM UM CONSUMIDOR SÓ, e a história explica por quê. Ele saiu de dentro de
 * `app/solutions/page.tsx` em 11-09 para ser usado também no pé de cada página
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
 */
export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/solutions/${service.slug}`}
      className="group flex flex-col border border-line bg-white p-8 transition-colors hover:border-brand/40 md:p-10"
    >
      <h2 className="font-serif text-[24px] font-semibold leading-[1.2] tracking-[-0.2px] text-ink md:text-[27px]">
        {service.title}
      </h2>
      <p className="mt-4 max-w-[520px] font-serif text-[16px] leading-[1.6] text-muted md:text-[17px]">
        {service.banner}
      </p>
      <span className="mt-7 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[1.3px] text-brand">
        Explore
        <span aria-hidden className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}
