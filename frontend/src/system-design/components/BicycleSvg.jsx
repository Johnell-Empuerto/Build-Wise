// BicycleSvg - the shared five-part bicycle drawing for Lesson 2.
//
// Frame, wheels, chain, pedals, and handlebar are separate groups so the
// story can glow them one at a time and the break section can fade one
// out. All motion is CSS keyframes (see index.css); React only decides
// which classes are on.
const SPOKES = [0, 30, 60, 90, 120, 150];

function spokeLines(cx, cy, r) {
  return SPOKES.map((angle) => {
    const rad = (angle * Math.PI) / 180;
    const dx = Math.cos(rad) * (r - 8);
    const dy = Math.sin(rad) * (r - 8);
    return (
      <line
        key={angle}
        x1={cx - dx}
        y1={cy - dy}
        x2={cx + dx}
        y2={cy + dy}
        stroke="#475569"
        strokeWidth="2.5"
      />
    );
  });
}

export default function BicycleSvg({
  hot = [],
  gone = [],
  spinning = false,
  label = "Bicycle diagram",
}) {
  const partCls = (id) =>
    ["bike-part", `bp-${id}`, hot.includes(id) ? "bike-hot" : "", gone.includes(id) ? "bike-gone" : ""]
      .filter(Boolean)
      .join(" ");

  const crankOn = spinning;
  const chainOn = spinning;

  return (
    <svg
      viewBox="0 0 440 280"
      className="bike w-full"
      role="img"
      aria-label={label}
    >
      <g className="bike-assembly">
        {/* Wheels */}
        <g className={partCls("wheel")}>
          <circle cx="115" cy="195" r="62" fill="none" stroke="#94a3b8" strokeWidth="7" />
          <g className={`spin-rear ${spinning ? "wheel-spin" : ""}`}>
            {spokeLines(115, 195, 62)}
            <circle cx="115" cy="195" r="6" fill="#64748b" />
          </g>
          <circle cx="335" cy="195" r="62" fill="none" stroke="#94a3b8" strokeWidth="7" />
          <g className={`spin-front ${spinning ? "wheel-spin" : ""}`}>
            {spokeLines(335, 195, 62)}
            <circle cx="335" cy="195" r="6" fill="#64748b" />
          </g>
        </g>

        {/* Frame */}
        <g className={partCls("frame")}>
          <g stroke="#94a3b8" strokeWidth="7" strokeLinecap="round" fill="none">
            <line x1="180" y1="100" x2="230" y2="195" />
            <line x1="180" y1="100" x2="300" y2="110" />
            <line x1="230" y1="195" x2="300" y2="110" />
            <line x1="230" y1="195" x2="115" y2="195" />
            <line x1="180" y1="100" x2="115" y2="195" />
            <line x1="300" y1="110" x2="335" y2="195" />
          </g>
          <ellipse cx="178" cy="93" rx="24" ry="9" fill="#64748b" />
        </g>

        {/* Handlebar */}
        <g className={partCls("handlebar")}>
          <g stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" fill="none">
            <line x1="300" y1="110" x2="306" y2="84" />
            <line x1="294" y1="86" x2="342" y2="80" />
          </g>
          <line
            x1="336"
            y1="76"
            x2="346"
            y2="74"
            stroke="#cbd5e1"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </g>

        {/* Chain */}
        <g className={partCls("chain")}>
          <circle cx="115" cy="195" r="15" fill="none" stroke="#cbd5e1" strokeWidth="4" />
          <g
            className={`chain-run ${chainOn ? "chain-run-on" : ""}`}
            stroke="#cbd5e1"
            strokeWidth="4"
            strokeLinecap="round"
          >
            <line x1="230" y1="170" x2="115" y2="181" />
            <line x1="230" y1="220" x2="115" y2="209" />
          </g>
        </g>

        {/* Pedals (crankset) */}
        <g className={partCls("pedals")}>
          <g className={`crank ${crankOn ? "crank-spin" : ""}`}>
            <circle cx="230" cy="195" r="26" fill="none" stroke="#cbd5e1" strokeWidth="4" />
            <line x1="230" y1="195" x2="230" y2="248" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
            <rect x="214" y="244" width="34" height="12" rx="3" fill="#94a3b8" />
          </g>
        </g>

        {/* Speed lines while moving */}
        {spinning && (
          <g className="speed-lines" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" opacity="0.75">
            <line x1="8" y1="140" x2="70" y2="140" />
            <line x1="2" y1="185" x2="58" y2="185" />
            <line x1="12" y1="230" x2="66" y2="230" />
          </g>
        )}
      </g>
    </svg>
  );
}
