# Resposta à Axon — 01/09/2026 (substitui o rascunho de 31/08)

> **Substitui `docs/resposta-axon-contatos-31-08-2026.md`**, que foi escrito antes da resposta do
> Amit e ficou desatualizado em três pontos. Aquele arquivo não deve ser enviado.
>
> Fontes: `docs/emails/axon/*.eml` (thread completa, 6 mensagens) +
> `docs/analise-hospedagem-dns-axon-28-08-2026.md`.

---

## O que aconteceu: duas respostas ao mesmo e-mail

Nosso e-mail de 28/08 recebeu **duas respostas independentes**, e a segunda não enxergou a primeira.

```
Rico  31/08 20:51 SGT   In-Reply-To: <CALXSnSHs+jpnOF4...>  ← nosso e-mail
Amit  01/09 06:51 SGT   In-Reply-To: <CALXSnSHs+jpnOF4...>  ← o mesmo e-mail
                        References:  só ele — a mensagem do Rico não está na cadeia
```

O Amit estava em cópia na resposta do Rico e escreveu dez horas depois, mas respondeu na mensagem
antiga. **E removeu `rico.m@` e `spencer@` da cópia** — então o Rico não viu a resposta do Amit.

### Onde as duas divergem

| | Rico (31/08) | Amit (01/09) | Consequência |
|---|---|---|---|
| Contato administrativo | manda nome, cargo, e-mail, telefone | **carta em papel timbrado, assinada pelo dono ou representante autorizado** | Vale a do Amit — é o requisito mais restritivo, e é ele quem executa |
| Cutover | *vocês mandam os valores e a data, a gente coordena* | *vocês têm o Cloudflare, façam sozinhos* | Sem conflito real — fazemos nós, e avisamos mesmo assim |
| Backup do WordPress | **"we will arrange the requested full backup"** | *vocês têm o painel, baixem vocês* — ou **USD 300** | **Conflito com custo.** Precisa ser resolvido por eles |
| Rollback 1–2 semanas | sem condição | **"provided the current hosting account remains active"** | Amarra o rollback ao S$ 550 da renovação |

O e-mail abaixo abre apontando a divergência — com educação, sem cobrança. Duas respostas
conflitantes na mesma thread é problema deles para alinhar, mas quem paga a conta se ninguém alinhar
é a CDNA.

---

## O achado do Analytics

O Amit menciona a conta de Google Analytics da CDNA, o ID legado `UA-96902425-1`, e diz ter enviado
convite para `devemdobro@gmail.com`.

**Encontrado — o convite existe.** Não deu para verificar por esta máquina: a caixa conectada aqui é
`ferramentasdevemdobro@gmail.com`, outra conta, e a busca não retornava nada relacionado. O Ricardo
abriu o `devemdobro@gmail.com` em 31/08 e achou.

**E o convite dá acesso a uma propriedade GA4 que já existe** (verificado no seletor de contas em
31/08, `docs/painel-axon/ga4.png`):

| | |
|---|---|
| Conta | `corporatednacon…` — ID **96902425** |
| Propriedade | **`corporatednaconsulting.com - GA4`** — ID 385075284 |

O ID da conta, `96902425`, é o mesmo número de dentro do `UA-96902425-1`. Ou seja: a GA4 foi criada
como migração da propriedade antiga, na mesma conta, e não é uma conta paralela.

**Consequência para o e-mail:** o §5 deixou de pedir "qual conta e qual propriedade" à Axon — temos
acesso e lemos sozinhos. O `385075284` é o *Property ID*, não serve para a tag; o que vai no site é o
**Measurement ID `G-`**, em Admin → Data streams → stream web.

### A propriedade tem histórico contínuo

Verificado em 31/08: **~5.000 visitas no ano de 2025**, e 2026 seguindo com dados. A coleta está
viva — a tag continua no WordPress antigo.

Isso tem duas consequências práticas:

1. **Confirma a decisão de usar a propriedade existente** em vez de criar uma nova. Existe série
   histórica de verdade para comparar antes e depois do lançamento, e ela só se mantém contínua se o
   site novo reportar para a mesma propriedade.
2. **Sobe a prioridade da instalação da GA4.** Com a tag viva hoje, se ela não estiver no site novo
   no dia da virada, a série quebra exatamente ali — no único ponto em que a comparação importa. Vira
   item de checklist de cutover, não de pós-lançamento.

