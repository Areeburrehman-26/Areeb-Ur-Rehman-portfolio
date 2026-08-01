/**
 * Per-project animated artwork for the case-study cards.
 *
 * Pure CSS/SVG on the project's own hue — no image files, no GIFs, nothing
 * fetched at runtime. Keyframes live in globals.css; the `.viz` wrapper is what
 * reduced motion switches off.
 */

type Props = { id: string; hue: number };

const tone = (hue: number) => (l: number, a = 1) => `hsla(${hue}, 72%, ${l}%, ${a})`;

/** 01 — finance: a ledger that balances itself, bars breathing under a trend line. */
function FinanceViz({ hue }: { hue: number }) {
  const c = tone(hue);
  const bars = [42, 68, 52, 84, 60, 96, 74, 88];
  return (
    <div className="viz absolute inset-x-6 bottom-8 top-20 flex flex-col justify-end gap-3">
      <svg viewBox="0 0 200 40" className="h-10 w-full" preserveAspectRatio="none">
        <polyline
          points="0,34 28,26 56,30 84,16 112,20 140,8 168,12 200,4"
          fill="none"
          stroke={c(62)}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          strokeDasharray="240"
          style={{ animation: "viz-packet 4s ease-in-out infinite" }}
        />
      </svg>
      <div className="flex h-24 items-end gap-2">
        {bars.map((h, i) => (
          <span
            key={i}
            className="flex-1 origin-bottom rounded-[2px]"
            style={{
              height: `${h}%`,
              background: c(i % 3 === 0 ? 60 : 34, 0.8),
              animation: `viz-bar ${2.4 + (i % 3) * 0.4}s ease-in-out ${i * 0.12}s infinite`,
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.2em] text-ink/40">
        <span>debit</span>
        <span style={{ color: c(65), animation: "viz-blink 2.6s ease-in-out infinite" }}>
          reconciled
        </span>
        <span>credit</span>
      </div>
    </div>
  );
}

/** 02 — journaling: lines writing themselves, insight surfacing underneath. */
function JournalViz({ hue }: { hue: number }) {
  const c = tone(hue);
  const lines = [96, 78, 88, 64, 82];
  return (
    <div className="viz absolute inset-x-6 bottom-8 top-20 flex flex-col justify-center gap-3">
      {lines.map((w, i) => (
        <span
          key={i}
          className="block h-2 origin-left rounded-full"
          style={{
            width: `${w}%`,
            background: c(40, 0.35),
            animation: `viz-type ${3.6}s ease-in-out ${i * 0.45}s infinite`,
          }}
        />
      ))}
      <div
        className="mt-3 flex items-center gap-2 rounded-sm border px-2 py-1.5"
        style={{ borderColor: c(50, 0.35), animation: "viz-float 4s ease-in-out infinite" }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: c(65), animation: "viz-blink 1.8s ease-in-out infinite" }}
        />
        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-ink/45">
          mood · themes · streak
        </span>
      </div>
    </div>
  );
}

/** 03 — RAG: documents scanned, the matching chunk answering. */
function RagViz({ hue }: { hue: number }) {
  const c = tone(hue);
  return (
    <div className="viz absolute inset-x-6 bottom-8 top-20 flex items-center gap-4">
      <div className="relative flex-1 space-y-1.5 overflow-hidden">
        {[100, 82, 92, 70, 88, 76].map((w, i) => (
          <span
            key={i}
            className="block h-1.5 rounded-full"
            style={{ width: `${w}%`, background: c(38, 0.3) }}
          />
        ))}
        <span
          className="absolute inset-x-0 top-0 h-4"
          style={{
            background: `linear-gradient(180deg, transparent, ${c(60, 0.35)}, transparent)`,
            animation: "viz-scan 3.2s linear infinite",
          }}
        />
      </div>
      <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0">
        <circle cx="20" cy="20" r="9" fill="none" stroke={c(60)} strokeWidth="1.5" />
        <line x1="27" y1="27" x2="36" y2="36" stroke={c(60)} strokeWidth="1.5" />
        <circle
          cx="20"
          cy="20"
          r="9"
          fill={c(60, 0.25)}
          style={{ transformOrigin: "20px 20px", animation: "viz-ring 2.6s ease-out infinite" }}
        />
      </svg>
      <div className="flex-1 space-y-1.5">
        <span
          className="block h-1.5 rounded-full"
          style={{ width: "90%", background: c(62, 0.85) }}
        />
        <span
          className="block h-1.5 rounded-full"
          style={{ width: "64%", background: c(62, 0.5) }}
        />
        <span className="block font-mono text-[8px] uppercase tracking-[0.16em] text-ink/40">
          cited · §4.2
        </span>
      </div>
    </div>
  );
}

/** 04 — marketplace: jobs matched to cleaners, links firing in turn. */
function MarketplaceViz({ hue }: { hue: number }) {
  const c = tone(hue);
  const rows = [0, 1, 2, 3];
  return (
    <div className="viz absolute inset-x-6 bottom-8 top-20 flex items-center">
      <svg viewBox="0 0 200 100" className="h-full w-full">
        {rows.map((r) => (
          <g key={r}>
            <circle cx="24" cy={16 + r * 24} r="5" fill={c(45, 0.6)} />
            <circle cx="176" cy={16 + r * 24} r="5" fill={c(45, 0.6)} />
            <line
              x1="30"
              y1={16 + r * 24}
              x2="170"
              y2={16 + ((r + 2) % 4) * 24}
              stroke={c(62)}
              strokeWidth="1"
              style={{ animation: `viz-link 3.2s ease-in-out ${r * 0.5}s infinite` }}
            />
          </g>
        ))}
        <text x="24" y="98" fill={c(60, 0.5)} fontSize="7" fontFamily="monospace">
          JOBS
        </text>
        <text x="150" y="98" fill={c(60, 0.5)} fontSize="7" fontFamily="monospace">
          CLEANERS
        </text>
      </svg>
    </div>
  );
}

/** 05 — voice: live audio levels with a turn-taking indicator. */
function VoiceViz({ hue }: { hue: number }) {
  const c = tone(hue);
  const bars = Array.from({ length: 22 }, (_, i) => i);
  return (
    <div className="viz absolute inset-x-6 bottom-8 top-20 flex flex-col justify-center gap-4">
      <div className="flex h-20 items-center justify-between gap-[3px]">
        {bars.map((i) => (
          <span
            key={i}
            className="w-full rounded-full"
            style={{
              height: "100%",
              background: c(i % 4 === 0 ? 62 : 40, 0.85),
              transform: "scaleY(0.3)",
              animation: `viz-wave ${1 + (i % 5) * 0.22}s ease-in-out ${i * 0.06}s infinite`,
            }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-ink/45">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: c(65), animation: "viz-blink 1.2s ease-in-out infinite" }}
        />
        on call · booking · handoff ready
      </div>
    </div>
  );
}

/** 06 — cooking: ingredients resolving into a plated result. */
function CookingViz({ hue }: { hue: number }) {
  const c = tone(hue);
  const chips = ["eggs", "flour", "chilli", "stock", "lemon"];
  return (
    <div className="viz absolute inset-x-6 bottom-8 top-20 flex flex-col justify-center gap-4">
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, i) => (
          <span
            key={chip}
            className="rounded-full border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.14em]"
            style={{
              borderColor: c(50, 0.4),
              color: c(70),
              animation: `viz-blink 3s ease-in-out ${i * 0.35}s infinite`,
            }}
          >
            {chip}
          </span>
        ))}
      </div>
      <svg viewBox="0 0 120 40" className="h-12 w-full">
        <circle cx="60" cy="26" r="14" fill="none" stroke={c(55, 0.7)} strokeWidth="1.5" />
        <circle cx="60" cy="26" r="7" fill={c(58, 0.35)} />
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${52 + i * 8} 12 q3 -5 0 -9`}
            fill="none"
            stroke={c(65, 0.7)}
            strokeWidth="1.2"
            style={{ animation: `viz-float ${2.4 + i * 0.3}s ease-in-out ${i * 0.25}s infinite` }}
          />
        ))}
      </svg>
    </div>
  );
}

/** 07 — automation: a packet travelling the pipeline on a schedule. */
function AutomationViz({ hue }: { hue: number }) {
  const c = tone(hue);
  const nodes = [20, 70, 120, 170];
  return (
    <div className="viz absolute inset-x-6 bottom-8 top-20 flex items-center">
      <svg viewBox="0 0 190 90" className="h-full w-full">
        <path
          d="M20 60 H70 V30 H120 V60 H170"
          fill="none"
          stroke={c(40, 0.45)}
          strokeWidth="1.5"
        />
        <path
          d="M20 60 H70 V30 H120 V60 H170"
          fill="none"
          stroke={c(66)}
          strokeWidth="2"
          strokeDasharray="18 222"
          style={{ animation: "viz-packet 2.8s linear infinite" }}
        />
        {nodes.map((x, i) => (
          <rect
            key={x}
            x={x - 6}
            y={(i === 1 || i === 2 ? 30 : 60) - 6}
            width="12"
            height="12"
            rx="2"
            fill={c(20)}
            stroke={c(58)}
            strokeWidth="1.2"
            style={{ animation: `viz-blink 2.8s ease-in-out ${i * 0.7}s infinite` }}
          />
        ))}
        <text x="20" y="86" fill={c(60, 0.5)} fontSize="7" fontFamily="monospace">
          SCRAPE → CLEAN → MATCH → PUSH
        </text>
      </svg>
    </div>
  );
}

const MAP: Record<string, (p: { hue: number }) => React.JSX.Element> = {
  finance: FinanceViz,
  journaling: JournalViz,
  "tenant-rag": RagViz,
  marketplace: MarketplaceViz,
  "voice-agent": VoiceViz,
  cooking: CookingViz,
  automation: AutomationViz,
};

export default function ProjectVisual({ id, hue }: Props) {
  const Viz = MAP[id] ?? FinanceViz;
  return <Viz hue={hue} />;
}
