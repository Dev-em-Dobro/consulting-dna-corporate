# Mapa do cenário digital da CDNA — 03/09/2026

> **Por que existe.** No WhatsApp, respondendo à Rhea, alguém da CDNA escreveu: *"We should have a
> schematic for each part of the digital landscape with providers / owners / internal owners."* Este é
> esse esquema.
>
> **Revisado em 03/09 às 09h**, depois de ler a thread da Axon inteira (12 mensagens novas entre 31/08
> e 03/09). Três coisas mudaram desde a primeira versão, e uma delas muda o enquadramento do documento.
>
> **Fontes:** `docs/emails/axon/novas respostas axon/*.eml`,
> `docs/analise-hospedagem-dns-axon-28-08-2026.md`, `docs/painel-axon/*.png`, memórias do projeto.

---

## O que mudou desde a primeira versão

**1. A CDNA já definiu a regra de titularidade — antes de a gente propor.**

O Guilherme escreveu em 01/09, e depois repetiu em inglês para a Axon:

> *"Wherever possible, please use the following as Corporate DNA's institutional owner/account:
> **singapore@corporatednaconsulting.com**. We would also like Nitin Goil and Nicole to have
> administrator access so that ownership and control do not depend on a single individual or external
> provider. […] **Corporate DNA retains ownership and administrative control of the accounts, while our
> technical partners receive the permissions required to manage them.**"*

E em português, para nós: *"Corporate DNA owns; our partners manage."*

**Isso reposiciona este documento inteiro.** Ele deixa de ser uma proposta nossa de handover e passa a
ser o **plano de execução da regra que o cliente já deu**. Toda linha abaixo responde à mesma pergunta:
essa camada já está no padrão `singapore@` + Nitin + Nicole, ou ainda não?

**2. Entrou uma pessoa nova: Nicole Phoon** — `nicole.phoon@corporatednaconsulting.com`. Criou conta
Google em 03/09 de manhã e **já foi adicionada como administradora do Google Analytics** às 07:07. É
ela quem passa a tocar os acessos do lado da CDNA.

**3. A extensão da hospedagem tem preço, e é baixo.** O Rico confirmou em 01/09: não dá para estender
por mês, o mínimo é um trimestre — **01/10 a 31/12/2026, SGD 150**. Está esperando decisão da CDNA.
Ver a seção *Duas decisões pendentes*, no fim.

---

## Como ler as colunas

- **Provider** — quem opera o serviço.
- **Account holder** — em nome de quem está a conta **hoje**, na prática.
- **Internal owner** — quem, dentro da CDNA, responde por aquilo. O alvo é `singapore@` como titular,
  com Nitin e Nicole como administradores, conforme a regra acima.

---

## 🇬🇧 Digital landscape — providers, owners, internal owners

**Corporate DNA Consulting — as of 3 September 2026, 09:00**

Target state for every row, as set by Corporate DNA on 1 September:
**`singapore@corporatednaconsulting.com` owns; Nitin Goil and Nicole Phoon administer; technical
partners hold the permissions they need to operate.**

### 1. Domain and DNS

| Asset | Provider | Account holder today | Internal owner | Status |
|---|---|---|---|---|
| Domain `corporatednaconsulting.com` | **WebNic** (registrar); **Axon 1ProIT** (reseller) | Corporate DNA, via the Axon billing portal | **Rhea Leckie** — agreed | ⏳ **Waiting on one email.** Axon has the request and confirms there is no charge. Rico needs Rhea to confirm by Reply-all that she authorises the change; Allison Vickery's mailbox is removed at the same time. Nothing moves until then. Domain expires **13 Oct** |
| Registrar locks | WebNic, via Axon | — | — | ❌ Still absent. No `clientTransferProhibited`, no `clientUpdateProhibited`. Costs nothing to enable. Should ride along with the contact change |
| DNS zone | **Cloudflare** | Corporate DNA account — *which mailbox owns it is still unconfirmed* | *to move to `singapore@`* | ✅ Operational. Dev em Dobro has held an admin seat since 13 Aug. The account owner should be re-pointed to `singapore@` under the new rule |