### O argumento do Amit sobre perder o histórico não se sustenta

Ele escreve: *"I don't recommend using total new analytics as you will lose all analytics data."*

**Esse dado está na conta do Google, não no servidor da Axon.** Desligar a hospedagem em 30/09 não
apaga nada de GA4. O único jeito de perder aquele histórico seria criarmos uma propriedade nova e
abandonarmos esta — e como agora temos acesso à existente, basta instalar a tag dela no site novo
para a continuidade ficar preservada.

> **Fora do e-mail, de propósito.** Corrigir o Amit nesse ponto não compra nada e soa a disputa. O §5
> já resolve na prática, dizendo que temos o acesso e vamos instalar. Registrado aqui para o caso de
> o assunto voltar como argumento de venda de serviço de SEO.

Isso é o **item 7 da análise** ("quais outros acessos estavam na conta da Allison") aparecendo
sozinho. Se existe GA, provavelmente existe Search Console — e é o Search Console que carrega o
histórico de busca e a verificação de propriedade. O e-mail pergunta pelos dois.

Sobre o UA-96902425-1: o Amit está certo. Universal Analytics foi desligado, o ID não vira GA4 e o
histórico não migra. O que dá para fazer é manter a propriedade antiga como consulta e criar/usar uma
GA4 nova. **Não é motivo para atrasar nada.**

## A lista de SEO — conferida contra o código

Metade da lista dele é pitch de serviço; a outra metade já está feita:

| Item | Situação |
|---|---|
| 301 dos URLs antigos | 52 redirects implementados (`specs/redirects-inventory.md`, `lib/redirects.ts`) |
| sitemap.xml | `app/sitemap.ts` — vem do app |
| robots.txt | `app/robots.ts` — vem do app |
| llms.txt | `public/llms.txt` já existe |
| Structured data / JSON-LD | `lib/seo/jsonld.ts` + `components/JsonLd.tsx`, no layout e nas páginas |
| Titles, meta, headings, canonical, social | prontos |
| **GA4** | **falta** — nenhum `gtag` no projeto, e depende do Measurement ID que ainda não temos |

O 403 no `/sitemap.xml` e o robots gerenciado do Cloudflare que ele vai encontrar se testar hoje são
**o Under Attack**, não o site novo — §2.3 da análise. Vale dizer isso no e-mail, senão vira "o
fornecedor não fez o básico".

## O histórico do acesso ao WordPress — thread `Access`, 27/07 a 03/08

> Fonte: `docs/emails/conversas beto e guilherme/Access*.eml` (9 mensagens).
> Isto responde em definitivo a afirmação do Amit de que "CDNA already has access to the hosting
> control panel". **Ele está meio certo — e é a metade errada que importa.**

**27/07** — O Guilherme encaminha um e-mail do Amit de **14/10/2025**, dirigido ao Aman Verma com o
Finance em cópia:

> *"The records are there, you can login to view and make changes online to manage domain and
> hosting"* — `https://billing.axonserver.com`, usuário `finance@corporatednaconsulting.com`, senha
> no corpo do e-mail.

Isso é o **portal de faturamento** da Axon. "Manage domain and hosting" ali significa gerir os
serviços contratados — não é cPanel nem `wp-admin`.

**28/07** — O Beto identifica a lacuna no mesmo dia: *"acho que eles mandaram apenas o acesso do
domínio... O que ainda falta: Access to the WordPress hosting account"*. Fala com o suporte da Axon
pelo WhatsApp e recebe o procedimento: **o cliente** precisa escrever para `support@axon.com.sg`
pedindo o reset das credenciais de cPanel e WordPress. Um texto pronto é redigido para o Guilherme
enviar.

**29/07** — *"estamos no aguardo do acesso do wordpress e do cloudflare"*. Não há na thread nenhum
sinal de que aquele e-mail tenha sido enviado.

**03/08** — O Guilherme pergunta diretamente: *"Precisamos realmente de acesso à hospedagem WordPress
atual ou apenas ao conteúdo?"* E respondemos: **"Não precisamos. O acesso serviria apenas para
fazermos o backup do banco de dados e do código, mas eles também podem fazer esse backup por lá e nos
entregar."**

### O que isso muda

