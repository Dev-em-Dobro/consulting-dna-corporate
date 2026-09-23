/**
 * O ACERVO "LIFE AT DNA" — a lista de fotos do carrossel e o enquadramento de
 * cada uma.
 *
 * MOROU DENTRO DA HOME ATÉ 21-09, e saiu de lá no dia em que a /team passou a
 * mostrar o mesmo carrossel (*"na seção One team da página /team tem que trocar
 * a imagem pelo carrossel de imagens da home"*). Duas páginas montando a mesma
 * lista cada uma por sua conta é como elas divergem em silêncio: a /team já
 * havia nascido com a versão ANTERIOR da conta — sem a remoção da foto
 * duplicada e sem mapa de enquadramento nenhum —, ou seja publicava a foto
 * repetida e os rostos cortados que a home tinha acabado de consertar.
 *
 * Importar a home de dentro da /team não era opção: `app/page.tsx` é um módulo
 * de rota, e um `import` cruzado entre páginas arrasta a árvore inteira de uma
 * para dentro do gráfico da outra.
 */

const dnaTime = (n: number) =>
  `/dna-time/dna-time-${String(n).padStart(2, "0")}.jpeg`;

/**
 * O acervo "life at DNA" que roda no carrossel da seção `#people`.
 *
 * ERA UMA CONTA INLINE (`Array.from({length: 28}).filter(n => n !== 5 && …)`).
 * Subiu para cá em 21-09 porque passou a ter um mapa de enquadramento gêmeo, e
 * duas listas que precisam casar por número de arquivo não podem morar uma no
 * meio do JSX e a outra em lugar nenhum.
 *
 * OS BURACOS DA SEQUÊNCIA, um por um — a lista nega, não afirma, para que uma
 * foto nova só precise ser jogada na pasta:
 *
 *   05, 08, 14   nunca existiram no acervo entregue.
 *   07           ⚠️ SAIU EM 23-09. É o jantar em que o grupo brinda com
 *                taças. A cliente pediu essa foto fora do carrossel da home
 *                e da /team. O arquivo continua em /public.
 *   10           ⚠️ SAIU EM 21-09. É A MESMA FOTO DA 15 — o grupo no pátio do
 *                escritório de Singapura —, só que a 1280x960 contra 1600x1200,
 *                e com um enquadramento um pouco mais fechado. O carrossel
 *                mostrava a mesma cena duas vezes, e na segunda vez pior: com
 *                640px de moldura em tela retina o navegador pede 1280px, que é
 *                exatamente o que a 10 tem, sem folga nenhuma. Isto é metade do
 *                *"photo quality is not great"* de 21-09 — a versão pequena
 *                esticada existindo ao lado da grande.
 *
 * ⏳ O QUE AINDA FALTA, e não é código: `dna-time-03` (768x1024) e
 * `dna-time-11` (739x1131) são os dois arquivos mais baixos do acervo e não têm
 * original maior em /public. Numa moldura de 640px em retina os dois são
 * AMPLIADOS, e por serem retrato dentro de uma moldura deitada só 42% e 37%
 * deles aparece. O enquadramento abaixo salva os rostos; a resolução só se
 * resolve com o arquivo original, que é pedido para a CDNA.
 */
export const LIFE_AT_DNA = Array.from({ length: 28 }, (_, i) => i + 1)
  .filter((n) => n !== 5 && n !== 7 && n !== 8 && n !== 10 && n !== 14)
  .map(dnaTime);

/**
 * ENQUADRAMENTO POR FOTO — 21-09: *"as fotos estao cortando os rostos"*
 * (e-mail: *"some photos are cropped"*).
 *
 * A moldura do carrossel é 16:10 no telefone e 16:9 do `sm` para cima, e o
 * acervo é quase todo 4:3 de celular. Numa foto 4:3 dentro de 16:9 só 75% da
 * ALTURA cabe, e centrado o corte tira 12,5% em cima — que é onde ficam as
 * cabeças da última fileira de toda foto de grupo. Nos dois retratos o estrago
 * é maior: sobram 42% (03) e 37% (11) da altura.
 *
 * A CONTA, para quem for ajustar: com `object-position: Y%`, a borda superior
 * visível cai em `Y × (1 − v)`, onde `v` é a fatia visível. Ou seja, baixar o
 * número SOBE o enquadramento.
 *
 * Quem não está aqui fica em `object-center`, que é o padrão do componente e o
 * certo para a maioria — só entra na lista a foto em que o centro erra.
 *
 *   01  30% → seria uma selfie de grupo com a fileira do fundo começando aos 7%
 *             de altura; centrado, a fila inteira perdia o alto da cabeça.
 *             Subindo, o rosto grande em primeiro plano perde o queixo — 30% é
 *             o ponto em que as duas pontas ainda cabem.
 *   03  30% → retrato: a facilitadora em pé tem a cabeça entre 20% e 28%, e o
 *             corte centrado (28,9%–71,1%) a DECAPITAVA. É o caso mais grosseiro
 *             do acervo e provavelmente o que a cliente viu.
 *   11  35% → retrato: o rosto em foco fica entre 24% e 42%; centrado, o corte
 *             começava aos 31,6% e cortava a testa.
 *   15  75% → não é rosto cortado, é composição: metade do quadro é céu e
 *             árvore, e o grupo está entre 47% e 83%. Descendo o enquadramento,
 *             o grupo ocupa a moldura em vez de flutuar na base dela.
 *   24  90% → mesma história, mais extrema: o pé-direito do salão come 60% da
 *             foto e as ~200 pessoas moram entre 60% e 85%.
 *   27  60% → o grupo ao ar livre começa aos 42%; centrado, sobrava céu em cima
 *             e cortava corpo embaixo.
 *
 * ⚠️ AS CLASSES ESTÃO ESCRITAS POR EXTENSO e têm de continuar assim — o
 * Tailwind varre o código atrás de nomes literais, e uma classe montada em
 * runtime não gera CSS. A foto voltaria para o centro sem erro nenhum.
 */
export const LIFE_AT_DNA_FRAMING: Record<string, string> = {
  [dnaTime(1)]: "object-[50%_30%]",
  [dnaTime(3)]: "object-[50%_30%]",
  [dnaTime(11)]: "object-[50%_35%]",
  [dnaTime(15)]: "object-[50%_75%]",
  [dnaTime(24)]: "object-[50%_90%]",
  [dnaTime(27)]: "object-[50%_60%]",
};
