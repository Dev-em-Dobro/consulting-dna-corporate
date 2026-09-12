import Link from "next/link";
import type { Service } from "@/lib/services";

/**
 * Um serviço como card — o do índice `/solutions`, agora em um lugar só.
 *
 * Saiu de dentro de `app/solutions/page.tsx` em 11-09, quando o pé de cada
 * página de serviço passou a listar as outras nove. Eram os mesmos card: mesma
 * borda, mesma serifa, mesmo "Explore →". Duplicar significaria que o próximo
 * ajuste de borda ou de hover teria de ser feito duas vezes, e a segunda é a que
 * se esquece.
 *
 * O CARD LIDERA PELA BANNER STATEMENT, e não pelo outcome, porque é o que a
 * sub-linha do índice promete: "Everyone starts with what is at stake for the
 * business." A banner statement é justamente a frase que diz o que está em jogo;
 * o outcome é a página de dentro.
 *
 * O CARD INTEIRO É O LINK, não só o nome: um alvo de clique do tamanho do card é
 * o que funciona no telefone, onde estas fileiras viram uma coluna só.
 */
export default function ServiceCard({
  service,
  /**
   * `h2` no índice, onde cada card é uma seção da página; `h3` no pé de uma
   * página de serviço, onde eles vivem sob o título "More services" e pular de
   * h2 para h2 quebraria a escada de cabeçalhos para quem navega por elas.
   */
  headingLevel = "h2",
}: {
  service: Service;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <Link
      href={`/solutions/${service.slug}`}
      className="group flex flex-col border border-line bg-white p-8 transition-colors hover:border-brand/40 md:p-10"
    >
      <Heading className="font-serif text-[24px] font-semibold leading-[1.2] tracking-[-0.2px] text-ink md:text-[27px]">
        {service.title}
      </Heading>
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
