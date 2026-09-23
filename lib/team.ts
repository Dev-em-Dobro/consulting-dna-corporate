/**
 * A liderança e a faculty — copy do outline de Team (`CDNA_04_Team.docx`, 09-09).
 *
 * Mesmo raciocínio de `lib/services.ts`: o conteúdo veio por documento, com cada
 * campo marcado FINAL, EDIT ou HOLD, e mora no código. Aqui há um motivo a mais
 * — o CMS não tem campo de CITAÇÃO em `person`, e o bloco 2 do outline é
 * exatamente isso: uma frase de cada pessoa, em pull quote.
 *
 * ================================================================
 * TRÊS DIVERGÊNCIAS ENTRE O DOCUMENTO E O QUE ESTÁ NO AR
 * ================================================================
 *
 * 1. O OUTLINE LISTA SEIS PESSOAS. A página publicada tem SETE — as seis daqui
 *    mais **Phil Paul**, que não aparece no documento e ficou de fora desta
 *    grade. Não é decisão nossa sobre quem aparece no site: é o documento do
 *    cliente sendo seguido à risca. Precisa de uma confirmação explícita antes
 *    do lançamento, porque tirar alguém da página é visível.
 *
 * 2. FALTA O DR NIGEL GUENOLE. O outline de Approach o descreve como Head of
 *    Assessments da CDNA e criador do DNA 360 Profiler — ou seja, pertence a
 *    esta grade. Não está no documento de Team nem tem retrato.
 *
 * 3. ✅ OS SEIS RETRATOS ESTÃO COMPLETOS DESDE 15-09. Chegaram em 09-09 os de
 *    Rhea, JP, Mike e Gen; o do Nitin veio no pacote de 15-09 e era o último
 *    card que caía nas iniciais. O do Guilherme continua sendo o antigo do site
 *    (`/guilherme.jpg`), recortado — a foto oficial dele nunca chegou, e é a
 *    única pendência de retrato que resta.
 *
 *    ⚠️ O ARQUIVO DA RHEA NÃO MELHOROU. O pacote de 15-09 traz `Rhea Leckie
 *    .jpeg` de novo, e é o MESMO 1536x1024 paisagem de antes — 111KB, a
 *    exportação comprimida. O pedido pelo original vertical continua de pé, e
 *    até lá o card dela segue com a versão reenquadrada por IA que a caixa do
 *    `portrait` dela explica.
 */

export type Leader = {
  name: string;
  /** Cargo como o documento escreve, sem a região. */
  role: string;
  region: string;
  /**
   * A frase da pessoa, do bloco 2 do outline. Sai uma vez, no card.
   *
   * ⏸️ NÃO CONFUNDIR COM O BLOCO 3 (Perspectives). O documento repete a mesma
   * descrição de tipo nos dois blocos, o que faz parecer que esta frase serve
   * aos dois — mas o bloco 3 está marcado HOLD e pede texto NOVO: a resposta de
   * cada pessoa a "what do you believe about leadership that most people in
   * this industry get wrong?", em até 200 caracteres. Enquanto essas respostas
   * não chegarem e o bloco não for conversado com o cliente, o 3 não existe na
   * página.
   */
  quote: string;
  /** Ausente = card com as iniciais. */
  portrait?: string;
  /**
   * A entrada correspondente no CMS, pelo slug — é ela que abastece o pop-up de
   * perfil que o botão "+" do card abre.
   *
   * ⚠️ SLUG E NÃO NOME. Os nomes divergem entre as duas fontes: o CMS grava
   * "Jon-Paul (JP) Pritchard" contra o "Jon Paul Pritchard" deste arquivo, e
   * "Nitin Goil " com espaço no fim. Normalizar e casar por nome funcionaria
   * hoje e quebraria sem aviso na primeira edição feita pelo admin.
   *
   * AUSENTE = CARD SEM "+", e isso é o comportamento certo: um botão que abre
   * um pop-up vazio é pior que botão nenhum. Os seis têm entrada hoje.
   */
  cmsSlug?: string;
  /**
   * Classe Tailwind de `object-position`, quando o recorte centrado não serve.
   *
   * POR QUE ISTO É DADO E NÃO ESTILO: o quadro é 4:5 para todo mundo, mas cada
   * arquivo chegou numa proporção diferente (de 1,21:1 a 0,67:1), e o
   * `object-cover` corta o excedente pelo CENTRO. Quanto ele corta, e de onde,
   * é propriedade DA FOTO — não da grade. Um `if` no JSX esconderia isso num
   * componente que não sabe nada sobre os arquivos.
   *
   * Ausente = `object-center`, que é o que serve para quatro dos cinco.
   */
  portraitPosition?: string;
};

