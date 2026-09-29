const SEGMENTS = ["#693274", "#1e3a5f", "#0d7377", "#08764b", "#e5bd0b", "#e07a2f"];

function point(cx: number, cy: number, r: number, degrees: number) {
  const angle = degrees * Math.PI / 180;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function arc(cx: number, cy: number, r: number, start: number, end: number) {
  const from = point(cx, cy, r, start);
  const to = point(cx, cy, r, end);
  return `M ${from.x} ${from.y} A ${r} ${r} 0 ${end - start > 180 ? 1 : 0} 1 ${to.x} ${to.y}`;
}

function arrow(cx: number, cy: number, r: number, degrees: number) {
  const tip = point(cx, cy, r, degrees);
  const base = point(cx, cy, r, degrees - 9);
  const normal = point(0, 0, 8.5, degrees);
  return `${tip.x},${tip.y} ${base.x + normal.x},${base.y + normal.y} ${base.x - normal.x},${base.y - normal.y}`;
}

function arrowRing(cx: number, cy: number, duration: string) {
  return (
    <g className="motion-safe:animate-spin" style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: duration }}>
      {[[-76, 84], [104, 264]].map(([start, end]) => (
        <g key={start}>
          <path d={arc(cx, cy, 151, start, end - 10)} fill="none" stroke="#d91f2b" strokeWidth="17" />
          <polygon points={arrow(cx, cy, 151, end)} fill="#d91f2b" />
        </g>
      ))}
    </g>
  );
}

export default function InnerOuterGame() {
  return (
    <svg viewBox="0 0 760 420" role="img" aria-label="The Inner Game and Outer Game are connected around a shared core" className="mx-auto h-auto w-full max-w-[720px]">
      <circle cx="250" cy="210" r="128" fill="#f1f0f0" />
      <circle cx="510" cy="210" r="128" fill="#f1f0f0" />
      {arrowRing(250, 210, "28s")}
      {arrowRing(510, 210, "32s")}
      <text x="230" y="185" textAnchor="middle" fill="#1f1c1d" fontSize="18" fontWeight="700">INNER GAME</text>
      <text x="230" y="214" textAnchor="middle" fill="#595959" fontSize="14">Who we are and</text>
      <text x="230" y="234" textAnchor="middle" fill="#595959" fontSize="14">how we show up</text>
      <text x="530" y="185" textAnchor="middle" fill="#1f1c1d" fontSize="18" fontWeight="700">OUTER GAME</text>
      <text x="530" y="214" textAnchor="middle" fill="#595959" fontSize="14">Achieving business</text>
      <text x="530" y="234" textAnchor="middle" fill="#595959" fontSize="14">outcomes</text>
      <circle cx="380" cy="210" r="79" fill="#fff" />
      {SEGMENTS.map((color, i) => (
        <path key={color} d={arc(380, 210, 66, -90 + i * 60, -90 + (i + 1) * 60 - 3)} fill="none" stroke={color} strokeWidth="14" />
      ))}
      <circle cx="380" cy="210" r="49" fill="#292729" />
      <text x="380" y="202" textAnchor="middle" fill="#e23b46" fontSize="13" fontWeight="700">CORE</text>
      <text x="380" y="217" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">VALUES · BELIEFS</text>
      <text x="380" y="228" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">DRIVERS</text>
    </svg>
  );
}
