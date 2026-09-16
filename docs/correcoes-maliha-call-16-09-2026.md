# Daily de 16/09/2026 — o que ela pediu, o que ela deve, o que é nosso

**Fonte:** `docs/meetings/metting-daily-maliha-16-09.txt` (transcrição Fathom, 25min).
**Participantes:** Maliha (cliente), Ricardo e Roberto. O Guli faltou.
**Branch:** `feat/ajustes-clients-services` — âncoras de código conferidas em 16/09.
**Formato:** checklist de execução, no mesmo formato de `docs/correcoes-maliha-call-14-09-2026.md`.

> A call foi uma passagem página a página no alpha. Ela abriu dizendo que viu as mudanças de
> 15-09 no grupo, e o tom mudou em relação a 14-09: quase tudo agora é **imagem que falta** e
> **layout de página nova**, não correção de coisa errada.

⚠️ **Compromisso assumido na call, em letra:** *"I think today, by the end of the day, we will
have those new pages"* — Clients & Impact e as páginas internas de Services. É a régua do dia.

---

## O veredito, página por página

| Página | O que ela disse |
| --- | --- |
| **About** | *"I'm happy with the About page"*. Falta o sign-off da **Rhea** e uma troca de foto. |
| **Approach** | Em obra pelo Guli. A Rhea **não viu** o redesenho — não está aprovada nem reprovada. |
| **Services (landing)** | *"Very happy"*. Faltam imagens e logos de parceiros, os dois do lado dela. |
| **Services (internas)** | Não revisadas. **Trabalho de hoje.** O texto ela dá por correto; falta layout. |
| **Team** | *"I hate this one"* — seis pedidos, listados abaixo. |
| **Clients & Impact** | A construir. As três referências já estão no drive. **Trabalho de hoje.** |
| **Books** | Repensar. Ela traz a visão do time e o material do segundo livro. |
| **Insights** | *"Coming soon"* até o time decidir. Ela tem uns três artigos. |

---

## 1. Dá para fazer agora

Nada nesta seção depende de asset dela.

### Services — páginas internas (prioridade do dia)
- [x] **Layout contra o template dela**, `4. Services/ExCo Leadership Services Page.png`.
      Entregue em 16-09, nove commits: a ênfase que ela marcou na planilha chega aos dois
      blocos, os blocos encolhem para a densidade do template, a faixa de pilares nova sai da
      frase de "what CDNA does to help" de cada serviço, e a evidência reúne caso, números e
      depoimento numa faixa só.
      → `components/views/SolutionView.tsx`, `components/solutions/*`
      → desenho: `docs/superpowers/specs/2026-09-16-services-inner-page-design.md`
      → plano e verificação: `docs/superpowers/plans/2026-09-16-services-inner-page.md`
      ⏳ **Falta a conferência visual** — telefone e lado a lado com o PNG. As dez páginas foram
      conferidas no HTML pré-renderizado (contagem de pilares, ênfase, variações da evidência),
      mas ninguém olhou a tela ainda.

### ✅ Clients & Impact — landing reconstruída em 16/09
- [x] **`/our-clients` refeita** na ordem da imagem 1 + o bloco *Industries we work in* da
      imagem 2: herói → paredão de logos → by the numbers → industries → breadth by service
      → case studies → what our clients say → a force for good → global footprint → CTA.
      Arquivos novos: `components/clients/{SectionHead,LogoWall,IndustriesGrid,BreadthMatrix,CaseTile}.tsx`
      e `lib/industries.ts`. Captura: `docs/shot-clients-full.png`.

      **Onde não seguimos o mockup, e por quê** — o herói é o `SolutionHero` das outras
      páginas (instrução dela sobre consistência de componentes); os números são os do CMS e
      não os do desenho (nenhum dos dele passou por aprovação e três contradizem o que está
      no ar); os depoimentos são os dos cases, com nome e cargo reais, e não os genéricos do
      mockup; o mapa é o `WorldCoverageMap` e não o do Leaflet, que abria em Covent Garden.

      ⚠️ **Falta imagem em três lugares** — herói (está com o skyline da /about), fundo dos
      oito setores e capa dos quinze cases (`coverMediaId` vazio em todos). Cada um cai num
      campo de cor até ela mandar; nada quebra.