/**
 * OS SEIS RETRATOS DA LIDERANÇA, EM PRETO E BRANCO DESDE 17-09 — os arquivos
 * `-bw.jpg`. Isto fecha o *"deixar todas as fotos com greyscale"* da daily: a
 * faculty e as duas programme managers já estavam dessaturadas (ver a caixa da
 * `facultyMembers`), e a liderança era a única grade colorida da página.
 *
 * ⚠️ A CONVERSÃO É NO ARQUIVO, NÃO EM CSS `filter`, pelo mesmo motivo da
 * faculty: `filter: grayscale()` custa pintura a cada rolagem e ainda faz a rede
 * entregar o arquivo COLORIDO para pintá-lo de cinza no cliente. É luminância
 * simples, mesmas dimensões, sem recorte novo.
 *
 * ⚠️ NOME NOVO, E NÃO SOBRESCRITA: o `next/image` serve por URL e já entregou
 * versão velha neste projeto por causa disso. Os coloridos continuam em
 * `public/team/` — se ela pedir a cor de volta, é tirar o sufixo aqui.
 *
 * ⏳ TRÊS ERAM PNG DE ~2 MB (Mike, Genevieve, Jon-Paul) e viraram JPEG q90 na
 * mesma passada: 6,8 MB de retratos caíram para 1,1 MB. Nenhum tinha
 * transparência — conferido antes, e é o que torna a troca de formato segura.
 *
 * ⏳ ELES AINDA SÃO PROVISÓRIOS. A cliente ficou de REFAZER os retratos da
 * liderança (a Rhea reprovou os do Mike e da Jen), e a Maliha falou em testar
 * preto e branco "em todas, para consistência". Quando os novos chegarem, já
 * chegam assim e estes seis arquivos saem.
 *
 * ✅ DOIS CHEGARAM EM 18-09 — Mike e Gen, os dois que a Rhea tinha reprovado
 * (`2. Team/Mike Jackson.png` e `2. Team/Gen James.png` no pacote do Drive).
 * Pedido da daily: *"trocar as imagens da genevieve e do Mike Jackson"*. São os
 * arquivos `-2-bw.jpg`, e o que foi feito com eles:
 *
 *   • VIERAM QUADRADOS (1254×1254) e JÁ EM PRETO E BRANCO — os três canais são
 *     idênticos no arquivo. Por isso NÃO existe `mike-jackson-2.png` colorido
 *     ao lado: não há cor a guardar, e 1,7 MB de PNG cinza só pesaria o repo.
 *   • RECORTADOS EM 3:4 NO ARQUIVO (940×1254, centrados: 157px fora de cada
 *     lado), que é a proporção fixa do quadro desde 18-09 — mesma regra do
 *     Nitin e da Rhea, "normalizado para o quadro". Os dois rostos estão no
 *     centro do quadrado e sobra ~5% acima da cabeça; o que sai é ombro.
 *   • 1 canal, JPEG q90, mesma receita dos `-bw` de 17-09, via `sharp`
 *     (`toColourspace("b-w")` — o `grayscale()` sozinho devolvia 3 canais).
 *   • NOME NOVO com `-2`, pelo motivo da caixa acima: o `/_next/image` cacheia
 *     por URL. Os `mike-jackson-bw.jpg` e `genevieve-james-bw.jpg` antigos
 *     ficam no lugar, e voltar é trocar o caminho.
 */
