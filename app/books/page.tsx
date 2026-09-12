import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import BookCard from "@/components/books/BookCard";
import BookEndorsements from "@/components/BookEndorsements";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import Reveal from "@/components/Reveal";
import TypeLabel from "@/components/TypeLabel";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { books } from "@/lib/books";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Our Books — Corporate DNA",
    description:
      "Leadership: It’s In Your DNA, by Rhea Leckie — the book behind the Corporate DNA method.",
    alternates: localeAlternates("/books"),
  };
}

/**
 * `/books` — a página que o brief de 27-08 pede e que esteve adiada até agora.
 *
 * A CONDIÇÃO ERA O SEGUNDO LIVRO, e ela foi escrita quatro vezes: *"ship 'Our
 * Books' in the plural pointing at Rhea's book, and build the listing when a
 * second book exists"* (status 27-08), repetida no e-mail ao Guilherme de 30-08
 * e no roteiro de 31-08 ("criar a página quando houver um segundo livro"). O
 * cliente confirmou em 11-09 que são dois. É por isso que ela existe hoje e não
 * antes — não era teimosia, era não fazer uma tela nova para mostrar o que a
 * home já mostrava.
 *
 * ⏳ O SEGUNDO LIVRO AINDA NÃO TEM DADO. Sabe-se que existe; não se sabe qual é.
 * Ele aparece como slot, não escondido, pela mesma razão registrada na /team
 * sobre a foto de grupo: quem revisa esta página é o cliente, e o que ele
 * precisa julgar é se o layout funciona com dois livros.
 */
export default function BooksPage() {
  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell footerTopBorder floatingNav>
        {/* ⚠️ O TÍTULO É A ÚNICA COPY NÃO LITERAL DESTA PÁGINA, e precisa do
            aceite do cliente. A home chama o bloco de "The book behind the
            method" — singular, aprovado. Aqui ele está no plural, e isso é uma
            palavra minha, não dele. Pior: afirma que os DOIS livros estão por
            trás do método, e do segundo não se sabe nada. Se ele não servir, o
            substituto é uma linha deles. */}
        <SolutionHero eyebrow="Our Books" title="The books behind the method." />

        {books.map((book) => (
          <section key={book.name} className="bg-paper">
            <Reveal className="mx-auto max-w-[1440px] py-14 md:px-10 md:py-24">
              {/* Os endossos entram DENTRO do cartão, como na home, para o
                  conjunto ler como um bloco só. Eles são do livro da Rhea —
                  recuperados da antiga /book-endorsements —, então acompanham
                  o primeiro livro e não a página. */}
              <BookCard book={book} headingLevel="h2">
                <BookEndorsements />
              </BookCard>
            </Reveal>
          </section>
        ))}

        {/* ── O SEGUNDO LIVRO ───────────────────────────────────────────────
            SLOT, E NÃO UM "EM BREVE". A diferença importa: um aviso de pendência
            informa o visitante de uma coisa que não é problema dele, enquanto um
            slot dimensionado mostra ao cliente onde a peça cai. E não há uma
            palavra inventada aqui — nem título provisório, nem descrição de
            exemplo —, porque a página inteira é copy do cliente e um parágrafo
            nosso no meio seria o único que ele não escreveu.

            4:3 É A PROPORÇÃO DA CAPA no cartão acima, não um número escolhido:
            o slot tem de compor como vai compor com a imagem dentro. */}
        <section className="bg-paper">
          <div className="mx-auto max-w-[1440px] px-6 pb-14 md:px-10 md:pb-24">
            <TypeLabel>The second book</TypeLabel>
            <div className="mt-8 md:w-[400px]">
              <ImagePlaceholder label="Second book — cover" className="aspect-[4/3] w-full" />
            </div>
          </div>
        </section>
      </SiteShell>
    </div>
  );
}
