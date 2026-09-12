import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import EmptyNotice from "@/components/EmptyNotice";
import InsightsLibrary from "@/components/insights/InsightsLibrary";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { getInsightListEntries } from "@/lib/cms/map";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Insights — Corporate DNA",
    description:
      "Perspectives on leadership, executive-team alignment, succession and enterprise transformation from Corporate DNA's senior advisory faculty.",
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

        {/* A BIBLIOTECA FICA EM 820px, e não nos 1440 do herói. Não é descuido
            de alinhamento: 1440 é medida de grade — dez cards, cinco quadros de
            região —, e isto é uma lista para LER. A 1440 as linhas de título e
            resumo ficariam longas demais. O rótulo acompanha a coluna do texto,
            então o eixo interno do bloco é coerente mesmo com o herói mais
            largo — é o mesmo critério que a /cases usa, e as duas continuam
            alinhadas entre si. */}
        {/* ⏳ SEM RÓTULO DE SEÇÃO. Chegou a ter um — e ele era copy INVENTADA
            por nós ("Latest thinking"), que é exatamente o que esta página não
            pode ter. O herói já diz "Insights" no rótulo dele; repetir a palavra
            aqui não acrescenta, e qualquer outra frase seria nossa. Quando o
            cliente escrever uma linha para esta seção, ela entra aqui. */}
        <section id="library" className="bg-white">
          <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
            {insights.length === 0 ? (
              <EmptyNotice>No insights published yet.</EmptyNotice>
            ) : (
              <InsightsLibrary insights={insights} />
            )}
          </div>
        </section>
      </SiteShell>
    </div>
  );
}
