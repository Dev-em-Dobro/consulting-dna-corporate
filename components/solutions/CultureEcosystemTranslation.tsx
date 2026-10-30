type Label = { x: number; y: number; w: number; h: number; lines: string[]; size: number; red?: boolean };
const labels: Label[] = [
  { x: 70, y: 8, w: 140, h: 25, lines: ["NOSSOS SERVIÇOS"], size: 12, red: true },
  { x: 34, y: 34, w: 337, h: 73, lines: ["O ecossistema cultural", "da CorporateDNA"], size: 29 },
  { x: 34, y: 111, w: 340, h: 42, lines: ["Dez elementos interligados que dão vida", "à cultura no dia a dia do trabalho."], size: 15 },
  { x: 458, y: 55, w: 110, h: 20, lines: ["ELEMENTO 1"], size: 12, red: true },
  { x: 443, y: 116, w: 139, h: 42, lines: ["Liderança", "e exemplo"], size: 16 },
  { x: 709, y: 103, w: 110, h: 20, lines: ["ELEMENTO 2"], size: 12, red: true },
  { x: 687, y: 161, w: 153, h: 44, lines: ["Propósito, estratégia", "e desempenho"], size: 15 },
  { x: 865, y: 229, w: 111, h: 20, lines: ["ELEMENTO 3"], size: 12, red: true },
  { x: 845, y: 283, w: 146, h: 48, lines: ["Protagonismo", "e responsabilidade", "pelos resultados"], size: 12 },
  { x: 831, y: 363, w: 114, h: 20, lines: ["ELEMENTO 4"], size: 12, red: true },
  { x: 817, y: 426, w: 145, h: 40, lines: ["Franqueza", "radical"], size: 16 },
  { x: 709, y: 483, w: 111, h: 20, lines: ["ELEMENTO 5"], size: 12, red: true },
  { x: 687, y: 544, w: 151, h: 44, lines: ["Processos a manter,", "encerrar ou mudar"], size: 14 },
  { x: 491, y: 521, w: 112, h: 20, lines: ["ELEMENTO 6"], size: 12, red: true },
  { x: 470, y: 581, w: 150, h: 42, lines: ["Experiência dos", "colaboradores"], size: 15 },
  { x: 282, y: 500, w: 109, h: 20, lines: ["ELEMENTO 7"], size: 12, red: true },
  { x: 267, y: 561, w: 139, h: 35, lines: ["Equipes essenciais"], size: 15 },
  { x: 108, y: 403, w: 113, h: 20, lines: ["ELEMENTO 8"], size: 12, red: true },
  { x: 90, y: 455, w: 150, h: 42, lines: ["Diferenciação", "por desempenho"], size: 15 },
  { x: 57, y: 267, w: 111, h: 20, lines: ["ELEMENTO 9"], size: 12, red: true },
  { x: 39, y: 321, w: 145, h: 39, lines: ["Colaboração", "entre áreas"], size: 15 },
  { x: 222, y: 169, w: 112, h: 20, lines: ["ELEMENTO 10"], size: 12, red: true },
  { x: 205, y: 222, w: 143, h: 45, lines: ["Agilidade nas decisões", "e encaminhamento aos", "níveis responsáveis"], size: 10 },
  { x: 415, y: 282, w: 198, h: 71, lines: ["TRANSFORMAÇÃO", "CULTURAL", "(POR QUÊ?)"], size: 21 },
  { x: 469, y: 375, w: 92, h: 44, lines: ["Pessoas", "Desempenho", "Possibilidades"], size: 13 },
];

// A camada troca somente os textos da arte aprovada, preservando desenho e dimensões.
export default function CultureEcosystemTranslation() {
  return <svg data-no-translate className="locale-pt-only pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1024 683" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Ecossistema cultural da CorporateDNA com dez elementos interligados">
    {labels.map(({x,y,w,h,lines,size,red},index) => <g key={index}>
      <rect x={x} y={y} width={w} height={h} fill="white" />
      <text x={x+w/2} y={y+(h-(lines.length-1)*size*1.05)/2+size*.35} textAnchor="middle" fill={red?"#b7212d":"#171b2d"} fontFamily="Georgia, serif" fontSize={size} fontWeight={red?700:600}>
        {lines.map((line,i)=><tspan key={line} x={x+w/2} dy={i===0?0:size*1.05}>{line}</tspan>)}
      </text>
    </g>)}
  </svg>;
}
