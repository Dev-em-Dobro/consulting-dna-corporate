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

export const leaders: Leader[] = [
  {
    name: "Rhea Leckie",
    role: "CEO, Founder, Author, Head of MENA",
    region: "UAE",
    quote:
      "With executive teams and top 100 leaders, there’s a certain science to creating magic in the room. It’s finding the optimal blend of ‘care and dare’ — then bringing judgement, curiosity, maturity and trust together so people can go further than they thought they would.",
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
    portrait: "/team/rhea-leckie-4x5.jpg",
  },
  {
    name: "Guilherme Mendes",
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
    portrait: "/team/guilherme-mendes.jpg",
  },
  {
    name: "Mike Jackson",
    role: "Head of UKEE",
    region: "UK",
    quote:
      "After years in senior rooms, I’ve learned to listen as closely to what isn’t being said as to what is. That’s often where the real work is.",
    portrait: "/team/mike-jackson.png",
  },
  {
    name: "Genevieve James",
    role: "Head of Asia",
    // "Austrailia" no documento — erro de digitação, corrigido.
    region: "Australia",
    quote:
      "Some of the most important moments in my work have started with a room going quiet and tension rising. If you can hold that moment and give it language, rather than rescue it, something more honest usually emerges.",
    portrait: "/team/genevieve-james.png",
    /* DESCE 27px NO QUADRO, medido em 11-09 e não estimado. O arquivo dela é
       1024×1536 (2:3), o mais alto dos cinco, contra um quadro 4:5 — então o
       `object-cover` escala pela largura e sobram ~108px de altura para cortar.
       Centrado, o corte tira 54px de cima e a cabeça dela encostava a 8px da
       borda, enquanto a do JP, na mesma fileira, ficava a 49px. Lado a lado o
       card dela lia como enquadramento errado.

       25% em vez de 50% deixa 27px do corte em cima em vez de 54: a cabeça vai
       para ~35px da borda, que é o alvo pedido e fica entre os outros quatro.
       O que sai é ombro, embaixo, onde não faz falta.

       SE O ARQUIVO TROCAR, este número não vale mais — ele é do recorte deste
       JPEG, não da pessoa. */
    portraitPosition: "object-[50%_25%]",
  },
  {
    name: "Jon Paul Pritchard",
    role: "Head of Thought Leadership & Innovation",
    region: "Asia",
    quote:
      "When smart people keep repeating a pattern they say they want to change, I look for the commitment underneath it. Surface that, and resistance starts to make sense.",
    portrait: "/team/jon-paul-pritchard.png",
  },
  {
    name: "Nitin Goil",
    role: "Senior Principal",
    region: "Asia",
    quote:
      "I’ve seen brilliant strategies die in flat rooms. Part of the craft is knowing when to challenge, when to change the energy, and when to get out of the way.",
    /* CHEGOU EM 15-09, no pacote do Drive (`2. Team/Nitin Goil.png`), e fecha o
       último card que caía nas iniciais. O arquivo dela é 1106x1422 (0,78:1),
       praticamente o 4:5 do quadro — o `cover` corta 39px de altura, tirados de
       BAIXO (`position: top`) porque a margem acima da cabeça já é a certa e é
       o ombro que sobra. Normalizado para 1024x1280 como os outros. */
    portrait: "/team/nitin-goil.jpg",
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
 * ✅ OS CINCO NOMES SÃO OS DA ABOUT, à letra, como o documento manda ("five
 * tiles matching the About page regions"). Conferido contra o `REGIONS` de
 * `app/about/page.tsx` em 11-09 — os cinco batem, na mesma ordem. Se um dia
 * mudarem de um lado, mudam dos dois: é instrução do cliente, não coincidência.
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
  { name: "India", image: "/team/mock/jaipur.jpg" },
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

export const dnaStrands = [
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
