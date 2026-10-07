// RoundTripOrder: build the full round trip of a todo in six slots -
// Frontend -> Backend -> Database going down, then Database -> Backend ->
// Frontend coming back. Parts can repeat (the notebook appears as both the
// last stop down and the first stop back). A wrong click explains what
// really comes next instead of just saying "wrong".
import { useState } from "react";

export default function RoundTripOrder({ challenge, onSolved }) {
  const [placed, setPlaced] = useState([]); // part ids, max slots.length
  const [mistake, setMistake] = useState(null); // { slot, expected, why }
  const [shakeKey, setShakeKey] = useState(0);

  const solved = placed.length === challenge.slots.length;

  function pick(part) {
    if (solved) return;
    const slot = challenge.slots[placed.length];
    if (part.id === slot.id) {
      const next = [...placed, part.id];
      setPlaced(next);
      setMistake(null);
      if (next.length === challenge.slots.length) onSolved?.();
    } else {
      setMistake({
        slot: placed.length + 1,
        expected: challenge.parts.find((p) => p.id === slot.id),
        why: slot.why,
      });
      setShakeKey((key) => key + 1);
    }
  }

  function reset() {
    setPlaced([]);
    setMistake(null);
  }

  const partOf = (id) => challenge.parts.find((p) => p.id === id);

  function Slot({ index }) {
    const id = placed[index];
    const part = id ? partOf(id) : null;
    return (
      <li
        data-slot={index}
        className={`flex min-h-10 min-w-24 items-center justify-center rounded-lg border px-3 py-2 text-sm ${
          part
            ? "border-sky-400/40 bg-sky-400/10 text-sky-200"
            : "border-dashed border-slate-700 bg-slate-950/50 text-slate-600"
        }`}
      >
        {part ? (
          <span className="sd-appear font-medium">
            {part.emoji} {part.label}
          </span>
        ) : (
          <span className="text-xs">{index + 1}.</span>
        )}
      </li>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-base font-semibold text-white">{challenge.prompt}</p>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {challenge.goingLabel}
      </p>
      <ol
        className="mt-2 flex flex-wrap items-center gap-2"
        aria-label="Going down"
      >
        {[0, 1, 2].map((index) => (
          <Slot key={index} index={index} />
        ))}
      </ol>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {challenge.backLabel}
      </p>
      <ol
        className="mt-2 flex flex-wrap items-center gap-2"
        aria-label="Coming back"
      >
        {[3, 4, 5].map((index) => (
          <Slot key={index} index={index} />
        ))}
      </ol>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Click a part
      </p>
      <div className="mt-2 flex flex-wrap gap-2" data-round-trip-pool>
        {challenge.parts.map((part) => (
          <button
            key={part.id}
            type="button"
            data-part={part.id}
            onClick={() => pick(part)}
            disabled={solved}
            className="rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-400/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {part.emoji} {part.label}
          </button>
        ))}
      </div>

      <div aria-live="polite">
        {mistake && !solved && (
          <div
            key={shakeKey}
            className="sd-shake sd-appear mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm"
          >
            <p className="font-semibold text-amber-300">
              {challenge.wrongHeading}
            </p>
            <p className="mt-1 leading-relaxed text-slate-300">
              Next comes slot {mistake.slot}:{" "}
              <span className="font-semibold text-white">
                {mistake.expected.emoji} {mistake.expected.label}
              </span>
              . {mistake.why}
            </p>
          </div>
        )}

        {solved && (
          <div className="sd-appear mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm">
            <p className="font-semibold text-emerald-300">
              {challenge.solvedText}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
              {placed.map((id, index) => {
                const part = partOf(id);
                return (
                  <span key={`${id}-${index}`} className="flex items-center gap-1.5">
                    <span
                      className="sim-pop rounded-md border border-emerald-400/40 bg-slate-950/70 px-2 py-1 font-medium text-slate-200"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      {part.emoji} {part.label}
                    </span>
                    {index < placed.length - 1 && (
                      <span aria-hidden="true" className="text-slate-500">
                        {index < 2 ? "↓" : index === 2 ? "→" : "↑"}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
            <p className="mt-2 leading-relaxed text-slate-300">
              {challenge.solvedBody}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          disabled={placed.length === 0}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-400 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {challenge.reset}
        </button>
        {!solved && placed.length > 0 && (
          <span className="text-xs text-slate-500">
            {placed.length} / {challenge.slots.length} placed
          </span>
        )}
      </div>
    </div>
  );
}
