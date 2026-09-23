# `/edit` — a cliente edita os textos do site sem CMS

Feito em 23-09-2026, a pedido: *"o cliente quer poder fazer modificações em
todos os textos da home… uma página dedicada, sem login, bem visual, salva e
reflete no site; passa para o CMS depois"*, e depois, uma de cada vez, a About,
a Team, os serviços e a Clients & Impact.

**`/edit`** é o índice. Dele saem seis telas — `/edit-home`, `/edit-about`,
`/edit-team`, `/edit-services`, `/edit-clients` — e mais **dez**, uma por
página interna de serviço, em `/edit-services/<serviço>`.

---

## A máquina, peça a peça

O que é igual para todas as páginas mora em `lib/page-copy/`; o que é conteúdo
mora num trio de arquivos por página.

| Peça | Arquivo | O que faz |
| --- | --- | --- |
| Formato do campo + caminhos | `lib/page-copy/fields.ts` | `EditorField`/`EditorSection`, `getAtPath`, `setAtPath`, e a conversão texto do controle ↔ valor no objeto. |
| Mescla | `lib/page-copy/merge.ts` | `mergeCopy(padrões, schema, salvo)`: salvo por cima do padrão; string vazia volta ao padrão; lista substitui a lista; inválido volta o padrão inteiro. |
| Armazenamento | `lib/page-copy/store.ts` | `createCopyStore({ key })` — **um arquivo novo por versão** (`<key>-copy/<timestamp>.json`) no **Vercel Blob** (loja `cdna-home-copy`), lendo a mais nova via `list()`; guarda as últimas 20. A leitura é **cacheada por tag** (ver abaixo). Sem `BLOB_READ_WRITE_TOKEN`, em `.data/<key>-copy.json` (gitignored). |
| API | `lib/page-copy/route.ts` | Fábrica do `GET`/`POST`: `GET` devolve a copy em vigor, `POST` valida, grava e revalida os caminhos passados. |
| Ênfase `**…**` | `lib/page-copy/text.ts` | `inlineEmphasis()` — escapa o HTML e só então converte para `<strong>`. O mesmo miolo do `paragraphs()` de `lib/services.ts`. |
| Tela | `components/copy-editor/CopyEditor.tsx` | Seções na ordem da página, campos com "Restore original", barra fixa com Save, Ctrl/Cmd+S, aviso ao fechar com mudança pendente, botão `← All pages`. Recebe `sections`, `defaults`, `apiPath`, `siteHref`, `title` e, opcionalmente, `guideDir` e `note` por prop. **Sem `guideDir` a coluna do print some** e os campos ocupam a largura toda — é o que as dez telas de serviço usam. |
| Índice | `app/edit/page.tsx` | Uma URL só para a cliente; o botão `← All pages` de cada editor volta para cá. |

Por página: `lib/<pagina>-copy.ts` (padrões + `EDITOR_SECTIONS`),
`lib/<pagina>-copy-schema.ts` (zod + `merge<Pagina>Copy`),
`lib/<pagina>-copy-server.ts` (a instância da loja), `app/api/<pagina>-copy/`
e `app/edit-<pagina>/`.

Testes: `tests/home-copy.test.ts`, `tests/about-copy.test.ts`,
`tests/team-copy.test.ts`, `tests/services-copy.test.ts` e
`tests/clients-copy.test.ts` (`npm test`).

⚠️ Os arquivos de conteúdo são carregados pelos testes do Node, que exigem
**extensão `.ts` explícita** nos imports relativos e não resolvem o alias `@/` —
ver a nota no `tsconfig.json`. Por isso `lib/about-copy.ts` não importa nada além
de um tipo, e `lib/team-copy.ts` só importa `./team.ts` (que, por sorte e por
conferência, não tem import nenhum).

---

## ⚠️ A leitura do Blob é cacheada, e tem de continuar sendo

O `list()` que descobre qual é a versão mais nova é uma **operação avançada** do
Vercel Blob — a classe cara, de cota apertada. Na primeira versão ele acontecia
a CADA RENDER, então o custo era proporcional ao tráfego, e não ao número de
edições. Uma tarde de desenvolvimento (seis builds, os prints do guia, os testes
de fumaça) consumiu **1,6 mil das 2 mil operações do mês**, sem um visitante.

O conserto, em `lib/page-copy/store.ts`:

1. **`unstable_cache` com tag.** A leitura vai para o Data Cache do Next. Quem
   invalida é o `POST` da rota, por `revalidateTag`, no instante em que a
   cliente salva. O custo passa a ser proporcional às EDIÇÕES.
2. **`cache()` do React**, que junta os vários `read()` do mesmo render — a
   `/our-clients` lê duas lojas, e a interna de serviço lia a mesma duas vezes.
