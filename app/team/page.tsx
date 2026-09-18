import type { Metadata } from "next";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import SolutionCta from "@/components/solutions/SolutionCta";
import TypeLabel from "@/components/TypeLabel";
import LeaderCard from "@/components/team/LeaderCard";
import teamStanding from "@/public/team/team-standing-six.jpg";
import teamHero from "@/public/team/team-stairs-landscape-six.jpg";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { getPeople } from "@/lib/cms/map";
/* ⚠️ `facultyRegions` SAIU DESTA LISTA EM 17-09, junto com os cartões de
   região que a Global faculty perdeu para a lista de pessoas. O export
   continua em `lib/team.ts` (a /team-tests o usa, e é o caminho de volta se
   ela quiser os cartões), mas esta página não o consome mais. O
   `ImagePlaceholder` saiu pelo mesmo motivo: ele só existia para o slot 06
   vazio de cada cartão. */
import { leaders, programmeManagers, facultyMembers, dnaLead, dnaStrands } from "@/lib/team";
import PeopleRoster from "@/components/team/PeopleRoster";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Our Team — Corporate DNA",
    description:
      "The leadership team and global faculty behind Corporate DNA — senior practitioners delivering across 36 countries.",
    alternates: localeAlternates("/team"),
  };
}

/**
 * Our Team — reconstruída em 11-09 sobre o outline de Team (09-09).
 *
 * O QUE MUDOU. A página existia desde o brief de 27-08, na linguagem antiga
 * (PageHero em Poppins, grade do CMS, três caixas de "pendente"). O outline do
 * cliente trouxe copy FINAL para o herói e para a faculty, e uma frase de cada
 * pessoa — conteúdo que o CMS não tem onde guardar. Então ela passa a ler de
 * `lib/team.ts` e ganha a tipografia editorial da About e da Services.
 *
 * O QUE CONTINUA VINDO DE ANTES: as âncoras `#leadership` e `#faculty`.
 * A terceira, `#presence`, e o mapa de escritórios que ela marcava saíram em
 * 14-09 a pedido da cliente — a caixa no pé do arquivo tem o porquê e a
 * conferência de quem apontava para lá.
 *
 * A ROTA MUDOU EM 11-09: `/our-team` → `/team`, a pedido. O endereço antigo
 * está no menu em produção e é destino de quatro redirects do WordPress, então
 * ele continua vivo por 308 em `next.config.mjs` — e os quatro legados passaram
 * a apontar direto para cá, sem escala.
 *
 * ✅ O BLOCO 4 TEM FOTO DESDE 15-09 — a do time na escada, do pacote do Drive.
 * Ele passou 11-09 a 15-09 como slot VISÍVEL, e essa decisão fica registrada
 * porque o raciocínio vale para o próximo HOLD: a primeira versão escondia o
 * bloco sem foto, para a página ler como completa, e isso estava errado por
 * causa de quem revisa — é o próprio cliente, que escreveu os HOLD e sabe o que
 * deve. Esconder o bloco tirava dele a única decisão que a revisão existia para
 * tomar: se o layout funciona. Placeholder dimensionado e rotulado pelo que vai
 * receber, nunca aviso de pendência.
 *
 * (E ele provou o próprio ponto: a foto que chegou é RETRATO, o slot era 16:9, e
 * o bloco teve de ser refeito. Ver a caixa dele.)
 *
 * ⏸️ O BLOCO 3 (PERSPECTIVES) FOI CONSTRUÍDO E RETIRADO NO MESMO DIA. Eram duas
 * faixas escuras intercaladas na grade, com a frase de uma pessoa ampliada sobre
 * o slot de fotografia candid. Funcionava — está nas capturas de 11-09 — e saiu
 * por um motivo que não é de desenho: ninguém conversou com o cliente sobre O
 * QUE o bloco 3 é. O documento pede frases NOVAS, resposta a uma pergunta
 * específica ("what do you believe about leadership that most people in this
 * industry get wrong?"), e o que a faixa mostrava era a frase do bloco 2 em
 * corpo maior. Mostrar isso como se fosse o bloco 3 pronto responde a pergunta
 * errada numa revisão. Volta depois da conversa — a montagem inteira está no
 * commit desta data, é copiar de volta.
 *
 * ⏳ SEGUE SEM SLOT o mosaico por região do bloco 5 (slot 06): ele é UMA imagem
 * por região atrás de cinco tiles que já existem e já leem bem em texto — pôr
 * cinco caixas tracejadas ali muda o desenho do bloco em vez de mostrá-lo.
 */
