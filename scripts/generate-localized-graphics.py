"""Create readable Portuguese versions of the two 5H wheel graphics."""

from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1] / "public"
parts = [
    ("CABEÇA", "#713375", ["Pensamento crítico", "Apetite ao risco", "Mentalidade de crescimento", "Planejamento de cenários", "Navegar pela complexidade"]),
    ("MÃOS", "#303b75", ["Criatividade prática", "Dar o exemplo", "Responsabilidade", "Foco nas pessoas envolvidas", "Orientação para a ação"]),
    ("HÁBITOS", "#24714e", ["Transparência", "Senso de dono", "Liderar pelo propósito", "Consistência", "Escuta e questionamento"]),
    ("INTUIÇÃO", "#d6a51f", ["Discernimento", "Curiosidade", "Construção de sentido", "Percepção", "Decisões ágeis"]),
    ("CORAÇÃO", "#df3c39", ["Coragem e resiliência", "Empatia", "Autenticidade", "Habilidade interpessoal", "Conexão e colaboração"]),
]

wheel = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1320 1320" role="img" aria-labelledby="title desc">',
         '<title id="title">As cinco dimensões da liderança</title><desc id="desc">Cabeça, mãos, hábitos, intuição e coração, cada dimensão com cinco competências.</desc>',
         '<circle cx="660" cy="410" r="390" fill="#3d3d3d"/>']
for i, (name, color, details) in enumerate(parts):
    angle = -90 + i * 72
    wheel.append(f'<circle cx="660" cy="410" r="328" fill="none" stroke="{color}" stroke-width="106" stroke-dasharray="412 2061" transform="rotate({angle} 660 410)"/>')
wheel.extend(['<circle cx="660" cy="410" r="234" fill="#3d3d3d" stroke="#fff" stroke-width="3"/>',
              '<text x="660" y="390" text-anchor="middle" fill="#ed272e" font-family="Arial,sans-serif" font-size="108" font-weight="700">NÚCLEO</text>',
              '<text x="660" y="443" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="28" font-weight="700">VALORES, CRENÇAS</text>',
              '<text x="660" y="480" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="28" font-weight="700">E MOTIVAÇÕES</text>',
              '<text x="660" y="844" text-anchor="middle" fill="#303030" font-family="Arial,sans-serif" font-size="32" font-weight="700">JOGO INTERIOR  ·  JOGO EXTERIOR</text>'])
coords = [(780, 151), (945, 313), (934, 650), (384, 650), (263, 413)]
for (name, color, details), (x, y) in zip(parts, coords):
    wheel.append(f'<rect x="{x-120}" y="{y-30}" width="240" height="60" rx="14" fill="{color}"/>')
    wheel.append(f'<text x="{x}" y="{y+10}" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="29" font-weight="700">{name}</text>')
for i, (name, color, details) in enumerate(parts):
    x = 22 + i * 260
    wheel.append(f'<rect x="{x}" y="880" width="248" height="412" rx="14" fill="#f6f6f6" stroke="{color}" stroke-width="3"/>')
    wheel.append(f'<rect x="{x}" y="880" width="248" height="68" rx="12" fill="{color}"/>')
    wheel.append(f'<text x="{x+124}" y="925" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="27" font-weight="700">{name}</text>')
    for j, detail in enumerate(details):
        # Split at approximately 22 characters to stay inside the narrow cards.
        words = detail.split()
        rows = ['']
        for word in words:
            candidate = (rows[-1] + ' ' + word).strip()
            if len(candidate) > 20 and rows[-1]:
                rows.append(word)
            else:
                rows[-1] = candidate
        y = 987 + j * 60
        for k, row in enumerate(rows):
            wheel.append(f'<text x="{x+124}" y="{y+k*22}" text-anchor="middle" fill="#303030" font-family="Arial,sans-serif" font-size="20">{escape(row)}</text>')
wheel.append('</svg>')
(ROOT / 'approach' / '5h-framework-wheel-pt-br.svg').write_text('\n'.join(wheel), encoding='utf-8')

ring = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 636 636" role="img" aria-labelledby="title">',
        '<title id="title">As cinco dimensões da liderança</title>',
        '<circle cx="318" cy="318" r="255" fill="none" stroke="#eee" stroke-width="95"/>']
for i, (name, color, _) in enumerate(parts):
    ring.append(f'<circle cx="318" cy="318" r="255" fill="none" stroke="{color}" stroke-width="95" stroke-dasharray="320 1602" transform="rotate({-90+i*72} 318 318)"/>')
ring.extend(['<circle cx="318" cy="318" r="205" fill="#fff"/>',
             '<text x="318" y="296" text-anchor="middle" font-family="Arial,sans-serif" font-size="56" font-weight="700" fill="#d93632">5H</text>',
             '<text x="318" y="341" text-anchor="middle" font-family="Arial,sans-serif" font-size="23" font-weight="700" fill="#333">LIDERANÇA</text>',
             '<text x="318" y="377" text-anchor="middle" font-family="Arial,sans-serif" font-size="23" font-weight="700" fill="#333">INTEGRADA</text>', '</svg>'])
(ROOT / 'approach-5h-ring-pt-br.svg').write_text('\n'.join(ring), encoding='utf-8')
