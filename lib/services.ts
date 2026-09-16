/**
 * Os dez serviços — a copy FINAL do cliente, em código.
 *
 * ================================================================
 * POR QUE ISTO NÃO VEM DO CMS
 * ================================================================
 *
 * O outline de Services (`CDNA_03_Services.docx`, 09-09-2026) fecha a lista em
 * DEZ serviços e entrega, para cada um, banner, impact, how we help e as três
 * partes do CTA. O CMS publica NOVE, com outra taxonomia, e não tem campo para
 * strapline nem para a linha do CTA — o `solutionSchema` do CMS descarta chave
 * desconhecida em silêncio, então nem gravar direto no banco resolveria.
 *
 * Somando: dois serviços que não existem lá (Judgement in AI, Family Business
 * Consulting), três renomeados, dois que saem, campos novos a migrar, e o banco
 * de produção fora de alcance desta máquina. Fazer pelo CMS é migração + deploy
 * do CMS + reautoria manual de ~60 campos, a quatro dias do lançamento.
 *
 * Então vale o mesmo precedente da About (`app/about/page.tsx`, 2.207 linhas sem
 * uma chamada de CMS): **a copy que o cliente escreveu por documento mora no
 * código**. É transcrição, não autoria — cada frase abaixo está no docx.
 *
 * O QUE ISSO CUSTA, dito claro: enquanto for assim, a CDNA não edita estes
 * textos sozinha. É reversível — o caminho de volta está em `docs/` e o formato
 * daqui espelha o que o CMS precisaria ter.
 *
 * ================================================================
 * O QUE O PRÓPRIO CLIENTE MARCA COMO FURO
 * ================================================================
 *
 * Cinco dos dez têm evidência (1, 2, 3, 6, 9). Os outros cinco — Manager
 * Development, Women in Leadership, HRLT Effectiveness, Judgement in AI e
 * Family Business Consulting — não têm caso nem citação, e por isso os blocos 4
 * e 5 simplesmente não renderizam neles. É o outline que diz: *"those five pages
 * launch on copy alone and Blocks 4 and 5 collapse on all of them."*
 *
 * Citação publicável existe UMA, a de Executive Coaching. As outras quatro estão
 * identificadas mas não escolhidas (adidas, GSK Mexico, Heineken, Vodafone), e
 * escolher quatro frases é o trabalho mais barato que mais muda estas páginas.
 */

/** Um fato da faixa de evidência: o número grande e o que ele conta. */
export type ServiceFact = { value: string; label?: string };

/**
 * Este fato é uma MEDIDA ou uma PALAVRA?
 *
 * A faixa de evidência mistura os dois, e não por descuido — é o que os cinco
 * casos do documento têm. São medidas: 150, 18, 400+, 7 years, 92%, 93%, 150+,
 * 1,000+, 20+, 6 to 12. São palavras: "Enterprise wide", "Multi market", e a
 * cascata da GSK ("CEO led", "LT aligned", "Management activated",
 * "N-1 embedded") — que o próprio outline aponta como o único dos cinco sem
 * número nenhum.
 *
 * Tratar os dois igual é o que deixava a faixa sem destaque: um número existe
 * para ser visto de longe, uma frase existe para ser lida.
 *
 * ⚠️ O TESTE É "COMEÇA COM DÍGITO", E NÃO "TEM DÍGITO" — a primeira versão era
 * a segunda, e **"N-1 embedded"** a derrubou na mesma tarde. Ela tem o "1", foi
 * classificada como medida, saiu em vermelho a 48px quebrando em duas linhas, e
 * transformou o quarto passo de uma cascata de quatro passos iguais numa
 * manchete. "N-1" é nível de organograma, não quantidade.
 *
 * O `[^A-Za-z]*` na frente deixa passar um símbolo inicial ("$2M", "+40%"),
 * que não existe nos dados de hoje mas é o que viria do CMS. Uma medida escrita
 * por extenso ("one hundred and fifty") cairia como palavra — e nesse caso o
 * lugar de consertar é a copy, não a expressão regular.
 *
 * NÃO É MAIS O MESMO TESTE DO `Counter`, que procura número em qualquer posição.
 * Não precisa ser: o ramo de palavra nem chega a montar o `Counter`, então ele
 * nunca vê "N-1 embedded". Quem decide o tratamento é esta função, sozinha.
 */
