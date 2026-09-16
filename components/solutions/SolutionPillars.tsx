import Reveal from "@/components/Reveal";

/**
 * A faixa de pilares sob o bloco "How we help" — os cinco cartões com ícone do
 * template de 15-09 (`4. Services/ExCo Leadership Services Page.png`).
 *
 * ⚠️ SEM ÍCONE, E ISSO É DECISÃO, NÃO PENDÊNCIA. O projeto não tem biblioteca de
 * ícones: os SVGs de hoje são todos avulsos, desenhados para um uso. Os dez
 * serviços somam ~50 conceitos distintos ("mastery labs", "sense-making",
 * "decision rights"), e ícone genérico repetido nos dez lê como template
 * comprado. O NÚMERO faz o que o ícone faria — dar marcador e ritmo — e não
 * afirma nada sobre o conteúdo.
 *
 * ⚠️ `bg-paper` PARA CONTINUAR O BLOCO DE CIMA, que é o "How we help" e também é
 * paper. Aqui as duas faixas encostadas são o efeito desejado: a lista pertence
 * àquele bloco, não é uma seção nova. O corte vem depois, na faixa vermelha do
 * CTA.
 *
 * Lista vazia (ou ausente) não renderiza nada — sem slot tracejado e sem título
 * órfão, pela mesma régua do resto das páginas de serviço.
 */
export default function SolutionPillars({ items }: { items?: string[] }) {
  const pillars = (items ?? []).filter((p) => p.trim());
  if (pillars.length === 0) return null;

  return (
    <section className="bg-paper">
      {/* Sem padding no topo: o respiro já vem do `py-16 lg:py-28` da coluna de
          texto do bloco acima. Somar os dois abriria um buraco entre a frase e a
          lista que ela desdobra. */}
      <Reveal className="mx-auto max-w-[1440px] px-6 pb-20 md:px-10 md:pb-24">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
          {pillars.map((p, i) => (
            <div key={p} className="border-t border-ink/12 pt-5">
              <span className="block text-[13px] font-medium tracking-[1.3px] text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 font-serif text-[19px] leading-[1.25] tracking-[-0.2px] text-ink md:text-[21px]">
                {p}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
