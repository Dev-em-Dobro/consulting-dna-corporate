import Reveal from "@/components/Reveal";
import TypeLabel from "@/components/TypeLabel";
import LogoMarquee from "@/components/LogoMarquee";
import PhotoCarousel from "@/components/PhotoCarousel";
import Counter from "@/components/Counter";
import { LOGO_COLORS } from "@/lib/logo-colors";
import { clientLogoRows, logoRowDuration } from "@/lib/logos";
import { LIFE_AT_DNA, LIFE_AT_DNA_FRAMING } from "@/lib/life-at-dna";
import type { HomeCopy } from "@/lib/home-copy";

/**
 * AS TRÊS SEÇÕES DA HOME QUE TAMBÉM VIVEM NA /about  -  01-10, a pedido: *"da
 * home pega as seções Trusted by leadership teams at, client impact e our
 * people e coloca pra pagina de about, depois da seção what we believe"*, nas
 * DUAS páginas. A marcação saiu de `app/page.tsx` sem mudar uma classe. O texto
 * vem da copy da HOME (`getHomeCopy`) nas duas páginas, então o que a cliente
 * editar em /edit-home vale para a /about também.
 *
 * ⚠️ `id` É PROP porque a /about já tem um `#people` dela (a faixa escura do
 * fim da página). A home passa os ids de sempre, que o menu usa.
 */

const [logoRow1, logoRow2] = clientLogoRows;

type Stat = { label: string; value: string };

