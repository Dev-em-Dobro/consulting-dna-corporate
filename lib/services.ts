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

import { inlineEmphasis } from "./page-copy/text.ts";

/** Um fato da faixa de evidência: o número grande e o que ele conta. */
export type ServiceFact = {
  value: string;
  label?: string;
  /**
   * A DESCRIÇÃO ABAIXO DO NÚMERO — 24-09, com o layout do Executive Coaching.
   *
   * ⚠️ ELA TROCA O ARRANJO DA GRADE, e não é só um terceiro texto: com
   * descrição a medida sai com o ícone À ESQUERDA do número e tudo alinhado à
   * esquerda, separada da vizinha por um filete; sem ela continua o arranjo
   * centrado do Talent Development (disco rosa, número, rótulo). A conta está em
   * `SolutionEvidenceSummary`, e é a mesma régua do `icon` logo abaixo — o dado
   * carrega a distinção, uma prop de layout a repetiria.
   *
   * ⚠️ SÓ VALE NA FAIXA NOVA. A antiga (`ServiceEvidence`) usa o mesmo tipo e
   * ignora o campo.
   */
  body?: string;
  /**
   * A CHAVE DO ÍCONE NO MAPA DE `SolutionPillars` — 24-09, com as quatro
   * medidas do "The impact" do Talent Development.
   *
   * ⚠️ ELE NÃO É SÓ ENFEITE: é o que decide EM QUE ARRANJO a medida sai na
   * faixa de evidência. Com ícone ela vai para a grade própria, acima dos
   * logos; sem ícone ela entra na fileira intercalada LOGO | medida | LOGO do
   * layout do Senior Leadership Development. A conta está em
   * `SolutionEvidenceSummary`, e a caixa lá explica por que nove células numa
   * fileira só não funcionariam.
   *
   * ⚠️ NÃO VALE PARA OS `facts` DA FAIXA DE EVIDÊNCIA ANTIGA (`ServiceEvidence`),
   * que usa o mesmo tipo e ignora o campo — lá as medidas saem em coluna, ao
   * lado da foto do caso, e não há grade em que pô-las.
   */
  icon?: string;
};

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
   * ⏳ NENHUM DOS ARQUIVOS DE HOJE É DEFINITIVO. O Top 150 usa um recorte do
   * mockup dela (ver a caixa no próprio dado) e os outros quatro serviços com
   * evidência apontam para `EVIDENCE_IMAGE_PLACEHOLDER`, a chapa cinza escrita
   * "PLACEHOLDER" que entrou a pedido em 17-09 — ver a caixa da constante. A
   * foto de verdade é asset do cliente, pedida na daily de 16-09 junto com as
   * imagens da grade — ver `docs/correcoes-maliha-call-16-09-2026.md`.
   *
   * ⚠️ A FAIXA AINDA SABE FICAR SEM FOTO. `SolutionEvidence` monta quatro
   * arranjos de coluna e o de duas colunas continua vivo no código de
   * propósito: o placeholder é o estado de hoje, não a remoção do estado.
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

/**
 * ============================================================================
 * A FAIXA DE EVIDÊNCIA DO LAYOUT DE 24-09 — MANCHETE, LINHA DE APOIO, LOGOS E
 * NÚMEROS. NÃO É O BLOCO DE CASO.
 * ============================================================================
 *
 * O layout novo (`docs/meetings/senior-leadership-development-24-09.jpeg`)
 * refaz o pé da página de Senior Leadership Development: onde havia UM caso
 * contado por extenso — cliente, parágrafo de 18 meses, foto e citação —,
 * agora há uma AFIRMAÇÃO de resultado com dois logos de cliente e três medidas
 * entre eles.
 *
 * ⚠️ ESTE CAMPO NÃO SUBSTITUI `evidence`, ELE CONCORRE COM ELE. Os outros
 * serviços com case (Culture Transformation, High Performing Teams, Executive
 * Coaching, Family Business Consulting) continuam no `SolutionEvidence` de
 * sempre, que segue inteiro e sem uma linha mexida. Quem tem `evidenceSummary`
 * desenha a faixa nova; quem tem `evidence` desenha a antiga. A conta está em
 * `SolutionView`, e é a mesma forma do interruptor de `practices`.
 *
 * ⏳ UM DOS DEZ TEM. É o serviço que o layout desenha.
 *
 * ⚠️ FUNDO CLARO, E ISSO É MEDIDA DO ARQUIVO, NÃO GOSTO. No layout esta faixa
 * mede #fefefe — branco —, contra o #f9f8f6 da faixa de "How we work" logo
 * acima. A faixa antiga é `ink`. A troca importa por causa dos LOGOS: os PNG de
 * `public/logos/` são as marcas em cores originais para fundo claro, e sobre
 * `ink` exigiriam a plaqueta branca que `SolutionEvidence` registra como
 * testada e descartada. Em fundo claro elas entram como são.
 *
 * ⚠️ O VERMELHO DOS NÚMEROS PASSA A SER O `brand` CHEIO, e não o `brand-light`
 * da faixa antiga. É a regra de uma linha do `globals.css` — `brand` em fundo
 * claro, `brand-light` em fundo escuro —, e inverter aqui reprovaria.
 */
/**
 * ============================================================================
 * AS PEÇAS DO LAYOUT DE MANAGER DEVELOPMENT — 24-09
 * ============================================================================
 *
 * Desenhadas em `docs/meetings/manager-development-24-09.jpeg`. São TRÊS blocos
 * que não existiam no template: as trilhas, a grade de momentos e os passos
 * numerados.
 *
 * ⚠️ NENHUM DELES SUBSTITUI NADA. Cada um é um campo opcional, e serviço que
 * não o tem simplesmente não desenha aquele bloco — a mesma guarda de
 * `audiences`, `practices` e `evidenceSummary`. As nove páginas restantes não
 * sentem esta rodada.
 */

/**
 * UMA TRILHA — o cartão horizontal de foto à esquerda e conteúdo à direita.
 *
 * No layout são duas ("First-time managers" e "Mid-level managers"), e a
 * estrutura de cada uma tem cinco partes: foto, rótulo vermelho em caixa alta,
 * título em serifa, uma linha de apoio e a lista de itens com visto.
 */
export type ServicePathway = {
  /** O rótulo vermelho em caixa alta. */
  label: string;
  /** O título curto em serifa, logo abaixo do rótulo. */
  title: string;
  /** A linha de apoio, um corpo antes da lista. */
  body: string;
  /**
   * Os itens com visto. O layout os distribui em DUAS COLUNAS, com o filete
   * entre elas — quem faz essa divisão é o componente, pela metade da lista, e
   * não o dado: uma lista é uma lista.
   */
  items: string[];
  /** A foto do cartão. Ausente = campo de cor, como nos outros cartões. */
  image?: string;
};

/** A grade de caixas contornadas — "The manager moments that matter". */
export type ServiceMoments = {
  /** O rótulo da faixa, que no layout NOMEIA a grade em vez de ser genérico. */
  label: string;
  /** Uma caixa por item. O layout mostra dez, em duas fileiras de cinco. */
  items: string[];
};

/**
 * ============================================================================
 * O ECOSSISTEMA — A FAIXA ESCURA DE "HOW WE WORK" DO LAYOUT DE CULTURE, 24-09
 * ============================================================================
 *
 * `docs/meetings/culture-transformation-24-09.jpeg` desenha, no lugar do bloco
 * de duas colunas que as outras páginas têm, uma faixa `ink` de TRÊS COLUNAS: o
 * texto à esquerda, o diagrama dos dez elementos no meio, e um bloco curto à
 * direita atrás de um fio vertical.
 *
 * ⚠️ ISTO SUBSTITUI O "HOW WE WORK" PADRÃO, e não se soma a ele. As duas peças
 * escrevem o mesmo rótulo e ocupam o mesmo lugar; um serviço com as duas
 * desenharia "How we work" duas vezes. A conta está em `SolutionView`, e o
 * teste em `tests/services.test.ts` fixa a regra.
 *
 * ⏳ O DIAGRAMA NÃO EXISTE AINDA — ver a caixa de `diagram`.
 */
export type ServiceEcosystem = {
  /** A manchete em serifa ("The CDNA Culture Ecosystem"). */
  headline: string;
  /** O parágrafo abaixo dela, na coluna da esquerda. */
  body: string;
  /** O título curto do bloco da direita ("Ten planets. A stronger culture."). */
  asideTitle: string;
  /** O parágrafo do bloco da direita. */
  asideBody: string;
  /**
   * O diagrama dos dez elementos, no meio da faixa.
   *
   * ⏳ AUSENTE HOJE, E DE PROPÓSITO. A daily de 24-09 diz, em letra: *"o
   * diagrama do ecossistema elas vão redesenhar e mandar (ideia do sol no
   * centro e planetas orbitando, sem cores infantis)"* — ou seja, o desenho que
   * está no layout é justamente a versão que elas próprias recusaram. Redesenhá-
   * lo aqui seria trabalho que nasce descartado, e copiá-lo seria publicar o que
   * elas pediram para trocar.
   *
   * Sem arquivo, `SolutionEcosystem` desenha a chapa marcada PLACEHOLDER — o
   * mesmo recurso de `EVIDENCE_IMAGE_PLACEHOLDER`, e pelo mesmo motivo: o furo
   * fica VISÍVEL na revisão com a cliente em vez de passar por acabamento.
   *
   * ⚠️ Nome de arquivo NOVO quando a versão definitiva chegar, que o otimizador
   * do Next serve por URL e já entregou versão velha por isso.
   */
  diagram?: string;
  /**
   * OS DEZ ELEMENTOS, TRANSCRITOS E NÃO RENDERIZADOS.
   *
   * Eles moram DENTRO do diagrama — são os rótulos em volta do centro —, então
   * nenhum componente os lê hoje. Estão aqui porque a transcrição é o trabalho
   * que se perde: se o arquivo delas vier sem rótulo legível, vier tarde, ou
   * vier em idioma diferente, a copy já está no código e ninguém precisa voltar
   * ao JPEG para lê-la com lupa.
   *
   * ⚠️ NÃO É LISTA PARA VIRAR FILEIRA. Transformá-los num `SolutionPillars`
   * seria inventar um arranjo que o layout não desenha — o desenho afirma que os
   * dez são um SISTEMA em órbita, e uma fileira os achataria numa lista de
   * igual peso. É o mesmo argumento que separa `steps` de `pillars`.
   */
  elements: string[];
};

/**
 * ============================================================================
 * AS TRÊS PROVAS — O FECHO DO LAYOUT DE CULTURE, 24-09
 * ============================================================================
 *
 * Três cartões escuros: ícone em círculo contornado, título em caixa alta,
 * subtítulo em vermelho e um parágrafo.
 *
 * ⚠️ O QUE FOI CORTADO AQUI É PEDIDO EXPLÍCITO, e não recorte nosso. A daily de
 * 24-09 diz *"apagar as partes em azul"* e *"no final, deixar só Behavior
 * proof, Operating proof e Business proof"*. As partes riscadas a azul no
 * layout são duas: a manchete "From culture intent to measurable organisational
 * change" com o parágrafo ao lado dela, e a fileira "Our measurement journey"
 * (BASELINE → 90 DAYS → 6 MONTHS → EMBED & SCALE).
 *
 * ⚠️ O RÓTULO FICOU. O traço azul passa POR BAIXO de "WE MAKE THE SHIFT
 * VISIBLE" e corta a manchete, não ele — e sem rótulo os três cartões entrariam
 * na página sem nada que os anuncie. Se a leitura certa for cortá-lo também, é
 * apagar `label` daqui e o componente deixa de desenhá-lo.
 */
export type ServiceProof = {
  /** O rótulo da faixa ("We make the shift visible"). */
  label: string;
  items: ServiceProofItem[];
};

export type ServiceProofItem = {
  /** O título em caixa alta ("Behaviour proof"). */
  title: string;
  /** A linha em vermelho logo abaixo ("How people show up."). */
  subtitle: string;
  body: string;
  /** A chave do ícone no mapa de `SolutionProof`. */
  icon?: string;
};

/**
 * UM PASSO da fileira numerada de "How we work".
 *
 * ⚠️ NÃO É A MESMA COISA QUE `practices`. Aquela fileira é uma LISTA de
 * práticas de igual peso, separada por filetes; esta é uma SEQUÊNCIA — número,
 * ícone, título, descrição, e uma seta ligando cada passo ao seguinte. Os dois
 * desenhos são diferentes e os dois estão no ar, em páginas diferentes.
 */
export type ServiceStep = {
  /** O título curto, em negrito, abaixo do ícone. */
  title: string;
  /** A descrição de uma ou duas linhas. */
  body: string;
  /**
   * A chave do ícone no mapa de `SolutionSteps`. Ausente = o passo sai só com o
   * número, que continua legível.
   */
  icon?: string;
};

/**
 * A GRADE DE LADRILHOS DO "THE INFLECTION POINTS" — layout do Talent
 * Development, 24-09. Ver `SolutionInflectionPoints`.
 *
 * ⚠️ OS ITENS SÃO STRINGS, E NÃO OBJETOS COM ÍCONE, de propósito: o glifo vem
 * do mapa de `SolutionPillars`, que casa pelo RÓTULO EXATO. Pôr a chave do
 * ícone aqui criaria um segundo lugar onde a mesma decisão mora, e o primeiro
 * serviço que escrevesse "Retention / flight risk" com outro glifo quebraria o
 * vocabulário comum que a daily pediu.
 *
 * ⚠️ CADA ITEM PRECISA DE LINHA NO MAPA. Sem ela o ladrilho sai com o círculo
 * de fallback, que é o aviso visual de que faltou.
 *
 * ⏳ UM DOS DEZ TEM.
 */
export type ServiceInflectionPoints = {
  /** O rótulo da faixa ("The inflection points"). */
  label?: string;
  /** A manchete da coluna da esquerda. `
` vira quebra. */
  headline: string;
  /** A linha de apoio abaixo da manchete. */
  lead?: string;
  /** Os oito momentos, na ordem do desenho — ver a caixa do tabuleiro. */
  items: string[];
};

/**
 * A LISTA "WHAT SHIFTS" — os pares "de → para" do layout do Talent
 * Development, 24-09. Ver `SolutionShifts`.
 *
 * ⚠️ A ORDEM DO PAR É A AFIRMAÇÃO. `from` é o que a organização mede hoje,
 * `to` é o que ela passa a medir; invertê-los diria o contrário. Não é uma
 * lista de sinônimos.
 *
 * ⏳ UM DOS DEZ TEM.
 */
export type ServiceShifts = {
  /** O rótulo da faixa ("What shifts"). */
  label?: string;
  items: { from: string; to: string }[];
};

/**
 * A FILEIRA "COMMON OUTCOME" — 24-09, com o Talent Development.
 *
 * ⚠️ É A MESMA FORMA QUE `ServicePractices` (rótulo + lista de palavras) e um
 * tipo SEPARADO de propósito: `practices` SUBSTITUI a fileira de `pillars` no
 * pé do bloco "How we work", e este desenha em outro lugar da página — entre os
 * aceleradores e o "How we work". Unificá-los faria um serviço com os dois
 * desenhar a mesma fileira duas vezes, ou obrigaria uma prop de posição para
 * desempatar. Ver a conta em `SolutionView`.
 *
 * ⏳ UM DOS DEZ TEM.
 */
export type ServiceCommonOutcome = {
  label?: string;
  /**
   * ⚠️ O PONTO FINAL FAZ PARTE DO ITEM ("Readiness."), porque é assim que o
   * layout escreve e porque o mapa de ícones de `SolutionPillars` casa por
   * string exata. Tirá-lo derruba o item para o círculo de fallback.
   */
  items: string[];
};

/**
 * ============================================================================
 * OS TRÊS CARTÕES DE CLIENTE DA FAIXA "EVIDENCE" — LAYOUT DE WOMEN’S
 * LEADERSHIP DEVELOPMENT, 24-09
 * ============================================================================
 *
 * A TERCEIRA forma de evidência do template, e a que afirma mais de um
 * resultado: três cartões lado a lado, um por cliente, cada um com o seu logo,
 * o nome do programa, três medidas, uma tira de recortes (anos, mercados) e a
 * legenda do que mudou.
 *
 * ⚠️ EXCLUDENTE COM AS OUTRAS DUAS, pela mesma razão que já vale entre elas: as
 * três escrevem o rótulo "Evidence" e ocupam o mesmo lugar na página.
 * `SolutionView` desempata e `tests/services.test.ts` fixa a regra.
 *
 * POR QUE NÃO É O `evidenceSummary` COM MAIS LOGOS: lá as medidas são de UMA
 * afirmação e a fileira as intercala com as marcas, como se as marcas fossem o
 * lastro daquela afirmação. Aqui cada medida pertence a um cliente e a um
 * recorte de tempo — 6.300 pessoas na Shell e 5–7 patrocinadores por
 * participante na Kellanova não são medidas da mesma coisa, e postas na mesma
 * fileira leriam como se fossem.
 *
 * ⏳ UM DOS DEZ TEM.
 */
export type ServiceEvidenceCase = {
  /** A marca, em `public/logos/`. Ver a régua de tamanho no componente. */
  logo: { src: string; alt: string };
  /**
   * O NOME DO CLIENTE, e só onde o logo não o escreve.
   *
   * ⚠️ NO LAYOUT SÓ A SHELL TEM: o logo dela é a concha, sem palavra. A
   * Kellanova e a Aviva trazem o nome dentro do próprio lockup, e repeti-lo ao
   * lado diria a marca duas vezes na mesma linha.
   */
  client?: string;
  /** O nome do programa ("Powering women"). Sai em versalete, por CSS. */
  title: string;
  /** A linha de resultado, em serifa ("Building the pipeline at scale."). */
  tagline: string;
  /** As TRÊS medidas do cartão. Mesmo `ServiceFact` das outras faixas. */
  facts: ServiceFact[];
  /**
   * OS RECORTES — "5+ years", "Global", "16 countries".
   *
   * ⚠️ NÃO SÃO MEDIDAS, e é por isso que não entram em `facts`: eles não dizem
   * o que mudou, dizem em quanto tempo e onde a prova vale. Em corpo de medida
   * competiriam com os três números que estão logo acima deles.
   */
  meta?: string[];
  /** A legenda do pé do cartão, em corpo pequeno. */
  note: string;
};

export type ServiceEvidenceCases = {
  /** O rótulo da faixa. Ausente = "Evidence". */
  label?: string;
  /** A manchete em serifa ("Progression you can see."). */
  headline: string;
  /** A linha de apoio abaixo da manchete. */
  lead?: string;
  items: ServiceEvidenceCase[];
};

