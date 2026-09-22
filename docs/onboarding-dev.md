# Onboarding do desenvolvedor — Corporate DNA

**Escrito em 22/09/2026.** Para quem vai pegar o projeto do zero, numa máquina nova, sem
nenhum acesso.

Leia na ordem. A parte 1 é o que **alguém precisa te conceder** (não dá para resolver
sozinho); a parte 2 é o que **você faz na sua máquina**. Nada aqui contém senha ou chave —
os segredos chegam pelos caminhos descritos em 1.6.

---

## 0. O que é o projeto, em dois parágrafos

São **dois repositórios separados**, e essa separação é exigência do cliente, não gosto
nosso:

| Repo | O que é | Porta local | Deploy |
| --- | --- | --- | --- |
| `consulting-dna-corporate` | O **site público** (marketing). Next.js 16 + React 19 + Tailwind 4. | **3006** | Vercel (2 projetos: prod e staging) |
| `corporate-dna-cms` | O **CMS headless** — painel de conteúdo, API de leitura, upload de mídia, usuários. | **3010** | Vercel (1 projeto) |

O site **nunca toca o banco do CMS**. Ele lê conteúdo publicado por HTTP
(`GET {CMS_URL}/api/content/...`, com header `x-api-key`) e recebe webhooks assinados em
`/api/revalidate` quando alguém publica algo. Se o CMS cair, o site **não quebra** — as
listas voltam vazias e os números caem num fallback no código.

> Antes de mexer em conteúdo, leia `docs/cms-o-que-vem-de-onde.md`. Ele responde a pergunta
> que mais aparece no dia a dia: *"isso a cliente muda no painel ou é código?"* — e a
> resposta não é óbvia, porque quase toda tela mistura as duas coisas.

---

## 1. Acessos — o que pedir, e para quê

Peça tudo de uma vez, com o seu e-mail de trabalho. Cada item abaixo tem o motivo, porque
acesso pedido sem motivo costuma voltar como "você precisa mesmo disso?".

### 1.1 GitHub — organização `Dev-em-Dobro`

Dois repositórios privados, ambos com permissão **Write**:

- `https://github.com/Dev-em-Dobro/consulting-dna-corporate`
- `https://github.com/Dev-em-Dobro/corporate-dna-cms`

Branch principal dos dois: `main`.

### 1.2 Vercel — scope `dobro66` (o time da Impulse)

Convite como **Member** no time. Esse time hospeda **três projetos**:

| Projeto na Vercel | Para que serve |
| --- | --- |
| `consulting-dna-corporate` | Site em **produção** (alias `consulting-dna-corporate-alpha.vercel.app`) |
| `consulting-dna-corporate-preview` | Site em **staging** — é para onde o link local aponta por padrão |
| `corporate-dna-cms` | O CMS (painel + API), em `corporate-dna-cms.vercel.app` |

⚠️ **Duas contas Vercel convivem aqui.** A do Impulse (scope `dobro66`) e a pessoal do dev
(`dev-em-dobros-projects`). Cada login enxerga só o próprio scope. Se `vercel projects ls`
não listar os projetos acima, você está logado na conta errada — `vercel logout` e entre de
novo com a conta do convite.

### 1.3 Supabase — projeto do CMS

O CMS roda **Supabase Postgres + Supabase Auth**. Peça convite na organização do projeto
(região `aws-0-us-east-1`). Você vai precisar do painel para:

- ver/rodar SQL e conferir dados;
- **Authentication → URL Configuration** (Site URL e Redirect URLs);
- **Authentication → Emails → SMTP** (integração com o Resend);
- convidar e destravar usuários do painel (MFA).

⚠️ **Não migre as chaves JWT para ES256-only.** Está documentado em
`corporate-dna-cms/docs/deploy-prod.md` §6: isso quebra a geração dos tokens de
convite/recovery/confirmação. A HS256 legacy tem que continuar como *Current key*.

### 1.4 Bunny.net — mídia

Todas as imagens do CMS vivem lá. Painel: **https://dash.bunny.net** (site do produto:
https://bunny.net). Peça acesso à conta com:

- a **Storage Zone** (`corporate-dna-media`) — a senha dela é a `BUNNY_STORAGE_KEY`;
- a **Pull Zone / CDN** que serve `https://corporate-dna.b-cdn.net`.

Só o **CMS** escreve no Bunny. O site apenas exibe as URLs — e o hostname permitido está
**fixo no código**, em `next.config.mjs:294`, não numa variável. Se um dia a zona mudar de
nome, esse arquivo muda junto.