1. **Nunca recebemos cPanel nem WordPress.** A única credencial que passou é a do portal de
   faturamento. O §4 do e-mail agora diz isso com precisão — se dissesse "não temos acesso nenhum ao
   painel", o Amit responderia "têm sim" e a conversa voltaria à estaca zero com as USD 300 em cima
   da mesa.
2. **Nós dispensamos o acesso por escrito em 03/08.** O Amit devolvendo a tarefa para a CDNA não é
   incoerência dele. O e-mail retoma o pedido pelo caminho que o próprio suporte deles definiu, e com
   a CDNA em cópia, que é o que valida o pedido.
3. **Aquela senha precisa ser trocada.** É fraca, circulou em texto puro por e-mail desde outubro de
   2025, chegou a pelo menos duas caixas e um fornecedor, e a conta controla domínio e hospedagem.
   Vai junto com as travas na conversa de segurança do domínio (§2.7 da análise).
4. **O portal responde a data da hospedagem** — e respondeu. Ver a seção seguinte: 30/09/2026, com o
   serviço já cancelado.

### E quem gerencia o conteúdo do WordPress, então?

> Fonte: `docs/WhatsApp Ptt 2026-07-29 at 13.33.22.txt` (áudio do Guilherme, 29/07).

Uma pessoa em Dubai — *"a menina que tá me ajudando, lá de Dubai"* — e **ela não é a dona do
acesso**. O Guilherme é explícito sobre por que ela hesitou: *"tava um pouco relutante pra passar o
password, porque é o password do admin que faz todo o nosso serviço, e era o password dele mesmo."*
A senha é de um terceiro, homem, de fora da CDNA. O arranjo proposto na época era que **ela** subisse
o conteúdo novo quando o site ficasse pronto.

Três leituras:

- **Não é a Axon.** A Axon hospeda e dá suporte — limpou o malware sem cobrar (§2.6 da análise). O
  conteúdo tem outro dono.
- **Não é ninguém da CDNA.** O acesso vive fora do organograma, atrás de uma intermediária. Por isso
  não adianta perguntar internamente: já foi perguntado, e a resposta foi essa.
- **O reset resolve sem depender dessa pessoa.** A Axon é a hospedagem: reseta a senha do WordPress
  independentemente de quem a usa. É o motivo de o §4 do e-mail ir por esse caminho.

Sinal secundário, com ressalva: na página de advisors que raspamos (`advisors.txt`), as mídias
referenciadas param em **2024** — nada de 2025 ou 2026. É uma página só, então não prova nada sobre o
site inteiro, mas combina com a hipótese de conteúdo parado. O stack também é antigo: WordPress
7.0.1, tema `hello-elementor`, Elementor Pro e mais seis plugins de terceiros.

## O que o portal de faturamento mostra — verificado em 31/08

> Evidência: `docs/painel-axon/painel finance.png` e `docs/painel-axon/painel services axon.png`.
> Login `finance@corporatednaconsulting.com` em `billing.axonserver.com`.

**Não existe botão de cPanel porque não existe serviço ativo.** O dashboard marca **0 SERVICES**,
e a lista de produtos tem três linhas, todas mortas:

| Produto | Valor | Next Due Date | Status |
|---|---|---|---|
| Bitdefender License for CDNA | S$ 720,00/ano | 01/03/2025 | **Terminated** |
| Corporate Web Hosting Package Axon-P300 — `corporatednaconsulting.com` | S$ 550,00/ano | 10/10/2022 | **Terminated** |
| Corporate Web Hosting Package Axon-P500 | S$ 550,00/ano | **30/09/2026** | **Cancelled** |

### Quatro coisas que saem daí

**1. A data da hospedagem está confirmada: 30/09/2026. São 30 dias.**

Vale entender por que não sabíamos antes. O Rico **mandou** datas em 19/08, mas rotuladas por ele
mesmo: *"For reference, **the previous renewal records** provided are"* — domínio #9170, S$ 22, due
**22 October 2025**; hospedagem #9143, S$ 550, due **30 September 2025**. Ambas de **2025**, o ciclo
anterior. A data corrente nunca foi informada, e por isso o §2.2 da análise tratava 30/09 como
inferência.

O painel fecha: **30/09/2026**, mesmo dia e mês, um ano depois. A inferência estava certa.