export type ServiceEvidenceSummary = {
  /**
   * O RÓTULO DA FAIXA. Ausente = "Evidence", que é como ela nasceu e como os
   * outros dois serviços a escrevem.
   *
   * ⚠️ É COPY, E POR ISSO É CAMPO. O layout do Talent Development chama esta
   * mesma faixa de "The impact", e escrever "Evidence" numa página que desenha
   * outra palavra seria inventar rótulo no lugar da cliente. O padrão fica no
   * componente para que os outros dois não precisem repetir a palavra no dado.
   *
   * ⚠️ QUEM MUDA O RÓTULO NÃO MUDA O `id` da faixa (`#evidence`), de propósito:
   * ele é endereço, não texto — a mesma regra que mantém `/solutions` atrás do
   * rótulo "Services".
   */
  label?: string;
  /** A manchete em serifa, logo abaixo do rótulo da faixa. */
  headline: string;
  /**
   * A linha de apoio, um corpo abaixo da manchete.
   *
   * ⚠️ VIROU OPCIONAL EM 24-09, com o Talent Development: naquele layout a
   * manchete de "The impact" é seguida direto pelas quatro medidas, e o
   * parágrafo que existe na faixa pertence às MARCAS, não ao resultado — vive
   * em `experience.lead`, colado nos logos. Escrever uma linha de apoio aqui só
   * para satisfazer o tipo seria copy nossa no lugar da dela.
   */
  lead?: string;
  /**
   * Resultados em PALAVRA, numa grade de ícone + rótulo acima dos logos — 24-09,
   * com a migração da HRLT.
   *
   * ⚠️ NÃO SÃO `facts` SEM NÚMERO. Um `fact` é uma célula da fileira de baixo,
   * que é uma linha só com filetes e comporta umas cinco; estes são seis frases
   * e vivem numa grade própria. A conta está na prop `outcomes` do
   * `SolutionEvidenceSummary`.
   *
   * ⚠️ CADA RÓTULO PRECISA DE LINHA NO MAPA de `SolutionPillars` — é de lá que
   * o ícone vem, via `pillarIcon`. Sem a linha o item sai com o círculo de
   * fallback, que é o aviso visual de que faltou.
   */
  outcomes?: string[];
  /**
   * As marcas nas duas pontas da fileira — caminho em `public/logos/` e o nome
   * do cliente para o `alt`.
   *
   * ⚠️ DUAS, UMA EM CADA PONTA, é o que o layout desenha, mas o componente não
   * fixa o número: ele intercala logos e medidas numa fileira só, com os logos
   * nas extremidades. Três marcas e dois números cairiam de pé.
   *
   * `caseSlug` SÓ QUANDO EXISTE PÁGINA DE CASO PARA LINKAR — a mesma regra do
   * campo homônimo em `ServiceEvidence`, e pela mesma razão: link para case
   * despublicado é 404 em cima de um logo de cliente. Sem ele a marca desenha
   * igual, só não é clicável.
   */
  /* ⚠️ OPCIONAL DESDE 24-09: o layout do Executive Coaching desenha esta faixa
     só com as quatro medidas, sem marca nenhuma. Um `logos: []` para satisfazer
     o tipo seria escrever lista vazia em vez de dizer que o campo não se
     aplica — a mesma conta que já valia para `facts`. */
  logos?: { src: string; alt: string; caseSlug?: string }[];
  /**
   * O TAMANHO DAS MARCAS em coluna única — 24-09. Ausente = o teto de 240px do
   * layout do Senior Leadership. `small` (teto de 140px) é a HRLT: *"os logos
   * da seção evidence ficaram muito grandes"*; `medium` (teto de 190px) é o
   * próprio Senior Leadership: *"pode diminuir um pouco os logos"*.
   */
  logoSize?: "small" | "medium";
  /**
   * A LINHA DE FECHO AO LADO DAS MARCAS — 24-09: *"Turn potential into
   * readiness. And readiness into impact."*
   *
   * ⚠️ NÃO É O `closing`. Aquele é uma faixa própria entre duas seções; esta
   * frase mora DENTRO da faixa de evidência, encostada nos logos, que é onde o
   * layout a desenha.
   */
  note?: string;
  /**
   * O RÓTULO E O PARÁGRAFO QUE APRESENTAM AS MARCAS — 24-09, com o Talent
   * Development: *"Our experience / For nearly two decades, we've worked with
   * organisations to identify, accelerate and retain talent…"*.
   *
   * ⚠️ NÃO É O `lead`. Aquele mora sob a manchete e fala do RESULTADO (o que a
   * faixa afirma); este mora colado na fileira de logos e fala de QUEM — no
   * layout são duas colunas com rótulos diferentes ("The impact" e "Our
   * experience"), e aqui viram dois degraus da mesma coluna. Fundir os dois
   * poria a frase que termina em "including:" acima das medidas, anunciando uma
   * lista de marcas que só viria depois de quatro números.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  experience?: { label?: string; lead?: string };
  /**
   * As medidas entre as marcas. Mesmo `ServiceFact` da faixa antiga.
   *
   * ⚠️ VIROU OPCIONAL EM 24-09, com a migração da HRLT, e a diferença entre os
   * dois serviços com esta faixa explica por quê: o Senior Leadership
   * Development tem três medidas ("47%", "85%", "3x") e dois logos, e a fileira
   * intercala os cinco; a HRLT não tem número NENHUM publicável — o que ela
   * afirma são seis frases, que entram em `outcomes` e desenham acima. Obrigar
   * um `facts: []` só para satisfazer o tipo seria escrever lista vazia em vez
   * de dizer que o campo não se aplica.
   */
  facts?: ServiceFact[];
};

/**
 * A CHAPA CINZA DA COLUNA DO MEIO, pedida em 17-09: *"the section Evidence
 * doesn't have the image and the quote, all pages in services should have it,
 * put a image and quote placeholder for now."* Até 16-09 a faixa de evidência
 * só mostrava foto no Top 150 e citação em dois dos dez, e nas outras páginas
 * ela fechava em uma ou duas colunas — o que estava certo pelo dado e errado
 * pelo desenho que a cliente quer ver de pé.
 *
 * ⏳ ELE É AUTO-EVIDENTE DE PROPÓSITO, e o nome do arquivo repete isso: a
 * imagem é uma chapa `#e7e4e1` 4:5 com as diagonais e a palavra "PLACEHOLDER"
 * em cima. Não é foto de banco, não é foto de outro cliente e não é a capa do
 * caso — qualquer uma das três passaria por asset entregue numa revisão rápida,
 * e esta não passa. Gerada por script com `sharp`, 900×1125, para casar com a
 * caixa 4:5 da faixa sem recorte (o `object-right` de `SolutionEvidence` existe
 * pela foto 2:1 da HEINEKEN e não morde esta).
 *
 * SAI SERVIÇO A SERVIÇO, à medida que as fotos da cliente chegarem: é trocar o
 * caminho no `evidence.image` daquele serviço. Quando o último sair, esta
 * constante some junto. ⚠️ TROCAR O NOME DO ARQUIVO JUNTO — o otimizador do
 * Next serve por URL e já entregou versão velha uma vez por causa disso.
 */
/**
 * A MANCHETE DE ESPERA dos blocos Impact e How we help, em nove dos dez
 * serviços. Pedida em 17-09, na mesma frase que mandou refazer os dois blocos:
 * *"essas seções precisam ficar exatamente igual como está no layout, se faltar
 * algum texto pode colocar um placeholder."*
 *
 * ⚠️ É AUTO-EVIDENTE DE PROPÓSITO, e segue o padrão que a própria cliente usa no
 * mockup dela para o depoimento que falta ("A quote from Dolf to be confirmed."):
 * quem revisar a página vê na hora que ali falta copy, em vez de ler uma frase
 * plausível e aprová-la sem perceber que fomos nós que a escrevemos.
 *
 * ⚠️ NÃO SUBSTITUIR POR FRASE DERIVADA DO CORPO. A tentação óbvia é resumir o
 * `outcome` de cada serviço numa manchete — e isso é escrever a promessa de
 * venda da CDNA por dedução, em dez páginas. As duas frases do Top 150 existem
 * porque ELA as escreveu no template; as outras dezoito são trabalho de copy
 * dela, e este placeholder é a lista de quantas faltam.
 *
 * ⏳ SAI UMA A UMA: cada serviço que receber as duas frases perde o placeholder
 * sozinho, porque o campo é opcional e o componente só cai aqui quando está
 * vazio. Quando o último sair, esta constante some junto.
 */
const HEADLINE_PLACEHOLDER = "Headline to be confirmed.";

const EVIDENCE_IMAGE_PLACEHOLDER = "/services/evidence/evidence.PLACEHOLDER.jpg";

/**
 * A CITAÇÃO DE ESPERA, do mesmo pedido de 17-09. O texto NÃO é invenção nossa:
 * é o mesmo padrão que o mockup da cliente usa no Top 150 — "A quote from Dolf
 * to be confirmed." com a atribuição "Name, Title / HEINEKEN" —, generalizado
 * para os outros clientes.
 *
 * ⚠️ NÃO SUBSTITUIR POR FRASE PLAUSÍVEL. Escrever um depoimento que soe real
 * para preencher a coluna é pôr palavra na boca da GSK, da adidas e da Vodafone;
 * o placeholder existe justamente para que ninguém confunda as duas coisas. O
 * outline é explícito sobre o tamanho da pendência: *"Nine of the ten have no
 * publishable testimonial. Four have one identified but not chosen: adidas, GSK
 * Mexico, Heineken and Vodafone. Only Executive Coaching has text that can
 * ship."* Escolher as quatro frases é trabalho de CONTEÚDO da cliente.
 */
const evidenceQuotePlaceholder = (client: string): ServiceTestimonial => ({
  quote: `A quote from ${client} to be confirmed.`,
  attribution: `Name, Title: ${client}`,
});

/**
 * UM DOS TRÊS CARTÕES DE PÚBLICO da faixa entre "What we do" e "How we work" —
 * o bloco novo do mockup de 21-09 (`docs/meetings/nova-pagina-interna-
 * servicoes.jpg`), pedido por email: *"Services internal — Re-layout the
 * internal with the image nova-pagina-interna-servicoes.jpg inside meetings
 * folder"*.
 *
 * O desenho mostra três cartões lado a lado dizendo A QUEM o serviço se
 * destina: foto no topo, ícone de linha vermelho, rótulo em caixa alta com
 * traço embaixo, título curto em serifa e um parágrafo. No Senior Leadership
 * Development são "EXECUTIVE TEAMS", "SLT / ET-1" e "TOP 100 – 150 LEADERS".
 *
 * ⏳ ISTO NÃO EXISTE EM DOCUMENTO NENHUM DA CLIENTE além do próprio mockup. O
 * `CDNA_03_Services.docx` e o `WEBSITE SERVICE COPY.xlsx` fecham a copy de cada
 * serviço em banner, impact, how we help e as três partes do CTA — público
 * alvo recortado em três não está lá. As três frases abaixo entram porque estão
 * ESCRITAS EM LETRA no desenho dela, pela mesma régua que já valeu para as duas
 * manchetes do Top 150 (ver `outcomeHeadline`): transcrição, não autoria.
 *
 * ⏳ OS OUTROS NOVE NÃO TÊM, e a faixa simplesmente não renderiza neles — a
 * mesma guarda de `pillars` e de `evidence`. Não há placeholder aqui de
 * propósito: inventar "a quem se destina" o Culture Transformation seria
 * escrever segmentação comercial da CDNA por dedução, em nove páginas. Quando
 * ela mandar os textos, é acrescentar o campo em cada serviço; o layout não
 * muda.
 */
export type ServiceAudience = {
  /**
   * O rótulo em caixa alta, sobreposto ao canto superior esquerdo da foto.
   *
   * ⚠️ OPCIONAL DESDE 24-09: no layout do Executive Coaching os quatro cartões
   * não têm texto sobre a fotografia — o nome do público é o título em serifa
   * logo abaixo dela. Exigir o campo obrigaria a inventar uma palavra para pôr
   * em cima da foto, ou a repetir o título a 30px de distância. Ausente = a foto
   * fica limpa; ver o filtro em `SolutionAudiences`.
   */
  label?: string;
  /** O título curto em serifa ("Align. Decide. Deliver."). */
  title: string;
  /** O parágrafo do cartão. Texto puro — este bloco não usa `**…**`. */
  body: string;
  /**
   * A foto do topo do cartão, em ~2:1.
   *
   * ✅ O SENIOR LEADERSHIP DEVELOPMENT TEM AS TRÊS, desde 21-09, em
   * `public/services/audiences/`. Os outros nove não têm `audiences` nenhum, então
   * a pergunta nem se coloca para eles hoje.
   *
   * Sem `image` o cartão cai no CAMPO DE COR, como o `ServiceCard` do índice faz
   * desde 12-09. É um estado BOM, e é o que torna a regra abaixo barata de
   * cumprir.
   *
   * ⚠️ NÃO APONTAR PARA ARQUIVO QUE AINDA NÃO EXISTE. O `next/image` não falha
   * no build por isso — falha em produção, com o cartão exibindo imagem
   * quebrada. Deixar o campo vazio até o arquivo estar no disco custa nada.
   *
   * ⚠️ Nome de arquivo NOVO a cada troca, que o otimizador do Next serve por
   * URL e já entregou versão velha por isso.
   */
  image?: string;
  /**
   * AS TRÊS PALAVRAS SOBRE A FOTO, no canto inferior direito — 21-09.
   *
   * O rótulo (`label`) vai no canto SUPERIOR ESQUERDO da mesma foto e sai
   * daquele campo, não daqui: ele já existe, e duplicá-lo seria criar a chance
   * de o cartão dizer um nome em cima da foto e outro embaixo dela.
   *
   * É UM ARRAY PORQUE AS QUEBRAS SÃO DO DESENHO, não do acaso da largura:
   * "BIGGER / PERSPECTIVE / BOLDER LEADERSHIP" tem três linhas, e as duas
   * primeiras cabem folgadas numa linha só. Uma string única com `text-balance`
   * entregaria "BIGGER PERSPECTIVE / BOLDER LEADERSHIP" e perderia o ritmo de
   * três tempos que as três fotos repetem.
   *
   * ⏳ SÓ O SENIOR LEADERSHIP DEVELOPMENT TEM. Ausente = a foto fica sem a
   * sobreposição de baixo, e só com o rótulo em cima.
   */
  credential?: string[];
  /**
   * A LISTA "FOCUS ON" DO PÉ DO CARTÃO — 24-09, com o layout de Women’s
   * Leadership Development: os temas que aquela trilha trabalha, atrás de um
   * filete vermelho.
   *
   * ⚠️ NÃO É UM SEGUNDO `body`. O parágrafo diz PARA QUEM a trilha serve ("For
   * organisations wanting to…"); esta lista diz O QUE ela treina. Emendá-los
   * num texto só daria um parágrafo que muda de assunto no meio.
   *
   * ⚠️ O RÓTULO "FOCUS ON" É DO COMPONENTE, e não deste campo — ele é o mesmo
   * nos três cartões do desenho. Ver a caixa em `SolutionAudiences`.
   *
   * ⏳ UM DOS DEZ TEM. Ausente = o cartão termina no parágrafo, como nos
   * outros.
   */
  focus?: string[];
};

/**
 * O FECHO CENTRADO do mockup de 21-09 — duas linhas em serifa, com um filete
 * vermelho de cada lado, centradas na altura do par: a primeira em tinta
 * escura, a segunda em vermelho.
 *
 * No Senior Leadership Development: *"Different organisations. Different
 * transformations."* / *"Leadership that makes it happen."*
 *
 * ⚠️ NÃO É O CTA, e a diferença importa para quem for "consolidar os dois". O
 * `SolutionCta` é a faixa vermelha com botão, e o mockup NÃO a desenha — o
 * desenho acaba aqui, nesta frase. Este bloco é uma assinatura editorial: não
 * tem botão, não tem link e não pede nada. Os dois convivem na página de hoje
 * porque o mockup só cobre até aqui e o resto (evidência, convite, related)
 * ficou sem referência visual — ver a caixa de abertura de `SolutionView`.
 *
 * ⏳ SÓ O PRIMEIRO SERVIÇO TEM. Ausente = o bloco não renderiza.
 */
export type ServiceClosing = {
  /** A primeira linha, em tinta escura. */
  lead: string;
  /** A segunda linha, em vermelho. */
  accent: string;
};

/**
 * A FAIXA CURTA QUE SUBSTITUIU O "HOW WE WORK" EM 21-09 (segunda revisão).
 *
 * A imagem `docs/meetings/secao-atualizada-our-work.jpg` é a SEGUNDA referência
 * que a anotação da call menciona — ela estava na pasta desde o começo, mas as
 * notas só nomeavam a primeira, então o re-layout foi construído sem ela. Nesta
 * versão o bloco de duas colunas "How we work" e a fileira de oito ícones dão
 * lugar a uma tira só: três práticas com ícone.
 *
 * ⛔ O RÓTULO "A COMMON OUTCOME" ESTEVE AQUI, num campo `lead`, e saiu no
 * mesmo dia a pedido — *"pode tirar essa frase e deixar só os ícones"*. Ele era
 * uma célula vermelha sem ícone à esquerda, e nomeava o que os itens à direita
 * tinham em comum. O campo saiu junto em vez de virar opcional nunca
 * preenchido.
 *
 * ⛔ O COMPONENTE PRÓPRIO TAMBÉM SAIU. Esta lista teve, por algumas horas, um
 * `SolutionPractices` com ícone à ESQUERDA do rótulo, que era o arranjo da
 * segunda imagem. Com o pedido seguinte — pôr nesta seção os oito ícones do
 * primeiro desenho — os dois desenhos convergiram para o mesmo arranjo, o de
 * ícone ACIMA do rótulo, e o componente virou cópia do `SolutionPillars`. Hoje
 * a fileira é uma só para os dez serviços; o que muda é a lista.
 *
 * ⏳ SÓ O PRIMEIRO SERVIÇO TEM. Ausente = o serviço continua exatamente como
 * estava, com o bloco "How we work" e os `pillars`. É a mesma guarda de
 * `audiences` e `closing`, e é o que impede esta segunda revisão de esvaziar as
 * outras nove páginas, que nunca receberam a copy nova.
 */
export type ServicePractices = {
  /** As práticas, com ícone. O mapa rótulo→ícone vive no componente. */
  items: string[];
};

/**
 * ============================================================================
 * AS PEÇAS DO LAYOUT DE FAMILY BUSINESS CONSULTING — 24-09
 * ============================================================================
 *
 * Duas imagens, uma página só. O layout traz TRÊS blocos que o template não
 * tinha: a faixa "Two systems. One future.", a faixa rosa "Where we typically
 * enter" e o fecho "The outcome" com o "Our experience" ao lado.
 *
 * ⚠️ NENHUM DELES SUBSTITUI NADA, como em todas as rodadas anteriores: cada um
 * é campo opcional, e serviço que não o tem simplesmente não desenha aquele
 * bloco. As outras nove páginas não sentem esta rodada.
 *
 * O resto da página cai em campos que JÁ EXISTIAM — `heroBody` (os dois
 * parágrafos da dobra), `howWeWorkHeadline` + `steps` (os seis passos) e
 * `shifts` (os pares "de → para"). Foi o que o template já tinha a ganhar de
 * "one template, ten instances".
 */

/** Um item da fileira sob um dos dois painéis — rótulo e uma linha. */
export type ServiceSystemItem = {
  /**
   * ⚠️ É TAMBÉM A CHAVE DO ÍCONE. O glifo vem do mapa de `SolutionPillars`, que
   * casa por string EXATA — a mesma regra de `inflectionPoints`. Pôr a chave
   * num campo próprio criaria um segundo lugar onde a mesma decisão mora.
   */
  label: string;
  /** A linha de descrição, abaixo do rótulo. */
  body: string;
};

/** Um dos dois painéis de "Two systems. One future.". */
export type ServiceSystemPanel = {
  /** O título em caixa alta dentro da barra de cor ("THE FAMILY"). */
  title: string;
  /** A linha de apoio, dentro da mesma barra. */
  lead: string;
  /** O parágrafo abaixo da barra. */
  body: string;
  /** A chave do ícone da barra, no mapa genérico de `SolutionTwoSystems`. */
  icon?: string;
  items: ServiceSystemItem[];
};

/**
 * A FAIXA "TWO SYSTEMS. ONE FUTURE." — ver `SolutionTwoSystems`.
 *
 * ⏳ UM DOS DEZ TEM.
 */
export type ServiceTwoSystems = {
  label?: string;
  family: ServiceSystemPanel;
  business: ServiceSystemPanel;
  /**
   * O DIAGRAMA DE VENN DO MEIO, escrito e não desenhado: as palavras dentro dos
   * dois círculos são copy da cliente, e num PNG deixariam de ser legíveis,
   * traduzíveis e editáveis. O componente monta os círculos em SVG.
   */
  venn: {
    leftTitle: string;
    leftWords: string[];
    rightTitle: string;
    rightWords: string[];
    /** O fecho em caixa alta sob o diagrama. */
    note: string;
  };
};

/**
 * A FAIXA ROSA "WHERE WE TYPICALLY ENTER" — ver `SolutionEntryPoints`.
 *
 * ⚠️ OS ITENS SÃO STRINGS, E NÃO OBJETOS COM ÍCONE, pela mesma razão de
 * `ServiceInflectionPoints`: o glifo vem do mapa de `SolutionPillars`, que casa
 * pelo rótulo exato.
 *
 * ⏳ UM DOS DEZ TEM.
 */
export type ServiceEntryPoints = {
  label?: string;
  items: string[];
  /** A primeira linha do fecho, em tinta escura. */
  noteLead: string;
  /** A segunda, em vermelho. É a mesma anatomia do `ServiceClosing`. */
  noteAccent: string;
};

/**
 * O FECHO "THE OUTCOME" — ver `SolutionOutcome`.
 *
 * ⚠️ NÃO É O CAMPO `outcome`, que é o corpo do bloco "What we do" e vem do
 * `CDNA_03_Services.docx`. Este é uma FAIXA do layout, com manchete própria,
 * quatro resultados ilustrados e a caixa de cor. Os dois convivem na mesma
 * página de propósito.
 *
 * ⏳ UM DOS DEZ TEM.
 */
export type ServiceOutcomeSummary = {
  label?: string;
  headline: string;
  /**
   * Os quatro resultados. ⚠️ O PONTO FINAL FAZ PARTE DO ITEM e também é a chave
   * do ícone — a mesma armadilha de `commonOutcome`.
   */
  items: string[];
  /**
   * AS TRÊS LINHAS DA CAIXA DE COR, uma por item e não um texto com `\n`: são
   * três afirmações, e deixá-las refluir juntaria duas na mesma linha em tela
   * larga.
   */
  note: string[];
  /**
   * O "OUR EXPERIENCE" da coluna da direita.
   *
   * ⚠️ NÃO É O `evidenceSummary.experience`. Aquele apresenta uma FILEIRA DE
   * LOGOS e vive dentro da faixa de evidência; este é um parágrafo solto ao
   * lado do resultado, e esta página não tem logos.
   */
  experience?: { label?: string; body: string };
};

