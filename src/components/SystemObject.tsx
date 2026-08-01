"use client";

import { capabilities } from "@/lib/content";

const W = 300; // slab width
const H = 40; // slab height
const D = 120; // slab depth
const GAP = 18;

const ACCENTS = ["#ff6a1a", "#2dd4bf", "#a78bfa", "#ff6a1a", "#2dd4bf", "#a78bfa"];

function Face({
  w,
  h,
  transform,
  style,
  className = "",
  children,
}: {
  w: number;
  h: number;
  transform: string;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`absolute left-1/2 top-1/2 ${className}`}
      style={{
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
        transform,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** One rack unit — a real six-face box so rotation reads as depth, not skew. */
function Slab({
  index,
  label,
  icon,
  active,
}: {
  index: number;
  label: string;
  icon: string;
  active: boolean;
}) {
  const accent = ACCENTS[index % ACCENTS.length];
  // Index 0 sits at the bottom so the rack builds upward as chapters advance.
  const y = ((capabilities.length - 1) / 2 - index) * (H + GAP);

  return (
    // Positioned with margins, never transforms, so GSAP fully owns the
    // transform on the inner [data-slab] node.
    <div
      className="preserve-3d absolute left-1/2 top-1/2"
      style={{ width: W, height: H, marginLeft: -W / 2, marginTop: y - H / 2 }}
    >
      <div data-slab={index} className="preserve-3d absolute inset-0">
        {/* front */}
        <Face
          w={W}
          h={H}
          transform={`translateZ(${D / 2}px)`}
          className="flex items-center gap-2 rounded-[3px] border px-3"
          style={{
            backfaceVisibility: "hidden",
            borderColor: active ? accent : "rgba(233,237,246,0.14)",
            background: active
              ? `linear-gradient(100deg, rgba(255,255,255,0.10), ${accent}22)`
              : "linear-gradient(100deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
            boxShadow: active ? `0 0 26px ${accent}44` : "none",
            transition: "border-color 220ms, box-shadow 220ms, background 220ms",
          }}
        >
          <span
            className="grid h-5 w-5 shrink-0 place-items-center rounded-[2px] text-[11px]"
            style={{
              color: active ? "#050506" : accent,
              background: active ? accent : `${accent}22`,
              transition: "background 220ms, color 220ms",
            }}
          >
            {icon}
          </span>
          <span className="truncate font-mono text-[9px] uppercase tracking-[0.18em] text-ink/80">
            {label}
          </span>
          <span className="ml-auto flex gap-1">
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                className="h-1 w-1 rounded-full"
                style={{
                  background: active ? accent : "rgba(233,237,246,0.25)",
                  transition: "background 220ms",
                }}
              />
            ))}
          </span>
        </Face>

        {/* back - a rear panel with vents and ports, seen once past 90° */}
        <Face
          w={W}
          h={H}
          transform={`translateZ(${-D / 2}px) rotateY(180deg)`}
          className="flex items-center gap-2 rounded-[3px] border border-white/10 bg-white/[0.03] px-3"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="flex gap-1">
            {[0, 1].map((d) => (
              <span
                key={d}
                className="h-3 w-4 rounded-[1px] border border-white/15 bg-black/40"
              />
            ))}
          </span>
          <span
            className="h-3 flex-1 rounded-[1px]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(233,237,246,0.16) 0 1px, transparent 1px 4px)",
            }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: active ? accent : "rgba(233,237,246,0.2)" }}
          />
        </Face>

        {/* top */}
        <Face
          w={W}
          h={D}
          transform={`rotateX(90deg) translateZ(${H / 2}px)`}
          className="rounded-[3px] border border-white/10"
          style={{
            background: active
              ? `linear-gradient(180deg, ${accent}33, rgba(255,255,255,0.04))`
              : "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
            transition: "background 220ms",
          }}
        />

        {/* bottom */}
        <Face
          w={W}
          h={D}
          transform={`rotateX(-90deg) translateZ(${H / 2}px)`}
          className="rounded-[3px] bg-black/50"
        />

        {/* sides */}
        <Face
          w={D}
          h={H}
          transform={`rotateY(90deg) translateZ(${W / 2}px)`}
          className="rounded-[3px] border border-white/10 bg-white/[0.05]"
        />
        <Face
          w={D}
          h={H}
          transform={`rotateY(-90deg) translateZ(${W / 2}px)`}
          className="rounded-[3px] border border-white/10 bg-white/[0.05]"
        />
      </div>
    </div>
  );
}

/**
 * The "system being built": a rack of capability units that assemble as the
 * scrub timeline advances, with a light plate under it and orbiting nodes.
 * GSAP targets `[data-rack]`, `[data-slab]`, `[data-light]`.
 */
export default function SystemObject({ active }: { active: number }) {
  return (
    <div className="scene relative h-full w-full origin-center scale-[0.55] select-none sm:scale-[0.72] md:scale-[0.85] lg:scale-100">
      <div
        data-rack
        className="preserve-3d absolute left-1/2 top-1/2 h-0 w-0"
        style={{ transform: "rotateX(-14deg) rotateY(-34deg)" }}
      >
        {/* floor plate */}
        <Face
          w={440}
          h={440}
          transform={`rotateX(90deg) translateZ(${-((capabilities.length - 1) * (H + GAP)) / 2 - H}px)`}
          className="rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,106,26,0.12), transparent 65%)",
            filter: "blur(10px)",
          }}
        />

        {capabilities.map((c, i) => (
          <Slab
            key={c.id}
            index={i}
            label={c.chapter.split("/")[1]?.trim() ?? c.id}
            icon={c.icon}
            active={i === active}
          />
        ))}

        {/* orbiting nodes - small cubes that read as data moving through */}
        {[0, 1, 2, 3].map((n) => (
          <div
            key={n}
            className="preserve-3d absolute left-1/2 top-1/2"
            style={{
              transform: `rotateY(${n * 90}deg) translateZ(260px) translateY(${
                -60 + n * 34
              }px)`,
            }}
          >
            <span
              className="block h-2.5 w-2.5 rounded-[2px]"
              style={{
                background: ACCENTS[n % ACCENTS.length],
                boxShadow: `0 0 14px ${ACCENTS[n % ACCENTS.length]}`,
                opacity: 0.85,
              }}
            />
          </div>
        ))}
      </div>

      {/* key light - GSAP moves and brightens this across the timeline */}
      <div
        data-light
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(420px 420px at 30% 25%, rgba(255,255,255,0.14), transparent 70%)",
          opacity: 0.7,
        }}
      />
    </div>
  );
}