export const factIsMeasure = (fact: ServiceFact) => /^[^A-Za-z]*\d/.test(fact.value);

export type ServiceEvidence = {
  /** Nome do cliente, em caixa alta no documento. */
  client: string;
  /**
   * O recorte do trabalho — a segunda metade do título do bloco, no formato
   * "CLIENTE | recorte". Ausente onde o documento não dá um (a prática de
   * coaching), e aí o título é só o nome.
   */
  title?: string;
  body: string;
  facts?: ServiceFact[];
  /**
   * A foto da coluna do meio da faixa de evidência — o que o template dela
   * mostra ao lado dos números (a placa da HEINEKEN, no mockup do ExCo).
   *
   * ⏳ NENHUM DOS DEZ TEM ARQUIVO HOJE. É asset do cliente, pedido na daily de
   * 16-09 junto com as imagens da grade — ver `docs/correcoes-maliha-call-16-09-
   * 2026.md`. Sem ele a faixa fica em duas colunas, que é um dos quatro estados
   * que `SolutionEvidence` já monta.
   *
   * ⚠️ CAMINHO EM `public/`, E NÃO A CAPA DO CASO NO CMS. Esta rota deixou de
   * ler o CMS em 11-09 de propósito (ver o cabeçalho de `app/services/[slug]/
   * page.tsx`); buscar capa lá devolveria um fetch às dez páginas por causa de
   * uma imagem que uma delas teria.
   */
  image?: string;
  /**
   * Só quando existe página de caso para linkar. Vazio nos três clientes que o
   * outline cita e que não estão no acervo (Vodafone, adidas, GSK Mexico) e na
   * prática de coaching, que não é um caso de cliente.
   */
  caseSlug?: string;
};

export type ServiceTestimonial = { quote: string; attribution: string };

export type Service = {
  slug: string;
  title: string;
  /** A "banner statement" do outline: uma frase, no herói, sob o nome. */
  banner: string;
  /** Bloco 2 — The Outcome. O que muda no negócio. */
  outcome: string;
  /** Bloco 3 — How CorporateDNA Helps. A intervenção. */
  howWeHelp: string;
  /**
   * Os termos da frase de "what CDNA does to help", promovidos a rótulo — o que
   * o template dela mostra como cinco cartões com ícone sob aquele bloco.
   *
   * ⚠️ SÃO PALAVRAS DELA, e a regra é essa: cada item aparece literalmente na
   * frase logo acima, na mesma ordem em que ela os escreveu. O mockup põe uma
   * linha de descrição em cada cartão ("Shared learning that builds perspective
   * and collective mindset") e ESSA linha não existe em documento nenhum do
   * cliente — por isso o cartão sai só com o rótulo. Quando ela mandar as
   * descrições, é acrescentar um campo; o layout não muda.
   *
   * Ausente ou vazio = a faixa não renderiza. Ver `SolutionPillars`.
   */
  pillars?: string[];
  /** Bloco 6 — as três partes que o outline chama de "all thirty parts". */
  cta: { strapline: string; line: string; label: string };
  evidence?: ServiceEvidence;
  testimonial?: ServiceTestimonial;
  /**
   * A imagem do card no índice `/services` — item 12 da daily de 14-09:
   * *"a bit of image, just to call out each of the [services]."*
   *
   * ⏳ NOVE DOS DEZ TÊM, e a ausência do décimo é deliberada em vez de um
   * arquivo qualquer. Os arquivos vêm de duas origens, e vale saber qual é qual:
   *
   *   • SEIS são as banners fotográficas do site ANTIGO
   *     (`public/solutions-banners/`), recortadas em 16:10: material da própria
   *     CDNA, já publicado, e não banco de imagem.
   *   • TRÊS chegaram em 15-09, escolhidos pelo Ricardo — Manager Development,
   *     Judgement in AI e Family Business Consulting. São imagens GERADAS, e o
   *     registro importa: o site velho não tinha esses três serviços, então não
   *     existia foto deles em lugar nenhum.
   *
   * Segue sem arquivo HRLT Effectiveness, pela mesma razão — serviço novo, sem
   * acervo. O card dele cai no campo de cor.
   *
   * O CARD SEM FOTO NÃO FICA VAZIO: ele cai no campo de cor com o nome do
   * serviço, que é o mesmo recurso que as páginas de dentro usam desde 12-09 e
   * pelo mesmo motivo — não fica brega, não depende de arquivo que não existe, e
   * é diferente em cada card de graça. A grade continua com dez objetos da mesma
   * medida; o que muda é o que preenche o quadro.
   *
   * ⚠️ ISTO É O "USE GENERIC FOR NOW" DELA, de 15-09, e não a escolha final. Ela
   * ficou de mandar as imagens da grade; quando chegarem, é trocar nove caminhos
   * e acrescentar um. O layout não muda.
   *
   * ⚠️ O ARQUIVO DO TOP 150 É `diversification.png` do acervo antigo — um
   * conselho ao redor da mesa com a cidade atrás. O NOME do arquivo fala de
   * inclusão, o CONTEÚDO serve a uma jornada de ExCo. Fica escrito para ninguém
   * concluir mais tarde que houve troca de imagem entre serviços.
   */
  cardImage?: string;
};

