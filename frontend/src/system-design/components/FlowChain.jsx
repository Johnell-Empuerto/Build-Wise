// FlowChain - Lesson 3 stage 16: the complete user -> client -> request ->
// server -> work -> response -> client -> user loop. Chips light up in
// order; the REQUEST and RESPONSE chips send a small dot across themselves
// so the packet stays visible even inside the chain.
import { useEffect, useRef, useState } from "react";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const STEP_MS = 750;

export default function FlowChain({ flow, onDone }) {
  const [index, setIndex] = useState(-1);
  const [running, setRunning] = useState(false);
  const [runCount, setRunCount] = useState(0);
  const [done, setDone] = useState(false);
  const tokenRef = useRef(0);

  useEffect(
    () => () => {
      tokenRef.current += 1;
    },
    []
  );

  async function play() {
    if (running) return;
    const token = ++tokenRef.current;
    setRunning(true);
    setDone(false);
    setIndex(-1);
    for (let i = 0; i < flow.steps.length; i += 1) {
      if (tokenRef.current !== token) return;
      setIndex(i);
      await sleep(STEP_MS);
    }
    if (tokenRef.current !== token) return;
    setRunning(false);
    setDone(true);
    setRunCount((n) => n + 1);
    onDone?.();
  }

  return (
    <div className="flex flex-col gap-4" role="group" aria-label="Full system flow">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={play}
          disabled={running}
          className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-wait disabled:opacity-60"
        >
          {running ? "⏳ Flowing..." : done ? "↻ Replay" : flow.playLabel}
        </button>
      </div>

      <ol className="mx-auto flex w-full max-w-md flex-col items-stretch gap-0">
        {flow.steps.map((step, i) => {
          const active = index === i;
          const passed = index > i || done;
          return (
            <li key={step.id} className="flex flex-col items-center">
              <div
                className={`relative w-full overflow-hidden rounded-xl border px-4 py-3 transition-all duration-300 ${
                  active
                    ? "border-sky-400/70 bg-sky-400/10 shadow-[0_0_14px_2px_rgba(56,189,248,0.35)]"
                    : passed
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-slate-800 bg-slate-950/60"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${
                      active
                        ? "text-sky-300"
                        : passed
                          ? "text-emerald-400"
                          : "text-slate-500"
                    }`}
                  >
                    {step.icon && (
                      <span className="mr-1.5" aria-hidden="true">
                        {step.icon}
                      </span>
                    )}
                    {step.label}
                  </span>
                  {step.spin && active && (
                    <span className="cs-spin text-sm" aria-hidden="true">
                      ⚙️
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-400">
                  {step.body}
                </p>
                {step.dot && active && (
                  <span
                    key={`${runCount}-${i}`}
                    className={`cs-dot ${step.dot === "r" ? "go-r" : "go-l"}`}
                    aria-hidden="true"
                  />
                )}
              </div>
              {i < flow.steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`py-1 text-sm ${
                    index > i || done ? "text-emerald-500" : "text-slate-700"
                  }`}
                >
                  ↓
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-center" aria-live="polite">
        <p className="text-sm font-semibold text-white">
          {index >= 0
            ? flow.steps[Math.min(index, flow.steps.length - 1)].label
            : "Press Play and follow the dot."}
        </p>
        {done && (
          <p className="sim-pop mt-1 text-xs font-bold text-emerald-400">
            ✓ {flow.done}
          </p>
        )}
      </div>
    </div>
  );
}
