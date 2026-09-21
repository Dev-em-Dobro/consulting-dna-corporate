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
  attribution: `Name, Title — ${client}`,
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
 * lugar a uma tira só: um rótulo vermelho à esquerda e três práticas com ícone.
 *
 * O `lead` É UM RÓTULO, NÃO UMA PRÁTICA. No desenho ele não tem ícone e é o
 * único em vermelho: ele nomeia o que os três itens à direita têm em comum
 * ("A common outcome"), e por isso vive num campo separado em vez de ser o
 * primeiro elemento de `items` — se fosse, qualquer laço que pinte ou conte os
 * itens o trataria como prática.
 *
 * ⏳ SÓ O PRIMEIRO SERVIÇO TEM. Ausente = o serviço continua exatamente como
 * estava, com o bloco "How we work" e os `pillars`. É a mesma guarda de
 * `audiences` e `closing`, e é o que impede esta segunda revisão de esvaziar as
 * outras nove páginas, que nunca receberam a copy nova.
 */
export type ServicePractices = {
  /** O rótulo vermelho da esquerda, sem ícone. */
  lead: string;
  /** As práticas, com ícone. O mapa rótulo→ícone vive no componente. */
  items: string[];
};

export type Service = {
  slug: string;
  title: string;
  /** A "banner statement" do outline: uma frase, no herói, sob o nome. */
  banner: string;
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
      "We develop the **Inner Game and Outer Game** of leadership — how leaders think, judge and show up, and how they translate that into the way they lead people, make decisions, collaborate and deliver performance. Real business challenges, everyday decisions, critical conversations and leadership habits become the practice ground — so development is not something leaders attend. **It changes how they lead every day.**",
    pillars: [
      "Immersive experiences",
      "Coaching",
      "Real business challenges",
      "Peer learning",
      "Mastery labs",
    ],
    /* ✅ A TIRA DA SEGUNDA REVISÃO DE 21-09, transcrita da imagem
       `docs/meetings/secao-atualizada-our-work.jpg`. Quatro células: o rótulo
       vermelho e três práticas.

       ELA NÃO É UMA VERSÃO CURTA DOS `pillars` ACIMA, e por isso os dois campos
       convivem em vez de um substituir o outro. Os `pillars` são as palavras da
       frase de `howWeHelp` — o COMO: imersões, coaching, desafios reais. Estes
       três são o que o trabalho produz — hábitos, identidade, os momentos que
       importam. Trocar um pelo outro no mesmo campo faria a próxima pessoa achar
       que a cliente renomeou cinco itens, quando ela trocou a pergunta.

       ⚠️ OS TRÊS ITENS RESOLVEM, DE LAMBUJA, A DÍVIDA ANOTADA LOGO ABAIXO. A
       caixa dos `pillars` registra que o mockup de 21-09 pedia oito itens e
       nós tínhamos cinco, faltando "leadership experiments", "everyday habits" e
       "measurement", e que o conserto dependia de a cliente reescrever a frase.
       A revisão dela não reescreveu a frase: encurtou a fileira para três. A
       dívida deixou de existir por mudança de desenho, não por copy nova — e a
       caixa abaixo fica porque volta a valer se a fileira de oito voltar. */
    practices: {
      lead: "A common outcome",
      items: ["Habits", "Identity", "Moments that matter in the flow of work"],
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
    audiences: [
      {
        label: "Executive teams",
        title: "Align. Decide. Deliver.",
        body: "We help Executive Teams build collective leadership, stronger decision quality and the capability to lead transformation together.",
        image: "/services/audiences/sld-executive-teams.jpg",
      },
      {
        label: "SLT / ET-1",
        title: "From functional to enterprise leadership.",
        body: "We work with SLT and ET-1 leaders to move from functional excellence to enterprise leadership — leading across boundaries, influencing horizontally and translating strategy into execution.",
        image: "/services/audiences/sld-slt-et1.jpg",
      },
      {
        label: "Top 100 – 150 leaders",
        title: "A stronger leadership community.",
        body: "We build leadership communities with a shared language, stronger judgement and the habits required to lead consistently at scale.",
        image: "/services/audiences/sld-top-100-150.jpg",
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
    /* ⚠️ SEM `caseSlug` DESDE 17-09, e a pergunta que estava aqui morreu com
       isso: o caso da Heineken foi despublicado no CMS junto com os outros cinco
       legados (nenhum tem `Reviewed = Yes` na planilha dela), e `/cases/heineken`
       responde 404. O link some porque `SolutionEvidence` esconde o "read the
       full story" quando o campo falta — é um dos estados que ele já monta.

       A observação de conteúdo fica registrada para quando o caso voltar: o
       publicado contava OUTRO trabalho — 70+ sucessores HiPo na APAC, parceria
       de 6 anos — e não esta jornada de 18 meses com os 150. Mesmo cliente,
       engajamento diferente. Religar o link é devolver uma linha, e continua
       sendo pergunta a fazer à cliente antes. */
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
      /* ⏳ FOTO PROVISÓRIA, e o "PLACEHOLDER" está no nome do arquivo para que
         ninguém a confunda com asset entregue pela cliente.

         DUAS TROCAS NO MESMO DIA, e o registro importa porque a primeira versão
         desta caixa descrevia a outra: entrou como recorte do mockup dela
         (`4. Services/ExCo Leadership Services Page.png`), e algumas horas
         depois foi substituída por uma fotografia da placa da HEINEKEN, vinda do
         nosso lado. A segunda é 2:1 numa caixa 4:5, e é por isso que o
         `object-right` existe em `SolutionEvidence` — ver a caixa de lá.

         SAI no dia em que a cliente mandar a foto de verdade, pedida na daily de
         16-09: é trocar este caminho e apagar esta caixa. ⚠️ TROCAR O NOME DO
         ARQUIVO JUNTO — o otimizador do Next serve por URL e já entregou versão
         velha uma vez hoje, por causa disso. */
      image: "/services/evidence/heineken-sign.PLACEHOLDER.jpg",
    },
    /* ⏳ PLACEHOLDER DA PRÓPRIA MOCKUP — NÃO PODE IR PARA PRODUÇÃO ASSIM.
       Não existe citação do Top 150 em documento nenhum da cliente, e o template
       que ela mandou assume isso: no lugar do depoimento, o mockup escreve, em
       letra, "A quote from Dolf to be confirmed." com a atribuição "Name, Title
       / HEINEKEN". É esse texto, literal — inventar uma frase de cliente para
       preencher a coluna seria pôr palavra na boca da HEINEKEN, e usar o
       placeholder que ela mesma desenhou é auto-evidente para quem revisar.
       Quando a frase real do Dolf chegar, é trocar as duas linhas abaixo. */
    testimonial: {
      quote: "A quote from Dolf to be confirmed.",
      attribution: "Name, Title — HEINEKEN",
    },
  },
  {
    slug: "culture-transformation",
    cardImage: "/services/cards/culture-transformation-client.jpg",
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
    .map((p) =>
      p
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        /* A ÊNFASE ENTRA DEPOIS DO ESCAPE, e a ordem não é gosto: invertida, o
           `<strong>` que acabamos de inserir seria escapado e sairia como texto
           na tela. O par `**…**` é a marcação da planilha dela — documentado no
           JSDoc de `outcome` e `howWeHelp`, em `Service` — e asterisco sem par
           fica visível de propósito, para aparecer na revisão em vez de sumir.

           NÃO SUPORTA ANINHAMENTO: "**a **b** c**" tem número par de `**` e
           ainda assim corrompe — o regex é não guloso e casa do primeiro par ao
           segundo, produzindo "<strong>a </strong>b<strong> c</strong>", sem
           deixar asterisco nenhum para trás. Por isso o teste "nenhum asterisco
           vaza para o HTML" NÃO pega este caso — ele testa ausência de `*`, e
           aninhamento não deixa nenhum.

           ⚠️ NENHUM TESTE AUTOMÁTICO PEGA ISTO, E NÃO É POR FALTA DE TENTAR:
           contar `<strong>` abertos contra pares de `**` na fonte (`abre ===
           marks / 2`) PARECE um guarda e não é — é uma invariante do algoritmo,
           não um sinal de problema. `**` funciona por alternância (liga/desliga),
           não por pilha, então QUALQUER quantidade par de `**` sempre abre
           exatamente `marks / 2` tags `<strong>`, aninhado ou não; confirmado
           por força bruta em seis padrões, incluindo dois spans legítimos e
           independentes ("**a** **b**") que têm a mesma conta que o exemplo
           aninhado acima. A contagem não sabe distinguir as duas coisas porque,
           na saída, elas SÃO a mesma coisa — a única diferença é a intenção de
           quem escreveu. A defesa hoje é a checagem manual contra a planilha
           (feita byte a byte na Task 2); o teste "ênfase aninhada corrompe em
           silêncio" documenta o comportamento da função, não guarda os dez
           serviços.

           `.` NÃO CASA `\n`: ênfase que atravesse uma quebra de linha simples
           sai com os `**` crus na tela — falha visível, não silenciosa, e por
           isso aceita. Relevante porque `serviceFromSolutionVM` converte
           `<br>` em `\n` antes de chegar aqui. */
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
