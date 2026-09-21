import SolutionHero from "@/components/solutions/SolutionHero";
import SolutionSection from "@/components/solutions/SolutionSection";
import SolutionAudiences from "@/components/solutions/SolutionAudiences";
import SolutionPillars from "@/components/solutions/SolutionPillars";
import SolutionClosing from "@/components/solutions/SolutionClosing";
import SolutionEvidence from "@/components/solutions/SolutionEvidence";
import SolutionCta from "@/components/solutions/SolutionCta";
import Reveal from "@/components/Reveal";
import ServiceCard from "@/components/solutions/ServiceCard";
import { headlineOr, paragraphs, services, type Service } from "@/lib/services";

/**
 * O template de página de serviço — "one template, ten instances".
 *
 * A ORDEM É A DO MOCKUP DELA, e hoje é esta:
 *
 *   1. Hero            — nome, banner statement, imagem
 *   2. What we do      — manchete, fio, corpo        (era "Impact")
 *   3. Cartões de público — a quem o serviço se destina        ⬅ novo, 21-09
 *   4. How we work     — manchete, fio, corpo        (era "How we help")
 *   5. Fileira de ícones — os termos da frase acima, divididos por filetes
 *   6. Fecho centrado  — a assinatura de duas linhas            ⬅ novo, 21-09
 *   ── daqui para baixo o desenho acaba ────────────────────────────────────
 *   7. Evidence        — o caso-carro-chefe, seus números e a citação
 *   8. Let's talk      — o convite, POR SERVIÇO
 *   9. Related services — quatro cards, do template de 15-09
 *
 * ============================================================================
 * ⚠️ O RE-LAYOUT DE 21-09, E ONDE ELE PARA
 * ============================================================================
 *
 * Pedido por email: *"Services internal — Re-layout the internal with the image
 * nova-pagina-interna-servicoes.jpg inside meetings folder"*. A imagem está em
 * `docs/meetings/` e desenha UM dos dez serviços — o Senior Leadership
 * Development, que até 21-09 se chamava Top 150.
 *
 * ⚠️ O DESENHO TERMINA NO FECHO CENTRADO. O mockup vai do herói até "Different
 * organisations. Different transformations. / Leadership that makes it happen."
 * e acaba ali: evidência, convite e "Related services" NÃO APARECEM nele. Os
 * três continuam na página porque saíram de pedidos anteriores que ninguém
 * desfez — mas ficam formalmente SEM REFERÊNCIA VISUAL, e é assim que devem ser
 * apresentados na revisão, em vez de passarem por aprovados junto com o resto.
 *
 * ⚠️ FALTA A SEGUNDA IMAGEM. A anotação da daily diz *"mudar o layout para as
 * imagens que a maliha mandou no drive; são duas imagens diferentes"*, e só uma
 * chegou ao repositório — a pasta `docs/meetings/MALIHA-ATUALIZACA0-15-09` está
 * vazia. É plausível que a segunda desenhe justamente o pé da página, mas isso
 * é palpite: nada aqui foi construído em cima dele.
 *
 * ⏳ O CONTEÚDO NOVO EXISTE EM UM SERVIÇO SÓ. Os cartões de público, o fecho e a
 * copy de "What we do"/"How we work" estão escritos em letra no mockup, e
 * portanto só valem para o serviço que ele desenha. Nos outros nove: os dois
 * blocos de duas colunas caem na copy do `CDNA_03_Services.docx` que já tinham
 * (mudou o rótulo em cima, não o texto), e os dois blocos novos simplesmente não
 * renderizam. As guardas estão em cada componente; a contagem do que falta pedir
 * está em `lib/services.ts`.
 *
 * ⚠️ O CONVITE VOLTOU PARA O FIM EM 16-09, E ISSO DESFAZ UM PEDIDO DELA DE
 * 15-09 — leia isto antes de "corrigir" a ordem de volta. Em 15-09 ela pediu o
 * convite ANTES da evidência, e a leitura virou "o que muda / como fazemos /
 * vamos conversar", com o caso e a citação como prova para quem não fechou ali.
 * O template que ela mesma mandou (`4. Services/ExCo Leadership Services
 * Page.png`) fecha com evidência → CTA, e a decisão da call de 16-09 foi seguir
 * o template. Ou seja: a ata de 15-09 continua dizendo o contrário desta ordem,
 * de propósito — quem a ler daqui a um mês não está diante de uma regressão,
 * está diante de uma decisão posterior. A NOSSA, de 16-09, contra o pedido dela
 * de 15-09 e a favor do desenho dela de 15-09.
 *
 * O QUE A VOLTA FAZ COM A LEITURA: o convite é de novo o fim da página, e chega
 * depois da prova em vez de antes dela — "o que muda / como fazemos / deu certo
 * aqui / vamos conversar". A faixa vermelha volta a ser o clímax de cor — e
 * passou a ser o ÚNICO campo de cor cheia da página depois que a evidência
 * ficou branca, em 16-09, o que só reforça o papel dela ali.
 *
 * ⚠️ O BLOCO 6 DO OUTLINE (Testimonial) DEIXOU DE SER SEÇÃO EM 16-09: a citação
 * virou a terceira coluna da faixa de evidência, ao lado da prova a que se
 * refere, como no template dela. O porquê está na caixa da prop `testimonial`
 * em `SolutionEvidence`.
 *
 * Os dois rótulos encurtaram em 15-09, seguindo os cabeçalhos da planilha dela
 * ("IMPACT OF THE WORK", "WHAT CDNA DOES TO HELP") — e em 21-09 trocaram de vez
 * para "What we do" e "How we work", que é o que o mockup novo escreve. A caixa
 * logo acima dos dois `SolutionSection`, mais abaixo neste arquivo, guarda o
 * porquê e o que a troca custou em coerência de rótulo nos outros nove.
 *
 * O CONTEÚDO VEM DE `lib/services.ts`, não do CMS — o porquê está na caixa de
 * abertura daquele arquivo. Aqui isso aparece em duas coisas: os blocos de
 * evidência e de convite finalmente têm dado (a strapline e a linha do CTA não
 * existiam no CMS, e essa faixa vinha mostrando o texto padrão), e "The
 * Challenge" some. (A numeração acima mudou com a ordem; por isso a referência
 * aqui é pelo nome do bloco, não pelo número.)
 *
 * ⚠️ "THE CHALLENGE" SAIU. O template de cinco blocos do brief de 27-08 abria com
 * ele; o de 09-09 não tem esse bloco — o herói passou a carregar a "banner
 * statement", e é ela que ocupa aquele lugar.
 */
