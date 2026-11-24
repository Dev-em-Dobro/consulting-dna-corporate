const sectors = [
  { name: "Head", color: "#6d3474" },
  { name: "Heart", color: "#d84238" },
  { name: "Hunch", color: "#b59804" },
  { name: "Hands", color: "#292c69" },
  { name: "Habits", color: "#0b773e" },
];

function point(radius: number, degrees: number) {
  const radians = (degrees - 90) * Math.PI / 180;
  return [120 + radius * Math.cos(radians), 120 + radius * Math.sin(radians)];
}

export default function FrameworkWheel({ decorative = false }: { decorative?: boolean }) {
  return (
    <svg viewBox="0 0 240 240" aria-hidden={decorative || undefined} role={decorative ? undefined : "img"} aria-label="5H" className="mx-auto block h-auto w-full max-w-[360px]">
      {sectors.map(({ name, color }, index) => {
        const angle = index * 72;
        const [x, y] = point(85, angle);
        const arc = `M120 120 L${point(117, angle - 36)} A117 117 0 0 1 ${point(117, angle + 36)} Z`;
        return <g key={name}>
          <path d={arc} fill={color} stroke="white" strokeWidth="2" />
          <text x={x} y={y} transform={decorative ? `rotate(${angle} ${x} ${y})` : undefined} dominantBaseline="central" textAnchor="middle" fill={name === "Hunch" ? "#151515" : "white"} fontWeight="600" fontSize="16">{name}</text>
        </g>;
      })}
      <circle cx="120" cy="120" r="44" fill="white" />
      <text x="120" y="120" dominantBaseline="central" textAnchor="middle" fill="#252525" fontSize="24" fontWeight="700">5H</text>
    </svg>
  );
}
