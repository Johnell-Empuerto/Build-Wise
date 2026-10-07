// SystemBuilder - Lesson 2's "build it yourself" stage.
//
// Place Frontend -> Backend -> Database in order (wrong clicks teach
// direction), then connect the two lanes (wrong order teaches where the
// message goes). Incomplete states always say what is missing.
// All state is local React state.
import { useState } from "react";

export default function SystemBuilder({ build, onSolved }) {
  const [placed, setPlaced] = useState([]);
  const [links, setLinks] = useState([]);
  const [feedback, setFeedback] = useState(null); // {text, tone, key}
  const [solved, setSolved] = useState(false);

  const order = build.parts.map((part) => part.id);
  const labelById = Object.fromEntries(
    build.parts.map((part) => [part.id, part.name])
  );

  function bad(text) {
    setFeedback({ text, tone: "bad", key: Date.now() });
  }

  function place(id) {
    if (solved || placed.includes(id)) return;
    const expected = order[placed.length];
    if (id !== expected) {
      bad(
        placed.length === 0
          ? build.labels.wrongFirst
          : build.labels.wrongNext
      );
      return;
    }
    setPlaced([...placed, id]);
    setFeedback(null);
  }

  function connect(id) {
    if (solved) return;
    if (placed.length < order.length) {
      setFeedback({
        text: build.labels.placeFirst,
        tone: "info",
        key: Date.now(),
      });
      return;
    }
    if (links.includes(id)) return;
    if (id === "b" && !links.includes("a")) {
      bad(build.labels.linkWrongOrder);
      return;
    }
    const next = [...links, id];
    setLinks(next);
    if (next.length === build.links.length) {
      setSolved(true);
      setFeedback({
        text: build.labels.solved,
        tone: "ok",
        key: Date.now(),
      });
      onSolved?.();
    } else {
      setFeedback(null);
    }
  }

  // Default status: always say what is still missing.
  const remaining = order.filter((id) => !placed.includes(id));
  const defaultStatus =
    placed.length < order.length
      ? `${build.labels.missingNow} ${remaining.map((id) => labelById[id]).join(", ")}.`
      : build.labels.noLinks;
  const status = feedback || {
    text: defaultStatus,
    tone: "info",
    key: 0,
  };

  const chipBase =
    "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-white">{build.heading}</h2>
      <p className="mt-1 text-sm leading-relaxed text-slate-400">
        {build.body}
      </p>

      {/* Slots */}
      <div
        className="mt-4 grid gap-3 sm:grid-cols-3"
        role="group"
        aria-label="System slots"
      >
        {order.map((id, index) => {
          const part = build.parts[index];
          const filled = placed[index] === id;
          return (
            <div
              key={id}
              className={`rounded-xl border p-4 text-center transition ${
                filled
                  ? "border-sky-400/50 bg-sky-400/10"
                  : "border-dashed border-slate-700 bg-slate-950/50"
              }`}
            >
              {filled ? (
                <>
                  <span className="text-2xl" aria-hidden="true">
                    {part.emoji}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {part.name}
                  </p>
                  <p className="text-[11px] text-slate-400">{part.role}</p>
                </>
              ) : (
                <>
                  <span className="text-2xl text-slate-600" aria-hidden="true">
                    {index === placed.length ? "➕" : "·"}
                  </span>
                  <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-600">
                    empty slot
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Connection links (appear once all parts are placed) */}
      {placed.length === order.length && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {build.links.map((link) =>
            links.includes(link.id) ? (
              <span
                key={link.id}
                className="sim-pop flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300"
              >
                🔗 {link.label}
              </span>
            ) : (
              <button
                key={link.id}
                type="button"
                onClick={() => connect(link.id)}
                className={`${chipBase} border-slate-600 bg-slate-950/70 text-slate-200 hover:border-slate-400`}
              >
                🔗 {link.label}
              </button>
            )
          )}
        </div>
      )}

      {/* Pool of unplaced parts */}
      <div className="mt-4 flex flex-wrap gap-2">
        {build.parts
          .filter((part) => !placed.includes(part.id))
          .map((part) => (
            <button
              key={part.id}
              type="button"
              onClick={() => place(part.id)}
              className={`${chipBase} border-slate-700 bg-slate-950/60 text-slate-200 hover:border-slate-500`}
            >
              <span aria-hidden="true">{part.emoji}</span>
              {part.name}
            </button>
          ))}
        {placed.length === order.length && (
          <span className="flex items-center px-2 text-xs text-slate-500">
            All parts placed - now connect them.
          </span>
        )}
      </div>

      {/* Status */}
      <div
        key={status.key}
        aria-live="polite"
        className={`sd-appear mt-4 rounded-xl border px-4 py-3 text-sm ${
          status.tone === "ok"
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
            : status.tone === "bad"
              ? "sd-shake border-amber-500/40 bg-amber-500/10 text-amber-100"
              : "border-slate-700 bg-slate-950/60 text-slate-300"
        }`}
      >
        {status.tone === "ok" ? (
          <p className="font-semibold">✓ {status.text}</p>
        ) : (
          <p>{status.text}</p>
        )}
      </div>

      {/* Reset */}
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => {
            setPlaced([]);
            setLinks([]);
            setFeedback(null);
            setSolved(false);
          }}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          {build.reset}
        </button>
      </div>
    </div>
  );
}