export default function SolutionView({ service }: { service: Service }) {
  return (
    <>
      <SolutionHero
        /* "Our Services", e não "Our Solutions": o menu acertado com o cliente
           em 08-09 chama a área de Services, e o índice abre com o mesmo rótulo.
           A rota segue `/solutions` de propósito — ver a caixa em `lib/nav.ts`
           sobre por que os caminhos não foram renomeados atrás dos rótulos. */
        eyebrow="Our Services"
        title={service.title}
        /* ⚠️ A LINHA DE APOIO DO MOCKUP DE 21-09 NÃO É ESTA, e ficamos com esta
           de propósito. O desenho escreve *"For the leaders who shape what comes
           next."*; aqui sai a `banner`, que é *"Build enterprise leaders who lead
           beyond their function and geography into collective leadership at
           scale."* — a banner statement que o `CDNA_03_Services.docx` e o
           `WEBSITE SERVICE COPY.xlsx` marcam como FINAL.

           É a mesma régua que o `ServiceCard` já aplica ao card do índice, pela
           mesma razão: frase escrita em mockup sem fonte em documento nenhum é
           reescrita solta, e trocar a copy final por ela seria decidir copy no
           lugar da cliente. As três frases NOVAS que entraram deste mockup (os
           cartões de público, o fecho e o corpo dos dois blocos) passaram porque
           não existia copy anterior para aquelas peças — aqui existe, e ela é
           final. Se ela quiser a do desenho, é uma linha em `lib/services.ts`.

           ⚠️ O HERÓI É O ÚNICO PONTO EM QUE A PÁGINA DIVERGE DO MOCKUP EM
           PALAVRAS. Convém dizer isso na revisão antes que ela note sozinha. */
        subtitle={service.banner}
        /* A MESMA FOTO DO CARD DA LISTAGEM, pedida em 17-09. Até aqui as dez
           páginas de dentro dividiam a `service-hero-fallback.jpg` — uma foto
           só, repetida —, e a listagem já mostrava a imagem própria de cada
           serviço (as dela, desde 17-09). Eram duas identidades visuais para a
           mesma coisa: o leitor clicava num card e chegava a um herói que não
           tinha relação com o que ele acabou de ver. Agora o card é a miniatura
           do herói, e a transição entre as duas telas é contínua.

           ⚠️ O FALLBACK CONTINUA VIVO, e não por acaso: `cardImage` é opcional
           e quem não tem cai na foto padrão, exatamente como o card cai no campo
           de cor. Hoje os dez têm arquivo.

           ⏳ AS DELA SÃO 1400×875, e isso aparece num herói de sangria total:
           num laptop de 1440 com tela retina o navegador estica a fonte para uns
           2880px e a foto fica macia — o `service-hero-fallback.jpg` tinha 3672px
           de largura e era por isso que aguentava. Sai no dia em que ela mandar
           os originais: é trocar os arquivos em `public/services/cards/`, o
           caminho não muda. ⚠️ TROCAR O NOME JUNTO — o otimizador do Next serve
           por URL e já entregou versão velha por causa disso.

           ⚠️ O RECORTE FOI FEITO PARA 16:10, e o herói é `84svh` de largura
           cheia: no telefone, que é retrato, o `object-center` come as laterais
           da foto. Se um serviço específico pedir outra âncora, `imagePosition`
           existe no `SolutionHero` para isso — é uma prop por página, não uma
           mudança no componente. */
        imageUrl={service.cardImage}
      />

      {/* SEM IMAGEM NOS DOIS BLOCOS, e isto é a decisão de 12-09 — não um slot
          esperando arquivo. O painel é um CAMPO DE COR com o nome do bloco em
          corpo grande.

          COMO SE CHEGOU AQUI. Uma ilustração gerada chegou a entrar nos dois
          (a hélice sobre a Terra, em recortes diferentes), e antes dela havia
          fotografia de evento. Postas cinco direções lado a lado, esta foi a
          escolhida, e o argumento é o mais simples de todos: é a única que não
          pode ficar brega, não depende de arquivo que ainda não existe, e é
          DIFERENTE em cada uma das dez páginas de graça — porque o que preenche
          o campo é o nome do bloco, não uma imagem repetida.

          O QUE ISSO FECHA: a armadilha que voltou três vezes neste arquivo. Foto
          de cliente insinua relação que ela não prova; foto genérica repetida
          nas dez lê como falta de material; ilustração gerada resolve os dois e
          cria um terceiro, que é datar. Campo de cor com tipografia não tem
          nenhum dos três.

          ⚠️ O `image` CONTINUA SENDO PROP e o layout já sabe recebê-lo. No dia
          em que houver fotografia POR SERVIÇO — com campo de mídia por bloco no
          CMS, que é a nossa parte — é passar a imagem e o painel troca de
          conteúdo sem mudar de medida. Ver `docs/mensagem-grupo-fotos-servicos-
          11-09.ENVIAR.txt`, onde isso foi pedido ao cliente como sugestão de
          desenho e não como pendência de lançamento. */}
      {/* ── Blocos 1 e 2 · What we do e How we work ────────────────────
          ⚠️ REFEITOS EM 17-09 no arranjo do template dela (`4. Services/ExCo
          Leadership Services Page.png`): rótulo em cima, MANCHETE à esquerda,
          fio vertical, CORPO à direita. O desenho e o que foi deixado de fora
          estão no cabeçalho do `SolutionSection`; aqui fica só o que é decisão
          DESTA página.

          ⚠️ O ARRANJO SOBREVIVEU AO RE-LAYOUT DE 21-09 — o mockup novo desenha a
          mesma caixa de duas colunas —, mas OS RÓTULOS TROCARAM: "Impact" virou
          "What we do" e "How we help" virou "How we work", que é o que o
          desenho escreve.

          A HISTÓRIA DOS NOMES, porque ela já foi longa e não se apaga: os
          rótulos curtos "Impact" e "How we help" eram pedido DELA, de 15-09,
          contra o template do mesmo dia que dizia "THE OUTCOME" e "HOW
          CORPORATEDNA HELPS"; a regra aplicada então foi "instrução ganha de
          desenho". Em 21-09 o pedido POR ESCRITO é o próprio desenho — *"re-
          layout the internal with the image"* —, então desta vez os dois
          apontam para o mesmo lado e não há conflito para arbitrar.

          ⚠️ "IMPACT" NÃO FOI SÓ RENOMEADO, ele MUDOU DE ASSUNTO no serviço que o
          mockup desenha. Lá o bloco fala de com quem a CDNA trabalha e de como a
          jornada é desenhada — não do que muda no negócio. Por isso a copy nova
          entrou como campo próprio (`whatWeDo`) em vez de sobrescrever o
          `outcome`: nos outros nove o `outcome` continua sendo o corpo deste
          bloco, agora sob um rótulo que não o descreve bem. É dívida de
          CONTEÚDO, está anotada na caixa de `whatWeDo` em `lib/services.ts`, e
          o conserto é a cliente escrever o "what we do" dos outros nove.

          ⏳ A MANCHETE NÃO EXISTIA NO NOSSO DADO. O documento de Services dá o
          CORPO dos dois blocos (`outcome`, `howWeHelp`) e nada mais; a frase
          grande da esquerda é um campo novo. Só o Senior Leadership Development
          tem as duas de verdade, porque os dois mockups desenham justamente ele
          e as escrevem em letra. Nos outros nove entra o placeholder —
          `headlineOr` e a caixa do `HEADLINE_PLACEHOLDER`, em `lib/services.ts`,
          contam quantas faltam.

          O QUE SUMIU COM A REESCRITA, e por que não se procura mais por isso
          neste arquivo: os dois blocos eram faixas de meia tela com um CAMPO DE
          COR de 44% (`brand` no Impact, `ink` no How we help), e havia uma regra
          inteira sobre qual painel podia ser qual — nenhum podia antecipar a cor
          da faixa seguinte, e a distribuição foi reavaliada duas vezes (15-09 e
          16-09) conforme o CTA subia e descia na página. Sem painéis, a regra
          não tem sobre o que decidir. Está tudo no git.

          A SEQUÊNCIA DE FUNDOS DE HOJE: herói `ink` → branco (What we do +
          cartões) → paper (How we work + ícones) → branco (fecho) → `ink`
          (evidência) → `brand` (CTA) → branco (related). Os pares que dividem
          faixa — bloco + cartões, bloco + ícones — não têm emenda entre si, que
          é exatamente o que o mockup de 21-09 mostra, e os três primeiros
          degraus foram CONFERIDOS PIXEL A PIXEL no arquivo (#fefefe até o pé dos
          cartões, #f7f3f0 dali até o fim dos ícones, branco de novo no fecho).

          ⚠️ A CAIXA ANTERIOR DESCREVIA A EVIDÊNCIA COMO `paper` E ELA ESTÁ
          `ink` DESDE 18-09 (`SolutionEvidence`, linha do `<section>`). O erro
          era de registro, não de tela, e ficou três dias. Corrigido aqui em
          21-09 — quem for conferir a sequência de fundos confere no componente,
          não nesta lista.

          ✅ E COM ISSO O FECHO GANHOU UMA SEGUNDA FUNÇÃO: ele é branco e cai
          entre a faixa papel dos ícones e a faixa `ink` da evidência, de modo
          que a página passa a alternar claro/escuro em vez de saltar de papel
          para tinta. Não foi por isso que ele entrou — entrou porque o mockup o
          desenha —, mas é o que se perde se alguém o remover por achá-lo
          redundante com o CTA.

          A altura do CTA encolheu em 18-09, e SÓ nesta página: é a prop
          `compact` do `SolutionCta`, passada logo abaixo. */}
      {/* ⚠️ O `??` É A GUARDA DOS OUTROS NOVE, e é ele que faz este re-layout
          caber num serviço só sem apagar os outros: quem tem a copy nova do
          mockup mostra a copy nova; quem não tem continua mostrando a do
          `CDNA_03_Services.docx`, que nunca deixou de ser publicável. Ver as
          caixas de `whatWeDo` e `howWeWork` em `lib/services.ts`. */}
      <SolutionSection
        label="What we do"
        headline={headlineOr(service.whatWeDoHeadline ?? service.outcomeHeadline)}
        html={paragraphs(service.whatWeDo ?? service.outcome)}
        tone="white"
      />

      {/* ⬅ NOVO EM 21-09. Divide a faixa BRANCA com o bloco acima, sem emenda —
          no mockup os três cartões pertencem visivelmente ao "What we do". Nos
          nove serviços sem `audiences` isto não renderiza e a página segue
          direto do primeiro bloco para o segundo, como antes. */}
      <SolutionAudiences items={service.audiences} />

      <SolutionSection
        label="How we work"
        headline={headlineOr(service.howWeWorkHeadline ?? service.howWeHelpHeadline)}
        html={paragraphs(service.howWeWork ?? service.howWeHelp)}
        tone="paper"
        /* ⚠️ `body` SÓ AQUI. No mockup o fio deste bloco cai a 38% da largura e
           o do bloco de cima cai quase no meio — medido no arquivo, ver a caixa
           da prop `split` em `SolutionSection`. A manchete daqui tem duas linhas
           e a de cima tem três; a divisão acompanha o conteúdo. */
        split="body"
      />

      <SolutionPillars items={service.pillars} />

      {/* ⬅ NOVO EM 21-09, e é ONDE O DESENHO DELA TERMINA. Tudo o que vem depois
          — evidência, convite, related services — está fora do mockup; ver a
          caixa de abertura deste arquivo. O fecho volta ao BRANCO depois da
          faixa papel dos ícones, que é o que o arquivo mostra. */}
      <SolutionClosing closing={service.closing} />

      {/* ⚠️ A CITAÇÃO AGORA DEPENDE DA EVIDÊNCIA. Ela é a terceira coluna desta
          faixa desde 16-09, então serviço com citação e sem evidência não
          mostraria a citação. Hoje não existe esse caso — os dois com citação
          (Executive Coaching e Top 150) também têm evidência —, e o dia em que
          existir, a decisão é dar a ele um bloco de evidência ou devolver a
          faixa própria. */}
      {service.evidence && (
        <SolutionEvidence
          caseSlug={service.evidence.caseSlug}
          caseTitle={
            service.evidence.title
              ? `${service.evidence.client} — ${service.evidence.title}`
              : service.evidence.client
          }
          body={service.evidence.body}
          facts={service.evidence.facts}
          testimonial={service.testimonial}
          imageUrl={service.evidence.image}
        />
      )}

      {/* ⚠️ O CONVITE VOLTOU PARA CÁ EM 16-09, DESFAZENDO O PEDIDO DE 15-09 que
          o tinha subido para antes da evidência — o porquê inteiro está na caixa
          de abertura deste arquivo, e vale ler antes de mover isto de novo. Em
          resumo: o pedido de 15-09 era dela, o template de 15-09 também é dela e
          fecha com evidência → CTA, e a call de 16-09 escolheu o template. Nos
          cinco serviços sem evidência o CTA continua vindo logo depois dos
          pilares, como antes. */}
      <SolutionCta
        strapline={service.cta.strapline}
        line={service.cta.line}
        ctaLabel={service.cta.label}
        /* Faixa mais baixa SÓ aqui, 18-09 — a prop existe para as outras
           páginas que usam o `SolutionCta` não mudarem; ver a caixa dela. */
        compact
      />

      {/* ✅ "RELATED SERVICES" VOLTOU EM 15-09, e voltou pelo caminho que a nota
          anterior exigia: como PEDIDO do cliente, não como decisão nossa.

          A HISTÓRIA, porque ela é o argumento. Esta grade existiu, entre a
          citação e o CTA, e saiu em 11-09 pela mesma régua que tirou o mural de
          clientes do índice — o §3.2 do outline fecha a página em seis blocos e
          o sexto é o convite, então estrutura extra era decisão do cliente e não
          nossa. Ficou escrito aqui que, se voltasse, voltaria "reinstalando o
          `ServiceCard` numa grade de três colunas". O template que ela mandou em
          15-09 (`4. Services/ExCo Leadership Services Page.png`) fecha a página
          exatamente com este bloco, sob o título "Related services".

          O ARGUMENTO A FAVOR, que sempre esteve de pé: sem ele a página termina
          no CTA, e quem não quiser falar com a gente naquele instante não tem
          para onde ir além do menu ou do botão de voltar. São dez serviços de
          públicos sobrepostos — quem lê Manager Development é candidato a High
          Performing Teams.

          QUATRO, E NÃO NOVE. O template dela mostra quatro cards. Nove seria a
          lista inteira outra vez, no pé de cada uma das dez páginas, e isso não
          é "related", é o índice repetido. `slice(0, 4)` sobre as outras nove na
          ordem do documento.

          ⚠️ AS QUATRO SÃO AS PRIMEIRAS DA LISTA, não uma escolha editorial de
          afinidade. O documento não diz quais serviços se relacionam com quais,
          e inventar esse mapa seria afirmar parentesco comercial que ninguém
          definiu — no template dela, as quatro ao pé do ExCo são Culture
          Transformation, Team Effectiveness, Organisational Transformation e
          Executive Coaching, e duas dessas nem são serviços desta lista. Quando
          o mapa vier, é trocar este `slice` por um campo `related` no dado.

          `headingLevel` NÃO EXISTE MAIS no `ServiceCard`, então os títulos aqui
          saem como `h2` — que é o mesmo nível dos outros blocos desta página e
          não quebra a escada de cabeçalhos, porque o rótulo "Related services"
          abaixo é um `<p>`, não um cabeçalho. */}
      {/* ⚠️ BRANCO DESDE 15-09, e era `paper`. Na ordem daquele dia este bloco
          vinha logo depois da faixa de citação, que também era `paper` — duas
          faixas cinzas encostadas viram uma massa só e o corte entre os assuntos
          some. Desde 16-09 a citação não é mais faixa e o CTA voltou a ser o
          último bloco antes daqui, então o vizinho de cima é SEMPRE o vermelho —
          nas dez páginas, com ou sem evidência. O branco continua sendo o degrau
          certo contra ele. */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
          <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
            Related services
          </p>
          <Reveal className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {services
              .filter((s) => s.slug !== service.slug)
              .slice(0, 4)
              .map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
          </Reveal>
        </div>
      </section>

    </>
  );
}
