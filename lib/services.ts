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

export type ServiceEvidenceSummary = {
  /** A manchete em serifa, logo abaixo do rótulo "Evidence". */
  headline: string;
  /** A linha de apoio, um corpo abaixo da manchete. */
  lead: string;
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
  logos: { src: string; alt: string; caseSlug?: string }[];
  /** As medidas entre as marcas. Mesmo `ServiceFact` da faixa antiga. */
  facts: ServiceFact[];
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
  /** O rótulo vermelho em caixa alta, com o traço embaixo. */
  label: string;
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
   * Os três cartões de público do mockup de 21-09 — ver a caixa de
   * `ServiceAudience`. Ausente ou vazio = a faixa não renderiza.
   *
   * ⏳ UM DOS DEZ TEM.
   */
  audiences?: ServiceAudience[];
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
   * ⏳ UM DOS DEZ TEM.
   */
  steps?: ServiceStep[];
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
   * ⏳ O CAMINHO SE ELA QUISER AS DUAS IGUAIS: apagar este campo e pôr o mesmo
   * arquivo em `cardImage`. Uma linha, e a continuidade volta.
   *
   * Ausente = o herói segue mostrando o `cardImage`, e quem não tem nenhum dos
   * dois cai na `service-hero-fallback.jpg`.
   */
  heroImage?: string;
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
      headline: "The CDNA Culture Ecosystem",
      body: "We embed culture through ten interconnected elements: the moments that matter in the flow of work. When these work together, culture stops being a poster and becomes a lived reality.",
      asideTitle: "Ten planets. A stronger culture.",
      asideBody:
        "These ten elements work together as an integrated ecosystem to create the conditions for culture to come alive at every level, in every part of the organisation.",
      /* ⏳ SEM `diagram`: a chapa PLACEHOLDER fica no meio da faixa até o arquivo
         delas chegar. O porquê inteiro está na caixa da prop, e o resumo é que o
         diagrama do layout é justamente a versão que elas pediram para trocar. */
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
    heroImage: "/hero/talent-high-potentials.jpeg",
    cardImage: "/services/cards/talent-development-client.jpg",
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
      /* ⏳ Placeholder de 17-09 — ver a caixa de `EVIDENCE_IMAGE_PLACEHOLDER`. */
      image: EVIDENCE_IMAGE_PLACEHOLDER,
    },
    /* ⏳ Placeholder de 17-09 — ver a caixa de `evidenceQuotePlaceholder`. Foi
       ESTA PÁGINA que motivou o pedido: era a faixa de evidência mais vazia dos
       cinco serviços que a renderizam, em uma coluna só. */
    testimonial: evidenceQuotePlaceholder("VODAFONE"),
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
    title: "HR Leadership Teams (HRLT)",
    banner: "Stronger HR leadership teams. A greater impact on the business.",
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
      /* ⏳ Placeholder de 17-09 — ver a caixa de `EVIDENCE_IMAGE_PLACEHOLDER`.
         ⚠️ SÓ A FOTO É PLACEHOLDER AQUI: a citação abaixo é real e é a única
         publicável dos dez. Não trocar por `evidenceQuotePlaceholder`. */
      image: EVIDENCE_IMAGE_PLACEHOLDER,
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
    cardImage: "/services/cards/family-business-consulting-client.jpg",
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
