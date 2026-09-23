/**
 * A ÊNFASE `**…**` DENTRO DE UM TEXTO QUE A CLIENTE ESCREVE — escape do HTML
 * primeiro, negrito depois.
 *
 * SAIU DE DENTRO DE `paragraphs()` (lib/services.ts) EM 23-09, quando a About
 * passou a ler a copy do editor. Lá os negritos estão no MEIO de um parágrafo
 * que o JSX já embrulha com as classes dele ("**Our values** are deeply human
 * centric…", "**With roots in Big 4 Consulting**, the genesis…"), e o
 * `paragraphs()` devolve `<p>` sem classe nenhuma — não serve para um
 * `dangerouslySetInnerHTML` posto dentro de um `<p>` que já existe. O miolo é
 * o mesmo nos dois usos; por isso mora aqui, e os dois chamam.
 *
 * A caixa abaixo é a que estava no ponto de uso, trazida inteira — ela é tudo
 * o que há de escrito sobre as armadilhas desta função.
 */
export function inlineEmphasis(text: string): string {
  return (
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      /* A ÊNFASE ENTRA DEPOIS DO ESCAPE, e a ordem não é gosto: invertida, o
         `<strong>` que acabamos de inserir seria escapado e sairia como texto
         na tela. O par `**…**` é a marcação da planilha dela — documentado no
         JSDoc de `outcome` e `howWeHelp`, em `Service` — e asterisco sem par
         fica visível de propósito, para aparecer na revisão em vez de sumir.

         NÃO SUPORTA ANINHAMENTO: "**a **b** c**" tem número par de `**` e
         ainda assim corrompe — o regex é não guloso e casa do primeiro par ao
         segundo, produzindo "<strong>a </strong>b<strong> c</strong>", sem
         deixar asterisco nenhum para trás. Por isso o teste "nenhum asterisco
         vaza para o HTML" NÃO pega este caso — ele testa ausência de `*`, e
         aninhamento não deixa nenhum.

         ⚠️ NENHUM TESTE AUTOMÁTICO PEGA ISTO, E NÃO É POR FALTA DE TENTAR:
         contar `<strong>` abertos contra pares de `**` na fonte (`abre ===
         marks / 2`) PARECE um guarda e não é — é uma invariante do algoritmo,
         não um sinal de problema. `**` funciona por alternância (liga/desliga),
         não por pilha, então QUALQUER quantidade par de `**` sempre abre
         exatamente `marks / 2` tags `<strong>`, aninhado ou não; confirmado
         por força bruta em seis padrões, incluindo dois spans legítimos e
         independentes ("**a** **b**") que têm a mesma conta que o exemplo
         aninhado acima. A contagem não sabe distinguir as duas coisas porque,
         na saída, elas SÃO a mesma coisa — a única diferença é a intenção de
         quem escreveu. A defesa hoje é a checagem manual contra a planilha
         (feita byte a byte na Task 2); o teste "ênfase aninhada corrompe em
         silêncio" documenta o comportamento da função, não guarda os dez
         serviços.

         `.` NÃO CASA `\n`: ênfase que atravesse uma quebra de linha simples
         sai com os `**` crus na tela — falha visível, não silenciosa, e por
         isso aceita. Relevante porque `serviceFromSolutionVM` converte
         `<br>` em `\n` antes de chegar aqui. */
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  );
}
