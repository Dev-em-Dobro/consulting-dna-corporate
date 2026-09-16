import TypeLabel from "@/components/TypeLabel";

/**
 * O cabeçalho de seção da Clients & Impact: rótulo à esquerda, frase curta à
 * direita, fio fino separando os dois do conteúdo.
 *
 * ELE VEM DO MOCKUP DELA. As sete seções da imagem 1 abrem todas assim — "BY
 * THE NUMBERS … REAL CHANGE, A BROADER REACH.", "CASE STUDIES … REAL STORIES.
 * LASTING CHANGE." — e a repetição é o que dá ritmo à página inteira. Um
 * componente só, e não sete cabeçalhos escritos à mão, porque é o tipo de
 * padrão que diverge na terceira cópia.
 *
 * ⚠️ O RÓTULO DA ESQUERDA É O `TypeLabel` DO SITE, com a régua vermelha, e não
 * o texto pelado do desenho. É a instrução dela na mesma call — *"we probably
 * will use some of the layout of the other sections, the components, because if
 * we don't do this, all pages will look different"*. A régua é o que abre toda
 * seção da /about, da home e da /services; abandoná-la só aqui faria esta
 * página parecer de outro site.
 *
 * O `kicker` da direita SOME NO TELEFONE. São duas frases curtas competindo
 * pela mesma linha; abaixo de `md` a da direita cairia sob a da esquerda e
 * pareceria subtítulo do rótulo, que é justamente o que ela não é — é um
 * comentário solto, do mesmo peso visual de uma legenda.
 */
export default function SectionHead({
  label,
  kicker,
  onDark = false,
  className = "",
}: {
  label: string;
  /** A frase da direita, em versalete. Opcional: nem toda seção tem uma. */
  kicker?: string;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-end justify-between gap-6">
        {/* `mb-0` anula a margem própria do TypeLabel: quem espaça aqui é o fio
            logo abaixo, e as duas margens somadas abririam um vão duplo. */}
        <TypeLabel onDark={onDark} className="!mb-0">
          {label}
        </TypeLabel>
        {kicker && (
          <p
            className={`hidden text-[11.5px] font-medium uppercase leading-none tracking-[1.5px] md:block ${
              onDark ? "text-white/45" : "text-muted"
            }`}
          >
            {kicker}
          </p>
        )}
      </div>
      <div className={`mt-4 h-px w-full ${onDark ? "bg-white/15" : "bg-line"}`} />
    </div>
  );
}
