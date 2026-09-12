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
import Image, { type StaticImageData } from "next/image";
import fallbackPhoto from "@/public/solutions/service-hero-fallback.jpg";
import HeroIntro from "@/components/HeroIntro";

export default function SolutionHero({
  eyebrow,
  title,
  subtitle,
  imageUrl,
  tint = "none",
  imageFilter = "saturate-[.65] brightness-[.68]",
  imagePosition = "object-center",
  scrollCueHref,
  scrollCueLabel = "Scroll to see more",
}: {
  eyebrow: string;
  title: string;
  /** A "banner statement" do outline de 09-09 — uma frase, não um parágrafo. */
  subtitle?: string;
  /**
   * A foto do herói.
   *
   * DOIS TIPOS DE PROPÓSITO: `string` é o CMS (`bannerMediaId` → `bannerUrl`,
   * uma URL do CDN) e `StaticImageData` é arquivo do repositório. O `next/image`
   * sempre aceitou os dois; era o tipo daqui que só aceitava um, e isso apareceu
   * em 12-09 quando a `/books` ganhou fotografia própria — a primeira página a
   * não dividir a padrão.
   *
   * SEM ELA CAI NUM PADRÃO, e isso é decisão, não descuido: das doze rotas que
   * usam este herói, onze não têm fotografia própria. Um slot vazio em onze
   * páginas lê como site inacabado; a mesma foto em onze lê como identidade — e
   * some sozinha à medida que cada uma ganha a sua, sem tocar em código.
   */
  imageUrl?: string | StaticImageData;
  /**
   * `object-position` da foto, em classe do Tailwind. Padrão `object-center`.
   *
   * EXISTE PORQUE O TEXTO MORA SEMPRE À ESQUERDA. Numa foto de atmosfera isso
   * não importa — dá no mesmo o que fica atrás do título. Importa quando a foto
   * tem UM assunto: a `/books` tem o livro, e centrado ele nascia debaixo do
   * `h1`. Deslocar o enquadramento manda o assunto para a metade livre sem
   * mexer no arquivo nem no texto.
   *
   * ⚠️ O CURSO É O QUE `object-cover` SOBRA, e é bom medir antes de escolher: se
   * a foto e o quadro tiverem quase a mesma proporção, a sobra é de dezenas de
   * pixels e nenhum valor aqui resolve nada. Foi o caso da primeira versão desta
   * mesma imagem — 94px de curso vertical, contra os 150px que o assunto
   * precisava subir. A saída ali foi recortar o arquivo, não mover o
   * enquadramento.
   */
  imagePosition?: string;
  /**
   * A camada `multiply` por cima da foto. **O padrão é não ter nenhuma.**
   *
   * ⚠️ ERA UM DUOTONE ATÉ 11-09 — `linear-gradient(120deg, #6b5d61, #93615a,
   * #c2564a)`, carvão indo para vermelho. Saiu a pedido, primeiro na /team e
   * agora nas doze rotas: o vermelho daqueles heróis nunca veio da fotografia,
   * vinha desta camada. `none` é valor válido de `background-image`, então o
   * `div` continua no DOM e simplesmente não pinta — saída limpa, sem prop nova
   * e sem ramo no JSX.
   *
   * Quem passar um gradiente aqui reativa o duotone para a sua página.
   */
  tint?: string;
  /**
   * Filtro CSS aplicado à FOTO.
   *
   * É O DA HOME, copiado de `HERO_TINT.filter` em `HeroV2` — as duas páginas
   * passam a tratar a foto do herói igual.
   *
   * O `brightness` NÃO É ENFEITE, e é a peça que se esquece ao tirar um
   * duotone: `multiply` escurece por definição, então remover a camada devolve
   * à foto um brilho que os escurecimentos laterais deste herói não previam.
   * O `.68` repõe em neutro o que a camada fazia em cor. Sem ele o texto branco
   * perde contraste no terço claro da imagem.
   *
   * O `saturate` subiu de `.55` para `.65` junto: o `.55` existia para matar a
   * luz tungstênio amarela da foto padrão, que o `multiply` transformava em
   * laranja. Sem `multiply` esse problema não existe, e dessaturar tanto só
   * apagava a imagem.
   */
  imageFilter?: string;
  /**
   * Âncora da seta de rolagem no pé da dobra (`"#what-we-do"`). SEM ELA A SETA
   * NÃO EXISTE, e o padrão é não existir de propósito: este herói serve doze
   * rotas, e a seta só se paga onde a dobra cheia realmente esconde o resto.
   *
   * É UM LINK E NÃO UM BOTÃO porque o `html { scroll-behavior: smooth }` do
   * `globals.css` já entrega a rolagem suave de graça — e um `<a href="#...">`
   * funciona sem JS, o que mantém este componente de servidor. A NavV2 é
   * `absolute`, então ela rola junto e não há barra fixa para descontar do
   * destino.
   */
  scrollCueHref?: string;
  /** O que o leitor de tela ouve. A seta em si é `aria-hidden`. */
  scrollCueLabel?: string;
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
        className={`-z-30 object-cover ${imagePosition} ${imageFilter}`}
      />

      {/* A CAMADA DE COR — hoje vazia (`tint="none"` é o padrão), e mantida no
          DOM para quem quiser reativar um duotone por página.

          O `multiply` fica aqui e não vira camada chapada porque é a única
          mistura que serve a este lugar: chapado sobre foto escura vira lama,
          já que clareia as sombras; o multiply mantém os pretos e tinge só o
          que tem luz. Quem devolver um gradiente ao `tint` herda isso de graça. */}
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

      {/* A ENTRADA É A DA HOME, desde 11-09 — a escada de
          `lib/hero-timeline.ts`, a mesma que a /about roda. Este herói é o de
          /team, o das dez páginas de serviço e o do índice: sem isto, sair da
          home ou da /about para qualquer uma delas era passar de um herói que
          entra para um que já está lá.

          AQUI DÁ PARA USAR A RÉGUA (`h-bar`), que a /about não tem: lá o rótulo
          é um `TypeLabel`, que traz a régua dentro e entra como peça única; aqui
          o traço é um `<span>` separado, então ele cresce da esquerda antes de o
          rótulo aparecer, exatamente como na home. Não há `h-cta` — este herói
          não tem botão.

          ⚠️ AS CLASSES NASCEM COM `opacity: 0` (globals.css, sob `html.js`), e é
          o `HeroIntro` que as revela. Tirar o wrapper e deixar as classes
          publica um herói invisível — ele tem prazo de segurança de 10s
          justamente para que nenhum caminho termine assim. */}
      <HeroIntro className="mx-auto w-full max-w-[1440px] px-6 py-20 md:px-10">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-bar inline-block h-0.5 w-9 bg-brand-light" />
          {/* `text-left` EXPLÍCITO. Sem ele o texto herda alinhamento do pai e se
              centraliza DENTRO DA PRÓPRIA CAIXA quando quebra em duas linhas — a
              primeira recua para o meio e abre um vão aparente contra a régua,
              que continua colada à esquerda. */}
          <span className="h-eyebrow text-left text-[14px] font-medium uppercase leading-none tracking-[1.3px] text-brand-light">
            {eyebrow}
          </span>
        </div>

        {/* Maior que na versão anterior (46px → 58px): sem a caixa de 54% da
            imagem limitando a coluna, o título tem a largura da página, e num
            herói de sangria total ele é a única coisa que segura a composição
            contra a foto. */}
        <h1 className="h-title font-serif max-w-[760px] text-[38px] font-semibold leading-[1.08] tracking-[-0.2px] text-white [text-wrap:balance] sm:text-[48px] md:text-[58px]">
          {title}
        </h1>

        {subtitle && (
          <p className="h-sub mt-6 max-w-[560px] text-[19px] leading-[1.45] text-white/80 md:text-[21px]">
            {subtitle}
          </p>
        )}

        {/* A SETA DE ROLAGEM — mora aqui dentro, e não ao lado do <HeroIntro>,
            porque o `buildHeroIntro` só enxerga o que está dentro do escopo
            dele. O posicionamento não sofre com isso: o wrapper do HeroIntro
            não tem `position`, então o `absolute` daqui se mede pela <section>,
            que é `relative` — a seta fica presa ao pé da DOBRA, e não ao pé do
            bloco de texto, que no desktop está centralizado.

            À ESQUERDA, e não centralizada, por duas razões que apontam para o
            mesmo lugar. A composição é toda de eixo esquerdo — régua, rótulo,
            título, apoio — e uma seta no meio abriria um segundo eixo só para
            ela. E é onde o escurecimento do desktop é mais forte (.90 na borda
            esquerda contra ~.38 no centro): centralizada, ela cairia justamente
            na parte clara da foto, onde branco a 65% deixa de ser legível.

            O `max-w-[1440px] px-6/px-10` repete o do <HeroIntro> porque é o que
            faz a seta nascer exatamente na mesma margem do título em telas mais
            largas que 1440 — sem isso ela encostaria na borda da janela.

            SÓ NO DESKTOP (`hidden md:block`), e isto foi medido, não presumido.
            No telefone o texto é ancorado embaixo (`justify-end`) e ocupa a
            dobra até o fim: num 390×844 o subtítulo termina a 764px de 844, e
            não sobra faixa vazia onde pôr a seta. Com o banner de cookies
            aberto fica pior — ele tem 163px ali (contra 85 no desktop, porque o
            texto reflui), e a seta, empurrada por `--consent-h`, aterrissava em
            cima da palavra "leaders" no meio do título.

            E ela também serve menos ali: quem inventou o gesto de rolar foi o
            telefone. Quem precisa do convite é o visitante de desktop diante de
            uma dobra cheia, de sangria total e parada, que não dá nenhum sinal
            de ter página embaixo. */}
        {scrollCueHref && (
          <div className="h-cue absolute inset-x-0 hidden md:block">
            <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10">
              {/* COM RÓTULO, e não a seta sozinha. Posta nua no canto, a 26px e
                  a quase 200px do fim do subtítulo, ela lia como respingo da
                  foto — um traço que se ignora, não um convite. O rótulo lhe dá
                  peso de instrução, e é a mesma micro-tipografia em versalete do
                  `eyebrow` lá em cima, então entra na família em vez de virar
                  peça avulsa.

                  BRANCO E NÃO `brand-light`: nesta página o vermelho é o acento
                  que marca o COMEÇO das coisas (régua, rótulo, CTA). Um segundo
                  vermelho no pé disputaria essa função. */}
              <a
                href={scrollCueHref}
                aria-label={scrollCueLabel}
                className="inline-flex items-center gap-3 py-2 text-white/60 transition-colors hover:text-white"
              >
                <span className="text-[12px] font-medium uppercase leading-none tracking-[1.6px]">
                  Scroll
                </span>
                <span className="cue-bob block">
                  <svg
                    aria-hidden
                    width="16"
                    height="24"
                    viewBox="0 0 16 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {/* Haste comprida com ponta curta: é a mesma régua de 36×2
                        do rótulo, virada de pé. Um chevron solto seria de outra
                        família gráfica. */}
                    <path d="M8 2v18" />
                    <path d="m2.5 15.5 5.5 5.5 5.5-5.5" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        )}
      </HeroIntro>
    </section>
  );
}
