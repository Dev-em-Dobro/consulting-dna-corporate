import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import EmptyNotice from "@/components/EmptyNotice";
import InsightsLibrary from "@/components/insights/InsightsLibrary";
import BookCard from "@/components/books/BookCard";
import BookEndorsements from "@/components/BookEndorsements";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import Reveal from "@/components/Reveal";
import TypeLabel from "@/components/TypeLabel";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { getInsightListEntries } from "@/lib/cms/map";
import { books } from "@/lib/books";

/**
 * ⚠️ O TÍTULO E A DESCRIÇÃO GANHARAM OS LIVROS EM 21-09, junto com o conteúdo:
 * *"insights and books e a seção de book vai pra tela de insights"* (anotação da
 * reunião de 21-09). A `/books` era uma URL indexada, está no sitemap entregue
 * aos buscadores e agora responde 308 para cá — deixar a palavra "books" fora
 * dos metadados jogaria fora o único sinal que essa URL acumulou. É a razão de
 * o título ser "Insights & Books" e não só "Insights".
 *
 * ⏳ "& Books" É PALAVRA MINHA, como o "The books behind the method." lá
 * embaixo. Está nos metadados, não na tela, mas metadado é o texto que aparece
 * no resultado de busca — vale aceite do cliente como o resto da copy.
 *
 * SEM `robots` CONDICIONAL, e a ausência agora é definitiva. O padrão existe no
 * site (ver `app/our-partnerships/page.tsx`: `noindex` enquanto o CMS não tem
 * nada publicado, porque página vazia não se indexa) e esta página nunca o teve.
 * Depois de 21-09 ele também não faria sentido: com os livros aqui dentro, a
 * página tem conteúdo mesmo com a biblioteca editorial vazia — o `EmptyNotice`
 * cobre metade da tela, não a tela.
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Insights & Books | CorporateDNA",
    description:
      "Perspectives on leadership, executive-team alignment, succession and enterprise transformation from CorporateDNA's senior advisory faculty, and the books behind the method.",
    alternates: localeAlternates("/insights"),
  };
}
export const revalidate = 300;

export default async function InsightsPage() {
  const insights = await getInsightListEntries();

  return (
    /* A LINGUAGEM NOVA CHEGA AQUI em 11-09, a pedido: menu flutuante, herói de
       sangria total e a tipografia editorial — a mesma estrutura de /services e
       /team. Esta era a última página do menu ainda em NavV1 + Poppins com um
       cabeçalho branco de 820px, e a diferença aparecia justamente na troca:
       sair de Services e cair aqui parecia mudar de site.

       ⚠️ A TIPOGRAFIA MUDA A BIBLIOTECA JUNTO. O `editorialFontClass` vale para
       a árvore inteira, então os cards do `InsightsLibrary` deixam a Poppins e
       passam a Geist + Source Serif. É o efeito pretendido, e é por isso que
       esta linha está no wrapper e não só no herói. */
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell footerTopBorder floatingNav>
        {/* O TÍTULO É O QUE JÁ ESTAVA NA PÁGINA — "Let's share some insights."
            Ele sobe do `<h1>` de 820px para o herói, sem uma palavra nova.

            ⏳ SEM SUBTÍTULO, e isso é falta de conteúdo, não de desenho. O
            `subtitle` deste herói é a "banner statement" do outline de Services,
            uma frase que diz o que está em jogo; para Insights não existe frase
            equivalente escrita pelo cliente, e inventá-la seria copy nossa numa
            página que é toda dele. A descrição de metadados aqui do lado serve
            ao buscador e foi escrita para isso — promovê-la a texto de herói é
            outra decisão, e é dele.

            A FOTO É A PADRÃO das páginas de serviço. Vale o mesmo que está
            escrito no componente: uma foto repetida lê como identidade, um slot
            vazio lê como site inacabado — e ela some sozinha no dia em que esta
            página ganhar a sua. */}
        <SolutionHero eyebrow="Insights" title="Let’s share some insights." />

        {/* ⚠️ A BIBLIOTECA FOI PARA 1440px EM 12-09, e isto REVERTE o que eu
            tinha escrito aqui em 11-09. O argumento era "1440 é medida de grade
            e isto é uma lista para ler, a 1440 as linhas ficariam longas
            demais". Ele está errado, e o erro foi olhar para a largura do
            CONTAINER em vez de para a largura do CARD.

            A biblioteca já é uma grade de três colunas. Dentro de 820px cada
            card ficava com ~256px, que é estreito para título mais resumo — os
            cards espremidos, não as linhas longas. A 1440 com `px-10` sobram
            1360, e três colunas com `gap-6` dão ~437px por card. A medida de
            leitura que eu queria proteger é a do CARD, e ela melhorou ao abrir
            o container, não piorou.

            O que some junto: o desalinhamento com o resto do site. Todas as
            outras páginas novas correm em 1440, e esta era a única em 820 — o
            rótulo e os cards começavam 310px adentro enquanto tudo o mais
            começa em 40px. */}
        <section id="library" className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
            {insights.length === 0 ? (
              <EmptyNotice>No insights published yet.</EmptyNotice>
            ) : (
              <InsightsLibrary insights={insights} />
            )}
          </div>
        </section>

        {/* ── OS LIVROS · 21-09 ─────────────────────────────────────────────
            VIERAM DA `/books`, que deixou de existir como tela: *"insights and
            books e a seção de book vai pra tela de insights"* (anotação da
            reunião de 21-09; o e-mail da cliente não toca no assunto, então a
            leitura é a das anotações). A página de livros durou dez dias — foi
            feita em 11-09, quando o cliente confirmou que são dois livros, e a
            condição para ela existir está contada em `lib/books.ts`.

            A ROTA NÃO MORREU: `/books` 308a para `#books` desta seção, em
            next.config, junto com `/our-book` e `/book-endorsements`, que
            apontavam para lá. É por isso que o `id` desta seção é exatamente
            `books` — ele é o destino de três redirects, não um nome escolhido.

            `bg-paper` CONTRA O `bg-white` DA BIBLIOTECA, e é a separação fazendo
            trabalho antes do título: a página passou a ter dois assuntos, e dois
            blocos de fundo igual leriam como um só, com os livros parecendo o
            rodapé da listagem editorial. A alternância é a mesma da home e a que
            a `/books` usava.

            A HIERARQUIA MUDOU DE NÍVEL NA MUDANÇA DE CASA. Na `/books` cada
            livro era uma seção da página e o cartão era `h2`; aqui a seção é
            "os livros" e tem o seu próprio `h2`, então o cartão volta ao `h3` —
            que é o padrão do componente e o que ele já faz na home, pela mesma
            razão. Nível de cabeçalho é estrutura do documento, não estilo. */}
        <section id="books" className="bg-paper">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
            <TypeLabel>Our Books</TypeLabel>
            {/* ⚠️ ESTE TÍTULO CONTINUA SENDO A ÚNICA COPY NÃO LITERAL DOS
                LIVROS, e a ressalva veio inteira da `/books`: a home chama o
                bloco de "The book behind the method" — singular, aprovado. Aqui
                ele está no plural, e isso é uma palavra minha, não do cliente.
                Pior: afirma que os DOIS livros estão por trás do método, e do
                segundo não se sabe nada. Se ele não servir, o substituto é uma
                linha deles.

                Escala de h2 da /team e da Client impact da home — as três seções
                com cabeçalho nas páginas editoriais usam a mesma. */}
            <h2 className="font-serif mb-[52px] max-w-[720px] text-[28px] font-semibold leading-[1.1] tracking-[-0.5px] text-ink sm:text-[34px] md:text-[40px]">
              The books behind the method.
            </h2>

            {/* `-mx-6 md:mx-0` — O CARTÃO É FAIXA SANGRADA NO TELEFONE, e sem
                esta linha ele deixaria de ser. Na `/books` e na home o
                contêiner dos livros não tem `px-6`, só `md:px-10`: o cartão
                escuro encosta nas duas bordas do telefone e traz o próprio
                respiro por dentro (`px-6 pb-10 pt-12` no BookCard, que também
                dispensa a borda abaixo de `md`). Aqui o contêiner é o da
                biblioteca editorial, que TEM `px-6` porque uma grade de cards
                claros precisa de margem — então o recuo é devolvido só nesta
                faixa. Sem isso o bloco escuro ficaria flutuando com 24px de
                branco dos lados, sem borda, e 48px de recuo interno: lê como
                erro de alinhamento, não como decisão. */}
            <div className="-mx-6 space-y-14 md:mx-0">
              {books.map((book) => (
                <Reveal key={book.name}>
                  {/* Os endossos entram DENTRO do cartão, como na home, para o
                      conjunto ler como um bloco só. Eles são do livro da Rhea —
                      recuperados da antiga /book-endorsements —, então acompanham
                      o primeiro livro e não a seção. */}
                  <BookCard book={book} headingLevel="h3">
                    <BookEndorsements />
                  </BookCard>
                </Reveal>
              ))}
            </div>

            {/* ── O SEGUNDO LIVRO ───────────────────────────────────────────
                SLOT, E NÃO UM "EM BREVE". A diferença importa: um aviso de
                pendência informa o visitante de uma coisa que não é problema
                dele, enquanto um slot dimensionado mostra ao cliente onde a peça
                cai. E não há uma palavra inventada aqui — nem título provisório,
                nem descrição de exemplo —, porque a página inteira é copy do
                cliente e um parágrafo nosso no meio seria o único que ele não
                escreveu.

                4:3 É A PROPORÇÃO DA CAPA no cartão acima, não um número
                escolhido: o slot tem de compor como vai compor com a imagem
                dentro.

                Era uma `<section>` própria na `/books`; aqui é um sub-bloco, e o
                rótulo segue `TypeLabel` e não cabeçalho de propósito — ele
                anuncia um vazio, e um `h3` no sumário do documento prometeria
                conteúdo que não existe. */}
            <div className="mt-16">
              <TypeLabel>The second book</TypeLabel>
              <div className="mt-8 md:w-[400px]">
                <ImagePlaceholder label="Second book, cover" className="aspect-[4/3] w-full" />
              </div>
            </div>
          </div>
        </section>
      </SiteShell>
    </div>
  );
}
