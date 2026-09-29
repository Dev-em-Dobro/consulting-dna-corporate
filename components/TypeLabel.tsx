/**
 * Rótulo de seção — a régua vermelha curta mais a palavra em caixa alta que
 * abre cada bloco ("WHAT WE SOLVE", "WHERE WE WORK.").
 *
 * ⚠️ MORAVA DENTRO DA /about — extraído em 10-09 para a home usar o MESMO
 * rótulo. Antes disso a home tinha cinco tratamentos diferentes de texto em
 * caixa alta e a About tinha um só; as duas páginas abriam suas seções com
 * tipografias diferentes, que é justamente a desarmonia que a extração fecha.
 *
 * A escala é a da About (14px / peso 500 / tracking 1,3px), medida no menu da
 * própria Explore Performance e não transcrita da grade — mesma decisão anotada
 * na prop `outlined` da NavV2.
 */
export default function TypeLabel({
  children,
  onDark = false,
  className = "",
}: {
  children: React.ReactNode;
  /**
   * Classes de LAYOUT para a linha do rótulo — alinhamento e margem, nunca
   * tipografia. Existe porque a home centraliza o rótulo em duas seções
   * (`md:justify-center`) e a About não; sem isto, unificar a tipografia
   * quebraria a centralização daquelas seções.
   *
   * A escala tipográfica fica de fora de propósito: ela é o motivo de este
   * componente existir, e abrir uma porta para sobrescrevê-la por call site
   * traria de volta os cinco tratamentos diferentes que a extração fechou.
   */
  className?: string;
  /**
   * Fundo escuro — troca o vermelho da marca pelo tom claro dele.
   *
   * Existe porque #d84339 não é legível como TEXTO sobre `ink`: 2,87:1, abaixo
   * até da régua de 3:1 de texto grande, e sem conserto possível pelo fundo (a
   * conta está no `--color-brand-light`, em globals.css). O tom claro é o mesmo
   * vermelho com a luminosidade subida, e devolve 4,53:1.
   *
   * A RÉGUA MUDA JUNTO com a palavra. Elas leem como um objeto só; deixar o
   * traço no vermelho cheio e clarear apenas o texto pareceria defeito de
   * renderização, não decisão. E o traço tem o mesmo problema: 2,87:1 é
   * limítrofe até para elemento gráfico, cuja régua é 3:1.
   */
  onDark?: boolean;
}) {
  /* Classes ESCRITAS POR INTEIRO nas duas pontas, e não montadas com
     `bg-${tone}`: a Tailwind gera o CSS varrendo o código-fonte atrás de nomes
     de classe literais, então um nome concatenado em tempo de execução nunca
     chega a existir na folha de estilo. O elemento sai com a classe no HTML e
     sem regra nenhuma por trás — falha silenciosa, que só aparece olhando a
     tela. */
  return (
    <div className={`mb-5 flex items-center gap-3 ${className}`}>
      <span
        className={`inline-block h-0.5 w-9 ${onDark ? "bg-brand-light" : "bg-brand"}`}
      />
      {/* ⚠️ `text-left` EXPLÍCITO, mesmo dentro de blocos centralizados.
          Sem ele o texto herda o `text-center` do pai e se centraliza DENTRO
          DA PRÓPRIA CAIXA. Enquanto cabe numa linha ninguém nota; quando quebra
          em duas — "WHAT WE BELIEVE, AND HOW / WE WORK." num telefone — a
          primeira linha recua para o meio da caixa e abre um vão aparente
          contra a régua, que continua colada na borda esquerda. O vão medido
          era 12px, o percebido era o dobro, e a causa não estava no `gap`:
          estava no alinhamento interno.

          O par régua+texto continua centralizado COMO UNIDADE quando o bloco
          pai é centralizado — o que muda é o texto parar de se recentralizar
          por dentro. */}
      <span
        className={`text-left text-[14px] font-medium uppercase leading-none tracking-[1.3px] ${
          onDark ? "text-brand-light" : "text-brand"
        }`}
      >
        {children}
      </span>
    </div>
  );
}