3. **`force-cache` na busca da versão**, em vez de `no-store`: o nome do arquivo
   carrega um timestamp, então cada versão tem URL própria e nunca esteve em
   cache antes.

Medido depois: **45 requisições a 9 páginas = zero `list()`**; um build inteiro
= 14 (limitado pelos processos paralelos do build, não pelo número de rotas).

✅ **Isso também consertou o prerender.** O `no-store` fazia a leitura estourar
no `next build`, o erro era engolido e a página saía com o padrão — ou seja,
depois de todo deploy o site publicava o texto de código até o ISR regenerar.
Agora o HTML já sai do build com o que a cliente salvou.

⚠️ **Quem mexer no `store.ts` tem de manter as três camadas.** Tirar o cache
devolve o custo por tráfego; tirar o `revalidateTag` da rota faz a cliente salvar
e não ver nada mudar por até uma hora.

⏳ Se um dia precisar de mais, o primitivo certo para "config pequena, lida a
todo request" é o **Edge Config**, cuja leitura não é cobrada por operação: são
~33 KB de copy contra um teto de 512 KB. Não foi feito porque o cache resolve
sem migração e sem token novo.

---

## O guia visual (prints por seção)

Cada seção do editor mostra, ao lado dos campos, um print de como ela aparece no
site (`public/edit-<pagina>-guide/<seção>.jpg`). Os prints são ESTÁTICOS: não
mudam quando ela digita, e ficam velhos quando o layout muda. Para refazer, com
o dev server na 3006 no ar:

```
node scripts/edit-page-guide-shots.mjs            # todas as páginas com guia
node scripts/edit-page-guide-shots.mjs clients    # só a Clients & Impact
```

Usa o Chrome da máquina via `puppeteer-core` (devDependency, sem download de
navegador). Fecha o banner de cookies e esconde o selo do Next e o botão do
WhatsApp antes de fotografar.

⚠️ **A tabela `PAGES` do script casa com os `EDITOR_SECTIONS`.** Campo novo numa
seção que já existe não pede nada; seção nova pede uma linha lá, senão o editor
mostra uma imagem quebrada.

⚠️ **As dez internas de serviço não têm print**, por decisão de 23-09: o template
das dez é o mesmo, e fotografar seção por seção custaria ~70 JPEGs versionados
para mostrar dez vezes a mesma forma. Lá o "See on site ↗" de cada seção abre a
página real na âncora.

---

## O que é editável

**Home** — Herói (título, subtítulo, dois botões) · What we solve / propósito ·
faixa de logos e números (a linha acima dos logos e os quatro RÓTULOS — os
números vêm do CMS `page_home`) · Client impact (rótulo, título, "Challenge",
"read more here", três cards) · Our people · Livro · Contato.

**About** — Herói (rótulo, título, as duas linhas do subtítulo) · **os quatro
números** (valor e rótulo) · Our purpose (com a citação da fundadora e a
assinatura) · Our promise · Identity (a citação de quatro parágrafos e os quatro
pilares) · Values (o texto de abertura e os cinco valores) · Where we work (o
texto ao lado do mapa e as quatro regiões) · os cinco escritórios (cidade,
endereço, telefone, e-mail) · The people behind it.

**Team** — Herói (rótulo, título, subtítulo) · Leadership (rótulo, título e o
título acima das programme managers) · dos SEIS LÍDERES, o cargo, a região e a
frase · One team (rótulo e as duas linhas) · Global faculty (rótulo, título e
parágrafo) · The DNA experience (rótulo, título e os quatro cartões) · a faixa
de fecho (frase, apoio e botão).

Fora, de propósito, em todas: rodapé, faixa de prêmios, formulário, mural de
logos, mapas, fotos, e os cases e depoimentos que vêm do CMS; e os ÍCONES, que
são chave de desenho e não texto (casam com a lista **por posição** — reordenar os
cinco valores reordena nome e texto, e os ícones ficam onde estão).

### ⚠️ Na Team, pessoa não é copy

NOME e FOTO de ninguém entram no editor, e as três programme managers e os
vinte e três da faculty ficam inteiramente fora. O motivo é que cada pessoa
carrega coisas que não são texto: o caminho do retrato em `public/team/`, o
recorte daquele arquivo (`portraitPosition`) e o `cmsSlug`, que é o que amarra o
card ao perfil do CMS que o botão "+" abre — e que casa por SLUG, e não por
nome, justamente porque os nomes divergem entre as duas fontes. Um nome
editável desamarraria o pop-up sem aviso nenhum na tela.

Os padrões dos seis (cargo, região, frase) e dos quatro cartões da DNA
experience são **derivados de `lib/team.ts`**, não copiados: é lá que a
procedência de cada linha está anotada. O schema trava as listas em 6 e 4, e o
teste "o padrão passa no próprio schema" faz um sétimo líder quebrar o
`npm test` em vez de o editor parar de salvar em silêncio.