export function HomeCredibility({ id = "credibility", copy, stats }: { id?: string; copy: HomeCopy; stats: Stat[] }) {
  return (
    <section id={id} className="bg-ink text-white">
      <div className="pb-[34px] pt-[70px]">
        <p className="mb-9 text-center text-[12px] font-semibold uppercase tracking-[2.5px] text-white/70">
          {copy.credibility.label}
        </p>
        <div className="flex flex-col gap-5">
          <LogoMarquee logos={logoRow1} duration={logoRowDuration(logoRow1)} />
          <LogoMarquee logos={logoRow2} duration={logoRowDuration(logoRow2)} reverse />
        </div>
      </div>
      {/* OS QUATRO NÚMEROS NUMA LINHA SÓ  -  21-09: *"Have 4 metrics displayed
          horizontally"* (anotação: *"the number should be horizontal in a
          line"*).

          ERAM 2x2 numa coluna de 760px centrada. O pedido é literal e a
          leitura dele também: quatro em fileira é a forma que deixa comparar
          os números de um olhar, em vez de ler dois e descer.

          A COLUNA DE 760px TINHA DE SAIR JUNTO. Quatro células nela dariam
          ~160px cada, e "Work sponsored by Chairman / CXO" em 16px não cabe
          nisso  -  o rótulo viraria cinco linhas embaixo de um número de 56px.
          Agora a fileira usa os 1440 da página, como as outras seções.

          `gap-x-10` e não os `gap-x-16` de antes: com quatro colunas em vez
          de duas são três vãos no lugar de um, e manter 64px em cada um
          comeria 192px de largura útil de rótulo.

          NO TELEFONE ELES EMPILHAM, e em 2x2 a partir de `sm`  -  não em
          fileira. Quatro números de 44px lado a lado numa tela de 375px dão
          ~80px por célula, que é menos que a largura de "10,000+". A fileira
          começa em `md`, que é onde ela cabe. */}
      <div className="mx-auto max-w-[1440px] px-10 pb-20 pt-5">
        <Reveal className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex items-start gap-5">
              <span className="mt-[38px] h-[3px] w-8 flex-none bg-brand md:mt-[50px]" />
              <div>
                <div className="text-[44px] md:text-[56px] font-bold leading-none tracking-[-1.5px] text-brand">
                  <Counter value={s.value} />
                </div>
                <div className="mt-2 text-[16px] font-medium leading-snug text-white/80">{s.label}</div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// O que NÃO é texto nos três cards de impacto: o logo e as cores, por posição.
// Trocar o cliente no editor não troca a arte  -  trocar arte é aqui.
const caseArt: { logo?: string; cardTint: string; metricColor: string }[] = [
  { logo: "heineken.png", cardTint: "#effaf4", metricColor: LOGO_COLORS.heineken },
  { logo: "frasers-property.png", cardTint: "#f7f5f2", metricColor: "#1f1c1d" },
  { logo: "shell.png", cardTint: "#fffbea", metricColor: "#f15d00" },
];

export function HomeImpact({
  id = "impact",
  copy,
  publishedCases,
}: {
  id?: string;
  copy: HomeCopy;
  publishedCases: { slug: string; client: string }[];
}) {
  const cases = copy.impact.cases.map((c, i) => ({ ...c, ...caseArt[i] }));
  return (
    <section id={id} className="bg-paper">
      <Reveal className="mx-auto max-w-[1440px] px-10 py-24">
        {/* Sobre fundo claro o rótulo usa o vermelho CHEIO da marca (#d84339).
            Era `brand-light` enquanto a faixa era escura, porque o cheio sobre
            `ink` mede 2,9:1 e reprovaria em 13px. Sobre `paper` a conta se
            inverte: o cheio passa e o claro é que reprovaria. Régua e texto
            trocam juntos  -  o `TypeLabel` já faz isso sozinho. */}
        <TypeLabel>{copy.impact.label}</TypeLabel>
        <h2 className="mb-[52px] max-w-[720px] text-[28px] sm:text-[34px] md:text-[40px] font-semibold leading-[1.1] tracking-[-0.5px] text-ink">
          {copy.impact.title}
        </h2>
        {/* `bg-white` nos cards continua sendo estrutural, não decoração: com
            a faixa em `paper`, é o preenchimento branco que os destaca do
            fundo. Guli: "os cards continuam com fundo branco." */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cases.map((c) => (
            <article
              key={c.client}
              className="flex flex-col overflow-hidden rounded-[22px] border border-[#e7e9e9] bg-white shadow-[0_14px_34px_rgba(30,38,45,0.08),0_2px_7px_rgba(30,38,45,0.04)]"
              style={{ backgroundImage: `linear-gradient(135deg, #fff 58%, ${c.cardTint} 100%)` }}
            >
              {/* O nome identifica o cliente; o logo à direita é decorativo
                  (`alt=""`) e fica numa placa branca para preservar as cores
                  originais dos arquivos. */}
              <div className="flex items-start gap-4 px-7 pb-5 pt-7 text-ink">
                <div className="min-w-0 flex-1">
                  <div className="text-[22px] font-bold leading-tight tracking-[-0.4px]">{c.client}</div>
                  <div className="mt-2 inline-block rounded-full bg-brand/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[1px] text-muted">{c.sector}</div>
                </div>
                {c.logo ? (
                  <span className="flex h-14 w-28 flex-none items-center justify-center rounded-full border border-line bg-white px-2 shadow-sm sm:w-32">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/logos/client-logos/${c.logo}`}
                      alt=""
                      loading="lazy"
                      className="max-h-10 w-auto max-w-full object-contain"
                    />
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col px-7 pb-7 pt-3">
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-brand">{copy.impact.challengeLabel}</p>
                <p className="mb-8 text-[15px] leading-[1.6] text-[#5c5f65]">{c.challenge}</p>
                <div className="mt-auto pt-5">
                  <span className="mb-5 block h-px w-full bg-[#e6e9e8]" />
                  <div className="text-[42px] font-bold leading-none tracking-[-1.5px] md:text-[52px]" style={{ color: c.metricColor }}>
                    <Counter value={c.metric} />
                  </div>
                  <div className="mt-2.5 text-[14.5px] font-medium leading-snug text-muted">{c.metricLabel}</div>
                  <a
                    href={caseHref(c.client, publishedCases)}
                    className="mt-7 block text-right text-[14px] font-semibold text-brand transition-colors hover:text-brand-dark"
                  >
                    {copy.impact.readMore}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function HomePeople({ id = "people", copy }: { id?: string; copy: HomeCopy }) {
  return (
    <section id={id} className="bg-white">
      <Reveal className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
        <TypeLabel>{copy.people.label}</TypeLabel>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,640px)] lg:gap-16">
          <div className="w-full max-w-[40rem]">
            <h2 className="mb-6 whitespace-pre-line font-serif text-[28px] font-semibold leading-[1.15] tracking-[-0.4px] text-ink sm:text-[34px] md:text-[40px]">
              {copy.people.title}
            </h2>
            <p className="whitespace-pre-line text-[18px] font-medium leading-[1.55] text-ink md:text-[20px]">
              {copy.people.subtitle}
            </p>
            <p className="mt-8 whitespace-pre-line text-[16px] font-normal leading-[1.7] text-muted md:text-[17px]">
              {copy.people.intro}
            </p>
          </div>
          <div className="mx-auto w-full lg:mx-0 lg:justify-self-end">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[1.6px] text-muted">
              Our team in action
            </p>
            <PhotoCarousel
              images={LIFE_AT_DNA}
              positions={LIFE_AT_DNA_FRAMING}
            />
          </div>
        </div>
        {/* Different by design entra na mesma fileira dos três pilares.
            Título e corpo usam a mesma medida em todos, para nenhum bloco
            parecer um cabeçalho dos outros. 24px no título mantém o vermelho
            da marca dentro do contraste de texto grande. */}
        <div className="mt-16 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { title: copy.people.designTitle, body: copy.people.designBody },
            ...copy.people.pillars,
          ].map((block) => {
            const { subtitle, text } = leadSentence(block.body);
            return (
              <article key={block.title} className="flex h-full flex-col border border-line bg-paper p-6 md:p-8">
                <h3 className="whitespace-pre-line font-serif text-[20px] font-semibold leading-[1.2] text-brand sm:min-h-[48px] xl:min-h-[72px] 2xl:min-h-[48px]">
                  {block.title}
                </h3>
                {subtitle && (
                  <p className="mt-4 whitespace-pre-line text-[16px] font-medium leading-[1.5] text-ink">
                    {subtitle}
                  </p>
                )}
                {text && (
                  <p className="mt-3 whitespace-pre-line text-[16px] font-normal leading-[1.65] text-muted">
                    {text}
                  </p>
                )}
              </article>
            );
          })}
        </div>
        {/* A faixa "In partnership with" saiu daqui em 23-09 e virou a
            seção seguinte. Até então era o painel escuro no pé deste bloco. */}
      </Reveal>
    </section>
  );
}

function caseHref(client: string, published: { slug: string; client: string }[]) {
  const key = client.toLowerCase().replace(/[^a-z0-9]/g, "");
  const hit = published.find((entry) => {
    const name = entry.client.toLowerCase().replace(/[^a-z0-9]/g, "");
    const slug = entry.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    return name.includes(key) || slug.includes(key);
  });
  return hit ? `/cases/${hit.slug}` : "/our-clients";
}

function leadSentence(body: string) {
  const trimmed = body.trim();
  if (trimmed.includes("\n")) {
    const [subtitle, ...rest] = trimmed.split("\n");
    return { subtitle: subtitle.trim(), text: rest.join("\n").trim() };
  }
  const match = trimmed.match(/^([\s\S]*?[.!?])(?:\s+|$)([\s\S]*)$/);
  if (!match) return { subtitle: trimmed, text: "" };
  return { subtitle: match[1].trim(), text: match[2].trim() };
}
