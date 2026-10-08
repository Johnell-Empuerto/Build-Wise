// BicycleBreak - Lesson 2's "remove a part" experience.
//
// Pull out the Wheel, Chain, Pedal, or Handlebar: the bicycle shakes,
// fades the missing piece, and says exactly what was lost. Restore all
// puts everything back. Every part ever removed is reported upward so the
// lesson can celebrate breaking it three different ways.
import { useState } from "react";
import BicycleSvg from "./BicycleSvg.jsx";

export default function BicycleBreak({ copy, onRemove }) {
  const [removed, setRemoved] = useState([]);
  const [shakeKey, setShakeKey] = useState(0);
  const [note, setNote] = useState({ kind: "idle" }); // idle | fail | restored

  const allIn = removed.length === 0;

  function remove(id) {
    if (removed.includes(id)) return;
    setRemoved([...removed, id]);
    setNote({ kind: "fail", part: id });
    setShakeKey((key) => key + 1);
    onRemove?.(id);
  }

  function restoreAll() {
    if (allIn) return;
    setRemoved([]);
    setNote({ kind: "restored" });
  }

  const chipBase =
    "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col gap-4" role="group" aria-label="Break the bicycle">
      {/* Remove controls */}
      <div className="flex flex-wrap gap-2">
        {copy.parts.map((part) => {
          const isOut = removed.includes(part.id);
          return (
            <button
              key={part.id}
              type="button"
              data-remove={part.id}
              aria-pressed={!isOut}
              onClick={() => remove(part.id)}
              disabled={isOut}
              className={`${chipBase} ${
                isOut
                  ? "border-red-500/60 bg-red-500/10 text-red-200 opacity-80"
                  : "border-slate-700 bg-slate-950/60 text-slate-200 hover:border-red-400/60 hover:text-red-100"
              }`}
            >
              <span aria-hidden="true">{part.emoji}</span>
              {isOut ? `${part.name} removed` : `Remove ${part.name}`}
            </button>
          );
        })}
        <button
          type="button"
          data-restore
          onClick={restoreAll}
          disabled={allIn}
          className={`${chipBase} border-emerald-500/50 bg-emerald-500/10 text-emerald-200 hover:border-emerald-400`}
        >
          ↻ {copy.restore}
        </button>
      </div>

      {/* The bicycle shakes each time a part comes out */}
      <div
        key={shakeKey}
        className={`rounded-xl border border-slate-800 bg-slate-950/60 p-3 sm:p-4 ${
          shakeKey > 0 ? "sd-shake" : ""
        }`}
      >
        <BicycleSvg gone={removed} label={copy.svgLabel} />
      </div>

      {/* Narration (aria-live so every failure is announced) */}
      <div
        className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
        aria-live="polite"
      >
        {note.kind === "fail" ? (
          <div className="sd-appear">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded border border-red-400/40 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-300">
                {copy.failTitle}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {copy.parts.find((p) => p.id === note.part)?.name}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">
              {copy.failTexts[note.part]}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Press <span className="font-semibold text-emerald-300">{copy.restore}</span> to put
              the parts back - or break another one.
            </p>
          </div>
        ) : note.kind === "restored" ? (
          <div className="sd-appear">
            <span className="rounded border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              ✓ RESTORED
            </span>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">
              {copy.restored}
            </p>
          </div>
        ) : (
          <div>
            <span className="rounded border border-sky-400/40 bg-sky-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-300">
              READY
            </span>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {copy.idle}
            </p>
          </div>
        )}
        {removed.length > 0 && (
          <p className="mt-2 text-[11px] text-slate-500">{copy.legend}</p>
        )}
      </div>
    </div>
  );
}
