/**
 * Herói da /insights  -  01-10, a pedido: *"arrange the books as a bookshelf"*.
 *
 * POR QUE NÃO É O <SolutionHero>. Aquele herói é foto de sangria total com o
 * texto POR CIMA, filtrada (`brightness .68`) e escurecida da esquerda. Uma
 * estante não sobrevive a isso: as capas são o assunto, e escurecidas e
 * cortadas pelo `object-cover` (no telefone sobraria ~30% da largura) deixam de
 * ser lidas. Aqui o texto e a estante dividem a dobra em COLUNAS, e a imagem é
 * `object-contain`, nunca recortada.
 *
 * O QUE FICA IGUAL ao SolutionHero, de propósito: `bg-ink`, `min-h-[84svh]`
 * com `pt-[76px]`, a régua + rótulo em `brand-light`, o `h1` em serifa 600 e a
 * entrada do `HeroIntro` (a estante entra como `h-sub`, depois do título).
 *
 * A ESTANTE É UMA COMPOSIÇÃO, não uma foto: as duas capas 3D do repositório
 * (`book-cover-home-transparent.png` e `nitin-restored-organization.png`) sobre
 * uma prateleira de madeira, com sombras de contato, a sombra do livro da
 * frente caindo sobre o de trás e um foco de luz na parede  -  tudo com fundo
 * transparente, para assentar no `ink`. O livro do Nitin fica um pouco atrás
 * (menor e com a base mais ao fundo da prateleira), com a lombada escondida
 * pelo da Rhea e a capa inteira à mostra. Gerada com Pillow a partir desses dois
 * PNGs; trocar uma capa = recompor o arquivo `insights-bookshelf.webp`.
 *
 * TELEFONE: estante em cima, texto embaixo  -  a mesma ancoragem inferior dos
 * outros heróis (`justify-end`), só que sem texto sobre imagem.
 */
import Image from "next/image";
import HeroIntro from "@/components/HeroIntro";
import bookshelf from "@/public/insights/insights-bookshelf.webp";

export default function InsightsHero({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="relative isolate flex min-h-[84svh] flex-col justify-end overflow-hidden bg-ink pt-[76px] text-white lg:justify-center">
      {/* Luz ambiente atrás da estante. O foco principal já vem na imagem; isto
          só abre o `ink` em volta dela para o livro preto não se perder no
          fundo nas bordas do arquivo. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 55% 65% at 50% 32%, rgba(255,255,255,.05), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden lg:block"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 48% 70% at 74% 50%, rgba(255,255,255,.06), transparent 72%)",
        }}
      />

      <HeroIntro className="mx-auto grid w-full max-w-[1440px] grid-cols-[minmax(0,1fr)] items-center gap-6 px-6 pb-16 pt-6 md:px-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10 lg:py-16">
        <div className="lg:order-1">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-bar inline-block h-0.5 w-9 bg-brand-light" />
            <span className="h-eyebrow text-left text-[14px] font-medium uppercase leading-none tracking-[1.3px] text-brand-light">
              {eyebrow}
            </span>
          </div>
          <h1 className="h-title font-serif max-w-[620px] text-[38px] font-semibold leading-[1.08] tracking-[-0.2px] text-white [text-wrap:balance] sm:text-[48px] md:text-[58px]">
            {title.replace(/\.$/, "")}
          </h1>
        </div>

        {/* `order-first` no telefone: a estante vai para o topo da dobra e o
            texto fica ancorado embaixo, como nos outros heróis. A ordem do DOM
            continua texto → imagem, que é a ordem da leitura e da entrada.
            O `-mx-4` do telefone devolve à estante parte da margem: as pontas
            da prateleira já esmaecem dentro do arquivo, e sem isso os livros
            ficavam pequenos numa tela de 390px. `minmax(0,1fr)` na grade
            impede a largura intrínseca da imagem (1600px) de estourar a coluna. */}
        <div className="h-sub order-first -mx-4 sm:mx-auto sm:w-full sm:max-w-[640px] lg:order-2 lg:max-w-[820px]">
          <Image
            src={bookshelf}
            alt="Leadership: It's in Your DNA by Rhea Leckie and The Restored Organization by Nitin Goil and Sebastian Anthony, standing side by side on a bookshelf"
            priority
            sizes="(min-width: 1440px) 820px, (min-width: 1024px) 56vw, (min-width: 640px) 640px, 100vw"
            className="h-auto w-full"
          />
        </div>
      </HeroIntro>
    </section>
  );
}
