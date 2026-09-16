# Rascunho de resposta ao Guilherme — brief 27-08

> Rascunho para revisão antes de enviar. Em anexo vai o tracker atualizado em inglês
> (`Corporate DNA — Consolidated Implementation Status Update - 27_08.md`), no mesmo formato do
> 10-08, para o Guilherme encaminhar à CDNA.
>
> **Escopo do e-mail:** as tarefas item a item, com os labels que ele pediu no item 19, vão no
> tracker. Aqui só o que precisa de decisão dele — principalmente o que "launch no dia 1º"
> significa.
>
> **Formato:** o corpo abaixo é texto puro, para colar direto no Gmail sem markdown. As tabelas
> ficam só no tracker, que vai em PDF.

---

**Assunto:** Brief 27-08 — recebido, e uma pergunta sobre o dia 1º

Fala, Guilherme, tudo certo?

Dei uma analisada nos pedidos e já estamos executando. O tracker em anexo tem tudo item a item, nos buckets que você pediu. Aqui vou direto no que precisa de decisão.

Já vou responder sobre o outro e-mail que mandou aqui pra facilitar.

Sobre os ajustes que você mandou ontem: separamos o que é estrutura de conteúdo (não depende de tela, fizemos agora) do que é layout (fica com o Guli, para ele propor e aprovar com vocês antes de irmos ao site).

A parte de estrutura já está andando: as oito Solutions já estão cadastradas no CMS com os cinco blocos e o campo de flagship case, prontas para receber o conteúdo. Isso sobe em homologação até amanhã, sem depender das telas do Guli. O que vier do design dele entra na mesma homologação até segunda, dia 31.

A navegação também já está na lista de nove itens do item 3. Como Insights e o "Start a Conversation" não aparecem nela, os dois saíram do menu. O "Start a Conversation" segue como bloco de fechamento das Solutions, que é onde o item 5 coloca ele. Já o Insights nós mantivemos no rodapé: é lá que fica a biblioteca editorial e o Reports & Resources — os relatórios e white papers que o item 18 pede pra preservar, e que você mesmo pediu ao JP pra indicar. Sem nenhum link, a área existiria mas ninguém chegaria nela. Se for pra tirar do rodapé também, é só avisar.

Sobre o launch ficou a dúvida, seria finalizar tudo em homologação ou produção? Porque muda bastante o planejamento.

Hoje o corporatednaconsulting.com ainda serve o site antigo — o que vocês vêm revisando é uma URL de staging. Então "launch" pode significar duas coisas, e queríamos confirmar qual.

Se for ir para produção no dia 1º, fica apertado. Não pela troca de domínio, que é rápida: são dois registros de DNS, questão de minutos, e já temos o acesso necessário. O aperto é que sobra praticamente um dia útil para aplicar o que vier de conteúdo e design, testar tudo e vocês revisarem um conjunto grande de mudanças.

Nossa sugestão é tratar a segunda, dia 31, como a homologação completa — a não ser que o pessoal aí esteja disponível pra revisar no fim de semana, mas vou partir do pressuposto que não. Aí vocês navegam com tudo no lugar e mandam os ajustes. Conforme o conteúdo que falta for chegando, a gente vai aplicando; vocês fazem mais uma rodada de revisão; e quando estiver aprovado, liberamos. A publicação em si é rápida — é apertar o botão em algo que vocês já viram.


O QUE AINDA DEPENDE DE VOCÊS

Está detalhado no tracker, mas os que mais seguram são:

1) Conteúdo de três Solutions — ExCo / Top 150, Manager Development e HRLT Effectiveness. Dessas não temos nada, e o item 11 é claro em não inventar.

