# Correções da reunião 24-07 — status (para continuar)

**Branch:** `feat/correcoes-reuniao-24-07` (a partir de `main`).
**Estado do git:** tudo commitado **localmente**; **falta `git push`** da branch.
**Specs:** decisões da reunião estão em `specs/004`…`specs/010` (+ `specs/cms-tarefas.md`).
Notas cruas da reunião: `fixes-reuniao-24-07`.

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
| 005 | **i18n com prefixo `/en /pt /es`** (next-intl): rotas por locale, middleware (`/`→`/en`, sem geolocalização), **seletor de bandeiras** no header, `hreflang`+`x-default` por página e no sitemap, locale nos fetchers de detalhe do CMS. *Chrome fica em EN; tradução de conteúdo depende do CMS.* | `71f9d02`…`4a48b18` |
| 008 | Mapa de escritórios: **auto-rotate (~6s)** + wrap infinito + **altura fixa** do bloco de contato (fim do "dançando") | `259f3b3` |
| 008 | **Mapa-múndi de atuação**: SVG estático, data-driven, EUA/Canadá inteiros; lista em `lib/coverage.ts` | `7997e06` |
| 004 | Lead capture (server action) **roteado pelo CMS** + **botão flutuante de WhatsApp** (config-driven) | `4adf769`, `5089e55` |
| — | Handoff do CMS: `specs/cms-tarefas.md` | `5089e55` |

**Revertidos a pedido:** números de impacto voltaram à barra lateral original (`53d6a16`, `1121386`); Client-Impact da home voltou aos cards fixos (`4b051ca`).

---

## 🔜 Falta — organizado por bloqueio

### 🟢 Dá pra fazer no site (sem depender de ninguém)
- *(nada pendente aqui no momento — a i18n com prefixo foi concluída, ver ✅ acima)*

### 🟡 Destrava com input curto do cliente
- **Número real do WhatsApp** → trocar em `.env.local` / Vercel (`NEXT_PUBLIC_WHATSAPP_NUMBER`, hoje com nº de teste `5511999999999`).
- **Vídeo de depoimentos** (arquivo/URL) → trocar o placeholder no `TestimonialsVideo` (passar `src`).
- **URLs do site antigo** → montar os **redirects 301** (005). Ainda não feito.
- **Lista oficial de países** → atualizar `lib/coverage.ts` (ISO3, uma linha por país).

### 🔴 Depende do CMS (repo `corporate-dna-cms`) — ver `specs/cms-tarefas.md`
- **Endpoint `POST /api/leads`** — o formulário fica **pendente** até isso (hoje retorna erro recuperável, não mostra "obrigado" falso). Tabela `leads` já criada no Postgres do CMS.
- **Cards de marca dos cases (007)** — precisa de `brandColor` + logo PNG no read API.
- **Tags reais**, **embed de vídeo YouTube**, **read API EN/PT/ES (fallback EN)**, **limites de imagem por campo**.
- *Adiados:* geodata de regions no mapa, tipo Awards.

### ⚫ Depende de assets do Guilherme (009 — adiada por inteiro)
- Logo nova (light/dark), página **Our Identity + Awards** (logos + descrições + legado 2008/09), diagrama inner/outer redesenhado.
- **Faixa de awards na home (006)** espera a página de awards existir.

---

## ▶️ Como retomar amanhã

1. `git checkout feat/correcoes-reuniao-24-07`
2. (opcional) `git push -u origin feat/correcoes-reuniao-24-07` se ainda não subiu.
3. Dev server roda em **http://localhost:3006** (`npm run dev`). Reiniciar depois de mexer em `.env.local` (vars `NEXT_PUBLIC_` só carregam na inicialização).
4. Próxima tarefa sugerida: **i18n com prefixo** (item 🟢), ou fechar os itens 🟡 assim que os inputs chegarem.

### Env vars pendentes (produção / `.env.local`)
```
NEXT_PUBLIC_WHATSAPP_NUMBER   # número real (hoje é teste)
NEXT_PUBLIC_WHATSAPP_MESSAGE  # opcional
# Lead capture vai pelo CMS: reusa CMS_URL + CMS_READ_API_KEY (já existem).
```

### Deploy (lembrete)
Deploy da Impulse é **manual via CLI** (`vercel --prod --scope impulse66 --yes`); **não** há auto-deploy no push. Autor do commit HEAD tem que ser `impulseaisolutions@gmail.com`.
