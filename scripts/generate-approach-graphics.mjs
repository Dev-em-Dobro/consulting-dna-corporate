/** Portuguese labels over the original English artwork, preserving its design. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..", "public");
const image = (path) => `data:image/png;base64,${readFileSync(join(root, path)).toString("base64")}`;
const polar = (cx, cy, r, deg) => [cx + r * Math.cos(deg * Math.PI / 180), cy + r * Math.sin(deg * Math.PI / 180)];
function sector(cx, cy, outer, inner, start, end) {
  const [x1, y1] = polar(cx, cy, outer, start);
  const [x2, y2] = polar(cx, cy, outer, end);
  const [x3, y3] = polar(cx, cy, inner, end);
  const [x4, y4] = polar(cx, cy, inner, start);
  return `M${x1} ${y1}A${outer} ${outer} 0 0 1 ${x2} ${y2}L${x3} ${y3}A${inner} ${inner} 0 0 0 ${x4} ${y4}Z`;
}
const label = (value, x, y, size, color = "#fff") => `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="Arial,sans-serif" font-size="${size}" font-weight="700" fill="${color}">${value}</text>`;

// Original five unequal sectors; only their English labels are repainted.
const ringGroups = [
  { name: "CABEÇA", color: "#713375", start: 240, end: 300 },
  { name: "MÃOS", color: "#292c69", start: 300, end: 390 },
  { name: "HÁBITOS", color: "#087747", start: 30, end: 120 },
  { name: "INTUIÇÃO", color: "#e6be0c", start: 120, end: 180 },
  { name: "CORAÇÃO", color: "#dc4038", start: 180, end: 240 },
];
const ring = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 636 636" role="img" aria-labelledby="title">',
  '<title id="title">As cinco inteligências</title>',
  `<image href="${image("approach-5h-ring.png")}" width="636" height="636"/>`];
for (const group of ringGroups) {
  const mid = (group.start + group.end) / 2;
  const [x, y] = polar(318, 318, 201, mid);
  let rotation = mid + 90;
  while (rotation > 90) rotation -= 180;
  ring.push(`<path d="${sector(318, 318, 232, 168, group.start + .5, group.end - .5)}" fill="${group.color}"/>`);
  ring.push(`<g transform="translate(${x} ${y}) rotate(${rotation})">${label(group.name, 0, 0, group.name.length > 7 ? 26 : 30)}</g>`);
}
ring.push('</svg>');
writeFileSync(join(root, "approach-5h-ring-pt-br.svg"), ring.join("\n"));

// Repaint only the competency wedges, using their original flat colours and angles.
// This keeps the source art's geometry while making every label legible in PT-BR.
const faculties = [
  { name: "CABEÇA", color: "#55215e", start: 210, end: 270 },
  { name: "MÃOS", color: "#293568", start: 270, end: 360 },
  { name: "HÁBITOS", color: "#356b54", start: 0, end: 90 },
  { name: "INTUIÇÃO", color: "#b98727", start: 90, end: 150 },
  { name: "CORAÇÃO", color: "#bc1f26", start: 150, end: 210 },
];
const wheel = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1322 1329" role="img" aria-labelledby="title desc">',
  '<title id="title">Estrutura 5H</title><desc id="desc">Diagrama original com as cinco inteligências, 25 competências e núcleo em português.</desc>',
  `<image href="${image("approach/5h-framework-wheel-user.png")}" width="1322" height="1329"/>`];
const competencies = [
  { start: 210, end: 270, colors: ["#be75b1", "#a8519f", "#9a3d96", "#802b7a", "#5d1e5a"], labels: [
    ["Navegar pela", "complexidade"], ["Planejamento", "de cenários"], ["Mentalidade de", "crescimento"], ["Apetite ao", "risco"], ["Pensamento", "crítico"],
  ] },
  { start: 270, end: 360, colors: ["#a2a0b1", "#8b8ca3", "#6b6d84", "#484e74", "#272d5c"], labels: [
    ["Desenvoltura"], ["Dar o", "exemplo"], ["Responsabilidade"], ["Foco nas partes", "interessadas"], ["Orientação", "para ação"],
  ] },
  { start: 0, end: 90, colors: ["#bfcbc8", "#9aaba1", "#7b9283", "#5c7b6a", "#3b6752"], labels: [
    ["Escuta e", "questionamento"], ["Consistência"], ["Liderar pelo", "propósito"], ["Senso de dono"], ["Transparência"],
  ] },
  { start: 90, end: 150, colors: ["#e4c359", "#d4ad2e", "#ca9d2e", "#c2902c", "#b2832c"], labels: [
    ["Decisões", "ágeis"], ["Perspicácia"], ["Construção", "de sentido"], ["Curiosidade"], ["Julgamento e", "discernimento"],
  ] },
  { start: 150, end: 210, colors: ["#f0b4b5", "#ef8386", "#f15f65", "#db252b", "#b12026"], labels: [
    ["Conexão e", "colaboração"], ["Habilidade", "interpessoal"], ["Energia", "autêntica"], ["Empatia"], ["Coragem e", "resiliência"],
  ] },
];
for (const group of competencies) {
  const step = (group.end - group.start) / 5;
  for (let i = 0; i < 5; i++) {
    const start = group.start + i * step;
    const end = start + step;
    const mid = (start + end) / 2;
    const [x, y] = polar(661, 664, 470, mid);
    let rotation = mid + 180;
    while (rotation > 90) rotation -= 180;
    while (rotation < -90) rotation += 180;
    const color = group.colors[i];
    const [red, green, blue] = color.match(/[a-f\d]{2}/gi).map((part) => parseInt(part, 16));
    const ink = (red * .299 + green * .587 + blue * .114) > 145 ? "#171717" : "#fff";
    const lines = group.labels[i];
    const longestLine = Math.max(...lines.map((line) => line.length));
    const size = longestLine > 12 ? 18 : longestLine > 8 ? 22 : 25;
    wheel.push(`<path d="${sector(661, 664, 556, 392, start + .25, end - .25)}" fill="${color}"/>`);
    wheel.push(`<text transform="translate(${x} ${y}) rotate(${rotation})" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size}" font-weight="700" fill="${ink}">${lines.map((line, index) => `<tspan x="0" dy="${index === 0 ? -(lines.length - 1) * size * .55 : size * 1.1}">${line}</tspan>`).join("")}</text>`);
  }
}
for (const group of faculties) {
  const mid = (group.start + group.end) / 2;
  const [x, y] = polar(661, 664, 344, mid);
  let rotation = mid + 90;
  while (rotation > 90) rotation -= 180;
  wheel.push(`<path d="${sector(661, 664, 382, 316, group.start + .8, group.end - .8)}" fill="${group.color}"/>`);
  wheel.push(`<g transform="translate(${x} ${y}) rotate(${rotation})">${label(group.name, 0, 0, group.name.length > 7 ? 36 : 43)}</g>`);
}
wheel.push('<rect x="482" y="544" width="358" height="252" rx="5" fill="#424342"/>');
wheel.push(label("NÚCLEO", 661, 613, 100, "#ed272e"));
wheel.push(label("VALORES, CRENÇAS", 661, 691, 34));
wheel.push(label("E MOTIVAÇÕES", 661, 735, 34));
wheel.push(`<path d="${sector(661, 664, 650, 557, 130, 230)}" fill="#424342"/>`);
wheel.push(`<path d="${sector(661, 664, 650, 557, -50, 50)}" fill="#424342"/>`);
wheel.push(`<g transform="translate(68 664) rotate(-90)">${label("JOGO INTERIOR", 0, 0, 42)}</g>`);
wheel.push(`<g transform="translate(1254 664) rotate(90)">${label("JOGO EXTERIOR", 0, 0, 42)}</g>`);
wheel.push('</svg>');
const wheelSvg = wheel.join("\n");
writeFileSync(join(root, "approach", "5h-framework-wheel-pt-br.svg"), wheelSvg);

// The same English art supplies the rings, arrows, gradient, and spacing.
const diagram = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1620 971" role="img" aria-labelledby="title">',
  '<title id="title">Jogo interior e jogo exterior</title>',
  '<defs><radialGradient id="paper"><stop stop-color="#fff"/><stop offset=".82" stop-color="#f0f0f0"/><stop offset="1" stop-color="#ddd"/></radialGradient><path id="left-title" d="M190 350 Q395 185 600 350"/><path id="right-title" d="M1025 350 Q1230 185 1435 350"/></defs>',
  `<image href="${image("approach/inner-outer-game-5h-20261001.png")}" width="1620" height="971"/>`,
  '<circle cx="395" cy="485" r="294" fill="url(#paper)"/>',
  '<circle cx="1230" cy="485" r="294" fill="url(#paper)"/>',
  '<text font-family="Arial,sans-serif" font-size="48" font-weight="700" text-anchor="middle" fill="#111"><textPath href="#left-title" startOffset="50%">JOGO INTERIOR</textPath></text>',
  label("Quem somos", 395, 430, 52, "#111"),
  label("e como", 395, 505, 52, "#111"),
  label("agimos", 395, 580, 52, "#111"),
  '<text font-family="Arial,sans-serif" font-size="48" font-weight="700" text-anchor="middle" fill="#111"><textPath href="#right-title" startOffset="50%">JOGO EXTERIOR</textPath></text>',
  label("Resultados", 1230, 430, 52, "#111"),
  label("para o", 1230, 505, 52, "#111"),
  label("negócio", 1230, 580, 52, "#111"),
  `<image href="data:image/svg+xml;base64,${Buffer.from(wheelSvg).toString("base64")}" x="568" y="240" width="484" height="492"/>`,
  '</svg>'];
writeFileSync(join(root, "approach", "inner-outer-game-5h-pt-br.svg"), diagram.join("\n"));