export const leaders: Leader[] = [
  {
    name: "Rhea Leckie",
    cmsSlug: "rhea-leckie",
    role: "CEO, Founder, Author, Head of MENA",
    region: "UAE",
    quote:
      "With executive teams and top 100 leaders, there’s a certain science to creating magic in the room. It’s finding the optimal blend of ‘care and dare’, then bringing judgement, curiosity, maturity and trust together so people can go further than they thought they would.",
    /* ⚠️ VERSÃO GERADA, não é o arquivo da Maliha. O original
       (`/team/rhea-leckie.jpeg`, 1536×1024) é PAISAGEM, e num quadro 4:5 o
       recorte fechava no rosto — o card dela destoava dos outros cinco. Este
       é o mesmo retrato reenquadrado em 4:5 por IA (ChatGPT, 11-09), depois
       normalizado para 1024×1280.

       O QUE ISSO CUSTA, e está decidido: a ferramenta não estende a foto, ela
       REDESENHA a imagem inteira. Comparando lado a lado com o original, o
       maxilar afinou, a pele perdeu textura, os dentes e a sobrancelha mudaram.
       Está "quase igual", e o "quase" é o rosto da CEO. Decisão do Ricardo em
       11-09, ciente disso. O original fica no repositório ao lado para
       comparação e para voltar atrás em uma linha.

       PENDENTE: pedir à Maliha o arquivo ORIGINAL dela — o que recebemos tem
       114KB, é exportação comprimida e quase certamente recortada de algo
       maior. Com um arquivo vertical de verdade, isto aqui sai. */
    /* O NOME DO ARQUIVO MUDOU DE PROPÓSITO em 11-09. A versão anterior morava em
       `rhea-leckie-portrait.jpg`, e trocar o conteúdo mantendo o nome não
       adianta: o `/_next/image` responde com cache longo e a URL é a mesma, então
       navegador (e o cache do dev server) continuam servindo os bytes velhos.
       Nome novo = URL nova = fim do problema. Vale para a próxima troca de foto. */
    portrait: "/team/rhea-leckie-4x5-bw.jpg",
  },
  {
    name: "Guilherme Mendes",
    cmsSlug: "guilherme-mendes",
    role: "CEO Americas",
    // O documento escreve "America"; a região é "Americas" no resto do site
    // (a faixa de regiões da About, o bloco 5 aqui embaixo) e no próprio cargo.
    region: "Americas",
    quote:
      "You rarely shift resistance by pushing harder. I’ve found you earn the right to challenge by understanding what people are protecting first.",
    /* Recorte de `/guilherme.jpg` — o original tem o rosto à esquerda do centro,
       e num quadro 4:5 ele saía encostado na borda. O corte é 870×1088 a partir
       de x=0, que põe o rosto no meio. Continua sendo a foto ANTIGA: a oficial
       dele é uma das duas que a Maliha anunciou para 10-09 e ainda não chegaram. */
    portrait: "/team/guilherme-mendes-bw.jpg",
  },
  {
    name: "Mike Jackson",
    cmsSlug: "mike-jackson",
    role: "Head of UKEE",
    region: "UK",
    quote:
      "After years in senior rooms, I’ve learned to listen as closely to what isn’t being said as to what is. That’s often where the real work is.",
    /* TROCADO EM 18-09 pelo retrato novo da cliente — ver a caixa da `leaders`.
       O anterior (`/team/mike-jackson-bw.jpg`, 1377×1142 PAISAGEM) era o que a
       Rhea tinha reprovado, e num quadro 3:4 cedia metade da largura. */
    portrait: "/team/mike-jackson-2-bw.jpg",
  },
  {
    name: "Genevieve James",
    cmsSlug: "genevieve-james",
    role: "Head of Asia",
    // "Austrailia" no documento — erro de digitação, corrigido.
    region: "Australia",
    quote:
      "Some of the most important moments in my work have started with a room going quiet and tension rising. If you can hold that moment and give it language, rather than rescue it, something more honest usually emerges.",
    /* TROCADO EM 18-09 pelo retrato novo da cliente — ver a caixa da `leaders`.
       O anterior (`/team/genevieve-james-bw.jpg`, 1024×1536) era o que a Rhea
       tinha reprovado. */
    portrait: "/team/genevieve-james-2-bw.jpg",
    /* ⏸️ O `portraitPosition` SAIU EM 18-09 junto com a troca do arquivo — a
       própria nota abaixo avisava: "se o arquivo trocar, este número não vale
       mais". O novo já vem recortado em 3:4 no arquivo, então o `object-cover`
       não tem o que cortar e a posição é indiferente. A nota fica como
       histórico de por que o 25% existiu.

       DESCE 27px NO QUADRO, medido em 11-09 e não estimado. O arquivo dela é
       1024×1536 (2:3), o mais alto dos cinco, contra um quadro 4:5 — então o
       `object-cover` escala pela largura e sobram ~108px de altura para cortar.
       Centrado, o corte tira 54px de cima e a cabeça dela encostava a 8px da
       borda, enquanto a do JP, na mesma fileira, ficava a 49px. Lado a lado o
       card dela lia como enquadramento errado.

       25% em vez de 50% deixa 27px do corte em cima em vez de 54: a cabeça vai
       para ~35px da borda, que é o alvo pedido e fica entre os outros quatro.
       O que sai é ombro, embaixo, onde não faz falta.

       SE O ARQUIVO TROCAR, este número não vale mais — ele é do recorte deste
       JPEG, não da pessoa. (Era `portraitPosition: "object-[50%_25%]"`.) */
  },
  {
    name: "Jon Paul Pritchard",
    cmsSlug: "jon-paul-pritchard",
    role: "Head of Thought Leadership & Innovation",
    region: "Asia",
    quote:
      "When smart people keep repeating a pattern they say they want to change, I look for the commitment underneath it. Surface that, and resistance starts to make sense.",
    portrait: "/team/jon-paul-pritchard-bw.jpg",
  },
  {
    name: "Nitin Goil",
    cmsSlug: "nitin-goil",
    role: "Senior Principal",
    region: "Asia",
    quote:
      "I’ve seen brilliant strategies die in flat rooms. Part of the craft is knowing when to challenge, when to change the energy, and when to get out of the way.",
    /* CHEGOU EM 15-09, no pacote do Drive (`2. Team/Nitin Goil.png`), e fecha o
       último card que caía nas iniciais. O arquivo dela é 1106x1422 (0,78:1),
       praticamente o 4:5 do quadro — o `cover` corta 39px de altura, tirados de
       BAIXO (`position: top`) porque a margem acima da cabeça já é a certa e é
       o ombro que sobra. Normalizado para 1024x1280 como os outros. */
    portrait: "/team/nitin-goil-bw.jpg",
  },
];

/**
 * O retrato oficial de alguém, pelo nome — a mesma fonte para a /team e para
 * a home.
 *
 * POR QUE A HOME PRECISA DISTO. Ela lista as pessoas pelo CMS, e o CMS guarda os
 * retratos ANTIGOS: o da Rhea é outra foto (tons quentes, mão no queixo), o do
 * Guilherme está gravado como `whatsapp-image-2026-07-25`. Os que a Maliha
 * mandou em 09-09 nunca subiram lá — e não dá para subir daqui, o admin de
 * produção não é alcançável desta máquina. Então a home deixa de exibir o que
 * vem do CMS e passa por aqui.
 *
 * QUEM NÃO TEM, FICA SEM: sem retrato oficial o card cai nas iniciais, em vez de
 * publicar a foto velha. Vale hoje para Nitin Goil e para quem estiver publicado
 * no CMS fora da lista do outline.
 *
 * O casamento é por nome normalizado porque as grafias divergem entre o CMS e o
 * documento — "Jon-Paul Pritchard" contra "Jon Paul Pritchard".
 */
