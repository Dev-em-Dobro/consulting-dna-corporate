/**
 * Os livros — uma fonte só para a seção da home e para a seção `#books` da
 * `/insights`.
 *
 * ⚠️ O SEGUNDO CONSUMIDOR MUDOU DE ENDEREÇO EM 21-09. Era a página `/books`;
 * agora é uma seção dentro da /insights, a pedido: *"insights and books e a
 * seção de book vai pra tela de insights"* (anotação da reunião de 21-09).
 * `app/books/page.tsx` foi removida e a rota 308a para `/insights#books`, em
 * next.config. NADA AQUI PRECISOU MUDAR além deste comentário — que é o ponto
 * de o arquivo existir: a copy sobreviveu à mudança de tela sem ser tocada.
 *
 * POR QUE SAIU DA HOME. Este objeto morava dentro de `app/page.tsx`. Com uma
 * segunda tela mostrando o mesmo livro, duas cópias do mesmo texto divergem na
 * primeira correção que alguém faz só de um lado. O `officialPortrait` de
 * `lib/team.ts` resolveu o mesmo problema entre a home e a /team em 11-09; isto
 * é a mesma decisão — e continua valendo hoje, com a home de um lado e a
 * /insights do outro.
 *
 * ⚠️ A TELA ESTAVA ADIADA DE PROPÓSITO, e a condição para fazê-la era
 * exatamente esta. Está escrita em quatro documentos, o mais claro no status de
 * 27-08: *"Our Books supporting multiple authors — the agreed scope covered one
 * book. Suggestion: ship 'Our Books' in the plural pointing at Rhea's book, and
 * build the listing when a second book exists."* O cliente confirmou em 11-09
 * que são dois. A página foi feita nesse dia — e em 21-09 virou seção. O
 * conteúdo é o mesmo; o que mudou foi onde ele mora.
 *
 * ⏳ O SEGUNDO LIVRO NÃO TEM DADO NENHUM AQUI, e não é esquecimento: nem os
 * documentos, nem o CMS, nem o acervo dizem QUAL é. Faltam título, autor, capa,
 * descrição e link de compra. A seção reserva o lugar dele em vez de escondê-lo
 * — mesma decisão do slot da foto de grupo na /team, e pelo mesmo motivo: quem
 * revisa é o cliente, e esconder o bloco tira dele a chance de julgar se o
 * layout funciona com dois.
 */

export type Book = {
  /**
   * O título publicado, como está na capa e na Amazon.
   *
   * SEPARADO DO `headline` porque o JSON-LD da home declara este como o *nome do
   * livro* para os buscadores. Alimentar o schema com a linha de posicionamento
   * afirmaria um livro que não existe, e o atribuiria à Rhea.
   */
  name: string;
  /**
   * A linha de posicionamento que abre o bloco — NÃO é o nome do livro. Mantida
   * como foi escrita (a CDNA confirmou em 01-09 que é o mesmo livro e que o
   * título do bloco é deliberadamente outro).
   */
  headline: string;
  /** O kicker acima do título. */
  kicker: string;
  body: string[];
  cover: string;
  /** Ausente enquanto não houver onde comprar — aí o botão não sai. */
  buyUrl?: string;
};

export const books: Book[] = [
  {
    name: "Leadership: It’s In Your DNA",
    headline:
      "CorporateDNA: How Great Companies Build What Competitors Can't Copy and clients want to emulate",
    kicker: "The book behind the method",
    body: [
      "What if the greatest competitive advantage isn't your strategy, products or technology, but your organisational DNA?",
      "Drawing on nearly two decades of advising CEOs and executive teams around the world, Rhea Leckie reveals the principles behind organisations that consistently outperform, adapt and endure.",
      "More than a leadership book, this is the story of how a boutique consultancy scaled through financial crises, wars and a global pandemic by intentionally building a CorporateDNA that clients now seek to emulate. Blending real-world leadership stories with a practical framework, the book explores how culture, leadership, decision-making and human behaviour become an organisation's greatest source of resilience and growth.",
      "For leaders who want to build companies that thrive through uncertainty, not just survive it. This is a blueprint for creating a legacy that lasts.",
    ],
    cover: "/book-cover.png",
    buyUrl: "https://www.amazon.com/Leadership-Its-Your-Rhea-Duttagupta/dp/1408168340",
  },
];