/**
 * A ordem é a do documento, e ela é deliberada: *"Count and order are both
 * settled. Ten services, in the copy sheet sequence, ending with Family Business
 * Consulting. Judgement in AI sits at 8, next to Executive Coaching, which is
 * where the two arguments about decision quality belong anyway."*
 */
export const services: Service[] = [
  {
    slug: "top-150-leadership-development",
    cardImage: "/services/cards/top-150-leadership-development.jpg",
    title: "Top 150 Leadership Development",
    banner:
      "Build enterprise leaders who lead beyond their function and geography into collective leadership at scale.",
    outcome:
      "A senior leadership community with greater **strategic alignment, decision quality and execution speed**. Leaders think enterprise first, operate horizontally and collectively own performance, transformation and the leadership pipeline.",
    howWeHelp:
      "We work with the ExCo and top 100 to 150 leaders to build the **Inner Game and Outer Game of enterprise leadership**. Through immersive experiences, coaching, real business challenges, peer learning and mastery labs, we shift leaders from **“my function, my market, my priorities” to “our enterprise, our performance, our future.”**",
    pillars: [
      "Immersive experiences",
      "Coaching",
      "Real business challenges",
      "Peer learning",
      "Mastery labs",
    ],
    cta: {
      strapline: "Individual accountability. Collective enterprise performance.",
      line: "Build a senior leadership community that improves decision quality, alignment and execution speed across functions, markets and geographies.",
      label: "Talk to us about your enterprise leaders",
    },
    /* ⚠️ O caso publicado da Heineken conta OUTRO trabalho — 70+ sucessores HiPo
       na APAC, parceria de 6 anos — e não esta jornada de 18 meses com os 150.
       Mesmo cliente, engajamento diferente. O link fica porque o outline manda o
       bloco 4 puxar o caso do serviço, mas é pergunta a fazer ao cliente. */
    evidence: {
      client: "HEINEKEN",
      title: "Top 150 leaders",
      body: "An 18 month enterprise leadership journey bringing HEINEKEN’s senior leadership population together to strengthen the Inner and Outer Game of leadership.",
      /* A divisão entre número e rótulo é só apresentação: o documento escreve
         "150 senior leaders · 18 months · Enterprise wide, self and peer to
         peer leadership", e nenhuma palavra foi acrescentada. */
      facts: [
        { value: "150", label: "senior leaders" },
        { value: "18", label: "months" },
        { value: "Enterprise wide", label: "self and peer to peer leadership" },
      ],
      caseSlug: "heineken",
    },
  },
  {
    slug: "culture-transformation",
    cardImage: "/services/cards/culture-transformation.jpg",
    title: "Culture Transformation",
    banner:
      "Turn strategic intent into leadership behaviour that changes how the organisation actually operates.",
    outcome:
      "Greater **transformation readiness, organisational adaptability and execution discipline**. Culture becomes an accelerator of strategy rather than friction that slows it down.",
    howWeHelp:
      "We translate strategy and culture ambition into the **specific leadership behaviours, choices and habits** required to deliver it. We activate these through leaders, teams, organisational rituals and the flow of work, creating visible behavioural change that can be reinforced and scaled.",
    pillars: ["Leaders", "Teams", "Organisational rituals", "The flow of work"],
    cta: {
      strapline: "Strategy changes. Culture has to move with it.",
      line: "Turn strategic ambition into the behaviours, decisions and habits that increase organisational adaptability and make transformation happen.",
      label: "Talk to us about the culture your strategy needs",
    },
    /* Os quatro fatos aqui são uma SEQUÊNCIA, não medidas — é a "cascade line"
       do documento, que o próprio outline chama de bom gráfico e, no mesmo
       parágrafo, de único dos cinco sem número nenhum. */
    evidence: {
      client: "GSK MEXICO",
      title: "From leadership team to organisation",
      body: "Culture transformation started with the Country CEO and Leadership Team, before cascading through the Management Team and N-1 leadership layers. The focus: translate the desired culture into the behaviours, relationships and leadership practices people experience every day, creating alignment from the top while building momentum through the organisation.",
      /* Sem rótulo, e de propósito: a linha do documento é
         "CEO led → LT aligned → Management activated → N-1 embedded", quatro
         etapas e nada mais. Escrever uma legenda para cada uma seria copy nossa
         numa página onde todo o resto é do cliente. */
      facts: [
        { value: "CEO led" },
        { value: "LT aligned" },
        { value: "Management activated" },
        { value: "N-1 embedded" },
      ],
    },
  },
  {
    slug: "talent-development",
    cardImage: "/services/cards/talent-development.jpg",
    title: "Talent Development",
    banner: "Build the leadership pipeline before the business needs it.",
    outcome:
      "Greater **bench strength, successor readiness and talent velocity**, reducing dependency on external hiring and strengthening the organisation’s capacity to grow.",
    howWeHelp:
      "We identify critical transitions and build targeted development journeys that accelerate high-potential talent towards bigger, more complex roles. Assessment, stretch experiences, coaching, business challenges and deliberate practice build **readiness, not simply potential**.",
    pillars: [
      "Assessment",
      "Stretch experiences",
      "Coaching",
      "Business challenges",
      "Deliberate practice",
    ],
    cta: {
      strapline: "Global ambition. Local talent realities.",
      line: "Build a talent runway that identifies what your people need here and now, while preparing them for what the business will need next.",
      label: "Talk to us about your talent pipeline",
    },
    /* ⚠️ A linha "Award winning programmes across regions" do documento NÃO
       entrou. O próprio outline a reprova: *"Name the award rather than alluding
       to it. Award winning with no award named is the weakest line on any of the
       five, and the Brandon Hall gold is already published on the live Our Impact
       page."* Publicar o prêmio pelo nome depende de confirmarem qual é. */
    evidence: {
      client: "VODAFONE",
      title: "Inspire",
      body: "A multi year talent development partnership accelerating high-potential talent and strengthening leadership pipelines across markets.",
      facts: [
        { value: "400+", label: "alumni" },
        { value: "7 years", label: "partnership" },
        { value: "Multi market", label: "development" },
      ],
    },
  },
  {
    slug: "manager-development",
    cardImage: "/services/cards/manager-development.jpg",
    title: "Manager Development",
    banner: "Build managers who turn strategy into performance through people.",
    outcome:
      "Stronger **execution discipline, team performance and leadership capacity** where employees experience leadership every day. Better managers create clarity, accountability and the conditions for people to perform.",
    howWeHelp:
      "We build the practical capabilities managers need in the flow of work: **setting direction, making decisions, developing people, managing performance, navigating difficult conversations and leading through change**. Development is applied to real managerial challenges, not separated from them.",
    pillars: [
      "Setting direction",
      "Making decisions",
      "Developing people",
      "Managing performance",
      "Navigating difficult conversations",
      "Leading through change",
    ],
    cta: {
      strapline: "Big strategy. Everyday leadership.",
      line: "Build managers who translate business priorities into clarity, accountability and performance through the people they lead every day.",
      label: "Talk to us about your manager capability",
    },
  },
  {
    slug: "women-in-leadership",
    cardImage: "/services/cards/women-in-leadership.jpg",
    title: "Women in Leadership",
    banner:
      "Accelerate progression and strengthen the pipeline of women ready for bigger leadership roles.",
    outcome:
      "Increased **representation, successor readiness and retention of critical female talent**, creating a stronger and more diverse leadership pipeline.",
    howWeHelp:
      "We work at both the **individual and organisational level**. We strengthen leadership identity, enterprise influence, strategic networks and readiness for bigger roles, while addressing the systemic barriers, sponsorship gaps and organisational conditions that can restrict progression.",
    pillars: [
      "Leadership identity",
      "Enterprise influence",
      "Strategic networks",
      "Readiness for bigger roles",
    ],
    cta: {
      strapline: "Talent is there. Progression isn’t always.",
      line: "Accelerate the readiness, visibility and progression of women while strengthening the leadership pipeline around them.",
      label: "Talk to us about accelerating women in your pipeline",
    },
  },
  {
    slug: "high-performing-teams",
    cardImage: "/services/cards/high-performing-teams.jpg",
    title: "High Performing Teams",
    banner:
      "Turn groups of strong individuals into leadership teams that perform collectively.",
    outcome:
      "Better **decision quality, execution speed, collective accountability and cross-functional effectiveness**. Less organisational friction. More leadership capacity directed at the priorities that matter most.",
    howWeHelp:
      "We work with real teams on their real work, strengthening **trust, constructive challenge, decision rights, accountability, alignment and execution**. Rather than generic team building, we identify what is helping and hindering collective performance and embed new ways of working.",
    pillars: [
      "Trust",
      "Constructive challenge",
      "Decision rights",
      "Accountability",
      "Alignment",
      "Execution",
    ],
    cta: {
      strapline: "Strong individuals don’t automatically make a strong team.",
      line: "Reduce friction, strengthen decision-making and collective accountability, and increase the speed at which teams turn priorities into performance.",
      label: "Talk to us about your team’s performance",
    },
    /* O outline aponta este como o padrão a seguir: *"This is the strongest of
       the five and the only one carrying a percentage of impact. Two of its three
       figures say whether it worked rather than how big it was."* */
    evidence: {
      client: "ADIDAS",
      title: "South East Asia leadership",
      body: "A regional team transformation designed to align diverse leadership behaviours, create a unified identity and shift the team from siloed execution to shared decision-making and collective ownership. The work connected the team’s Inner Game of identity and behavioural cohesion with its Outer Game of activating three critical transformation streams.",
      facts: [
        { value: "92%", label: "NPS" },
        { value: "93%", label: "immersion impact" },
        { value: "150+", label: "senior executives" },
      ],
    },
  },
  {
    slug: "hrlt-effectiveness",
    title: "HRLT Effectiveness",
    banner:
      "Build an HR leadership team with the strategic influence and collective authority to shape the business, not simply support it.",
    outcome:
      "Greater **strategic influence, organisational connectivity and transformation readiness**, with HR operating as an enterprise leadership function capable of accelerating business and people performance.",
    howWeHelp:
      "We help HRLTs move beyond functional excellence into **collective enterprise leadership**. We strengthen business judgement, strategic alignment, horizontal working, influence and execution, while clarifying how the HRLT needs to operate together to lead transformation across the organisation.",
    pillars: [
      "Business judgement",
      "Strategic alignment",
      "Horizontal working",
      "Influence",
      "Execution",
    ],
    cta: {
      strapline: "A seat at the table isn’t the same as influence at the table.",
      line: "Build an HRLT with the commercial judgement, collective authority and transformation capability to shape the business, not simply support it.",
      label: "Talk to us about your HRLT",
    },
  },
  {
    slug: "judgement-in-ai",
    cardImage: "/services/cards/judgement-in-ai.jpg",
    title: "Judgement in AI",
    banner:
      "Build the human judgement required to make better decisions in an AI-augmented world.",
    outcome:
      "Higher **decision quality and decision velocity** without surrendering accountability to technology. Leaders know when to trust AI, when to challenge it and where distinctly human judgement creates value.",
    howWeHelp:
      "We build the capabilities leaders need to operate alongside AI: **critical thinking, judgement, curiosity, sense-making, ethical reasoning and decision-making under uncertainty**. Leaders practise on real business dilemmas and learn to combine human experience and intuition with AI-enabled insight.",
    pillars: [
      "Critical thinking",
      "Judgement",
      "Curiosity",
      "Sense-making",
      "Ethical reasoning",
      "Decision-making under uncertainty",
    ],
    cta: {
      strapline: "More intelligence. Better decisions? Not necessarily.",
      line: "Strengthen the human judgement, critical thinking and decision quality leaders need to use AI without outsourcing accountability to it.",
      label: "Talk to us about leadership judgement in AI",
    },
  },
  {
    slug: "executive-coaching",
    cardImage: "/services/cards/executive-coaching.jpg",
    title: "Executive Coaching",
    banner: "Strengthen judgement and leadership performance when the stakes are highest.",
    outcome:
      "Greater **leadership impact, decision quality, role readiness and performance under pressure** at the moments where an executive’s behaviour has disproportionate organisational consequences.",
    howWeHelp:
      "Our coaches work with senior leaders on the real challenges of their role, combining deep personal insight with the realities of the business. We strengthen the **Inner Game and Outer Game** required to navigate complexity, transition, relationships, performance and increasing leadership scale.",
    pillars: [
      "Complexity",
      "Transition",
      "Relationships",
      "Performance",
      "Leadership scale",
    ],
    cta: {
      strapline: "Bigger roles. Higher stakes. Fewer easy answers.",
      line: "Strengthen the judgement, impact and performance of executives navigating complexity, transition and increasing leadership scale.",
      label: "Talk to us about your executive coaching needs",
    },
    /* Este bloco não é um caso de cliente, é um resumo de prática — por isso não
       tem logo, nome nem link de história. */
    evidence: {
      client: "GLOBAL EXECUTIVE COACHING PRACTICE",
      /* Sem `title`: o documento dá só esta linha como cabeçalho do bloco, ao
         contrário dos outros quatro, que trazem "CLIENTE | recorte do trabalho". */
      body: "For more than a decade, CorporateDNA has coached leaders across levels, functions, businesses and geographies, from Chairs and C-suite executives to directors, managers, high-potential and critical-role talent. At the heart of our approach is the trusted tripartite: coach, coachee and line manager aligned around clear objectives, progress and visible organisational impact.",
      facts: [
        { value: "1,000+", label: "leaders coached" },
        { value: "20+", label: "countries" },
        { value: "6 to 12", label: "session journeys" },
      ],
    },
    /* A única citação publicável dos dez. O outline explica por que ela serve de
       molde: *"anonymised to a role and a client tier, which needs no individual
       permission and still carries weight."* */
    testimonial: {
      quote:
        "The coaching gave me the space to think differently, and the support to turn insight into action.",
      attribution: "Global Business Unit Head, FTSE 100 client",
    },
  },
  {
    slug: "family-business-consulting",
    cardImage: "/services/cards/family-business-consulting.jpg",
    title: "Family Business Consulting",
    banner:
      "Build the leadership, governance and succession capability required to protect the legacy while creating the future.",
    outcome:
      "Greater **succession readiness, governance clarity, decision quality and organisational continuity**, enabling the business to evolve without losing what made it successful.",
    howWeHelp:
      "We work across the **family, ownership and business systems** to clarify governance, decision rights, leadership transitions and succession. We help founders, next-generation leaders and professional executives navigate the human and organisational complexity of moving from founder-led success to an enduring institution.",
    pillars: [
      "Governance",
      "Decision rights",
      "Leadership transitions",
      "Succession",
    ],
    cta: {
      strapline: "Protect what built the business. Prepare for what comes next.",
      line: "Strengthen governance, succession readiness and decision-making across family, ownership and business as leadership moves between generations.",
      label: "Talk to us about your family’s next chapter",
    },
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/**
 * A copy do documento é texto puro; os blocos de conteúdo renderizam HTML
 * (herdado do CMS, via `<RichText>`). Isto faz a ponte — e escapa, porque uma
 * frase do cliente com `&` ou `<` não pode virar marcação.
 */
export function paragraphs(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) =>
      p
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        /* A ÊNFASE ENTRA DEPOIS DO ESCAPE, e a ordem não é gosto: invertida, o
           `<strong>` que acabamos de inserir seria escapado e sairia como texto
           na tela. O par `**…**` é a marcação da planilha dela — ver a caixa do
           campo `outcome` — e asterisco sem par fica visível de propósito, para
           aparecer na revisão em vez de sumir. */
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
    )
    .map((p) => `<p>${p}</p>`)
    .join("");
}

