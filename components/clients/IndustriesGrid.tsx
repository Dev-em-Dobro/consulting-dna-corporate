import Image from "next/image";
import type { Industry } from "@/lib/industries";

/**
 * "Industries we work in" — oito blocos escuros, ícone de traço e o nome do
 * setor, como na imagem 2 do drive.
 *
 * ELA PEDIU ESTE BLOCO EM LETRA na daily de 16-09: *"the industries we work in
 * (…) just literally it can be exactly like this"*. É o único pedaço da imagem
 * 2 que entra na página — o resto da Clients & Impact segue a imagem 1.
 *
 * ⚠️ SEM AS FOTOGRAFIAS, POR ENQUANTO. No desenho cada bloco tem uma foto do
 * setor por trás; elas são dela (*"that's my job"*) e ainda não chegaram. Até
 * lá o bloco cai no CAMPO DE COR — o mesmo recurso dos cards de serviço desde
 * 12-09: `ink` com um leve degradê e a inicial do setor em marca d'água. Não
 * fica um buraco cinza, não depende de arquivo inexistente, e o dia em que as
 * fotos chegarem é um caminho por item em `lib/industries.ts`, sem tocar aqui.
 *
 * NÃO SÃO LINKS. No desenho dela o bloco não leva a lugar nenhum — não existe
 * página de setor, e a biblioteca de cases ainda não filtra por indústria
 * (`facets.industry` está vazio nos nove cases de 16-09). Um bloco clicável que
 * não vai a lugar nenhum é pior que um bloco parado.
 */
export default function IndustriesGrid({ items }: { items: Industry[] }) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((industry) => (
        <li
          key={industry.name}
          className="relative isolate flex min-h-[112px] items-center gap-4 overflow-hidden bg-ink px-5 py-6 text-white md:min-h-[128px]"
        >
          {industry.image ? (
            <>
              <Image
                src={industry.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="-z-10 object-cover object-center"
              />
              {/* A foto tem de perder para o texto: o nome do setor é a
                  informação, a imagem é o clima. */}
              <div className="absolute inset-0 -z-10 bg-ink/65" />
            </>
          ) : (
            <span
              aria-hidden
              className="pointer-events-none absolute -right-3 -bottom-7 -z-10 select-none text-[86px] font-bold leading-none tracking-[-3px] text-white/[.07]"
            >
              {industry.name.charAt(0)}
            </span>
          )}

          <IndustryIcon name={industry.icon} />
          {/* `text-balance` para os nomes de duas palavras longas: sem ele,
              "Industrial & Manufacturing" quebra deixando uma palavra órfã na
              segunda linha em metade das larguras. */}
          <p className="text-[14.5px] font-medium leading-[1.3] tracking-[-0.2px] [text-wrap:balance] md:text-[15px]">
            {industry.name}
          </p>
        </li>
      ))}
    </ul>
  );
}

/**
 * Ícones de traço, desenhados aqui e não trazidos de uma biblioteca: são oito,
 * cada um é meia dúzia de linhas, e um pacote de ícones inteiro no bundle para
 * isso não se paga. Todos no mesmo quadro de 24 e na mesma espessura de 1,5 —
 * é o que faz oito desenhos diferentes lerem como um conjunto.
 */
function IndustryIcon({ name }: { name: Industry["icon"] }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: "shrink-0 text-brand-light",
  };

  switch (name) {
    case "leaf":
      return (
        <svg {...common}>
          <path d="M4 20c0-8 5-13 16-14 0 10-5 15-13 15H4Z" />
          <path d="M4 20c4-5 8-8 12-9.5" />
        </svg>
      );
    case "pharma":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    case "finance":
      return (
        <svg {...common}>
          <path d="M3 20h18M5 20v-8M10 20V9M15 20v-6M20 20V5" />
        </svg>
      );
    case "consumer":
      return (
        <svg {...common}>
          <path d="M8 3h8l1 4H7l1-4Z" />
          <path d="M7 7h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7Z" />
          <path d="M7 13h10" />
        </svg>
      );
    case "retail":
      return (
        <svg {...common}>
          <path d="M4 8h16l-1.2 12H5.2L4 8Z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      );
    case "tech":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="12" rx="1.5" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      );
    case "industry":
      return (
        <svg {...common}>
          <path d="M3 20V11l5 3V11l5 3V7l8 5v8H3Z" />
          <path d="M8 20v-3M13 20v-3M18 20v-3" />
        </svg>
      );
    case "services":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
          <path d="M16 6.5a3 3 0 0 1 0 5.8M17.5 20c0-2.5-.8-4.2-2-5.3" />
        </svg>
      );
  }
}
