import Image from "next/image";
import type { Book } from "@/lib/books";

/**
 * Um livro — o cartão escuro que a home usa desde sempre, agora compartilhado
 * com `/books`.
 *
 * A COMPOSIÇÃO É A DA HOME, INTEIRA: cartão `ink` com borda, capa flutuando à
 * direita e o texto correndo em volta dela. O `flow-root` existe para conter o
 * float — sem ele, o que vier depois (os endossos, na home) começa dentro da
 * coluna da capa em vez de numa linha limpa.
 *
 * O `<h3>` VIROU PROP DE NÍVEL. Na home o cartão vive dentro de uma seção que
 * já tem o seu cabeçalho, então ele é h3; em `/books` cada livro é uma seção da
 * página e o cartão é o h2. Nível de cabeçalho é estrutura do documento, não
 * estilo — o tamanho da fonte não muda entre os dois.
 */
export default function BookCard({
  book,
  headingLevel = "h3",
  children,
}: {
  book: Book;
  headingLevel?: "h2" | "h3";
  /** Os endossos, na home. Entram DENTRO do cartão para ler como um bloco só. */
  children?: React.ReactNode;
}) {
  const Heading = headingLevel;
  return (
    <div className="bg-ink text-white md:border md:border-line md:p-14">
      <div className="flow-root px-6 pb-10 pt-12 md:p-0">
        {/* Escala do TypeLabel, mas como <span> solto: aqui não existe a régua
            vermelha — é um kicker dentro do cartão, não um rótulo de seção. */}
        <span className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
          {book.kicker}
        </span>
        <Heading className="mb-6 mt-6 text-[24px] font-medium leading-[1.2] text-white md:text-[26px]">
          {book.headline}
        </Heading>

        <figure className="mb-7 w-full md:float-right md:mb-4 md:ml-12 md:w-[400px]">
          <div className="relative aspect-[4/3] w-full overflow-hidden shadow-xl">
            {/* A capa é a foto DO LIVRO, então quem a nomeia é o livro — não a
                linha de posicionamento do bloco. */}
            <Image
              src={book.cover}
              alt={book.name}
              fill
              sizes="(min-width: 768px) 400px, 100vw"
              className="object-cover"
            />
          </div>
        </figure>

        <div className="space-y-4 text-[17px] leading-[1.65] text-white/80">
          {book.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* SEM `buyUrl`, SEM BOTÃO. Um livro que ainda não está à venda não
            ganha um botão desabilitado nem um "em breve" — some, e volta
            sozinho quando o link existir. */}
        {book.buyUrl && (
          <a
            href={book.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-[0.5px] text-white transition-colors hover:bg-brand-dark"
          >
            Buy on Amazon
          </a>
        )}
      </div>

      {children}
    </div>
  );
}