> Por isso o §3 do e-mail **não pergunta mais a data** — perguntar de novo seria ignorar o que ele já
> mandou. Pergunta só o que ninguém respondeu: o que o status `Cancelled` significa na prática.
> Verificado também que o site continua no ar hoje (31/08), o que confirma o presente, não o futuro.

**2. A hospedagem já está cancelada.** `Cancelled` com vencimento futuro é o padrão de "cancelar ao
fim do período pago": o serviço roda até 30/09 e termina. Ninguém nos comunicou isso. Duas
consequências:

- A recomendação de não renovar os S$ 550 já está executada — só que sem data combinada com a gente.
- **O rollback deixa de contar a partir da virada e passa a contar até 30/09.** O Amit condicionou as
  1–2 semanas a *"provided the current hosting account remains active"*, e a conta termina em 30/09.
  A janela não some — ela encolhe conforme a virada se aproxima dessa data:

  | Virada | Rollback disponível |
  |---|---|
  | 16/09 | 14 dias — as duas semanas cheias |
  | 23/09 | 7 dias |
  | 30/09 em diante | zero |

  **16/09 é a última data que ainda entrega o rollback completo.** Isso vira restrição de
  cronograma de lançamento, não só assunto de fornecedor.

**3. O backup tem prazo real.** Quando o servidor for desligado em 30/09, o WordPress e as mídias vão
junto. Não dá para tirar por conta própria — não há painel para acessar. Ou a Axon reseta as
credenciais, ou a Axon entrega o backup. **Antes de 30/09.**

**4. Tem uma fatura de S$ 22 em aberto, e é a do domínio.** O painel avisa: *"You have 1 domain(s)
expiring within the next 45 days"*. Bate com o vencimento de **13/10** confirmado por RDAP.

> **Decidido em 31/08: não levantar.** A fatura está na conta da própria CDNA, endereçada ao
> `finance@`, e a Axon emite aviso de renovação — eles já sabem. Ficou de fora tanto do e-mail à Axon
> quanto da mensagem ao Guilherme. Registrado aqui só para não ser "descoberto" de novo.
>
> A única coisa que poderia furar essa premissa é o aviso de renovação seguir o contato do
> registrador — que é a caixa morta da Allison (§2.4). Se o domínio chegar perto de 13/10 sem sinal
> de renovação, aí sim vale perguntar.

### Dois dados que o painel entregou de brinde

**O endereço postal registrado**, que o e-mail dizia "unchanged" sem saber qual era:

```
Corporate DNA Consulting
Rhea Leckie
Sheik Rashid Tower
Dubai, Dubai WTC
United Arab Emirates
```

Bate com o escritório de Dubai que aparece no site antigo (*Sheikh Rashid Tower, 4th Floor, Dubai
World Trade Centre*). Já entrou na carta timbrada.

**E a Rhea é a titular da conta** — o que confirma, por evidência e não por suposição, a escolha de
mantê-la como contato de registro no §1 do e-mail e na carta.

> **Ressalva.** Isto é o que a conta do `finance@` enxerga. É possível que o servidor que hoje serve
> o site esteja sob outra conta da Axon, fora da visão da CDNA. O e-mail pergunta em vez de afirmar.

## As USD 300 — o problema não é o preço, é o pacote

O Amit oferece **3 horas de crédito a USD 100/h**. USD 100/h é tarifa normal de provedor de TI
gerenciado em Singapura — não é abuso. O que não fecha é o resto.

**São seis itens, e só um interessa:**

| Item do pacote | Precisamos? |
|---|---|
| Backup dos arquivos e do banco | **sim** |
| Subir o backup no Dropbox | tanto faz — qualquer link serve |
| Ficar de sobreaviso até a data da virada | não |
| Trocar os registros A e www | não — fazemos nós, no Cloudflare que já é nosso |
| Confirmar que o DNS foi atualizado | não |
| Assistência de SSL e proxy no Cloudflare | não |

Cinco dos seis são dispensáveis. E o próprio e-mail dele se contradiz: *"we can schedule **two
hours** under our Credit Maintenance service at USD 100 per hour. Please visit axon.com.sg and
purchase **three credit hours** (USD 300)"*. Cotou duas, cobrou três.