- [ ] ~~**Reconstruir `/our-clients`**~~ seguindo a imagem 1 do drive **mais** o bloco
      *"Industries we work in"* da imagem 2 — *"literally it can be exactly like this"*.
      Ordem da referência: herói → mural de logos → **By the numbers** → **Industries we work
      in** → **Breadth by service** (matriz cliente × serviço) → case studies → depoimentos →
      *A force for good* → footprint global.
      → `app/our-clients/page.tsx` (hoje é da geração antiga: 1000px de caixa, marquee e pouco
      mais)
      → referências: `5. Clients& Impact/ChatGPT Image Sep 15, 2026, 01_33_16 PM.png` e
      `…01_34_00 PM.png`

### ✅ Conteúdo dos cases — cadastrado no CMS em 16/09

Os **nove cases com `Reviewed = Yes`** estão no CMS de produção, publicados:
`bt`, `dp-world`, `dyson`, `frasers-property-leadership`, `frasers-property-hrlt`, `gsk`,
`maaden`, `morgan-stanley`, `vodafone`. Sete foram criados; **GSK** e **Morgan Stanley** já
existiam e foram **mesclados** — o que a planilha traz venceu, o que ela não traz (a citação da
Emma Walmsley, o corpo em `text`) foi preservado.

Como refazer, se ela mandar uma planilha nova:

```
# no repo do site  — lê o xlsx e gera o JSON (documenta o mapa coluna → campo)
python scripts/cases-xlsx-to-json.py

# no repo do CMS — confere o diff antes de gravar
npx tsx scripts/seed-cases-cdna-16-09.ts --dry-run
npx tsx scripts/seed-cases-cdna-16-09.ts
```

⚠️ **Por que o script escreve direto na tabela.** O `caseSchema` do checkout do CMS não
conhece os campos que produção já usa (`countries`, `participants`, `reach`, `impact`,
`challenge`, `approach`, `outcome`) nem os novos da planilha. Como zod descarta chave
desconhecida, passar por `updateEntry` **apagaria** conteúdo publicado do GSK, do Heineken e do
Unilever. O script replica o `publishEntry` (snapshot em `publishedData`, linha em
`content_versions`, `case_study_facets`, auditoria e webhook de revalidação).

**Campos novos gravados**, além dos que o site já lia: `serviceLabel`, `bannerStatement`,
`markets`, `partnershipYears`, `impactFigures[]` (vermelho), `scaleFigures[]` (carvão),
`challengeHeadline`, `approachHeadline`, `outcomeHeadline`, `closingThought`, `services[]`,
`additionalContent`. **Ainda não aparecem em lugar nenhum** — dependem do layout da adidas.

⚠️ **Três pontos que sobraram do cadastro:**
1. **GSK e Morgan Stanley têm `text`** (corpo antigo), e o `CaseView` só renderiza
   challenge/approach/outcome **quando não há `text`**. Ou seja: nesses dois, o conteúdo novo
   está gravado mas invisível até o layout novo. Quando ele existir, o corpo antigo sai do ar —
   decidir se apaga `text` ou se mantém como seção extra.
2. **Vocabulário de filtro misturado.** Os cases antigos (shell, aviva, levis, coca-cola,
   unilever, heineken) têm `facets.service` da geração passada — "Leadership & Culture
   Transformation", "Talent & Succession" — que **não batem com nenhum serviço atual** de
   `lib/services.ts`. Os nove novos usam o rótulo certo. A matriz *Breadth by service* vai sair
   furada enquanto os seis antigos não forem retagueados.
3. **Frasers tem um placeholder da própria cliente**: `[3 or 4]-year: transformation
   partnership`. Foi gravado como veio — ver §3.

