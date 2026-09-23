# Editor de textos das páginas — estado e próximo passo (23-09-2026)

Retomada de contexto. A parte da HOME está pronta, commitada e no ar em
staging. A parte da ABOUT foi só **levantada**, não há uma linha de código
escrita para ela.

---

## 1. O que já está pronto (home) — NÃO refazer

Commit `3f980db`, branch `feature/ajustes-home-about-team`, publicado em
`https://consulting-dna-corporate-preview.vercel.app/edit-home`.

Como funciona, peça a peça: **`docs/edit-home.md`**. Leia esse arquivo antes de
mexer. Resumo de uma linha: a copy da home saiu do JSX para `lib/home-copy.ts`
(o PADRÃO), o que a cliente salva vai para o Vercel Blob (loja `cdna-home-copy`,
um arquivo novo por versão) e é mesclado por cima do padrão a cada render.

Verificado em staging: salvar reflete na home em ~1,4 s; restaurar funciona;
JSON inválido devolve 422 e a home cai no padrão; `/edit-home` está `noindex`,
fora do sitemap e bloqueada no robots.

⚠️ **Produção ainda não tem `BLOB_READ_WRITE_TOKEN`.** Sem ele, o salvar em
produção cai num arquivo local que a Vercel descarta. Comando em
`docs/edit-home.md`.

⚠️ **Sem autenticação**, por pedido. Quem tem a URL edita.

---

## 2. O pedido em aberto

> "pode fazer a mesma coisa na página de about, quero editar os textos nela tbm"

---

## 3. Arquitetura proposta para a About (generalizar, não duplicar)

Hoje tudo é `*-home-*`. O caminho é extrair o que é genérico e deixar por
página só o que é conteúdo:

| Genérico (novo) | O que vai dentro |
| --- | --- |
| `lib/page-copy/store.ts` | leitura/gravação no Blob por chave de página (`home`, `about`). É o corpo atual de `lib/home-copy-server.ts`, com o prefixo parametrizado. |
| `lib/page-copy/merge.ts` | `deepMerge` + `mergeCopy(defaults, saved, schema)`. Hoje está em `lib/home-copy-schema.ts`, idêntico para as duas. |
| `lib/page-copy/route.ts` | fábrica do handler GET/POST, com `revalidatePath` do caminho da página. |
| `components/copy-editor/CopyEditor.tsx` | o `HomeEditor` atual, recebendo `sections`, `defaults`, `apiPath`, `siteHref`, `guideDir` por prop. Ele já é dirigido por dados. |

Por página fica: `lib/<pagina>-copy.ts` (padrões + `EDITOR_SECTIONS`) e
`lib/<pagina>-copy-schema.ts` (zod).

Rotas: manter `/api/home-copy` e criar `/api/about-copy`, as duas finas por
cima da fábrica. Telas: `/edit-home`, `/edit-about` e um índice `/edit` com as
duas, para a cliente ter uma URL só.

**Cuidado de regressão:** os 17 testes de `tests/home-copy.test.ts` têm de
continuar passando; eles importam de `lib/home-copy.ts` e
`lib/home-copy-schema.ts` com extensão `.ts` explícita (exigência do runner do
Node — ver a nota no `tsconfig.json`).

---

## 4. Inventário da copy da About (`app/about/page.tsx`, 2540 linhas)

Seções e campos, na ordem da página:

1. **Hero** (primeira `<section>`, sem `id` — precisa ganhar um para o print)
   rótulo "About"; título "Keeping Leadership Real."; subtítulo em DUAS linhas
   controladas por `<span className="md:block">` (tratar como lista de linhas).
2. **Os quatro números do herói** — ver o item 5 abaixo, tem armadilha.
3. **Purpose** (`#purpose`) — rótulo "Why Corporate DNA exists."; título "Our
   purpose is to keep leadership real." (com `whitespace-nowrap` em "leadership
   real."); a citação longa da fundadora, que abre com **negrito** em "With
   roots in Big 4 Consulting"; a assinatura "Rhea Leckie, Founder & CEO"; dois
   parágrafos de fecho.
4. **Promise** (`#promise`) — rótulo "What we promise."; frase-guia "To keep our
   craft real…"; linha vermelha "We invite you to experience the DNA
   Partnership."; dois parágrafos.
5. **Identity** (`#identity`) — rótulo "Keeping Leadership Real"; QUATRO
   parágrafos de citação (aspas decorativas no primeiro e no fim do último, com
   a de fechamento grudada em "life." por um `nowrap` — o render tem de
   recompor isso); os QUATRO pilares (`PILLARS`: heading + body).