### 1.5 Resend — e-mail transacional

Conta **da Impulse** (`impulseaisolutions@gmail.com`), não a da Dev em Dobro — é decisão de
projeto de 19/07/2026.

O Resend é o **SMTP do Supabase**: todo e-mail de autenticação do painel (convite de usuário,
recuperação de senha, confirmação) sai por ele, disparado pelo Supabase — não pelo nosso
código. A chave fica em **Authentication → Emails → SMTP**, no painel do Supabase.

⚠️ O remetente hoje é `onboarding@resend.dev`, que **só entrega para o dono da conta Resend**.
Enquanto um domínio não estiver verificado em https://resend.com/domains, convite para
usuário real falha (403 no Resend → 500 no Supabase). É o item 🔴 crítico do
`corporate-dna-cms/docs/deploy-prod.md`.

> Nota: existe um `lib/email/resend.ts` no CMS que **ninguém chama** — resíduo da stack de
> auth antiga (Auth.js), de quando os convites saíam pelo nosso código. Hoje a variável
> `RESEND_API_KEY` do `.env` não é lida em runtime; a chave que vale é a colada no Supabase.

### 1.6 Os segredos (`.env.local`) — como recebê-los

**Nós subimos os `.env` no Dobro Task Manager**, na tarefa do projeto. São dois arquivos, um
para cada repo — baixe e salve cada um como `.env.local` na raiz do repositório
correspondente. Não precisa pedir chave a ninguém por mensagem.

O que **não** vem nesses arquivos, porque só existe na sua máquina: `ADMIN_EMAIL` e
`ADMIN_PASSWORD` do `seed:admin` — você define os seus (ver 2.3).

Regras, e elas valem sempre:

- **Nunca** cole chave em chat, e-mail ou issue. Se precisar de uma fora do Task Manager,
  peça por um cofre com expiração (1Password, Bitwarden Send).
- **Nunca** commite o arquivo. O `.gitignore` já barra `.env*` e até `env.local` sem o ponto
  — não mexa nessas linhas (o porquê está na seção 4).
- Depois que o convite da Vercel for aceito, `vercel env pull .env.local` também funciona e
  é a forma de **atualizar** o arquivo quando alguém mudar uma variável lá.

### 1.7 Login no painel do CMS

Além do acesso à infra, você precisa de um **usuário do painel**. Peça a um admin para
convidar seu e-mail em **Users & audit**. O convite chega por e-mail; no primeiro login você
cadastra sua própria senha e **obrigatoriamente um TOTP** (Google Authenticator, 1Password,
etc.). Ninguém — nem admin — consegue ver ou definir o TOTP de outra pessoa.

### 1.8 Checklist, para conferir numa tela só

- [ ] GitHub: consigo `git clone` dos dois repos
- [ ] Vercel: `vercel projects ls --scope dobro66` lista os três projetos
- [ ] Supabase: entro no projeto e vejo a tabela `profiles`
- [ ] Bunny: vejo a storage zone `corporate-dna-media`
- [ ] Resend: entro na conta e vejo o domínio verificado
- [ ] `.env.local` preenchido nos dois repos
- [ ] Login no painel do CMS funcionando, com TOTP cadastrado

---

## 2. Instalação na sua máquina

### 2.1 Pré-requisitos

| Ferramenta | Versão | Obrigatório? |
| --- | --- | --- |
| **Node.js** | 22.x LTS (a máquina de referência roda **22.13.1**) ou 24 LTS | Sim |
| **npm** | 11.x (vem com o Node) | Sim |
| **Git** | qualquer recente | Sim |
| **Vercel CLI** | `npm i -g vercel` | Sim (deploy e `env pull`) |
| **Docker** | qualquer recente | Só para os testes de integração do CMS |
| **Python 3** | 3.10+ | Só para `scripts/cases-xlsx-to-json.py` |

Node abaixo de 22 **não serve**: o `npm test` do site usa
`node --experimental-strip-types`, que só existe a partir do 22.

### 2.2 O site (`consulting-dna-corporate`)

```bash
git clone https://github.com/Dev-em-Dobro/consulting-dna-corporate.git
cd consulting-dna-corporate
npm install

# baixe o .env do site no Dobro Task Manager e salve como .env.local aqui na raiz
# (traz CMS_URL, CMS_READ_API_KEY, etc. — ver 1.6)

vercel link                    # escolha consulting-dna-corporate-preview (staging)

npm run dev                    # http://localhost:3006
```

Variáveis do site:

