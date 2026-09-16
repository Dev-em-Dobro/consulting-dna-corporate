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
- [ ] **Layout contra o template dela**, `4. Services/ExCo Leadership Services Page.png`.
      O que já está de pé: herói, os dois blocos de texto, faixa de CTA, evidência, citação
      condicional e "Related services" (reordenados em 15-09).
      → `components/views/SolutionView.tsx`, `components/solutions/*`
      → **o desenho desta página está especificado em
      `docs/superpowers/specs/2026-09-16-services-inner-page-design.md`**

### Clients & Impact — landing (prioridade do dia)
- [ ] **Reconstruir `/our-clients`** seguindo a imagem 1 do drive **mais** o bloco
      *"Industries we work in"* da imagem 2 — *"literally it can be exactly like this"*.
      Ordem da referência: herói → mural de logos → **By the numbers** → **Industries we work
      in** → **Breadth by service** (matriz cliente × serviço) → case studies → depoimentos →
      *A force for good* → footprint global.
      → `app/our-clients/page.tsx` (hoje é da geração antiga: 1000px de caixa, marquee e pouco
      mais)
      → referências: `5. Clients& Impact/ChatGPT Image Sep 15, 2026, 01_33_16 PM.png` e
      `…01_34_00 PM.png`

### Clients & Impact — página de case study
- [ ] **Layout do case** conforme `5. Clients& Impact/efa52866-….png` (o da adidas): faixa de
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

### Hoje
- [ ] **XLS dos case studies**, na pasta *Clients & Impact* do drive — *"filter column B under
      yes"*. É o insumo que destrava a página.
- [ ] **Foto do time em pé, Rhea no meio** — pelo WhatsApp (na call só apareceu o Edge dela).
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
- [ ] **Foto do time na escada**, feita com IA, **em landscape** (a original é retrato) — ela
      cobrou para hoje. No fim da call ela disse que ele já postou uma versão no grupo:
      **conferir se é a landscape** antes de pedir de novo.
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