const portraitByName = new Map(
  leaders
    .filter((l) => l.portrait)
    .map((l) => [l.name.toLowerCase().replace(/[^a-z]/g, ""), l.portrait!]),
);

export function officialPortrait(name: string): string | undefined {
  return portraitByName.get(name.toLowerCase().replace(/[^a-z]/g, ""));
}

/**
 * Bloco 5 — a faculty global. As cinco regiões são as mesmas da About, por
 * instrução do documento ("five tiles matching the About page regions").
 *
 * ⏳ O mosaico de imagens por região é HOLD (slot 06 do documento): não veio
 * imagem nenhuma. A faixa sai em texto até chegarem — cinco quadros cinza
 * seriam pior que cinco nomes bem compostos.
 *
 * ⏸️ A SEÇÃO FOI REDESENHADA EM CINCO VERSÕES EM 11-09 E A ESCOLHA FICOU
 * PARADA. Estão em `/app/team-tests`, fora do menu e do sitemap. O motivo da
 * pausa está lá em cima do arquivo, e é curto: três das cinco tratam a seção
 * como UMA foto de fundo, e deixam de fazer sentido no dia em que houver uma
 * imagem por região. A cobrança das imagens saiu em
 * `docs/mensagem-grupo-team-imagens-11-09.ENVIAR.txt`.
 */
export type FacultyRegion = {
  name: string;
  /**
   * A imagem do slot 06, quando chegar. Ausente = o quadro sai só com o nome.
   *
   * ⏳ NENHUMA DAS CINCO EXISTE HOJE. O documento de Team as promete em letra,
   * como HOLD — que na convenção dele (aberta na primeira página) significa
   * "content still needed":
   *
   *   Block 5 · Global faculty
   *   Type: regional mosaic beneath, five tiles matching the About page
   *   regions: Americas, UK & Europe, GCC & Middle East, Asia, India.
   *   Not 75 individual profiles.
   *   HOLD  A representative selection or mosaic image per region. Slot 06.
   *
   * ⚠️ O DOCUMENTO DE SERVICES NÃO FALA DISTO, conferido em 11-09 no arquivo
   * original: a palavra "image" aparece uma vez lá, e é a foto de herói das
   * páginas de serviço. Quem pede o mosaico é este documento, não aquele.
   */
  image?: string;
  /**
   * A cor do degradê por cima da foto, no pé do cartão.
   *
   * DE ONDE VEIO: a referência de 11-09 (cartões de destino) põe uma cor
   * diferente em cada cartão, tirada da própria foto — verde no templo, roxo no
   * entardecer de Dubai. É o que faz a grade dela parecer desenhada em vez de
   * um filtro repetido.
   *
   * ⚠️ O DEGRADÊ COLORIDO NÃO SUBSTITUI O ESCURECIMENTO NEUTRO, ele vem POR
   * CIMA dele. A legibilidade do nome continua sendo trabalho do preto, que é
   * medido; a cor entra depois, em alfa baixo, só como tom. Invertendo a ordem
   * — cor forte fazendo o contraste — o nome passaria a depender de quanto
   * vermelho tem ali, e cada troca de foto viraria uma nova medição.
   *
   * Ausente = só o neutro, como nas outras seções escuras do site.
   */
  tint?: string;
};

/**
 * ⚠️ SÃO QUATRO DESDE 16-09, E ERAM CINCO. A Índia saiu a pedido dela na daily:
 * *"can we get rid of India here? India will be covered under Asia, and she's
 * just happy to have the four regions, Americas, Europe, GCC, Asia."*
 *
 * ✅ A ABOUT PERDEU A ÍNDIA NO MESMO DIA, minutos depois e por confirmação
 * expressa — a dúvida existiu porque ela tinha APROVADO a About na mesma call,
 * e página aprovada não se altera por dedução. As duas listas seguem batendo, e
 * é instrução do documento de Team que batam ("five tiles matching the About
 * page regions", hoje quatro). Se mudarem de um lado, mudam dos dois:
 * `REGIONS` em `app/about/page.tsx`. A grade de lá foi de cinco para quatro
 * colunas junto, senão sobrava uma coluna vazia.
 *
 * ⚠️ OS RÓTULOS CONTINUAM OS DO DOCUMENTO DELA ("UK & Europe", "GCC & Middle
 * East") e não os da fala ("Europe", "GCC"). O pedido dito em voz era sobre
 * QUANTAS regiões, não sobre como se chamam, e os nomes longos são os que o
 * documento de Team escreve em letra.
 */
