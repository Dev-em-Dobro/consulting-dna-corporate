# Correções da reunião 24-07 — status (para continuar)

**Branch:** `feat/correcoes-reuniao-24-07` (a partir de `main`) — já **mergeada em `main`** (merge `aa857f0`).
**Estado do git:** trabalho integrado na `main`; nada pendente de push desta branch.
**Specs:** decisões da reunião estão em `specs/004`…`specs/010` (+ `specs/cms-tarefas.md`).
Notas cruas da reunião: `fixes-reuniao-24-07`.

> ### ⚠️ Atualização 2026-07-28 — i18n revertida (refactor single-locale)
> A i18n com prefixo (`/pt /es` via next-intl **com** routing + `middleware.ts`) descrita
> abaixo como "feito" foi **revertida**. Na branch `refactor/single-locale-no-middleware`
> (commit `052ddb4`) o site voltou a ser **single-locale (inglês) sem middleware**:
> - `app/[locale]/*` achatado para `app/*`; `lang="en"` fixo; locale fixado em `lib/i18n/request.ts`.
> - **`middleware.ts` removido** — os redirects (retired-locale `/pt`,`/es` + legados 308)
>   migraram para o **`next.config.mjs`** (nativo no edge, sem middleware).
> - next-intl passou a rodar no modo **"without i18n routing"** (só mensagens, sem rotas).
> - `<Link>` locale-aware do next-intl → `next/link` (8 arquivos); SEO simplificado
>   (alternates só canonical, sitemap/revalidate single-locale).
> - **Motivo:** no Next.js 16 + Vercel o middleware do `[locale]` não fazia deploy/run
>   (Edge "unsupported modules", crash ESM/CJS, proxy 404). URLs públicas não mudaram (SEO-safe).
>
> Os itens marcados ✅ referentes a i18n abaixo valem como **histórico**; o estado atual
> do site é single-locale. Essa branch está 6 commits à frente da `main`, aguardando merge.

---

## ✅ Feito (nesta branch)

| Área | O que | Commit |
|------|-------|--------|
| 006 | Vídeo de depoimentos ("metralhadora") antes do `#impact` — autoplay mudado+loop+reduced-motion, **placeholder** até o vídeo chegar | `f5caf3d` |
| 006 | Rodapé lendo do `siteNav` (fonte única) | `d576c38` |
| 006 | Cards de liderança: altura fixa (fim da "escadinha") + ícone do LinkedIn maior | `3df6197` |
| 007 | Insights: lista mais leve (capa, data, **tempo de leitura calculado**) + detalhe no layout Solutions com degradê na capa | `02f7daa` |
| 005 | **SEO base**: metadataBase, OG/Twitter, robots.txt, sitemap.xml (rotas + CMS), llms.txt, JSON-LD Organization | `62e17bd` |
| 005 | **Canonicals por página** em todas as rotas públicas | `4c5e1d7` |
| 005 | ~~**i18n (next-intl, `localePrefix: as-needed`)**: EN sem prefixo, PT/ES prefixados (`/pt /es`), seletor de idioma, `hreflang`+`x-default`~~ ⚠️ **REVERTIDO** em `052ddb4` (ver aviso no topo). O site é **single-locale EN sem middleware**. O mapa `pt`→`pt-BR` no CMS client se mantém p/ o futuro. | `71f9d02`…`9c5bb31`, revertido em `052ddb4` |
| 008 | Mapa de escritórios: **auto-rotate (~6s)** + wrap infinito + **altura fixa** do bloco de contato (fim do "dançando") | `259f3b3` |
| 008 | **Mapa-múndi de atuação**: **data-driven pelas regions do CMS** (nome→ISO3 via `countriesToIso3`), países multicolor + pins de cidade geocodificados; `COVERAGE_ISO3` só como *fallback* | `7997e06`, `4c514cd`, `38e8550`, `b5105c5`, `175281e` |
| 004 | Lead capture (server action) **roteado pelo CMS** + **botão flutuante de WhatsApp** (config-driven) | `4adf769`, `5089e55` |
| — | Handoff do CMS: `specs/cms-tarefas.md` | `5089e55` |

**Revertidos a pedido:** números de impacto voltaram à barra lateral original (`53d6a16`, `1121386`); Client-Impact da home voltou aos cards fixos (`4b051ca`).

---

## 🔜 Falta — organizado por bloqueio

### 🟢 Dá pra fazer no site (sem depender de ninguém)
- **Merge do refactor single-locale** — `refactor/single-locale-no-middleware` está
  6 commits à frente da `main`, aguardando PR/merge (i18n com prefixo foi revertida ali).

