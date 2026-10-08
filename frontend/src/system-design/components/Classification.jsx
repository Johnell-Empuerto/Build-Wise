// Classification - Lesson 3 stage 15: four situations, one at a time.
// Pick CLIENT or SERVER and get an instant why. Wrong picks keep you on
// the item so the learner re-reads "who is asking?" and tries again.
import { useState } from "react";

export default function Classification({ quiz, onSolved }) {
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type, text }
  const [solvedIds, setSolvedIds] = useState([]);

  const item = quiz.items[index];
  const solved = solvedIds.includes(item.id);
  const isLast = index === quiz.items.length - 1;

  function pick(role) {
    if (solved) return;
    if (role === item.answer) {
      setWrong(false);
      setFeedback({ type: "right", text: item.right });
      setSolvedIds((list) =>
        list.includes(item.id) ? list : [...list, item.id]
      );
    } else {
      setWrong(true);
      setFeedback({ type: "wrong", text: item.wrong });
    }
  }

  function next() {
    if (isLast) {
      onSolved?.();
      return;
    }
    setIndex((i) => i + 1);
    setWrong(false);
    setFeedback(null);
  }

  return (
    <div className="flex flex-col gap-4" role="group" aria-label="Client or server quiz">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Example {index + 1} of {quiz.items.length}
          </p>
          <p className="text-xs font-semibold text-emerald-400">
            {solvedIds.length} solved
          </p>
        </div>

        <div className="mt-3 rounded-xl border border-slate-700 bg-slate-950/70 p-5 text-center">
          <p className="text-base font-semibold text-white sm:text-lg">
            “{item.text}”
          </p>
          <p className="mt-2 text-xs uppercase tracking-wider text-slate-500">
            Client or Server?
          </p>
        </div>

        {!solved && (
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => pick("client")}
              className="rounded-lg border border-sky-400/50 bg-sky-400/10 px-6 py-2.5 text-sm font-bold text-sky-200 transition hover:bg-sky-400/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              {quiz.buttons.client}
            </button>
            <button
              type="button"
              onClick={() => pick("server")}
              className="rounded-lg border border-violet-400/50 bg-violet-400/10 px-6 py-2.5 text-sm font-bold text-violet-200 transition hover:bg-violet-400/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              {quiz.buttons.server}
            </button>
          </div>
        )}

        <div aria-live="polite">
          {feedback && (
            <p
              className={`sd-appear mt-4 rounded-lg border px-4 py-3 text-sm leading-relaxed ${
                feedback.type === "right"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                  : `sd-shake border-amber-500/40 bg-amber-500/10 text-amber-200`
              }`}
            >
              <span
                className={`font-bold ${
                  feedback.type === "right"
                    ? "text-emerald-300"
                    : "text-amber-300"
                }`}
              >
                {feedback.type === "right" ? "✓ Correct! " : ""}
              </span>
              {feedback.text}
            </p>
          )}
        </div>

        {solved && (
          <button
            type="button"
            onClick={next}
            className="sd-appear mt-4 self-center rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            {isLast ? quiz.finishLabel : quiz.nextLabel}
          </button>
        )}
      </div>

      {!feedback && (
        <p className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-center text-xs leading-relaxed text-slate-400">
          💡 Hint: find the one who <span className="text-sky-300">asks</span>{" "}
          - or the one who <span className="text-violet-300">answers</span>.
        </p>
      )}
    </div>
  );
}