export type Service = {
  slug: string;
  title: string;
  /** A "banner statement" do outline: uma frase, no herói, sob o nome. */
  banner: string;
  /**
   * ⚠️ A FRASE DO HERÓI QUANDO ELA NÃO É A `banner` — 24-09.
   *
   * Até aqui o herói das dez páginas mostrava a `banner`, e havia uma caixa
   * inteira no `SolutionView` explicando por que a frase do mockup de 21-09
   * (*"For the leaders who shape what comes next."*) tinha sido RECUSADA: a
   * `banner` é copy marcada como FINAL no `CDNA_03_Services.docx` e no
   * `WEBSITE SERVICE COPY.xlsx`, e trocá-la por uma frase que só existia
   * desenhada seria decidir copy no lugar da cliente.
   *
   * ✅ O QUE MUDOU: a frase voltou no layout de 24-09, que é material aprovado
   * e posterior, e a decisão de usá-la foi tomada por escrito. Ou seja, não é
   * mais frase solta de mockup — é a copy do herói desta página.
   *
   * ⚠️ A `banner` NÃO FOI APAGADA, e é isso que segura o resto de pé: ela
   * continua alimentando o card desta página na `/services`, o card dela no
   * "Related services" das outras nove e a `description` da metadata (o
   * `og:description` e o snippet do Google). Ver `generateMetadata` em
   * `app/services/[slug]/page.tsx` e o `ServiceCard`. Trocar a `banner` teria
   * mudado os quatro lugares de uma vez; este campo muda um.
   *
   * ⏳ UM DOS DEZ TEM. Ausente = o herói segue mostrando a `banner`, como
   * sempre — a mesma guarda de `whatWeDo`, `audiences` e `practices`.
   */
  heroSubtitle?: string;
  /**
   * OS PARÁGRAFOS DENTRO DO HERÓI — 24-09, com o layout do Talent Development,
   * o primeiro dos dez a escrever corpo na dobra em vez de só a frase de apoio.
   *
   * ⚠️ NÃO É UM SEGUNDO `heroSubtitle`. A frase de apoio é a AFIRMAÇÃO da
   * página (uma linha, corpo grande); estes são explicação, em corpo menor.
   * Postos na mesma medida, o herói ficaria com três blocos de texto de peso
   * igual e a manchete perderia o lugar — ver a caixa na marcação do
   * `SolutionHero`.
   *
   * ⚠️ UM ITEM POR PARÁGRAFO, e não um texto com `
`: o componente desenha um
   * `<p>` por item. O layout do Talent Development traz dois.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  heroBody?: string[];
  /**
   * Bloco 2 — The Outcome. O que muda no negócio.
   *
   * O `**…**` é o negrito que a cliente marcou na planilha (`WEBSITE SERVICE
   * COPY.xlsx`) — na renderização vira `<strong>`, ver `paragraphs()`.
   */
  /**
   * A MANCHETE DO BLOCO IMPACT — a frase grande da COLUNA ESQUERDA, ao lado do
   * parágrafo de `outcome`. Entrou em 17-09, quando os dois primeiros blocos
   * foram refeitos no arranjo do template dela (`4. Services/ExCo Leadership
   * Services Page.png`): lá cada um é manchete à esquerda, fio vertical, corpo à
   * direita — e a manchete é um texto que NÃO EXISTIA em lugar nenhum do nosso
   * dado. O documento de Services dá `outcome` e `howWeHelp`, que são os corpos.
   *
   * ⏳ UM DOS DEZ TEM A FRASE DE VERDADE. O template dela desenha o Top 150, e
   * as duas manchetes estão escritas lá em letra: *"A stronger, more connected
   * senior leadership community."* e *"From ambition to enterprise leadership in
   * practice."* São dela, não nossas, e por isso entram. Nos outros nove cai o
   * `HEADLINE_PLACEHOLDER` — ver a caixa dele.
   */
  outcomeHeadline?: string;
  outcome: string;
  /**
   * ============================================================================
   * "WHAT WE DO" — A MESMA CAIXA DE DUAS COLUNAS, COPY NOVA, 21-09
   * ============================================================================
   *
   * O mockup de 21-09 renomeia o primeiro bloco de duas colunas de "IMPACT"
   * para "WHAT WE DO" e escreve, em letra, uma manchete e DOIS parágrafos que
   * não são o `outcome` — o `outcome` fala do que MUDA no negócio ("greater
   * strategic alignment, decision quality and execution speed"), e o texto novo
   * fala de com quem a CDNA trabalha e como a jornada é desenhada.
   *
   * ⚠️ O `outcome` NÃO FOI APAGADO, e é isso que segura os outros nove de pé:
   * sem `whatWeDo`, o bloco cai no `outcome` e naquelas páginas o que muda é só
   * o rótulo em cima. Ou seja, a copy do `CDNA_03_Services.docx` continua
   * inteira e publicada — ela apenas deixou de ser a única fonte deste bloco.
   *
   * ⚠️ O RÓTULO CONTRADIZ O TEXTO NOS NOVE, e é preciso dizer em voz alta em vez
   * de descobrir na revisão: "WHAT WE DO" em cima de um parágrafo de RESULTADO
   * lê torto. A alternativa era manter dois rótulos diferentes conforme o
   * serviço tivesse ou não a copy nova — o que daria dez páginas de estruturas
   * diferentes, que é exatamente o que "one template, ten instances" existe para
   * impedir. O conserto é de CONTEÚDO: os nove precisam do texto de "what we do"
   * que a cliente escreveu para o primeiro.
   *
   * ⏳ FALTAM NOVE. Só o Senior Leadership Development tem — é o serviço que o
   * mockup desenha.
   */
  whatWeDoHeadline?: string;
  /** O corpo de "What we do". Mesma marcação `**…**` do `outcome`. */
  whatWeDo?: string;
  /**
   * O BLOCO "WHAT WE DO" NÃO DESENHA NESTA PÁGINA — 24-09, a pedido, com o
   * Talent Development: *"What we do pode remover"*.
   *
   * ⚠️ É UM OPT-OUT, E NÃO UMA GUARDA POR CONTEÚDO, de propósito. A tentação é
   * esconder o bloco sempre que a manchete for o `HEADLINE_PLACEHOLDER` — e
   * isso o apagaria de CINCO serviços de uma vez, sem ninguém ter pedido. O
   * placeholder é uma pendência de copy visível, que é o trabalho dele; aqui o
   * caso é outro: o layout de 24-09 simplesmente NÃO desenha esta faixa, e o
   * que ela diria já está escrito nos dois parágrafos do herói.
   *
   * ⚠️ O `outcome` CONTINUA NO DADO E SAI DA TELA. Ele era o corpo deste bloco e
   * não é lido por mais ninguém (o card do índice usa `banner`, e o `outcome` do
   * `SolutionBoxList` vem do CMS, não daqui). Ou seja, a frase do
   * `CDNA_03_Services.docx` deixa de ser publicada NESTE serviço — o campo fica
   * porque é o caminho de volta e porque `tests/services.test.ts` continua
   * exigindo-o nos dez.
   *
   * ⚠️ A TELA DO /edit PERDE A SEÇÃO JUNTO. Deixá-la lá ofereceria dois campos
   * que não chegam a lugar nenhum — ver `sectionsFor` em
   * `lib/service-pages-copy.ts`, e o teste que casa as duas coisas.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  hideWhatWeDo?: boolean;
  /**
   * Bloco 3 — How CorporateDNA Helps. A intervenção.
   *
   * Mesma regra do `outcome`: `**…**` é o negrito da planilha da cliente e vira
   * `<strong>` na renderização, ver `paragraphs()`.
   */
  /** A manchete do bloco How we help. Mesma história do `outcomeHeadline`. */
  howWeHelpHeadline?: string;
  howWeHelp: string;
  /**
   * "HOW WE WORK" — o segundo bloco de duas colunas do mockup de 21-09, com a
   * mesma história de `whatWeDo`: rótulo novo, copy nova onde ela existe,
   * `howWeHelpHeadline`/`howWeHelp` como base nos outros nove.
   *
   * Aqui a torção de rótulo é MENOR que no bloco de cima — "how we help" e "how
   * we work" descrevem a mesma coisa vista de dois lados —, então os nove
   * continuam lendo direito sob o rótulo novo.
   *
   * ⏳ FALTAM NOVE.
   */
  howWeWorkHeadline?: string;
  /** O corpo de "How we work". Mesma marcação `**…**` do `howWeHelp`. */
  howWeWork?: string;
  /**
   * Os termos da frase de "what CDNA does to help", promovidos a rótulo — o que
   * o template dela mostra como cartões com ícone sob aquele bloco. CINCO é o
   * que o mockup do ExCo mostra; o número real por serviço é o da própria frase
   * (de quatro a seis, ver o teste de `pillars`), não uma contagem fixa.
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
  /**
   * Os cartões de público do mockup de 21-09 — ver a caixa de
   * `ServiceAudience`. Ausente ou vazio = a faixa não renderiza.
   *
   * ⏳ DOIS DOS DEZ TÊM: três cartões no Senior Leadership Development e quatro
   * no Talent Development. A contagem muda a grade, e a conta está em
   * `SolutionAudiences`.
   */
  audiences?: ServiceAudience[];
  /**
   * O RÓTULO ACIMA DOS CARTÕES DE PÚBLICO — 24-09, com o "Where we work" do
   * Talent Development.
   *
   * ⚠️ NASCE VAZIO, E O SENIOR LEADERSHIP DEVELOPMENT NÃO DEVE GANHAR UM: lá os
   * cartões são a continuação visual do "What we do" logo acima, que já escreveu
   * rótulo e manchete, e o mockup de 21-09 não desenha rótulo nenhum sobre eles.
   * No Talent Development a grade de ladrilhos entra entre os dois blocos, então
   * os cartões deixam de encostar no bloco que os explicava.
   *
   * ⚠️ CAMPO SOLTO E NÃO UM OBJETO EM VOLTA DE `audiences` (como o
   * `capabilitiesHeader` faz): mudar a forma daquele campo obrigaria a mexer no
   * outro serviço para que nada mude na tela dele. Se um dia esta faixa ganhar
   * manchete própria, aí sim vale o objeto — e será uma migração de dois
   * serviços, não de um.
   */
  audiencesLabel?: string;
  /**
   * A FAIXA ROSA DE UMA LINHA QUE FECHA OS CARTÕES DE PÚBLICO — 24-09, com o
   * layout de Women’s Leadership Development: *"One ambition: stronger
   * pipelines, greater progression and more women leading at every level."*
   *
   * ⚠️ NÃO É O `closing` NEM O `stepsFlow`. O `closing` é a assinatura em
   * serifa de duas linhas sobre branco, no pé da página; o `stepsFlow` é o
   * campo vermelho cheio que resume a sequência de passos. Esta é a frase que
   * amarra as TRÊS trilhas de público numa ambição só, e mora entre elas e o
   * "How we work". Ver `SolutionAmbition`.
   *
   * ⚠️ ESCRITA COMO FRASE, não em caixa alta: o versalete é CSS. Ver a caixa no
   * componente.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  ambition?: string;
  /**
   * O fecho centrado de duas linhas do mockup de 21-09 — ver a caixa de
   * `ServiceClosing`. Ausente = o bloco não renderiza.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  closing?: ServiceClosing;
  /**
   * A tira de práticas da segunda revisão de 21-09 — ver a caixa de
   * `ServicePractices`.
   *
   * ⚠️ A PRESENÇA DESTE CAMPO É O INTERRUPTOR DO LAYOUT NOVO, e não só a fonte
   * de uma lista: quem o tem perde o bloco de duas colunas "How we work" e a
   * fileira de `pillars`, e ganha esta tira seguida do divisor "Featured case
   * study". Quem não o tem segue na versão anterior, inteira. A conta está em
   * `SolutionView`.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  practices?: ServicePractices;
  /** Bloco 6 — as três partes que o outline chama de "all thirty parts". */
  cta: { strapline: string; line: string; label: string };
  evidence?: ServiceEvidence;
  /**
   * A faixa de evidência do layout de 24-09 — ver a caixa de
   * `ServiceEvidenceSummary`.
   *
   * ⚠️ EXCLUDENTE COM `evidence` NA PRÁTICA, ainda que o tipo permita os dois:
   * as duas faixas têm o mesmo rótulo ("Evidence") e o mesmo lugar na página,
   * então um serviço com os dois desenharia a palavra duas vezes. `SolutionView`
   * dá precedência a este e o teste `tests/services.test.ts` fixa a regra.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  evidenceSummary?: ServiceEvidenceSummary;
  /**
   * Os três cartões de cliente do layout de 24-09 — ver `ServiceEvidenceCases`.
   *
   * ⚠️ EXCLUDENTE COM `evidence` E COM `evidenceSummary`, pela mesma conta que
   * já valia entre aqueles dois: as três faixas escrevem "Evidence" e ocupam o
   * mesmo lugar. `SolutionView` dá precedência a esta e o teste em
   * `tests/services.test.ts` fixa a regra.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  evidenceCases?: ServiceEvidenceCases;
  /**
   * ⚠️ O INTERRUPTOR DO ARRANJO DOS DOIS BLOCOS DE TEXTO — 24-09.
   *
   * O template desenha "What we do" e "How we work" em DUAS COLUNAS: manchete à
   * esquerda, fio vertical, corpo à direita. O layout de Manager Development
   * desenha os dois EMPILHADOS — rótulo, manchete de largura inteira, uma linha
   * de apoio embaixo — porque o corpo ali é uma frase só, e uma frase só numa
   * coluna de 60% ao lado de uma manchete de duas linhas deixa um buraco no
   * meio da faixa.
   *
   * UM CAMPO PARA OS DOIS BLOCOS, e não um por bloco: no layout os dois mudam
   * juntos, e dois campos dariam quatro combinações das quais duas ninguém
   * pediu. Ver a prop `layout` de `SolutionSection`.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  sectionLayout?: "split" | "stacked";
  /**
   * As duas trilhas do layout de 24-09 — ver `ServicePathway`. Ausente ou
   * vazio = a faixa não renderiza.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  pathways?: ServicePathway[];
  /** A grade de momentos — ver `ServiceMoments`. ⏳ UM DOS DEZ TEM. */
  moments?: ServiceMoments;
  /**
   * A fileira numerada de "How we work" — ver `ServiceStep`.
   *
   * ⚠️ SUBSTITUI A FILEIRA DE `practices`/`pillars` no serviço que o tem: as
   * duas ocupam o mesmo lugar, logo abaixo do bloco "How we work". A conta está
   * em `SolutionView`.
   *
   * ⏳ DOIS DOS DEZ TÊM.
   */
  steps?: ServiceStep[];
  /**
   * A FAIXA VERMELHA DE UMA LINHA NO PÉ DA SEQUÊNCIA — 24-09, com o Talent
   * Development: *"From business need → to talent bet → to readiness → to
   * measurable value."*
   *
   * ⚠️ NÃO É UM OITAVO PASSO, e é por isso que não entra em `steps`: ela RESUME
   * a sequência inteira numa frase. Na lista, faria o leitor de tela anunciar
   * oito etapas onde há sete.
   *
   * ⚠️ AS SETAS SÃO TEXTO NO DADO, e não glifo injetado pelo componente — a
   * frase é uma só, e parti-la para desenhar ícone entre os pedaços a faria ser
   * lida como quatro fragmentos soltos. Ver a prop `flow` em `SolutionSteps`.
   *
   * ⚠️ SEM `steps` ELA NÃO DESENHA, porque mora dentro daquele componente. Não é
   * uma faixa autônoma.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  stepsFlow?: string;
  /**
   * A NOTA DE RODAPÉ DA FILEIRA DE PASSOS — 24-09, com o layout de Women’s
   * Leadership Development: *"Learning is deliberately connected to the real
   * roles, relationships, career moments and organisational systems women are
   * navigating every day."*
   *
   * ⚠️ NÃO É O `stepsFlow`, e os dois podem conviver sem se atropelar: aquele é
   * um campo vermelho cheio que RESUME a sequência; esta é uma linha em corpo
   * pequeno, atrás de um filete, que a QUALIFICA. Ver a prop `note` em
   * `SolutionSteps`.
   *
   * ⚠️ SEM `steps` ELA NÃO DESENHA, porque mora dentro daquele componente.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  stepsNote?: string;
  /**
   * OS EIXOS QUE O SERVIÇO FORTALECE — a fileira de disco, ícone, título e
   * descrição que divide a faixa branca com o "What we do". 24-09, com a
   * migração da HRLT para o template.
   *
   * ⚠️ MESMA FORMA QUE `steps`, SIGNIFICADO DIFERENTE, e é essa distinção que
   * decide qual campo usar: `steps` é uma SEQUÊNCIA (Discover → Co-create →
   * Experience…) e sai com seta e `<ol>`; estes são uma LISTA de itens de igual
   * peso e saem sem seta, em `<ul>`. Reordenar os `steps` muda o que a CDNA
   * afirma que acontece primeiro; reordenar estes não muda nada.
   *
   * Os dois passam pelo mesmo `SolutionSteps`, em slots diferentes da página —
   * ver a prop `sequence` dele.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  capabilities?: ServiceStep[];
  /**
   * O CABEÇALHO DA FILEIRA DE `capabilities` — 24-09, com os aceleradores do
   * Talent Development.
   *
   * ⚠️ CAMPO SEPARADO E NÃO UM OBJETO EM VOLTA DE `capabilities`, porque
   * mudar a forma daquele campo quebraria a HRLT, que já o usa como lista pura.
   *
   * ⚠️ A HRLT NÃO TEM E NÃO DEVE TER: lá a fileira é a continuação visual do
   * bloco "What we do" logo acima, que já escreveu rótulo e manchete. Aqui ela
   * é uma faixa autônoma. A guarda está no próprio `SolutionSteps`.
   */
  capabilitiesHeader?: { label?: string; headline?: string; lead?: string };
  /**
   * OS `capabilities` À DIREITA DO "WHAT WE DO", e não numa fileira abaixo
   * dele — 24-09, com o layout do Executive Coaching. Ver `SolutionStandouts`
   * e a prop `aside` do `SolutionSection`. Só `capabilitiesHeader.label` é
   * lido nesse arranjo.
   */
  capabilitiesBeside?: boolean;
  /**
   * COMO CADA ITEM DA FILEIRA DE `capabilities` SE ARRUMA — 24-09, a pedido,
   * com os aceleradores do Talent Development.
   *
   * `aside` põe o glifo à ESQUERDA, o título e a descrição à direita dele, e um
   * filete vertical entre uma célula e a seguinte, que é o que o layout
   * desenha. Ausente = o arranjo de sempre (disco em cima, texto embaixo,
   * centrado), que é o da HRLT e o dos passos de "How we work".
   *
   * ⚠️ VALE SÓ PARA `capabilities`, e não para `steps`: são duas fileiras
   * diferentes na mesma página, e a de baixo segue o desenho da sequência. Se
   * um dia a de baixo precisar do mesmo arranjo, é outro campo — a prop no
   * `SolutionSteps` já existe para os dois.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  capabilitiesLayout?: "stacked" | "aside";
  /**
   * A GRADE DE LADRILHOS DE "The inflection points" — ver
   * `ServiceInflectionPoints`. Desenha logo abaixo do bloco "What we do".
   *
   * ⏳ UM DOS DEZ TEM.
   */
  inflectionPoints?: ServiceInflectionPoints;
  /**
   * A FILEIRA "Common outcome" — ver `ServiceCommonOutcome`. Desenha entre os
   * `capabilities` e o bloco "How we work".
   *
   * ⏳ UM DOS DEZ TEM.
   */
  commonOutcome?: ServiceCommonOutcome;
  /**
   * A LISTA "What shifts" — ver `ServiceShifts`. Desenha logo abaixo da fileira
   * de `steps`.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  shifts?: ServiceShifts;
  /**
   * A faixa escura de "How we work" do layout de Culture — ver
   * `ServiceEcosystem`.
   *
   * ⚠️ SUBSTITUI o bloco de duas colunas "How we work" E a fileira de
   * `steps`/`practices`/`pillars` que viria abaixo dele: no layout aquela faixa
   * ocupa sozinha o lugar dos dois. A conta está em `SolutionView`.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  ecosystem?: ServiceEcosystem;
  /**
   * Os três cartões de prova do layout de Culture — ver `ServiceProof`.
   * Ausente = a faixa não renderiza.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  proof?: ServiceProof;
  testimonial?: ServiceTestimonial;
  /**
   * A imagem do card no índice `/services` — item 12 da daily de 14-09:
   * *"a bit of image, just to call out each of the [services]."*
   *
   * ✅ OS DEZ TÊM, E SÃO AS DELA, desde 17-09 — *"trocar as imagens pelas do
   * drive"*. Vieram na pasta `4. Services` como um PNG por serviço, com o nome
   * do serviço no arquivo, então o casamento slug ↔ arquivo não teve adivinhação.
   *
   * ⚠️ O SUFIXO `-client` NO NOME NÃO É ENFEITE. Os arquivos anteriores tinham
   * exatamente estes slugs, e `cardImage` é um CAMINHO DE TEXTO, não um import —
   * o otimizador do Next guarda por URL, e reaproveitar o mesmo endereço com
   * conteúdo novo é como se serve versão velha em produção. Já aconteceu neste
   * projeto. O sufixo também diz a origem, que é o que distingue este jogo do
   * anterior: aqueles eram escolha NOSSA, estes são material DELA.
   *
   * O QUE SAIU DE CIRCULAÇÃO, e por que o registro fica: eram nove arquivos de
   * duas origens — seis banners do site ANTIGO recortadas em 16:10, e três
   * imagens GERADAS que o Ricardo escolheu em 15-09 (Manager Development,
   * Judgement in AI e Family Business Consulting), porque o site velho não tinha
   * esses serviços e não existia foto deles em lugar nenhum. Era o "use generic
   * for now" dela, e o texto anterior desta caixa dizia que quando as definitivas
   * chegassem seria "trocar nove caminhos e acrescentar um". Foi isso, à letra.
   * Os nove seguem em `public/services/cards/` sem o sufixo, sem uso — dá para
   * apagá-los a qualquer momento, o git os tem.
   *
   * ⏳ O DÉCIMO É NOVO: HRLT Effectiveness nunca teve arquivo (serviço novo, sem
   * acervo) e caía no campo de cor. O campo de cor CONTINUA no `ServiceCard`, e
   * continua sendo o comportamento certo para `cardImage` vazio — hoje nenhum
   * dos dez o exercita, e é de propósito que ele não foi removido junto.
   *
   * ⚠️ DUAS DELAS SÃO PANORÂMICAS (Family Business Consulting e Judgement in AI,
   * 2159x728 ≈ 3:1) e o slot do card é 16:10. O recorte perde 46% da largura, e
   * por isso as duas NÃO saíram de recorte centrado como as outras oito: a
   * oliveira da Family Business mora no terço direito do quadro e um corte ao
   * centro a partia ao meio. O recorte dela começa em `left: 994`, encostado na
   * margem direita, o que mantém a árvore inteira e a põe a 44% da largura do
   * card. Se o arquivo for trocado, esta conta é para refazer, não para herdar.
   */
  cardImage?: string;
  /**
   * ⚠️ A FOTO DO HERÓI QUANDO ELA NÃO É A DO CARD — 24-09.
   *
   * Desde 17-09 o herói da interna mostra a MESMA foto do card da listagem, e
   * aquela decisão tem um argumento que não envelheceu: o leitor clica num card
   * e chega a uma dobra que é a ampliação do que ele acabou de ver. Antes disso
   * as dez internas dividiam uma foto genérica só, e as duas telas pareciam de
   * sites diferentes.
   *
   * ⚠️ ESTE CAMPO DESFAZ ESSA CONTINUIDADE NO SERVIÇO QUE O USA, e é preciso
   * dizer em voz alta em vez de descobrir na revisão: card e herói passam a ser
   * fotos diferentes, que é exatamente o defeito que 17-09 consertou. Entrou
   * assim porque o pedido de 24-09 é sobre o HERÓI — *"Hero: imagem da escada
   * com pessoas"* —, e a foto do card da `/services` é material da cliente,
   * escolhido por ela em 17-09, numa página que este pedido não menciona.
   * Trocar as duas de uma vez mudaria em silêncio uma página que ninguém
   * mandou mexer.
   *
   * ✅ A CONTINUIDADE VOLTOU EM 24-09, pelo outro lado: o `ServiceCard` passou
   * a mostrar `heroImage ?? cardImage`, a pedido (*"as imagens da lista estão
   * antigas, pega as imagens dos heros"*). O `cardImage` só aparece hoje em
   * quem não tem `heroImage`.
   *
   * Ausente = o herói segue mostrando o `cardImage`, e quem não tem nenhum dos
   * dois cai na `service-hero-fallback.jpg`.
   */
  heroImage?: string;
  /**
   * O RÓTULO DO HERÓI QUANDO ELE NÃO É "Our Services" — 24-09, com o layout de
   * Family Business Consulting, que escreve "FAMILY-LED BUSINESS CONSULTING"
   * acima da manchete.
   *
   * ⚠️ O PADRÃO NÃO MUDOU E NÃO DEVE MUDAR. "Our Services" é o rótulo acertado
   * com a cliente em 08-09 — é o que o menu diz e o que o índice escreve —, e
   * ele é o que dá ao leitor a noção de ONDE ele está. Este campo é exceção de
   * uma página, não um rótulo por serviço.
   *
   * ⏳ UM DOS DEZ TEM. Ausente = "Our Services", como sempre.
   */
  heroEyebrow?: string;
  /**
   * A SEGUNDA METADE DA MANCHETE DO HERÓI, EM VERMELHO — 24-09.
   *
   * O layout de Family Business Consulting escreve a manchete em duas cores:
   * *"Protecting the legacy."* em tinta escura e *"Preparing the family and
   * business for what comes next."* em vermelho, uma debaixo da outra.
   *
   * ⚠️ NO NOSSO HERÓI A COR ESCURA VIRA BRANCA, e não é liberdade: aquele
   * layout põe a manchete sobre papel branco, e este herói é fotografia de
   * sangria total com escurecimento por cima. O vermelho também troca de tom
   * (`brand-light`), pela regra de uma linha do `globals.css` — `brand` em
   * fundo claro, `brand-light` em fundo escuro.
   *
   * ⚠️ NÃO É O `h1`. A manchete do layout mora no `heroSubtitle` e este campo é
   * a continuação dela; o `h1` continua sendo o NOME do serviço, que alimenta o
   * menu e a metadata. É o mesmo arranjo do Talent Development e da Culture
   * Transformation.
   *
   * ⏳ UM DOS DEZ TEM. Ausente = a frase de apoio termina onde sempre terminou.
   */
  heroSubtitleAccent?: string;
  /**
   * A COLUNA DE PALAVRAS NO CANTO DA DOBRA — 24-09: *"PEOPLE / FAMILIES /
   * BUSINESSES / A BRIGHTER TOMORROW."*
   *
   * ⚠️ UM ITEM POR LINHA, e as quebras são do desenho: as quatro cabem folgadas
   * numa linha só, e deixá-las refluir perderia a escada que o layout monta.
   * É a mesma decisão do `credential` de `ServiceAudience`.
   *
   * ⏳ DOIS DOS DEZ TÊM — a Family Business Consulting, que a caixa acima
   * descreve, e a Women’s Leadership Development (*"People / Perspective /
   * Possibilities"*). SÓ NO DESKTOP — ver a prop no `SolutionHero`.
   */
  heroCredential?: string[];
  /**
   * A NUMERAÇÃO DA FILEIRA DE `steps` — ver a prop `numbered` do
   * `SolutionSteps`.
   *
   * ⚠️ O PADRÃO É SEM NÚMERO, e isso é pedido de 24-09 (*"na seção How we work
   * pode tirar os numeros"*) sobre o layout de Manager Development. Os layouts
   * de Executive Coaching e de Family Business Consulting desenham os passos
   * numerados — dois desenhos para a mesma fileira, e é o dado que decide.
   */
  stepsNumbered?: boolean;
  /** Ícone nu e escuro nos `steps`, sem o disco rosa — ver `plainIcons` no
   *  `SolutionSteps`. */
  stepsPlainIcons?: boolean;
  /**
   * A faixa "Two systems. One future." — ver `ServiceTwoSystems`. Desenha logo
   * abaixo do bloco "What we do".
   *
   * ⏳ UM DOS DEZ TEM.
   */
  twoSystems?: ServiceTwoSystems;
  /**
   * A faixa rosa "Where we typically enter" — ver `ServiceEntryPoints`. Desenha
   * entre a faixa dos dois sistemas e o bloco "How we work".
   *
   * ⏳ UM DOS DEZ TEM.
   */
  entryPoints?: ServiceEntryPoints;
  /**
   * O fecho "The outcome" — ver `ServiceOutcomeSummary`. Desenha logo abaixo da
   * lista de `shifts`.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  outcomeSummary?: ServiceOutcomeSummary;
};

/**
 * A ordem é a do documento, e ela é deliberada: *"Count and order are both
 * settled. Ten services, in the copy sheet sequence, ending with Family Business
 * Consulting. Judgement in AI sits at 8, next to Executive Coaching, which is
 * where the two arguments about decision quality belong anyway."*
 */
export const services: Service[] = [
  {
    slug: "senior-leadership-development",
    /* ⚠️ O NOME DO ARQUIVO CONTINUA "top-150", e não é esquecimento. Ele é o
       caminho de um JPEG em `public/services/cards/`, não parte da URL da
       página; renomeá-lo obrigaria a mexer no disco para que nada mude na tela,
       e o otimizador do Next serve imagem POR URL — nome novo é cache novo,
       gerado à toa. */
    cardImage: "/services/cards/top-150-leadership-development-client.jpg",
    /* ✅ A FOTO DA ESCADA, 24-09 — *"Hero: imagem da escada com pessoas, que o
       Guli já te mandou por e-mail"*. Chegou como PNG de 1897x829 e virou JPEG
       q90 numa ÚNICA compressão (374 KB), que é o tratamento padrão deste repo.

       ⚠️ ELA É 2,29:1 NUMA DOBRA QUE É MAIS QUADRADA QUE ISSO. O herói é
       `84svh` de largura cheia: numa janela de 1440x900 a dobra sai a ~1,9:1, e
       o `object-cover` escala pela ALTURA e come ~17% da largura, metade de cada
       lado. A composição aguenta — a foto é um padrão denso de escadas e pessoas
       do lado direito, sem assunto único a centralizar —, mas NO TELEFONE, que é
       retrato, o corte é severo e sobra a faixa central. É o mesmo
       comportamento das outras nove e está registrado na caixa do `imageUrl` no
       `SolutionView`; se um dia incomodar, `imagePosition` existe no
       `SolutionHero` para ancorar por página.

       ⚠️ NÃO SUBSTITUI O `cardImage` ACIMA, de propósito — ver a caixa de
       `heroImage` no tipo `Service`, que registra o que isso custa.

       ⏳ 1897px DE LARGURA É POUCO PARA SANGRIA TOTAL: num laptop de 1440 com
       tela retina o navegador pede ~2880px e a foto fica macia. A
       `service-hero-fallback.jpg` tinha 3672px e era por isso que aguentava. É o
       mesmo pedido de originais que já está aberto para as fotos dos cards.

       ⚠️ TROCAR O NOME DO ARQUIVO SE O CONTEÚDO MUDAR — o otimizador do Next
       serve imagem por URL e já entregou versão velha neste projeto por causa
       disso. É por isso que a data está no nome. */
    heroImage: "/services/heroes/sld-stairs-24-09.jpg",
    /* ✅ O NOME MUDOU EM 21-09, por email: *"Change top 150 leadership
       development to Senior Leadership Development"*. É o que aparece no card
       do índice, no submenu de Services, na migalha e no `h1` da página — o
       `title` alimenta os quatro.

       ✅ E O SLUG MUDOU DEPOIS, no mesmo dia, a pedido explícito. A primeira
       decisão foi manter `top-150-leadership-development`, porque a rota já
       estava no ar, no sitemap e nos links que a cliente mandou por email, e
       porque rota é endereço e título é copy — a regra que `lib/nav.ts` registra
       na caixa de abertura. Essa caixa dizia também qual seria o caminho certo
       se a URL precisasse mudar: rota nova mais 301 da antiga. É exatamente o
       que foi feito.

       ⚠️ O 308 DA ANTIGA NÃO É OPCIONAL e vive em `next.config.mjs`, junto com
       os outros endereços nossos que mudaram de casa. Sem ele,
       `/services/top-150-leadership-development` passa a dar 404 no dia do
       deploy — e esse endereço não é só teórico: TRÊS redirects do WordPress
       antigo desembocavam nele (`/solutions/exco-top-150`,
       `/solutions/ceo-top-team-transformation`, `/solutions/leadership-development`),
       e os três foram repontados direto para cá para não virarem 308 em cima de
       308. */
    title: "Senior Leadership Development",
    banner:
      "Build enterprise leaders who lead beyond their function and geography into collective leadership at scale.",
    /* ✅ A FRASE DO HERÓI PASSOU A SER A DO LAYOUT em 24-09, por decisão escrita
       — ver a caixa de `heroSubtitle` no tipo `Service`, que guarda por que ela
       tinha sido recusada em 21-09 e o que mudou. A `banner` acima fica: ela
       continua sendo o texto do card e da metadata. */
    heroSubtitle: "For the leaders who shape what comes next.",
    /* ✅ AS DUAS ÚNICAS MANCHETES ESCRITAS PELA CLIENTE. Estão em letra no
       template `4. Services/ExCo Leadership Services Page.png`, que desenha
       justamente esta página. Copiadas à letra, sem reescrita. */
    outcomeHeadline: "A stronger, more connected senior leadership community.",
    outcome:
      "A senior leadership community with greater **strategic alignment, decision quality and execution speed**. Leaders think enterprise first, operate horizontally and collectively own performance, transformation and the leadership pipeline.",
    /* ✅ A COPY DE "WHAT WE DO", TRANSCRITA DO MOCKUP DE 21-09. Está escrita em
       letra em `docs/meetings/nova-pagina-interna-servicoes.jpg`, coluna da
       direita do primeiro bloco, e os negritos abaixo são os que o desenho
       marca — "Executive Teams, SLT/ET-1 leaders", "Top 100–150 leadership
       populations" e "business transformation". Nada foi reescrito.

       ⚠️ NÃO SUBSTITUI O `outcome` LOGO ACIMA, convive com ele. O `outcome` é a
       frase do `CDNA_03_Services.docx` e continua sendo o corpo deste bloco nos
       outros nove serviços — ver a caixa de `whatWeDo` no tipo `Service`. */
    whatWeDoHeadline:
      "We develop leaders at the levels where transformation gets real.",
    whatWeDo:
      "We work with **Executive Teams, SLT/ET-1 leaders** and **Top 100–150 leadership populations** to build the leadership capability their organisation needs for what comes next.\n\nEvery journey starts with your **business transformation**, not a standard curriculum. Whether you are scaling, integrating, reshaping culture, accelerating performance or navigating disruption, we identify the leadership shifts required and design a tailored journey to meet them.",
    howWeHelpHeadline: "From ambition to enterprise leadership in practice.",
    howWeHelp:
      "We work with the ExCo and top 100 to 150 leaders to build the **Inner Game and Outer Game of enterprise leadership**. Through immersive experiences, coaching, real business challenges, peer learning and mastery labs, we shift leaders from **“my function, my market, my priorities” to “our enterprise, our performance, our future.”**",
    /* ✅ A COPY DE "HOW WE WORK", do mesmo mockup — coluna da direita do segundo
       bloco. Os dois negritos são os dele: "Inner Game and Outer Game" e a frase
       de fecho "It changes how they lead every day." */
    howWeWorkHeadline: "Real development.\nIn the flow of work.",
    howWeWork:
      "We develop the **Inner Game and Outer Game** of leadership: how leaders think, judge and show up, and how they translate that into the way they lead people, make decisions, collaborate and deliver performance. Real business challenges, everyday decisions, critical conversations and leadership habits become the practice ground, so development is not something leaders attend. **It changes how they lead every day.**",
    pillars: [
      "Immersive experiences",
      "Coaching",
      "Real business challenges",
      "Peer learning",
      "Mastery labs",
    ],
    /* ✅ OS OITO DO PRIMEIRO MOCKUP, transcritos de
       `docs/meetings/nova-pagina-interna-servicoes.jpg`, a pedido de 21-09.
       A fileira de oito VOLTOU — e este campo já passou por três estados no
       mesmo dia, o que vale registrar porque explica por que ele existe:

         1º  cinco `pillars`, do primeiro mockup, com a dívida anotada de que
             ele desenhava OITO e nós tínhamos cinco;
         2º  quatro células da segunda imagem ("A common outcome" mais hábitos,
             identidade e os momentos que importam), que encurtaram a fileira;
         3º  os oito de novo, agora aqui, com os rótulos e os ícones do desenho.

       ⚠️ É POR ISTO QUE OS OITO NÃO VÃO PARA `pillars`. Aquele campo tem uma
       regra própria — os itens são PALAVRAS LITERAIS da frase de `howWeHelp` —
       e três destes oito ("Leadership experiments", "Everyday habits",
       "Measurement") não estão em frase nenhuma da cliente. Pô-los lá quebraria
       a regra em silêncio e também o teste, que fixa de quatro a seis pilares
       por serviço. Os `pillars` ficam intactos, como caminho de volta; quem
       manda na tela é este campo.

       A DÍVIDA ANOTADA NA CAIXA ABAIXO MORRE AQUI, e de outro jeito que o
       previsto: ela dizia que o conserto dependia de a cliente reescrever a
       frase de `howWeHelp` para os três termos novos aparecerem. Não dependia —
       bastava parar de derivar a fileira daquela frase. */
    practices: {
      items: [
        "Immersions",
        "Live business challenges",
        "Mastery Labs",
        "Coaching",
        "Peer learning",
        "Leadership experiments",
        "Everyday habits",
        "Measurement",
      ],
    },
    /* ⚠️ A FILEIRA DE ÍCONES DO MOCKUP DE 21-09 TEM OITO ITENS E ESTA TEM CINCO,
       e a diferença é deliberada. O desenho lista "Immersions · Live business
       challenges · Mastery Labs · Coaching · Peer learning · Leadership
       experiments · Everyday habits · Measurement"; cinco desses são os cinco
       acima com outro nome, e três são NOVOS (leadership experiments, everyday
       habits, measurement).

       POR QUE NÃO FORAM ACRESCENTADOS: os `pillars` são, por regra deste
       arquivo, as PALAVRAS DA PRÓPRIA FRASE de `howWeHelp` — cada item aparece
       literalmente lá, na mesma ordem. Os três novos não estão na frase de
       nenhum dos dez serviços, e `tests/services.test.ts` fixa a faixa em
       quatro a seis itens por serviço justamente para guardar essa regra. Pôr
       oito aqui quebra o teste e desfaz o vínculo com o texto.

       ⏳ O CAMINHO, se a cliente quiser os oito: ela reescreve a frase de
       `howWeHelp` incluindo os três termos, e aí os oito entram por direito —
       com a faixa do teste alargada de 4–6 para 4–8 no mesmo commit. É pedido
       de copy, não conserto de código. */
    /* ✅ OS TRÊS CARTÕES DE PÚBLICO, transcritos do mockup de 21-09 — ver a
       caixa de `ServiceAudience`. Sem `image` de propósito: as três fotografias
       do desenho não vieram no pacote do Drive e o cartão cai no campo de cor
       até virem. */
    /* ✅ AS TRÊS FOTOS CHEGARAM EM 21-09 e são as do mockup — a sala de reunião
       ao pôr do sol, a mulher falando na mesa e a plateia no auditório. Vieram
       como PNG de ~1,6 MB e viraram JPEG q90 numa ÚNICA compressão (189, 144 e
       179 KB), que é o tratamento padrão deste repo. Os três cartões saíram do
       campo de cor.

       ⚠️ SEM ENQUADRAMENTO, e isso foi conferido, não presumido. Os arquivos são
       1672x941 (1,78:1) e o slot é 2:1, então o `object-cover` escala pela
       largura e come 11% da ALTURA — 5,6% em cima e 5,6% embaixo, centrado. Nas
       três, o topo da cabeça mais alta fica abaixo de 9% (a plateia é o caso
       mais apertado), ou seja ninguém é cortado. Se um arquivo NOVO entrar aqui
       com composição diferente, refazer essa conta antes de confiar no centro —
       é exatamente o defeito que o carrossel da home tinha. */
    /* ✅ OS TRÊS TÍTULOS E OS TRÊS PARÁGRAFOS SÃO OS DO LAYOUT DE 24-09,
       transcritos de `docs/meetings/senior-leadership-development-24-09.jpeg`.
       Os anteriores vinham do mockup de 21-09 e eram mais curtos; o pedido de
       24-09 é explícito — *"Textos: atualizar com a versão nova. Nada dessas
       páginas tinha sido atualizado ainda."*

       O QUE SAIU, para quem comparar com a versão publicada: "Align. Decide.
       Deliver." / "From functional to enterprise leadership." / "A stronger
       leadership community.", com os parágrafos curtos correspondentes. O git
       os tem.

       ⚠️ OS TRAVESSÕES DO LAYOUT VIRARAM PONTUAÇÃO COMUM, e isso NÃO é
       reescrita solta: é a regra de site inteiro pedida na daily de 23-09
       (*"tirar o travessão do site todo nos textos pra nao parecer ia"*) e já
       aplicada em `a37355f`, que passou 62 arquivos a limpo. As três frases
       novas chegaram com travessão porque o layout foi desenhado antes daquele
       pedido; escrevê-las com ele aqui seria reintroduzir, em copy nova,
       exatamente o que foi tirado ontem.

       A CONVERSÃO SEGUE O QUE `a37355f` FEZ, e não uma escolha nova: travessão
       que ABRE explicação vira dois-pontos, travessão que FECHA aparte vira
       vírgula. No terceiro cartão, que tem o par, o resultado é
       "…of modern leadership: performance and people, …, speed and inclusion,
       building the judgement…".

       ⚠️ O MEIO-TRAÇO DAS FAIXAS NUMÉRICAS FICA ("1–2 day", "Top 100 – 150"):
       ele é sinal de intervalo, não travessão, e o pedido de 23-09 é sobre o
       travessão. Trocá-lo por hífen mudaria a tipografia dos números em toda a
       página sem ninguém ter pedido. */
    audiences: [
      {
        label: "Executive teams",
        title: "Aligning collective leadership identity at the top.",
        body: "Focused 1–2 day interventions that strengthen how Executive Teams lead together: aligning around purpose, making critical decisions, navigating tensions and increasing their collective capacity to drive transformation.",
        image: "/services/audiences/sld-executive-teams.jpg",
        credential: ["Collective", "clarity", "Greater impact"],
      },
      {
        label: "SLT / ET-1",
        title: "From functional excellence to enterprise leadership.",
        body: "We develop SLT and ET-1 leaders to step beyond functional or market leadership: strengthening their leadership identity, Inner and Outer Game, to lead across boundaries, influence horizontally and turn strategy into execution.",
        image: "/services/audiences/sld-slt-et1.jpg",
        credential: ["Bigger", "perspective", "Bolder leadership"],
      },
      {
        label: "Top 100 – 150 leaders",
        title: "Mastering the dualities and competing commitments of leadership.",
        body: "Leadership journeys that equip senior leaders to navigate the competing commitments of modern leadership: performance and people, today and tomorrow, global and local, speed and inclusion, building the judgement and habits to lead consistently at scale.",
        image: "/services/audiences/sld-top-100-150.jpg",
        /* "JUDGEMENT" COM E, e a escolha é deliberada: o recorte que ela mandou
           em 21-09 escreve assim, e o PARÁGRAFO deste mesmo cartão já dizia
           "stronger judgement". O mockup anterior trazia "JUDGMENT" sem o e — a
           grafia americana —, e seguir aquele deixaria a mesma palavra escrita
           de dois jeitos dentro de um cartão de três linhas. */
        credential: ["Greater", "judgement", "Lasting impact"],
      },
    ],
    /* ✅ O FECHO CENTRADO, transcrito do mockup de 21-09. É a última coisa que o
       desenho mostra — o que a página tem depois dele (evidência, convite,
       related services) não está desenhado em lugar nenhum. */
    closing: {
      lead: "Different organisations. Different transformations.",
      accent: "Leadership that makes it happen.",
    },
    cta: {
      strapline: "Individual accountability. Collective enterprise performance.",
      line: "Build a senior leadership community that improves decision quality, alignment and execution speed across functions, markets and geographies.",
      label: "Talk to us about your enterprise leaders",
    },
    /* ============================================================================
       ⛔ O BLOCO DE CASO SAIU DESTA PÁGINA EM 24-09 — E SÓ DESTA
       ============================================================================

       O layout novo troca a faixa de evidência inteira: onde havia o caso da
       HEINEKEN contado por extenso, agora há manchete, linha de apoio, dois
       logos de cliente e três medidas entre eles. Confirmado por escrito: o
       parágrafo dos 18 meses, a foto e a citação saem os três. O que entra está
       no `evidenceSummary`, logo abaixo.

       O QUE SAIU, para quem precisar reverter (o git tem tudo):

         • `evidence`, com `client: "HEINEKEN"`, `title: "Top 150 leaders"`, o
           parágrafo da jornada de 18 meses, os três fatos ("150 senior
           leaders", "18 months", "Enterprise wide / self and peer to peer
           leadership") e a foto `heineken-sign.PLACEHOLDER.jpg`;
         • `testimonial`, que era o placeholder escrito no próprio mockup de
           21-09 — *"A quote from Dolf to be confirmed."*, atribuído a "Name,
           Title: HEINEKEN". A frase real do Dolf nunca chegou; o pedido de
           24-09 dispensa a coluna, então a pendência morre aqui em vez de ficar
           esperando.

       ✅ DUAS PENDÊNCIAS MORREM JUNTO, e vale dizer para que ninguém as procure:
       a FOTO DE VERDADE da faixa de evidência, pedida na daily de 16-09 e nunca
       entregue (o arquivo no ar era uma chapa com "PLACEHOLDER" no nome), e a
       CITAÇÃO do Dolf. A faixa nova não tem foto nem citação. As duas seguem
       pendentes nos OUTROS quatro serviços com case, onde o
       `EVIDENCE_IMAGE_PLACEHOLDER` continua no ar — ver a caixa dele.

       ⚠️ O DIVISOR "FEATURED CASE STUDY" SOME COM ISTO, e é o certo: ele
       anunciava o bloco de baixo pelo nome, e o bloco de baixo deixou de ser um
       case study. `SolutionView` já o condiciona a `service.evidence`, então
       nada teve de mudar lá para ele sair — mas é bom saber que a causa é esta
       e não um descuido.

       ⚠️ E COM O DIVISOR, SOME TAMBÉM O `closing`. A assinatura de duas linhas
       ("Different organisations. Different transformations.") divide o mesmo
       slot com o divisor, e o template só a desenha em serviço SEM `practices`
       — esta página tem. Ou seja: o campo `closing` abaixo continua sem chegar à
       tela, exatamente como estava antes de 24-09. Não é regressão nova, é o
       mesmo estado; `tests/services-copy.test.ts` guarda a regra.

       ⚠️ O CASO DA HEINEKEN CONTINUA DESPUBLICADO NO CMS, e a observação de
       conteúdo fica registrada porque sobrevive a esta mudança: o case que
       existia em `/cases/heineken` contava OUTRO trabalho — 70+ sucessores HiPo
       na APAC, parceria de 6 anos —, e não a jornada de 18 meses com os 150.
       Mesmo cliente, engajamento diferente. Se alguém religar o link um dia, é
       pergunta a fazer à cliente antes. */
    /* ✅ A FAIXA DE EVIDÊNCIA NOVA — 24-09, "usar a versão nova, com o texto
       exato". Manchete, linha de apoio e os três números estão escritos em letra
       no layout e foram copiados como estão; nenhum travessão para converter.

       ✅ OS DOIS LOGOS SÃO ARQUIVOS NOVOS, entregues em 24-09, e a dívida que
       esta caixa registrava algumas horas antes morreu com eles. Os do mural de
       clientes (`heineken.png`, 151x59, e `frasers_property.png`, 169x81) eram
       pequenos demais para a medida que o layout pede — ~240px de largura —, e
       a caixa dizia que originais maiores eram pedido barato à cliente. Foram.

       O TRATAMENTO: chegaram como PNG 2172x724 com fundo transparente, foram
       RECORTADOS pela caixa do canal alfa (o quadro original tem margem vazia
       larga, e sem o recorte o `max-h` mediria a margem em vez da marca) e
       reduzidos a 800px de largura — o dobro do que aparece na tela, que é o
       que basta para ficar nítido em retina. Ficaram em ~92 KB cada, com a
       transparência preservada: a faixa é branca, então não há plaqueta.

       ⚠️ NOME NOVO, E NÃO SUBSTITUIÇÃO DOS ARQUIVOS DO MURAL. Os dois antigos
       continuam em `public/logos/` e continuam em uso na `/our-clients`, no
       `LogoMarquee` e no `CaseLine` — trocá-los por estes mudaria aquelas telas
       sem ninguém ter pedido, e o otimizador do Next serve por URL, então
       reaproveitar o endereço com conteúdo novo é como se serve versão velha.

       ✅ OS LOGOS LEVAM AO CASE desde 24-09, a pedido — *"the logos should point
       to the case page"* —, e só UM DOS DOIS pode:

         • FRASERS PROPERTY tem DUAS páginas publicadas, e a escolha entre elas
           não é arbitrária: `/cases/frasers-property-hrlt` é *"From HR
           leadership team to enterprise leadership team"*, que é o case do
           serviço de HRLT Effectiveness; `/cases/frasers-property-leadership` é
           *"Building the next generation of leaders and talent for One
           Frasers"*, que é desenvolvimento de liderança. É este que entra.

         • HEINEKEN NÃO TEM. `/cases/heineken` responde 404 — o case foi
           despublicado no CMS em 17-09 junto com os outros cinco legados
           (nenhum tem `Reviewed = Yes` na planilha dela), e isso não mudou. A
           marca fica na fileira sem link, que é o que o campo opcional permite.

       ⏳ QUANDO O CASE DA HEINEKEN VOLTAR, é acrescentar `caseSlug: "heineken"`
       na linha abaixo. Vale reler antes a observação registrada mais acima nesta
       mesma entrada: o case publicado contava OUTRO trabalho — 70+ sucessores
       HiPo na APAC, parceria de 6 anos —, e não a jornada com os 150. Mesmo
       cliente, engajamento diferente, e é pergunta a fazer à cliente. */
    evidenceSummary: {
      headline: "Leadership shifts you can see in the business.",
      lead: "Evidence of stronger enterprise leadership, greater readiness and sustained behaviour change.",
      logoSize: "medium",
      logos: [
        {
          src: "/logos/frasers-property-2026.png",
          alt: "Frasers Property",
          caseSlug: "frasers-property-leadership",
        },
        { src: "/logos/heineken-2026.png", alt: "HEINEKEN" },
      ],
      /* A divisão entre número e rótulo é a do layout: o numeral grande em
         vermelho, o que ele conta embaixo, em duas linhas. Os três começam com
         dígito, então `factIsMeasure` classifica os três como MEDIDA e eles
         saem no `Counter` — que é o que o desenho mostra. */
      facts: [
        { value: "47%", label: "Promotion rate" },
        { value: "85%", label: "Leadership habits applied" },
        { value: "3x", label: "Greater enterprise exposure" },
      ],
    },
  },
  {
    slug: "culture-transformation",
    cardImage: "/services/cards/culture-transformation-client.jpg",
    title: "Culture Transformation",
    banner:
      "Turn strategic intent into leadership behaviour that changes how the organisation actually operates.",
    /* ✅ A LINHA DO HERÓI É A DO LAYOUT DE 24-09, e ela quase repete a `banner`:
       onde o documento escreve *"leadership behaviour that changes how the
       organisation actually operates"*, o desenho escreve *"the habits that
       shape how the organisation actually operates"*. Duas palavras de
       diferença, e elas mudam o que a página promete — "hábitos" é o assunto de
       toda a copy nova abaixo ("everyday habits, choices and decisions", "the
       moments that matter in the flow of work"), "comportamento de liderança"
       era o recorte anterior.

       ⚠️ A `banner` FICA NO AR e não foi apagada — ela alimenta o card desta
       página na `/services`, o card no "Related services" das outras nove, a
       `description` da metadata e o `og:description`. Mesmo precedente do
       Senior Leadership Development; a caixa de `heroSubtitle` explica o
       arranjo inteiro. */
    heroSubtitle:
      "Turn strategic intent into the habits that shape how the organisation actually operates.",
    outcome:
      "Greater **transformation readiness, organisational adaptability and execution discipline**. Culture becomes an accelerator of strategy rather than friction that slows it down.",
    howWeHelp:
      "We translate strategy and culture ambition into the **specific leadership behaviours, choices and habits** required to deliver it. We activate these through leaders, teams, organisational rituals and the flow of work, creating visible behavioural change that can be reinforced and scaled.",
    /* ⚠️ `pillars` FICA, E NÃO SAI DA TELA POR ISSO. A fileira que ele alimenta
       perdeu o lugar nesta página — o `ecosystem` ocupa sozinho a região de
       "How we work" —, mas o campo continua sendo o caminho de volta e é ele
       que mantém de pé a regra que `tests/services.test.ts` guarda: cada item
       aparece literalmente na frase de `howWeHelp`, na ordem em que ela os
       escreveu. Apagá-lo custaria o teste e não ganharia nada. */
    pillars: ["Leaders", "Teams", "Organisational rituals", "The flow of work"],
    /* ============================================================================
       A COPY DE 24-09 — `docs/meetings/culture-transformation-24-09.jpeg`
       ============================================================================
       Daqui até `proof`, tudo é transcrição do layout que a cliente mandou em
       24-09. Os negritos são os do desenho, não ênfase nossa. */
    whatWeDoHeadline: "We make culture real in the flow of work.",
    whatWeDo:
      "We work at **organisation, market and top-team levels** to translate intended culture, values and behaviours into the everyday habits, choices and decisions that determine how work actually gets done.\n\nEvery transformation starts with the **belief and business reason for change**. We then identify the moments where culture needs to show up differently and embed it through leaders, managers, teams and the operating rhythms of the organisation.\n\nFor us, **culture is the ecosystem** within which everything else sits, whether it’s leadership, talent, strategy or business performance. You can invest in great leaders and exceptional talent, but without the right culture, much of that value remains untapped.",
    /* ✅ AS TRÊS FOTOGRAFIAS CHEGARAM EM 24-09, em arquivo separado, e é por
       isso que estes cartões não passaram pelo campo de cor.

       ⚠️ NÃO SE RECORTOU DO LAYOUT, e o registro importa porque a tentação
       volta: com as trilhas do Manager Development, horas antes, o recorte do
       JPEG funcionou. Aqui não funcionaria, por duas razões independentes —

         • O TEXTO ESTÁ CHAPADO DENTRO DA FOTO. O layout é exportação
           rasterizada, então "ORGANISATION-WIDE CULTURE" e as linhas do canto
           inferior direito são PIXEL da imagem, não camada por cima. O recorte
           traria esse texto junto, e ele sairia por baixo da sobreposição em
           HTML que o componente desenha: a mesma frase duas vezes.

         • A RESOLUÇÃO NÃO DAVA. No arquivo de 1284px cada foto mede ~403×136,
           contra os 874 que o cartão pede em retina.

       O TRATAMENTO: chegaram como PNG 2172×724 e foram reduzidas a 1600px de
       largura (JPEG q86), que é quase o dobro do que o cartão mostra em retina
       e o bastante para ficar nítido. Ficaram entre 63 e 138 KB.

       ⚠️ ELAS SÃO 3:1 E O CARTÃO É 2:1, de propósito em vez de por descuido. O
       layout desenha o quadro a ~2,96:1, mas os três cartões do Senior
       Leadership Development — aprovados em 21-09 — são 2:1, e o `aspect` é do
       COMPONENTE, não do dado: mudá-lo aqui mudaria aquela página também. O
       `object-cover` recorta as laterais, e nas três o assunto está no meio (o
       sol entre as torres, o pico central, a mesa com a janela ao fundo), então
       o corte não come nada. Se um dia o desenho pedir 3:1 nas duas páginas, o
       lugar de mexer é o `aspect-[2/1]` do `SolutionAudiences`. */
    audiences: [
      {
        label: "Organisation-wide culture",
        credential: ["One", "organisation", "a shared way", "of working"],
        image: "/services/audiences/ct-organisation-wide.jpg",
        title: "From stated culture to lived culture.",
        body: "We translate enterprise purpose, strategy and values into a culture people can recognise and practise every day, embedding it through leadership, management, critical teams and the moments that matter across the organisation.",
      },
      {
        label: "Market / function culture",
        credential: ["Local", "relevance", "enterprise", "consistency"],
        image: "/services/audiences/ct-market-function.jpg",
        title: "Making culture meaningful where work gets done.",
        body: "We help markets and functions translate enterprise culture into their own operating reality, creating shared habits around decisions, collaboration, performance, customers and talent while protecting what needs to remain consistent across the enterprise.",
      },
      {
        label: "Top team / group culture",
        credential: ["Set the tone", "drive the shift", "multiply the impact"],
        image: "/services/audiences/ct-top-team.jpg",
        title: "The culture at the top becomes the culture below.",
        body: "We work with Executive Teams, Boards and senior leadership groups to define and role-model the culture required for what comes next, strengthening how they make decisions, challenge one another, collaborate, hold accountability and visibly set the tone for the organisation.",
      },
    ],
    ecosystem: {
      /* QUEBRA PEDIDA: "The CDNA" numa linha, "Culture Ecosystem" na de baixo.
         O `whitespace-pre-line` do `SolutionEcosystem` é o que transforma o `\n`
         em quebra — a mesma conta das manchetes de `SolutionSection`. */
      headline: "The CDNA\nCulture Ecosystem",
      body: "We embed culture through ten interconnected elements: the moments that matter in the flow of work. When these work together, culture stops being a poster and becomes a lived reality.",
      asideTitle: "Ten planets. A stronger culture.",
      asideBody:
        "These ten elements work together as an integrated ecosystem to create the conditions for culture to come alive at every level, in every part of the organisation.",
      /* ✅ O DIAGRAMA CHEGOU EM 24-09 (WhatsApp, 1024x683). ⚠️ Ele traz o
         próprio título ("The CDNA Culture Ecosystem") desenhado no canto
         superior esquerdo, repetindo a manchete da coluna ao lado. */
      diagram: "/services/ecosystem/culture-ecosystem.jpg",
      elements: [
        "Leadership and Role Modelling",
        "Ownership and Accountability",
        "Radical Candour",
        "Keep / Kill / Change Processes",
        "Employee Experience",
        "Critical Teams",
        "Performance Differentiation",
        "Meetings and Dialogue",
        "Cross-Vertical Collaboration",
        "Decision Speed and Escalation",
      ],
    },
    proof: {
      label: "We make the shift visible",
      items: [
        {
          icon: "person",
          title: "Behaviour proof",
          subtitle: "How people show up.",
          body: "Fearless honesty, accountability, ownership, role-modelling and the everyday habits that signal the culture is changing.",
        },
        {
          icon: "process",
          title: "Operating proof",
          subtitle: "How work gets done.",
          body: "Decision speed, escalation, meeting effectiveness, cross-functional collaboration, process simplicity and clarity of ownership.",
        },
        {
          icon: "growth",
          title: "Business proof",
          subtitle: "What changes as a result.",
          body: "Tangible outcomes owned by each critical team: speed, quality, customer outcomes, productivity, delivery and growth.",
        },
      ],
    },
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
      /* ⏳ Placeholder de 17-09 — ver a caixa de `EVIDENCE_IMAGE_PLACEHOLDER`. */
      image: EVIDENCE_IMAGE_PLACEHOLDER,
    },
    /* ⏳ Placeholder de 17-09 — ver a caixa de `evidenceQuotePlaceholder`. A
       citação real da GSK Mexico é uma das quatro que o outline dá como
       identificadas e não escolhidas. */
    testimonial: evidenceQuotePlaceholder("GSK MEXICO"),
  },
  {
    slug: "talent-development",
    /* ⚠️ O HERÓI CONTINUA SENDO A FOTO DA BRANCH DOS HERÓIS, e não a dos
       alpinistas do layout: aquela é arte DO PRÓPRIO ARQUIVO (1024px de
       largura, com o lettering "People Potential Progress" chapado no pixel),
       não asset entregue pela cliente. Recortá-la daria uma dobra de sangria
       total com 1024px de fonte e um texto cravado na imagem que ninguém
       consegue traduzir nem editar pelo /edit. */
    heroImage: "/hero/talent-high-potentials.jpeg",
    cardImage: "/services/cards/talent-development-client.jpg",
    title: "Talent Development",
    banner: "Build the leadership pipeline before the business needs it.",
    /* ============================================================================
       ✅ A PÁGINA REFEITA PELO LAYOUT DE 24-09
       ============================================================================

       Toda a copy abaixo está escrita em letra no arquivo do layout e foi
       TRANSCRITA, não reescrita. É a mesma operação que Culture, Manager e HRLT
       já sofreram no mesmo dia, e os campos novos que ela exigiu (`heroBody`,
       `inflectionPoints`, `capabilitiesHeader`, `commonOutcome`, `stepsFlow`,
       `shifts`) estão documentados um a um lá em cima, no tipo `Service`.

       ⚠️ O `outcome`, O `howWeHelp` E OS `pillars` CONTINUAM NO DADO, mais
       abaixo, e é de propósito — a mesma decisão da Manager Development: eles
       são a copy do `CDNA_03_Services.docx`, que nunca deixou de ser final, e o
       template cai neles por `??` em qualquer bloco que a copy nova não cubra.
       Na prática, nesta página, só o `howWeHelp` chega à tela: é ele o corpo do
       bloco "How we work". Os `pillars` saem porque `steps` tem precedência
       sobre eles, e o `outcome` sai com o bloco inteiro — ver `hideWhatWeDo`,
       logo abaixo.

       ⚠️ TRAVESSÕES: este layout não tem nenhum, ao contrário do de Culture. O
       que ele tem são SETAS (→) na faixa de fluxo e meios-traços em
       "emerging-market" e "Succession-ready" — nem um nem outro é alvo do
       pedido de 23-09, que é sobre o travessão de frase. `tests/services.test.ts`
       guarda a regra e agora cobre também os campos novos.
       ============================================================================ */
    /* ✅ A MANCHETE DO LAYOUT VIRA A FRASE DE APOIO DO HERÓI, e não o `h1`:
       no arquivo, "TALENT DEVELOPMENT" é o sobretítulo e esta frase é o corpo
       grande. No template o `h1` é o NOME do serviço — ele alimenta a migalha,
       o menu e a metadata —, então a frase desce um degrau. É exatamente o que
       o Senior Leadership Development fez em 24-09; ver a caixa de
       `heroSubtitle` no tipo `Service`. */
    heroSubtitle: "Potential when shaped into readiness, accelerates talent.",
    /* ✅ SEM O BLOCO "WHAT WE DO" — 24-09, a pedido: *"What we do pode
       remover"*. O layout não o desenha, e a manchete dele nesta página era o
       `HEADLINE_PLACEHOLDER`. A grade de ladrilhos passa a ser a primeira faixa
       depois do herói. Ver a caixa do campo no tipo `Service`. */
    hideWhatWeDo: true,
    /* ✅ OS DOIS PARÁGRAFOS DA DOBRA — este é o primeiro dos dez serviços a ter
       corpo dentro do herói. Ver `heroBody` no tipo `Service`. */
    heroBody: [
      "We design talent acceleration journeys for high-potential and critical talent at pivotal moments in their careers, building the identity, judgement, enterprise capability and visibility they need to step into bigger, broader and more complex roles.",
      "Our work connects development directly to succession, mobility and business impact, so talent doesn’t simply learn more. They become more ready.",
    ],
    /* ✅ A GRADE DE OITO LADRILHOS, logo abaixo do "What we do" — ver
       `SolutionInflectionPoints`.

       ⚠️ A MANCHETE VAI SEM `\n`, ao contrário da de Manager Development. Lá a
       quebra foi pedida em letra; aqui ela não é pedida, e a coluna de texto
       desta faixa já é a menor das duas (1 contra 1,7), então a frase quebra
       sozinha nas três linhas do desenho sem que ninguém fixe onde. Um `\n`
       cravado quebraria também no telefone, onde a linha já não cabe.

       ⚠️ A ORDEM DOS OITO É A DO DESENHO, e o tabuleiro vermelho/cinza é
       calculado pela POSIÇÃO no componente. Reordenar a lista para "arrumar as
       cores" troca o que a CDNA afirma sobre talento por um efeito visual. */
    inflectionPoints: {
      label: "The inflection points",
      headline: "The definition and identification of talent is changing in today’s world.",
      lead: "We work with talent at eight common inflection points.",
      items: [
        "Newly identified High Potentials",
        "Accelerated / fast-track talent",
        "First-time leadership transitions",
        "Role expansion / scope increase",
        "Cross-functional / enterprise moves",
        "Inconsistent High Potentials",
        "Succession pipeline activation",
        "Retention / flight risk",
      ],
    },
    /* ✅ O RÓTULO DOS CARTÕES DE PÚBLICO — ver `audiencesLabel` no tipo
       `Service`. O Senior Leadership Development não tem: lá os cartões nascem
       colados no "What we do" e o desenho não escreve rótulo nenhum sobre eles.
       Aqui entre os dois há a grade de ladrilhos, e sem rótulo os quatro
       cartões entrariam na página sem nada que os anuncie. */
    audiencesLabel: "Where we work",
    /* ✅ OS QUATRO PÚBLICOS DO LAYOUT. O mapeamento para o cartão do template é
       o mesmo dos três do Senior Leadership Development: o NOME do público
       (`label`) é a sobreposição no quadro de cima, a linha vermelha do desenho
       é o `title` em serifa e o parágrafo é o `body`.

       ⚠️ SÃO QUATRO, E ISSO MUDA A GRADE — até aqui o componente desenhava três
       colunas cravadas e o quarto cartão desceria sozinho com 66% de vazio ao
       lado. A escada nova (1 → 2 → 4) está em `SolutionAudiences`.

       ⚠️ OS TÍTULOS NÃO TERMINAM EM PONTO, ao contrário dos três do outro
       serviço, porque o layout não os escreve com ponto. É transcrição, não
       descuido.

       ⏳ SEM FOTOGRAFIA: os quatro retratos do layout são arte do arquivo
       (~250px de largura cada) e não estão na pasta da cliente. Sem `image` o
       cartão cai no campo de cor `ink` com o nome do público em cima, que é um
       estado BOM e o mesmo da Culture Transformation. Quando as fotos chegarem,
       é acrescentar `image` nos quatro, em `public/services/audiences/`. */
    audiences: [
      {
        label: "Global Top Talent",
        title: "Building the next generation of enterprise leaders",
        body: "Accelerating talent for the organisation’s most significant future roles, with a focus on enterprise leadership, strategic judgement and readiness for complexity.",
      },
      {
        label: "Regional & Emerging Market Talent",
        title: "Accelerating readiness across markets and boundaries",
        body: "Building leadership capability, visibility and influence across different cultures, markets and organisational contexts.",
      },
      {
        label: "Functional & Critical-Role Talent",
        title: "Turning deep expertise into broader leadership impact",
        body: "Helping high-value specialists broaden their identity, influence and enterprise contribution as their scope increases.",
      },
      {
        label: "Early & Mid-Career High Potentials",
        title: "Creating the runway for what comes next",
        body: "Developing the capabilities, experiences and confidence required to make successful transitions into larger leadership roles.",
      },
    ],
    /* ✅ O CABEÇALHO DA FAIXA DE ACELERADORES. No layout o rótulo e a manchete
       dividem a mesma linha; aqui eles empilham, como em todas as outras faixas
       do site. Ver `capabilitiesHeader` no tipo `Service`. */
    capabilitiesHeader: {
      label: "Our talent DNA accelerators",
      headline: "What accelerates talent isn’t capability alone.",
      lead: "Across our work with high-potential talent, four accelerators consistently matter:",
    },
    /* ✅ O ARRANJO DO LAYOUT, a pedido de 24-09: *"os icones a esquerda e o
       titulo e texto a [direita], com uma linha dividindo cada um"*. Ver a
       caixa do campo no tipo `Service`. */
    capabilitiesLayout: "aside",
    /* ✅ OS QUATRO ACELERADORES. `sequence={false}` no template: eles são uma
       LISTA de iguais, não uma sequência — nenhum vem antes do outro.

       ⚠️ OS GLIFOS FORAM LIDOS DO LAYOUT, um a um: montanha, alvo com flecha,
       olho e o grupo de pessoas. "Accountability" cai em `people`, que já
       existia, porque é o mesmo desenho do mesmo conceito — a regra da daily de
       24-09 (*"o mesmo ícone para o mesmo conceito em todas as páginas"*). */
    capabilities: [
      {
        icon: "mountain",
        title: "Grit",
        body: "The resilience and sustained effort to navigate ambiguity, setbacks and increasingly complex demands.",
      },
      {
        icon: "target",
        title: "Impact & Identity",
        body: "Building a leadership identity that matches the next level, while delivering visible, business-relevant impact.",
      },
      {
        icon: "eye",
        title: "Visibility",
        body: "Creating meaningful exposure through stretch assignments, cross-functional and cross-market experiences, senior sponsorship and real business challenges.",
      },
      {
        icon: "people",
        title: "Accountability",
        body: "Owning the thinking, relationships, judgement, actions and standards required at the next level.",
      },
    ],
    /* ✅ A FILEIRA "COMMON OUTCOME", entre os aceleradores e o "How we work".
       Desenha na mesma peça dos `pillars` (`SolutionPillars`), com rótulo
       próprio — ver `ServiceCommonOutcome`.

       ⚠️ O PONTO FINAL DE CADA ITEM É DO LAYOUT E TAMBÉM É A CHAVE DO ÍCONE.
       "Readiness." com ponto casa no mapa; "Readiness" sem ponto cai no círculo
       de fallback. */
    commonOutcome: {
      label: "Common outcome",
      items: [
        "Readiness.",
        "Team identity.",
        "Horizontal trust.",
        "Collective habits.",
        "Moments that matter in the flow of work.",
      ],
    },
    /* ✅ A MANCHETE DE "HOW WE WORK" É A ÚNICA LINHA QUE O LAYOUT ESCREVE ALI.
       O corpo do bloco continua sendo o `howWeHelp` do documento, por `??` —
       ver a caixa de abertura desta entrada. */
    howWeWorkHeadline:
      "Talent development starts with the business imperative, and ends with measurable value creation.",
    /* ✅ EMPILHADO, a pedido de 24-09: *"na seção How we work coloca o titulo
       ocupando toda a linha, o texto embaixo e depois os icones"*. É o mesmo
       arranjo que a Manager Development usa, e a razão aqui é a do layout: a
       manchete é uma frase longa que ocupa a linha inteira, e os sete passos
       vêm logo abaixo dela — em duas colunas, a manchete ficaria espremida em
       metade da largura com o corpo ao lado.

       ⚠️ `sectionLayout` VALE PARA OS DOIS BLOCOS DE DUAS COLUNAS, mas aqui só
       resta um: o "What we do" saiu desta página (ver `hideWhatWeDo`). */
    sectionLayout: "stacked",
    /* ✅ OS SETE PASSOS. Aqui a ordem AFIRMA: "Business Imperative" vem antes de
       "Needs Analysis" porque o trabalho acontece nessa ordem, e é isso que a
       seta entre os discos diz. Saem em `<ol>`.

       ⚠️ SÃO SETE NUMA FILEIRA DESENHADA PARA SEIS (a de Manager Development).
       A grade é `auto-fit`, então o sétimo não quebra nada; o que ele faz é
       apertar as células a 1440, que é o que o próprio layout mostra. */
    steps: [
      {
        icon: "target",
        title: "Business Imperative",
        body: "Define the strategic context, future capability requirements and critical roles the organisation needs talent to step into.",
      },
      {
        icon: "search",
        title: "Needs Analysis",
        body: "Understand organisational, leadership and individual development needs through stakeholder interviews, diagnostics and talent data.",
      },
      {
        icon: "people",
        title: "Talent Identification",
        body: "Align on who the talent is, why they have been selected, their readiness today and their future roles being accelerated towards.",
      },
      {
        icon: "document",
        title: "Modules",
        body: "Build targeted learning and experiences that matter most, using immersive modules, live business challenges and application in the flow of work.",
      },
      {
        icon: "peers",
        title: "Coaching + Mastery",
        body: "Deepen individual development through coaching, mastery sessions and targeted practice around each leader’s specific stretch areas.",
      },
      {
        icon: "chart",
        title: "Talent Tracking",
        body: "Track readiness, mobility, development progress and observable shifts, keeping participants, managers, HR and sponsors connected to the journey.",
      },
      {
        icon: "trophy",
        title: "Success + Value Creation",
        body: "Measure what changed: readiness, role moves, promotion, retention, leadership impact and tangible value created.",
      },
    ],
    /* ✅ A FAIXA VERMELHA DE UMA LINHA, no pé da sequência — ver `stepsFlow` no
       tipo `Service`. As setas são TEXTO, porque a frase é uma só. */
    stepsFlow:
      "From business need → to talent bet → to readiness → to measurable value.",
    /* ✅ OS SETE PARES "DE → PARA". A ordem dentro do par é a afirmação: à
       esquerda o que a organização mede hoje, à direita o que ela passa a
       medir. Ver `ServiceShifts`. */
    shifts: {
      label: "What shifts",
      items: [
        { from: "Potential", to: "Demonstrated readiness" },
        { from: "Functional excellence", to: "Enterprise contribution" },
        { from: "Career ambition", to: "Leadership identity" },
        {
          from: "Learning about leadership",
          to: "Leading through real business challenges",
        },
        { from: "Internal capability", to: "Visible impact and sponsorship" },
        { from: "Individual success", to: "Influence across boundaries" },
        { from: "Future promise", to: "Succession-ready talent" },
      ],
    },
    cta: {
      strapline: "Global ambition. Local talent realities.",
      line: "Build a talent runway that identifies what your people need here and now, while preparing them for what the business will need next.",
      label: "Talk to us about your talent pipeline",
    },
    /* ============================================================================
       ⛔ O BLOCO DE CASO DA VODAFONE SAIU EM 24-09
       ============================================================================

       O layout troca a faixa de evidência inteira: onde havia o case contado por
       extenso, agora há "The impact" com quatro medidas e "Our experience" com
       seis marcas. É a mesma troca que o Senior Leadership Development sofreu no
       mesmo dia, e as duas faixas são EXCLUDENTES — `tests/services.test.ts`
       guarda isso, porque as duas escrevem o rótulo de evidência em cima.

       O QUE SAIU, para quem precisar reverter (o git tem tudo):

         • `evidence`, com `client: "VODAFONE"`, `title: "Inspire"`, o parágrafo
           da parceria plurianual, os três fatos ("400+ alumni", "7 years
           partnership", "Multi market development") e o
           `EVIDENCE_IMAGE_PLACEHOLDER`;
         • `testimonial`, que era o placeholder de 17-09 — e vale dizer que foi
           ESTA PÁGINA que o motivou: era a faixa mais vazia dos cinco serviços
           com case, numa coluna só. A citação real nunca chegou; a pendência
           morre aqui em vez de ficar esperando.

       ✅ A VODAFONE NÃO SUMIU DA PÁGINA: ela é a sexta marca da fileira, que é
       onde o layout a põe. O que se perdeu foram os três números dela, e eles
       não cabiam — a faixa nova afirma resultado de PROGRAMA, não de cliente.

       ⚠️ A LINHA "Award winning programmes across regions" CONTINUA FORA, e o
       motivo é o mesmo de 17-09: o outline a reprova em letra (*"Name the award
       rather than alluding to it"*). O layout também não a traz. */
    /* ✅ A FAIXA DE EVIDÊNCIA NOVA — "The impact" à esquerda e "Our experience"
       à direita, no layout; aqui as duas empilham, porque a faixa é uma coluna
       só desde que nasceu.

       ⚠️ O `icon` DE CADA MEDIDA REPETE O RÓTULO, e não é redundância à toa: é
       ele que manda a medida para a grade de ícones em vez da fileira
       intercalada com os logos (a conta está em `SolutionEvidenceSummary`), e o
       mapa de `SolutionPillars` casa por STRING EXATA. Uma chave "chart" ali
       cairia no círculo de fallback.

       ⏳ TRÊS DOS SEIS LOGOS SÃO DO ACERVO ANTIGO e desenham pequenos: `gsk`
       (123px), `kellanova` (154px) e `vodafone` (123px) contra o teto de 240px
       da fileira. É dívida de ASSET, não de layout — a mesma anotada na HRLT.
       Quando forem tratados como os de 24-09 (recorte pela caixa do alfa e
       800px de largura), é trocar o caminho aqui.

       ⚠️ SÓ A FRASERS LEVA A CASE. `/cases/frasers-property-leadership` é
       justamente *"Building the next generation of leaders and talent for One
       Frasers"*, que é este serviço. Os outros cinco não têm página publicada, e
       a régua é a de sempre: link para case despublicado é 404 em cima do logo
       de um cliente. */
    evidenceSummary: {
      label: "The impact",
      headline:
        "Talent acceleration should change the pipeline, not just the participant experience.",
      facts: [
        { icon: "Higher Productivity", value: "35%", label: "Higher Productivity" },
        { icon: "Promotion Readiness", value: "70%", label: "Promotion Readiness" },
        { icon: "Expanded Role Moves", value: "80%", label: "Expanded Role Moves" },
        { icon: "Discretionary Effort", value: "2x", label: "Discretionary Effort" },
      ],
      experience: {
        label: "Our experience",
        lead: "For nearly two decades, we’ve worked with organisations to identify, accelerate and retain talent across global, regional, emerging-market and local populations, including:",
      },
      logos: [
        { src: "/logos/heineken-2026.png", alt: "HEINEKEN" },
        { src: "/logos/gsk.png", alt: "GSK" },
        {
          src: "/logos/frasers-property-2026.png",
          alt: "Frasers Property",
          caseSlug: "frasers-property-leadership",
        },
        { src: "/logos/kellanova.png", alt: "Kellanova" },
        { src: "/logos/schroders.png", alt: "Schroders" },
        { src: "/logos/vodafone.png", alt: "Vodafone" },
      ],
      note: "Turn potential into readiness. And readiness into impact.",
    },
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
  },
  {
    slug: "manager-development",
    cardImage: "/services/cards/manager-development-client.jpg",
    title: "Manager Development",
    banner: "Build managers who turn strategy into performance through people.",
    /* ⚠️ O HERÓI NÃO MEXEU, a pedido de 24-09: *"pode manter o hero na
       pagina"*. Sem `heroSubtitle` e sem `heroImage`, então ele segue mostrando
       a `banner` acima e a foto do card, como nas outras oito. */
    /* ============================================================================
       ✅ A PÁGINA REFEITA PELO LAYOUT DE 24-09
       ============================================================================

       `docs/meetings/manager-development-24-09.jpeg`. Toda a copy abaixo está
       escrita em letra no arquivo e foi transcrita, não reescrita.

       ⚠️ O `outcome` E O `howWeHelp` CONTINUAM NO DADO, logo abaixo, e é de
       propósito: eles são a copy do `CDNA_03_Services.docx`, que nunca deixou
       de ser final, e o template cai neles por `??` em qualquer bloco que a copy
       nova não cubra. Apagá-los para "limpar" tiraria o caminho de volta.

       ⚠️ OS `pillars` TAMBÉM FICAM, pelo mesmo motivo e com uma razão extra: a
       regra deste arquivo é que cada pilar é palavra LITERAL da frase de
       `howWeHelp`, e `tests/services.test.ts` fixa a faixa em quatro a seis por
       serviço. Eles saem da TELA porque `steps` tem precedência, não do dado.

       ⚠️ TRAVESSÕES CONVERTIDOS. O layout foi desenhado antes do pedido de
       23-09 de tirar o travessão do site todo, e traz um em "practical tools —
       so managers can apply". Virou vírgula, seguindo o que `a37355f` fez. O
       teste de travessão guarda isso.
       ============================================================================ */
    /* ⚠️ O `\n` É A QUEBRA DO LAYOUT, pedida em 24-09: *"aumenta a largura do
       titulo ate quebrar em 'capability'"*. Sem ele a quebra dependia da
       largura da janela e caía em "manager". Mesma mecânica do
       `howWeWorkHeadline` logo abaixo; quem o transforma em quebra é o
       `whitespace-pre-line` do `SolutionSection`. */
    whatWeDoHeadline:
      "Build practical manager capability\nat the moments that matter.",
    whatWeDo: "Two targeted pathways, designed for real-world impact.",
    outcome:
      "Stronger **execution discipline, team performance and leadership capacity** where employees experience leadership every day. Better managers create clarity, accountability and the conditions for people to perform.",
    howWeWorkHeadline: "Bite-sized. Practical.\nBuilt into the flow of work.",
    howWeWork:
      "Focused learning, real conversations and practical tools, so managers can apply what they learn immediately.",
    howWeHelp:
      "We build the practical capabilities managers need in the flow of work: **setting direction, making decisions, developing people, managing performance, navigating difficult conversations and leading through change**. Development is applied to real managerial challenges, not separated from them.",
    /* ⚠️ EMPILHADO NOS DOIS BLOCOS — ver a caixa de `sectionLayout` no tipo
       `Service`. Aqui o corpo de cada bloco é UMA FRASE, e ela na coluna da
       direita do arranjo de duas colunas deixaria a faixa com um buraco. */
    sectionLayout: "stacked",
    /* ⏳ AS DUAS FOTOS SÃO RECORTE DO PRÓPRIO LAYOUT, e o `.FROM-LAYOUT.` no
       nome do arquivo existe para que ninguém as confunda com asset entregue
       pela cliente. Saíram de um JPEG de 1024px de largura, então o recorte tem
       320x252 e 320x281 nativos — foram dobrados no salvamento e ainda assim
       ficam macios numa tela retina.

       SAEM no dia em que ela mandar as originais, que é pedido barato: é trocar
       os dois caminhos. ⚠️ TROCAR O NOME DO ARQUIVO JUNTO — o otimizador do Next
       serve por URL e já entregou versão velha neste projeto por causa disso. */
    pathways: [
      {
        label: "First-time managers",
        title: "From managing yourself to managing others.",
        body: "We build the foundations to lead people with clarity and confidence.",
        image: "/services/pathways/md-first-time-managers.FROM-LAYOUT.jpg",
        items: [
          "Stepping into the manager identity",
          "Setting expectations",
          "Delegating and empowering",
          "Giving feedback",
          "Managing difficult conversations",
        ],
      },
      {
        label: "Mid-level managers",
        title: "From managing people to leading performance.",
        body: "We strengthen the capability to lead through others, across functions and through complexity.",
        image: "/services/pathways/md-mid-level-managers.FROM-LAYOUT.jpg",
        items: [
          "Leading through others",
          "Coaching for performance",
          "Accountability without micromanagement",
          "Navigating competing priorities",
          "Building high-performing teams",
        ],
      },
    ],
    /* ⚠️ O RÓTULO DESTA FAIXA NOMEIA A GRADE, e não é um rótulo genérico de
       seção como "What we do" ou "Evidence" — é o que o layout escreve. Por
       isso ele mora no dado e não no componente. */
    moments: {
      label: "The manager moments that matter",
      items: [
        "Setting direction",
        "Delegating",
        "Giving feedback",
        "Coaching",
        "Having difficult conversations",
        "Managing performance",
        "Building trust",
        "Motivating others",
        "Navigating conflict",
        "Leading change",
      ],
    },
    /* ⚠️ ESTA FILEIRA SUBSTITUI A DE `pillars` NA TELA, não no dado — ver a
       caixa de `steps` no tipo `Service`. As chaves de `icon` casam com o mapa
       em `SolutionSteps` e foram LIDAS DO DESENHO, uma a uma: pessoas, laptop,
       balão de fala, documento, pessoas, telefone. */
    steps: [
      { icon: "people", title: "Short modules", body: "60–90 minute learning experiences" },
      { icon: "laptop", title: "Manager sprints", body: "Targeted application over a few weeks" },
      { icon: "speech", title: "Practice labs", body: "Real conversations, scenarios and peer learning" },
      { icon: "document", title: "Manager toolkits", body: "Simple tools and conversation guides" },
      { icon: "people", title: "Peer learning", body: "Learn from each other’s challenges and successes" },
      { icon: "phone", title: "Habit nudges", body: "Small prompts that turn learning into everyday behaviour" },
    ],
    pillars: [
      "Setting direction",
      "Making decisions",
      "Developing people",
      "Managing performance",
      "Navigating difficult conversations",
      "Leading through change",
    ],
    /* ✅ A FAIXA DE EVIDÊNCIA, do mesmo layout — mesma peça da Senior Leadership
       Development, outra copy. Ver `ServiceEvidenceSummary`.

       ⚠️ NENHUM DOS DOIS LOGOS LEVA A CASE, e a razão é diferente da de lá: aqui
       os DOIS clientes têm página publicada (`/cases/bt` e `/cases/dp-world`),
       mas nenhuma delas é de desenvolvimento de gestores — são os cases que já
       estavam no acervo, de outros trabalhos. Apontar o logo para eles faria a
       faixa prometer prova que a página de destino não entrega. É pergunta para
       a cliente: qual case sustenta estes números?

       ⚠️ AS DUAS MARCAS ESTÃO EM ESTADOS DIFERENTES, e vale saber qual é qual:
       a DP World ganhou ORIGINAL GRANDE em 24-09 (`dp-world-2026.png`, 800x448
       recortado do PNG 2172x724 entregue); a BT ainda é o arquivo pequeno do
       mural de clientes (`bt.png`), e continua sendo pedido barato à cliente.

       ⚠️ A DP WORLD É 1,79:1 E AS OUTRAS TRÊS DESTA FAIXA SÃO ~2,8:1 — ela é um
       lockup EMPILHADO (globo em cima, nome embaixo), as outras são
       horizontais. É por causa dela que o `EvidenceLogo` passou a ter teto de
       ALTURA além do de largura: só com `max-w`, uma marca empilhada a 240px de
       largura desenharia 134px de altura e dominaria a fileira.

       ⚠️ O RECORTE DELA PRECISOU DE LIMIAR, e não do `getbbox()` do alfa: o
       arquivo entregue tem alfa residual (1 a 2) espalhado pela moldura, e o
       `getbbox()` trata qualquer alfa > 0 como conteúdo — o primeiro recorte
       saiu 3:1, com a marca pequena no meio de uma faixa vazia. O limiar usado
       foi alfa > 24. Se entrar outro arquivo dessa mesma origem, a conta é para
       refazer, não para herdar. */
    evidenceSummary: {
      headline: "Building managers people want to work for.",
      lead: "Nearly two decades of manager development across industries, geographies and organisational levels.",
      logos: [
        { src: "/logos/bt.png", alt: "BT" },
        { src: "/logos/dp-world-2026.png", alt: "DP World" },
      ],
      facts: [
        { value: "72%", label: "Manager confidence" },
        { value: "85%", label: "Skills application" },
        { value: "90%", label: "Engagement scores" },
      ],
    },
    cta: {
      strapline: "Big strategy. Everyday leadership.",
      line: "Build managers who translate business priorities into clarity, accountability and performance through the people they lead every day.",
      label: "Talk to us about your manager capability",
    },
  },
  {
    slug: "women-in-leadership",
    heroImage: "/hero/women-leadership.jpeg",
    cardImage: "/services/cards/women-in-leadership-client.jpg",
    /* ============================================================================
       ✅ A PÁGINA REFEITA PELO LAYOUT DE 24-09 (`women leadership.jpeg`)
       ============================================================================

       Toda a copy abaixo está escrita em letra no arquivo e foi TRANSCRITA, não
       reescrita — a mesma operação que Culture, Manager, HRLT e Talent já
       sofreram. Os campos novos que ela exigiu (`heroCredential`, `focus` nos
       cartões, `ambition`, `stepsNote`, `evidenceCases`) estão documentados um a
       um lá em cima, no tipo `Service`.

       ⚠️ TRAVESSÕES: o layout tem TRÊS, e os três saíram por causa do pedido de
       23-09 (*"tirar o travessão do site todo nos textos pra nao parecer ia"*),
       que `tests/services.test.ts` guarda. Onde o desenho escreve "— " esta
       transcrição usa dois pontos ou vírgula: no `heroBody` ("careers: from
       early career"), no `whatWeDo` ("women face, and the opportunities") e no
       `howWeWork` ("matters most: in the real roles"). Uma quarta ocorrência
       está na legenda da Kellanova, e ali o desenho usa MEIO-traço como
       pontuação de frase ("not as exceptions – but as"); virou vírgula pela
       mesma razão. Os meios-traços de INTERVALO ficam ("6–9 months", "20–25",
       "5–7", "2020 – 2025"), que é o que o teste diz em letra.

       ⚠️ O `outcome`, O `howWeHelp` E OS `pillars` CONTINUAM NO DADO, mais
       abaixo, como em todos os serviços migrados: são a copy do
       `CDNA_03_Services.docx`, que nunca deixou de ser final, e o template cai
       neles por `??` em qualquer bloco que a copy nova não cubra. Na prática o
       `outcome` SAI DA TELA aqui (o `whatWeDo` o cobre) e os `pillars` também,
       porque `steps` tem precedência sobre eles — mas os dois sustentam o card
       da `/services`, o teste de `pillars` e o caminho de volta.
       ============================================================================ */
    /* ⚠️ O NOME DA PÁGINA MUDOU, E ISSO VAI ALÉM DO HERÓI. O layout escreve
       "Women’s Leadership Development" no `h1`, e não "Women in Leadership",
       que é como o `CDNA_03_Services.docx` nomeia o serviço. O `title` alimenta
       QUATRO lugares além do herói: o card na `/services`, o card no "Related
       services" das outras nove, o `<title>` da metadata e o `og:title`.

       POR QUE A TROCA MESMO ASSIM: é a mesma régua que 24-09 aplicou ao
       `heroSubtitle` — layout aprovado e POSTERIOR ganha do documento, quando
       ele escreve a frase em letra. E o custo aqui é baixo de medir: o nome
       novo tem 30 caracteres contra os 29 de "Senior Leadership Development",
       que já passa pelo card sem quebrar nada.

       ⏳ O QUE FICA DESALINHADO: a rota segue `/services/women-in-leadership` e
       o slug não muda — é endereço, não texto, a mesma regra que mantém
       `/solutions` atrás do rótulo "Services". As tags de caso no CMS também
       continuam dizendo "Women in Leadership"; nenhum código casa título com
       tag, então isso é vocabulário do acervo, não dependência. */
    title: "Women’s Leadership Development",
    banner:
      "Accelerate progression and strengthen the pipeline of women ready for bigger leadership roles.",
    /* ✅ A FRASE DE APOIO DO HERÓI É A DO LAYOUT, e a `banner` segue viva nos
       quatro lugares acima. Ver `heroSubtitle` no tipo `Service`. */
    heroSubtitle: "Advancing women. Shaping the system.",
    /* ⚠️ SEM AS TRÊS PALAVRAS DA BORDA DIREITA (`heroCredential`) — 24-09, a
       pedido, junto com a régua vermelha que as fecha. */
    heroBody: [
      "Leadership development for women at the moments that shape careers: from early career to enterprise leadership.",
    ],
    whatWeDoHeadline:
      "Different organisational needs. Three pathways for women to lead at a higher level.",
    whatWeDo:
      "Every organisation has different needs at different stages. We create three distinct pathways, each designed to meet the real challenges women face, and the opportunities ahead.",
    /* ✅ AS TRÊS TRILHAS, no mapeamento de sempre: o rótulo é a sobreposição no
       quadro de cima, a linha em serifa é o `title` e o parágrafo é o `body`. A
       lista "FOCUS ON" é o campo novo — ver `focus` em `ServiceAudience`.

       ⚠️ SEM `audiencesLabel`, de propósito: aqui os cartões encostam no "What
       we do", que acabou de escrever rótulo e manchete, e o layout não desenha
       rótulo nenhum sobre eles. É o caso do Senior Leadership Development, não
       o do Talent Development. Ver a caixa daquele campo.

       ⏳ SEM FOTOGRAFIA: os três retratos do layout são arte do arquivo
       (~215px de largura cada) e não estão na pasta da cliente. Sem `image` o
       cartão cai no campo de cor `ink` com o nome da trilha em cima, que é o
       mesmo estado da Culture e do Talent Development. Quando as fotos
       chegarem, é acrescentar `image` nos três, em `public/services/audiences/`.

       ⚠️ OS RÓTULOS VÃO EM CAIXA BAIXA e o versalete é CSS, como em todos os
       outros serviços. */
    audiences: [
      {
        label: "Early career women",
        title: "Build the foundations early.",
        body: "For organisations wanting to strengthen confidence, voice, networks and leadership identity earlier in the pipeline.",
        focus: [
          "Leadership identity",
          "Voice & confidence",
          "Relationships",
          "Career ownership",
          "Resilience",
          "Networks",
        ],
      },
      {
        label: "Mid-career women",
        title: "Accelerate the critical middle.",
        body: "For organisations wanting to strengthen progression, sponsorship and readiness for bigger, broader leadership roles.",
        focus: [
          "Strategic perspective",
          "Influence",
          "Visibility",
          "Judgement",
          "Sponsorship",
          "Enterprise mindset",
        ],
      },
      {
        label: "Senior women",
        title: "Increase impact at the top.",
        body: "For organisations wanting to accelerate women into enterprise, ExCo and Board-level leadership and amplify their influence once there.",
        focus: [
          "Enterprise leadership",
          "Power & influence",
          "Collective judgement",
          "Board/ExCo impact",
          "Sponsorship of others",
          "Legacy",
        ],
      },
    ],
    /* ✅ A FAIXA ROSA QUE FECHA OS TRÊS CARTÕES — ver `ambition`. */
    ambition:
      "One ambition: stronger pipelines, greater progression and more women leading at every level.",
    howWeWorkHeadline: "Development in the flow of work.",
    howWeWork:
      "We combine proven methodologies with practical tools and support, so learning is applied where it matters most: in the real roles, relationships and moments women are navigating every day.",
    /* ✅ OS SETE PARÂMETROS DO PROGRAMA, na fileira de `steps`.

       ⚠️ ELES NÃO SÃO ETAPAS, e é a única coisa que esta escolha de campo
       afirma de mais: o layout liga os sete por SETAS, que é o desenho que só a
       fileira de `steps` faz, e `capabilities` (a lista sem seta) desenha em
       outro lugar da página — na faixa branca, ACIMA do "How we work", onde o
       layout não põe nada. Ou seja, a alternativa custaria a posição para
       ganhar a semântica. Fica o registro de que o `<ol>` daqui promete uma
       ordem que "6–9 months → 20–25 leaders" não tem; se a revisão reclamar, o
       conserto é uma prop de "seta sem ordem" no `SolutionSteps`, e não mover a
       fileira de lugar.

       ⚠️ O PAR TÍTULO/CORPO É A QUEBRA DO DESENHO: em cada célula a primeira
       parte da frase está em negrito e a segunda em corpo leve ("Face-to-face +"
       / "virtual"). Emendá-las numa string só perderia essa hierarquia.

       ⚠️ OS GLIFOS FORAM LIDOS DO LAYOUT, um a um: calendário, grupo, laptop,
       balão de fala, nós de rede, duas pessoas e bússola. `network` é o mesmo
       glifo que `SolutionPillars` dá a "Strategic networks" — mesmo conceito,
       mesmo símbolo, que é a regra da daily de 24-09. */
    steps: [
      { icon: "calendar", title: "6–9 months", body: "Typically" },
      { icon: "people", title: "20–25", body: "leaders per cohort" },
      { icon: "laptop", title: "Face-to-face +", body: "virtual" },
      { icon: "speech", title: "1:1", body: "coaching" },
      { icon: "network", title: "Peer & sponsor", body: "ecosystem" },
      { icon: "peers", title: "Tripartites with", body: "line managers" },
      { icon: "compass", title: "External", body: "mentors" },
    ],
    /* ✅ A LINHA ABAIXO DA FILEIRA — ver `stepsNote`. */
    stepsNote:
      "Learning is deliberately connected to the real roles, relationships, career moments and organisational systems women are navigating every day.",
    /* ✅ A FAIXA DE EVIDÊNCIA DO LAYOUT: três clientes, três provas — ver
       `ServiceEvidenceCases`.

       ⚠️ ESTE SERVIÇO NÃO TINHA EVIDÊNCIA NENHUMA até aqui. O outline o lista
       entre os cinco que *"launch on copy alone"*, e os blocos 4 e 5 não
       renderizavam nele. As três provas abaixo estão escritas em letra no
       layout, que é material posterior e aprovado — não são case do acervo nem
       dedução nossa.

       ⚠️ OS TRÊS LOGOS JÁ ESTAVAM EM `public/logos/`, e nenhum caminho novo foi
       inventado. ⏳ São do ACERVO ANTIGO (arquivos pequenos, com margem
       transparente em volta), e não do jogo recortado de 24-09 — na caixa do
       cartão eles desenham menor que o teto de 96px. É dívida de ASSET, a mesma
       anotada na HRLT e no Talent Development: quando forem tratados, é trocar
       o caminho aqui.

       ⛔ SEM `caseSlug`: nenhuma das três marcas tem página de caso publicada
       para este trabalho, e link para case despublicado é 404 em cima do logo
       de um cliente. */
    evidenceCases: {
      headline: "Progression you can see.",
      lead: "Real results from our work with women across industries, geographies and organisational levels.",
      items: [
        {
          logo: { src: "/logos/shell.png", alt: "Shell" },
          client: "Shell",
          title: "Powering women",
          tagline: "Building the pipeline at scale.",
          facts: [
            { value: "6,300", label: "Women impacted" },
            { value: "96%", label: "Facilitator impact" },
            { value: "70", label: "Net Promoter Score" },
          ],
          meta: ["5+ years", "Global"],
          note: "Leadership potential unlocked across levels, strengthening succession pipelines and inclusive enterprise mindsets at scale.",
        },
        {
          /* SEM `client`: o lockup da Kellanova já escreve o nome. */
          logo: { src: "/logos/kellanova.png", alt: "Kellanova" },
          title: "Women of Kellanova Aspire",
          tagline: "Turning potential into progression.",
          facts: [
            { value: "40%", label: "Rise in self-rated confidence" },
            { value: "90%", label: "Programme alumni retention" },
            { value: "5–7", label: "New sponsor relationships per participant" },
          ],
          meta: ["2020 – 2025", "16 countries", "AMEA"],
          note: "Women stepping into next-level roles not as exceptions, but as visible role models for others.",
        },
        {
          logo: { src: "/logos/aviva.png", alt: "Aviva" },
          title: "Accelerating leadership from the inside out",
          tagline: "Building inclusive leadership at the top.",
          facts: [
            { value: "350+", label: "Women leaders impacted" },
            { value: ">70%", label: "Delegates promoted" },
            { value: "3+", label: "Years of sustained partnership" },
          ],
          meta: ["2020 – 2023", "UK", "Canada", "Asia"],
          note: "Stronger succession pipelines, greater enterprise leadership and women progressing into increasingly influential roles.",
        },
      ],
    },
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
    /* ✅ AS DUAS PRIMEIRAS PARTES DO CTA SÃO AS DO LAYOUT, a terceira é a do
       documento. A strapline e a linha estão escritas em letra no fecho do
       desenho ("Lower the ceiling. Raise the floor." e as três frases ao lado
       do filete vermelho); o rótulo do botão não aparece ali, e o do
       `CDNA_03_Services.docx` continua valendo — é copy final e não há desenho
       que a contradiga.

       ⚠️ AS TRÊS FRASES VIRAM UMA LINHA SÓ. No layout elas empilham à direita
       de um filete; o `SolutionCta` recebe `line` como um texto, e parti-lo
       exigiria uma prop de lista numa faixa que as outras nove páginas
       partilham. Em frases curtas e pontuadas a emenda não se nota.

       ⛔ A STRAPLINE ANTERIOR ERA *"Talent is there. Progression isn’t
       always."*, e a linha *"Accelerate the readiness, visibility and
       progression of women while strengthening the leadership pipeline around
       them."* — as duas do documento. Estão aqui para quem precisar reverter. */
    cta: {
      strapline: "Lower the ceiling. Raise the floor.",
      line: "Develop the woman. Strengthen the environment around her. Create the conditions for progression to continue.",
      label: "Talk to us about accelerating women in your pipeline",
    },
  },
  {
    slug: "high-performing-teams",
    heroImage: "/hero/hpt-f1.jpeg",
    cardImage: "/services/cards/high-performing-teams-client.jpg",
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
      /* ⏳ Placeholder de 17-09 — ver a caixa de `EVIDENCE_IMAGE_PLACEHOLDER`. */
      image: EVIDENCE_IMAGE_PLACEHOLDER,
    },
    /* ⏳ Placeholder de 17-09 — ver a caixa de `evidenceQuotePlaceholder`. */
    testimonial: evidenceQuotePlaceholder("ADIDAS"),
  },
  {
    slug: "hrlt-effectiveness",
    cardImage: "/services/cards/hrlt-effectiveness-client.jpg",
    /* ============================================================================
       ✅ A HRLT VOLTOU PARA O TEMPLATE — 24-09
       ============================================================================
       Até aqui esta era a ÚNICA das dez escrita à mão: a branch
       `feature/paginas-servicos-menu-herois` trouxe uma `HrltPage.tsx` com o
       layout inteiro em JSX, fora do `SolutionView`. Ela saiu, e a copy dela
       virou o dado abaixo.

       O QUE ISSO CONSERTA, que foi o pedido: a página media `max-w-[1200px]`
       contra os 1440 das outras nove, pintava a faixa clara com um `#f7f1ef`
       cravado em vez do token `paper`, escrevia os rótulos a 13px/2px contra
       14px/1,3px, desenhava os ícones num disco `#f6e8e6` de 64px em vez do
       `brand/10` de 56, punha seta em texto (`→`) no lugar do glifo do lucide, e
       ainda numerava os passos — que é justamente o que a daily deste mesmo dia
       mandou tirar (*"no How we work, tirar a numeração, porque as setas já
       mostram a progressão"*). Nada disso precisa mais ser consertado uma vez:
       as medidas passaram a vir dos mesmos componentes das outras nove.

       O QUE MUDOU DE FORMA, e vale dizer porque não é transcrição pura:

         • OS CINCO EIXOS ("Collective Identity"…) ficavam na coluna da direita
           do "What we do". Aqui eles são `capabilities` e saem numa fileira
           ABAIXO daquele bloco, dividindo a faixa branca com ele — o mesmo
           arranjo dos cartões de público e das trilhas, que é o que o template
           faz com um bloco que pertence ao de cima.

         • A EVIDÊNCIA ERA seis resultados à esquerda e quatro logos à direita,
           sob um rótulo "Trusted by". Virou a faixa `evidenceSummary`: manchete,
           linha de apoio, a grade dos seis (`outcomes`) e os quatro logos na
           fileira de baixo. O "Trusted by" saiu — o rótulo da faixa já é
           "Evidence" e a manchete já diz do que ela trata.

         • O FECHO PRÓPRIO ("Keep leadership real. / People · Teams ·
           Organisations · A brighter tomorrow") SAIU com o `ServiceClose`. No
           lugar dele entram o CTA e o "Related services" que as outras nove
           têm — o convite desta página já existia em `cta`, logo abaixo, e não
           estava sendo mostrado.

       ⏳ A COPY ABAIXO AINDA VAI MUDAR. A daily de 24-09 diz que *"elas vão
       mandar o texto reduzido"* da HRLT. O que se ganha com a migração é que o
       texto novo entra trocando string neste arquivo, sem tocar em layout. */
    title: "HR Leadership Teams (HRLT)",
    banner: "Stronger HR leadership teams. A greater impact on the business.",
    heroImage: "/hero/hrlt.jpeg",
    whatWeDoHeadline:
      "Build HR leadership teams that shape the business, from the inside out.",
    whatWeDo:
      "We help CHROs and their HR Leadership Teams strengthen their collective identity, capability and ways of working, so they can lead people, performance and transformation in a more connected, strategic and impactful way.",
    capabilities: [
      {
        icon: "people",
        title: "Collective Identity",
        body: "Align purpose, values and enterprise role for the HR function.",
      },
      {
        icon: "sprout",
        title: "Capability & Mindset",
        body: "Build the skills, judgement and confidence to lead in a complex, AI-driven world.",
      },
      /* ⚠️ `workflow` E NÃO O GRÁFICO DE BARRAS que a página antiga mostrava
         aqui. Lá "Ways of Working" e "Measure" saíam com o MESMO `BarChart3` —
         barras medem, e o que este eixo descreve é como o time trabalha junto.
         O glifo repetido vinha de uma página escrita à mão, sem mapa de ícones
         que obrigasse a escolher. */
      {
        icon: "workflow",
        title: "Ways of Working",
        body: "Create clarity, rhythm and collaboration across the team and wider business.",
      },
      {
        icon: "growth",
        title: "Enterprise Impact",
        body: "Increase influence, credibility and contribution to business priorities.",
      },
      {
        icon: "globe",
        title: "Future Readiness",
        body: "Prepare HRLTs to navigate change, disruption and shape what comes next.",
      },
    ],
    howWeWorkHeadline: "A focused, practical journey. Built around your context.",
    howWeWork:
      "We combine insight, experience and real-world application to help HRLTs make progress that sticks.",
    /* ESTES SÃO SEQUÊNCIA — saem com seta e `<ol>`, ao contrário dos
       `capabilities` acima. Discover vem antes de Embed porque o trabalho
       acontece nessa ordem, e é isso que a seta afirma. */
    steps: [
      {
        icon: "search",
        title: "Discover",
        body: "Understand your context, ambitions and team dynamics.",
      },
      {
        icon: "document_check",
        title: "Co-create",
        body: "Design a tailored journey with the CHRO and HRLT.",
      },
      {
        icon: "people",
        title: "Experience",
        body: "Run immersive sessions, sprints and real-time application.",
      },
      {
        icon: "tools",
        title: "Embed",
        body: "Provide tools, coaching and team practices to integrate new behaviours.",
      },
      {
        icon: "chart",
        title: "Measure",
        body: "Track progress and impact on team effectiveness and business outcomes.",
      },
    ],
    /* ⚠️ OS QUATRO LOGOS SÃO OS DO MURAL, e não os arquivos de 24-09 que a faixa
       de evidência do Senior Leadership Development usa. Os dela foram
       recortados pela caixa do alfa para respeitarem o teto de 240x86; estes
       vêm do acervo antigo e podem desenhar menores que o teto. É dívida de
       ASSET, não de layout: quando os quatro forem tratados como os outros dois,
       é trocar o caminho aqui.

       ⚠️ NENHUM LEVA A CASE. `caseSlug` só entra quando existe página publicada
       para linkar, e a régua é a mesma da HEINEKEN no outro serviço — ver a
       caixa de `evidenceSummary` do Senior Leadership Development. */
    evidenceSummary: {
      headline: "Stronger HRLTs. Greater business impact.",
      lead: "Our work helps HR leadership teams build the capability and influence to drive real change.",
      logoSize: "small",
      logos: [
        { src: "/logos/adidas.png", alt: "adidas" },
        { src: "/logos/frasers_property.png", alt: "Frasers Property" },
        { src: "/logos/dyson.png", alt: "dyson" },
        { src: "/logos/maaden.png", alt: "Ma'aden" },
      ],
      outcomes: [
        "Stronger strategic influence",
        "Faster and better decision-making",
        "Greater alignment and collective impact",
        "Higher employee and manager engagement",
        "More consistent execution of people priorities",
        "A future-ready HR function",
      ],
    },
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
    cardImage: "/services/cards/judgement-in-ai-client.jpg",
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
    cardImage: "/services/cards/executive-coaching-client.jpg",
    title: "Executive Coaching",
    banner: "Strengthen judgement and leadership performance when the stakes are highest.",
    /* ============================================================================
       ✅ O LAYOUT DE 24-09 (`executive coaching.jpeg`) — O QUE ELE TROUXE
       ============================================================================
       A página passou a ter, na ordem do desenho: a dobra com a frase de três
       tempos, o "What we do" com os quatro diferenciais ao lado, os quatro
       públicos da pipeline, os sete passos NUMERADOS e a faixa de evidência com
       quatro medidas.

       ⚠️ A FAIXA DE EVIDÊNCIA TROCOU DE TIPO, e é a decisão que mais mexe no
       dado: `evidence` (o bloco de caso, escuro, com foto placeholder) saiu e
       `evidenceSummary` entrou — os dois são excludentes, e o teste em
       `tests/services.test.ts` fixa isso. O parágrafo da prática e as três
       medidas dela ("1,000+", "20+", "6 to 12") chegaram a morar na faixa nova
       e saíram a pedido no mesmo dia — ver a caixa em `evidenceSummary`. A
       CITAÇÃO — a única publicável dos dez — continua no `testimonial`.

       ⏳ AS QUATRO FOTOS DOS CARTÕES DE PÚBLICO NÃO EXISTEM — ver a caixa em
       `audiences`, abaixo. */
    heroSubtitle: "Individuals. Pairs. Teams.",
    heroBody: [
      "Deeper insight, broader perspective and lasting impact for leaders and their organisations.",
    ],
    /* ⚠️ SEM AS TRÊS PALAVRAS DA BORDA DIREITA (`heroCredential`) — 24-09, a
       pedido, junto com a régua vermelha que as fecha. */
    whatWeDoHeadline: "Coaching that goes beneath the surface.",
    whatWeDo:
      "Our coaching combines deep personal insight with real-world leadership experience. We work with the whole leader – their identity, context, relationships and performance – connecting the inner game with the outer game to drive sustained impact.",
    /* ✅ À DIREITA DO "WHAT WE DO", na mesma faixa branca, como o layout
       desenha — 24-09, a pedido: *"faltou aquela parte da direita"*. Ver
       `capabilitiesBeside`.

       ⚠️ A CAIXA ALTA É DO LAYOUT e está escrita no dado porque o componente não
       transforma o título — ele é `font-semibold` e mais nada. */
    capabilitiesBeside: true,
    capabilitiesHeader: { label: "Why our coaching stands out" },
    capabilities: [
      {
        icon: "mindset",
        title: "INSIDE OUT",
        body: "We get beneath behaviour to the beliefs, patterns and assumptions driving it.",
      },
      {
        icon: "people",
        title: "PRACTITIONERS, NOT JUST COACHES",
        body: "Our coaches bring senior organisational and leadership experience into the room.",
      },
      {
        icon: "target",
        title: "REAL WORK. REAL MOMENTS.",
        body: "Coaching is anchored in live challenges, relationships, decisions and transitions – not abstract development.",
      },
      {
        icon: "network",
        title: "CONNECTED TO THE SYSTEM",
        body: "Where appropriate, tripartites, stakeholder insight and 360 feedback connect individual growth to organisational impact.",
      },
    ],
    audiencesLabel: "Coaching across the leadership pipeline",
    /* ⚠️ SEM `label` — o layout não escreve nada sobre as fotos; o nome do
       público é o título. Ver a caixa do campo em `ServiceAudience`.

       ⏳ AS QUATRO FOTOS SÃO A CHAPA PLACEHOLDER, e de propósito: as do arquivo
       são retratos chapados no pixel, e emprestar as fotos de outro serviço
       (`/services/audiences/sld-*.jpg`) passaria por asset entregue numa revisão
       rápida — que é exatamente o que a chapa impede. Sai quando as fotos
       chegarem; é trocar o caminho aqui. */
    audiences: [
      {
        title: "Executive teams and ELT minus one",
        body: "Navigate complex challenges and lead with greater impact.",
        image: EVIDENCE_IMAGE_PLACEHOLDER,
      },
      {
        title: "Regional & functional leaders",
        body: "Broaden perspective, strengthen influence and drive performance across geographies and functions.",
        image: EVIDENCE_IMAGE_PLACEHOLDER,
      },
      {
        title: "Directors & VPs",
        body: "Step into bigger, broader roles with greater confidence and clarity.",
        image: EVIDENCE_IMAGE_PLACEHOLDER,
      },
      {
        title: "Managers & emerging leaders",
        body: "Build leadership foundations, resilience and the confidence to lead through others.",
        image: EVIDENCE_IMAGE_PLACEHOLDER,
      },
    ],
    howWeWorkHeadline: "A structured, personalised journey from insight to impact.",
    /* ✅ SEM CORPO E EMPILHADO — 24-09, a pedido: o layout escreve só a
       manchete, em largura cheia, e os passos logo abaixo. A string vazia (e
       não a ausência do campo) é o que impede o `??` de cair no `howWeHelp`.
       `sectionLayout` só vale aqui: o "What we do" desta página usa o arranjo
       de `capabilitiesBeside`. */
    howWeWork: "",
    sectionLayout: "stacked",
    /* ⚠️ NUMERADOS — o layout desenha o disco vermelho com o número em cada um
       dos sete, e o ícone escuro, sem disco, logo abaixo dele. Ver
       `stepsNumbered` e `stepsPlainIcons`. */
    stepsNumbered: true,
    stepsPlainIcons: true,
    steps: [
      {
        icon: "search",
        title: "Chemistry conversation",
        body: "30 minutes to explore fit, goals and how we work together.",
      },
      {
        icon: "target",
        title: "Set the direction",
        body: "Clarify focus, define success and agree on the coaching journey.",
      },
      {
        icon: "speech",
        title: "Coaching sessions",
        body: "A series of focused sessions to build awareness, overcome barriers and drive behaviour change.",
      },
      {
        icon: "people",
        title: "Tripartite check-ins (with line manager)",
        body: "Strengthen alignment, accelerate progress and remove blockers.",
      },
      {
        icon: "chart",
        title: "Integration and practice",
        body: "Apply insights in the flow of work with ongoing support and reflection.",
      },
      {
        icon: "check",
        title: "Review and sustain",
        body: "Measure progress, reinforce new habits and plan the next chapter.",
      },
      {
        icon: "fast_forward",
        title: "Extend (optional)",
        body: "Additional sessions or team coaching to build on impact.",
      },
    ],
    /* ⚠️ AS QUATRO MEDIDAS DO LAYOUT TÊM `icon` E `body`, e é isso que as manda
       para a grade alinhada à esquerda, com o ícone ao lado do número. A conta
       está em `SolutionEvidenceSummary`.

       ⚠️ SEM `logos`: o layout não desenha marca nenhuma nesta faixa. */
    evidenceSummary: {
      headline: "Measurable impact for leaders and their organisations.",
      facts: [
        {
          icon: "Higher resilience",
          value: "80%",
          label: "Higher resilience",
          body: "Leaders feel better equipped to manage pressure, uncertainty and change.",
        },
        {
          icon: "Stronger role integration",
          value: "75%",
          label: "Stronger role integration",
          body: "Leaders bring greater alignment between their values, strengths and role demands.",
        },
        {
          icon: "New role success",
          value: "70%",
          label: "New role success",
          body: "Leaders in new roles reach impact faster and with greater confidence.",
        },
        {
          icon: "Greater team effectiveness",
          value: "3x",
          label: "Greater team effectiveness",
          body: "Coached leaders report stronger collaboration, trust and performance in their teams.",
        },
      ],
      /* ⛔ SEM "GLOBAL EXECUTIVE COACHING PRACTICE" — 24-09, a pedido. O
         parágrafo e as três medidas da prática ("1,000+ leaders coached",
         "20+ countries", "6 to 12 session journeys") saíram junto; estão no
         git. Sem `experience` a faixa volta a ter uma coluna só, e as quatro
         medidas ocupam a largura inteira, como o layout desenha. */
    },
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
    /* ⚠️ A STRAPLINE E A LINHA SÃO AS DO LAYOUT DE 24-09, e substituem as do
       `CDNA_03_Services.docx` (*"Bigger roles. Higher stakes. Fewer easy
       answers."*, com o parágrafo sobre complexidade e escala) — que estão no
       git e podem voltar numa linha. O `label` do botão fica: o desenho não
       desenha botão nenhum, e inventá-lo seria copy nossa.

       ⚠️ O FECHO DO LAYOUT É UMA FOTO DE MONTANHAS com as duas frases por cima,
       e aqui ele é a faixa vermelha do `SolutionCta` — a mesma das outras nove.
       Foto de fundo nesta faixa não existe no template. */
    cta: {
      strapline: "Deeper insight. Bigger impact.",
      line: "Helping leaders and their teams turn insight into lasting performance.",
      label: "Talk to us about your executive coaching needs",
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
    /* ⚠️ O HERÓI CONTINUA SENDO A FOTO DO CARD, e a foto da família ao pôr do
       sol que o layout desenha NÃO ENTROU: ela é arte do próprio arquivo, num
       JPEG de 1536px em que a imagem mede ~700px de largura e traz o lettering
       "Generations People Possibilities." chapado no pixel. Recortá-la daria
       uma dobra de sangria total macia e com texto cravado que ninguém
       consegue traduzir nem editar pelo /edit. A `family-business-consulting-
       client.jpg` é material da cliente, escolhido por ela em 17-09, e mantém
       a continuidade card → herói. */
    cardImage: "/services/cards/family-business-consulting-client.jpg",
    title: "Family Business Consulting",
    banner:
      "Build the leadership, governance and succession capability required to protect the legacy while creating the future.",
    /* ============================================================================
       ✅ A PÁGINA REFEITA PELO LAYOUT DE 24-09 (duas imagens, uma página só)
       ============================================================================

       Toda a copy abaixo está escrita em letra nas duas partes do layout e foi
       TRANSCRITA, não reescrita — a mesma operação que Culture, Manager, HRLT e
       Talent já sofreram. Os campos novos que ela exigiu (`heroEyebrow`,
       `heroSubtitleAccent`, `heroCredential`, `twoSystems`, `entryPoints`,
       `outcomeSummary`) estão documentados um a um no tipo `Service`.

       ⚠️ O `outcome`, O `howWeHelp` E OS `pillars` CONTINUAM NO DADO, mais
       abaixo, pela decisão de sempre: são a copy do `CDNA_03_Services.docx`, que
       nunca deixou de ser final, e o template cai neles por `??` em qualquer
       bloco que a copy nova não cubra. O `outcome` era o corpo do bloco "What
       we do", que saiu da página em 24-09 (`hideWhatWeDo`). Os `pillars` também
       saem, porque `steps` tem precedência sobre eles.

       ⚠️ TRAVESSÕES: o layout não tem nenhum. O que ele tem são MEIOS-TRAÇOS
       (–) na segunda frase do herói e em "founder-led", "High-Performing",
       "Next-generation", que não são alvo do pedido de 23-09 — ele é sobre o
       travessão de frase (—). `tests/services.test.ts` guarda a regra.
       ============================================================================ */
    /* ✅ O RÓTULO DO HERÓI É O DO LAYOUT, e é o único dos dez que não escreve
       "Our Services" — ver a caixa de `heroEyebrow` no tipo `Service`. */
    heroEyebrow: "Family-led business consulting",
    /* ✅ SEM O BLOCO "WHAT WE DO" — 24-09, a pedido. O layout não o desenha;
       a faixa "Two systems" passa a ser a primeira depois do herói. */
    hideWhatWeDo: true,
    /* ✅ A MANCHETE BICOLOR DO LAYOUT, partida em dois campos: a primeira linha
       em tinta (branca, sobre a foto) e a segunda em vermelho. Ver
       `heroSubtitleAccent`. O `h1` continua sendo o nome do serviço. */
    heroSubtitle: "Protecting the legacy.",
    heroSubtitleAccent:
      "Preparing the family and business for what comes next.",
    heroBody: [
      "Family businesses carry something powerful that other organisations cannot replicate: history, identity, relationships and a deeply personal connection to the enterprise.",
      "As the business grows and generations evolve, what once happened naturally can become more complex. We work across both sides of the system – the family behind the business and the business led by the family – helping each evolve without losing the values and identity that made it successful.",
    ],
    /* ⚠️ SEM A COLUNA DE PALAVRAS NO CANTO DA DOBRA (`heroCredential`) — 24-09,
       a pedido, junto com a régua vermelha que a fecha. O lettering manuscrito
       do layout ("Generations People Possibilities.") também não entrou: é arte
       desenhada dentro da imagem, numa caligrafia que o site não tem. */
    /* ✅ A FAIXA DOS DOIS SISTEMAS — ver `ServiceTwoSystems` e
       `SolutionTwoSystems`. Os glifos dos onze itens foram lidos do desenho, um
       a um, e moram no mapa de `SolutionPillars`. */
    twoSystems: {
      label: "Two systems. One future.",
      family: {
        title: "The family",
        lead: "From legacy to shared stewardship.",
        body: "We work with the Founding Chairman, family leaders, next generation and wider family members to strengthen relationships, alignment and prepare for what comes next.",
        icon: "people",
        items: [
          { label: "Values & Legacy", body: "What we stand for." },
          {
            label: "Family Alignment",
            body: "Roles, expectations and contribution.",
          },
          {
            label: "Radical Conversations",
            body: "A trusted space for the hard conversations.",
          },
          {
            label: "Founder & Successor Coaching",
            body: "Personalised coaching through transition.",
          },
          {
            label: "Transition Readiness",
            body: "Preparing the family for the next chapter.",
          },
        ],
      },
      business: {
        title: "The business",
        lead: "From founder-led success to enduring enterprise performance.",
        body: "Alongside the family, we build the leadership, talent and organisational capability required for the business to thrive across generations.",
        icon: "chart",
        items: [
          {
            label: "Next Generation Talent",
            body: "Accelerating family and non-family talent.",
          },
          {
            label: "High-Performing Culture",
            body: "Building the habits and accountability for the next stage.",
          },
          {
            label: "Women in Leadership",
            body: "Stronger pathways and opportunities across the enterprise.",
          },
          {
            label: "Manager Development",
            body: "Building capable managers for everyday execution.",
          },
          {
            label: "Leader Coaching",
            body: "Executive and leadership coaching for greater impact.",
          },
          {
            label: "Performance & Accountability",
            body: "Clear expectations and ownership across the organisation.",
          },
        ],
      },
      venn: {
        leftTitle: "Family",
        leftWords: ["Values", "Relationships", "Legacy"],
        rightTitle: "Business",
        rightWords: ["Growth", "Performance", "Impact"],
        note: "Stronger families. Higher-performing businesses. Lasting impact.",
      },
    },
    /* ✅ A FAIXA ROSA DOS OITO GATILHOS — ver `SolutionEntryPoints`. O fecho de
       duas linhas tem a mesma anatomia do `closing` (tinta + vermelho) e mora
       aqui porque no layout ele é a coluna da direita DESTA faixa, e não um
       bloco entre seções. */
    entryPoints: {
      label: "Where we typically enter",
      items: [
        "Founder / Chairman transition",
        "Next generation stepping up",
        "Family roles changing",
        "Growth or diversification",
        "Professionalising the organisation",
        "Culture needing to evolve",
        "Succession approaching",
        "Family alignment around a critical decision",
      ],
      noteLead: "The transition may begin with one person.",
      noteAccent:
        "But its consequences ripple through the family and the business.",
    },
    /* ✅ A MANCHETE DE "HOW WE WORK" É A ÚNICA LINHA QUE O LAYOUT ESCREVE ALI.
       O corpo do bloco continua sendo o `howWeHelp` do documento, por `??`. */
    howWeWorkHeadline:
      "We work with the family system and the business system together.",
    /* ✅ OS SEIS PASSOS, numerados como o layout os desenha — ver
       `stepsNumbered`. A ordem AFIRMA: "Listen" vem antes de "Surface" porque o
       trabalho acontece nessa ordem, e é isso que a seta entre os discos diz. */
    stepsNumbered: true,
    steps: [
      {
        icon: "search",
        title: "Listen",
        body: "Understand the family story, business ambition, relationships, values and transition ahead.",
      },
      {
        icon: "document",
        title: "Surface",
        body: "Bring underlying expectations, tensions and differing perspectives into the conversation.",
      },
      {
        icon: "people",
        title: "Align",
        body: "Create clarity around shared values, roles, decisions and what the family wants to protect and evolve.",
      },
      {
        icon: "lightbulb",
        title: "Prepare",
        body: "Coach the Chairman, family members and next generation for the transitions ahead.",
      },
      {
        icon: "cog",
        title: "Build",
        body: "Strengthen the talent, leadership, culture and management capability of the enterprise.",
      },
      {
        icon: "chart",
        title: "Embed",
        body: "Translate intent into new habits, conversations, decisions and ways of working.",
      },
    ],
    /* ✅ OS OITO PARES "DE → PARA". A ordem dentro do par é a afirmação: à
       esquerda o que a família tem hoje, à direita o que ela passa a ter.

       ⏳ O LAYOUT OS SEPARA EM DOIS GRUPOS — três pares, um respiro, cinco
       pares —, e aqui eles saem numa lista só. `ServiceShifts` não tem campo de
       grupo e inventá-lo para uma página seria mudar a forma do dado do Talent
       Development junto; o respiro do desenho é ritmo visual, não informação.
       Se a cliente pedir a separação na revisão, é um campo opcional no tipo. */
    shifts: {
      label: "What shifts",
      items: [
        { from: "Inherited values", to: "Conscious stewardship" },
        { from: "Unspoken expectations", to: "Radical conversations" },
        {
          from: "Individual perspectives",
          to: "Decisions the family can stand behind",
        },
        { from: "Founder dependency", to: "Next-generation readiness" },
        { from: "Family legacy", to: "Future-facing identity" },
        { from: "Founder-led culture", to: "High-performing culture" },
        { from: "Potential successors", to: "Enterprise-ready talent" },
        { from: "Informal accountability", to: "Performance ownership" },
      ],
    },
    /* ✅ O FECHO "THE OUTCOME", com o "Our experience" na coluna da direita —
       ver `ServiceOutcomeSummary`. O ponto final das quatro legendas é do
       layout E é a chave do ícone no mapa de `SolutionPillars`. */
    outcomeSummary: {
      label: "The outcome",
      headline: "Continuity without standing still.",
      items: [
        "A family clearer about what it stands for.",
        "Stronger relationships and alignment.",
        "A higher-performing business with the leadership and talent to scale.",
        "A successful transition to the next generation.",
      ],
      note: [
        "Preserve what matters.",
        "Evolve what must.",
        "Build what comes next.",
      ],
      experience: {
        label: "Our experience",
        body: "We’ve partnered with family-led businesses across industries and geographies, helping generations of families and their businesses navigate complexity, unlock potential and build a lasting legacy.",
      },
    },
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

/**
 * A manchete de um bloco, com o placeholder no lugar do vazio.
 *
 * ⚠️ VIVE AQUI E NÃO NO COMPONENTE porque o placeholder é uma decisão de
 * CONTEÚDO, não de apresentação: quem decide o que fazer quando falta copy é o
 * mesmo arquivo que guarda a copy. No componente, ele viraria um valor padrão de
 * prop — e valor padrão de prop é o tipo de coisa que ninguém procura quando vai
 * perguntar "quantas frases ainda faltam pedir para a cliente?".
 */
export const headlineOr = (headline?: string) =>
  headline?.trim() ? headline : HEADLINE_PLACEHOLDER;

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
    /* O MIOLO — escape do HTML e `**…**` → `<strong>` — mora em
       `lib/page-copy/text.ts` desde 23-09, porque a About precisa dele SEM o
       `<p>` em volta. As armadilhas estão documentadas lá, no ponto em que o
       código está. */
    .map(inlineEmphasis)
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
