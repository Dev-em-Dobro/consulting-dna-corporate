import { pillarIcon } from "@/components/solutions/SolutionPillars";
import Reveal from "@/components/Reveal";
import type { ServiceOutcomeSummary } from "@/lib/services";

/**
 * "THE OUTCOME" — o fecho do layout de Family Business Consulting (24-09).
 *
 * Manchete, quatro resultados com ícone, a caixa rosa com as três linhas em
 * vermelho, e "OUR EXPERIENCE" na coluna da direita.
 *
 * ⚠️ NÃO É O `SolutionProof`, ainda que os dois fechem uma página. Lá são três
 * CARTÕES escuros com título, subtítulo e parágrafo; aqui são quatro legendas
 * nuas sobre fundo branco, mais um campo de cor que não é cartão de nada — é
 * uma frase. Dar ao `SolutionProof` uma variante clara sem cartão o faria
 * desenhar duas coisas diferentes conforme o dado, que é o que este repositório
 * já desfez uma vez.
 *
 * ⚠️ NÃO É O `evidenceSummary.experience` TAMPOUCO. Aquele apresenta uma
 * FILEIRA DE LOGOS ("…including:") e vive dentro da faixa de evidência; este é
 * um parágrafo solto ao lado do resultado, e esta página não tem logos.
 *
 * ⚠️ OS ÍCONES VÊM DO MAPA DE `SolutionPillars`, via `pillarIcon`, casando pelo
 * rótulo exato — incluindo o PONTO FINAL, que o layout escreve e que faz parte
 * da chave. Rótulo sem linha no mapa cai no círculo de fallback.
 */
export default function SolutionOutcome({
  item,
}: {
  item?: ServiceOutcomeSummary;
}) {
  const results = (item?.items ?? []).filter((i) => i.trim());
  if (!item || results.length === 0) return null;

  const note = (item.note ?? []).filter((n) => n.trim());

  return (
    /* BRANCO contra a faixa `paper` do "What shifts" logo acima — o mesmo
       degrau que separa as provas do ecossistema na Culture Transformation. */
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
        <Reveal className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            {item.label?.trim() ? (
              <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
                {item.label}
              </p>
            ) : null}
            <h2
              className={`font-serif text-[28px] font-semibold leading-[1.15] tracking-[-0.3px] text-ink md:text-[36px] ${
                item.label?.trim() ? "mt-6" : ""
              }`}
            >
              {item.headline}
            </h2>

            {/* A CAIXA ROSA É A QUINTA CÉLULA DA FILEIRA no desenho, e aqui ela
                é uma coluna própria ao lado das quatro: numa grade única ela
                herdaria os filetes e a centralização das legendas, e deixaria
                de ler como campo de cor. */}
            <div className="mt-12 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] lg:gap-10">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-0 lg:divide-x lg:divide-line">
                {results.map((result) => {
                  const Icon = pillarIcon(result);
                  return (
                    <li key={result} className="text-center lg:px-4">
                      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
                        {/* DECORATIVO: a legenda abaixo diz a mesma coisa. */}
                        <Icon
                          aria-hidden
                          size={26}
                          strokeWidth={1.5}
                          className="text-brand"
                        />
                      </span>
                      <p className="mx-auto mt-4 max-w-[24ch] font-serif text-[14px] leading-[1.45] text-ink md:text-[15px]">
                        {result}
                      </p>
                    </li>
                  );
                })}
              </ul>

              {note.length > 0 ? (
                /* UMA LINHA POR ITEM, e não um texto com quebra automática: as
                   três frases do layout são três afirmações, e deixá-las
                   refluir juntaria "Evolve what must. Build what comes next."
                   numa linha só em tela larga. */
                <div className="flex flex-col justify-center bg-brand/5 p-6 md:p-7">
                  {note.map((line) => (
                    <p
                      key={line}
                      className="font-serif text-[20px] font-semibold leading-[1.2] text-brand md:text-[23px]"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {item.experience?.body?.trim() ? (
            <div>
              {item.experience.label?.trim() ? (
                <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
                  {item.experience.label}
                </p>
              ) : null}
              <p className="mt-6 font-serif text-[16px] leading-[1.6] text-ink md:text-[17px]">
                {item.experience.body}
              </p>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