O backup sozinho é perto de **uma hora** de atenção — o tempo de transferência de vários GB é espera,
não trabalho.

### A ordem certa, e ela não começa negociando preço

1. **Reset das credenciais de cPanel/WordPress** → fazemos o backup nós mesmos, custo zero. É o que o
   §4 do e-mail pede, pelo caminho que o suporte deles mesmo definiu em 28/07.
2. **Cobrar o que o Rico já prometeu.** Em 31/08, por escrito: *"We will also arrange the requested
   full backup before the old hosting is retired."* Sem menção a custo. É por isso que o §4 aponta a
   divergência entre os dois — não é para constranger ninguém, é para preservar esse compromisso.
3. **Só se os dois falharem**, discutir valor — e aí o argumento é escopo, não desconto: backup
   isolado é uma hora, não três, e as duas horas cotadas não batem com as três cobradas.

**Não antecipar o passo 3.** Negociar o preço agora enfraquece os passos 1 e 2 — sinaliza que a gente
aceita pagar por algo que ainda estamos sustentando que não deveria ser cobrado.

> **Ressalva ao "é só clicar num botão".** Em plano compartilhado o *Full Account Backup* costuma vir
> desabilitado, e o caminho vira File Manager + phpMyAdmin. Também não confirmamos que o painel é
> cPanel — foi o que **nós** pedimos em 28/07, e eles nunca confirmaram o tipo. Ou seja: talvez seja
> um pouco mais que um clique. Continua sendo muito menos que três horas.

---

## Entregáveis que caem no colo do Guilherme

1. **A carta em papel timbrado**, assinada pela Rhea (owner/authorised representative). Rascunho
   pronto em `docs/carta-axon-contato-dominio.ENVIAR.txt` — é só colar no timbrado, preencher e
   assinar. Sem custo pela Axon.
2. **Cargo dele e do Nitin** + **um telefone com DDI** — entram na carta. Sugestão mantida: linha
   principal do escritório, não celular de pessoa.
3. **Qual endereço da CDNA deve receber o convite do Google Analytics.**
4. **Trocar a senha do `billing.axonserver.com`** — não trava nada agora, mas não pode ficar como
   está. Ver a seção do histórico de acesso, acima.

> O item "quem tem as credenciais do painel de hospedagem" **saiu desta lista**: a thread `Access`
> respondeu. Ninguém do nosso lado tem cPanel ou WordPress, e o pedido já está feito no §4 do e-mail,
> pelo caminho que o suporte da Axon definiu em 28/07.

## Envio

**Responder a todos na mensagem do Amit** e **recolocar `rico.m@axon.com.sg` na cópia** — o Amit
tinha removido ele, e o e-mail trata justamente de alinhar os dois. Acrescentar também
`nitin.goil@corporatednaconsulting.com`, indicado como contato do domínio e ainda fora da thread.

O `spencer@axon.com.sg`, que o Amit também removeu, **fica de fora** — decidido em 31/08.

---

## 🇬🇧 E-mail — Reply All na mensagem do Amit, com o Rico de volta na cópia

> Versão enxugada em 31/08 a pedido: mesmos sete assuntos, cerca de um terço menos texto. O §7
> antigo (as USD 300) foi absorvido pelo fecho do §6.

**Subject:** Re: corporatednaconsulting.com — domain, and how the cutover will run

Dear Amit and Rico,

Thank you both. I have put Rico back on copy — your replies crossed, so this answers both.

**1. Administrative contact**

Understood on the letterhead request, and thank you for confirming there is no charge. Corporate DNA
will send the signed letter. Three things first, so that we get it right the first time: do you have
a template or required wording we should follow, which address should the letter go to, and is a
scanned PDF sufficient or do you need an original? We would rather ask now than have it returned once
it has been signed.

The people to record:

- Rhea Leckie — Founder & CEO — rhea.l@corporatednaconsulting.com
- Guilherme Mendes — CEO Corporate DNA Americas — gm@corporatednaconsulting.com
- Nitin Goil — **[role]** — nitin.goil@corporatednaconsulting.com
- Jon-Paul Pritchard — Senior Facilitator — jp.pritchard@corporatednaconsulting.com

Please use `rhea.l@` — earlier correspondence went to an older address of hers. And Allison Vickery
has left the company, so please remove her mailbox from all domain correspondence.

