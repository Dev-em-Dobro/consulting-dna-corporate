import Link from "next/link";
import type { CaseFigure, CaseListEntry } from "@/lib/cms/map";

/**
 * UM CASE POR LINHA, na listagem da Clients & Impact. Nome do cliente, desafio e
 * o botão de ler a história à ESQUERDA; logo e números de impacto à DIREITA.
 *
 * ⚠️ REARRANJADO EM 17-09, e foi a segunda passada no mesmo dia. A primeira
 * versão saiu de *"cada case em uma linha com logo texto The challenge, e os
 * numeros de impactoo"* e montou TRÊS colunas — logo | desafio | números —, com
 * a linha inteira clicável. A segunda desfez quase tudo isso:
 *
 *     *"pega o logo e coloca ele na coluna da direita, em cima dos dados de
 *     numero, tira a coluna do logo e coloca o nome da empresa em cima do texto
 *     'the challenge', tira o clique em toda a celula e coloca um botão pra ler
 *     a historia completa em baixo do texto do challenge."*
 *
 * O QUE ISSO RESOLVE, e é o que faz a mudança valer mais que um rearranjo: a
 * coluna do logo custava 180px de largura para mostrar uma marca — e a MESMA
 * informação já vinha escrita no nome do cliente. Juntando logo e números do
 * lado direito, a coluna do desafio ganhou esses 180px inteiros, que é onde o
 * texto que alguém de fato lê mora.
 *
 * ⚠️ NÃO É MAIS UM `<a>` GIGANTE. Era um `<Link>` embrulhando a linha toda, com
 * `hover:bg-paper` de realce. Agora é um `<article>` comum com um botão dentro,
 * e três coisas saíram junto porque só existiam para servir àquele clique:
 *   • O REALCE DE `hover` na linha. Tarja que acende sob o cursor promete
 *     clique, e agora o clique é do botão.
 *   • O `px`/`-mx` PAR. Ele existia porque a tarja começava no pixel do logo e
 *     terminava no do número (*"o logo esta grudado na borda"*) — sem tarja, não
 *     há borda de tarja para dar respiro.
 *   • A SETA SOLTA embaixo dos números, que era o único sinal de que a linha
 *     clicava. O botão diz isso com palavras.
 *
 * ⚠️ A PLACA BRANCA DO LOGO TAMBÉM SAIU, e pelo mesmo encadeamento. Ela existia
 * para o logo continuar sobre branco quando a linha acendesse em `paper`; sem
 * realce, a linha é branca sempre e a placa seria um retângulo branco invisível
 * sobre fundo branco.
 *
 * ⚠️ ZEBRADA DESDE 18-09, e isso desfaz DUAS das linhas acima. Pedido da daily:
 * *cada linha alternando branco e cinza suave*. A linha deixou de ser "branca
 * sempre" — `odd:bg-white even:bg-paper`, a primeira branca porque a seção e o
 * `SectionHead` logo acima também são, e uma faixa cinza colada na régua do
 * cabeçalho competiria com ela.
 *
 *   • O PAR `px`/`-mx` VOLTOU. A faixa é uma tarja de novo, e sem o par ela
 *     começaria no pixel do nome e terminaria no do número — o mesmo *"logo
 *     grudado na borda"* de 17-09. `-mx-6 px-6 md:-mx-10 md:px-10` é a MESMA
 *     medida do `px` do contêiner da seção, de propósito: a faixa vai até a
 *     borda do contêiner (viewport inteiro no telefone, 1440px no desktop) e o
 *     conteúdo continua no eixo do `SectionHead`, porque o `px` devolve
 *     exatamente o que o `-mx` tirou. É o motivo de o `-mx` ter saído em 17-09
 *     lido ao contrário: ele só deslocava a lista quando não havia tarja.
 *   • A PLACA BRANCA DO LOGO NÃO VOLTA. As marcas de `public/logos/` são PNG
 *     com fundo transparente — as mesmas que correm sobre `bg-ink` na esteira
 *     da home —, então sobre `paper` elas simplesmente aparecem. A placa era
 *     para um logo com fundo branco, e nenhum tem.
 *
 * OS FIOS `border-t`/`border-b` SAÍRAM JUNTO. Eles separavam linhas da mesma
 * cor; com as faixas alternadas a própria mudança de fundo separa, e um fio
 * `line` (#ece9e6) sobre `paper` (#f3f3f3) é quase invisível — apareceria em
 * metade das emendas e sumiria na outra metade.
 *
 * ⚠️ NÃO É O `CaseRow` de `/cases`. Aquele também é "um por linha", mas empilha
 * VERTICALMENTE dentro do card — faixa de marca em cima, corpo embaixo — e mede
 * uns 400px de altura cada. Este é horizontal: as duas colunas dividem a linha.
 *
 * DEGRADA VAZIO: o CMS entrega case sem logo, sem `challenge` e sem número
 * nenhum. Sem logo, a coluna direita começa nos números; sem desafio, o botão
 * sobe e encosta no nome; sem número, a coluna direita fica só com o logo. O
 * nome do cliente e o botão são os dois únicos que sempre existem.
 */