### ⚠️ Um número que a Team diz duas vezes

"60+ practitioners" e "36 countries" aparecem no subtítulo do herói **e** no h2
da Global faculty, a duas telas de distância. Os dois campos estão no editor com
um `hint` avisando; mudar um e esquecer o outro publica a página se
contradizendo sobre o tamanho da própria faculty.

**Serviços (listagem)** — Herói · o rótulo "What we do" · o bloco Partners
(rótulo, título e os dois parágrafos) · a faixa de fecho.

**Cada uma das dez internas de serviço** — nome e sub-título do serviço · as
duas seções de texto (título e corpo) · "Who we work with", onde existe · a tira
de frases curtas · o case em destaque com os números e o depoimento, onde existe
· a faixa de fecho.

**Clients & Impact** — Herói · a linha acima dos logos · o cabeçalho de cada uma
das cinco seções · o bloco "A force for good" · os três rótulos do footprint · a
faixa de fecho.

### ⚠️ Nos serviços, editar uma página mexe em três

O nome e o sub-título de um serviço aparecem na dobra da própria interna, no
card dele na `/services` e no card dele no "Related services" das outras nove.
Por isso eles se editam num lugar só — a tela do serviço — e a rota
`/api/service-pages-copy` revalida `/services` e as dez internas.

A copy das dez vive **num objeto só**, indexado por slug: cada tela mostra os
campos de um serviço e salva o objeto inteiro. É o que permite dez telas sem dez
lojas no Blob.

### ⚠️ Dois achados de quem escreveu isso

**Nove das dez internas publicam "Headline to be confirmed."** nas duas seções
de texto — é a `headlineOr()` de `lib/services.ts` caindo no placeholder porque
o título nunca foi escrito. Os campos estão no editor com um aviso (só onde
estão vazios); preenchê-los tira o texto do ar.

**A assinatura de fecho (`closing`) não renderiza em serviço nenhum.** O
template só a desenha quando o serviço NÃO tem `practices`, e o único que tem
`closing` — a Senior Leadership Development — também tem `practices`. Por isso
ela ficou fora do editor, com a condição escrita em `sectionsFor()` para o dia
em que isso mudar, e um teste que avisa.

### ⚠️ Os quatro números da About mudam DUAS páginas

A faixa "By the numbers" da Clients & Impact publica exatamente os mesmos quatro
desde 18-09, a pedido da cliente, justamente para as duas não divergirem. Por
isso os valores moram em `lib/about-copy.ts`, o `FIRM_STAT_ICONS` de
`lib/stats.ts` só acrescenta o ícone, as duas páginas leem por `getFirmStats()`
e a rota `/api/about-copy` revalida `/about` **e** `/our-clients`.

### Negrito dentro de um parágrafo

Dois campos aceitam `**…**` (a citação do propósito e o texto de abertura dos
valores). Não aninha — `**a **b** c**` corrompe em silêncio. O `<strong>` que
sai da conversão não tem classe, então os pontos de uso trazem
`[&_strong]:font-semibold` para o negrito continuar em 600, e não nos 700 do
navegador.

---

## ⚠️ Sem login

Quem tiver a URL edita. Aceito como provisório até o CMS assumir. Para fechar
sem CMS: checar um segredo no `POST` e pedi-lo na tela — o lugar é a fábrica em
`lib/page-copy/route.ts`, uma vez para todas as rotas.

As telas são `noindex`, estão fora do sitemap e bloqueadas no `robots.ts` (a
regra casa por prefixo, então `/edit` sozinho já cobriria todas as `/edit-*`,
inclusive as dez de serviço). Isso é higiene, não proteção.

---

## Para subir em produção

A loja Blob está ligada só ao projeto **`consulting-dna-corporate-preview`**
(staging). O projeto de produção (`consulting-dna-corporate`) ainda **não tem**
o `BLOB_READ_WRITE_TOKEN` — sem ele, em produção o salvar cai no arquivo local,
que na Vercel não persiste. Antes do primeiro deploy de produção:

```
# com o link apontando para o projeto de produção (ver memória do deploy)
npx vercel env add BLOB_READ_WRITE_TOKEN production --scope dobro66
# valor: o mesmo token que está em .env.local
```

Preview e produção compartilham a MESMA loja, logo o mesmo texto salvo. Se um
dia for preciso separar, criar uma segunda loja e apontar o token de produção
para ela.

---

## Migrar para o CMS depois

Trocar o miolo dos `get<Página>Copy()` para ler do CMS (um singleton por página
com o mesmo formato) e apagar os `-server.ts` + as rotas. As páginas não mudam.
Os serviços são o caso mais fácil: a copy das dez já é um objeto por slug.