If the record accepts only one administrative contact, use Rhea Leckie — she is already the
registered contact, so only the email address changes — and add the other three to your notification
list. The postal address is unchanged, and the telephone number will be in the letter.

**2. The cutover**

Agreed, and we will make the change ourselves, so no assistance is needed. We will still follow
Rico's sequence: exact record values, date, time and timezone sent to you beforehand; only the apex A
record and the `www` record touched; MX, SPF, DKIM and DMARC untouched, so Microsoft 365 mail is
unaffected; validation on the live domain, then confirmation in this thread.

One clarification on Under Attack mode: it stays on through the change and validation, but has to
come off at go-live, as it challenges every visitor and blocks search engines. If you test the domain
today you will see `/sitemap.xml` return 403 and a Cloudflare-managed `robots.txt` — both are Under
Attack, not the new site. We will tell you when we disable it.

**3. The hosting, and the rollback window**

Amit, you offered one to two weeks of rollback provided the current hosting account remains active.
The renewal records Rico sent on 19 August were from the previous cycle, so we checked Corporate DNA's
account at `billing.axonserver.com` for the current ones. It shows **no active services**. The three
entries are a Bitdefender licence and an Axon-P300 package, both Terminated, and a **Corporate Web
Hosting Package Axon-P500, next due 30 September 2026, marked Cancelled**.

Could you confirm:

- The website is still serving normally today. What the portal does not tell us is what the Cancelled
  status means in practice: does the server keep running until 30 September, or can it be suspended
  before then?
- If the launch lands near or past 30 September, is a short extension possible instead of a full
  renewal term, and at what cost?

> **Enxugado em 31/08.** Saíram dois bullets: *"quem pediu o cancelamento e quando"* e a aritmética da
> janela de rollback (16/09 → 14 dias, 23/09 → 7). A conta continua valendo e está registrada acima —
> só não vai perguntada. Se eles responderem que o servidor roda até 30/09, a gente faz a conta
> sozinho; e o "quem cancelou" a CDNA descobre internamente, sem precisar cobrar do fornecedor.

If the live server sits under a different Axon account that Corporate DNA cannot see, please say so.

> ### ⏸ O bloco do backup saiu desta rodada — decidido em 31/08
>
> O §4 pedia o reset das credenciais de cPanel/WordPress e corrigia a afirmação do Amit de que a CDNA
> consegue baixar o backup sozinha. **Foi retirado para ser tratado com calma**, junto com a decisão
> sobre as USD 300.
>
> **O que fica pendente com data:** o servidor é desligado em **30/09**, e com ele o WordPress e as
> mídias. O caminho gratuito continua sendo o reset via `support@axon.com.sg`, pedido pelo cliente —
> o argumento inteiro está na seção *"O histórico do acesso ao WordPress"*, acima, e pode ser
> reaproveitado literalmente quando o assunto voltar.
>
> Para não deixar a pergunta do Amit sem resposta nenhuma, o fecho do e-mail passou a dizer *"On the
> backup and the maintenance credit, we will come back to you separately"* — segura o assunto sem
> aceitar a premissa dele.

**4. Analytics and Search Console**

Thank you for raising this. You are right that `UA-96902425-1` cannot be converted and its history
does not migrate. We have accepted the invitation and can see the property —
`corporatednaconsulting.com - GA4`, under the same account — so we have what we need to install and
validate the tag before launch. Two things still outstanding:
- Google Search Console. There is a Google verification record in the DNS zone, so a property clearly
  exists somewhere. Could you grant access to it, and tell us who else currently holds access? It
  carries the search history and the ownership verification, and matters more than GA for the organic
  value you mention.

> **Contexto que não vai no e-mail.** O Search Console é produto separado do GA4, com permissões
> próprias — acesso a um não dá nada no outro. Mas a dependência da Axon aqui é baixa: o registro de
> verificação está na zona do **Cloudflare, nossa desde 13/08**, então dá para criar uma *Domain
> property* e verificar por TXT sozinhos. E, ao contrário do GA4, o Search Console **preenche o
> histórico retroativamente** — o Google já coleta dados de busca do domínio de qualquer forma e
> libera até 16 meses assim que alguém prova propriedade. Criar a nossa não perde nada.
>
> O valor de eles responderem é **saber quem mais tem acesso** — provavelmente a Allison — e não
> fragmentar a propriedade em duas contas. Se não responderem, seguimos sozinhos.
>
> Verificação rápida enquanto isso: GA4 → Admin → Product links → **Search Console links**. Se houver
> vínculo, ele nomeia a propriedade existente.