/**
 * Adapta uma solution do CMS ao formato daqui, só para a rota de preview.
 *
 * O preview existe para o editor ver um rascunho do CMS no desenho do site, e
 * continua valendo para os tipos que o site ainda lê de lá. Para solutions ele
 * virou uma janela para conteúdo que não publica mais nada — mas remover a
 * capacidade é decisão de produto, não efeito colateral de uma refatoração, então
 * a branch fica e ganha este tradutor.
 *
 * O CMS guarda `outcome`/`howWeHelp` como HTML e aqui os campos são texto puro
 * (é `paragraphs()` que faz a marcação na hora de renderizar). Sem desmontar as
 * tags, o texto sairia com `<p>` à vista na tela.
 */
export function serviceFromSolutionVM(vm: {
  slug: string;
  title: string;
  problemStatement?: string;
  outcome?: string;
  howWeHelp?: string;
  cta?: { label?: string; href?: string };
  ctaStrapline?: string;
  ctaLine?: string;
  ctaLabel?: string;
}): Service {
  const toText = (html?: string) =>
    (html ?? "")
      .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .trim();

  return {
    slug: vm.slug,
    title: vm.title,
    banner: toText(vm.problemStatement),
    outcome: toText(vm.outcome),
    howWeHelp: toText(vm.howWeHelp),
    /* Os três campos do bloco 6 quando a entrada já os tem; senão, o convite
       compartilhado — que é o que as nove entradas antigas mostram. */
    cta: {
      strapline: vm.ctaStrapline || "Ready to start the conversation?",
      line: vm.ctaLine ?? "",
      label: vm.ctaLabel || vm.cta?.label || "Start a Conversation",
    },
  };
}

/*
 * OS SLUGS ANTIGOS têm 301 em `next.config.mjs` (bloco
 * `legacyExtensionlessRedirects`), e não aqui: a config do Next é ESM puro e não
 * importa TypeScript, então um mapa neste arquivo seria código morto. Quem mexer
 * nos slugs acima tem de abrir aquele arquivo — é lá que se confere se algum
 * redirect passou a apontar para página que não existe mais.
 */