export const facultyRegions: FacultyRegion[] = [
  /* ⚠️⚠️ AS CINCO IMAGENS ABAIXO SÃO PROVISÓRIAS E ESTÃO NO AR. ⚠️⚠️
     Decisão do Ricardo em 12-09, ciente do que custa.

     O QUE ELAS SÃO: pontos turísticos do Wikimedia Commons — Vizcaya (Miami),
     Tower Bridge, Burj Khalifa, Marina Bay Sands e Hawa Mahal. Licença livre,
     recortadas em 4:5. Quatro das cinco são cidades onde a CDNA tem escritório,
     o que não é acaso, mas TAMBÉM NÃO É O QUE O SLOT 06 PEDE: o documento pede
     "a representative selection or mosaic image per region", ou seja, a faculty
     ou o trabalho acontecendo. Um cartão-postal de Jaipur não mostra ninguém.

     O QUE ISSO CUSTA, e é por isso que está escrito aqui e não escondido: quem
     revisa esta página é o cliente. Ele vai abrir e ver Tower Bridge rotulado
     "UK & Europe" — e pode entender que escolhemos ilustrar a faculty dele com
     foto de banco. Se a conversa vier, a resposta honesta é que são marcadores
     de lugar enquanto as dele não chegam, e que saem no dia em que chegarem.

     PARA TROCAR: substituir o caminho de cada uma. Para voltar ao slot vazio:
     apagar as cinco linhas `image` e a pasta `public/team/mock/`. A seção já
     sabe fazer os dois — sem `image` ela mostra o slot tracejado e o nome em
     escuro, com `image` mostra a foto com o nome em branco. */
  { name: "Americas", image: "/team/mock/miami.jpg" },
  { name: "UK & Europe", image: "/team/mock/london.jpg" },
  { name: "GCC & Middle East", image: "/team/mock/dubai.jpg" },
  { name: "Asia", image: "/team/mock/singapore.jpg" },
];

/**
 * Bloco 6 — "The DNA experience".
 *
 * ⚠️ O DOCUMENTO DIZ "MOVED HERE FROM THE HOMEPAGE", e a home ainda os tem. Não
 * tirei de lá: a home entrou em revisão com o cliente em 10-09 e remover uma
 * seção no meio da revisão é trocar o objeto que estão olhando. Fica para depois
 * do retorno deles — é uma linha a apagar em `app/page.tsx`.
 *
 * A copy é a que já está publicada, sem uma palavra nova.
 *
 * ⚠️ E A ESTRUTURA TAMBÉM É A DA HOME — corrigido em 11-09, depois de eu ter
 * mudado sem precisar. O outline chama os itens de "four strands" e lista
 * "One DNA TEAM" entre eles, então a primeira versão daqui fez os quatro como
 * blocos iguais, cada um com título e corpo. Na home não é assim: o One DNA
 * TEAM é a LINHA DE ABERTURA da seção, e só os outros três têm título.
 *
 * A diferença não é de gosto. Como bloco titulado, o texto vira "One DNA TEAM"
 * seguido de "With our 'One DNA TEAM' principle…" — o termo repetido em duas
 * linhas coladas, redundância que a home não tem porque lá a frase é a abertura.
 * "Moved from the homepage" com a copy marcada FINAL não pede redesenho; o que
 * sai daqui é o que já estava publicado.
 */
export const dnaLead =
  "With our “One DNA TEAM” principle, we execute as one collaborative team.";

/**
 * Bloco 6 do outline — as QUATRO vertentes da DNA experience.
 *
 * ⚠️ ERAM TRÊS ATÉ 15-09, E ISSO ERA UM FURO CONTRA O DOCUMENTO. O
 * `CDNA_04_Team.docx` escreve, em letra: *"Type: four strands, moved here from
 * the homepage: One DNA TEAM, The DNA Experience, Trusted Relationships,
 * Inclusion & Diversity."* A primeira faltava — ela estava sendo consumida como
 * a FRASE DE ABERTURA da seção (o `dnaLead` logo acima), que é o que a home faz,
 * e na migração para cá ninguém notou que aqui ela também tem de ser cartão.
 * O mockup de 14-09 confirma: quatro colunas, e a primeira é "One DNA TEAM".
 *
 * O `dnaLead` FICA COMO TÍTULO DA SEÇÃO. Ele não vira redundância: a frase
 * apresenta o princípio ("With our One DNA TEAM principle, we execute as one
 * collaborative team") e o cartão diz o que ele é. É a mesma relação que o
 * título tem com os outros três.
 *
 * ⚠️ O CORPO DA PRIMEIRA É CURTO E O DAS OUTRAS TRÊS É LONGO, e isso é conhecido
 * e não tem conserto hoje. As três longas são a copy da home, que o outline
 * manda trazer para cá. Para a primeira não existe versão longa em lugar nenhum:
 * a linha abaixo é a do MOCKUP dela, que é a única fonte que a descreve.
 *
 * O documento aponta para uma saída, e nós não temos o arquivo: *"FINAL Copy
 * exists. See the About outline, Home block 8, for the condensed version."* O
 * `CDNA_About_Page_Dev_Outline.docx` que veio no pacote de 15-09 cobre a
 * navegação e a About, e NÃO tem esse bloco 8 — foi procurado. Quando a versão
 * condensada chegar, as quatro ficam do mesmo tamanho e os cartões equilibram;
 * é trocar três `body`.
 */