### Quem costuma ter o Search Console — e por que perguntamos à Axon mesmo assim

Search Console **não é produto de hospedagem**. O provedor não ganha acesso por padrão, e a maioria
nem toca nisso. O dono típico é quem construiu o site, quem faz SEO, ou o marketing interno.

A Axon é candidata forte por três motivos específicos:

1. **O Amit não age como hospedagem pura.** Vende SEO/AEO/GEO, tem canal no YouTube sobre isso, e a
   checklist dele lista *"Google Search Console verification"* como item — linguagem de quem faz.
2. **Ele mandou o convite do Google Analytics.** Quem tem o GA de um cliente quase sempre tem o
   Search Console; andam juntos.
3. **O registro de verificação está no DNS**, e só quem controla DNS adiciona um TXT desses. Até
   13/08 quem controlava era a Axon. Ou eles adicionaram, ou adicionaram a pedido — passou pela mão
   deles de qualquer forma.

> **Precisão sobre o registro.** Um `google-site-verification` serve para vários produtos —
> Workspace, Ads, Merchant Center — todos com o mesmo formato. Ele prova que **alguém verificou o
> domínio com o Google**, não necessariamente no Search Console. Search Console é o mais provável.
> Se o Amit responder que o TXT é de outra coisa, também é resposta útil.

**O outro candidato é a Allison** — mesmo padrão do item 7 da análise. Por isso a mensagem ao
Guilherme pergunta em paralelo se alguém da CDNA já acessou. Se alguém internamente tiver, resolve na
hora e não depende da Axon.
- A separate invitation for Corporate DNA — we will confirm the address shortly.

Related: what other accounts were held under `allison.vickery@corporatednaconsulting.com`? She has
left the company, and Corporate DNA needs to recover whatever is still tied to that mailbox.

**5. The pre-launch checklist**

Your point about protecting the existing organic visibility is how the site was built. Already in
place: 301 redirects for every changing URL — 52 of them, mapped from the current site; titles, meta
descriptions and heading structure; canonical and social metadata; JSON-LD; `sitemap.xml` and
`robots.txt` served by the application; `llms.txt`; and image, speed and mobile optimisation. The one
open item is GA4, waiting on the Measurement ID above.

Thank you for the offer of SEO, AEO and GEO work — that is covered on our side, as are the DNS change
and the Cloudflare settings. On the backup and the maintenance credit, we will come back to you
separately.

Best regards,
Ricardo

---

---

## 🇧🇷 Mensagem para o Guilherme

Fala, Guilherme, tudo certo?

A Axon respondeu duas vezes o mesmo e-mail — o Rico ontem, o Amit hoje de manhã — e as duas respostas
não batem em três pontos. Já respondi aos dois pedindo que alinhem, e recoloquei o Rico na cópia,
porque o Amit tinha tirado ele.

O que muda para vocês:

**1. O contato do domínio agora exige carta em papel timbrado**, assinada por você ou pela Rhea como
representante autorizada. Não é cobrado. Deixei a carta pronta em anexo — é colar no timbrado de
vocês, preencher três campos e assinar.

Para fechar a carta falta só **um telefone com DDI**. Sugiro a **linha principal do escritório**, não
o celular de ninguém — é o mesmo motivo de estarmos trocando o contato agora: número de pessoa morre
quando a pessoa sai.

Os cargos eu já preenchi, só confere se estão certos: Rhea como Founder & CEO, você como CEO
Corporate DNA Americas, Nitin como Regional Director e JP como Senior Facilitator.

**Não corre para assinar ainda.** Perguntei à Axon se eles têm um modelo próprio de carta. Se
tiverem, eu ajusto antes — melhor esperar dois dias do que fazer a Rhea assinar duas vezes.

Sobre o cadastro: registrador normalmente tem só **um** campo de contato administrativo, e os outros
entram como cópia. Pedi para deixarem a **Rhea** nesse campo — ela já é a contato registrada, então
só o e-mail dela muda, porque o que eles tinham estava errado — e vocês três recebendo tudo junto. Se
preferir você nesse lugar, me avisa que eu troco na carta.

