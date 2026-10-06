// Interactive request/response flow diagram.
//
// Shows a vertical chain of nodes (You -> Frontend -> API -> Backend ->
// Database). A moving dot represents the request travelling down, then the
// response travelling back up. Learners can:
//   - press Play to watch the whole journey,
//   - press "Next step" to move one hop at a time,
//   - click any node to hear what it does,
//   - reset and replay.
// All state is local React state; timers are cleaned up on unmount and the
// parent can trigger a run via `runKey` (used by the "Add Todo" button).
import { useCallback, useEffect, useRef, useState } from "react";

const SEGMENT_MS = 650;
const PAUSE_MS = 400;

const ACCENTS = {
  sky: {
    node: "border-sky-400/40 bg-sky-400/10 text-sky-200",
    chip: "bg-sky-400/15 text-sky-300 border-sky-400/40",
    ring: "ring-sky-400/60",
  },
  cyan: {
    node: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
    chip: "bg-cyan-400/15 text-cyan-300 border-cyan-400/40",
    ring: "ring-cyan-400/60",
  },
  blue: {
    node: "border-blue-400/40 bg-blue-500/10 text-blue-200",
    chip: "bg-blue-500/15 text-blue-300 border-blue-400/40",
    ring: "ring-blue-400/60",
  },
  violet: {
    node: "border-violet-400/40 bg-violet-500/10 text-violet-200",
    chip: "bg-violet-500/15 text-violet-300 border-violet-400/40",
    ring: "ring-violet-400/60",
  },
  fuchsia: {
    node: "border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-200",
    chip: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/40",
    ring: "ring-fuchsia-400/60",
  },
};

function accentFor(name) {
  return ACCENTS[name] || ACCENTS.blue;
}

