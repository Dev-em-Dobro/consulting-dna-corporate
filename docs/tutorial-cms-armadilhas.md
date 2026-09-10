# Tutorial do CMS — o que precisa estar nele

Lista corrida, para quando formos escrever o tutorial de cadastro da CDNA. O
critério para entrar aqui é um só: **campos que falham em silêncio.** Erro com
mensagem o editor resolve sozinho; o que quebra sem avisar é o que precisa estar
escrito antes.

Iniciada em 01/09/2026.

---

## 1. Case — o campo "Title" é o nome do cliente, e só

**O que parece:** um rótulo. Dá vontade de escrever ali a frase de resultado, que
é como o mock do Guli abre a página — *"SHELL Discovery Journey registered 200
millions in savings for the company"*.

**O que é:** a chave de busca do logo e da cor da marca. `resolveClientLogo`
transforma esse texto em slug e procura `/public/logos/<slug>.png`; a cor da
faixa sai do mesmo lugar.

**O que acontece se errar:** `title = "SHELL Discovery Journey registered…"` faz
o sistema procurar um arquivo que não existe. O case perde **o logo e a cor** em
três lugares — `/our-clients`, `/cases` e a home. Sem erro, sem aviso, sem nada
na tela dizendo o que houve.

**O certo:** `Title` = "Shell". A frase de resultado vai no campo **Headline**,
que existe exatamente para isso. Headline é opcional; sem ele a página usa o nome
do cliente, que é o comportamento de todos os cases antigos.

## 2. Ticker — link relativo apaga o item inteiro

O campo `Link URL` exige URL completa. Escrever `/cases/shell` reprova a
validação e **o item não aparece de jeito nenhum** — não é que fica sem link, é
que some da faixa. Ou deixa vazio, ou põe `https://…` completo.

## 3. Ticker — data anterior a 2023 apaga o item

O corte de 2023 é do próprio Guilherme (item 17 do brief de 27/08) e está no
código. Um item datado de 2022 é descartado em silêncio. Data vazia usa a data de
publicação e aparece normalmente.

## 4. Publicar não é o suficiente para a home atualizar na hora

Publicar dispara a revalidação, mas a home é servida de cache e pode continuar
mostrando a versão anterior por alguns minutos. Não é erro de cadastro — vale
avisar, senão o editor publica, não vê mudar, e publica de novo.

## 5. Rascunho nunca chega ao site

Óbvio para quem conhece, não para quem está cadastrando pela primeira vez. Só
entradas **publicadas** aparecem. É por isso que dá para preparar conteúdo com
antecedência sem risco.

## 6. Editar uma entrada publicada não muda o site até republicar

O sistema guarda um retrato congelado do que está publicado (`publishedData`) e é
esse retrato que o site serve — não o rascunho de trabalho. Então editar uma
página que já está no ar **não altera nada** para o visitante até apertar publicar
de novo. Existe um aviso de "alterações não publicadas" na interface; o tutorial
precisa dizer o que ele significa.

---

## Onde isso entra

O e-mail de 01/09 pergunta se a CDNA vai preencher direto no sistema ou mandar os
textos para nós cadastrarmos. Se a resposta for "nós preenchemos", este tutorial
vira entregável e estas seis coisas são o núcleo dele.

E há um limite que precisa estar dito no mesmo documento: **Our Identity e Our
Approach não passam pelo CMS**, são montadas em código. O texto dessas duas vem
para a Dev em Dobro de qualquer forma, independente de quem cadastre o resto.