export const dnaStrands = [
  {
    title: "One DNA TEAM",
    /* DO MOCKUP (`docs/mockup-team-maliha-14-09-2026.png`), não do Word — mesma
       procedência da frase "Different perspectives. A shared purpose." do bloco
       4. Fica anotado porque, se o cliente revisar o texto da página contra o
       documento, esta linha não vai estar lá. */
    body: "A community of curious, courageous and caring people.",
  },
  {
    title: "The DNA Experience",
    body: "We blend our individual talents with the collective expertise of our global pool of 75 members across 36 countries, and deliver the power of the “DNA experience” to every client. Each time, every time.",
  },
  {
    title: "Trusted Relationships",
    body: "Relationships are at the core of who we are. We build long-term, deep relationships with our people and become part of each other’s stories. We are part of a family who care about each other, stay close and grow, laugh and unmask together.",
  },
  {
    title: "Inclusion & Diversity",
    body: "Our best-in-class people are full of great character and personality, representing a range of backgrounds in the behavioural sciences and business; coming from different markets around the world, and representing a wide range of social identities.",
  },
];

/* ============================================================================
 * BLOCO NOVO · 17-09 — as pessoas que faltavam na página
 * ============================================================================
 *
 * Dois pedidos da daily, e os dois são a MESMA forma: uma grade de retrato +
 * nome. Vivem juntos aqui porque o componente que os desenha é um só
 * (`components/team/PeopleRoster.tsx`) e porque as duas listas vieram no mesmo
 * pacote da cliente.
 *
 *   1. *"embaixo da seção 'Leadership' criar uma nova parte que vai ser
 *      'supported by our senior programme managers' e vai ter uma lista de
 *      pessoas com fotos e nomes"* — duas pessoas, retratos entregues soltos.
 *   2. *"na seção 'Global faculty' remove the countries cards and change for
 *      the people list"* — 23 pessoas, vindas de uma TABELA dentro do
 *      `2. Team/Facilitators for website.docx`.
 *
 * ⚠️ OS RETRATOS FORAM EXTRAÍDOS DO .DOCX, um por linha da tabela, e passaram
 * por três tratamentos antes de virar arquivo em `public/team/faculty/`:
 *
 *   • DESSATURADOS. Vinte dos 23 já chegaram em preto e branco; três não
 *     (Michele Perry, Amy Scialdone, Lisa Kaplin). Numa grade de 23 rostos, três
 *     coloridos no meio não leem como variedade, leem como erro. A conversão é
 *     no ARQUIVO e não em CSS `filter`: filtro custa pintura a cada scroll e
 *     ainda entrega o arquivo colorido pela rede. Isto adiantou metade do
 *     *"deixar todas as fotos com greyscale"* da mesma daily; a outra metade —
 *     os seis retratos da liderança — foi feita em 17-09, pelo mesmo caminho.
 *     Ver a caixa da `leaders`.
 *   • RECORTADOS EM 3:4 pelo detector de saliência do `sharp`, que mira
 *     contraste. ⚠️ DUAS ELE ERROU, e erra pelo mesmo motivo nas duas: o
 *     contraste da foto está no CARTAZ atrás da pessoa. Sunanda Banerjee posa
 *     diante de um banner de evento e Wouter van den Berg fala num palco com o
 *     letreiro da Harvard Business Review atrás — as duas levaram recorte à mão,
 *     anotado no script. Se os arquivos forem reprocessados, são essas duas a
 *     conferir primeiro.
 *   • TOM CROSS VEIO DEITADO 90° no documento, com a cabeça apontando para a
 *     margem esquerda. Rodado em sentido horário.
 *
 * ⏳ TRÊS RETRATOS SÃO PEQUENOS DEMAIS e não há o que fazer daqui: Sandro da
 * Silva (190x190 no original), Amy Scialdone (239x201) e Lisa Kaplin (199x196).
 * Saem em ~150px de largura, contra os 520 dos bons, e num monitor retina eles
 * amaciam. Não foram ampliados de propósito — ampliar assa o borrão no arquivo.
 * É pedido de original para a cliente, e é barato.
 */

export type RosterPerson = {
  name: string;
  /** A linha de baixo: cargo nos programme managers, região na faculty. */
  meta?: string;
  portrait: string;
};