| Variável | Para que serve | Sem ela, o que acontece |
| --- | --- | --- |
| `CMS_URL` | Base da API do CMS (`https://corporate-dna-cms.vercel.app`, ou `http://localhost:3010` se subir o CMS local) | O site loga `[cms] CMS_URL not set` e renderiza com fallbacks |
| `CMS_READ_API_KEY` | Vai no header `x-api-key` da API de leitura | O CMS recusa; conteúdo vem vazio |
| `CMS_WEBHOOK_SECRET` | Valida a assinatura HMAC dos webhooks em `/api/revalidate` | Revalidação automática não funciona (em dev, irrelevante) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número do botão flutuante | Botão sem destino |
| `NEXT_PUBLIC_WHATSAPP_MESSAGE` | Mensagem pré-preenchida | Mensagem vazia |
| `BUNNY_CDN_URL` | **Documental.** Nenhum código do site lê essa variável hoje | Nada |

Scripts:

```bash
npm run dev      # dev server na 3006
npm run build    # build de produção
npm start        # serve o build, também na 3006
npm run lint
npm test         # node:test em tests/*.test.ts
npx tsc --noEmit # checagem de tipos
```

### 2.3 O CMS (`corporate-dna-cms`)

```bash
git clone https://github.com/Dev-em-Dobro/corporate-dna-cms.git
cd corporate-dna-cms
npm install

# baixe o .env do CMS no Dobro Task Manager e salve como .env.local aqui na raiz
# e acrescente à mão, só para dev:
#   ADMIN_EMAIL=voce@exemplo.com
#   ADMIN_PASSWORD=SenhaForte!
#   SITE_URL=http://localhost:3006

vercel link                    # projeto corporate-dna-cms

npm run db:migrate                                    # aplica db/migrations via DIRECT_URL
npm run seed:admin -- voce@exemplo.com 'SenhaForte!'  # só num banco descartável
npm run dev                                           # http://localhost:3010
```

⚠️ **`db:migrate` e `seed:admin` escrevem no banco apontado pelo seu `.env.local`** — e o
`.env` que você baixou do Task Manager aponta para o banco **de produção**. Rode esses dois
comandos só contra um banco descartável (Supabase local, ver 2.5) ou depois de confirmar com
o responsável.

Variáveis do CMS:

| Variável | Para que serve |
| --- | --- |
| `DATABASE_URL` | Postgres em **transaction mode** (Supavisor, porta **6543**) — o que a app usa em runtime; `prepare: false` é obrigatório |
| `DIRECT_URL` | Conexão direta (porta **5432**) — migrations e `pg_dump` |
| `NEXT_PUBLIC_SUPABASE_URL` | Projeto Supabase (auth no browser) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave pública do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only. Nunca prefixar com `NEXT_PUBLIC_`.** Convites e operações administrativas |
| `PREVIEW_TOKEN_SECRET` | Assina os links de preview de rascunho |
| `READ_API_KEY` | O par do `CMS_READ_API_KEY` do site |
| `WEBHOOK_SIGNING_KEY` | O par do `CMS_WEBHOOK_SECRET` do site |
| `SITE_URL` | Base do site público, usada no botão "Preview". Em dev: `http://localhost:3006` |
| `BUNNY_STORAGE_KEY` / `BUNNY_STORAGE_ZONE` / `BUNNY_CDN_URL` / `BUNNY_STORAGE_HOST` | Upload e entrega de mídia |
| `RESEND_API_KEY` | Herdada da stack de auth antiga; hoje nenhum código a lê (ver 1.5) |
| `AUTH_SECRET` | **Aposentado no código, mas tem que continuar no ambiente deployado** enquanto a janela de rollback da migração de auth estiver aberta |

Scripts:

```bash
npm run dev          # 3010
npm run build
npm run typecheck
npm run lint
npm test             # vitest (unit; integração só com .env.test.local — ver 2.5)
npm run test:e2e     # playwright
npm run db:generate  # gera migration a partir do schema
npm run db:migrate
```

### 2.4 Rodando os dois juntos (o setup normal de trabalho)

1. Suba o CMS: `npm run dev` em `corporate-dna-cms` → `:3010`
2. No `.env.local` do site, aponte `CMS_URL=http://localhost:3010`
3. Suba o site: `npm run dev` → `:3006`
4. No CMS, `SITE_URL=http://localhost:3006` faz o botão "Preview" abrir o rascunho no site real

### 2.5 Testes de integração do CMS — leia antes de rodar

**Nunca rode a suíte de integração contra o projeto compartilhado/produção.** Ela cria
usuários, dispara e-mails reais (limite de 2/hora no projeto inteiro) e consome verificações
de MFA (15/hora por IP, compartilhado com o escritório inteiro) — uma rodada pode **trancar
editores de verdade para fora do painel**.

