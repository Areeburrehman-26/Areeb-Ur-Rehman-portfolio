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
          synced · photo attached
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
        <text x="16" y="98" fill={c(60, 0.5)} fontSize="7" fontFamily="monospace">
          HOMES
        </text>
        <text x="146" y="98" fill={c(60, 0.5)} fontSize="7" fontFamily="monospace">
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
        on call · booking · summary sent
      </div>
    </div>
  );
}

/** 06 — chatbots: answers from an uploaded knowledge base, then a handoff. */
function ChatViz({ hue }: { hue: number }) {
  const c = tone(hue);
  return (
    <div className="viz absolute inset-x-6 bottom-8 top-20 flex flex-col justify-center gap-2.5">
      {/* visitor asks */}
      <div className="flex justify-end">
        <span
          className="rounded-md rounded-br-sm px-3 py-2"
          style={{ background: c(30, 0.5), animation: "viz-blink 4s ease-in-out infinite" }}
        >
          <span className="block h-1.5 w-16 rounded-full" style={{ background: c(60, 0.5) }} />
        </span>
      </div>

      {/* bot answers from the knowledge base */}
      <div className="flex items-end gap-2">
        <span
          className="h-5 w-5 shrink-0 rounded-full border"
          style={{ borderColor: c(58, 0.7), animation: "viz-blink 2.2s ease-in-out infinite" }}
        />
        <span
          className="flex-1 rounded-md rounded-bl-sm px-3 py-2"
          style={{ background: c(22, 0.6) }}
        >
          <span
            className="block h-1.5 origin-left rounded-full"
            style={{
              width: "88%",
              background: c(62, 0.85),
              animation: "viz-type 3.4s ease-in-out infinite",
            }}
          />
          <span
            className="mt-1.5 block h-1.5 origin-left rounded-full"
            style={{
              width: "56%",
              background: c(62, 0.5),
              animation: "viz-type 3.4s ease-in-out 0.5s infinite",
            }}
          />
        </span>
      </div>

      {/* out of its depth: escalate */}
      <div
        className="mt-1 flex items-center gap-2 rounded-sm border px-2 py-1.5"
        style={{ borderColor: c(55, 0.4), animation: "viz-float 4.5s ease-in-out infinite" }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: c(66), animation: "viz-blink 1.6s ease-in-out infinite" }}
        />
        <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink/45">
          escalated to human · context attached
        </span>
      </div>
    </div>
  );
}

/** 07 — automation: accounts behind rotating proxies, AI picking the next move. */
function AutomationViz({ hue }: { hue: number }) {
  const c = tone(hue);
  const accounts = [22, 50, 78];
  return (
    <div className="viz absolute inset-x-6 bottom-8 top-20 flex items-center">
      <svg viewBox="0 0 190 100" className="h-full w-full">
        {/* the model deciding */}
        <circle cx="26" cy="50" r="13" fill="none" stroke={c(60)} strokeWidth="1.4" />
        <circle
          cx="26"
          cy="50"
          r="13"
          fill="none"
          stroke={c(66)}
          strokeWidth="1"
          style={{ transformOrigin: "26px 50px", animation: "viz-ring 3s ease-out infinite" }}
        />
        <text x="16" y="53" fill={c(70)} fontSize="8" fontFamily="monospace">
          ai
        </text>

        {/* proxy rotation */}
        {accounts.map((y, i) => (
          <g key={y}>
            <path
              d={`M40 50 C70 50, 80 ${y}, 104 ${y}`}
              fill="none"
              stroke={c(40, 0.4)}
              strokeWidth="1.2"
            />
            <path
              d={`M40 50 C70 50, 80 ${y}, 104 ${y}`}
              fill="none"
              stroke={c(66)}
              strokeWidth="1.6"
              strokeDasharray="12 220"
              style={{ animation: `viz-packet ${2.6 + i * 0.5}s linear ${i * 0.6}s infinite` }}
            />
            <rect
              x="104"
              y={y - 6}
              width="14"
              height="12"
              rx="2"
              fill={c(18)}
              stroke={c(55, 0.8)}
              strokeWidth="1"
            />
            <text x="106" y={y + 3} fill={c(68, 0.8)} fontSize="6" fontFamily="monospace">
              px
            </text>
            <circle
              cx="150"
              cy={y}
              r="7"
              fill="none"
              stroke={c(58, 0.9)}
              strokeWidth="1.2"
              style={{ animation: `viz-blink ${3 + i * 0.4}s ease-in-out ${i * 0.5}s infinite` }}
            />
          </g>
        ))}
        <text x="132" y="96" fill={c(60, 0.5)} fontSize="7" fontFamily="monospace">
          ACCOUNTS
        </text>
        <text x="100" y="14" fill={c(60, 0.5)} fontSize="7" fontFamily="monospace">
          PROXIES
        </text>
      </svg>
    </div>
  );
}

const MAP: Record<string, (p: { hue: number }) => React.JSX.Element> = {
  finance: FinanceViz,
  chatbots: ChatViz,
  rag: RagViz,
  voice: VoiceViz,
  automation: AutomationViz,
  journaling: JournalViz,
  marketplace: MarketplaceViz,
};

export default function ProjectVisual({ id, hue }: Props) {
  const Viz = MAP[id] ?? FinanceViz;
  return <Viz hue={hue} />;
}
