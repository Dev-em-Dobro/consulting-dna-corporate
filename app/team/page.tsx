import type { Metadata } from "next";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import SolutionCta from "@/components/solutions/SolutionCta";
import TypeLabel from "@/components/TypeLabel";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import LeaderCard from "@/components/team/LeaderCard";
import teamStairs from "@/public/team/team-stairs.jpg";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { getPeople } from "@/lib/cms/map";
import { leaders, facultyRegions, dnaLead, dnaStrands } from "@/lib/team";

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
        {/* ⚠️ HERÓI SEM FOTO PRÓPRIA: cai na mesma imagem padrão das páginas de
            serviço. Dividir a padrão continua sendo melhor que um slot vazio na
            primeira tela.

            E NÃO, A FOTO DA ESCADA NÃO SERVE AQUI. Ela já roda duas vezes no
            site desde 15-09 (bloco 4 abaixo e a /about); uma terceira aparição,
            na primeira dobra desta mesma página, é a repetição que o
            `CDNA_04_Team.docx` chama de "visible". O herói próprio continua na
            lista de imagens pendente com a Maliha — ela avisou na call de 14-09
            que cada página precisa de hero E de fundo. */}
        {/* SEM O DUOTONE, a pedido em 11-09: cinza como na home. Esta página foi
            a primeira, e passava `tint="none"` com o filtro da home escrito aqui.
            As páginas de serviço pediram o mesmo no mesmo dia, e aí os dois
            valores viraram o PADRÃO do `SolutionHero` — o raciocínio inteiro
            (por que `none`, por que o `brightness` não é enfeite) mora agora nas
            props de lá. Repetir aqui só criaria dois lugares para ajustar. */}
        <SolutionHero
          eyebrow="Our Team"
          title="The people who sit where our clients sit."
          subtitle="A senior leadership team, backed by a global faculty of 75 practitioners delivering across 36 countries."
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

                ⚠️ O `lg:grid-cols-3` VIROU `min-[1440px]:`. Cada card agora se
                parte em retrato + cartão de quote (item 16), e essa partição
                precisa de ≈432px de coluna para a serifa não quebrar em quatro
                palavras por linha. A 1024 a coluna tem 293px. Abaixo de 1440 a
                página segue em duas colunas com o card empilhado, que é o
                desenho anterior — a conta inteira está no `LeaderCard`.

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
                soltas. Mora no `LeaderCard`, que é quem desenha o par. */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 min-[1440px]:grid-cols-3">
              {leaders.map((p) => (
                <LeaderCard
                  key={p.name}
                  person={p}
                  profile={profileFor(p.cmsSlug)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Bloco 4 · Group photograph ───────────────────────────────── */}
        {/* ✅ A FOTO CHEGOU EM 15-09 — o time sentado na escada, que a própria
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
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-16 md:px-10 md:py-20">
            <div className="relative aspect-[2/3] w-full">
              <Image
                src={teamStairs}
                alt="The Corporate DNA team on the office stairs"
                fill
                sizes="(min-width: 768px) 38vw, 100vw"
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
            <h2 className="font-serif max-w-[720px] text-[28px] font-semibold leading-[1.1] tracking-[-0.5px] text-ink sm:text-[34px] md:text-[40px]">
              A faculty of 75 senior practitioners across 36 countries.
            </h2>
            <p className="mt-6 max-w-[720px] font-serif text-[17px] leading-[1.7] text-muted md:text-[18px]">
              Our facilitators and coaches come from the behavioural sciences,
              organisation development, psychology and business. They span over twenty
              nationalities and a wide range of social identities. They are senior enough
              to have sat where our clients sit.
            </p>

            {/* As cinco regiões da About. O mosaico de imagens é HOLD: sem
                fotografia, os nomes sozinhos, bem compostos, dizem a mesma coisa
                sem anunciar o que falta.

                NO ESCURO A GRADE INVERTE: os quadros passam a ser do tom do
                fundo e quem desenha a grade são os vãos de 1px, agora em
                `white/15`. Manter os quadros brancos sobre `ink` faria cinco
                blocos de contraste máximo, que puxariam mais atenção que o
                título da seção — e eles são um índice de regiões, não a
                mensagem. */}
            {/* ⚠️ O ÚLTIMO QUADRO ATRAVESSA AS DUAS COLUNAS NO TELEFONE, e isto
                é correção de um defeito que só o fundo escuro revelou. São
                CINCO regiões numa grade de DUAS colunas: a quinta deixa meia
                célula vazia. Enquanto o fundo era claro ninguém via — o vão
                mostrava `bg-line`, quase da cor dos quadros brancos. No escuro
                ele mostra `white/15` sobre `ink`, e vira um retângulo cinza
                claro pendurado ao lado de "India", que lê como quadro que
                faltou carregar. */}
            {/* ── O MOSAICO ──────────────────────────────────────────────
                CARTÕES, E NÃO MAIS UMA GRADE DE FILETES. Refeito em 11-09 sobre
                uma referência que o Ricardo trouxe (cartões de destino: foto
                sangrando, cantos arredondados, nome sobre um escurecimento na
                base). O que ela resolve aqui é real: a versão anterior tinha a
                imagem em cima e o nome numa barra separada embaixo, dois
                retângulos por região. Com o nome DENTRO da foto, cada região
                vira uma peça só — que é o que "mosaic" quer dizer.

                O QUE DA REFERÊNCIA NÃO VEIO, e nenhum dos três é de gosto:
                  • O DEGRADÊ COLORIDO POR CARTÃO (verde num, roxo no outro).
                    É uma cor tirada de cada foto. Aqui o acento é um vermelho
                    só, e existe decisão de 10-09 de que ele nunca vira área, só
                    marca. Cinco tons novos desfariam isso de uma vez.
                  • A LINHA DE NÚMEROS ("1.345 Hotels · 24 Packages"). Não há
                    dado por região em lugar nenhum: o documento dá 75 e 36 no
                    total, e reparti-los seria número inventado numa página de
                    prova.
                  • O "EXPLORE NOW →". Não há para onde ir. As cinco regiões da
                    faculty não têm página; as de `/services/regions` são outra
                    taxonomia (cidades de escritório). Um call to action que não
                    leva a lugar nenhum é pior que nenhum.

                SEM `col-span` NO ÚLTIMO, e isso some junto com os filetes. Ele
                existia porque a quinta região deixava meia célula vazia e o
                `bg-white/15` do pai aparecia ali como um retângulo pendurado.
                Com cartões separados por vão, não há fundo de grade para vazar:
                a célula que sobra simplesmente não existe. */}
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-5">
              {facultyRegions.map((region) => (
                <div
                  key={region.name}
                  className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white"
                >
                  {/* ── SLOT 06 ────────────────────────────────────────────
                      O documento pede, em letra: *"Type: regional mosaic
                      beneath, five tiles matching the About page regions… HOLD
                      A representative selection or mosaic image per region.
                      Slot 06."* HOLD é "content still needed" na convenção dele.

                      4:5 AGORA, E NÃO 4:3. Com o nome dentro do cartão, a foto
                      precisa de altura para ter onde o nome cair sem cobrir o
                      assunto — é a proporção da referência, e a mesma dos
                      retratos da liderança logo acima, o que faz as duas grades
                      da página rimarem. */}
                  {region.image ? (
                    <Image
                      src={region.image}
                      alt={`Corporate DNA faculty — ${region.name}`}
                      fill
                      sizes="(min-width: 768px) 20vw, 50vw"
                      className="object-cover object-center"
                    />
                  ) : (
                    <ImagePlaceholder
                      /* `light` desde 12-09, junto com a seção: o slot vazio
                         agora mora sobre `paper`, e o tom escuro do placeholder
                         foi calibrado para viver sobre `ink`. */
                      tone="light"
                      label="Faculty image"
                      className="absolute inset-0 h-full w-full rounded-2xl"
                    />
                  )}

                  {/* ⚠️ OS DOIS ESCURECIMENTOS SÓ EXISTEM COM FOTO, desde
                      12-09. Eles corriam sempre, e enquanto a seção era escura
                      ninguém via o efeito no estado vazio. Com ela clara ficou
                      evidente: sem imagem por baixo, o preto e o vermelho não
                      tinham o que escurecer e simplesmente sujavam o
                      placeholder — cada cartão desbotava de cinza-claro no topo
                      para um marrom no pé, e o rótulo "Faculty image" ficava no
                      meio da lama. Um slot tem de ler como slot.

                      É o mesmo princípio do botão de compra em `BookCard`: o que
                      existe para servir a um conteúdo ausente não fica
                      desenhado à espera dele. */}
                  {region.image && (
                    <>
                      {/* VÉU LEVE SOBRE O CARTÃO INTEIRO, pedido de 12-09 e
                          também da referência: lá a cor cobre a foto toda, não
                          só o pé, e é isso que faz os cartões lerem como um
                          conjunto em vez de cinco fotografias cruas lado a lado.

                          PLANO, e não mais um degradê: os dois que já existem
                          aqui têm direção (o preto sobe do pé, o vermelho
                          atravessa); um terceiro com direção brigaria com eles.
                          O que faltava era exatamente o que não tem direção —
                          uma camada uniforme que baixa a foto inteira um degrau.

                          22% É LEVE DE PROPÓSITO. O trabalho pesado de
                          legibilidade é do preto embaixo, que está medido; este
                          véu é de composição, não de contraste. Passar de ~30%
                          começa a apagar o assunto das fotos, que é o que os
                          cinco cartões existem para mostrar. */}
                      <div aria-hidden className="absolute inset-0 bg-ink/[0.22]" />
                  {/* O ESCURECIMENTO É NEUTRO E SEMPRE EXISTE, inclusive por
                          cima do placeholder. Duas razões: o nome precisa de fundo
                          medido, e a foto que vai entrar é desconhecida — clara ou
                          escura, o degradê é o que garante que o nome continue
                          legível sem ter de ajustar cinco vezes quando as imagens
                          chegarem. `to-transparent` no topo deixa dois terços da
                          foto respirarem. */}
                      {/* ALONGADO PARA 3/5 COM RAMPA MAIS SUAVE, 11-09, depois de
                          ver a grade preenchida. A 1/2 com `via-ink/70` o
                          escurecimento subia rápido demais e nas fotos claras — céu
                          de Singapura, fachada rosa de Jaipur — a passagem lia como
                          uma faixa colada por cima da imagem, e não como sombra.
                          Mais longo e mais leve no meio, o mesmo preto chega ao
                          mesmo lugar sem anunciar onde começou. */}
                      <div
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-ink via-ink/55 to-transparent"
                      />
                      {/* A COR DA REFERÊNCIA, por cima do neutro e não no lugar
                          dele. Na referência cada cartão tem um degradê colorido no
                          pé, e é ele que faz a grade parecer desenhada em vez de
                          cinco fotos escurecidas iguais.

                          A ORDEM DAS DUAS CAMADAS É O PONTO. O preto embaixo é
                          quem entrega o contraste do nome, e está medido; a cor vem
                          depois, fraca, só tingindo. Se fosse a cor a segurar a
                          legibilidade, o nome passaria a depender de quanto tom tem
                          naquele pedaço da foto, e cada imagem nova exigiria medir
                          de novo.

                          `mix-blend-soft-light` E NÃO CAMADA CHAPADA: chapado sobre
                          foto escura vira véu leitoso e apaga o assunto; soft light
                          mantém a luminância da imagem e desloca só o matiz. É o
                          mesmo raciocínio do `multiply` do herói, um degrau mais
                          suave porque aqui a área é pequena e repetida cinco vezes.

                          ⏳ UMA COR SÓ HOJE (`brand`), e não cinco. O site tem um
                          acento, e existe decisão de 10-09 de que ele não vira área.
                          Cinco cores tiradas das fotos é o que a referência faz e é
                          possível numa linha — o campo `tint` já está em
                          `FacultyRegion` para isso. Mas isso é decisão de paleta,
                          não de implementação, e é do cliente. */}
                      <div
                        aria-hidden
                        className="absolute inset-0 mix-blend-soft-light"
                        style={{
                          backgroundImage:
                            region.tint ??
                            /* A IMAGEM INTEIRA, e não só o pé — pedido de 11-09, e é
                               o que a referência faz: o tom atravessa o cartão e vai
                               sumindo para cima, em vez de terminar numa faixa.

                               E MAIS FRACO: a primeira versão usava o `brand` cheio
                               e o pé dos cinco cartões ficava vermelho de verdade,
                               que é a área que a decisão de 10-09 evita. Aqui ele
                               entra a 52% embaixo, cai para 20% no meio e chega a
                               zero no topo — tinge sem tomar conta.

                               Os três pontos são do MESMO vermelho (#d84339, o
                               `brand`) em alfas diferentes, e não três cores: o que
                               varia é quanto dele há, não qual é. */
                            "linear-gradient(to top, rgba(216,67,57,.52) 0%, rgba(216,67,57,.20) 45%, rgba(216,67,57,0) 100%)",
                        }}
                      />
                    </>
                  )}

                  {/* ⚠️ O NOME TROCA DE COR COM O ESTADO, e isto é o conserto
                      de um defeito que só apareceu quando a seção ficou clara em
                      12-09. Branco é a cor certa SOBRE A FOTO, com os dois
                      escurecimentos por baixo. Sem foto, os escurecimentos não
                      existem (ver acima) e branco cairia sobre um placeholder
                      claro — invisível. */}
                  <span
                    className={`absolute inset-x-0 bottom-0 p-5 font-serif text-[18px] font-semibold leading-[1.2] ${
                      region.image ? "text-white" : "text-ink"
                    }`}
                  >
                    {region.name}
                  </span>
                </div>
              ))}
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
