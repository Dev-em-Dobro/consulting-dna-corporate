# O que vem do CMS e o que está no código

**Escrito em 16/09/2026**, depois da pergunta que ninguém tinha feito por escrito: *nas telas
novas, o que é conteúdo editável e o que é código?*
**Método:** auditoria rota a rota — todo `page.tsx` de `app/`, os componentes compartilhados e
os arquivos de dado de `lib/`. Não é impressão; é o que os imports dizem.
**Para que serve:** decidir, na hora em que a cliente pedir uma mudança, se a resposta é *"você
consegue fazer agora no painel"* ou *"isso é deploy"*.

---

## A regra, em uma frase

**O CMS manda no conteúdo que se acumula** (cases, insights, pessoas, parceiros, escritórios);
**o código manda no conteúdo que foi negociado** (os dez serviços, a navegação, os textos das
páginas institucionais).

Quando as duas coisas moram na mesma tela — e moram, em quase todas — é preciso olhar bloco a
bloco. É isso que a tabela abaixo faz.

---

## Rota a rota

| Rota | Vem do CMS | Está no código |
| --- | --- | --- |
| `/` (home) | números, ticker | herói, todo o resto da copy |
| `/about` | o mapa-múndi | **os quatro números daqui**, texto, regiões, escritórios, prêmios |
| `/approach` | — | tudo |
| `/services` (índice) | — | **tudo** |
| `/services/[slug]` (as dez) | — | **tudo** |
| `/services/regions` e `/services/regions/[region]` | as regiões inteiras | layout |
| `/services/leadership` | as pessoas | layout |
| `/team` | as **bios** do pop-up | nomes, cargos, regiões, citações, retratos, os quadros de faculty |
| `/our-clients` (Clients & Impact) | números, cases, footprint, mapa | logos, indústrias, herói, textos de seção |
| `/our-impact` | números, cases | layout e copy |
| `/cases` e `/cases/[slug]` | **tudo** | layout |
| `/insights` e `/insights/[slug]` | **tudo** | layout |
| `/our-partnerships` | os parceiros | layout |
| `/awards` | a página | layout |
| `/books` | — | tudo (`lib/books.ts`) |
| `/contact`, `/privacy`, `/terms`, `/cookies` | — | tudo |

---

## As coleções do CMS, e quem as consome

São sete, e o site lê todas por `lib/cms/map.ts`:

| Coleção | Alimenta |
| --- | --- |
| `cases` | `/cases`, `/cases/[slug]`, os cards e as métricas de `/our-clients` e `/our-impact` |
| `insights` | `/insights` e `/insights/[slug]` |
| `people` | as bios do pop-up da `/team` e a `/services/leadership` |
| `regions` | `/services/regions`, o mapa-múndi da `/about` e da `/our-clients` |
| `partnerships` | `/our-partnerships` |
| `ticker` | a faixa corrida da home |
| `testimonial-videos` | os depoimentos em vídeo |
| `home` (página) | **os quatro números** do site — 90%, 18, 36, 75 |

⚠️ **O `home` é uma página, não uma coleção**, e é o caso mais fácil de esquecer: os quatro
números (90% / 18 / 36 / 75) saem de `lib/stats.ts`, que os busca ali, e aparecem na **home**,
na **`/our-impact`** e na **`/our-clients`**. Editar um no painel muda as três de uma vez.

⚠️ **CUIDADO COM A `/about`: os números dela SÃO OUTROS e estão no código.** A faixa de lá diz
"18 years / 36 countries / 1,000+ leaders / 5 of the top 10 FTSE 100", e está escrita em
`app/about/page.tsx` (`const STATS`). Duas consequências: mudar o "36 countries" no painel
**não** muda a `/about`, e os dois conjuntos podem divergir sem ninguém notar — já divergem da
`/approach`, que carrega "26 countries", "95%" e "ten years". A reconciliação é decisão da CDNA
e está pendente desde a lista de aprovação de 06-08.

