/** Neutral image slot for scaffolded pages — swap for a real <Image> later. */
export default function ImagePlaceholder({
  className = "",
  label = "Image",
  tone = "light",
}: {
  className?: string;
  label?: string;
  /**
   * `dark` para o slot que vive sobre `bg-ink` (herói das páginas de serviço).
   *
   * É PROP E NÃO CLASSE PASSADA POR FORA porque a Tailwind não resolve conflito
   * por ordem de string: `bg-paper` do padrão e um `bg-white/5` vindo no
   * `className` têm a mesma especificidade, e quem ganha é a ordem da folha de
   * estilo gerada, não a ordem em que foram escritos. O placeholder sairia claro
   * sobre o fundo escuro em algumas builds e não em outras — o pior tipo de
   * defeito, o que não reproduz.
   */
  tone?: "light" | "dark";
}) {
  /* TRACEJADO E COM PREENCHIMENTO PERCEPTÍVEL — os dois tons.
     A primeira versão do tom escuro era `bg-white/[0.06]` com borda sólida a
     10%: sobre `ink`, e ainda por baixo do lavado lateral do herói, o resultado
     era invisível — sobrava o rótulo flutuando no vazio, e não dava para julgar
     a composição, que é a única razão de o slot existir. Um placeholder tem de
     LER COMO SLOT: se ele desaparece no fundo, ele mente sobre o layout. */
  const tones = {
    /* CINZA PRÓPRIO, e não `bg-paper`. Era `bg-paper`, e isso funcionava
       enquanto o slot só aparecia sobre branco. Nas páginas de serviço os
       blocos alternam branco/`paper`, e sobre `paper` o placeholder era da cor
       exata do fundo — sumia, sobrava o rótulo flutuando. Um tom com alfa
       próprio contrasta com os dois. */
    light: "border-ink/20 bg-ink/[0.06] text-ink/45",
    /* 16% e borda a 40%. Parece muito no papel e não é: no herói das páginas de
       serviço este slot vive DEBAIXO do lavado lateral, que é opaco até os 46%
       da largura e só zera aos 78%. O que sobra de contraste é o que passa pelo
       gradiente. A 11% não passava nada. */
    dark: "border-white/40 bg-white/[0.16] text-white/70",
  };
  return (
    <div
      className={`flex items-center justify-center border border-dashed text-[11px] font-semibold uppercase tracking-[2px] ${tones[tone]} ${className}`}
    >
      {label}
    </div>
  );
}
