/**
 * Herói das páginas de serviço — foto de sangria total, texto por cima.
 *
 * ESCOLHIDO EM 10-09 entre seis variações postas lado a lado (`/hero-tests`,
 * rota descartável, já removida): duotone laranja, cinza→vermelho dessaturado,
 * cinza→vermelho em P&B, sangria total, divisão dura 50/50 e um editorial sem
 * foto. Venceu a sangria total.
 *
 * O QUE ELA TROCA. A versão anterior era a composição da /about — foto contida
 * numa caixa de 54% presa à direita, `ink` puro nos 46% da esquerda. Aqui a foto
 * ocupa a largura inteira e o `ink` vira um escurecimento POR CIMA dela, vindo
 * da esquerda. Ganha presença de imagem; perde o campo escuro limpo que a About
 * usa atrás do texto, e é por isso que o escurecimento tem de trabalhar mais.
 *
 * POR QUE NÃO É O <PageHero>. Ele serve oito rotas que continuam em Poppins com
 * a barra vermelha (5H, Awards, Our Clients, Our Impact…), cravado em
 * `font-bold`, `tracking-[-1.5px]`, rótulo de 12,5px/2px e largura de 1200.
 * Quando a última migrar, o caminho é o contrário: este vira a definição e o
 * PageHero some.
 *
 * O QUE VEIO DA /about e fica:
 *   • h1 em SERIFA, peso 600. Sobre escuro a letra branca parece mais fina do
 *     que é; o 600 compensa o degrau.
 *   • Rótulo a 14px/1,3px com régua de 36×2, os dois em `brand-light`. #d84339
 *     sobre escuro dá 2,87:1, abaixo da régua de 3:1 que vale até para elemento
 *     gráfico; o tom claro devolve 4,53:1. Régua e texto mudam JUNTOS — leem
 *     como um objeto só.
 *   • Largura de 1440 e `100svh` com `pt-[76px]`.
 */
import Image from "next/image";
import fallbackPhoto from "@/public/solutions/service-hero-fallback.jpg";

