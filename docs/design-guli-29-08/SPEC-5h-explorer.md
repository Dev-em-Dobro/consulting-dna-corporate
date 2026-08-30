# Spec — 5H explorer, medida no print do Guli

**Fonte:** `5th with balls.png` (285 × 387), a variante que o Guli escolheu na call de
29/08 *(03:52 "a melhor solução … seja esta daqui", 04:00 "adicionei essas bolinhas")*.

Tudo abaixo foi **medido pixel a pixel**, não estimado. As proporções estão em múltiplos da
altura da linha (**H = 38 px** no print) para sobreviver a qualquer escala.

---

## Cores

| Elemento | Hex medido | Observação |
|---|---|---|
| Fundo da seção | `#2b2929` | (43, 41, 41) |
| **Card de conteúdo** | `#353334` | (53, 51, 52) — confirmado no inspetor do Figma na call (03:10, `Fill 353334`) |
| **Linha inativa** | `#353334` | mesmo fill do card |
| Linha ativa | cor do H | (152, 191, 73) para HEAD |
| **Label da linha ativa** | `#ffffff` | medido (255, 255, 255) — **não** é escuro |
| Quadrado do card (ícone) | cor do H a ~17% sobre `#353334` | medido (69, 72, 53) |
| Swatch da linha ativa | cor do H + ~19% de branco | medido (170, 204, 102) |
| Swatch da linha inativa | cor do H a ~18% sobre `#353334` | medido (78, 53, 56) no HEART |
| **Bolinha do card** | `#ffffff` | medido (241, 238, 239) — **não** é a cor do H |
| Texto da dimensão | cor do H | — |

## Geometria

| Medida | Print | Em H |
|---|---|---|
| Altura da linha | 38 px | **H** |
| **Swatch** | 38 × 38 px, de `x=33` a `x=70` | **H × H** |
| Borda esquerda da linha | `x=33` | — |
| Raio da linha | ~5 px | 0.13 H |
| Espaço swatch → texto | 20 px | 0.53 H |
| Padding direito | 20 px | 0.53 H |
| Espaçamento das bolinhas | 12 px (centros 205·217·229·241·253) | 0.32 H |
| **Bolinha inativa** | 3 px | 0.08 H |
| **Bolinha ativa** | 7 px | 0.18 H |
| **Bolinha do card** | 8 px | 0.21 H |
| Card | 154 px de altura | — |
| Gap card → lista | 9 px | 0.24 H |
| Gap entre linhas | 0 px (encostadas) | — |

---

## Os três erros que esta spec corrige

**1. O swatch é rente, não tem respiro.** Começa exatamente na borda esquerda da linha
(`x=33` para os dois) e ocupa a altura inteira dela. É um quadrado `H × H`, sem padding e sem
raio próprio — quem arredonda os cantos é a linha, por recorte. A primeira implementação tinha
um quadradinho de 28 px com padding em volta.

**2. Na linha ativa tudo é branco.** Label e bolinhas medem (255,255,255). A primeira
implementação escolhia texto escuro por contraste sobre o verde claro — cálculo correto de
legibilidade, decisão errada de design. O print manda.

**3. A bolinha ativa é maior, não só mais opaca.** 7 px contra 3 px das outras — mais do dobro.
E ela tem o mesmo tamanho da bolinha do card (8 px), que é exatamente o que o Guli pediu aos
04:14:

> *"É importante que esta bolinha que está selecionada tenha o mesmo tamanho desta bolinha aqui
> do lado. Isso aí vai ajudar muito a pessoa a entender que é disso que se trata."*

Eu tinha lido isso como "a bolinha ativa tem o mesmo tamanho das outras bolinhas da linha" e
implementei mudança só de preenchimento. Ele estava comparando a bolinha da **linha** com a do
**card** — as duas ficam iguais para o usuário ligar uma coisa na outra. O print confirma:
7 px na linha, 8 px no card, 3 px nas inativas.

---

## O que continua valendo da leitura da call

- Card em cima, controles embaixo *(01:20)*
- Altura do card travada pelo pior caso *(01:56)*
- Régua Inner/Outer com linha sólida no grupo do H selecionado e pontilhada no outro,
  invertendo em Hands/Habits *(02:58)*
- 1 s por dimensão em autoplay, 3 s depois do primeiro clique *(04:53)*
- Nada disso é link *(06:00)*
- Contraste de acessibilidade: branco sobre o verde `#97bf3f` dá ~2,1:1. Está abaixo de AA,
  mas é o que o print especifica e o label é um reforço visual — o nome do H também está no
  card, em branco sobre `#353334`, onde o contraste é alto. Vale registrar na lista de
  aprovação em vez de divergir do design por conta própria.
