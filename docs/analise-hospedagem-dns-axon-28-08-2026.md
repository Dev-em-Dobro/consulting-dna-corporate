# Análise — Hospedagem, domínio e DNS (e-mails Axon / Eztech, 28-08-2026)

> **Fonte:** `docs/respostas-axon-dns-atualizado-28-08-2026.txt` — dois e-mails encaminhados pelo
> Guilherme em 28/08, pedindo "uma olhada no que precisamos fazer".
> **Contexto interno:** `docs/FEITO-E-FALTA-brief-27-08.md` (cutover pendente),
> `docs/seo-audit-2026-07-26.md` (Apêndice A — Cloudflare), `specs/redirects-inventory.md`.

---

## 1. O que são os dois e-mails

**E-mail 1 — Axon (Rico M., 19/08).** Cadeia: Rico → Rhea → Finance (Yvonne) → Mike Jackson →
JP Pritchard → Guilherme → nós. É uma cobrança de decisão antes das renovações: continuar com a
Axon, sair, ou o meio-termo (domínio lá, hospedagem fora).

**E-mail 2 — thread interna CDNA + Axon (Amit) + Eztech (Weida).** Nasce da confirmação do
Cloudflare de que `gemeos@devemdobro.com` aceitou o convite para a conta (13/08) e vira um
"quem é o dono disso agora?" depois que a Allison Vickery saiu da empresa.

---

## 2. Os fatos que mudam o jogo

### 2.1 O DNS já é nosso

O convite do Cloudflare foi aceito em 13/08 e o Amit escreveu literalmente:

> *"Now that you have full control"* … *"Once you have pointed A records out, let me know so I can
> disconnect on my server"*