### ✅ Clients & Impact — página de case refeita em 16/09
- [x] **`/cases/[slug]` no template da adidas**: herói com logo + eyebrow (setor · período ·
      mercados) + manchete serifada com o ponto vermelho → faixa escura **THE IMPACT** (figuras
      de impacto em vermelho, de escala em carvão, como a planilha manda) → **01 The challenge**
      e **02 What we did** com os chips de serviço → **03 What changed** + foto + **04 Client
      voice** → **05 Related case studies** → CTA.
      Arquivo novo: `components/cases/CaseStory.tsx`. Capturas: `docs/shot-case-gsk.png`.

      **Os dois layouts convivem.** A `CaseView` virou um desvio: os nove cases de 16-09 vão
      para o layout novo, os seis antigos seguem exatamente como estavam. Quando os antigos
      forem reescritos no modelo novo, o desvio sai.

      ⚠️ **No GSK e no Morgan Stanley o corpo antigo (`text`) deixou de aparecer** — vence o
      modelo novo. O conteúdo segue gravado no CMS, sem perda, mas é decisão de conteúdo a
      tomar: apagar aquele corpo ou trazê-lo como seção extra.

      ⚠️ **Relacionados saem por SERVIÇO, não por setor.** O desenho diz *"explore more client
      stories in consumer goods & retail"*, mas `facets.industry` está vazio nos quinze cases —
      a planilha não tem coluna de setor. Quando tiver, é trocar o critério.

- [ ] ~~**Layout do case**~~ conforme `5. Clients& Impact/efa52866-….png` (o da adidas): faixa de
      métricas no topo, **01 The challenge**, **02 What we did** (+ chips dos serviços da CDNA),
      **03 What changed**, **04 Client voice**, **05 Related case studies**.
      → `components/views/CaseView.tsx:53` — o dado já existe: `challenge`, `approach`,
      `outcome`, `measurableResult`, `facts`, `quote`. O que falta é apresentação, a linha de
      meta (setor · período · mercados) e o bloco de relacionados.

### Team
- [ ] **Tirar India.** Quatro regiões: Americas, Europe, GCC, Asia — *"India will be covered
      under Asia"*.
      → `lib/team.ts:299`
      ⚠️ **A About tem as mesmas cinco regiões** (`app/about/page.tsx:483`) e o documento de Team
      manda os dois baterem. Como ela **acabou de aprovar a About**, perguntar antes de mexer lá.
- [ ] **Herói menor e em landscape.** *"make this whole box a bit smaller"*. A imagem certa vem
      do Guli; deixar a caixa pronta para receber landscape.
- [ ] **Reduzir o quadro das Americas** — *"maybe make this one smaller as well, it's very big"*.
- [ ] **LinkedIn de todos no pop-up.** Hoje só a Rhea tem. A estrutura já existe
      (`components/PersonModal.tsx`, socials vindos do CMS); falta o dado — ver §2.

### Verificar antes de mexer
- [ ] **Jen / Genevieve James → Australia.** No código já está `region: "Australia"` com
      `role: "Head of Asia"` (`lib/team.ts:142`), que é exatamente o que ela pediu. Se ela viu
      "Asia", ou é deploy velho ou é o campo `location` do CMS que aparece no pop-up. **Conferir
      no CMS**, não no código.

---

## 2. O que a Maliha (e o time dela) ficou de mandar

### Já entregue — `CaseStudiesv1.xlsx`

