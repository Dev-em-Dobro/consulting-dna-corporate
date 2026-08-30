# Transcrição — call com o Guli, 29/08/2026

**Fonte:** `Impromptu Google Meet Meeting - Aug 29 2026.mp4` (24m49s).
**Método:** faster-whisper `large-v3`, pt-BR, VAD, sem condicionamento no texto anterior
(o transcript anterior, `-raw.txt`, alucinava e foi descartado — o trecho final era de
outra reunião).
**Participantes:** Guli (design) e Ricardo. Beto ausente (viajando).

> ⚠️ **A gravação começa com a call já em andamento.** Aos 06:39 o Guli diz:
> *"aqui, só pra gente recuperar, porque ainda não tava gravando, a solução para puxar
> um pouco dos black boxes"* — ou seja, **a explicação original das Solutions em black
> boxes ficou fora da gravação**. Só o resumo está registrado.

---

[00:00 -> 00:01] Pode seguir.
[00:34 -> 00:34] Beleza.
[00:35 -> 00:38] O desafio do... Olá, Iai! Olá a todos!
[00:40 -> 00:44] O desafio do nosso cliente foi mostrar o sistema 5H todo integrado.
[00:45 -> 00:46] O sistema agora está dividido em partes,
[00:46 -> 00:49] e isso parece dar a entender que ele não é tão integrado,
[00:49 -> 00:52] os conceitos não são tão únicos quando eles realmente são.
[00:53 -> 00:56] Então, eu parti do princípio de criar uma sessão inteira para ele,
[00:56 -> 01:00] blocada, onde a gente consiga ter todas as informações necessárias
[01:00 -> 01:02] para o usuário entender que esse é um sistema único
[01:02 -> 01:05] e que funciona em etapas.
[01:06 -> 01:11] Então, a primeira parte é colocar todas as informações que são relevantes
[01:11 -> 01:15] e mais detalhadas em relação a esse processo, a essa metodologia, aqui em cima.
[01:16 -> 01:18] Assim o usuário consegue controlar com os botões de baixo
[01:18 -> 01:20] e ver o que está acontecendo em cima.
[01:20 -> 01:24] Antes, com os botões de cima, o usuário podia clicar nos botões
[01:24 -> 01:25] e não ver o que estava acontecendo embaixo.
[01:25 -> 01:29] Então, isso eu acho que pode resolver e mitigar um problema de visualização mesmo.
[01:30 -> 01:31] Aqui a gente tem alguns pontos.
[01:32 -> 01:35] Aqui em cima nós temos o ícone, que vocês já definiram e já está aprovado.
[01:36 -> 01:38] A gente tem o título, a gente tem um indicativo,
[01:38 -> 01:40] que é Inner Game ou Outer Game, que é bem importante.
[01:41 -> 01:43] E embaixo a gente tem a palavra-chave, por exemplo,
[01:43 -> 01:45] Head Thinking, Heart Relating, etc.
[01:46 -> 01:49] Aqui a gente tem uma frase que é variável em tamanho.
[01:49 -> 01:51] Então seria muito legal se esse bloco fosse inteiro blocado
[01:51 -> 01:56] para que as coisas não começassem a dançar conforme o usuário clica nos botões.
[01:56 -> 01:57] Porque considerando que o botão está embaixo,
[01:58 -> 02:01] se esse container de cima começa a balançar, o botão se perde.
[02:01 -> 02:03] Então, a gente tem que deixar isso bem blocadão.
[02:04 -> 02:08] E aqui embaixo é um texto relativo a cada um dos cinco subtextos,
[02:09 -> 02:12] subtópicos que tem dentro de cada um desses tópicos.
[02:12 -> 02:15] Então, aqui, por exemplo, Growth, Mindset e Learning Agility
[02:15 -> 02:18] é o maior de todos que eu peguei, se não me engano, é de...
[02:18 -> 02:20] Não lembro se é de Red mesmo.
[02:20 -> 02:22] Mas cada um deles tem cinco pontos,
[02:23 -> 02:27] e esses cinco pontos têm que ficar aparecendo aqui de forma animada.
[02:27 -> 02:28] Por que isso?
[02:29 -> 02:30] Porque a gente não precisa entrar em detalhes,
[02:30 -> 02:32] a gente só tem que mostrar que é vivo
[02:32 -> 02:34] e isso vai dar um caráter muito mais
[02:34 -> 02:36] legal, exploratório para quem está vendo
[02:36 -> 02:38] porque a pessoa não ter como diretamente
[02:38 -> 02:40] selecionar isso e entender muito a fundo
[02:40 -> 02:42] ela pode, claro, se ela for ler o texto inteiro
[02:42 -> 02:44] mas isso daqui é para ser meio que como
[02:44 -> 02:46] um guia básico para a metodologia
[02:46 -> 02:48] então a gente tem divisões aqui
[02:48 -> 02:50] do lado esquerdo de
[02:50 -> 02:52] inner game e outer game, esse texto
[02:52 -> 02:53] em vertical
[02:53 -> 02:56] inner game e outer game e cada um deles
[02:56 -> 02:58] acompanha uma linha, três desses tópicos
[02:58 -> 03:00] fazem parte do inner game
[03:00 -> 03:06] eles têm uma linha sólida, e dois, que é o Hands e o Habits, têm uma linha pontilhada.
[03:06 -> 03:10] Só que isso troca quando o usuário, por exemplo, selecionar Hands.
[03:10 -> 03:14] Quando ele selecionar Hands, a gente vai fazer um tratamento mais ou menos assim.
[03:14 -> 03:18] Isso fica iluminado, essas palavras continuam em branco,
[03:18 -> 03:22] aqui troca por uma linha sólida e aqui troca por uma linha pontilhada,
[03:22 -> 03:26] só para o usuário entender que existem essas divisões que está meio difícil de entender mesmo.
[03:27 -> 03:29] Uh, aqui beleza foi.
[03:29 -> 03:35] Isso daqui deve ser animado para que o usuário entenda que isso é clicável
[03:35 -> 03:37] e consiga ver as informações mesmo se ele não quiser clicar.
[03:38 -> 03:43] É para atiçar a curiosidade através desses cards que se movem.
[03:43 -> 03:47] Eu fui melhorando o layout do ponto de vista exclusivo do design gráfico,
[03:47 -> 03:52] economizando informações e tal, e a melhor solução que eu acho,
[03:52 -> 03:54] que eu acredito que seja mais legal, seja esta daqui.
[03:55 -> 03:58] Ela tem tudo o que eu expliquei acima,
[03:58 -> 03:59] ela economiza um pouco mais de espaço,
[04:00 -> 04:01] mas aqui eu adicionei uma complexidade
[04:01 -> 04:03] que eu sei que pode dar trabalho para os coitados
[04:03 -> 04:05] dos desenvolvedores da Dev em Dobro,
[04:06 -> 04:07] que é adicionar essas
[04:07 -> 04:10] bolinhas que funcionam como indicadores
[04:10 -> 04:11] como se fosse um grande reel do Instagram
[04:11 -> 04:13] para cada um desses tópicos.
[04:14 -> 04:15] É importante que esta bolinha que está
[04:15 -> 04:17] selecionada tenha o mesmo tamanho desta bolinha
[04:17 -> 04:19] aqui do lado. Isso aí vai ajudar muito a pessoa
[04:19 -> 04:21] a entender que é disso que se trata.
[04:21 -> 04:24] Só que daí teria que ficar plim, plim,
[04:24 -> 04:25] plim, plim,
[04:25 -> 04:27] e trocando esse texto com frequência
[04:28 -> 04:31] Quando troco esses cinco textos, toca automaticamente.
[04:31 -> 04:33] Qual que é o problema que isso acarreta?
[04:33 -> 04:34] A falta de tempo de leitura.
[04:35 -> 04:37] Alguns desses tópicos vão ser fáceis de ler,
[04:37 -> 04:39] outros vão ser impossíveis de ler em dado tempo,
[04:40 -> 04:43] porque a gente precisa que o usuário entenda que isso é interativo.
[04:43 -> 04:47] Minha sugestão é, não vamos nos importar tanto com o tempo de leitura no momento,
[04:48 -> 04:49] vamos atiçar a curiosidade do usuário.
[04:50 -> 04:53] Conforme o usuário clicar, daí a gente deixa um tempo de leitura razoável.
[04:53 -> 04:57] Então vamos supor que aqui é um segundo por texto,
[04:57 -> 05:02] A partir do momento que o usuário clica, a gente deixa em 3 segundos por texto antes de fazer essa troca.
[05:02 -> 05:05] Então, é mais uma complexidade, mas isso vai ajudar bem a entender.
[05:06 -> 05:07] O que é importante?
[05:07 -> 05:12] Isso daqui vai se transformar em 25 cards diferentes, porque isso daqui troca embaixo.
[05:12 -> 05:17] Então, isso meio que passa toda a metodologia deles, polvilhada bem por cima,
[05:17 -> 05:22] mas dentro de uma mesma página, acredito que resolva a solução, resolva o problema deles.
[05:22 -> 05:27] O maior problema que eu vi para mobile é que os botões estavam quadrados
[05:27 -> 05:30] e aqui embaixo ficava um divisor, óbvio que pode ser da minha tela e tal,
[05:31 -> 05:34] mas a gente colocando isso em lista já ajuda bastante qualquer usuário de mobile
[05:34 -> 05:36] a resolver esse problema.
[05:37 -> 05:41] Para o web, a sugestão é basicamente a mesma,
[05:41 -> 05:46] é colocar inner game e outer game aqui e colocar esta parte para cima
[05:46 -> 05:49] e copiar o que a gente fez para mobile em relação às informações.
[05:49 -> 05:52] Mas isso daqui já está resolvido para o web,
[05:52 -> 05:54] Não é um problema. É só adaptar
[05:54 -> 05:55] tudo isso. Sim.
[05:56 -> 05:58] Quando clicar ali, ele vai
[05:58 -> 05:59] pra uma outra página daí, né?
[06:00 -> 06:02] Quando clicar onde? Link ali em cima.
[06:03 -> 06:04] Ali o verdinho.
[06:05 -> 06:05] A growth.
[06:06 -> 06:08] Tem um link? Aqui?
[06:08 -> 06:11] É. Não, não pensei nisso.
[06:11 -> 06:12] Pensei só no sistema de cards.
[06:12 -> 06:15] Ah, beleza. Sem linkar
[06:15 -> 06:15] nada a nada.
[06:16 -> 06:18] É só pra, tipo, o cara conseguir
[06:18 -> 06:20] ver. Eu não sei se eles querem explicar tão a fundo
[06:20 -> 06:22] isso lá dentro. Porque, tipo, eu não achei
[06:22 -> 06:24] essa explicação tanto. Eu acho que
[06:24 -> 06:26] talvez seja meio até tiro no pele
[06:26 -> 06:28] eles irem tão a fundo dentro desses subtópicos.
[06:28 -> 06:30] Mas, também não sei. Isso é da
[06:30 -> 06:32] estratégia deles. O cara vai aprender quando ele
[06:32 -> 06:34] entrar, né? É, então, pois é.
[06:35 -> 06:36] Pode ser uma opção.
[06:37 -> 06:39] Aqui, só pra gente recuperar, porque ainda não
[06:39 -> 06:41] tava gravando, a solução para puxar
[06:41 -> 06:43] um pouco dos black boxes.
[06:43 -> 06:45] E isso daí, se eles quiserem ir pra
[06:45 -> 06:47] outras partes também, Ricardo, sinta-se à vontade.
[06:48 -> 06:49] É uma solução que ela tá combinando
[06:49 -> 06:51] com o nosso layout, ela não tá
[06:51 -> 06:52] fugindo do que a gente está propondo,
[06:53 -> 06:55] ela só recupera um pouco do senso
[06:55 -> 06:57] de controle deles em relação ao que eles já tinham.
[06:57 -> 06:58] No fundo, eu estou achando que é isso.
[06:59 -> 07:01] Eles não querem perder o controle para não parecer que rasgaram
[07:01 -> 07:03] a história. Então, isso daqui volta um pouco
[07:03 -> 07:05] para a história deles. Acho que funciona.
[07:07 -> 07:08] Sistema visual do Solutions
[07:08 -> 07:10] e guarda visual do 5 e...
[07:10 -> 07:12] Duas novas áreas, our client
[07:12 -> 07:14] e our impact. Eu copiei
[07:14 -> 07:16] o conteúdo deles, mas
[07:16 -> 07:18] adaptado ao que a gente tem,
[07:18 -> 07:20] eu fiz um mashup
[07:20 -> 07:23] entre o conteúdo deles atual
[07:23 -> 07:24] e o que a gente tem no nosso site,
[07:25 -> 07:26] na verdade, o que eu tinha aqui no Figma.
[07:27 -> 07:29] Então é muito bom que você confira o conteúdo em si.
[07:29 -> 07:31] Eu estou pensando em design e disposição
[07:31 -> 07:32] aqui dos elementos.
[07:32 -> 07:35] Our Clients, eu usei a mesma solução
[07:35 -> 07:36] que a gente tinha para
[07:36 -> 07:39] Our Results, do banner.
[07:39 -> 07:41] A única diferença é a disposição
[07:41 -> 07:43] das informações aqui dentro, que eu coloquei o nome,
[07:44 -> 07:45] as tags e um link
[07:45 -> 07:47] de Find Out More, que a gente joga
[07:47 -> 07:49] para o projeto. Então isso daqui vai estar
[07:49 -> 07:50] linkado lá com outro projeto.
[07:50 -> 07:55] Mas aqui é meio que a ideia dos black boxes também, mas numa outra disposição.
[07:55 -> 08:01] É só listá-los, os clientes principais, e colocando o Fired Outmore para jogar para aqueles projetos.
[08:02 -> 08:07] Global Footprint, eu usei essa imagem desse mapa, mas na verdade é um mapa que vocês já têm,
[08:07 -> 08:10] que deve ter dado um trabalho do cão, é esse mapa que tem que colocar aqui.
[08:11 -> 08:17] E daí, aqui eles tinham três fotos jogadas muito tristemente, eu até vou recuperar aqui.
[08:17 -> 08:21] Porque eram fotos jogadas muito tristinhas
[08:21 -> 08:24] Achei bizarro esse pedido deles
[08:24 -> 08:26] Inclusive de deixar as fotos pretas e brancas
[08:26 -> 08:28] Para mim parece uma coisa meio mortuária
[08:28 -> 08:32] Eles tem três fotos aqui embaixo
[08:32 -> 08:34] E um texto, o que eu fiz?
[08:34 -> 08:36] Eu modifiquei isso daqui para ser um carrossel
[08:36 -> 08:38] Também de Instagram
[08:38 -> 08:40] Tipo, essa foto aparece, daí troca por outra foto
[08:40 -> 08:42] Troca por outra foto, a gente faz uma modernidade
[08:42 -> 08:44] Dá mais visualidade para a foto
[08:44 -> 08:47] Porque ela não fica tão pequenininha e isolada lá embaixo
[08:47 -> 08:49] e aqui a gente põe uma frase de impacto qualquer
[08:49 -> 08:50] antes de chegar com honra da pele.
[08:52 -> 08:53] Só para eu relembrar,
[08:53 -> 08:55] essa página ele pediu,
[08:55 -> 08:57] eu estou tentando pegar o e-mail dele aqui,
[08:57 -> 08:59] mas ele tinha pedido essa página nova.
[09:00 -> 09:00] Era nova.
[09:00 -> 09:02] Ele pediu essa página nova
[09:02 -> 09:05] e ele deu uma série de, tipo,
[09:05 -> 09:06] coisas que tem que ter, tem que não ter,
[09:06 -> 09:09] esse conteúdo eu não consegui bater ontem.
[09:09 -> 09:11] O que eu consegui foi por layout,
[09:11 -> 09:13] mas não tive...
[09:13 -> 09:15] Our Client, trazer de volta o client
[09:15 -> 09:16] logo, beleza?
[09:17 -> 09:20] Portfólio Snapshot
[09:20 -> 09:22] Portfólio Snapshot é o quê?
[09:26 -> 09:27] É isso, eu acho
[09:27 -> 09:29] Eu acho que é isso aqui
[09:29 -> 09:31] É tipo de jogar pro portfólio
[09:31 -> 09:32] Mas daí eu tô deduzindo já
[09:32 -> 09:36] Objetivo
[09:36 -> 09:37] Mostrar imediatamente
[09:37 -> 09:40] Breads, Kale and Calibre
[09:40 -> 09:44] É muito estranho, né?
[09:44 -> 09:46] Half em português e um pouco em inglês
[09:46 -> 09:49] Tudo misturado
[09:49 -> 09:50] Depois o logo
[09:50 -> 09:52] Apresentar os flags
[09:52 -> 09:54] client stories relacionados às oito
[09:54 -> 09:57] soluções. É, é isso aqui
[09:57 -> 09:59] daí. Porque o que
[09:59 -> 10:01] que eu imagino? Ele quer o logo wall, que é aquela
[10:01 -> 10:03] parte aqui. Que ele tá, não precisa
[10:03 -> 10:05] achar. É o logo wall, né? Que fica passando
[10:05 -> 10:06] os clientes. Sim.
[10:07 -> 10:09] Daí embaixo disso, a gente põe os principais
[10:09 -> 10:11] deles nessa pegada
[10:11 -> 10:12] de projeto e joga pro projeto.
[10:13 -> 10:14] É.
[10:16 -> 10:17] Vamos para os retos.
[10:17 -> 10:19] Client stories.
[10:21 -> 10:21] Beleza.
[10:22 -> 10:23] É isso que ele falou aqui só.
[10:23 -> 10:25] Beleza
[10:25 -> 10:29] E daí vamos para os client stories
[10:29 -> 10:30] Que é algo por aqui
[10:30 -> 10:35] Com as fotos e tal
[10:35 -> 10:37] Esse daqui eu acho que é um pouco mais complicado
[10:37 -> 10:38] Eu também copiei o conteúdo dele
[10:38 -> 10:40] Se você quiser ir batendo aí, ajuda já
[10:40 -> 10:42] Our impact
[10:42 -> 10:45] Our impact
[10:45 -> 10:48] Criar, manter como área separada de our client
[10:48 -> 10:49] Beleza?
[10:49 -> 10:49] Perfeito
[10:49 -> 10:53] Priorizar measurable results
[10:53 -> 10:54] Tá
[10:54 -> 11:03] isso aqui? Impact Statistics. Ah, não, esse é o Impact Statistics.
[11:03 -> 11:15] Measurable Results, então, é a mesma coisa? Não sei. É, a gente tem que ver. É, deixa eu anotar aqui.
[11:15 -> 11:25] Porque acho que no site antigo não tem isso. Cara, eu copiei a estrutura do site antigo.
[11:25 -> 11:28] Deixa eu levar ali
[11:28 -> 11:33] Numbers
[11:33 -> 11:35] Mas pode ser que sejam esses números
[11:35 -> 11:37] E eu peguei os números errados, entendeu?
[11:38 -> 11:40] Acho que os números eles já tinham validado
[11:40 -> 11:41] Eu acredito
[11:41 -> 11:47] Não, o que eu tô achando é que são outros números
[11:47 -> 11:49] Tipo, isso daqui diz respeito a uma coisa
[11:49 -> 11:51] E isso daqui diz respeito a outras coisas
[11:51 -> 11:52] Deixa eu ver
[11:52 -> 11:55] Net promoter score, engagement results
[11:55 -> 11:56] Programming impact
[11:56 -> 12:00] É que measurable
[12:00 -> 12:02] Impact Statistics
[12:02 -> 12:07] Pra mim são coisas
[12:07 -> 12:08] Meio parecidas, certo?
[12:08 -> 12:10] É, então, pois é
[12:10 -> 12:13] Eu confesso que eu não tô nem tentando
[12:13 -> 12:14] Entender o conteúdo, mas
[12:14 -> 12:16] Já tá, já saiu do meu
[12:16 -> 12:19] É, só vou anotar aqui
[12:19 -> 12:20] Pra gente só
[12:20 -> 12:22] Confirmar depois
[12:22 -> 12:24] Beleza
[12:24 -> 12:27] Daí o ponto que eu acho que é importante é
[12:27 -> 12:29] Se for, se a gente conseguir
[12:29 -> 12:31] Usar esse layout, melhor pra gente
[12:31 -> 12:34] Se ele precisar de dois, a gente talvez
[12:34 -> 12:36] tem que inverter a cor de algum deles, porque ele parece
[12:36 -> 12:38] que ele é dois tipos
[12:38 -> 12:39] de comportamento parecido em sequência.
[12:40 -> 12:42] A página antiga é de
[12:42 -> 12:43] Our Impact também.
[12:47 -> 12:47] Daí aqui tem
[12:47 -> 12:49] Client Testimonials.
[12:49 -> 12:51] Daí tem o Client Testimonials, que eu coloquei
[12:51 -> 12:53] Our Client Say e é pra colocar
[12:53 -> 12:55] aquele vídeo enxuto.
[12:56 -> 12:56] Errado.
[12:58 -> 12:59] Programming Outcomes.
[13:01 -> 13:01] O quê?
[13:03 -> 13:04] Programming Outcomes.
[13:05 -> 13:07] Ah, Programming Outcomes.
[13:07 -> 13:12] Ele quer só dados, cara
[13:12 -> 13:13] Daí o problema é que vai ficar assim
[13:13 -> 13:18] Até agora tá algo assim
[13:18 -> 13:30] Porque tá, tipo
[13:30 -> 13:31] Ele quer uns números
[13:31 -> 13:34] Ele quer outros números
[13:34 -> 13:36] Ele quer o client say
[13:36 -> 13:38] E daí ele quer os outcomes
[13:38 -> 13:39] Que também é outros números
[13:39 -> 13:44] Sinceramente, esse programa e outcomes eu não sei nem o que é
[13:44 -> 13:45] É, então, pois é
[13:45 -> 13:49] Lá no site antigo tem essa seção?
[13:49 -> 13:49] Não
[13:49 -> 13:52] Tem social impact
[13:52 -> 13:55] Awards
[13:55 -> 14:00] Deixa eu anotar esse
[14:00 -> 14:14] Ah, depois tem
[14:14 -> 14:17] Depois tem Social Impact
[14:17 -> 14:19] Que eu joguei pra cá também
[14:19 -> 14:21] E também usei a disposição
[14:21 -> 14:23] De Instagram
[14:23 -> 14:25] Então você pode aumentar a quantidade de bolinhas
[14:25 -> 14:27] Ou diminuir conforme for necessário
[14:27 -> 14:29] Ah, isso aí, tem aqui Impact Stories
[14:29 -> 14:32] E daí tem o Evidence Across Region
[14:32 -> 14:36] Esse do Impact
[14:36 -> 14:37] Daí tu não pegou todo esse texto
[14:37 -> 14:39] Não, não, não, não, não
[14:39 -> 14:41] E nem vou pegar, porque tipo, eles estão
[14:41 -> 14:43] falando, ah, evitar o
[14:43 -> 14:45] scroll em excesso.
[14:45 -> 14:46] E é um testaço.
[14:48 -> 14:49] Tá, daí tem a evidência
[14:49 -> 14:50] cross regions.
[14:53 -> 14:55] Também não sei o que é, ele tem uma descrição aí?
[14:58 -> 14:59] Não.
[15:00 -> 15:02] Queremos uma página muito visual,
[15:02 -> 15:04] numbers, quotes, proof blocks,
[15:04 -> 15:05] dashboards.
[15:07 -> 15:10] Pou long form
[15:10 -> 15:10] copy.
[15:13 -> 15:15] Long form copy?
[15:17 -> 15:18] Pouco long form copy.
[15:18 -> 15:21] Acho que deve ser um pouco o texto gigante.
[15:23 -> 15:24] Beleza.
[15:24 -> 15:25] Mas a gente precisa das informações, né?
[15:26 -> 15:27] Não adianta ele falar o que...
[15:27 -> 15:29] Ah, eu quero gráficos. Mas beleza.
[15:29 -> 15:31] Deixa eu só ver aqui embaixo se ele falou alguma coisa
[15:31 -> 15:34] sobre esses pontos, porque talvez ele tenha falado aqui.
[15:44 -> 15:46] Ele falou aqui, gostaria que você priorizasse
[15:46 -> 15:48] principalmente homepage, visual e error.
[15:48 -> 15:49] Esse da homepage,
[15:49 -> 15:53] Na verdade, acho que a gente pode fazer aqui com o IAR, né?
[15:53 -> 15:53] Não precisa?
[15:54 -> 15:55] Eu acho também.
[15:57 -> 15:58] É só reordenar ali, né?
[15:58 -> 16:00] Que ele tinha pedido, inclusive.
[16:01 -> 16:03] A não ser que tu queira atualizar no Figma, né?
[16:04 -> 16:05] Cara, não quero.
[16:08 -> 16:08] Beleza.
[16:11 -> 16:13] Social Visual System Solutions.
[16:14 -> 16:15] Isso aí tu já está vendo.
[16:16 -> 16:18] 5H Visual Language.
[16:18 -> 16:19] Isso aí tu já está vendo.
[16:19 -> 16:20] Our Clients, Our Impact.
[16:20 -> 16:22] Isso aí é o que a gente tem essas dúvidas.
[16:22 -> 16:23] Team Treatment.
[16:23 -> 16:25] em treatment
[16:25 -> 16:28] esse deve ser a outra página
[16:28 -> 16:30] eu acho que é de
[16:30 -> 16:31] fotos, né
[16:31 -> 16:33] que ele fala que ele quer preto e branco
[16:33 -> 16:38] acho que depois a gente pode ver ali
[16:38 -> 16:39] overall reduction
[16:39 -> 16:42] isso aí
[16:42 -> 16:43] eu vou centralizar os remains
[16:43 -> 16:45] e DNA decisions
[16:45 -> 16:48] ele não falou nada aqui
[16:48 -> 16:54] sobre os conteúdos
[16:54 -> 16:55] então depois eu vou
[16:55 -> 16:57] perguntar pra ele, mas vamos seguir
[16:57 -> 17:01] vamos seguir
[17:01 -> 17:03] temos que ver o que é
[17:03 -> 17:05] perfeito
[17:05 -> 17:07] e daí por último aqui no site tem o
[17:07 -> 17:09] awards, também puxei o awards pra cá
[17:09 -> 17:12] na mesma disposição que a gente já tinha
[17:12 -> 17:14] mesmo esquema, clica, vai pra algum award
[17:14 -> 17:16] não sei se aqui é clicado ou não
[17:16 -> 17:18] tá bom?
[17:19 -> 17:20] foi isso que eu fiz, tem comentários deles
[17:20 -> 17:22] em relação a outras coisas
[17:22 -> 17:25] tipo tratamento de time, foto de grupos e retratos
[17:25 -> 17:25] em pb
[17:25 -> 17:27] não precisamos
[17:27 -> 17:30] expressão visual da home
[17:30 -> 17:31] em cima do que já reorganizei
[17:31 -> 17:33] isso ficou meio aberto
[17:33 -> 17:35] mas tipo, ficaram comentários um pouco
[17:35 -> 17:37] subjetivos, eu acredito que a gente
[17:37 -> 17:39] consiga resolver fazendo um update
[17:39 -> 17:41] legal, tipo, puxando pro que eles querem
[17:41 -> 17:43] meu receio, minha teoria
[17:43 -> 17:46] o Guilherme
[17:46 -> 17:48] pelo que eu entendi, fez tudo
[17:48 -> 17:50] puxou tudo isso meio sem autorização da
[17:50 -> 17:51] REA, ou sem a REA saber
[17:51 -> 17:53] eu acho que ao apresentar pra REA
[17:53 -> 17:56] a REA deu um tipo, puta, eu tava feliz
[17:56 -> 17:57] com o site antigo
[17:57 -> 17:59] mas a gente vai ter que defender
[17:59 -> 18:01] e isso, obviamente, eu faço
[18:01 -> 18:03] de tipo, cara, não, não dá, tem coisas
[18:03 -> 18:05] que tipo, pô, a gente começou esse processo
[18:05 -> 18:07] porque as cores estavam zoadas
[18:07 -> 18:10] e eu falei pra ele, cara, teu site tá muito
[18:10 -> 18:11] fora do que deveria.
[18:12 -> 18:14] Então, tipo, recuperar
[18:14 -> 18:16] boa parte daquilo agora é desnecessário.
[18:17 -> 18:17] Não, mas até na questão
[18:17 -> 18:20] do conteúdo, né? Eles mesmos falam
[18:20 -> 18:22] que eles não querem conteúdo longo,
[18:22 -> 18:24] por exemplo. Então, tem que ter feito
[18:24 -> 18:25] uma estruturação desse conteúdo.
[18:25 -> 18:28] Exato, aqui a mesma coisa, redução geral de texto
[18:28 -> 18:31] scroll, não está no nosso
[18:31 -> 18:32] controle, é o conteúdo
[18:32 -> 18:34] eles falaram também que tipo
[18:34 -> 18:37] espaços em branco, muito espaço em
[18:37 -> 18:39] branco, sou obrigado
[18:39 -> 18:41] pela minha formação a ignorar
[18:41 -> 18:43] esse tipo de comentário, porque espaço em branco é o que faz
[18:43 -> 18:45] o design desde sempre, então tem coisas
[18:45 -> 18:47] que a gente consegue defender, entendeu?
[18:50 -> 18:51] Mas eu acho que
[18:51 -> 18:53] o que eu estou pensando, você vai ter que apresentar
[18:53 -> 18:55] isso pra ele, se você
[18:55 -> 18:58] puder me colocar
[18:58 -> 18:59] na conversa, pra gente conseguir
[18:59 -> 19:01] defender junto, eu agradeço isso, porque
[19:01 -> 19:03] a gente já resolve qualquer coisa que precise, assim,
[19:04 -> 19:05] de tendências pra
[19:05 -> 19:07] tentar entender um pouco de onde
[19:07 -> 19:09] tá indo, porque o Guilherme parecia super feliz
[19:09 -> 19:11] com o resultado, e daí, tipo, a Ré
[19:11 -> 19:13] entrou meio torta. É,
[19:13 -> 19:15] eu acho que pode marcar com ele
[19:15 -> 19:16] de falar.
[19:18 -> 19:19] Só me dá um minutinho, por favor, Ricardo.
[19:28 -> 19:30] Obrigado, meu querido. Minha filha
[19:30 -> 19:30] veio aqui, eu sei.
[19:30 -> 19:49] é uma versão inicial não tá pronto porque principalmente por causa das revisões de
[19:49 -> 19:54] layout que vocês vão ter que fazer né então você vai ter que olhar tudo isso que ele fez aí tu
[19:54 -> 19:59] vai pode estar junto na conversa para mim sim se você quiser que eu valide com ele antes isso
[19:59 -> 20:01] de layout? Pode ser.
[20:01 -> 20:03] Posso validar também. Eu mando mensagem pra ele e marco
[20:03 -> 20:05] com ele já. É, acho que seria até legal
[20:05 -> 20:07] validar. Talvez antes da gente
[20:07 -> 20:08] implementar, né?
[20:09 -> 20:11] Total. Faz todo sentido.
[20:12 -> 20:14] Então, beleza. Eu vou tentar conversar com ele.
[20:14 -> 20:16] Vou tentar mandar mensagem pra ele e conversar com ele.
[20:17 -> 20:21] Pode falar aí.
[20:22 -> 20:24] O papai tá trabalhando.
[20:24 -> 20:26] O papai tá em reunião, Muriel. Eu já vou lá.
[20:26 -> 20:29] Eu vou mandar mensagem pra ele, então.
[20:29 -> 20:31] Eu vou tentar marcar uma reunião pra hoje de tarde
[20:31 -> 20:32] Para conseguir validar isso
[20:32 -> 20:34] Daí eu te dou um ok ou não ok
[20:34 -> 20:36] Dos conteúdos eu vou ver com ele
[20:36 -> 20:38] A mesma coisa
[20:38 -> 20:41] Eu tinha perguntado para ele
[20:41 -> 20:43] Se a gente refaz os conteúdos por conta própria
[20:43 -> 20:44] E depois eles aprovam
[20:44 -> 20:46] Mas eu não sei se essa ideia vai ser tão boa
[20:46 -> 20:49] Eu acho que a Rea
[20:49 -> 20:50] Provavelmente ela vai querer olhar
[20:50 -> 20:54] Então eu vou conversar com ele sobre o que a gente faz com esses conteúdos
[20:54 -> 20:54] E tal
[20:54 -> 20:57] Mas dessas páginas novas
[20:57 -> 20:58] Tu já pode falar com ele
[20:58 -> 21:00] Algumas coisas estão faltando
[21:00 -> 21:01] Eu vou até te mandar isso aqui
[21:01 -> 21:03] no caso tu vai falar com ele já.
[21:03 -> 21:03] Boa.
[21:05 -> 21:05] Algumas coisas faltaram.
[21:06 -> 21:08] Tem alguns outros pontos ali que eu não sei se tu vai querer ver,
[21:08 -> 21:12] mas tem outras coisas ali, né?
[21:14 -> 21:14] Deixa eu ver isso aqui.
[21:18 -> 21:20] Propriety, frameworks and diagnosis.
[21:20 -> 21:21] Eu não sei se tu viu isso aqui.
[21:22 -> 21:22] Já.
[21:25 -> 21:27] Não, o que eu vi eu te mostrei.
[21:30 -> 21:32] Mas vai ser bom alinhar com ele, né, Raul?
[21:33 -> 21:33] É.
[21:33 -> 21:36] Que eu ligo pra ele, eu já entendo qual é a intenção geral da coisa.
[21:36 -> 21:40] Eu só vou chamar você também
[21:40 -> 21:42] Você e teu irmão, eu vou convidar mesmo
[21:42 -> 21:44] Eu aviso pelo WhatsApp e vou convidar vocês
[21:44 -> 21:45] Caso vocês possam participar, se vocês não puderem
[21:45 -> 21:46] Não tem problema
[21:46 -> 21:50] Eu tenho um pouco de medo desse alinhamento paralelo
[21:50 -> 21:52] Que vai que eu falo pra ele, não, beleza
[21:52 -> 21:53] Então eu vou fazer isso e daí do nada
[21:53 -> 21:54] Não funciona
[21:54 -> 21:57] Só me avisa o horário
[21:57 -> 22:00] Total, e se não conseguir não tem problema
[22:00 -> 22:01] Eu gravo, te passo, mas
[22:01 -> 22:04] Gravo não sei gravar, mas eu dou um jeito de te passar
[22:04 -> 22:06] E eu concordo com você
[22:06 -> 22:08] Eu, se eu fosse vocês, agora pararia
[22:08 -> 22:11] total de gerar conteúdo com o IA e falaria
[22:11 -> 22:13] a partir de agora é vocês que mandam o conteúdo verdadeiro.
[22:14 -> 22:14] Isso.
[22:15 -> 22:16] Acho que vai ser bem isso.
[22:16 -> 22:17] A gente precisa
[22:17 -> 22:20] de mais do que só tópicos.
[22:21 -> 22:22] É, porque tipo,
[22:22 -> 22:24] a estrutura tá montada, a ideia
[22:24 -> 22:26] tá lançada, tá tudo meio
[22:26 -> 22:28] a partir de agora não tem mais o que vocês
[22:28 -> 22:29] inventarem por eles, né?
[22:30 -> 22:31] Isso. Mas é isso aí. Eu acho.
[22:32 -> 22:33] Mas é a metodologia de vocês.
[22:34 -> 22:34] Beleza.
[22:34 -> 22:38] tu acha que a gente inventa aqui
[22:38 -> 22:39] e vocês validam, ou é melhor
[22:39 -> 22:41] vocês nos mandarem já validado
[22:41 -> 22:44] porque não pode ser retrabalho
[22:44 -> 22:46] e eu preferia
[22:46 -> 22:48] que eles nos mandassem mesmo como é que é pra ficar
[22:48 -> 22:49] porque já teve retrabalho nesse sentido
[22:49 -> 22:51] sim
[22:51 -> 22:53] mas é isso
[22:53 -> 22:56] quando tu for falar com ele, pode pegar o e-mail
[22:56 -> 22:57] que ele mandou
[22:57 -> 23:00] e passar junto com ele os pontos que ele mandou
[23:00 -> 23:02] talvez, porque daí facilita também
[23:02 -> 23:05] pra ele mesmo ver
[23:05 -> 23:07] e mandou
[23:07 -> 23:09] o que está faltando
[23:09 -> 23:12] que vai facilitar
[23:12 -> 23:14] perfeito, então tá bom
[23:14 -> 23:16] Ricardo, eu converso com você assim que eu estiver alinhado com ele
[23:16 -> 23:18] ou na real eu te mando a hora
[23:18 -> 23:19] da reunião, se eu marcar
[23:19 -> 23:20] pode mandar
[23:20 -> 23:24] valeu meu querido, bom final de semana para você, de resto
[23:24 -> 23:24] tudo bem com vocês?
[23:25 -> 23:26] tudo bem
[23:26 -> 23:27] bastante trabalho?
[23:29 -> 23:31] estamos fazendo um produto novo agora
[23:31 -> 23:34] um acompanhamento, uma comunidade
[23:34 -> 23:37] pra quem quer aprender IA e automação
[23:37 -> 23:38] pra fazer freelo
[23:38 -> 23:40] ou construir uma agência de automação IA
[23:40 -> 23:43] a gente tá correndo pra fazer isso aí
[23:43 -> 23:45] tipo um curso?
[23:46 -> 23:47] é, um curso, mas
[23:47 -> 23:50] ele é mais acompanhamento mesmo, live semanal
[23:50 -> 23:51] também tem as aulas gravadas
[23:51 -> 23:53] mas pra fazer
[23:53 -> 23:56] mais acompanhamento, acho que a galera não tá mais
[23:56 -> 23:58] tão pilhada de fazer curso
[23:58 -> 24:00] é, eu não sei
[24:00 -> 24:02] eu nunca fiz tanto curso, mas eu vejo
[24:02 -> 24:04] 10 cursos saindo por dia, eu acho que
[24:04 -> 24:05] deve dar dinheiro
[24:05 -> 24:06] É. Dá.
[24:07 -> 24:08] Mas hoje em dia tá mudando um pouco.
[24:09 -> 24:10] Que massa. Oi, alguém ainda segue,
[24:10 -> 24:13] foi em contato com vocês, mandou e-mail daquela apresentação?
[24:14 -> 24:14] Não, acho que não.
[24:15 -> 24:16] Beto...
[24:16 -> 24:18] Vou recuperar isso segunda-feira.
[24:19 -> 24:21] Beleza. Beto tá viajando,
[24:21 -> 24:22] então não sei se ele...
[24:22 -> 24:23] Posso ver com ele.
[24:25 -> 24:27] Boa. Não, é que a gente mandaria pro Devin Dobro,
[24:27 -> 24:28] que é o e-mail de vocês dois ao mesmo tempo.
[24:29 -> 24:31] É assim. Beleza.
[24:31 -> 24:33] Então, beleza. Valeu, meu querido. Vou te avisar.
[24:33 -> 24:35] Eu, Gulli, qualquer coisa, chama.
[24:35 -> 24:36] bom final de semana para você, valeu
[24:36 -> 24:37] também, valeu
