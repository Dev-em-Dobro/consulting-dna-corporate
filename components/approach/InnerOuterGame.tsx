/**
 * Inner Game / Outer Game as two interlocking circles. The chat PNG was a
 * concept, not a delivered final file, so this is drawn from the written spec:
 * red clockwise arrows, Core at the overlap, and a six-colour ring.
 */
const SEGMENTS = ["#693274", "#1e3a5f", "#0d7377", "#08764b", "#e5bd0b", "#e07a2f"];

function ringPath(cx: number, cy: number, r: number, start: number, end: number) {
  const a0 = (start * Math.PI) / 180;
  const a1 = (end * Math.PI) / 180;
  const large = end - start > 180 ? 1 : 0;
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
}

export default function InnerOuterGame() {
  const cx = 380;
  const cy = 210;
  return (
    <svg
      viewBox="0 0 760 420"
      role="img"
      aria-label="Inner Game: who we are and how we show up. Outer Game: achieving business outcomes. At the centre, core values, beliefs and drivers."
      className="mx-auto h-auto w-full max-w-[720px]"
    >
      <defs>
        <marker id="io-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 z" fill="#d84339" />
        </marker>
      </defs>

      <circle cx="250" cy="210" r="150" fill="#f4f4f4" stroke="#d84339" strokeWidth="14" />
      <circle cx="510" cy="210" r="150" fill="#f7f7f7" stroke="#d84339" strokeWidth="14" />

      <path
        d="M 250 60 A 150 150 0 1 1 249 60"
        fill="none"
        stroke="#d84339"
        strokeWidth="14"
        markerEnd="url(#io-arrow)"
      />
      <path
        d="M 510 360 A 150 150 0 1 1 511 360"
        fill="none"
        stroke="#d84339"
        strokeWidth="14"
        markerEnd="url(#io-arrow)"
      />

      {SEGMENTS.map((color, i) => (
        <path
          key={color}
          d={ringPath(cx, cy, 62, -90 + i * 60, -90 + (i + 1) * 60 - 3)}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="butt"
        />
      ))}
      <circle cx={cx} cy={cy} r="46" fill="#1f1c1d" />
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700">
        CORE
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="600">
        VALUES
      </text>
      <text x={cx} y={cy + 18} textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="600">
        BELIEFS
      </text>
      <text x={cx} y={cy + 28} textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="600">
        DRIVERS
      </text>

      <text x="200" y="188" textAnchor="middle" fill="#1f1c1d" fontSize="18" fontWeight="700">
        INNER GAME
      </text>
      <text x="200" y="214" textAnchor="middle" fill="#595959" fontSize="13">
        Who we are and
      </text>
      <text x="200" y="232" textAnchor="middle" fill="#595959" fontSize="13">
        how we show up
      </text>

      <text x="560" y="188" textAnchor="middle" fill="#1f1c1d" fontSize="18" fontWeight="700">
        OUTER GAME
      </text>
      <text x="560" y="214" textAnchor="middle" fill="#595959" fontSize="13">
        Achieving business
      </text>
      <text x="560" y="232" textAnchor="middle" fill="#595959" fontSize="13">
        outcomes
      </text>
    </svg>
  );
}