export default async function OurTeamPage() {
  /* ⚠️ A PÁGINA VOLTOU A TOCAR O CMS EM 15-09, e só por isto: o pop-up de perfil
     que o botão "+" de cada card abre. O texto da página continua todo em
     `lib/team.ts` — nome, cargo, região e a quote do bloco 2 —, porque o CMS não
     tem campo de citação em `person`. O que vem de lá é a BIO e os campos
     estruturados do perfil, que o Word não tem.

     CASADO PELO `cmsSlug` E NÃO PELO NOME: o CMS grava "Jon-Paul (JP) Pritchard"
     contra o nosso "Jon Paul Pritchard", e "Nitin Goil " com espaço no fim. A
     caixa do campo em `lib/team.ts` tem o resto.

     SE O CMS NÃO RESPONDER, `getPeople()` devolve lista vazia, o `find` devolve
     `undefined`, e os seis cards saem sem o "+" — a página inteira continua de
     pé, porque nada do que se lê nela depende desta chamada. É a diferença entre
     enriquecer com o CMS e depender dele. */
  const cmsPeople = await getPeople();
  const profileFor = (slug?: string) =>
    slug ? cmsPeople.find((p) => p.slug === slug) : undefined;

  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell footerTopBorder floatingNav>
        {/* ✅ HERÓI PRÓPRIO DESDE 15-09. A página deixou de dividir a foto
            padrão das rotas de serviço — é uma fotografia real de sessão da
            CDNA, com o grupo todo em volta da tela.

            ⚠️ O ARQUIVO É 4:3 (1600x1200) E A DOBRA É ~1,9:1, então o
            `object-cover` escala pela largura e corta 30% da ALTURA. Centrado, o
            corte tirava os pés da fileira da frente e mantinha teto, que é a
            parte morta do quadro. `78%` no eixo Y joga o recorte para baixo: no
            desktop entra o grupo inteiro, do topo das cabeças ao chão, e sai
            quase todo o forro de madeira.

            O 78% NO EIXO X NÃO FAZ NADA NO DESKTOP e é para o TELEFONE. Numa
            dobra de 0,46:1 o corte inverte — passa a ser horizontal, e sobram
            34% da largura. Centrado (`50%`), o que restava na tela era
            justamente a TELA da sala, com a chamada de vídeo no meio do herói.
            Em `78%` o recorte vai para o grupo da direita e a tela fica de fora.

            ⚠️ A TELA AO FUNDO MOSTRA UMA REUNIÃO DE CLIENTE — participantes
            identificáveis e a marca deles nos fundos virtuais. No desktop ela
            cai na faixa onde o escurecimento lateral ainda mede 24–66% e o
            `brightness-[.68]` do herói soma por cima, então ela sai bem apagada;
            ainda assim, publicar rosto e marca de terceiro é assunto de
            consentimento, não de desenho. Fica registrado para quem for revisar
            com o cliente. */}
        {/* SEM O DUOTONE, a pedido em 11-09: cinza como na home. Esta página foi
            a primeira, e passava `tint="none"` com o filtro da home escrito aqui.
            As páginas de serviço pediram o mesmo no mesmo dia, e aí os dois
            valores viraram o PADRÃO do `SolutionHero` — o raciocínio inteiro
            (por que `none`, por que o `brightness` não é enfeite) mora agora nas
            props de lá. Repetir aqui só criaria dois lugares para ajustar. */}
        {/* ✅ HERÓI TROCADO EM 16-09 pela foto do time na escada EM LANDSCAPE
            (2400x1600) — a que o Guli ficou de entregar na daily, e a primeira
            fotografia desta página com largura de dobra de verdade.

            ⚠️ SEGUNDA VERSÃO NO MESMO DIA: `…-landscape-six.jpg`, o retoque com
            a pessoa do canto superior direito removida. Ficam SEIS na escada.

            O ARQUIVO GANHOU NOME NOVO EM VEZ DE SER SOBRESCRITO, mesma decisão
            da foto da Heineken em 15-09: o `next/image` serve a imagem otimizada
            por uma URL derivada do caminho, e o CDN guarda aquela URL. Trocar o
            conteúdo mantendo o nome entrega a foto antiga por tempo indefinido —
            e é o tipo de defeito que só aparece no celular de quem já visitou.

            O PNG DE ORIGEM TEM 4,1 MB e virou JPEG q90 de 540 KB numa única
            compressão (`sharp`, mozjpeg), mesmo caminho do `skyline-dna.jpg`.
            Recomprimir uma vez só importa: o arquivo do WhatsApp que serviu de
            herói antes já era uma segunda geração, e é isso que empasta o céu.

            ⚠️ ANCORADO NO TOPO (`object-top`), e não centrado. O
            `object-[78%_78%]` existia para a foto anterior, cujo assunto estava
            no canto inferior direito. Centrar aqui parecia certo — as oito
            pessoas ocupam o meio do quadro — e não era: a fileira de cima está a
            4% do topo da imagem, e o `object-cover` tira altura DOS DOIS LADOS.

            A CONTA, que é o que decide: a imagem é 3:2 (1,50) e o herói é
            `100svh`. Numa janela de 1440x950 a dobra dá 1,52 e sobra corte
            nenhum — foi por isso que a captura inicial parecia boa. Num laptop
            de 1440x800 a dobra vai a 1,80: o `cover` escala pela largura, a
            altura renderizada passa de 800 para 960 e os 160px que sobram saem
            60/60 do topo e do pé. Sessenta pixels de tela são 100 do original —
            e a 4% de 1600 as cabeças estão a 64. Elas somem.

            Ancorar no topo tira os 160px todos DO PÉ, que é degrau vazio e
            piso tátil. Nada de gente se perde em nenhuma altura de janela. */}
        <SolutionHero
          eyebrow="Our Team"
          title="The people who sit where our clients sit."
          /* ⚠️ O `60+` ACOMPANHA A SEÇÃO GLOBAL FACULTY, embora o pedido de
             17-09 só cite a seção: o subtítulo do herói e o h2 de lá fazem a
             MESMA afirmação, a duas telas de distância. Deixar 75 aqui e 60+ lá
             não seria fidelidade ao pedido, seria a mesma página se
             contradizendo sobre o tamanho da própria faculty. */
          subtitle="A senior leadership team, backed by a global faculty of 60+ practitioners delivering across 36 countries."
          imageUrl={teamHero}
          imagePosition="object-top"
        />

        {/* ── Leadership ────────────────────────────────────────────────── */}
        <section id="leadership" className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
            <TypeLabel>Leadership</TypeLabel>
            {/* Mesma escala de h2 da Client impact da home, agora nas três
                seções desta página. Ver a caixa no bloco 6. */}
            <h2 className="font-serif mb-[52px] max-w-[720px] text-[28px] font-semibold leading-[1.1] tracking-[-0.5px] text-ink sm:text-[34px] md:text-[40px]">
              The team behind the work.
            </h2>

            {/* TRÊS COLUNAS, como o documento pede ("portrait grid, three
                across") e como o mockup de 14-09 confirma. São seis pessoas:
                duas fileiras cheias.

                Sem `mt`: o espaço até aqui é o `mb-[52px]` do h2, como na home.
                Eram 56px somados ao `mt-5` do título; a diferença de 4px não se
                vê, e o que se ganha é o mesmo ritmo nas três seções.

                ⚠️ TRÊS COLUNAS A PARTIR DE `xl` (1280), e a conta é o que
                define o limiar. Cada card se parte em retrato + cartão de quote
                (item 16), e o que tem de sobreviver é a medida da quote. Com
                `gap-x-6` por fora e `gap-x-4` por dentro, a caixa de texto dela
                fica em:

                   1280 →  16 car/linha        1440 →  20 car/linha
                   1366 →  18 car/linha        1920 →  29 car/linha

                A REFERÊNCIA DELA ANDA EM ~20, e as linhas dali são mesmo curtas
                ("Leadership isn't", "about having"). Ou seja 1280 é estreito mas
                está dentro do desenho; 1024 não está — ali a coluna cai para 11
                caracteres.

                ⏸️ O LIMIAR ERA 1440 ATÉ 15-09, e isso deixava a página em DUAS
                colunas em qualquer laptop de 1366 — que é onde ela foi revisada.
                O pedido foi "duas linhas de três pessoas". Como são seis, três
                por linha é o que entrega isso.

                ⚠️ OS VÃOS SÃO OS DA REFERÊNCIA (`leadership.PNG`), medidos em
                pixels nela e convertidos: ela tem 1009px de conteúdo contra os
                1360 desta página, então a escala é 1,348.

                   vão entre pares    19px na ref  → 26  → `gap-x-6` (24)
                   vão entre fileiras 27px na ref  → 36  → `gap-y-9`  (36)

                O `gap-y` tinha subido para 72px quando o card ganhou a ficha e o
                cartão claro — foi estimativa, e ficou o dobro do que a
                referência usa. O `gap-x` era 32.

                ⚠️ O VÃO DE DENTRO DO CARD É MENOR QUE O DE FORA, e isso é
                deliberado na referência: 11px contra 19px. É ele que faz o
                retrato e a quote lerem como UM card em vez de duas colunas
                soltas. Mora no `LeaderCard`, que é quem desenha o par.

                ⚠️ `sm:auto-rows-fr` DESDE 18-09, junto com a proporção fixa do
                retrato no `LeaderCard` — pedido da daily: *"the images on
                section 'Leadership' should be the same height"*. Com o retrato
                em 3:4 fixo, as fotos já saem iguais; o que ainda variava era o
                CARTÃO DE QUOTE, esticado até a fileira, e cada fileira tinha a
                altura da quote mais longa dela. `auto-rows-fr` faz as duas
                fileiras terem a altura da mais alta, então os seis cards ficam
                com a mesma silhueta (foto, ficha e cartão rosa nas mesmas
                medidas). A partir de `sm` e não sempre: em uma coluna, no
                celular, isso esticaria cada card até a quote mais longa das
                seis, e rosa vazio no celular é só rolagem. */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-9 sm:auto-rows-fr sm:grid-cols-2 xl:grid-cols-3">
              {leaders.map((p) => (
                <LeaderCard
                  key={p.name}
                  person={p}
                  profile={profileFor(p.cmsSlug)}
                />
              ))}
            </div>

            {/* ── Senior programme managers · 17-09 ──────────────────────────
                *"embaixo da seção 'Leadership' criar uma nova parte que vai ser
                'supported by our senior programme managers' e vai ter uma lista
                de pessoas com fotos e nomes."* O texto exato veio depois, por
                escrito, e é o que está no h3 abaixo.

                ⚠️ DENTRO DA MESMA <section>, e não numa nova. Ela pediu uma
                "parte", não uma seção, e a diferença tem consequência: a página
                alterna fundos (branco → ink na "One team" → paper na faculty), e
                uma seção nova aqui obrigaria a inventar um quarto degrau entre
                dois brancos. Como sub-bloco, ela herda o branco da liderança e a
                régua acima é quem faz a divisa — que é o que a hierarquia diz de
                qualquer jeito: é apoio à liderança, não um terceiro time.

                ⚠️ "PROGRAM" E NÃO "PROGRAMME", porque é o texto dela à letra. O
                resto do site é inglês britânico ("programmes delivered, across
                five regions" na /about, "Manager Development"), então esta é a
                única grafia americana da página. Não corrigimos texto de cliente
                por conta própria — mas é uma pergunta de uma linha na próxima
                daily, e a resposta muda uma palavra.

                O h3 É `h3` E NÃO `h2`: o h2 desta seção é "The team behind the
                work." e este bloco está DENTRO dele. Dois h2 na mesma seção
                quebrariam a árvore de cabeçalhos para quem navega por leitor de
                tela. */}
            <div className="mt-20 border-t border-line pt-14 md:mt-24">
              <h3 className="font-serif mb-10 max-w-[720px] text-[22px] font-semibold leading-[1.15] tracking-[-0.3px] text-ink sm:text-[26px] md:text-[30px]">
                Supported by a team of senior program managers.
              </h3>
              <PeopleRoster people={programmeManagers} size="lg" />
            </div>
          </div>
        </section>

        {/* ── Bloco 4 · Group photograph ───────────────────────────────── */}
        {/* ✅ TROCADA EM 17-09 PELO RETOQUE DAS SEIS NA BANCADA
            (`team-standing-six.jpg`), 1644x957 — a pedido, no lugar da foto do
            time em pé que entrou em 16-09. Mesma composição, mesma seção; o que
            muda é o arquivo.

            ⚠️ É RETOQUE GERADO, não arquivo de câmera: chegou como
            `ChatGPT Image 17 de set. de 2026, 11_06_58.png` e foi convertido numa
            única compressão (PNG de 1,6 MB → JPEG q90 de 223 KB). A 100% de zoom
            as MÃOS sobre a bancada mostram o artefato do gerador — o punho se
            funde à manga sem costura e a palma fica larga demais. No tamanho em
            que a seção serve a foto (~790px de largura num laptop) aquela faixa
            tem uns 20px de altura e não se lê; fica anotado porque a cliente já
            reprovou fotografia por distorção ("some of their faces look a bit
            distorted"), e é isso que ela vê se abrir o arquivo inteiro.

            O RECORTE CABE. A fonte é 1,72 e o slot é 3:2, então `object-cover`
            come 6,3% de cada lado — 104px. A pessoa mais à esquerda começa depois
            disso: ninguém é cortado. Verificado recortando o 3:2 na mão.

            ⚠️ A ANTERIOR FICOU SEM USO NENHUM (`team/team-standing.jpg`). Foi
            mantida no repositório pelo mesmo motivo da escada em retrato, logo
            abaixo — se a troca for desfeita, é ela que volta. A /about NÃO a usa:
            lá é `team-stairs-about-six.jpg`, cópia própria.

            --- histórico, da troca de 16-09 ---
            ✅ TROCADA EM 16-09 PELA FOTO DO TIME EM PÉ (`team-standing.jpg`), a
            que a Maliha ficou de mandar na daily — seis pessoas atrás da mesa,
            no escritório, 1600x1066.

            ⚠️ A TROCA VIROU A COMPOSIÇÃO DE VOLTA PARA A DO MOCKUP DELA. A
            anterior era RETRATO (2:3) e por isso a foto morava na coluna
            ESTREITA, com o texto ocupando a larga — o inverso do desenho. Esta é
            PAISAGEM (3:2), então a imagem volta a ser o elemento largo
            (1.35fr contra 1fr) e o texto o estreito, que é o que
            `docs/mockup-team-maliha-14-09-2026.png` mostra.

            A FOTO DA ESCADA CONTINUA NO REPOSITÓRIO (`team/team-stairs.jpg`),
            sem uso nesta página. Ela não foi apagada porque o pedido do Guli na
            daily era uma escada em LANDSCAPE, e se aquela chegar é ela que
            disputa este slot — ou o da /about, que hoje usa uma cópia própria.

            ⚠️ ISSO DESFAZ A REPETIÇÃO COM A /about, que era o efeito colateral
            anotado abaixo: as duas páginas usavam a mesma fotografia em
            recortes diferentes, e o documento avisa que repetir "is visible".
            Agora cada uma tem a sua.

            --- histórico, de quando a foto da escada entrou em 15-09 ---
            ✅ A FOTO CHEGOU EM 15-09 — o time sentado na escada, que a própria
            Maliha procurava na call de 14-09. O slot esperava desde 11-09.

            ⚠️ O SLOT DE 16:9 NÃO SERVIA. Ele foi dimensionado para "uma foto de
            seis pessoas lado a lado", e a que veio tem as seis em TRÊS DEGRAUS:
            é 1066x1600, retrato 2:3. Numa faixa 16:9 de largura cheia sobrariam
            ~40% da altura, cortando a fileira de cima e a de baixo.

            A SAÍDA É A COMPOSIÇÃO DO PRÓPRIO MOCKUP DELA
            (`docs/mockup-team-maliha-14-09-2026.png`): a foto de um lado e, do
            outro, sobre escuro, o rótulo "ONE TEAM" com "Different
            perspectives. A shared purpose." Ali a foto é paisagem e ocupa dois
            terços; aqui ela é retrato, então as proporções invertem — a imagem
            fica na coluna mais estreita e o texto ganha ar. O objeto é o mesmo.

            A COPY É DELA, do mesmo mockup, e não nossa. Ela NÃO está no
            `CDNA_04_Team.docx`, que para o bloco 4 só diz "HOLD, slot 04" — ou
            seja, é conteúdo novo que apareceu no desenho. Fica anotado porque,
            se o cliente revisar o texto da página contra o Word, estas duas
            linhas não vão estar lá.

            ESCURO, e não o branco que o slot tinha. O branco existia porque um
            placeholder cinza sobre `ink` sumiria; com a foto dentro, a faixa
            escura é o que separa a liderança (branca) da faculty (`paper`) e é
            o que o mockup mostra. A foto traz o próprio branco para dentro.

            ⚠️ MESMA FOTO DA /about, em recorte diferente (lá vai em 4:5, aqui
            inteira em 2:3). O documento avisa que repetir a fotografia "is
            visible". Decisão consciente de 15-09 para não deixar os dois slots
            vazios; a segunda foto continua valendo a pena pedir. */}
        <section className="bg-ink text-white">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:gap-16 md:px-10 md:py-20">
            <div className="relative aspect-[3/2] w-full">
              <Image
                src={teamStanding}
                alt="Six members of the Corporate DNA team standing behind a counter in the London office"
                fill
                sizes="(min-width: 768px) 56vw, 100vw"
                className="object-cover object-center"
              />
            </div>
            <div>
              <TypeLabel onDark>One team</TypeLabel>
              <p className="font-serif text-[30px] font-semibold leading-[1.15] tracking-[-0.5px] text-white md:text-[40px]">
                Different perspectives.
                <br />A shared purpose.
              </p>
              {/* O FILETE VERMELHO FECHA O BLOCO, como no mockup — lá ele
                  aparece sob a frase, curto e à esquerda. É a mesma marca que o
                  `TypeLabel` traz em cima, repetida embaixo para emoldurar as
                  duas linhas. */}
              <span
                aria-hidden
                className="mt-7 block h-0.5 w-16 bg-brand"
              />
            </div>
          </div>
        </section>

        {/* ── Global faculty ───────────────────────────────────────────── */}
        {/* `ink` — a única cor de fundo não-clara que o projeto tem para uma
            seção. O `ink-2` existe, mas é um degrau de 8 pontos que só se nota
            lado a lado, e está reservado ao mapa escuro da home; e o vermelho
            como ÁREA foi desfeito de propósito em 10-09 ("o acento nunca vira
            área, só marca"), então trazê-lo de volta aqui desfaria aquilo.

            O QUE ELE RESOLVE ALÉM DA COR: a página vinha branco → branco →
            claro → cinza → cinza, cinco blocos sem uma virada. O escuro no meio
            dá espinha à rolagem e separa a liderança da DNA experience sem
            filete nenhum. */}
        {/* A IMAGEM DE FUNDO É DO CLIENTE, gerada e escolhida por ele em 11-09.
            Ela NÃO é o slot 06 do documento — aquele pede uma imagem POR REGIÃO
            atrás dos cinco quadros, e continua em aberto. Esta é a seção
            inteira ganhando fundo, o que é outra coisa e não ocupa o lugar
            daquilo: quando as cinco chegarem, elas entram nos quadros e este
            fundo continua onde está.

            `bg-ink` FICA NA SEÇÃO por baixo de tudo. É o que se vê enquanto o
            JPEG carrega e é para onde a seção volta se ele falhar — sem isso, o
            primeiro paint é texto branco sobre branco.

            DUAS CAMADAS DE ESCURECIMENTO, e as duas são necessárias por motivos
            diferentes. A uniforme (`ink/60`) segura o pior caso da foto, que são
            as luzes das cidades — laranja quase branco, bem embaixo da coluna
            de texto. A horizontal (`ink` → `ink/20`) faz o lado esquerdo, onde
            vivem o título e o parágrafo, ficar mais escuro que o direito, onde
            não há texto e a imagem pode aparecer. Medições no rodapé do bloco.

            `isolate` NÃO É ENFEITE: as camadas são `-z-10` para ficarem atrás do
            conteúdo, e sem um contexto de empilhamento próprio elas ficariam
            atrás do fundo da PÁGINA, o que na prática as apaga. */}
        {/* ⚠️ O GLOBO SAIU DAQUI EM 11-09 e foi para o bloco 6. Ele entrou nesta
            seção quando os cinco quadros eram só nome, e ali era o assunto
            visual do bloco. Quando eles ganharam fotografia a conta virou: seis
            imagens na mesma seção, e a de fundo passou a competir com as cinco
            que carregam a informação. Escurecê-lo resolvia pela metade — ele
            parava de disputar e também parava de somar.

            Onde ele está agora ganha as duas coisas: o bloco 6 é texto em
            cartões, não tinha imagem nenhuma, e o globo volta a ser o assunto.
            A seção aqui fica `ink` liso, e quem faz o trabalho visual é o
            mosaico — que é o que o documento pede que ele faça. */}
        <section id="faculty" className="bg-paper">
          <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
            {/* `onDark` troca o #d84339 pelo tom claro: o vermelho cheio mede
                2,87:1 sobre `ink` e reprova como texto. A conta está no
                componente. */}
            {/* ⚠️ A SEÇÃO FICOU CLARA EM 12-09, e é correção de ritmo, não de gosto.
                Quando o globo veio para cá ela virou `ink`; quando ele foi para
                o bloco 6 ela continuou escura, e a página passou a correr
                escuro por TRÊS seções seguidas — esta, a DNA experience e o
                mapa. Três massas escuras em fila não têm divisa entre si: o
                leitor perde onde um assunto acaba e o outro começa.

                `paper` E NÃO BRANCO: a liderança e o slot da foto de grupo,
                logo acima, já são brancos. Uma terceira seção branca colada
                nelas seria o mesmo problema invertido. O cinza é o degrau que
                o site usa entre blocos claros, e agora a página lê
                branco → cinza → escuro → escuro, com o par escuro fechando no
                mapa, que é onde ele sempre esteve.

                O MOSAICO NÃO MUDOU NADA. Os cartões trazem a própria foto e o
                próprio escurecimento, então os nomes seguem brancos sobre a
                imagem, medidos, independentes do fundo da seção. Foi por isso
                que a troca custou quatro linhas de cor e mais nada. */}
            <TypeLabel>Global faculty</TypeLabel>
            {/* A MESMA ESCALA, mas SEM o `mb-[52px]`: aqui o que vem depois do
                título é um parágrafo de corpo, não a grade. Na home o 52px
                existe para abrir o título dos cartões; entre título e texto
                corrido ele viraria um buraco. O respiro fica no `mt-6` do
                parágrafo, que já estava certo. */}
            {/* ⚠️ ERAM 75 ATÉ 17-09 — *"na seção 'Global faculty' trocar 75
                por 60+ - a faculty of 60+."* O número encolheu e GANHOU UM "+",
                que é a parte que importa: 75 era uma contagem exata de um
                documento sem data, e `60+` é um piso que não envelhece a cada
                entrada e saída de facilitador. O `36 countries` fica — ela não
                o mencionou aqui, e trocá-lo por conta própria colidiria com a
                faixa da About, que desde hoje conta por REGIÃO e não por país.
                ⏳ Alinhar as duas unidades é pergunta para a próxima daily. */}
            <h2 className="font-serif max-w-[720px] text-[28px] font-semibold leading-[1.1] tracking-[-0.5px] text-ink sm:text-[34px] md:text-[40px]">
              A faculty of 60+ senior practitioners across 36 countries.
            </h2>
            <p className="mt-6 max-w-[720px] font-serif text-[17px] leading-[1.7] text-muted md:text-[18px]">
              Our facilitators and coaches come from the behavioural sciences,
              organisation development, psychology and business. They span over twenty
              nationalities and a wide range of social identities. They are senior enough
              to have sat where our clients sit.
            </p>

            {/* ── A LISTA DE PESSOAS · 17-09 ────────────────────────────
                *"nessa mesma seção remove the countries cards and change for
                the people list"*, e a lista chegou no mesmo dia: a tabela do
                `2. Team/Facilitators for website.docx`, 23 nomes com foto e
                região. Ela está em `facultyMembers`, em `lib/team.ts`, com a
                procedência e as três pendências de conteúdo que sobraram.

                ⚠️ O QUE SAIU DAQUI ERAM CINCO CARTÕES DE REGIÃO — Americas, UK
                & Europe, GCC & Middle East, Asia, India —, cada um com a foto
                de uma cidade, dois escurecimentos medidos e um véu `brand` em
                `soft-light`. Foram refeitos em 11-09 sobre uma referência de
                cartão de destino e ajustados de novo em 12-09, quando a seção
                passou de escura para clara. Nada disso se perdeu: os cinco
                seguem em `facultyRegions` e o bloco inteiro está no git.

                E ELES ERAM UM PLACEHOLDER O TEMPO TODO — é o que torna a troca
                barata em vez de destrutiva. O slot 06 do `CDNA_04_Team.docx`
                pede, em letra, *"a representative selection or mosaic image per
                region… HOLD"*, e as cinco fotos que estavam ali vinham de
                `public/team/mock/`: Miami, Londres, Dubai, Singapura e Jaipur,
                imagens de CIDADE no lugar de imagens de GENTE. Numa seção
                chamada Global faculty, cinco fotos de skyline diziam onde a
                firma tem endereço, não quem entrega o trabalho. A lista de
                pessoas é o conteúdo que o slot esperava desde o começo.

                ⚠️ A REGIÃO NÃO SE PERDEU NA TROCA, e isso importa porque era o
                argumento inteiro dos cartões: ela virou a segunda linha de cada
                pessoa. Em vez de cinco quadros dizendo "atuamos na Ásia", são 23
                rostos dos quais quatro dizem "Asia Pacific" — a mesma afirmação,
                com nome e cara por trás.

                ⏳ GCC E ÍNDIA SUMIRAM DO MAPA DA SEÇÃO, e é consequência do
                dado, não do desenho: a tabela dela não traz ninguém na Índia, e
                o Oriente Médio aparece como "Middle East" em duas pessoas. Se a
                faculty da Índia existe e ficou de fora da planilha, é pergunta
                para a próxima daily. */}
            <div className="mt-12">
              <PeopleRoster people={facultyMembers} />
            </div>
          </div>
        </section>

        {/* ── Bloco 6 · The DNA experience ─────────────────────────────── */}
        {/* O CARTÃO DA "CLIENT IMPACT" DA HOME, a pedido em 11-09: três lado a
            lado, `border-line`, faixa `ink` no topo com o título e o corpo
            embaixo. As medidas vêm de lá inteiras — `gap-7` entre os cartões,
            26px de recuo lateral, 22px na faixa, 28px no corpo.

            O CONTEÚDO da seção continua o da home ("moved here from the
            homepage", copy FINAL): a frase do One DNA TEAM abre e os outros
            três strands têm título. O que muda é só o INVÓLUCRO.

            DUAS COISAS NÃO VIERAM, e ambas porque não existem aqui: o rótulo
            "Challenge" e o número da métrica. Um cartão de impacto existe para
            entregar o número; um strand é texto. Manter o filete vermelho e a
            área do número vazios deixaria o cartão parecendo quebrado.

            FUNDO `paper` COMO NA HOME, a pedido: cartão branco sobre cinza
            ganha o contraste que o branco sobre branco não dá, e a sombra tem
            onde aparecer.

            O FILETE QUE HAVIA AQUI SAIU. Ele existia porque a `#faculty` acima
            também era `paper` e as duas viravam um bloco cinza só; com ela em
            `ink`, a divisa é a própria virada de cor.

            ❓ EM ABERTO: o carrossel de 25 fotos candid que acompanha a seção na
            home. O outline move os strands e não diz uma palavra sobre ele —
            se vem junto, se fica lá, se some. Pergunta de meia linha para o
            cliente, não pendência de conteúdo. */}
        {/* ⚠️ ESTA SEÇÃO ERA CLARA (`bg-paper`) ATÉ 11-09. Recebeu o globo que
            estava na Global faculty, a pedido, e com ele veio a virada de tom: o
            rótulo passa a `onDark`, o título a branco.

            O QUE NÃO MUDOU, E É O PONTO: os cartões continuam brancos. Sobre a
            imagem eles leem como peças pousadas em cima dela, que é mais forte
            do que eram sobre o cinza — e não exigiu redesenhar nada, porque o
            cartão já era branco com faixa `ink` no topo. A sombra deles vira
            quase invisível no escuro; fica, porque ainda trabalha nas partes
            claras da foto.

            OS DOIS ESCURECIMENTOS SÃO OS MESMOS que a faculty usava, com os
            mesmos números — o plano de 75% para segurar as luzes das cidades, e
            o horizontal fechando em `ink/45`, que mantém a esquerda (onde o
            título mora) mais escura que a direita. */}
        <section className="relative isolate overflow-hidden bg-ink">
          <Image
            src="/team/dna-helix.jpg"
            alt=""
            fill
            sizes="100vw"
            /* ⚠️ A IMAGEM TROCOU EM 12-09: era o globo com a hélice por cima
               (`faculty-global-dna.jpg`, que entrou na Global faculty em 11-09 e
               migrou para cá), e virou a hélice sozinha sobre preto. A diferença
               que importa para o resto deste bloco é de LUMINÂNCIA: o globo
               tinha luzes de cidade quase brancas espalhadas na metade de baixo,
               e era isso que obrigava o escurecimento a trabalhar tanto. Esta é
               preta em quase toda a área, com o brilho concentrado na diagonal.

               ⚠️ O `brightness` SAIU COM O GLOBO. O filtro do herói é
               `saturate(.65) brightness(.68)`, e o segundo valor existe lá para
               uma foto de sala com luz tungstênio — e existia aqui para as luzes
               de cidade do globo. Sobre uma imagem que já é preta em 90% da área
               ele não domava nada: só apagava a hélice, que é a única coisa que
               a imagem tem para mostrar. O `saturate` FICA, e aí ele trabalha:
               tira o azul-frio da hélice e a deixa prata, que é o que a paleta
               desta página aceita sem introduzir uma cor nova.

               O `brightness` é a peça que se esquece ao copiar só o gradiente:
               no herói ele existe porque `multiply` escurecia por definição e,
               quando o duotone saiu, a foto ficou com um brilho que os
               escurecimentos laterais não previam. Aqui vale igual — é ele que
               deixa o gradiente trabalhar sobre uma base já assentada, em vez
               de sozinho contra a imagem cheia. */
            /* ⚠️ 70% NA VERTICAL, E O NÚMERO NÃO É ESTÉTICO SOZINHO — 12-09,
               pedido de subir a hélice. O eixo horizontal não tem folga aqui: a
               imagem escalada dá exatamente a largura do container, então
               `object-position` só age na vertical, e a conta é contraintuitiva
               — para a hélice SUBIR na tela, a janela de recorte tem de DESCER
               na origem, ou seja, a porcentagem aumenta.

               `bottom` (100%) foi testado e sobe demais: a hélice passa a cruzar
               o rótulo, que é o elemento que menos aguenta fundo claro. 70%
               deixa o brilho na faixa do título e acima dos cartões, com o
               rótulo ainda sobre preto e o terço de baixo limpo. */
            className="-z-10 object-cover object-[50%_20%] saturate-[.65]"
          />
          {/* ⚠️ ABERTO EM 12-09, a pedido: a imagem aparece mais. Os números
              vieram de 75% no plano e `ink/45` na ponta direita, que eram os da
              Global faculty — e lá eles existiam para segurar CINCO cartões e um
              texto longo por cima. Aqui por cima há três cartões brancos, que
              trazem o próprio fundo, e duas linhas de cabeçalho. Sobra imagem
              para mostrar.

              O que NÃO afrouxou foi a esquerda: o `from-ink` continua cheio, e é
              ele que sustenta o rótulo e o título. O que abriu foi o miolo e a
              direita — 55% no plano, e o horizontal indo a `ink/25` —, que é
              justamente onde não há texto. */}
          {/* ⚠️ O `from-25%` NÃO É ENFEITE DE SINTAXE, é o que salvou o rótulo.
              Abrir o fundo derrubou o "Global faculty"… quer dizer, o "The DNA
              experience": medido depois da abertura, o `brand-light` do rótulo
              caiu para 3,78:1, abaixo dos 4,5 que texto de 14px em caixa alta
              exige. O título passou folgado (7,5:1) porque é branco e grande —
              quem reprova é sempre o rótulo, que é pequeno e colorido.

              Segurar o degradê em `ink` cheio até os primeiros 25% da largura
              mantém escura exatamente a coluna onde o rótulo e o título vivem,
              e deixa os outros 75% abertos — que é onde a imagem aparece e onde
              não há texto nenhum. Fechar tudo de novo teria desfeito o pedido. */}
          {/* ⚠️ UM VÉU UNIFORME, E NÃO MAIS O GRADIENTE DO HERÓI. Pedido de
              12-09 ("deixar a opacidade mais uniforme… um pouco mais forte para
              não aparecer tanto o DNA e ofuscar os textos"), e é também a saída
              certa por medição.

              O QUE HAVIA AQUI, em ordem: os quatro pontos do herói; depois um
              platô de 18% à esquerda, porque o rótulo reprovava; depois os
              pontos da direita rebaixados, porque a hélice sumia; depois o platô
              esticado até 55%, porque o TÍTULO reprovava. Quatro ajustes para
              fazer uma curva horizontal servir a um bloco cujo texto atravessa
              a tela — e mesmo assim o pior pixel do título ficava em 2,80:1.

              A RAZÃO DE O GRADIENTE NÃO SERVIR AQUI é a diferença entre esta
              imagem e a do herói. Lá a foto é uniforme e o texto mora à
              esquerda, então escuro-à-esquerda-claro-à-direita casa com a
              composição. Aqui o assunto é uma DIAGONAL brilhante que cruza
              justamente a segunda linha do título, e nenhuma curva horizontal
              resolve um brilho que anda na diagonal: onde ela protege o texto,
              apaga a imagem; onde mostra a imagem, apaga o texto.

              Plano resolve os dois de uma vez e é o que foi pedido. 62% vem da
              conta: no estouro da hélice o fundo vale ~255, branco a 3,0:1 exige
              composto ≤149, e `255 − 205·alfa ≤ 149` dá alfa ≥ 0,52. 62% deixa
              margem e é onde a hélice ainda lê como assunto. */
          }
          <div aria-hidden className="absolute inset-0 -z-10 bg-ink/[0.62]" />
          <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
            <TypeLabel onDark>The DNA experience</TypeLabel>
            {/* A escala do h2 da Client impact, inteira — 28/34/40, peso 600,
                tracking -0,5px, `mb-[52px]` até os cartões. A serifa não é
                desvio: a home força `[&_h2]:font-serif` no wrapper, então o
                título de lá também é serifa. O que muda é a família (Source
                Serif 4 aqui, serif-v2 lá), e isso é a página, não a seção.

                Sem `mt`: o `TypeLabel` já traz `mb-5`, igual à home. */}
            <h2 className="font-serif mb-[52px] max-w-[720px] text-[28px] font-semibold leading-[1.1] tracking-[-0.5px] text-white sm:text-[34px] md:text-[40px]">
              {dnaLead}
            </h2>
            {/* A SOMBRA DOS CARTÕES É ADIÇÃO NOSSA — a home não tem. Dois
                planos: um contato curto de 2px, que assenta o cartão na
                superfície, e um difuso de 30px com raio negativo, que projeta
                sem borrar a borda. Alfas baixos (4% e 22%) e na cor `ink`, não
                em preto puro: sombra preta sobre `paper` esverdeia o cinza. */}
            {/* ⚠️ QUATRO COLUNAS DESDE 15-09, e não três: a vertente "One DNA
                TEAM" faltava — ver a caixa de `dnaStrands` em `lib/team.ts`.

                `md:grid-cols-2 lg:grid-cols-4` e não `md:grid-cols-4` direto: a
                1024 quatro cartões com o corpo longo das três vertentes antigas
                dariam ~215px de caixa, e o texto da Inclusion & Diversity (252
                caracteres) viraria uma tira de quinze linhas. Em duas colunas no
                tablet cada cartão tem ~450px, que é a medida em que ele lê. */}
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-4">
              {dnaStrands.map((s) => (
                <article
                  key={s.title}
                  className="flex flex-col border border-line bg-white shadow-[0_2px_4px_rgba(35,31,33,0.04),0_14px_30px_-18px_rgba(35,31,33,0.22)]"
                >
                  {/* ⏸️ O VERMELHO FOI TESTADO EM 12-09 E DESCARTADO no mesmo
                      dia — a faixa chegou a ser `bg-brand` e voltou a `ink` a
                      pedido. Fica registrado porque o teste tem um número útil:
                      branco sobre `brand` dá 4,39:1, o que PASSA para um título
                      de 20px semibold (mínimo 3,0). Ou seja, não foi o contraste
                      que reprovou, foi a composição — três faixas de vermelho
                      cheio sobre a foto puxavam mais atenção que o título da
                      seção, e a decisão de 10-09 sobre o acento não virar área
                      continua valendo. */
                  }
                  <div className="bg-ink px-[26px] py-[22px] text-white">
                    {/* Serifa, e não o sans da home. O cartão é o mesmo objeto;
                        a tipografia é a desta página, que é editorial de ponta
                        a ponta. Misturar os dois sistemas dentro de uma página
                        é o defeito que se vê. */}
                    <h3 className="font-serif text-[20px] font-semibold leading-[1.2] tracking-[-0.2px]">
                      {s.title}
                    </h3>
                  </div>
                  <div className="flex flex-1 flex-col px-[26px] py-7">
                    <p className="font-serif text-[16px] leading-[1.65] text-muted">
                      {s.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ⛔ O GLOBAL PRESENCE SAIU EM 14-09, pedido da Maliha na daily (item
            19 da transcrição): "remove the global presence from this page". Os
            escritórios ficam só no rodapé.

            O QUE SAIU: o `<div id="presence">` e o `LocationsBlock` que ele
            embrulhava (`tone="paper"`, `maxWidthClass="max-w-[1440px]"`,
            `typeLabel`, `align="center"`). A montagem inteira, com o porquê de
            cada prop e o histórico do `dark` → `paper` de 12-09, está no commit
            anterior a este — é copiar de volta se ela mudar de ideia.

            A ÂNCORA `#presence` MORRE JUNTO, e isso foi conferido antes de
            apagar: os quatro redirects legados do WordPress que chegam nesta
            página (`/our_team.html`, `/our_advisor.html`, `/our-advisors`,
            `/our-way/our-team-and-network`) apontam para `/team` SEM
            fragmento, e nem o `lib/nav.ts` nem nenhum link do site cita
            `#presence`. Quem chegar por um endereço velho com o fragmento cai
            no topo, que é o comportamento normal de âncora inexistente.

            O QUE FECHA A PÁGINA agora é a faixa de convite logo abaixo, que
            entrou em 15-09 e é `brand`. A DNA experience, que é `ink`, deixou de
            ser a última seção — e a sequência escuro → vermelho → rodapé branco
            é a mesma das dez páginas de serviço. */}

        {/* ── Bloco 7 · Let's talk ──────────────────────────────────────── */}
        {/* ⚠️ ESTA FAIXA FALTAVA, e a falta estava registrada desde 14-09: a
            análise do mockup no doc de correções (§4.1) lista, entre o que o
            desenho dela traz e a página não tem, "um CTA final ('LET'S TALK')".
            Só agora foi construída.

            ELA NÃO ESTÁ NO `CDNA_04_Team.docx`. O documento fecha a página em
            seis blocos e o sexto é a DNA experience — não há bloco 7 ali. Quem
            pede esta faixa é o MOCKUP, que termina exatamente assim: rótulo
            "LET'S TALK", "Ready to make leadership real?", uma linha de apoio e
            o botão "Get in touch" sobre um skyline.

            A COPY É DELA, do mockup, palavra por palavra. Mesma procedência do
            "Different perspectives. A shared purpose." do bloco 4 e da linha da
            vertente "One DNA TEAM" — e a mesma ressalva: quem conferir o texto
            desta página contra o Word não vai achar estas frases lá.

            ⚠️ SEM O SKYLINE DE FUNDO que o mockup mostra. O `SolutionCta` é
            `bg-brand` chapado, e é a faixa que as dez páginas de serviço usam.
            Pôr fotografia só nesta criaria duas faixas de convite diferentes no
            mesmo site por causa de um desenho — e o skyline que temos já é o
            herói da /about e da /services, então ele apareceria uma terceira
            vez. Se ela pedir a versão com foto, é prop nova no componente e vale
            para todas.

            É O MESMO COMPONENTE DAS PÁGINAS DE SERVIÇO, e o rótulo "Let's talk"
            já é o padrão dele — não precisou de prop. O que muda são as três
            partes escritas por ela. */}
        <SolutionCta
          strapline="Ready to make leadership real?"
          line="We partner with organisations to unlock real people, cultures and performance."
          ctaLabel="Get in touch"
        />
      </SiteShell>
    </div>
  );
}