### 2. Website

| Asset | Provider | Account holder today | Internal owner | Status |
|---|---|---|---|---|
| Legacy WordPress site | **Axon** — package Axon-P500 | Corporate DNA | *n/a — being retired* | Ends **30 Sep 2026**. A 3-month extension is available at **SGD 150** if rollback cover is wanted past that date. **Decision pending** |
| New website (Next.js) | **Vercel** | Dev em Dobro (team `dobro66`) | *to transfer* | 🔄 **Handover planned.** Create a Corporate DNA Vercel team under `singapore@`, transfer the project, add Nitin and Nicole. No downtime, no code change |
| CMS | **Vercel** | Dev em Dobro | *to transfer* | 🔄 Same transfer, same window |
| Content database | **Supabase** | Dev em Dobro | *to transfer* | 🔄 Transfer to a Corporate DNA organisation. ⚠️ Separately and more urgently: the project is on the free plan, with **no automatic backup and no point-in-time recovery**. See *Safeguards*, below |
| Legacy database | **Neon** | Dev em Dobro | — | Read-only rollback copy from the Neon → Supabase migration. Can be retired after launch; no action needed |
| Transactional email | **Resend** | Dev em Dobro | *to transfer* | Sends CMS login and password-reset mail. Small, but it is a client-facing sender and belongs in the same handover |

### 3. Microsoft and productivity

| Asset | Provider | Account holder today | Internal owner | Status |
|---|---|---|---|---|
| Email, SharePoint, Teams | **Microsoft 365** | Corporate DNA tenant | *unconfirmed* | MX confirmed as `…mail.protection.outlook.com`. **Eztech Services (Tay Weida)** is the likely administrator — he is on the thread and states he took over IT. Worth confirming in writing, not assuming |
| Other authorised senders | **Zoho, SendGrid, Mailchimp**, plus a smarthost and a fixed IP range | unknown | *open* | Five entries in the SPF record are authorised to send email as the domain. Each needs a named owner or removal |
| Endpoint security | **Bitdefender**, via Axon | Corporate DNA | *open* | S$ 720/yr, **Terminated since 1 Mar 2025**. Nobody renewed it |

### 4. Analytics and search

| Asset | Provider | Account holder today | Internal owner | Status |
|---|---|---|---|---|
| Google Analytics 4 | **Google** | Corporate DNA account (ID 96902425) | **Nicole Phoon** | ✅ **Done, 3 Sep.** Nicole created a Google Account and Axon added her as administrator. She still needs to accept the invitation |
| Legacy Universal Analytics | **Google** | same account | — | Discontinued by Google. Historical reference only |
| Google Search Console | **Google** | unknown | *to be `singapore@`* | ⏳ Still open. Access requested for `singapore@`; Axon is verifying who currently holds the property. A `google-site-verification` record exists in the zone, so one exists somewhere |

### 5. Learning platform

| Asset | Provider | Account holder today | Internal owner | Status |
|---|---|---|---|---|
| **LMS** | *for Corporate DNA to confirm* | | | Raised in the WhatsApp thread as something that could share hosting with the website. **DNS checked on 3 Sep: no LMS subdomain resolves** under any of 34 likely names, and there is no wildcard record. Either it runs on another domain, or under a name we could not guess |

> **If the LMS does sit on this domain, four things change:**
> 1. **The 30 September shutdown.** If it runs on the same Axon server as the WordPress site, it goes
>    down with it. Nothing to do with DNS, and the most serious case.
> 2. **Zone cleanup.** The cutover plan includes deleting orphaned WordPress records. Nothing that
>    resolves gets deleted until someone confirms what it is.
> 3. **Under Attack mode** is on for the whole zone today — every learner would be challenged now, and
>    switching it off at go-live changes that again.
> 4. **SPF.** LMS notification email almost certainly rides one of the authorised senders. The cutover
>    does not touch MX or SPF; any tidy-up of those records would break it.
>
> Also: if learners log in somewhere, the new website needs an entry point for them. None of the 52
> redirects covers an LMS path.