### 🟡 Destrava com input curto do cliente
- **Número real do WhatsApp** → trocar em `.env.local` / Vercel (`NEXT_PUBLIC_WHATSAPP_NUMBER`, hoje com nº de teste `5511999999999`).
- **Vídeo de depoimentos** (arquivo/URL) → trocar o placeholder no `TestimonialsVideo` (passar `src`).
- ~~**URLs do site antigo** → montar os **redirects 301** (005)~~ ✅ **Implementado** (308 permanentes). **Nota (2026-07-28):** com a remoção do middleware, **todos** os redirects agora vivem no **`next.config.mjs`** — tanto os paths `.html` quanto os retired-locale (`/pt`,`/es`) e legados sem extensão que antes passavam por `lib/redirects.ts`+`middleware.ts` (removidos). Mapa/inventário em `specs/redirects-inventory.md`; slugs confirmados no CMS; testado ao vivo. *Poda opcional depois com o Google Search Console do cliente.*
- ~~**Lista oficial de países** → atualizar `lib/coverage.ts`~~ ✅ **Concluído** — o mapa-múndi passou a pintar direto pelas **regions do CMS** (`countriesToIso3(regions.map(r => r.country))`, `WorldCoverageMap.tsx`). A fonte oficial agora é o CMS; `COVERAGE_ISO3` em `lib/coverage.ts` virou só *fallback* p/ quando o CMS não retorna regions. Nada a manter à mão no site.

### 🔴 Depende do CMS (repo `corporate-dna-cms`) — ✅ verificado no código (2026-07-27)
> Tudo entregue e commitado no CMS em `3be4a2b` *"site handoff — leads, tags, branding, youtube, i18n, image limits"*. Verificado item a item contra o read API / schemas.
- ~~**Endpoint `POST /api/leads`**~~ ✅ `app/api/leads/route.ts`: auth via `x-api-key` (cai no `READ_API_KEY` que o site já manda — sem env nova), rate-limit por IP, validação Zod, insert + webhook opcional. Site já posta via `app/actions/submit-lead.ts`.
- ~~**Cards de marca dos cases (007)**~~ ✅ `lib/content/types.ts` (FR-804/805/806): `brandColor` (hex validado) + `logoMediaId` (PNG transparente, resolvido p/ URL no serializer). Site já tinge as faixas dos cases (`5657478`).
- ~~**Tags reais**~~ ✅ `lib/content/published.ts` (FR-817): filtro `?tags=` via overlap JSONB.
- ~~**Embed YouTube**~~ ✅ `types.ts` (FR-801/802/803): campo `youtube`.
- ~~**read API EN/PT/ES (fallback EN)**~~ ✅ `published.ts` (FR-020/809/810): `getPublished` cai p/ EN e devolve flag `localeFallback`.
- ~~**Limites de imagem por campo**~~ ✅ `lib/media/policies.ts` (FR-807/808): políticas `logo` (PNG, ≤2MB, ≤1024px) e `banner` (16:9, ≤8MB).
- **Falta só (ops, não código):** *deployar o CMS* com esse código + *popular o conteúdo* (editores setarem brandColor/logo/tags/vídeo nas entradas).
- *Adiados:* geodata de regions no mapa, tipo Awards.

### ⚫ Depende de assets do Guilherme (009 — adiada por inteiro)
- Logo nova (light/dark), página **Our Identity + Awards** (logos + descrições + legado 2008/09), diagrama inner/outer redesenhado.
- **Faixa de awards na home (006)** espera a página de awards existir.

---

## ▶️ Como retomar amanhã

1. `git checkout refactor/single-locale-no-middleware` (branch atual; a de correções já está na `main`).
2. Dev server roda em **http://localhost:3006** (`npm run dev`). Reiniciar depois de mexer em `.env.local` (vars `NEXT_PUBLIC_` só carregam na inicialização).
3. Próxima tarefa sugerida: **abrir PR/merge do refactor single-locale** na `main`; depois fechar os itens 🟡 assim que os inputs chegarem — trocar nº do WhatsApp / vídeo de depoimentos. (Redirects 301 já implementados, agora no `next.config.mjs`.)

### Env vars pendentes (produção / `.env.local`)
```
NEXT_PUBLIC_WHATSAPP_NUMBER   # número real (hoje é teste)
NEXT_PUBLIC_WHATSAPP_MESSAGE  # opcional
# Lead capture vai pelo CMS: reusa CMS_URL + CMS_READ_API_KEY (já existem).
```

### Deploy (lembrete)
Deploy da Impulse é **manual via CLI** (`vercel --prod --scope impulse66 --yes`); **não** há auto-deploy no push. Autor do commit HEAD tem que ser `impulseaisolutions@gmail.com`.
