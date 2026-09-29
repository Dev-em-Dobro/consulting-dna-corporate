/** Dados do livro exibido na home. As rotas antigas de livros apontam para /#book. */

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
    cover: "/book-cover-24-09.png",
    buyUrl: "https://www.amazon.com/Leadership-Its-Your-Rhea-Duttagupta/dp/1408168340",
  },
];
