// Order Challenge: click parts in the order a todo would visit them.
// A wrong click does not just say "wrong" - it explains where the flow
// really goes at that point, then lets the learner try again.
import { useState } from "react";

export default function OrderChallenge({ build, onSolved }) {
  const [picked, setPicked] = useState([]);
  const [mistake, setMistake] = useState(null); // step that should come next
  const [shakeKey, setShakeKey] = useState(0);

  const remaining = build.steps.filter((step) => !picked.includes(step.id));
  const solved = picked.length === build.steps.length;

  function pick(step) {
    if (solved) return;
    const expected = build.steps[picked.length];
    if (step.id === expected.id) {
      const next = [...picked, step.id];
      setPicked(next);
      setMistake(null);
      if (next.length === build.steps.length) onSolved?.();
    } else {
      setMistake(expected);
      setShakeKey((key) => key + 1);
    }
  }

  function reset() {
    setPicked([]);
    setMistake(null);
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-base font-semibold text-white">{build.prompt}</p>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Your flow
      </p>
      <ol
        className="mt-2 flex min-h-16 flex-wrap items-center gap-2 rounded-lg border border-dashed border-slate-700 bg-slate-950/50 p-3"
        aria-label="Your flow so far"
      >
        {picked.length === 0 && (
          <li className="text-sm text-slate-500">
            Empty - click the first part below.
          </li>
        )}
        {picked.map((id, index) => {
          const step = build.steps.find((item) => item.id === id);
          return (
            <li key={id} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-slate-600">
                  ↓
                </span>
          )}
              <span className="sd-appear rounded-lg border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-sm font-medium text-sky-200">
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Available parts
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {remaining.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => pick(step)}
            className="rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-400/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            {step.label}
          </button>
        ))}
      </div>

      <div aria-live="polite">
        {mistake && (
          <div
            key={shakeKey}
            className="sd-shake sd-appear mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm"
          >
            <p className="font-semibold text-amber-300">
              Not the next stop - here is why:
            </p>
            <p className="mt-1 leading-relaxed text-slate-300">
              Next comes <span className="font-semibold text-white">{mistake.label}</span>.{" "}
              {mistake.why}
            </p>
          </div>
        )}
        {solved && (
          <div className="sd-appear mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm">
            <p className="font-semibold text-emerald-300">✓ You built the flow!</p>
            <p className="mt-1 leading-relaxed text-slate-300">{build.solved}</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-400 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          {build.reset}
        </button>
        {picked.length > 0 && !solved && (
          <span className="text-xs text-slate-500">
            {picked.length} / {build.steps.length} placed
          </span>
        )}
      </div>
    </div>
  );
}
