# Para o e-mail novo ao Guilherme — apurado em 01/09

Notas de trabalho, não texto para enviar. O `pedido-conteudo-guilherme-30-08-2026.md` continua
válido no conteúdo, mas a abertura dele está desatualizada: foi escrito antes da leva de design do
Guli de 31/08 e antes do deploy do CMS de hoje. O e-mail novo substitui aquele.

Tudo abaixo marcado **[verificado]** foi conferido no ar hoje, não lido de tracker.

---

## Decisões já tomadas

**Item 11 — Frameworks & Diagnostics: perguntar, não prometer cadastro.**
A pergunta é *"há mais algum framework ou diagnóstico além do 5H e do DNA 360 Profiler?"* — e **não**
"vocês podem cadastrar depois", que era a formulação anterior e é falsa.

Motivo: o bloco `#ip-diagnostics` em `/approach` é **JSX escrito à mão**; a página não faz nenhuma
chamada ao CMS, e não existe tipo `framework` entre os 13 do CMS. Se ele responder "temos mais
dois", isso é trabalho de dev, não cadastro. Provável que a resposta seja "não tem mais": o item 11
dele é instrução de contenção ("não inventem nomes"), e ele não nomeou nenhum candidato.

Se vier "sim, e vão mudar com o tempo", aí sim vale discutir criar o tipo no CMS — mas com a
informação na mão, não antes.

**Ainda pendente no mesmo bloco:** a descrição do DNA 360 Profiler é texto nosso e está no ar com o
selo *"Overview pending CDNA confirmation"* visível. Como o item 11 proíbe inventar claims, esse
parágrafo precisa vir deles ou ser aprovado.

---

## Achados de hoje que ele ainda não sabe

**As três páginas legais estão vazias.** [verificado] `/privacy` e `/cookies` têm 23 caracteres de
conteúdo, `/terms` tem 17 — é o título repetido, sem nenhum `h2`. **Não estão em nenhum dos 19
itens**: vieram do checklist de 24/07 e nunca foram cobradas. São o único bloqueio de produção por
motivo jurídico, e ele não sabe que existem.

**A seção Awards está vazia.** [verificado] `/awards` tem 110 caracteres. Isso importa porque a
proposta do ticker (prêmios anteriores a 2023 migram para Awards) depende dessa seção ser
preenchida — não é mudar de lugar, é cadastrar pela primeira vez.

**Os cases estão pela metade.** [verificado no case da Heineken] A faixa de cinco fatos que o item 7
exige tem Countries, Leaders e Impact preenchidos; **Participants, Reach/Scale e Intervention não**.
E a página não tem **nenhuma quote** — nem das erradas. O item 7 pede depoimentos sobre a
CorporateDNA no padrão John Murphy / Jorge Gardino.

**Our Identity mostra os avisos de pendência ao vivo.** [verificado] Oito blocos, e o visitante lê
"Purpose statement to be provided by CDNA", "Our Story copy to be provided by CDNA", "Values copy to
be provided by CDNA". Honesto para revisão, impossível para produção.

**Solutions: faltam duas das oito e sobram três.** [verificado] Publicadas: CHRO/HRLT Effectiveness,
Talent & Succession, CEO & Top Team Transformation, Leadership & Culture Transformation, Talent
Development, Women in Leadership, High-Performing Teams & Manager Impact, Executive Coaching,
Leadership Development — nove. **Faltam ExCo / Top 150 e Manager Development.** Sobram Talent &
Succession, CEO & Top Team Transformation e Leadership Development, que não estão na lista oficial
do item 5 e ele também não mandou tirar.

⚠️ E "Talent Development" está na URL `/solutions/asian-talent-development` — o registro antigo foi
renomeado em vez de recriado. O item 5 manda retirar Asian Talent Development; o conteúdo foi
incorporado, como a linha seguinte do e-mail permite, mas o endereço ficou com o nome errado e é o
que o Google indexa. Corrigir o slug com redirect.

**O ticker está no ar com dois itens.** Recuperados da faixa antiga e cadastrados hoje: os dois GOLD
da Brandon Hall (2023 e 2024). Cinco caem pelo corte de 2023 que é dele. Faltam as datas de
"Harvard Business Impact" e "Opens new Office in Saudi Arabia", e o destino dos links dos dois — os
posts antigos do WordPress não existem no site novo. Detalhe completo já está no
`pedido-conteudo-guilherme-30-08-2026.md`, seção HOME.

---

## O que mudou de estado hoje, e muda o que o e-mail pode afirmar

**O CMS ganhou os três tipos do brief.** Migração `0007` rodada no Supabase e deploy feito. Agora
**Partnerships, Ticker e Testimonial videos aparecem no admin** — até hoje de manhã não apareciam, e
o e-mail de 30/08 dizia que estavam "prontos esperando conteúdo", o que era falso. Agora é verdade.

**O formulário de Solution:** confirmar se ganhou os cinco blocos do item 5 (The Challenge → The
Outcome → How CorporateDNA Helps → Evidence → Start a Conversation). O deploy incluiu os campos;
falta olhar no admin.

**A leva de design do Guli de 31/08 está no ar:** Client Impact vermelho, escritórios quase preto,
fotos em `cover`, varredura diagonal dos black boxes, hover dos seis termos, e a pausa no hover do
explorer removida.

---

## Pendência antiga que nunca teve resposta

A lista de aprovação de **06/08**: 95% × 90%, 26 × 36 countries, "over ten years" × 18 years, e o
copyright de 2021 em `app/approach/page.tsx`. Enquanto não fecha, o site mostra as duas versões em
páginas diferentes.

---

## Ordem sugerida para o e-mail

1. **Respostas curtas que destravam blocos inteiros:** as três dúvidas de Our Impact, o sign-off das
   25 dimensões, o item 11, e as duas datas do ticker.
2. **Our Identity**, que é o maior volume de escrita e precisa do maior prazo.
3. **As três páginas legais**, em destaque separado — não estão nos 19 itens e ele não sabe que
   existem.
4. **Assets de time e vídeos**, que não bloqueiam o dia 1º.
