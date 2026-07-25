# Tarefas para o repo do CMS (`corporate-dna-cms`)

Handoff do site (`consulting-dna-corporate`) para o CMS. Cada tarefa diz **o que
fazer**, o **contrato** (campos/payload), a **validação** e **como expor no read
API** — com referência aos arquivos do próprio CMS para seguir o padrão.

**Contexto**
- O CMS é um projeto separado (Next.js 16 + Drizzle + Neon/Supabase Postgres + Zod).
- O site consome o CMS **só por HTTP** (read-only): `client → Zod → view model`.
- Mudanças de schema saem como **migração drizzle-kit** + validação **Zod** no boundary.
- Não vazar draft no read API; MFA/RBAC/audit seguem valendo nas telas de autor.

Arquivos-chave do CMS citados abaixo:
- `lib/http.ts` — `jsonOk`, `jsonError`, `jsonValidationError`, `readKeyValid`, `checkRateLimit`, `clientMeta`
- `lib/content/types.ts` — `REGISTRY`, schemas Zod por tipo, `SINGLETON_PAGES`
- `lib/content/published.ts` — `getPublished`, `serializeEntry`, `listPublished`
- `db/schema.ts` + migrações drizzle-kit
- Rotas: `app/api/content/[type]/route.ts`, `app/api/content/pages/[key]/route.ts`

---

## TAREFA 1 — Endpoint de captura de leads (PRIORITÁRIO · novo)

O formulário de contato do site precisa gravar leads. Em vez de o site acessar o
Supabase direto (service-role key no site), o **site manda o lead pro CMS** e o
CMS grava. Assim o site reusa só o `CMS_URL` + a chave que já tem.

**A tabela já existe** (criada no mesmo Postgres do CMS):

```sql
create table public.leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  email        text not null,
  organisation text,
  message      text not null,
  source       text,
  referer      text,
  user_agent   text
);
alter table public.leads enable row level security;
```

**O que fazer no CMS:**
1. Mapear a tabela `leads` no Drizzle (`db/schema.ts`) — ou usar insert cru.
2. Criar a rota **`POST /api/leads`** (`app/api/leads/route.ts`).
3. Autenticar com `readKeyValid(req)` (a mesma `x-api-key` que o site já usa) —
   ou uma env dedicada `LEAD_INGEST_KEY` se preferir separar do read key.
4. **Rate-limit** por IP com `checkRateLimit` (ex.: 5 req / 60s por IP) usando `clientMeta(req)`.
5. Validar o body com Zod e inserir; responder `{ ok: true, id }`.

**Contrato — o site envia:**

```http
POST /api/leads
x-api-key: <READ_API_KEY>
Content-Type: application/json

{
  "name": "string (1..200)",
  "email": "string email (<=320)",
  "organisation": "string (<=200) | null",
  "message": "string (1..5000)",
  "source": "string (<=500) | null",   // path+query da página (pode ter UTM)
  "referer": "string | null",
  "user_agent": "string | null"
}
```

**Regras:**
- Re-validar TUDO no servidor (não confiar no client). Rejeitar inválido com `422` (`jsonValidationError`).
- Normalizar: `email` → trim + lowercase; strings → trim; vazio → `null` onde couber.
- Nunca refletir HTML de volta (armazenar como texto).
- Resposta de sucesso: `200 { "ok": true, "id": "<uuid>" }`. Erro: `4xx/5xx { "error": "..." }`.

**Opcional (nice-to-have):** após inserir, repassar o lead para um webhook
(`LEAD_WEBHOOK_URL`) via POST — desacoplado (falha do webhook não perde o lead).
Se preferir, o site pode continuar dono do webhook; alinhar quem dispara.

> Quando esse endpoint existir, o site troca a server action (`app/actions/submit-lead.ts`)
> de "Supabase REST direto" para "POST no `${CMS_URL}/api/leads`" — aí a
> `SUPABASE_SERVICE_ROLE_KEY` deixa de ser necessária no site.

---

## TAREFA 2 — Campo de TAG real (cases + insights) · 010 FR-817

Hoje as tags saem de facets/free-text. O site precisa de um **campo de tag
estruturado** para a busca/filtro por tag funcionar de verdade.

- Adicionar `tags: string[]` (array) validado nos schemas de **case** e **insight** (`lib/content/types.ts`).
- Expor `tags` no read API (lista e detalhe).
- Migração drizzle-kit se virar coluna própria (ou dentro do `data` JSON, desde que indexável para filtro).
- O site já consome tags; só precisa que venham consistentes e filtráveis.

---

## TAREFA 3 — Branding de case: cor da marca + logo PNG · 010 FR-804/805/806

No tipo **case** (`caseSchema` em `lib/content/types.ts`):
- `brandColor`: hex validado (ex.: `^#[0-9a-fA-F]{6}$`). Expor como `brandColor` no read API.
- `logo` (PNG transparente): upload via Bunny (pipeline atual), validado como **PNG com canal alpha**
  e dentro de limites de tamanho/proporção. Expor a **URL de entrega** no read API (ex.: `logoUrl`).
- Ambos **opcionais** (o site tem fallback). Quando presentes, o site gera o card
  de case com o logo em perspectiva sobre um degradê na cor da marca.

---

## TAREFA 4 — Embed de vídeo YouTube · 010 FR-801/802/803

- Nos tipos **case**, **insight** e **páginas singleton com vídeo**: campo de link do YouTube.
- Validar/normalizar (`watch`, `youtu.be`, `embed`) → referência canônica `{ provider: "youtube", videoId, url }`.
- Armazenar como **referência externa** (nunca upload). Expor no read API para o site renderizar o embed.
- Rejeitar URL malformada/não-YouTube com mensagem específica.

---

## TAREFA 5 — Read API multi-idioma EN/PT/ES · 010 FR-809/810

- Locales já registrados: **EN, PT, ES**.
- O read API deve aceitar `?locale=` e retornar o conteúdo daquele idioma quando existir.
- **Fallback = EN** (locale padrão), marcado como fallback quando a tradução não existir.
- Nunca vazar draft; o published-only continua valendo (`getPublished` em `published.ts`).
- (O site vai consumir isso ao ligar o i18n com prefixo `/en /pt /es`.)

---

## TAREFA 6 — Limites de imagem por campo · 010 FR-807/808

- Estender a validação de upload (`001` FR-013) com **dimensão máx., tamanho máx. e proporção
  obrigatória** por campo, configurável (ex.: PNG transparente p/ logo; 16:9 quando aplicável).
- Rejeitar upload fora da regra com o motivo específico.

---

## DEPOIS (adiado — não fazer agora)

Decisões da revisão 24-07 deixaram estes para depois:

- **Regions ↔ geodata do mapa** (010 FR-811/812/813): `city`, `country`, `lat`, `lng`,
  `zoom`, `addressLines`, `tel`, `email`, flag `locationType` (`office` | `coverage`).
  O site mantém as regions fixas em código por ora — retomar quando for ligar o mapa ao CMS.
- **Awards** (010 FR-816 / 009): tipo de conteúdo (ou singleton list) com logo + descrição +
  legado 2008/09. Espera a definição da página "Our Identity".

---

## Referência cruzada
- Especificação completa de cada item da 010: `specs/010-cms-enhancements/spec.md`.
- Consumo no site: `specs/007-content-libraries/spec.md` (cases/insights),
  `specs/005-i18n-seo-redirects/spec.md` (locale), `specs/004-lead-capture-contact/spec.md` (leads).