export default function SolutionHero({
  eyebrow,
  title,
  subtitle,
  imageUrl,
  tint = "linear-gradient(120deg, #6b5d61 0%, #93615a 55%, #c2564a 100%)",
  imageFilter = "saturate-[.55]",
}: {
  eyebrow: string;
  title: string;
  /** A "banner statement" do outline de 09-09 — uma frase, não um parágrafo. */
  subtitle?: string;
  /**
   * A foto do serviço, quando o CMS tem uma (`bannerMediaId` → `bannerUrl`).
   *
   * SEM ELA CAI NUM PADRÃO, e isso é decisão, não descuido: são dez páginas e
   * nenhuma tem fotografia própria hoje. Um slot vazio em dez páginas lê como
   * site inacabado; a mesma foto em dez lê como identidade — e some sozinha à
   * medida que cada serviço ganha a sua, sem tocar em código.
   */
  imageUrl?: string;
  /** O duotone sobre a foto. Ver a caixa no ponto de uso. */
  tint?: string;
  /**
   * Filtro CSS aplicado à FOTO, antes do tint.
   *
   * Existe por causa do laranja. O tint é `multiply`, e multiply sobre a luz
   * tungstênio amarela da foto padrão dá laranja — não era o vermelho da marca
   * errado, era a cor da lâmpada entrando na conta. Dessaturar antes tira o
   * amarelo da equação e o mesmo tint passa a ler como cinza indo para vermelho.
   */
  imageFilter?: string;
}) {
  const src = imageUrl ?? fallbackPhoto;
  return (
    /* `100svh` MAIS `pt-[76px]`, como a /about. O menu é a NavV2 (`floatingNav`
       no SiteShell), que é `absolute` e não ocupa fluxo — não há o que
       descontar, e o `pt` só impede que o rótulo nasça debaixo dele.

       `svh` e não `vh`: no telefone `100vh` conta a tela COM a barra de endereço
       retraída, e a base do bloco fica escondida atrás do navegador até rolar.

       `min-h` e não `h`: em telefone baixo com título de três linhas o conteúdo
       cresce e o bloco cresce junto, em vez de cortar.

       A SANGRIA TOTAL SIMPLIFICOU O TELEFONE. Enquanto a foto vivia numa caixa
       de 54% à direita, o telefone precisava de uma composição própria — a foto
       descia para o fluxo, abaixo do texto, com uma costura escondendo o corte.
       Agora ela está atrás de tudo nas duas telas, e o que muda entre elas é só
       a DIREÇÃO do escurecimento. Menos código e uma classe inteira de defeito
       de sobreposição que deixa de existir. */
    <section className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-ink pt-[76px] text-white md:justify-center">
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className={`-z-30 object-cover object-center ${imageFilter}`}
      />

      {/* DUOTONE — `multiply`, não camada chapada. Chapado sobre foto escura
          vira lama, porque clareia as sombras; o multiply mantém os pretos e
          tinge só o que tem luz.

          POR QUE NÃO O VERMELHO DA MARCA PURO, testado e descartado: a página
          usa vermelho como ACENTO — rótulo, régua, CTA, divisórias. Com o fundo
          também vermelho o acento perde a função e o rótulo vira parte da
          parede. O degradê resolve: começa em carvão, onde o texto mora, e só
          chega ao vermelho na borda oposta. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 mix-blend-multiply"
        style={{ backgroundImage: tint }}
      />

      {/* ESCURECIMENTO — a diferença entre as duas telas.
          Desktop: vem da ESQUERDA, onde o texto mora, e abre para a direita,
          deixando a foto respirar. É a composição que a variação 4 tinha. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden md:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(35,31,33,.90) 0%, rgba(35,31,33,.66) 38%, rgba(35,31,33,.24) 62%, rgba(35,31,33,.06) 100%)",
        }}
      />

      {/* No TELEFONE o gradiente horizontal não serve: numa tela de 390px o
          texto atravessa a largura inteira, então "escuro à esquerda, claro à
          direita" deixaria o fim de cada linha sobre foto crua. Aqui ele é
          VERTICAL e sobe da base, porque no telefone o texto foi ancorado
          embaixo (`justify-end`) em vez de centralizado.

          ⚠️ A PRIMEIRA VERSÃO ERROU PARA O LADO ESCURO, e o erro só apareceu
          medindo. Ela fechava o gradiente inteiro (.92/.86/.62/.80) para cobrir
          o texto no centro, e o resultado dava 15:1 de contraste — três vezes
          mais do que texto pequeno precisa — ao custo de apagar a foto por
          completo. Contraste de sobra não é segurança, é imagem jogada fora.

          Ancorar o texto embaixo desfaz o conflito: o escurecimento fica onde o
          texto está e o terço de cima abre, então a foto volta a existir. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 md:hidden"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(35,31,33,.92) 0%, rgba(35,31,33,.86) 38%, rgba(35,31,33,.44) 62%, rgba(35,31,33,.14) 82%, rgba(35,31,33,.20) 100%)",
        }}
      />

      <div className="mx-auto w-full max-w-[1440px] px-6 py-20 md:px-10">
        <div className="mb-5 flex items-center gap-3">
          <span className="inline-block h-0.5 w-9 bg-brand-light" />
          {/* `text-left` EXPLÍCITO. Sem ele o texto herda alinhamento do pai e se
              centraliza DENTRO DA PRÓPRIA CAIXA quando quebra em duas linhas — a
              primeira recua para o meio e abre um vão aparente contra a régua,
              que continua colada à esquerda. */}
          <span className="text-left text-[14px] font-medium uppercase leading-none tracking-[1.3px] text-brand-light">
            {eyebrow}
          </span>
        </div>

        {/* Maior que na versão anterior (46px → 58px): sem a caixa de 54% da
            imagem limitando a coluna, o título tem a largura da página, e num
            herói de sangria total ele é a única coisa que segura a composição
            contra a foto. */}
        <h1 className="font-serif max-w-[760px] text-[38px] font-semibold leading-[1.08] tracking-[-0.2px] text-white [text-wrap:balance] sm:text-[48px] md:text-[58px]">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-6 max-w-[560px] text-[19px] leading-[1.45] text-white/80 md:text-[21px]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