A proteção já está no código: as suítes só rodam se existir um `.env.test.local` (copie de
`.env.test.example`) apontando para um alvo descartável e declarando
`SUPABASE_TEST_PROJECT="true"`. Sem isso, `npm test` roda só os testes unitários. O vitest lê
`.env.test*` e **nunca** o `.env.local`.

O alvo padrão é o **Supabase local** (precisa de Docker):

```bash
npx supabase start          # db/auth/api/mailpit; e-mails caem no Mailpit em :54324
npx supabase db reset       # limpa tudo
```

Aplicar o schema uma vez, no PowerShell:

```powershell
$env:DIRECT_URL='postgresql://postgres:postgres@127.0.0.1:54322/postgres'; npm run db:migrate
```

---

## 3. Deploy

### 3.1 As três regras que não se negociam

1. **Deploy é manual, pela CLI.** Não há deploy automático no push — um `git push` não sobe nada.
2. **Só quando pedirem.** Não suba nada por iniciativa própria.
3. **O autor do commit HEAD tem que ser `impulseaisolutions@gmail.com`** — se não for, o time
   da Impulse bloqueia o deploy.

### 3.2 Site — staging e produção

O link local (`.vercel/project.json`) aponta para o projeto **de staging**
(`consulting-dna-corporate-preview`). Então:

```bash
# staging (o padrão)
vercel --prod            # sobe no projeto preview

# produção: religue o link, suba, e devolva o link ao staging
vercel link              # escolher consulting-dna-corporate
vercel --prod
vercel link              # voltar para consulting-dna-corporate-preview
```

Confira sempre em qual projeto você está antes de rodar `--prod`. Há um backup do link de
produção em `.vercel.prod-backup/`.

### 3.3 CMS

O CMS tem um checklist próprio de produção, e a maioria dos passos é **no Supabase e no
Resend, não no código**: domínio verificado no Resend, Site URL, allowlist de Redirect URLs,
templates de e-mail, variáveis na Vercel. Está em `corporate-dna-cms/docs/deploy-prod.md` —
leia inteiro antes do primeiro deploy do CMS.

---

## 4. Armadilhas que já custaram tempo aqui

- **Segredo fora do git.** O `.gitignore` do site tem regras para `.env*`, `env*.local`,
  `env.example` — essa duplicação sem ponto existe porque um arquivo salvo como `env.local`
  (sem o ponto) já quase entrou num `git add .` levando a service role key junto. Não
  desative essas linhas.
- **Conteúdo do cliente não entra no repo.** `docs/Content.zip`, os downloads do Drive, os
  `.eml` de e-mail — tudo ignorado, e há comentários no `.gitignore` explicando cada caso.
  Uma das pastas tem espaço no fim do nome e quebra checkout no Windows.
- **Não derrube a porta 3006.** O gerente acompanha o site ali. Build de produção vai em
  outra porta.
- **CMS vs. código.** Texto das dez páginas de serviço, menu, cards da equipe e logos são
  **código** — a cliente não muda sozinha. Já gerou mal-entendido real. Tabela completa em
  `docs/cms-o-que-vem-de-onde.md`.
- **Números divergentes.** Os quatro números do CMS (90% / 18 / 36 / 75) aparecem em três
  páginas; os da `/about` são outros e estão fixos em `app/about/page.tsx`. Mudar um no painel
  não muda o outro.
- **Navegador in-app quebra a hidratação.** WhatsApp/Instagram injetam código e o React
  re-renderiza o `<html>`, apagando classes postas por script inline. Detalhes e a correção
  em `docs/hydration-inapp-browsers.md`.
- **Detecção de celular** é por `navigator.maxTouchPoints`, não por largura — o modo "Site
  para computador" do iOS mascara media queries.

---

## 5. Leitura obrigatória, nessa ordem

**No repo do site:**

1. `docs/cms-o-que-vem-de-onde.md` — o que é editável e o que é código
2. `docs/ESTADO-DO-PROJETO.md` — histórico e stack
3. `docs/hydration-inapp-browsers.md` — o bug de mobile mais chato do projeto
4. `specs/` — as features numeradas (spec-kit)

**No repo do CMS:**

1. `README.md`
2. `docs/handover.md` — a referência operacional (arquitetura, backup, testes)
3. `docs/deploy-prod.md` — checklist de produção
4. `docs/cms-user-manual.md` — o manual do painel, do ponto de vista de quem edita
