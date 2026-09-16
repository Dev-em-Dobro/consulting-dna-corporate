import Image from "next/image";

/**
 * O paredão de logos estático da Clients & Impact.
 *
 * ⚠️ POR QUE NÃO É O `LogoMarquee` QUE JÁ EXISTE. A home e a versão anterior
 * desta página correm os mesmos nomes em duas esteiras que se cruzam; o desenho
 * dela (imagem 1 do drive) mostra uma GRADE PARADA, alinhada, com a contagem à
 * direita. A diferença não é de estilo, é de função: a esteira sugere "muitos,
 * passando"; a grade deixa o visitante PROCURAR o próprio setor e encontrá-lo.
 * Numa página cujo trabalho é provar amplitude a quem veio conferir, ler vale
 * mais que movimento.
 *
 * A ESTEIRA CONTINUA NA HOME, e é isso que mantém as duas coerentes sem serem
 * iguais: mesma fonte de dados (`lib/logos.ts`), papéis diferentes.
 *
 * ⚠️ EM CORES E SEM HOVER, a pedido dela em 16-09. A primeira versão era o
 * tratamento usual de paredão de logos — escala de cinza a 60% de opacidade,
 * cor voltando no hover —, com o argumento de que 27 paletas diferentes numa
 * grade brigam pela atenção e o olho pula para o vermelho da Coca-Cola em vez
 * de varrer a fileira.
 *
 * O PEDIDO VENCE, e o raciocínio dela é melhor para ESTA página: o paredão é o
 * argumento de credibilidade, e logo apagado parece cliente antigo. A cor cheia
 * é como cada marca se apresenta, e é assim que o visitante reconhece a própria.
 * Sem hover porque não há para onde clicar — um estado de foco que não leva a
 * lugar nenhum promete interação que não existe.
 */
export default function LogoWall({ logos }: { logos: string[] }) {
  return (
    /* NOVE COLUNAS EM `lg`, e não oito nem sete: são 27 logos, e 27 ÷ 9 fecha
       exatamente três fileiras cheias. Em sete, a última fileira sai com seis
       células vazias ao lado da Dyson, e um buraco no canto de uma grade
       emoldurada lê como falta de logo, não como sobra de espaço. */
    <ul className="grid grid-cols-3 gap-px border border-line bg-line sm:grid-cols-4 lg:grid-cols-9">
      {logos.map((file) => (
        <li
          key={file}
          className="flex items-center justify-center bg-white px-4 py-7 md:px-6 md:py-8"
        >
          <Image
            src={`/logos/${file}`}
            alt={label(file)}
            width={150}
            height={60}
            /* `h-7` fixa a ALTURA e deixa a largura livre: os arquivos têm
               proporções muito diferentes (a Coca-Cola é larga e baixa, a Shell
               é quase quadrada) e travar a largura faria a concha encolher a
               ponto de sumir ao lado das marcas horizontais. Altura igual é o
               que faz logos diferentes pesarem igual numa grade. */
            className="h-7 w-auto object-contain md:h-8"
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * "morgan_stanley.png" → "morgan stanley", para o `alt`.
 *
 * O texto alternativo importa aqui: sem ele, um leitor de tela anuncia 27
 * imagens sem nome e a prova social — que é a razão de o bloco existir — não
 * chega a quem navega por áudio.
 */
const label = (file: string) =>
  file.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