---

## Safeguards — what is already protecting Corporate DNA

> This section exists because a list of gaps, on its own, reads worse than the situation is. Everything
> below is in place today, not planned.

**Authority is on the record.** Guilherme confirmed in writing to Axon on 1 September that Dev em Dobro
is authorised to coordinate the migration and request the access it needs. Axon acknowledged and
recorded it. No one is acting on informal permission.

**The cutover cannot touch email.** Only two records change: the apex `A` and `www`. MX, SPF, DKIM and
DMARC are untouched, so Microsoft 365 mail is unaffected. The exact values, date, time and timezone go
to Axon before the change, and validation is confirmed in the thread afterwards. Axon has this sequence
in writing and has agreed to it.

**Search visibility is protected before the switch, not after.** 52 redirects are mapped from the
current site's URLs; titles, meta, canonical, JSON-LD, `sitemap.xml` and `robots.txt` ship with the
application. GA4 continuity is a cutover checklist item, not a post-launch one, so the historical series
does not break at the exact point where the comparison matters.

**The old environment does not disappear silently.** Its end date — 30 September — is known, in writing,
and a full backup of files, database and media is being arranged before then. Axon has since confirmed
that one maintenance credit, roughly one hour, is normally enough for that task, and that the assistance
is optional since the appointed developer already has the access.

**Under Attack mode is handled deliberately.** It stays on through the change and validation and comes
off at go-live, because it challenges every visitor and blocks search engines. Axon knows the sequence
and will be told when it is disabled.

**The three accounts in our name are declared, not discovered.** They are listed above with a transfer
path, and they are the reason this document exists. The transfer target is the account Corporate DNA
chose: `singapore@corporatednaconsulting.com`, with Nitin and Nicole as administrators.

### The one risk that should not wait for the handover

The Supabase project is on the free plan: **no automatic backup, no point-in-time recovery**. If that
database is lost, every case study and Solutions page is retyped from scratch — the people can be
re-invited, the content cannot. A scheduled `pg_dump` has been documented as necessary since 19 July and
still has no named owner.

This is independent of whose account it is, and it is the only item on the list with total-loss risk.
It gets an owner and a schedule this week.

---

## Duas decisões pendentes, as duas com data

**1. A Rhea precisa responder um e-mail.** Axon needs her Reply-all confirming she authorises the
administrative-contact change to `rhea.l@corporatednaconsulting.com` and the removal of Allison
Vickery's mailbox. Rico chased it again this morning. There is no charge, Axon allows three free
updates, and Amit knows Rhea personally so her reply is enough on its own — no letterhead needed for
this route. **Until she replies, the domain contact stays as it is, and the domain expires 13 October.**

**2. Estender a hospedagem por um trimestre, ou não.** SGD 150 for 1 October to 31 December.

Without the extension, the rollback window shrinks as launch approaches:

| Cutover date | Rollback available |
|---|---|
| 16 Sep | 14 days — the full two weeks |
| 23 Sep | 7 days |
| 30 Sep onward | none |

With it, that table stops mattering and the launch date is chosen on merit rather than on a hosting
invoice. **Recommendation: take the extension.** It is the cheapest line item in this entire document
and it is the only one that buys back schedule freedom.

---

## O que ainda só a CDNA responde

1. Which mailbox owns the Cloudflare account today — and whether it is tied to Allison's.
2. Who administers the Microsoft 365 tenant. Eztech is the likely answer; nobody has confirmed it.
3. Who uses Zoho, SendGrid and Mailchimp with the domain, and whether all five SPF entries are still
   needed.
4. The LMS: which platform, at what address, contracted by whom, and whether it sits on the Axon server.