export default function FlowDiagram({
  hops,
  runKey = 0,
  onComplete,
  onPhaseChange,
  requestLabel,
  responseLabel,
  completeText,
}) {
  const last = hops.length - 1;
  const [active, setActive] = useState(0);
  const [segment, setSegment] = useState(-1);
  const [direction, setDirection] = useState("down");
  const [phase, setPhase] = useState("idle"); // idle | running | response | done
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);

  const tokenRef = useRef(0);
  const reachedBottomRef = useRef(false);
  const completedRef = useRef(false);
  const activeRef = useRef(0);
  const directionRef = useRef("down");
  // Guard so the runKey effect fires exactly once per new key - `run` can
  // gain a new identity whenever the parent re-renders (inline onComplete),
  // and we must never auto-run the flow again because of that alone.
  const lastRunKeyRef = useRef(runKey);

  activeRef.current = active;
  directionRef.current = direction;

  const notifyPhase = useCallback(
    (next) => {
      setPhase(next);
      onPhaseChange?.(next);
    },
    [onPhaseChange]
  );

  const finish = useCallback(() => {
    setSegment(-1);
    notifyPhase("done");
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [notifyPhase, onComplete]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const run = useCallback(async () => {
    const token = ++tokenRef.current;
    setBusy(true);
    completedRef.current = false;
    reachedBottomRef.current = false;
    setActive(0);
    setDirection("down");
    setSegment(-1);
    notifyPhase("running");
    await sleep(PAUSE_MS);
    for (let i = 0; i < last; i += 1) {
      if (tokenRef.current !== token) return;
      setSegment(i);
      await sleep(SEGMENT_MS);
      if (tokenRef.current !== token) return;
      setActive(i + 1);
      if (i + 1 === last) reachedBottomRef.current = true;
    }
    if (tokenRef.current !== token) return;
    setSegment(-1);
    await sleep(PAUSE_MS);
    if (tokenRef.current !== token) return;
    notifyPhase("response");
    setDirection("up");
    await sleep(PAUSE_MS / 2);
    for (let i = last - 1; i >= 0; i -= 1) {
      if (tokenRef.current !== token) return;
      setSegment(i);
      await sleep(SEGMENT_MS);
      if (tokenRef.current !== token) return;
      setActive(i);
    }
    if (tokenRef.current !== token) return;
    setBusy(false);
    finish();
  }, [last, notifyPhase, finish]);

  const stepOnce = useCallback(async () => {
    if (busy || phase === "done") return;
    const token = ++tokenRef.current;
    setBusy(true);
    const wasIdle = phase === "idle";

    const startDir = directionRef.current;
    const startActive = activeRef.current;
    let shouldFinish = false;

    if (startDir === "down") {
      // Hop one node downward.
      setSegment(startActive);
      await sleep(SEGMENT_MS);
      if (tokenRef.current !== token) return;
      const nextActive = Math.min(startActive + 1, last);
      setActive(nextActive);
      if (nextActive >= last) {
        reachedBottomRef.current = true;
        setDirection("up");
        notifyPhase("response");
      }
    } else if (startActive > 0) {
      // Hop one node upward (response travelling back).
      setSegment(startActive - 1);
      await sleep(SEGMENT_MS);
      if (tokenRef.current !== token) return;
      const nextActive = startActive - 1;
      setActive(nextActive);
      if (nextActive === 0) shouldFinish = true;
    }

    if (tokenRef.current !== token) return;
    setSegment(-1);
    setBusy(false);

    if (shouldFinish) finish();
    else if (wasIdle) notifyPhase("running");
  }, [busy, phase, last, notifyPhase, finish]);

  const reset = useCallback(() => {
    tokenRef.current += 1;
    setBusy(false);
    completedRef.current = false;
    reachedBottomRef.current = false;
    setActive(0);
    setSegment(-1);
    setDirection("down");
    notifyPhase("idle");
  }, [notifyPhase]);

  // Trigger a full run from outside (e.g. the "Add Todo" button).
  useEffect(() => {
    if (runKey !== lastRunKeyRef.current) {
      lastRunKeyRef.current = runKey;
      if (runKey > 0) run();
    }
  }, [runKey, run]);

  useEffect(
    () => () => {
      tokenRef.current += 1;
    },
    []
  );

  const shownHop = selected != null ? selected : active;
  const hop = hops[shownHop];
  const accent = accentFor(hop.accent);
  const phaseLabel =
    phase === "done"
      ? "Done - the answer reached you"
      : phase === "response" || (direction === "up" && phase !== "idle")
        ? responseLabel
        : requestLabel;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex w-full flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={busy}
          className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-wait disabled:opacity-60"
        >
          {busy ? "Playing..." : "▶  Play the flow"}
        </button>
        <button
          type="button"
          onClick={stepOnce}
          disabled={busy || phase === "done"}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ▸ Next step
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-400 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          ↻ Reset
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        <span
          className={`h-2 w-2 rounded-full ${
            phase === "response"
              ? "bg-cyan-400"
              : phase === "done"
                ? "bg-emerald-400"
                : "bg-sky-400"
          }`}
        />
        {phase === "idle" ? "Idle - press Play or Next step" : phaseLabel}
      </div>

      <div
        className="w-full max-w-md"
        role="group"
        aria-label="Request and response flow diagram"
      >
        {hops.map((node, index) => {
          const nodeAccent = accentFor(node.accent);
          const isActive = index === active;
          const isVisited = index <= active && phase !== "idle";
          return (
            <div key={node.id}>
              <button
                type="button"
                onClick={() =>
                  setSelected((current) => (current === index ? null : index))
                }
                aria-pressed={selected === index}
                aria-label={`${node.name}: ${node.tagline}`}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${nodeAccent.node} ${
                  isActive ? `ring-2 ${nodeAccent.ring} node-active` : ""
                } ${isVisited ? "opacity-100" : "opacity-70"}`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border text-lg ${nodeAccent.chip}`}
                  aria-hidden="true"
                >
                  {node.emoji}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white">
                    {node.name}
                  </span>
                  <span className="block truncate text-xs text-slate-300/80">
                    {node.tagline}
                  </span>
                </span>
                {isActive && phase !== "idle" && (
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-white/70">
                    here
                  </span>
                )}
              </button>

              {index < last && (
                <div
                  className="relative mx-auto h-7 w-[2px] bg-slate-700"
                  aria-hidden="true"
                >
                  <span className="absolute -right-1.5 bottom-0 h-0 w-0 border-t-[6px] border-r-[4px] border-l-[4px] border-t-slate-600 border-r-transparent border-l-transparent" />
                  {segment === index && (
                    <span
                      className={`flow-dot ${
                        direction === "up" ? "flow-dot-up" : "flow-dot-down"
                      }`}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-4"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${accent.chip}`}
          >
            {hop.name}
          </span>
          <span className="text-xs text-slate-500">{hop.tagline}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          {selected != null
            ? hop.explanation
            : phase === "idle"
              ? "Click any part, or press Play, to see what each one does."
              : hop.explanation}
        </p>
        <p className="mt-2 rounded-lg bg-slate-950/60 px-3 py-2 text-xs leading-relaxed text-slate-400">
          <span className="font-semibold text-slate-300">Think of it: </span>
          {hop.analogy}
        </p>
        {selected != null && (
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="mt-2 text-xs font-medium text-sky-400 hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            Back to live flow
          </button>
        )}
      </div>

      {phase === "done" && (
        <p className="sd-appear rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-center text-sm font-medium text-emerald-300">
          ✓ {completeText}
        </p>
      )}
    </div>
  );
}
