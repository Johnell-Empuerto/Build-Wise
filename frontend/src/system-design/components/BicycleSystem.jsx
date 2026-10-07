// BicycleSystem - Lesson 2's bicycle stage.
//
// One SVG bicycle drawn as five movable parts (frame, wheels, chain,
// pedals, brakes) that serves four lesson stages:
//   assemble - parts scattered; press the button to bolt them together
//   parts    - click a part (chip or the SVG itself) to learn its job
//   run      - press Ride: pedal -> chain -> wheel -> the goal happens
//   remove   - same ride, but removed parts make it fail with teaching
//
// All motion is CSS keyframes (see index.css); React state only decides
// which classes are on. Every state has a text narration for aria-live.
import { useEffect, useRef, useState } from "react";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SPOKES = [0, 30, 60, 90, 120, 150];
const FAIL_ORDER = ["pedals", "chain", "wheel", "brakes"];

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

export default function BicycleSystem({
  mode, // "assemble" | "parts" | "run" | "remove"
  copy = {},
  assembled = true,
  onAssemble,
  parts = [],
  selected = null,
  onSelect,
  explored = [],
  removed = [],
  onToggle,
  onRunEnd,
}) {
  const [phase, setPhase] = useState("idle"); // idle | push | chain | roll | done | fail
  const [busy, setBusy] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [failId, setFailId] = useState(null);
  const tokenRef = useRef(0);

  useEffect(
    () => () => {
      tokenRef.current += 1;
    },
    []
  );

  const isRun = mode === "run" || mode === "remove";

  function finish(ok, part) {
    setPhase(ok ? "done" : "fail");
    setFailId(part);
    setHasRun(true);
    setBusy(false);
    onRunEnd?.({ ok, part });
  }

  // The ride: push -> chain -> roll, stopping at the removed part.
  async function ride() {
    if (busy || !isRun) return;
    const token = ++tokenRef.current;
    setBusy(true);
    setFailId(null);
    setPhase("idle");
    await sleep(80);
    if (tokenRef.current !== token) return;

    const failPart =
      mode === "remove" ? FAIL_ORDER.find((id) => removed.includes(id)) : null;

    const seq = [
      ["push", 950],
      ["chain", 950],
      ["roll", 1550],
    ];
    for (const [step, ms] of seq) {
      setPhase(step);
      await sleep(ms);
      if (tokenRef.current !== token) return;
      if (failPart === step) {
        finish(false, failPart);
        return;
      }
      if (failPart === "brakes" && step === "roll") {
        finish(false, "brakes");
        return;
      }
    }
    finish(true, null);
  }

  const scatter = mode === "assemble" && !assembled;
  const spinning = phase === "roll" || phase === "done";
  const crankOn = phase === "push" || phase === "chain" || phase === "roll";
  const chainOn = phase === "chain" || phase === "roll";

  const partCls = (id, extra = "") =>
    [
      "bike-part",
      `bp-${id === "frame" ? "frame" : id}`,
      mode === "parts" && selected === id ? "bike-hot" : "",
      mode === "remove" && removed.includes(id) ? "bike-gone" : "",
      mode === "parts" ? "bike-clickable" : "",
      phase === "fail" && failId === id ? "sd-shake bike-fail" : "",
      extra,
    ]
      .filter(Boolean)
      .join(" ");

  const partProps = (id) =>
    mode === "parts"
      ? {
          onClick: () => onSelect?.(id),
          style: { cursor: "pointer" },
        }
      : {};

  const chipBase =
    "flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

  let narration = null;
  if (isRun) {
    if (phase === "idle") narration = { tone: "ready", chip: "READY", text: copy.idle };
    else if (phase === "push" || phase === "chain" || phase === "roll")
      narration = { tone: "go", chip: `STEP: ${phase.toUpperCase()}`, text: copy.beats?.[phase] };
    else if (phase === "done")
      narration = { tone: "ok", chip: "GOAL MET", text: copy.done };
    else if (phase === "fail")
      narration = {
        tone: "bad",
        chip: copy.failTitle,
        text: copy.failTexts?.[failId],
      };
  }

  const allExplored =
    mode === "parts" && parts.length > 0 && parts.every((p) => explored.includes(p.id));
  const chosen = parts.find((p) => p.id === selected) || null;

  return (
    <div className="flex flex-col gap-4">
      {isRun && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={ride}
            disabled={busy}
            className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-wait disabled:opacity-60"
          >
            {busy ? copy.busy : hasRun ? copy.again : copy.start}
          </button>
        </div>
      )}

      {mode === "assemble" && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onAssemble?.(!assembled)}
            className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            {assembled ? copy.disassemble : copy.assemble}
          </button>
        </div>
      )}

      {/* The bicycle itself */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 sm:p-4">
        <svg
          viewBox="0 0 440 280"
          className={`bike w-full ${scatter ? "bike-scattered" : ""}`}
          role="img"
          aria-label={copy.svgLabel || "Bicycle diagram"}
        >
          <g className={`bike-assembly ${spinning ? "bike-rolling" : ""}`}>
            {/* Wheels */}
            <g className={partCls("wheel")} {...partProps("wheel")}>
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
            <g className={partCls("frame")} {...partProps("frame")}>
              <g stroke="#94a3b8" strokeWidth="7" strokeLinecap="round" fill="none">
                <line x1="180" y1="100" x2="230" y2="195" />
                <line x1="180" y1="100" x2="300" y2="110" />
                <line x1="230" y1="195" x2="300" y2="110" />
                <line x1="230" y1="195" x2="115" y2="195" />
                <line x1="180" y1="100" x2="115" y2="195" />
                <line x1="300" y1="110" x2="335" y2="195" />
                <line x1="300" y1="110" x2="306" y2="84" />
                <line x1="306" y1="84" x2="332" y2="80" />
              </g>
              <ellipse cx="178" cy="93" rx="24" ry="9" fill="#64748b" />
            </g>

            {/* Brakes */}
            <g className={partCls("brakes")} {...partProps("brakes")}>
              <path
                d="M318 138 Q335 122 352 138"
                stroke="#f59e0b"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M335 128 C 330 108 316 94 306 86"
                stroke="#f59e0b"
                strokeWidth="3"
                fill="none"
              />
              <line x1="306" y1="84" x2="290" y2="76" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
            </g>

            {/* Chain */}
            <g className={partCls("chain")} {...partProps("chain")}>
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
            <g className={partCls("pedals")} {...partProps("pedals")}>
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
      </div>

      {/* Parts mode: chips + explanation */}
      {mode === "parts" && (
        <>
          <div className="flex flex-wrap gap-2">
            {parts.map((part) => {
              const isOn = selected === part.id;
              const seen = explored.includes(part.id);
              return (
                <button
                  key={part.id}
                  type="button"
                  aria-pressed={isOn}
                  onClick={() => onSelect?.(part.id)}
                  className={`${chipBase} ${
                    isOn
                      ? "border-sky-400/60 bg-sky-400/10 text-sky-100"
                      : "border-slate-700 bg-slate-950/60 text-slate-200 hover:border-slate-500"
                  }`}
                >
                  <span aria-hidden="true">{part.emoji}</span>
                  {part.name}
                  {seen && <span className="text-xs text-emerald-400">✓</span>}
                </button>
              );
            })}
          </div>

          <div aria-live="polite">
            {chosen && (
              <div className="sd-appear rounded-xl border border-sky-400/30 bg-sky-400/5 p-4">
                <p className="text-sm font-semibold text-white">
                  {chosen.emoji} {chosen.name} - {chosen.what}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                  <span className="font-semibold text-sky-300">Think of it: </span>
                  {chosen.analogy}
                </p>
              </div>
            )}
            {allExplored ? (
              <p className="sim-pop mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-300">
                ✓ {copy.done}
              </p>
            ) : (
              <p className="mt-3 text-xs text-slate-500">
                {copy.hint}{" "}
                <span className="text-slate-400">
                  ({explored.length} of {parts.length} explored)
                </span>
              </p>
            )}
          </div>
        </>
      )}

      {/* Remove mode: toggle chips */}
      {mode === "remove" && (
        <div className="flex flex-wrap gap-2">
          {(copy.parts || []).map((part) => {
            const isOut = removed.includes(part.id);
            return (
              <button
                key={part.id}
                type="button"
                aria-pressed={!isOut}
                onClick={() => onToggle?.(part.id)}
                className={`${chipBase} ${
                  isOut
                    ? "border-red-500/60 bg-red-500/10 text-red-200"
                    : "border-slate-700 bg-slate-950/60 text-slate-200 hover:border-slate-500"
                }`}
              >
                <span aria-hidden="true">{part.emoji}</span>
                {part.name}
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                  {isOut ? "removed" : "in"}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Ride narration (aria-live for Play/Step users) */}
      {isRun && narration && (
        <div
          aria-live="polite"
          className={`rounded-xl border p-4 ${
            narration.tone === "ok"
              ? "border-emerald-500/40 bg-emerald-500/10"
              : narration.tone === "bad"
                ? "border-red-500/40 bg-red-500/10"
                : narration.tone === "go"
                  ? "border-sky-500/30 bg-sky-500/5"
                  : "border-slate-800 bg-slate-950/70"
          }`}
        >
          <span
            className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              narration.tone === "ok"
                ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                : narration.tone === "bad"
                  ? "border-red-400/40 bg-red-500/10 text-red-300"
                  : "border-sky-400/40 bg-sky-400/10 text-sky-300"
            }`}
          >
            {narration.chip}
          </span>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">
            {narration.text}
          </p>
        </div>
      )}
    </div>
  );
}
