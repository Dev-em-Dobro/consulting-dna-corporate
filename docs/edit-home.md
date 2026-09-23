# `/edit-home` — a cliente edita os textos da home sem CMS

Feito em 23-09-2026, em uma hora, a pedido: *"o cliente quer poder fazer
modificações em todos os textos da home… uma página dedicada, sem login, bem
visual, salva e reflete no site; passa para o CMS depois"*.

## Como funciona

| Peça | Arquivo | O que faz |
| --- | --- | --- |
| Padrões + mapa do editor | `lib/home-copy.ts` | Toda a copy da home que era inline, num objeto só (`DEFAULT_HOME_COPY`), e a lista de campos que a tela mostra (`EDITOR_SECTIONS`). Sem zod: é importado pelo `HeroV2` (cliente). |
| Validação + mescla | `lib/home-copy-schema.ts` | Schema zod e `mergeHomeCopy` (salvo por cima do padrão; string vazia volta ao padrão; lista substitui a lista). |
| Armazenamento | `lib/home-copy-server.ts` | Grava **um arquivo novo por versão** (`home-copy/<timestamp>.json`) no **Vercel Blob** (loja `cdna-home-copy`) quando há `BLOB_READ_WRITE_TOKEN`, e lê a mais nova via `list()`; sobrescrever o mesmo arquivo deixava a CDN servir a versão velha por até um minuto. Guarda as últimas 20. Sem token, em `.data/home-copy.json` (gitignored). |
| API | `app/api/home-copy/route.ts` | `GET` devolve a copy em vigor; `POST` valida, grava e chama `revalidatePath("/")`. |
| Tela | `app/edit-home/page.tsx` + `components/home-editor/HomeEditor.tsx` | Seções na ordem da página, campos com "Restore original", barra fixa com Save, Ctrl/Cmd+S, aviso ao fechar com mudança pendente. `noindex`, fora do sitemap e bloqueada no `robots.ts`. |
| Consumo | `app/page.tsx`, `components/HeroV2.tsx` | A home chama `getHomeCopy()` e passa `copy.hero` ao herói. |

Testes: `tests/home-copy.test.ts` (`npm test`).

## O guia visual (prints por seção)

Cada seção do editor mostra, ao lado dos campos, um print de como ela aparece
na home (`public/edit-home-guide/<seção>.jpg`). Os prints são ESTÁTICOS: não
mudam quando ela digita, e ficam velhos quando o layout da home muda. Para
refazer, com o dev server na 3006 no ar:

```
node scripts/edit-home-guide-shots.mjs
```

Usa o Chrome da máquina via `puppeteer-core` (devDependency, sem download de
navegador). Fecha o banner de cookies e esconde o selo do Next e o botão do
WhatsApp antes de fotografar.

## O que é editável

Herói (título, subtítulo, dois botões) · What we solve / propósito (rótulo,
título, apoio, frase do propósito, palavra vermelha, palavras que giram) ·
faixa de logos e números (linha acima dos logos e os quatro RÓTULOS — os
números vêm do CMS `page_home`) · Client impact (rótulo, título, "Challenge",
"read more here", três cards) · Our people (rótulo, título, apoio, intro, três
blocos, linha dos parceiros) · Livro (kicker, título, parágrafos — só na home;
a /insights segue `lib/books.ts`) · Contato (título, apoio).

Fora, de propósito: rodapé, faixa de prêmios, formulário, endossos do livro,
mural de logos — são componentes compartilhados com outras páginas.

## ⚠️ Sem login

Quem tiver a URL edita a home. Aceito como provisório até o CMS assumir. Para
fechar sem CMS: checar um segredo no `POST` da rota e pedi-lo na tela.

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

## Migrar para o CMS depois

Trocar o miolo de `getHomeCopy()` para ler do CMS (um singleton `page_home_copy`
com o mesmo formato de `HomeCopy`) e apagar `home-copy-server.ts` + a rota. A
home e o herói não mudam.