6. **Values** (`#values`) — rótulo "What we believe, and how we work.";
   parágrafo de abertura com **negrito** em "Our values"; os CINCO valores
   (`VALUES`: name + body). Os ícones ficam no código, casados por chave.
7. **Regions** (`#regions`) — rótulo "Where we work."; parágrafo "With
   headquarters in London, Singapore…"; as QUATRO regiões (`REGIONS`: name +
   offices + descriptor).
8. **Offices** (`LocationsBlock`) — os CINCO escritórios (`OFFICES`: city,
   linhas de endereço, telefone, e-mail). Telefone é `null` em Riyadh e Miami.
   ⚠️ O nome da cidade casa com `lib/offices.ts` para pegar coordenadas; na
   About o mapa está desligado (`showMap={false}`), então renomear não quebra
   nada AQUI, mas vale a nota.
9. **People** (`#people`) — rótulo "The people behind it"; título "Identity is
   what the team does under pressure."; parágrafo; rótulo do botão "Meet the
   team" (o destino `/team` fica no código).

Fora, de propósito: metadata de SEO, ícones, fotos, `WorldCoverageMap`,
`SiteFooter`, `NavV2` — mesma regra da home.

### Negrito dentro de parágrafo

Reaproveitar `paragraphs()` de `lib/services.ts`: escapa o HTML e só então
converte `**…**` em `<strong>`. Já testado no repo. Não aninha (`**a **b** c**`
corrompe em silêncio) — está documentado lá.

---

## 5. ⚠️ A armadilha dos quatro números da About

Eles vêm de `FIRM_STATS`, em `lib/stats.ts`. **Não são do CMS** (os do CMS são
os quatro da HOME, do singleton `page_home`). E `FIRM_STATS` é importado por
DUAS páginas: `app/about/page.tsx` e `app/our-clients/page.tsx` (faixa "By the
numbers", desde 18-09, a pedido da cliente, justamente para as duas não
divergirem).

Valores atuais: `19 years`, `5 regions`, `10,000+`, `5 of the top 10`.

Se a About passar a ler os números do editor e a Clients & Impact continuar
lendo `FIRM_STATS`, as duas divergem na primeira edição — que é exatamente o
defeito que o comentário de `lib/stats.ts` registra ter acontecido antes ("19
anos numa página e 18 na outra").

**Decisão tomada, a executar:** expor os quatro (valor + rótulo) numa seção
própria do editor da About, e fazer `app/our-clients/page.tsx` ler a MESMA
fonte, para continuarem casados. `/our-clients` já é `async`
(`ClientsAndImpactPage`), então basta um `await`. O `icon` continua no código,
casado por posição.

Alternativa, se o tempo apertar: deixar os quatro de fora do editor e avisar a
cliente do porquê.

---

## 6. Prints do guia visual

`scripts/edit-home-guide-shots.mjs` gera `public/edit-home-guide/*.jpg`, um por
seção, com o Chrome da máquina via `puppeteer-core`. Fecha o banner de cookies
e esconde o selo do Next e o botão do WhatsApp antes de fotografar.

Para a About: generalizar o script para receber a página e a lista de seções, e
gerar `public/edit-about-guide/*.jpg`. A About tem seções altas (a Identity tem
foto + citação + 4 cartões), então conferir se o print fica legível na coluna de
440px do editor; se não, cortar em duas.

---

## 7. Checklist da execução

1. Extrair `store`, `merge`, fábrica de rota e `CopyEditor` (home tem de
   continuar passando nos 17 testes).
2. `lib/about-copy.ts` + `lib/about-copy-schema.ts` com o inventário da seção 4.
3. Trocar o JSX da About para ler de `getAboutCopy()`.
4. Casar `/our-clients` com os quatro números (seção 5).
5. `/edit-about`, `/api/about-copy`, índice `/edit`.
6. Prints da About; `robots.ts` já bloqueia `/edit-home` — acrescentar
   `/edit-about` e `/edit`.
7. Testes para o merge da About, espelhando os da home.
8. `npm test` + `npx tsc --noEmit` + subir para staging
   (`npx vercel deploy --prod --scope dobro66`, com o link apontando para o
   projeto de preview).

---

## 8. Estado do repositório agora

Working tree limpo. Único commit novo: `3f980db`. Dois arquivos não
versionados, e assim devem ficar (material de cliente):
`docs/axon-thread-cutover-EXPORT-22-09-2026.txt` e
`docs/meetings/meeting-daily-maliha-23-09.txt`.

O servidor de desenvolvimento está no ar na porta 3006 e deve continuar.
