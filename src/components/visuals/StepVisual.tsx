/**
 * Per-step animated artwork for the "how I work" cards. Same rules as
 * ProjectVisual: CSS/SVG only, wrapped in `.viz` so reduced motion stops it.
 */

const ACCENT = "#ff6a1a";
const TEAL = "#2dd4bf";
const DIM = "rgba(233,237,246,0.22)";

/** 01 — map the problem: a sweep finding where the work leaks. */
function MapViz() {
  const nodes = [
    [30, 30],
    [78, 22],
    [58, 58],
    [104, 62],
    [130, 34],
  ];
  return (
    <div className="viz h-full w-full">
      <svg viewBox="0 0 160 90" className="h-full w-full">
        <circle cx="80" cy="45" r="38" fill="none" stroke={DIM} strokeWidth="1" />
        <circle cx="80" cy="45" r="24" fill="none" stroke={DIM} strokeWidth="1" />
        <g style={{ transformOrigin: "80px 45px", animation: "viz-orbit 6s linear infinite" }}>
          <line x1="80" y1="45" x2="80" y2="7" stroke={ACCENT} strokeWidth="1.5" />
        </g>
        {nodes.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="3"
            fill={i === 2 ? ACCENT : TEAL}
            style={{ animation: `viz-blink ${2.4 + i * 0.3}s ease-in-out ${i * 0.4}s infinite` }}
          />
        ))}
        <circle
          cx="58"
          cy="58"
          r="3"
          fill="none"
          stroke={ACCENT}
          strokeWidth="1"
          style={{ transformOrigin: "58px 58px", animation: "viz-ring 2.4s ease-out infinite" }}
        />
      </svg>
    </div>
  );
}

/** 02 — build the spine: layers stacking into a structure. */
function SpineViz() {
  return (
    <div className="viz h-full w-full">
      <svg viewBox="0 0 160 90" className="h-full w-full">
        <line x1="80" y1="12" x2="80" y2="80" stroke={DIM} strokeWidth="1" />
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x="44"
            y={62 - i * 22}
            width="72"
            height="16"
            rx="2"
            fill="rgba(255,255,255,0.04)"
            stroke={i === 0 ? ACCENT : DIM}
            strokeWidth="1.2"
            style={{ animation: `viz-float ${3 + i * 0.4}s ease-in-out ${i * 0.35}s infinite` }}
          />
        ))}
        <circle cx="80" cy="12" r="3" fill={TEAL} style={{ animation: "viz-blink 2s ease-in-out infinite" }} />
        <text x="44" y="88" fill="rgba(233,237,246,0.35)" fontSize="7" fontFamily="monospace">
          DATA · AUTH · WORKFLOW
        </text>
      </svg>
    </div>
  );
}

/** 03 — add AI where it pays: a pulse at the point of return. */
function AiViz() {
  return (
    <div className="viz h-full w-full">
      <svg viewBox="0 0 160 90" className="h-full w-full">
        <path d="M14 68 H60 M100 68 H146" stroke={DIM} strokeWidth="1.2" />
        <path
          d="M14 68 H146"
          stroke={ACCENT}
          strokeWidth="1.6"
          strokeDasharray="16 224"
          style={{ animation: "viz-packet 2.6s linear infinite" }}
        />
        <circle cx="80" cy="68" r="10" fill="none" stroke={ACCENT} strokeWidth="1.4" />
        {[0, 1].map((i) => (
          <circle
            key={i}
            cx="80"
            cy="68"
            r="10"
            fill="none"
            stroke={TEAL}
            strokeWidth="1"
            style={{
              transformOrigin: "80px 68px",
              animation: `viz-ring 2.8s ease-out ${i * 1.4}s infinite`,
            }}
          />
        ))}
        {[30, 55, 105, 130].map((x, i) => (
          <rect
            key={x}
            x={x - 4}
            y="24"
            width="8"
            height="18"
            rx="1"
            fill={TEAL}
            className="origin-bottom"
            style={{
              transformBox: "fill-box",
              transformOrigin: "bottom",
              animation: `viz-bar ${1.8 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/** 04 — hand over something owned: checks landing, keys transferred. */
function HandoverViz() {
  return (
    <div className="viz h-full w-full">
      <svg viewBox="0 0 160 90" className="h-full w-full">
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect
              x="30"
              y={20 + i * 22}
              width="96"
              height="12"
              rx="2"
              fill="rgba(255,255,255,0.04)"
              stroke={DIM}
              strokeWidth="1"
            />
            <path
              d={`M36 ${26 + i * 22} l4 4 l7 -8`}
              fill="none"
              stroke={i === 0 ? ACCENT : TEAL}
              strokeWidth="1.6"
              strokeDasharray="20"
              style={{
                ["--len" as string]: "20",
                animation: `viz-draw 3.2s ease-in-out ${i * 0.6}s infinite`,
              }}
            />
          </g>
        ))}
        <text x="30" y="86" fill="rgba(233,237,246,0.35)" fontSize="7" fontFamily="monospace">
          DOCS · DEPLOY · ACCESS
        </text>
      </svg>
    </div>
  );
}

const MAP: Record<string, () => React.JSX.Element> = {
  map: MapViz,
  spine: SpineViz,
  ai: AiViz,
  hand: HandoverViz,
};

export default function StepVisual({ id }: { id: string }) {
  const Viz = MAP[id] ?? MapViz;
  return <Viz />;
}
