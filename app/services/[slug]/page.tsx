import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionView from "@/components/views/SolutionView";
import { localeAlternates } from "@/lib/seo/alternates";
import { serviceLd, breadcrumbLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/JsonLd";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { services } from "@/lib/services";
import { getServicesWithCopy } from "@/lib/service-pages-copy-server";

/**
 * Página de serviço — "one template, ten instances" (outline de 09-09, §3.2).
 *
 * DEIXOU DE LER O CMS em 11-09. O conteúdo agora é `lib/services.ts`, e o porquê
 * está na caixa de abertura daquele arquivo: os dez serviços do outline não
 * existem no CMS (dois são novos, três mudaram de nome, dois saíram) e os campos
 * do bloco 6 também não. Consequência prática aqui: a rota virou estática de
 * verdade — sem `revalidate`, sem fetch, e `generateStaticParams` devolve os dez
 * na hora do build em vez de perguntar ao CMS.
 */
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

/** Toda rota que não está nos dez é 404 — os slugs velhos têm 301 no next.config. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  /* ⚠️ A METADATA TAMBÉM LÊ A COPY EDITADA. Sem isto, a cliente trocaria o nome
     do serviço na página e a aba do navegador, o `og:title` e o snippet do
     Google continuariam com o nome velho. */
  const service = (await getServicesWithCopy()).find((x) => x.slug === slug);
  const title = service ? `${service.title} | CorporateDNA` : "Solution | CorporateDNA";
  return {
    title,
    description: service?.banner,
    alternates: localeAlternates(`/services/${slug}`),
    openGraph: { title, description: service?.banner },
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  /* A LISTA INTEIRA, e não só este serviço: o rodapé "Related services" desenha
     o card de quatro dos outros nove, e eles também leem a copy editada. Uma
     leitura só do Blob serve os dois. */
  const all = await getServicesWithCopy();
  const service = all.find((x) => x.slug === slug);
  if (!service) notFound();

  const jsonLd = [
    breadcrumbLd([
      { name: "Services", path: "/services" },
      { name: service.title, path: `/services/${slug}` },
    ]),
    serviceLd({
      name: service.title,
      path: `/services/${slug}`,
      description: service.banner,
    }),
  ];

  return (
    /* A TIPOGRAFIA EDITORIAL ENTRA AQUI, e não no `layout.tsx`: as páginas que
       continuam em Poppins não devem baixar fonte que não usam. Ver a caixa de
       comentário em `lib/fonts.ts`.

       Vale para a árvore inteira, incluindo a NavV2 e o SiteFooter, que
       continuam sem saber que existe fonte nova — é a variável que faz o
       trabalho, não uma classe em cada elemento. */
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell footerTopBorder floatingNav>
        <JsonLd data={jsonLd} />
        {/* ⛔ O DESVIO POR SLUG SAIU EM 24-09, e com ele a última exceção: as DEZ
            páginas são o mesmo template de novo, que é o que o título desta
            caixa sempre prometeu.

            A branch `feature/paginas-servicos-menu-herois` trouxe três páginas
            escritas à mão — HRLT, Manager Development e Culture Transformation —
            e um ternário aqui mandava cada slug para a sua. Culture e Manager
            saíram no merge do mesmo dia, porque as duas já tinham sido refeitas
            pelos layouts de 24-09 dentro do template; a HRLT saiu logo depois, a
            pedido: *"faz ela seguir o mesmo layout das outras paginas de
            serviços"*. A copy dela virou dado em `lib/services.ts` — ver a caixa
            na entrada `hrlt-effectiveness`, que lista o que a implementação
            própria media de diferente.

            ⛔ A PASTA `components/solutions/layouts/` DEIXOU DE EXISTIR: as três
            páginas e o `ServiceClose` que duas delas usavam foram apagados, a
            pedido (*"pode usar as minhas paginas"*). Estão no git, no commit
            `0ca1e73` e na branch `feature/paginas-servicos-menu-herois`.

            ⏳ O QUE SE PERDEU DE CONTEÚDO, para quem precisar recuperar: a
            Culture dele fechava com uma frase que a nossa não tem — *"Culture
            isn't what is written on the wall. / It's what happens when the real
            work begins."* Ela não está no layout arquivado em `docs/meetings/`,
            que vem cortado na fileira "Our measurement journey"; ele devia ter
            uma versão mais alta do arquivo. Se um dia ela for pedida, o campo
            que a desenha já existe (`closing`, como no Senior Leadership
            Development) e não precisa de componente novo.

            ⚠️ SE UMA PÁGINA PRECISAR DE UM BLOCO QUE O TEMPLATE NÃO TEM, o
            caminho é o que Culture e Manager usaram em 24-09 — um componente em
            `components/solutions/` com o seu campo em `lib/services.ts`, que
            NÃO renderiza para quem não tem o campo —, e não um ramo aqui. A
            diferença não é de estilo: um bloco novo fica disponível para os
            outros nove no dia em que a cliente pedir o mesmo; uma página à parte
            começa a divergir em largura, ícone e espaçamento no primeiro ajuste
            que alguém fizer só de um lado. Foi exatamente o que aconteceu. */}
        <SolutionView service={service} all={all} />
      </SiteShell>
    </div>
  );
}
