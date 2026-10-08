// IsItASystem - Lesson 2's judgment check.
//
// Three prompts: is it a system? Tap Yes or No. A wrong pick explains
// why and lets you try again; a right pick locks the answer in. Solve
// all three and a box of parts transforms into a SYSTEM on screen.
// All state is local; parents only receive onSolved.
import { useEffect, useRef, useState } from "react";

export default function IsItASystem({ copy, onSolved }) {
  const [results, setResults] = useState({}); // id -> "right" | "wrong"
  const [shake, setShake] = useState({ id: null, key: 0 });
  const solvedCount = copy.items.filter(
    (item) => results[item.id] === "right"
  ).length;
  const solved = solvedCount === copy.items.length;
  const onSolvedRef = useRef(onSolved);
  onSolvedRef.current = onSolved;

  useEffect(() => {
    if (solved) onSolvedRef.current?.();
  }, [solved]);

  function pick(item, value) {
    const right = (value === "yes") === item.answer;
    if (right) {
      setResults((prev) => ({ ...prev, [item.id]: "right" }));
      return;
    }
    setResults((prev) => ({ ...prev, [item.id]: "wrong" }));
    setShake({ id: item.id, key: Date.now() });
  }

  return (
    <div className="flex flex-col gap-3" role="group" aria-label={copy.heading}>
      {copy.items.map((item, index) => {
        const result = results[item.id];
        const locked = result === "right";
        return (
          <div
            key={item.id}
            className={`rounded-xl border p-4 transition ${
              locked
                ? "border-emerald-400/40 bg-emerald-500/5"
                : "border-slate-800 bg-slate-950/60"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
                  locked
                    ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-300"
                    : "border-slate-700 bg-slate-900 text-slate-400"
                }`}
              >
                {locked ? "✓" : index + 1}
              </span>
              <p className="text-sm font-medium leading-relaxed text-slate-200">
                {item.prompt}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                data-item={item.id}
                data-pick="yes"
                onClick={() => pick(item, "yes")}
                disabled={locked}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed ${
                  locked && item.answer
                    ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-200"
                    : "border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-400/60"
                }`}
              >
                {copy.yes}
              </button>
              <button
                type="button"
                data-item={item.id}
                data-pick="no"
                onClick={() => pick(item, "no")}
                disabled={locked}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed ${
                  locked && !item.answer
                    ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-200"
                    : "border-slate-700 bg-slate-900 text-slate-200 hover:border-red-400/60"
                }`}
              >
                {copy.no}
              </button>
            </div>

            {result && (
              <div
                key={`${item.id}-${result}-${shake.key}`}
                aria-live="polite"
                className={`mt-3 rounded-lg border px-3 py-2 text-xs leading-relaxed ${
                  locked
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                    : "sd-shake border-amber-500/40 bg-amber-500/10 text-amber-100"
                }`}
              >
                <strong className="font-bold">
                  {locked ? "✓ " : "✕ "}
                </strong>
                {locked ? item.right : item.wrong}
              </div>
            )}
          </div>
        );
      })}

      {/* All three solved: watch a pile become a system */}
      {solved && (
        <div aria-live="polite">
          <p className="sd-appear mt-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
            ✓ {copy.solved}
          </p>
          <div className="mt-3 flex flex-wrap items-stretch justify-center gap-3">
            <div className="morph-out rounded-xl border border-slate-700 bg-slate-950/70 p-4 text-center">
              <span className="text-3xl" aria-hidden="true">
                {copy.transform.from.icon}
              </span>
              <p className="mt-1 text-sm font-semibold text-slate-300">
                {copy.transform.from.name}
              </p>
              <p className="text-xs text-slate-500">
                {copy.transform.from.sub}
              </p>
            </div>
            <div className="flex flex-col justify-center gap-2">
              {copy.transform.steps.map((step, index) => (
                <span
                  key={step}
                  className={`morph-in-${["a", "b"][index]} rounded-lg border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-center text-xs font-bold text-sky-200`}
                >
                  {step}
                </span>
              ))}
            </div>
            <div className="morph-in-c rounded-xl border border-emerald-400/60 bg-emerald-400/10 p-4 text-center">
              <span className="text-3xl" aria-hidden="true">
                {copy.transform.to.icon}
              </span>
              <p className="mt-1 text-sm font-extrabold uppercase tracking-wider text-emerald-200">
                {copy.transform.to.name}
              </p>
              <p className="text-xs text-emerald-400">{copy.transform.to.sub}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