**O cutover não depende da Axon** — é trocar os registros A/CNAME no Cloudflare para o Vercel.
Isso desbloqueia o item que está pendurado desde o status de 10/08 ("how the DNS will be pointed
to the new site").

### 2.2 Os prazos são comerciais, não técnicos

> **Correção (28/08, após verificação no DNS ao vivo).** A recomendação do Rico de "iniciar a
> migração com ≥ 1 mês de antecedência" é conselho genérico de hospedagem e **não descreve o nosso
> caso**. Verificado:
>
> - **O email não está com a Axon.** O MX aponta para
>   `corporatednaconsulting-com.mail.protection.outlook.com` — Microsoft 365. O SPF confirma
>   (Outlook, Zoho, SendGrid, Mailchimp). Trocar os registros A/CNAME não encosta no MX, então o
>   risco clássico de derrubar o email numa migração **não existe aqui**.
> - **Não há migração de dados.** O site novo já está no ar na Vercel, com CMS e banco próprios.
>   Nada a exportar do servidor da Axon.
> - **O DNS já é nosso** desde 13/08 (§2.1).
>
> O cutover é trocar dois registros no Cloudflare — minutos, não semanas. O prazo real é
> **comercial**: fazer a virada, validar, mandar o Amit desligar e cancelar antes da renovação da
> hospedagem, para não pagar S$ 550 por um servidor que não serve mais nada. Isso é um mês de
> **folga**, não um mês de trabalho, e **não é pressão sobre a data de lançamento**.
>
> A única coisa nessa história que realmente leva semanas é a **transferência de registrador**
> (lock de 60 dias da ICANN, EPP code) — e ela é opcional, não bloqueia nada. Ver §3.

Os registros que o Rico mandou são do **ciclo anterior**:

| Item | Invoice | Valor | Vencimento (ciclo anterior) |
|------|---------|-------|------------------------------|
| Domínio `corporatednaconsulting.com` | #9170 | S$ 22,00 | 22 out |
| Hospedagem do site | #9143 | S$ 550,00 | 30 set |

**Data do domínio confirmada por consulta RDAP (28/08): expira em `2026-10-13`.** Ou seja, **13/10 e
não 22/10** — o 22/10 da fatura era o vencimento do boleto, não do domínio. Nove dias a menos de
margem do que assumimos.

A data da **hospedagem** continua sendo inferência (30/09, pelo ciclo anterior) — isso só a Axon
confirma, não aparece em registro público.

### 2.3 Restrição técnica ativa neste momento

O Amit pediu explicitamente para **não desligar o modo "Under Attack" do Cloudflare enquanto o DNS
ainda aponta para o servidor dele** — o site antigo estava sob ataque pesado.

Isso explica o Apêndice A da auditoria de SEO: o `robots.txt` em produção é o *managed robots* do
Cloudflare (sobrescreve o do app e bloqueia AI crawlers) e o `/sitemap.xml` retorna 403
"Just a moment…". **Depois do cutover isso precisa ser ajustado**, senão o site novo nasce com o
sitemap bloqueado.

### 2.4 O contato administrativo do domínio saiu da empresa

O Amit diz que o EPP code vai para `allison.vickery@corporatednaconsulting.com`; o Rico diz que já
foi enviado à Rhea (contato registrado), mas para o e-mail antigo dela. A Carol, do CEO Office, já
pediu para redirecionar a caixa da Allison e trocar logins.

É bloqueador para qualquer transferência de domínio — e risco de médio prazo mesmo sem transferir
(renovação, recuperação de conta).

> **Correção (28/08, após ler a thread `docs/emails/`).** A Yvonne escreve *"I am not sure who
> initiated the said request with Axon"*, e este doc tratava a origem do pedido como desconhecida.
> **Ela é conhecida:** em 12/08 o Guilherme respondeu à Axon *"I answered yes, it will be Dev em
> Dobro and we need the EPP code"*. Horas depois, no mesmo dia, o Beto recomendou o contrário —
> manter o domínio onde está e não pedir o EPP — e essa recomendação **nunca chegou à Axon**.
>
> Isso reenquadra boa parte do §2.5: a Axon não está confusa, está operando sobre a última instrução
> que recebeu. O e-mail do Rico ("if you decide to migrate… start the transfer five weeks before
> expiry") e a menção do Amit ao EPP são consequência direta disso, não desorganização deles.
> O primeiro movimento, portanto, é **fechar esse loop** — comunicar que o domínio fica.

### 2.5 Ninguém do lado deles é dono do assunto

Rico aponta para Rhea → Finance aponta para Mike → Mike está "out of the loop" → JP repassa para
Guilherme → e o Weida (Eztech) afirma que já tinha sido decidido manter o domínio na Axon.
Três versões, nenhum decisor formal.

> **Ressalva (28/08).** O Weida não está errado, e a "terceira versão" dele é na verdade a correta:
> manter o domínio na Axon é exatamente o que o Beto recomendou em 12/08 (§2.4). O problema não é
> divergência de opinião — é que a decisão certa nunca foi comunicada a quem precisava saber.

### 2.6 O site antigo foi comprometido

A Axon admite hacking, malware e code injection no WordPress atual, e diz que limpou sem cobrar.
Implicação prática: pegar o backup sim, mas tratar como conteúdo **não confiável** — extrair só
mídia e textos, nunca subir código.

### 2.7 O domínio está sem trava — e o registrador não é a Axon

> **Verificado por RDAP (registro público) em 28/08.**

| Campo | Valor |
|-------|-------|
| Registrador real | **Web Commerce Communications Ltd — WebNic.cc** (a Axon é *revendedora*) |
| Status | **`active` — e mais nada** |
| Registrado desde | 2008-10-13 (18 anos) |
| Expira em | **2026-10-13** |
| Última alteração | 2026-08-12 (véspera do aceite do convite no Cloudflare) |
| Nameservers | `mario.ns.cloudflare.com` / `pam.ns.cloudflare.com` |

Três achados que importam:

1. **Não há nenhum lock aplicado.** O status é só `active`: **sem** `clientTransferProhibited`,
   **sem** `clientUpdateProhibited`, **sem** `clientDeleteProhibited`. A maioria dos registradores
   liga a trava de transferência por padrão. Sem ela, quem obtiver o auth code consegue iniciar uma
   transferência, e nada bloqueia troca de nameserver ou de contatos.
2. **Existe uma camada de revenda.** A cadeia é CDNA → Axon (revendedora) → WebNic (registrador) →
   Verisign (registry). A CDNA não tem login direto no registrador: qualquer alteração depende da
   Axon responder — inclusive numa emergência.
3. **Quem controla o registrador vence o DNS.** "O DNS é nosso" (§2.1) só vale enquanto a delegação
   de NS apontar para o nosso Cloudflare. Do painel do registrador, trocar os nameservers derruba
   tudo que fizermos no Cloudflare, em minutos.

Somando com §2.4 (o contato administrativo é a caixa de uma pessoa que saiu): **sem trava + auth
code indo para uma caixa órfã** é exatamente o roteiro de sequestro de domínio. E aqui o estrago
passa muito longe de "o site cai": o **MX é Microsoft 365**, então quem repontar os nameservers
leva junto o **e-mail corporativo** — e com o e-mail, o reset de senha de todo o resto.

**Importante não confundir com os ataques do §2.6.** O WordPress foi comprometido na camada de
aplicação (componentes desatualizados, injeção de código). Isso não tem relação nenhuma com
registrador: mudar o domínio de lugar não teria evitado nenhum daqueles ataques, e mantê-lo na Axon
não perpetua nenhum deles — quando o WP sair do ar, aquela superfície acaba. O risco de registrador
é outra classe de problema, mais raro e muito mais grave.

---

## 3. Recomendação

**Domínio — em duas etapas.** (Revisado após o §2.7; a versão inicial deste doc dizia apenas
"deixar na Axon".)

*Agora, antes de 13/10 — inegociável, e independe de transferir ou não:*

1. **Trocar o contato administrativo/registrant** de `allison.vickery@` para alguém ativo (Rhea, ou
   uma caixa de função tipo `it@`/`finance@`, que não morre quando a pessoa sai).
2. **Pedir à Axon/WebNic para ligar as travas** — `clientTransferProhibited` e
   `clientUpdateProhibited`. Custa zero e fecha o caminho do sequestro.
3. **Confirmar o auto-renew** e a data 13/10.
4. **Invalidar qualquer EPP code já emitido** — foi enviado para caixas que ninguém controla.

*Depois do lançamento, com calma:* **transferir para um registrador que a CDNA controle direto.**
O candidato natural é o **Cloudflare Registrar** — o DNS já está lá, o preço é de custo, não há
revendedor no meio e a conta fica com a CDNA. Não fazer isso agora: a transferência exige o EPP code
(que vai justamente para o contato quebrado) e reinicia o lock de 60 dias da ICANN. Fazer na mesma
janela do lançamento é procurar problema.

*Enquanto isso, manter na Axon é aceitável* — os S$ 22/ano nunca foram a questão. A questão era
higiene de controle, e os itens 1–4 acima resolvem isso sem transferir nada.

**Hospedagem: não renovar os S$ 550 — na ordem certa.** Cutover para o Vercel → validar em
produção → avisar o Amit para desconectar o servidor → cancelar antes de 30/09 para não gerar a
fatura. Se o cutover não acontecer até ~20/09, aí vale renovar um ciclo em vez de correr sem rede.

> Note que isso dá **um mês de folga**, não um mês de trabalho (§2.2). A data de lançamento não
> deve ser apertada por causa da hospedagem: se o dia 1º escorregar, o pior caso é renovar um ciclo
> de S$ 550 — barato perto de virar às pressas.

**Não derrubar o WordPress no dia do cutover.** Backup completo primeiro e servidor de pé por 1–2
semanas para rollback. O Amit desconecta quando pedirmos — só pedir depois de validado.

---

## 4. O que precisamos deles

1. **Data exata de expiração da hospedagem** — pedir à Axon. (A do domínio já está confirmada:
   **13/10**, via RDAP — §2.2.)
2. **Novo contato administrativo/registrant do domínio** no lugar da `allison.vickery@` — quem?
   Recomendamos caixa de função, não pessoa.
3. **Autorização para pedir as travas do domínio à Axon** (`clientTransferProhibited` +
   `clientUpdateProhibited`) e para invalidar os EPP codes já emitidos — §2.7. Isso é o item mais
   urgente da lista.
4. **Autorização para não renovar a hospedagem** após o cutover.
5. **Data-alvo do go-live** — o cutover exige o conteúdo publicado no CMS, então amarra com o
   brief de 27/08.
6. **Backup do WordPress atual** — para a CDNA preservar conteúdo e mídias antigas quando o servidor
   for desligado. Não precisamos de credenciais: o site novo não aproveita nada de lá.

   > **Correção (28/08, após reler o áudio de 29/07).** Este item dizia antes "backup e credenciais
   > — o acesso admin mencionado no áudio de 29/07 nunca chegou". **Isso está errado.** O áudio não
   > registra promessa de acesso; registra o oposto — a pessoa que administra o site (via Dubai)
   > *"tava um pouco relutante pra passar o password, porque é o password do admin que faz todo o
   > nosso serviço"*, e o arranjo proposto foi que **ela** faria o upload quando o site novo
   > estivesse pronto. Nunca foi combinado que receberíamos acesso, então não há o que cobrar. O
   > arranjo em si também caducou: não vamos subir conteúdo no WordPress antigo.
7. **Quais outros acessos estavam na conta da Allison** (Search Console, Analytics, redes sociais).
   Se ela era o contato do registrador, provavelmente é de mais coisas.

---

## 5. Do nosso lado — o cutover

### Já pronto

- Os **52 redirects 301** do site antigo → novo estão implementados (`specs/redirects-inventory.md`,
  via `lib/redirects.ts` + `next.config.mjs`).
- `lib/site.ts:5` já aponta o canonical para `https://corporatednaconsulting.com` — hoje divergente
  da produção real (`consulting-dna-corporate-alpha.vercel.app`), o que se resolve sozinho no
  cutover.

### Falta

1. ~~Baixar o **TTL** dos registros alguns dias antes do cutover.~~ **Desnecessário** (verificado
   28/08): os registros A já estão com **TTL 300s** e apontam para IPs do **Cloudflare**
   (`104.21.1.11`, `172.67.151.187`) — ou seja, estão *proxied*. O visitante nunca resolve o IP de
   origem; a troca de destino acontece do lado do Cloudflare e vale quase de imediato, sem depender
   do cache dos resolvers. O cuidado de baixar TTL com antecedência vale para DNS direto, não aqui.
2. Adicionar `corporatednaconsulting.com` + `www` no projeto Vercel e validar o domínio.
3. Trocar os registros no Cloudflare — **confirmar os valores atuais no painel do Vercel na hora**
   (apex e CNAME mudam com o tempo).
4. **SSL/TLS em Full (strict)** — em Flexible dá loop de redirect.
5. Decidir proxy (laranja) vs DNS-only (cinza); **desligar o Under Attack** e ajustar o Bot Fight
   Mode para permitir bots verificados.
6. Garantir que `/robots.txt` e `/sitemap.xml` passem a vir do app, não do managed robots do
   Cloudflare.
7. Avisar o Amit para desconectar o servidor da Axon — **só depois de validado**.
8. Submeter o sitemap no Search Console e monitorar 404s.
9. **Checar a reputação do domínio antes do go-live.** O WP serviu código injetado (§2.6), e
   blocklist (Google Safe Browsing, listas de malware) gruda no **domínio**, não no servidor —
   segue para o site novo. Verificar no Search Console (Security Issues) e no Safe Browsing antes
   de virar; se houver flag, pedir revisão.
10. **Revisar a zona inteira no Cloudflare** e apagar registros órfãos do WordPress. Registro
    apontando para servidor que não existe mais é risco de subdomain takeover. *Já verificado por
    fora (28/08): dos suspeitos comuns — `mail`, `webmail`, `cpanel`, `ftp`, `smtp`, `blog`,
    `staging`, `dev` — nenhum resolve; só o `www`, proxied no Cloudflare. Superfície pequena, mas
    a lista completa só aparece no painel.*

---

## 6. Pessoas citadas nos e-mails

| Nome | Papel | Onde aparece |
|------|-------|--------------|
| Rico M. | Support Engineer, Axon 1Pro | Autor do lembrete de renovação |
| Amit Kumar | Axon 1ProIT | Deu o acesso ao Cloudflare; alerta do Under Attack |
| Rhea Leckie | Founder & CEO, CDNA | Contato registrado do domínio (e-mail antigo) |
| Allison Vickery | CEO Office — **saiu da empresa** | Contato administrativo do domínio |
| Carol Medcalf | CEO Office | Assumiu a caixa da Allison; pede quem toca a parte técnica |
| Mike Jackson | Head of UK & Europe | Ponto de contato da Axon desde o Aman; "out of the loop" |
| Jon-Paul Pritchard | Thought Leadership | Encaminhou tudo ao Guilherme |
| Yvonne | Finance, CDNA | Encaminhou o lembrete |
| Tay Weida | IT Consultant, Eztech | Diz que ficou decidido manter o domínio na Axon |
| Maliha Bathool | CDNA | Copiada na thread original da Axon |