Das outras cinco o texto já existe: Culture Transformation, Women in Leadership, High Performing Teams, Executive Coaching e o material da Asian Talent Development servindo a Talent Development, tudo copy que vocês já aprovaram no ciclo anterior. Como o item 5 pede encurtar radicalmente as páginas, o conteúdo está lá, só no formato errado. Aí queria perguntar como vocês preferem: a gente faz a versão curta a partir do que já está aprovado e deixa no CMS para vocês revisarem, ou vocês preferem mandar os textos encurtados e a gente só coloca? Fazemos dos dois jeitos. O primeiro é mais rápido e reduz o que vocês precisam escrever a três Solutions, mas significa a gente mexer em texto que a Rhea assinou — encurtar é decisão editorial, mesmo sem claim novo. Nada é publicado sem a revisão de vocês em qualquer um dos casos.

2) Aprovação de nomes, logos, quotes e métricas de cliente, seguindo a regra do brief.

3) Assets do time e o texto das Partnerships.

4) Flagship cases: além dos dois TBC do item 6, o Frasers Property e o adidas ainda não existem como case no CMS. Então hoje são quatro das oito Solutions sem flagship — vale saber se esses dois virão. Mas nada impede de deixar eles como estão e colocar depois.

Sobre os conteúdos, pode nos mandar conforme forem saindo. Cada item que chega a gente já coloca no CMS na hora.

Sobre os outros e-mails da Axon. Olhei os dois e-mails. Resumo: quase nada precisa ser feito. O cutover não depende deles — o acesso ao Cloudflare já é nosso desde 13/08, e o próprio Amit escreveu "now that you have full control". O domínio fica onde está, e o EPP não é mais necessário.

Deixei o e-mail em inglês pronto lá embaixo, endereçado ao Rico e ao Amit com a CDNA em cópia. É só mandar.

A única coisa que peço a eles é a troca do contato administrativo do domínio. Ainda é a allison.vickery@, e a Carol já está redirecionando a caixa dela e trocando logins — então é entrar na mesma lista. Só a Axon consegue fazer a alteração no registrador, por isso pergunto a eles o que precisam para executar. Mas o nome de quem assume tem que sair de vocês.

O QUE PRECISO DE VOCÊS NESSA PARTE

- Quem assume o contato administrativo do domínio no lugar da Allison.

- Um backup do WordPress atual, que já pedi à Axon. Como nunca tivemos acesso ao provedor antigo, é bom garantir que alguém guarde isso. Não é para a gente usar — o site novo não aproveita nada de lá. É para a CDNA não perder o conteúdo e as mídias antigas quando o servidor for desligado.

Abraço,
Ricardo

-----------------------------------------------

E-mail pronto pra Axon, deixando claro que o domínio fica lá e só a hospedagem sai:

Subject: corporatednaconsulting.com — domain, and how the cutover will run

Dear Rico and Amit,

Thank you for the reminder, and for arranging the Cloudflare access.

To answer your question directly: of the three options you offered, it is the middle one — the domain stays registered with Axon, and only the website moves. There is no transfer to arrange and we do not need the EPP code, so please treat any auth code already issued as no longer required.

One thing we would ask you to update: the domain's administrative contact. Amit referenced allison.vickery@corporatednaconsulting.com on 13 August; she has since left CDNA, so that mailbox is no longer monitored and should not be receiving domain correspondence. CDNA will confirm the replacement contact — could you let us know what you need in order to make the change?

On the cutover, Amit, this follows the sequence you asked for: we change the A/CNAME records in Cloudflare, keeping "Under Attack" mode enabled until that is done; we validate the new site on the live domain; and then we write to you to confirm it is safe to disconnect. Please keep the WordPress site running for a week or two after the records change, as a rollback path.

One request alongside that: a full backup of the current WordPress site. Not for the migration — the new site is built independently and takes nothing from it — but so CDNA keeps the old content and media once the server is eventually retired.

On lead times, your point about planning ahead is well taken. In this case the usual risks do not apply: email runs on Microsoft 365 rather than the hosting server, so the A/CNAME change does not touch mail delivery; there is nothing to export, as the new site is already built on its own platform; and DNS is already under our control thanks to your access.

We will let you know before making any change.

Best regards,
Ricardo