- [x] **XLS dos case studies** — ela subiu durante a própria call (*"I'm just uploading it right
      now"*) e o arquivo já está no projeto:
      `docs/meetings/CDNA — Photographs for the new website/5. Clients& Impact/CaseStudiesv1.xlsx`
      (aba única **Service by Client**, cabeçalho na **linha 2**, 25 linhas de cliente × serviço).

**As colunas são o layout da adidas, campo a campo** — não é uma lista de clientes, é a página
inteira desmontada:

| Col | Campo | Onde entra no case |
| --- | --- | --- |
| A | Service (website label) | liga o case ao serviço |
| B | **Reviewed** | o filtro dela: `Yes` = assinado |
| C | Service banner statement | — |
| D | Client | — |
| E · F | Eyebrow: markets and geography · partnership years | linha de meta do topo |
| G · H | **Impact figures (render red)** · **Scale figures (render charcoal)** | faixa de métricas — ela já define a cor |
| I · J | Challenge headline · body | **01 The challenge** |
| K · L | What we did headline · body | **02 What we did** |
| R · M | What changed headline · body | **03 What changed** |
| N | Quote | **04 Client voice** |
| O | Case status | `NEW` / `FINAL` / `HOLD` / `No case record` |
| P · Q | Hero headline · sub-head | herói do case |
| S | Closing thought | fecho |
| T | CDNA services | chips de serviço |
| U · V | Additional content | material extra (só BT, Frasers HRLT, GSK, Ma'aden) |

**Filtrando a coluna B por `Yes` dão nove cases**, e o que falta em cada um:

| # | Cliente | Serviço | Status (O) | Buracos |
| --- | --- | --- | --- | --- |
| 3 | **BT** | Manager Development | NEW | quote, anos de parceria |
| 5 | **DP World** | Manager Development | NEW | herói, headline do "what changed", closing, chips |
| 6 | **Dyson** | Family Business Consulting | NEW | quote |
| 9 | **Frasers Property** | Top 150 Leadership | — | quote, closing |
| 10 | **Frasers Property** | HRLT Effectiveness | NEW | closing |
| 11 | **GSK** | Culture Transformation | NEW | quote, closing |
| 20 | **Ma'aden** | HRLT Effectiveness | NEW | quote, anos, closing |
| 21 | **Morgan Stanley** | Culture Transformation | **HOLD** | quote, closing |
| 26 | **Vodafone** | Talent Development | NEW | quote, closing |

O corpo dos textos veio completo — challenge, what we did, what changed, métricas e eyebrow estão
escritos e longos. **O furo real é a citação: falta em sete dos nove**, o que bate com o que ela
disse na call (*"Rhea's away this week (…) trying to get her to close down the case studies"*).
Só **DP World** e **Frasers HRLT** têm quote.

⚠️ **Três coisas para conferir com ela antes de publicar:**
1. **Morgan Stanley está `Reviewed = Yes` mas `status = HOLD`.** As duas colunas se contradizem.
2. **O mockup que ela mandou é o da adidas, e adidas está `No` + `HOLD`.** O layout é referência;
   o conteúdo da adidas **não** está liberado.
3. **Aviva e Shell estão `status = FINAL` mas `Reviewed = No`.** Se `FINAL` vale mais que a coluna
   B, entram mais cases. Pela instrução dela ("filter column B under yes"), ficam de fora.

⚠️ **Sete dos nove não existem como conteúdo hoje.** O backup do CMS de 01-09
(`docs/backup-cms-cases-2026-09-01.json`) tem 13 cases, e os slugs são shell, aviva, levis,
coca-cola, unilever, heineken, gsk, morgan-stanley (+ duplicatas e um `test`). **BT, DP World,
Dyson, Frasers ×2, Ma'aden e Vodafone não estão lá** — e os que estão são, em boa parte,
justamente os `No` da planilha. Conferir no CMS ao vivo (o backup é de 01-09) e contar a
criação desses sete no trabalho do dia.

### Hoje
- [ ] **As células em branco do DP World** — hero headline (P), hero sub-head (Q), what
      changed headline (R), closing thought (S) e CDNA services (T). É o único dos nove
      cujo herói abre sem manchete própria; a página cai na manchete do challenge.
- [x] ✅ **Foto do time em pé, Rhea no meio** — chegou. Está em `public/team/team-standing.jpg`
      e substituiu a foto da seção **One team** da `/team`. Como é paisagem (1600×1066) e a
      anterior era retrato, a composição voltou à do mockup dela: foto larga, texto estreito.
- [ ] **Foto nova da About** — subindo na pasta *Images*, recém-criada. Motivo: no corte
      esticado *"some of their faces look a bit distorted"*.

### Sem data
- [ ] **Logos dos parceiros novos** que a Rhea quer incluir (ela está coletando).
- [ ] **Imagens da landing de Services** e das páginas internas — *"that's my job"*.
- [ ] **Fotos individuais do time**: a Rhea reprovou as de **Mike** e **Jen**. A Maliha também
      vai testar **preto e branco** em todas, para consistência, e mostrar antes.
- [ ] **URLs de LinkedIn** de todo o time.
- [ ] **Foto atualizada das Americas** (está com o Guli).
- [ ] **Testimonials que faltam** — Services e Clients & Impact.
- [ ] **Books**: material do livro do **Nitin** equivalente ao da Rhea, a visão da página e uma
      imagem real dos livros. A atual é gerada por IA e tem escrita alienígena na capa.
- [ ] **Insights**: o que o time quer. Por ora fica *coming soon*.
- [ ] **Sign-off da Rhea** na About.

⚠️ **A Rhea está fora esta semana** e é ela quem fecha case studies e depoimentos. É o gargalo
real do conteúdo, e vale dizer isso em voz alta antes de a semana acabar.

### Guli
- [x] ✅ **Foto do time na escada em landscape** — chegou (2400×1600). Virou o **herói da
      `/team`** em `public/team/team-stairs-landscape.jpg`, convertida do PNG de 4,1 MB para
      JPEG q90 de 540 KB numa única compressão.
      ⚠️ **Recorte ancorado no topo** (`object-top`), e isso não é detalhe: a foto é 3:2, o
      herói é `100svh`, e num laptop de 1440×800 o `object-cover` centrado comia 60px de
      cima — cem do original — e a fileira de cima começa a 64. As cabeças sumiam.
      ⚠️ **Efeito colateral bom:** acabou a repetição de fotografia entre `/team` e `/about`,
      que o documento de Team apontava como "visible". A escada em retrato
      (`team/team-stairs.jpg`) ficou sem uso, e foi mantida no repositório.
- [ ] **Vídeo curto** mostrando a Approach redesenhada, para a Rhea revisar. Combinado por
      eliminação: Figma ela não abre, screenshot em grupo *"she's not very tech savvy"*.
      Alternativa que nós oferecemos: **cortar o trecho da daily de segunda** e postar no grupo.
      Se o Guli não gravar hoje, o corte é nosso.

---

## 3. A confirmar com ela

- [ ] **India sai também da About?** Ver §1. Ela aprovou a About minutos antes de pedir a
      remoção no Team, e o documento manda as duas listas baterem.
- [ ] **Onde entram os parceiros novos** — a faixa de logos de `/our-partnerships` ou a da
      landing de Services? Ela falou "in here" com a tela em Services.
- [ ] **Frasers: é parceria de 3 ou de 4 anos?** A célula veio literalmente como
      `[3 or 4]-year: transformation partnership`.
- [ ] **Aviva e Shell entram?** Estão `FINAL` na coluna de status mas `No` em Reviewed.
- [ ] **A ordem do CTA na página de serviço.** Em 15-09 ela pediu o convite **antes** da
      evidência; o template que ela mandou fecha com CTA **depois** da evidência. Ver o spec.

---

## 4. Citações que valem guardar

> *"Use your initiative on what works and what doesn't work, but ultimately like that."*
> — sobre seguir o template das páginas de serviço. É licença para adaptar ao sistema de
> componentes, não para reinventar a página.

> *"We probably will use some of the layout of the other sections, the components, because if
> we don't do this, all pages will look different."*
> — a própria cliente pedindo consistência de componentes acima de fidelidade ao mockup.

> *"If you need me, I'm signing off shortly, but I'm on WhatsApp, so if there's any questions,
> big or small, fire away."*