export default function CaseLine({ entry }: { entry: CaseListEntry }) {
  /* ⚠️ AS FIGURAS AUTORADAS VÊM PRIMEIRO, E SÃO TODAS — corrigido em 17-09.
     Esta coluna mostrava UMA medida: o `metricValue`/`metricLabel`, que é o que
     `splitMetric` consegue arrancar por heurística da célula "Impact". No
     Vodafone isso publicava "700+ high-potential leaders developed" e escondia
     "60 to 70% promoted" e "91 Net Promoter Score" — duas das três provas do
     case, que a página dele mostra e a listagem não mostrava.

     O FALLBACK FICA, e não é zelo: `impactFigures` é campo do modelo NOVO de
     case, e os autorados no modelo anterior têm só `measurableResult` — para
     esses, o par derivado continua sendo tudo o que existe. A caixa do campo em
     `lib/cms/map.ts` conta a diferença entre os dois. */
  const figures: CaseFigure[] = entry.impactFigures?.length
    ? entry.impactFigures
    : entry.metricValue || entry.metricLabel
      ? [{ value: entry.metricValue, label: entry.metricLabel ?? "" }]
      : [];

  return (
    <article className="-mx-6 grid grid-cols-1 gap-8 px-6 py-10 odd:bg-white even:bg-paper md:-mx-10 md:grid-cols-[1fr_340px] md:gap-12 md:px-10 md:py-12">
      {/* ── ESQUERDA · nome, desafio, botão ──────────────────────────────── */}
      <div>
        {/* ⚠️ `h3` E NÃO `h2`: o `SectionHead` da seção já é o h2 ("Case
            studies"), e cada case está dentro dele. Uma lista de h2 irmãos
            quebraria a escada de cabeçalhos para quem navega por leitor de tela.

            O NOME REPETE O LOGO, de propósito e a pedido. Vale o registro porque
            parece redundância e não é: o logo é reconhecimento (quem já conhece a
            marca acha na varredura) e o nome é legibilidade (quem não conhece
            consegue LER, e um leitor de tela também). O `alt` do logo abaixo
            existe pelo mesmo motivo, e é por isso que ele não é decorativo. */}
        <h3 className="font-serif text-[22px] font-semibold leading-[1.2] tracking-[-0.3px] text-ink md:text-[26px]">
          {entry.client}
        </h3>

        {entry.challenge && (
          <>
            <p className="mt-6 text-[12px] font-medium uppercase tracking-[1.3px] text-brand">
              The challenge
            </p>
            {/* ⚠️ SEM `line-clamp`. Os textos do CMS vão de uma linha a um
                parágrafo, e cortar no terceiro renglón resolveria o alinhamento à
                custa de frases que terminam no meio. O `max-w-[70ch]` é o que
                segura a medida: o que varia é a altura da linha, e numa lista
                vertical altura desigual não incomoda. */}
            <p className="mt-2.5 max-w-[70ch] font-serif text-[16px] leading-[1.6] text-muted md:text-[17px]">
              {entry.challenge}
            </p>
          </>
        )}

        {/* O BOTÃO, e é ele que carrega o clique desde 17-09.
            ⚠️ É O BOTÃO DA PRÓPRIA SEÇÃO, um degrau menor — o "Explore all case
            studies" no pé desta lista usa exatamente esta linguagem (borda `ink`,
            preenchimento no `hover`). Inventar um terceiro tratamento de botão
            para a mesma página seria ganhar inconsistência de graça; o que muda é
            só a escala, porque este se repete uma vez por case e aquele fecha a
            seção inteira.

            ⚠️ O NOME DO CLIENTE VAI NO `aria-label`. São doze botões iguais na
            mesma página, e um leitor de tela que os lista fora de contexto ouve
            "Read the full story" doze vezes sem saber de quem. Com o rótulo, cada
            um diz de qual case é. O texto VISÍVEL fica curto de propósito. */}
        <Link
          href={`/cases/${entry.slug}`}
          aria-label={`Read the full story: ${entry.client}`}
          className="mt-7 inline-flex items-center gap-2 border border-ink px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.5px] text-ink transition-colors hover:bg-ink hover:text-white"
        >
          Read the full story
          <span aria-hidden>→</span>
        </Link>
      </div>

      {/* ── DIREITA · logo por cima dos números ──────────────────────────── */}
      <div className="flex flex-col gap-7 md:items-end md:text-right">
        {entry.logoUrl && (
          /* ⚠️ `<img>` CRU, E NÃO `next/image` — e aqui isso é CORREÇÃO DE
             DEFEITO, não preferência. O `next/image` exige `width`/`height`, e
             esse par vira a proporção da CAIXA. As marcas de `public/logos/` têm
             proporções muito diferentes entre si (Vodafone é 123x97, ou seja
             1,27:1; Morgan Stanley é 165x49, 3,4:1), então qualquer par fixo
             mente para a maioria delas: com `object-contain`, a marca era
             ENCAIXOTADA numa proporção alheia e desenhava bem menor que o teto
             de altura pedido — o Vodafone saía a ~35px num teto de 48.

             Sem `next/image` não há proporção declarada: o `max-h` limita e a
             largura sai da proporção REAL do arquivo. É o mesmo critério da
             faixa de parceiros e do mural de clientes, e pelo mesmo motivo — são
             PNG de dezenas de KB servidos no tamanho em que aparecem, e o
             otimizador não tem o que otimizar neles.

             ⏳ OS ARQUIVOS SÃO PEQUENOS e isso põe um teto real no tamanho. Em
             `public/logos/` há marcas de 46 a 97px de altura — Careem tem 106x47,
             Morgan Stanley 165x49 —, e numa tela retina a altura que ainda sai
             nítida é METADE da do arquivo: 23px no Careem, 24px no Morgan
             Stanley. Os 48px daqui já ampliam a maioria delas. É pedido de
             originais para a cliente, e é barato. Não vale "consertar"
             encolhendo: a 24px o logo some ao lado dos números.

             ⚠️ SUBIU PARA 68px EM 18-09 — pedido da daily: *aumentar os logos
             na linha*. De `max-h-12` (48px) para `max-h-[68px]`, +42%, e o teto
             de largura de 180 para 260px na mesma proporção, para as marcas
             largas (Morgan Stanley, 3,4:1) crescerem junto em vez de baterem na
             largura antes de chegar à altura. Cabe nos 340px da coluna com
             folga. O aviso acima sobre os ARQUIVOS PEQUENOS fica mais urgente,
             não menos: a 68px um PNG de 47px de altura é ampliado 1,4x já numa
             tela comum, e quase 3x numa retina. O pedido de originais continua
             de pé — o tamanho é da cliente, a nitidez depende dela. */
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={entry.logoUrl}
            alt={`${entry.client} logo`}
            loading="lazy"
            className="max-h-[68px] w-auto max-w-[260px]"
          />
        )}

        {/* ⚠️ EMPILHADAS, E NÃO EM FILEIRA. A faixa de evidência dos serviços põe
            os números lado a lado (`flex flex-wrap`), e a tentação é repetir o
            objeto aqui. Não cabe: lá a linha tem a largura do container, aqui a
            coluna tem 340px, e três medidas lado a lado deixariam ~73px para cada
            rótulo — "high-potential leaders developed" sairia em cinco linhas de
            duas palavras. Empilhadas, cada rótulo tem a coluna inteira.

            ⚠️ O VERMELHO É O `brand` CHEIO porque a linha vive em fundo claro —
            a regra de uma linha do `globals.css`: `brand` em fundo claro,
            `brand-light` em fundo escuro. O numeral passa dos 24px que a norma usa
            como divisa de "texto grande", então o teto de 4,39:1 desta cor fica
            acima do mínimo de 3,0 que vale nesse tamanho.

            ⚠️ FIGURA SEM VALOR É LEGÍTIMA — `caseFigures` deixa passar linha com
            rótulo e sem número, porque a cliente escreve achado qualitativo na
            mesma coluna das métricas. Por isso o `value` é opcional aqui. */}
        {figures.map((f, i) => (
          <div key={i}>
            {f.value && (
              <p className="text-[26px] font-semibold leading-[1.02] tracking-[-1px] text-brand md:text-[30px]">
                {f.value}
              </p>
            )}
            {f.label && (
              <p className="mt-1 max-w-[300px] font-serif text-[13px] leading-[1.4] text-muted">
                {f.label}
              </p>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
