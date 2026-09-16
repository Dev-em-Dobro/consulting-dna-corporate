# Resposta ao Guilherme — hospedagem, domínio e DNS (Axon / Eztech)

> Base: `docs/analise-hospedagem-dns-axon-28-08-2026.md`.
>
> **Duas peças com públicos diferentes — não trocar uma pela outra:**
>
> | | Para quem | Pode ler |
> |---|---|---|
> | **🇧🇷 PT** | Guilherme, direto | só ele (e o time interno) |
> | **🇬🇧 EN** | **Axon** (Rico e Amit), com a CDNA em cópia | Rico, Amit, JP, Mike, Carol, Rhea, Weida |
>
> **O que fica só na PT**: que **o pedido do EPP saiu da resposta do próprio Guilherme** em 12/08, e
> o balanço do que já foi aprovado da lista de 06/08. A versão EN não explica nem se desculpa pelo
> vaivém — só informa que o domínio fica e que o EPP não é mais necessário.
>
> **Escopo:** as duas versões tratam só do que a Axon levantou. Prazo de lançamento, o que falta de
> conteúdo e o que estamos desenvolvendo ficam fora — isso é assunto da thread do brief de 27/08.
> Sobre a hospedagem, ambas só pedem a data exata: não a tratam como prazo nem dizem que será
> cancelada.
>
> **Segurança do domínio** (travas, EPP, contato administrativo como risco) fica **fora das duas** —
> vai numa conversa separada, depois desta. O achado está registrado no doc de análise, §2.7.

---

## 🇧🇷 Versão em português — só para o Guilherme

**Assunto:** Axon — o que precisa ser feito

Fala, Guilherme, tudo certo?

Olhei os dois e-mails. Resumo: **quase nada precisa ser feito.** O cutover não depende deles — o
acesso ao Cloudflare já é nosso desde 13/08, e o próprio Amit escreveu *"now that you have full
control"*. O domínio fica onde está. O que sai daqui são três confirmações e um pedido.

Deixei o e-mail em inglês pronto lá embaixo, endereçado ao Rico e ao Amit com a CDNA em cópia.

**Quem manda sou eu, e por isso ele abre explicando de onde veio.** O e-mail do Rico foi para a
Rhea, com cópia para Maliha, Finance e Amit — eu não estou na thread, então não dá para responder
dentro dela. Começa uma nova, com o assunto deles preservado para eles ligarem uma coisa à outra.
E abre dizendo quem eu sou e que respondo em nome de vocês: fornecedor não deve executar mudança de
domínio a pedido de um terceiro que apareceu do nada, e você em cópia é o que confirma o mandato.
Se preferir mandar você mesmo, me avisa que eu troco o começo — aí ele não precisa de nada disso.

### 1. O domínio fica na Axon

Manter o domínio onde está, porque o cutover só precisa do
Cloudflare, enquanto a transferência leva 5 a 7 dias, trava o domínio por 60 e pode resetar
nameserver na chegada. Bate também com o que o Weida diz no e-mail dele.

Vale entender por que o assunto não morreu: **o pedido do EPP saiu na sua resposta à Axon**, no mesmo
12/08 ("I answered yes, it will be Dev em Dobro and we need the EPP code"), horas antes de eu
recomendar o contrário. A Axon nunca foi avisada da mudança — então seguiram emitindo o código e
tratando o caso como transferência em andamento. É isso que está por trás do e-mail do Rico e da
confusão nas duas threads. Por isso, no e-mail em inglês, a primeira coisa que faço é fechar esse
loop: o domínio fica, e o EPP não é mais necessário.

### 2. A única coisa que peço a eles

**A troca do contato administrativo do domínio.** Ainda é a `allison.vickery@`, e a Carol já está
redirecionando a caixa dela e trocando logins — então é entrar na mesma lista. Só a Axon consegue
fazer a alteração no registrador, por isso pergunto a eles o que precisam para executar.

Mas o nome tem que sair de vocês: eu não posso indicar quem assume. Sugestão, se ajudar — uma caixa
de função (`it@`, `finance@`) em vez de uma pessoa, para não repetir o problema quando alguém sair.

### 3. O cuidado no dia da virada

**Não derrubar o WordPress no dia do cutover.** Backup completo primeiro e servidor de pé por 1–2
semanas para rollback. O Amit pediu para avisarmos quando os registros saírem para ele desconectar —
combinei no e-mail que só avisamos depois de validado, não no momento da troca.

### 4. O que preciso de você

1. **Quem assume o contato administrativo do domínio** no lugar da Allison.
2. **Se o dia 1º inclui apontar o domínio** ou se é lançamento em staging com o domínio vindo depois.
   É isso que define quando aviso o Amit para desconectar o servidor dele.
3. **Um backup do WordPress atual**, que pedi à Axon. Não é para a gente usar — o site novo não
   aproveita nada de lá. É para a CDNA não perder o conteúdo e as mídias antigas quando o servidor
   for desligado.

Por último: tem um assunto de **segurança do domínio** que quero levantar com você depois desta
rodada — nada que trave o lançamento, mas vale uma conversa separada. Deixei fora dos dois e-mails.

Abraço,
Ricardo

---

## 🇬🇧 English version — to Axon (Rico e Amit), com a CDNA em cópia

> Endereçado a eles porque são eles que têm perguntas em aberto. A CDNA lê como cópia e fica a par
> das decisões — sem virar um relatório de status do projeto, que não é assunto de fornecedor.

**Subject:** corporatednaconsulting.com — domain, and how the cutover will run (re: your 19 August reminder)

Dear Rico and Amit,

I am Ricardo, from Dev em Dobro — the provider Guilherme Mendes confirmed to you on 12 August as the team building Corporate DNA's new website.

Your reminder of 19 August was addressed to Rhea, and it reached us inside CDNA, forwarded on to Guilherme, who passed it to us to answer. Since I was not on the original thread I cannot reply within it, so this is a new message on the same subject — I have kept your subject line for reference and copied CDNA, who can confirm that we are answering on their behalf and that the decisions below are theirs.

Thank you for the reminder, and for arranging the Cloudflare access.

To answer your question directly: of the three options you offered, it is the middle one — **the
domain stays registered with Axon, and only the website moves.** There is no transfer to arrange and
we do not need the EPP code, so please treat any auth code already issued as no longer required.

**One thing we would ask you to update:** the domain's administrative contact. Amit referenced
`allison.vickery@corporatednaconsulting.com` on 13 August; she has since left CDNA, so that mailbox
is no longer monitored and should not be receiving domain correspondence. CDNA will confirm the
replacement contact — could you let us know what you need in order to make the change?

**On the cutover**, Amit, this follows the sequence you asked for: we change the A/CNAME records in
Cloudflare, keeping **"Under Attack" mode enabled until that is done**; we validate the new site on
the live domain; and then we write to you to confirm it is safe to disconnect. Please keep the
WordPress site running for a week or two after the records change, as a rollback path.

One request alongside that: **a full backup of the current WordPress site**. Not for the migration —
the new site is built independently and takes nothing from it — but so CDNA keeps the old content and
media once the server is eventually retired.

On lead times, your point about planning ahead is well taken. In this case the usual risks do not
apply: email runs on Microsoft 365 rather than the hosting server, so the A/CNAME change does not
touch mail delivery; there is nothing to export, as the new site is already built on its own
platform; and DNS is already under our control thanks to your access.

We will let you know before making any change.

Best regards,
Ricardo
