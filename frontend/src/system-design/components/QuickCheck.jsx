// Quick Check: multiple choice with teaching feedback for every wrong answer.
// Wrong answers are never dead ends - each one explains WHY it is wrong.
import { useId, useState } from "react";

export default function QuickCheck({ quiz, onCorrect }) {
  // Unique radio-group name per instance so two checks never unselect
  // each other when they render on the same page.
  const [groupName] = useId();
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // {correct, option} | null
  const [tries, setTries] = useState(0);

  const chosen = quiz.options.find((option) => option.id === selected) || null;

  function submit() {
    if (!chosen) return;
    const correct = Boolean(chosen.correct);
    setTries((n) => n + 1);
    setFeedback({ correct, option: chosen });
    if (correct) onCorrect?.();
  }

  function pick(optionId) {
    setSelected(optionId);
    setFeedback(null);
  }

  return (
    <fieldset className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <legend className="sr-only">{quiz.question}</legend>
      <p className="text-base font-semibold text-white">{quiz.question}</p>

      <div className="mt-4 flex flex-col gap-2">
        {quiz.options.map((option) => {
          const isSelected = selected === option.id;
          const isRightPick = feedback?.correct && isSelected;
          const isWrongPick = feedback && !feedback.correct && isSelected;
          return (
            <label
              key={option.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm transition focus-within:ring-2 focus-within:ring-sky-400/60 ${
                isRightPick
                  ? "border-emerald-500/60 bg-emerald-500/10"
                  : isWrongPick
                    ? "border-red-500/60 bg-red-500/10"
                    : isSelected
                      ? "border-sky-400/60 bg-sky-400/10"
                      : "border-slate-700 bg-slate-950/50 hover:border-slate-500"
              }`}
            >
              <input
                type="radio"
                name={groupName}
                value={option.id}
                checked={isSelected}
                onChange={() => pick(option.id)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-sky-400"
              />
              <span className="text-slate-200">{option.text}</span>
            </label>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={!chosen}
          className="rounded-lg bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Check my answer
        </button>
        {!feedback && <span className="text-xs text-slate-500">{quiz.retryHint}</span>}
      </div>

      <div aria-live="polite">
        {feedback && (
          <div
            className={`sd-appear mt-4 rounded-lg border px-4 py-3 text-sm ${
              feedback.correct
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                : "border-amber-500/40 bg-amber-500/10 text-amber-100"
            }`}
          >
            <p className="font-semibold">
              {feedback.correct ? "✓ Correct!" : "✗ Not quite - here is why:"}
            </p>
            <p className="mt-1 leading-relaxed text-slate-300">
              {feedback.option.teach}
            </p>
            {!feedback.correct && (
              <p className="mt-2 text-xs text-amber-300/80">
                Try again - you are one step away. (Attempt {tries})
              </p>
            )}
          </div>
        )}
      </div>
    </fieldset>
  );
}