**2. Sobre o acesso ao WordPress, fui atrás do histórico e já está resolvido do nosso lado.** Em
julho tu me mandaste o login do `billing.axonserver.com`, na conta do `finance@` — mas aquilo é o
portal de faturamento da Axon, não o WordPress. Na época o suporte deles avisou que o reset das
senhas de cPanel e WordPress só sai se **o cliente** pedir por e-mail ao `support@axon.com.sg`.
Ficou um texto pronto para você mandar e, pelo que consigo ver, ele nunca saiu. Já pedi agora, no
e-mail para eles, com vocês em cópia — é a cópia que valida o pedido.

Duas coisas que saem disso:

- **Aquela senha precisa ser trocada.** É fraca, circulou em texto puro por e-mail desde 2025, e a
  conta controla domínio e hospedagem. Entra na conversa de segurança do domínio que eu ainda quero
  ter contigo.
- **A data de vencimento da hospedagem provavelmente está nesse portal.** Se quiser, eu entro e
  confirmo, sem depender da resposta deles.

E um aviso antes de eles executarem: **o reset vai derrubar o acesso de quem mexe no site hoje.**
Pelo que tu me contou em julho, o conteúdo é atualizado pela pessoa de Dubai, usando a senha de um
terceiro — o tal "admin que faz todo o nosso serviço". Quando a Axon resetar, aquela senha para de
funcionar. Não é problema para nós, porque o site antigo vai ser desligado de qualquer forma e o
conteúdo novo é no nosso CMS. Mas se alguém ainda depende daquele acesso para alguma coisa, melhor
avisar antes do que descobrir depois.

**3. Apareceu uma conta de Google Analytics da CDNA, e já entrei.** Existe uma propriedade GA4 do
`corporatednaconsulting.com`, na mesma conta da antiga — então não precisamos criar nada, é só
instalar a tag dela no site novo e o histórico continua de onde parou.

E tem histórico de verdade lá: cerca de **5 mil visitas só em 2025**, com 2026 seguindo. Isso vira
base de comparação para medir o efeito do site novo, então vou instalar a tag dessa mesma
propriedade — se criássemos uma nova, a série começaria do zero e a comparação se perderia.

Uma coisa para não se assustar se o Amit insistir: ele escreveu que vocês "perderiam todo o histórico
de analytics". Esse dado está na conta do Google, não no servidor dele. Desligar a hospedagem em
30/09 não apaga nada.

Pedi também o **Search Console**, que é o que realmente guarda o histórico de busca e a verificação de
propriedade, e perguntei o que mais estava na conta da Allison — provavelmente tem mais coisa lá.
**Me diz qual e-mail da CDNA deve receber esses acessos** que eu peço para eles mandarem.

**4. Entrei no painel da Axon e a hospedagem já está cancelada.** O pacote Axon-P500, de S$ 550/ano,
aparece com vencimento em
**30/09/2026** e status *Cancelled* — a conta não tem nenhum serviço ativo. A boa notícia é que a
recomendação de não renovar já está executada, e ninguém vai pagar S$ 550 por um servidor que não
serve mais nada. A ruim é que ninguém nos avisou, e isso mexe no cronograma.

**O que muda:** o Amit ofereceu 1–2 semanas de rollback "enquanto a hospedagem estiver ativa". Como
ela termina em 30/09, o prazo não conta a partir da virada — ele conta **até 30/09**:

| Virada | Rollback disponível |
|---|---|
| 16/09 | 14 dias — as duas semanas cheias |
| 23/09 | 7 dias |
| 30/09 em diante | zero, e o site antigo já era |

Ou seja, **16/09 é a última data que ainda dá o rollback completo**. Não é impedimento para lançar
depois — é só decidir de olho aberto, porque virar em outubro significa virar sem rede. Se fizer
sentido, dá para pedir uma extensão curta da hospedagem em vez de renovar o ano inteiro; já perguntei
o preço a eles.

**E o backup do site antigo tem 30 dias para acontecer.** Quando o servidor for desligado, o
WordPress e as mídias vão junto. Já cobrei no e-mail, com essa data explícita.

Você sabe quem pediu esse cancelamento? Perguntei a eles também.

Abraço,
Ricardo