/**
 * ⚠️ O CARGO NÃO VEIO ESCRITO. A cliente mandou os dois retratos e a frase da
 * seção, e nada mais — não há documento dizendo o título de cada uma. O `meta`
 * fica vazio de propósito: inventar "Senior Programme Manager" para as duas
 * seria escrever cargo de pessoa real por dedução, e a frase da seção já diz o
 * que elas são. Quando o cargo chegar, é uma linha por pessoa.
 *
 * ✅ NICOLE PHOON ENTROU EM 18-09 — pedido da daily: *"na seção 'Supported by
 * a team of senior program managers.' inserir a imagem da Nicole Phoon.jpeg
 * que faltou"*. O arquivo (`2. Team/Nicole Phoon.jpeg`) estava no pacote de
 * 17-09 desde o início e ficou de fora do bloco; a entrada inteira faltava,
 * não só a foto. Ela é a mesma Nicole que administra o Google Analytics e o
 * Search Console pela CDNA (ver `docs/emails-cdna-thread.md`).
 *
 * MESMO TRATAMENTO DAS OUTRAS DUAS, replicado do que os arquivos revelam (não
 * há script no repo): `cover` para 600×800 (3:4 — a Carol veio 1024×1536 e a
 * Maliha 1145×1374, e as duas saíram 600×800), cinza em sRGB de 3 canais, JPEG
 * q90. O original dela já era 955×1280 (3:4 exato) e já em P&B, então o
 * `cover` tira 4px e nada mais. Entra por último, na ordem de chegada.
 *
 * ⚠️ SEM CARGO, como as outras: não está no `CDNA_04_Team.docx` nem no
 * `Facilitators for website.docx`. Vale a mesma regra da caixa acima.
 *
 * ================================================================
 * ✅ A REGIÃO CHEGOU EM 21-09 — O CARGO, NÃO
 * ================================================================
 * O email dela, na lista da Team: *"Maliha - MENA, Carol is UKEE, Nic is
 * Asia"*. São EXATAMENTE estas três pessoas — conferido nome por nome contra a
 * `leaders` e a `facultyMembers`, onde não há nenhuma outra Maliha, Carol ou
 * Nic (o "Nitin" da liderança não vira "Nic"). Então o `meta`, que estava vazio
 * desde 17-09 à espera do cargo, passa a ser a REGIÃO — que é o mesmo que ele
 * significa na faculty, logo abaixo.
 *
 * ⚠️ NÃO VIROU "HEAD OF MENA". Ela atribuiu uma região a cada uma, não um
 * título; e três pessoas da LIDERANÇA já são "Head of MENA", "Head of UKEE" e
 * "Head of Asia" (Rhea, Mike e Genevieve). Repetir esses títulos aqui criaria
 * uma segunda chefia para as mesmas três regiões, que não é o que a frase diz.
 *
 * ⏳ OS CÓDIGOS SAEM COMO ELA OS ESCREVEU — "MENA", "UKEE", "Asia" —, e isso
 * contraria de propósito a regra que a `facultyMembers` segue (lá AMS/EUR/APAC
 * viraram Americas/Europe/Asia Pacific). Dois motivos: a página JÁ IMPRIME os
 * dois acrônimos, em letra, nos cargos da liderança duas seções acima, então
 * não é vocabulário novo; e "MENA" não tem tradução pronta no site — o mais
 * próximo é "Middle East", que deixaria fora o Norte da África, que é
 * justamente onde a faculty tem um grupo "Africa" separado. Traduzir os três
 * para rótulo de público é uma linha cada, e é pergunta para a próxima daily.
 */
export const programmeManagers: RosterPerson[] = [
  { name: "Maliha Bathool", meta: "MENA", portrait: "/team/programme-managers/maliha-bathool.jpg" },
  { name: "Carol Medcalf", meta: "UKEE", portrait: "/team/programme-managers/carol-medcalf.jpg" },
  { name: "Nicole Phoon", meta: "Asia", portrait: "/team/programme-managers/nicole-phoon.jpg" },
];

/**
 * Os 23 da tabela do `Facilitators for website.docx`, na ordem em que ela os
 * escreveu — não alfabética, não por região. Ordem de documento é a única que
 * não exige uma decisão nossa sobre quem vem primeiro.
 *
 * ⚠️ AS REGIÕES FORAM TRADUZIDAS DOS CÓDIGOS INTERNOS dela: AMS → Americas,
 * EUR → Europe, UKEE → UK & Europe, ME → Middle East, APAC → Asia Pacific,
 * "APAC - Aust" → Australia, AFRICA → Africa. O site não fala em sigla de
 * organograma, e "AMS" numa página pública não diz nada a ninguém de fora.
 *
 * ⏳ TRÊS COISAS DA TABELA PRECISAM DELA, e nenhuma é impeditiva para publicar:
 *
 *   1. "TONY" NÃO TEM SOBRENOME. A célula diz só "Tony" e o link de bio é
 *      `CDNA Profile - Australia_Tony.pptx`. Sai como está porque inventar
 *      sobrenome é pior — mas um nome solto no meio de 22 nomes completos lê
 *      como campo que ficou por preencher.
 *   2. A CÉLULA DO TOM CROSS TEM UM COMENTÁRIO DENTRO, não uma região:
 *      "UKEE is there a reason we are not using EUR for Europe? UKEE is not
 *      commonly used here?" É alguém do lado dela questionando a nomenclatura.
 *      Lido como UKEE, que é o código que a própria CDNA usa (o Mike Jackson é
 *      "Head of UKEE"), e portanto UK & Europe.
 *   3. O BRET FREEMAN ESTÁ EM DÚVIDA NA PRÓPRIA TABELA: "UK (though was listed
 *      as ME?)". Fica UK & Europe, que é a afirmação; o "?" é a pergunta dela.
 *
 * ⚠️ UKEE E EUR CONVIVEM AQUI, e é o documento que os separa — dezesseis pessoas
 * estão em "EUR" e duas em "UKEE"/"UK". Traduzidos, viram "Europe" e "UK &
 * Europe" lado a lado na mesma grade, que é exatamente a inconsistência que o
 * comentário da célula do Tom Cross levanta. Unificar os dois é decisão DELA.
 */