---

## O que NUNCA vem do CMS, e por quê

Isto não é pendência — é decisão, e cada uma tem motivo registrado no próprio arquivo.

### `lib/services.ts` — os dez serviços
A rota **deixou de ler o CMS em 11-09**. O motivo está no cabeçalho de
`app/services/[slug]/page.tsx`: os dez serviços do outline **não existem no CMS** — dois são
novos, três mudaram de nome, dois saíram — e os campos do bloco de CTA também não. A fonte de
verdade passou a ser a planilha dela (`WEBSITE SERVICE COPY.xlsx`), transcrita para o arquivo.

**Consequência, e é a mais importante deste documento:** toda revisão de copy de serviço que a
cliente fizer na planilha vira trabalho de código do nosso lado. Ela não tem como mexer
sozinha. Se a expectativa dela for outra, é conversa a ter antes de a lista de revisões crescer.

### `lib/nav.ts` e `lib/nav-server.ts` — o menu
Também saiu do CMS em 11-09, pelo mesmo motivo: o submenu vinha de `getSolutionCards()`, e
aquelas solutions não são estes serviços.

### `lib/team.ts` — os cards da equipe
Nome, cargo, região, citação e retrato de cada pessoa estão no código; **só a bio do pop-up vem
do CMS**, casada por `cmsSlug`.

⚠️ **A divisão já produziu uma confusão real, em 16-09:** pediram para corrigir a localização da
Genevieve para "Australia". No código ela já estava certa — e o campo nem é renderizado no card.
O que aparecia errado era a **bio do CMS**, que começa com `Location: Japan`. Quando a
informação parecer errada numa pessoa, olhe os dois lados antes de concluir onde está o defeito.

### Outros arquivos de dado
`lib/logos.ts` (o paredão de clientes), `lib/industries.ts`, `lib/offices.ts` (os endereços do
rodapé e do bloco de escritórios), `lib/books.ts`, `lib/coverage.ts`.

---

## Quando o CMS não responde

Nenhuma página quebra, e isso é deliberado:

- **Os números** caem no `STAT_FALLBACK` de `lib/stats.ts` — os mesmos 90% / 18 / 36 / 75.
- **As listas** (cases, insights, pessoas, parceiros) voltam vazias e a seção some ou mostra um
  aviso curto, em vez de estourar.
- **A `/team`** renderiza os seis cards normalmente; o que some é o botão "+" que abre o perfil.
- **As dez páginas de serviço** não notam nada, porque não perguntam ao CMS.

---

## Como conferir, sem confiar nesta tabela

Ela envelhece. O comando que a reconstrói:

```bash
# quais rotas importam o CMS, e quais funções chamam
for p in $(find app -name "page.tsx" | sort); do
  echo "$(echo $p | sed 's#^app##;s#/page.tsx$##') -> $(grep -c 'from "@/lib/cms' $p)"
done
```

E, para uma página específica, `grep -n "^import" app/<rota>/page.tsx` separa em duas listas:
o que vem de `@/lib/cms/...` é conteúdo editável; o que vem de `@/lib/<arquivo>.ts` é código.

---

## O resumo que serve para a daily

| Ela quer mudar | Quem faz |
| --- | --- |
| Um número do site (90%, 18, 36, 75) | Ela, no painel — e muda em três páginas de uma vez |
| Um número **da /about** (18 years, 36 countries, 1.000+, 5 of the top 10) | Nós, no código |
| Um case study | Ela, no painel |
| Um artigo de Insights | Ela, no painel |
| A bio de alguém da equipe | Ela, no painel |
| Um parceiro, um escritório, uma região | Ela, no painel |
| **Qualquer texto de uma página de serviço** | **Nós, no código** |
| O nome, o cargo ou a foto de alguém no card | Nós, no código |
| Os logos do paredão de clientes | Nós, no código |
| O menu | Nós, no código |
