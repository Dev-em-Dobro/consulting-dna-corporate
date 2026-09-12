import type { Metadata } from "next";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import TypeLabel from "@/components/TypeLabel";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import LocationsBlock from "@/components/LocationsBlock";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
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
 * O QUE CONTINUA VINDO DE ANTES: as âncoras `#leadership`, `#faculty` e
 * `#presence`, que estão em redirects legados, e o mapa de escritórios.
 *
 * A ROTA MUDOU EM 11-09: `/our-team` → `/team`, a pedido. O endereço antigo
 * está no menu em produção e é destino de quatro redirects do WordPress, então
 * ele continua vivo por 308 em `next.config.mjs` — e os quatro legados passaram
 * a apontar direto para cá, sem escala.
 *
 * ⏳ O HOLD DA FOTO DE GRUPO VIROU SLOT VISÍVEL, decisão de 11-09 e uma REVERSÃO
 * da anterior. A primeira versão escondia o bloco sem foto, para que a página
 * lesse como completa. O problema é de quem está olhando: quem revisa esta
 * página é o próprio cliente, que escreveu os HOLD e sabe o que deve; esconder
 * o bloco tira dele justamente a decisão que a revisão existe para tomar — se o
 * layout funciona. O bloco 4 sai com placeholder, compondo como vai compor com
 * a foto dentro.
 *
 * O que isto NÃO é: cobrança. O placeholder é dimensionado e rotulado pelo que
 * vai receber, e não um aviso de pendência — o cliente não precisa de lembrete.
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
export default function OurTeamPage() {
  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell footerTopBorder floatingNav>
        {/* ⚠️ HERÓI SEM FOTO PRÓPRIA: cai na mesma imagem padrão das páginas de
            serviço. A foto certa aqui é a de grupo, que é HOLD — e que o
            documento diz estar reservada para a About, com a pergunta em aberto
            de se uma serve as duas páginas. Enquanto não se decide, dividir a
            padrão é melhor que um slot vazio na primeira tela. */}
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
                across"). São seis pessoas: duas fileiras cheias.

                Sem `mt`: o espaço até aqui é o `mb-[52px]` do h2, como na home.
                Eram 56px somados ao `mt-5` do título; a diferença de 4px não se
                vê, e o que se ganha é o mesmo ritmo nas três seções. */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {leaders.map((p) => (
                <article key={p.name}>
                  <div className="relative aspect-[4/5] overflow-hidden bg-paper">
                    {p.portrait ? (
                      <Image
                        src={p.portrait}
                        alt={`${p.name}, ${p.role}`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className={`object-cover ${p.portraitPosition ?? "object-center"}`}
                      />
                    ) : (
                      /* Sem retrato — iniciais, e não um avatar genérico de
                         silhueta: o card fica claramente à espera de uma foto
                         em vez de fingir ter uma. */
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="font-serif text-[44px] font-semibold text-line">
                          {p.name
                            .split(" ")
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-serif mt-6 text-[22px] font-semibold leading-[1.2] tracking-[-0.2px] text-ink">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-[13px] font-medium uppercase tracking-[1.3px] text-brand">
                    {p.role} · {p.region}
                  </p>
                  {/* A frase de cada pessoa fica NO CARD. É o conteúdo que o
                      documento marca como do bloco 2, e que o bloco 3 repete na
                      descrição — enquanto o bloco 3 não for conversado com o
                      cliente, ela sai uma vez só, aqui. */}
                  <blockquote className="mt-4 border-l-2 border-line pl-5 font-serif text-[16px] leading-[1.6] text-muted">
                    {p.quote}
                  </blockquote>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bloco 4 · Group photograph ───────────────────────────────── */}
        {/* SLOT CLARO, e não mais uma faixa escura: as duas faixas de citação
            logo acima já são `ink`, e uma terceira caixa escura em seguida
            empilharia três blocos da mesma cor. Sobre branco, a foto de grupo
            lê como o respiro entre a liderança e a faculty — que é a posição
            que o documento dá a ela.

            16:9 (4:3 no telefone) porque o que entra aqui é uma foto de seis
            pessoas lado a lado: em 21:9 as cabeças ficariam numa tira fina no
            meio do quadro. */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 pb-20 md:px-10 md:pb-24">
            <ImagePlaceholder
              label="Group photograph"
              className="aspect-[4/3] w-full sm:aspect-[16/9]"
            />
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
            src="/team/faculty-global-dna.jpg"
            alt=""
            fill
            sizes="100vw"
            className="-z-10 object-cover object-center"
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-ink/75" />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-ink/45"
          />
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
            <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
              {dnaStrands.map((s) => (
                <article
                  key={s.title}
                  className="flex flex-col border border-line bg-white shadow-[0_2px_4px_rgba(35,31,33,0.04),0_14px_30px_-18px_rgba(35,31,33,0.22)]"
                >
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

        {/* ── Global presence ──────────────────────────────────────────── */}
        {/* `max-w-[1440px]` PORQUE O BLOCO NASCEU EM 1200. Sem a prop, o
            cabeçalho dele centra numa coluna de 1200 dentro de uma página de
            1440 e abre 120px à direita de todas as outras seções — o rótulo
            começava em 160px enquanto "Leadership", "Global faculty" e "The DNA
            experience" começam em 40px. É a mesma correção que a home fez em
            10-09; a prop existe para isto e está documentada no componente.

            `typeLabel` porque o rótulo local é 13px/600/2px e os outros quatro
            desta página são o `TypeLabel` (14px/500/1,3px). De longe parecem o
            mesmo objeto; lado a lado, na mesma rolagem, não são.

            `tone="dark"` é a segunda seção escura da página, a pedido. Ele dá
            `ink-2` e não `ink` — 8 pontos mais escuro — e isso é do componente,
            não escolha daqui: a Global faculty logo acima é `ink`, e repetir o
            mesmo tom com um bloco claro no meio faria as duas massas escuras
            rimarem. O mesmo motivo que a home tem.

            NÃO PRECISA DE FILETE. O bloco 6 acima é `paper`; claro contra
            escuro já é a divisa.

            `align="center"` A TESTE, 11-09. O corpo deste bloco sempre foi
            centrado — mapa de 560px com `mx-auto`, régua de cidades, carrossel
            e endereço todos na mesma coluna e com `text-center`. Só o cabeçalho
            corria à esquerda na largura de 1440, e com o mapa pequeno a
            distância entre os dois eixos é o que se via. O `maxWidthClass`
            continua em 1440 porque é ele que centra a caixa na página inteira;
            o que mudou é o conteúdo dentro dela. */}
        <div id="presence">
          <LocationsBlock
            tone="dark"
            maxWidthClass="max-w-[1440px]"
            typeLabel
            align="center"
          />
        </div>
      </SiteShell>
    </div>
  );
}