export const facultyMembers: RosterPerson[] = [
  { name: "Tom Cross", meta: "UK & Europe", portrait: "/team/faculty/tom-cross.jpg" },
  { name: "Justin Bridge", meta: "Europe", portrait: "/team/faculty/justin-bridge.jpg" },
  { name: "Daniela Rusu", meta: "Europe", portrait: "/team/faculty/daniela-rusu.jpg" },
  { name: "Jojo O’Driscoll-Kearney", meta: "Middle East", portrait: "/team/faculty/jojo-odriscoll-kearney.jpg" },
  { name: "Rachel Monteverdi", meta: "Americas", portrait: "/team/faculty/rachel-monteverdi.jpg" },
  { name: "Michele Perry", meta: "Americas", portrait: "/team/faculty/michele-perry.jpg" },
  { name: "Seow Swang Chua", meta: "Asia Pacific", portrait: "/team/faculty/seow-swang-chua.jpg" },
  { name: "Marisa Chuawiwat", meta: "Asia Pacific", portrait: "/team/faculty/marisa-chuawiwat.jpg" },
  { name: "Akua Nyame-Mensah", meta: "Africa", portrait: "/team/faculty/akua-nyame-mensah.jpg" },
  { name: "Angela Gachui", meta: "Africa", portrait: "/team/faculty/angela-gachui.jpg" },
  { name: "Sharon Lim", meta: "Asia Pacific", portrait: "/team/faculty/sharon-lim.jpg" },
  { name: "Sunanda Banerjee", meta: "Asia Pacific", portrait: "/team/faculty/sunanda-banerjee.jpg" },
  { name: "Tony", meta: "Australia", portrait: "/team/faculty/tony.jpg" },
  { name: "Sandro da Silva", meta: "Europe", portrait: "/team/faculty/sandro-da-silva.jpg" },
  { name: "Wouter van den Berg", meta: "Europe", portrait: "/team/faculty/wouter-van-den-berg.jpg" },
  { name: "Manuela Damant", meta: "Europe", portrait: "/team/faculty/manuela-damant.jpg" },
  { name: "Rob Grundel", meta: "Australia", portrait: "/team/faculty/rob-grundel.jpg" },
  { name: "Amy Scialdone", meta: "Americas", portrait: "/team/faculty/amy-scialdone.jpg" },
  { name: "Lisa Kaplin", meta: "Americas", portrait: "/team/faculty/lisa-kaplin.jpg" },
  { name: "Gemma McFall", meta: "Middle East", portrait: "/team/faculty/gemma-mcfall.jpg" },
  { name: "Bret Freeman", meta: "UK & Europe", portrait: "/team/faculty/bret-freeman.jpg" },
  { name: "Jan Peters", meta: "Europe", portrait: "/team/faculty/jan-peters.jpg" },
  { name: "Nicola Shearer", meta: "Europe", portrait: "/team/faculty/nicola-shearer.jpg" },
];

/**
 * A MESMA FACULTY, AGRUPADA EM QUATRO REGIÕES — 22-09.
 *
 * A Maliha pediu esta ordem, e só estas quatro: Americas, UK & Europe,
 * Middle East & North Africa, Asia Pacific. A Austrália entra em Asia Pacific.
 *
 * O rótulo da tabela dela não muda no dado (`facultyMembers.meta`). O que muda
 * é o balde em que a pessoa cai:
 *   • "Europe" e "UK & Europe" → UK & Europe
 *   • "Middle East" e "Africa" → Middle East & North Africa
 *   • "Australia" e "Asia Pacific" → Asia Pacific
 *   • "Americas" → Americas
 *
 * Africa não foi nomeada na daily. Das quatro regiões, Middle East & North
 * Africa é a única que a cobre. Dentro de cada grupo a ordem continua a da
 * tabela.
 *
 * Quem chegar sem região, ou com um rótulo que esta tabela não conhece, cai
 * no balde sem título, no fim — some da página seria pior do que aparecer
 * sem cabeçalho.
 */
export type FacultyRegionGroup = { region: string; people: RosterPerson[] };

const FACULTY_REGION_ORDER = [
  "Americas",
  "UK & Europe",
  "Middle East & North Africa",
  "Asia Pacific",
] as const;

const FACULTY_REGION_OF: Record<string, (typeof FACULTY_REGION_ORDER)[number]> = {
  Americas: "Americas",
  "UK & Europe": "UK & Europe",
  Europe: "UK & Europe",
  "Middle East": "Middle East & North Africa",
  Africa: "Middle East & North Africa",
  "Asia Pacific": "Asia Pacific",
  Australia: "Asia Pacific",
};

export const facultyByRegion: FacultyRegionGroup[] = (() => {
  const groups: FacultyRegionGroup[] = FACULTY_REGION_ORDER.map((region) => ({
    region,
    people: [],
  }));
  const unlabeled: FacultyRegionGroup = { region: "", people: [] };

  for (const person of facultyMembers) {
    const bucket = FACULTY_REGION_OF[person.meta ?? ""];
    const group = bucket
      ? groups.find((g) => g.region === bucket)
      : unlabeled;
    group?.people.push({ name: person.name, portrait: person.portrait });
  }

  const filled = groups.filter((g) => g.people.length > 0);
  return unlabeled.people.length ? [...filled, unlabeled] : filled;
})();
