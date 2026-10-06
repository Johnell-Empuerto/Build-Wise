import { Link } from "react-router-dom";

function TestRow({ result }) {
  const passed = result.passed;

  return (
    <li className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span aria-hidden="true">{passed ? "✓" : "✗"}</span>
        <span
          className={`text-sm font-semibold ${passed ? "text-emerald-400" : "text-red-400"}`}
        >
          Test {result.index}
        </span>
      </div>

      {result.error && (
        <p className="mt-1.5 break-words pl-6 text-xs text-red-400">
          {result.error}
        </p>
      )}

      {!result.error && !passed && (
        <div className="mt-1.5 space-y-0.5 pl-6 text-xs text-slate-400">
          <p>
            <span className="text-slate-500">Expected:</span>{" "}
            <code className="text-slate-200">{result.expected}</code>
          </p>
          <p>
            <span className="text-slate-500">Received:</span>{" "}
            <code className="text-slate-200">{result.actual}</code>
          </p>
        </div>
      )}

      {!result.error && passed && (
        <div className="mt-1.5 pl-6 text-xs text-slate-500">
          <span className="text-slate-500">Expected:</span>{" "}
          <code className="text-slate-300">{result.expected}</code>
        </div>
      )}
    </li>
  );
}

const ERROR_TITLES = {
  syntax: "Syntax Error",
  setup: "Function Not Found",
  runtime: "Runtime Error",
};

function NextChallengePanel({
  nextState,
  onRunAgain,
  onNextChallenge,
  onNextRetry,
}) {
  if (nextState?.status === "complete") {
    return (
      <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5">
        <p className="text-lg font-bold text-emerald-400">
          You've completed the current JavaScript curriculum!
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Revisit any concept to keep practising.{" "}
          <Link
            to="/topics"
            className="font-semibold text-emerald-400 transition hover:text-emerald-300"
          >
            Back to topics &rarr;
          </Link>
        </p>
      </div>
    );
  }

  if (nextState?.status === "error") {
    return (
      <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5">
        <p className="text-sm font-semibold text-amber-300">
          Could not load the next challenge.
        </p>
        <p className="mt-0.5 break-words text-xs text-amber-200/70">
          {nextState.error}
        </p>
        <button
          type="button"
          onClick={onNextRetry}
          className="mt-2 rounded-lg border border-amber-500/40 px-3 py-1.5 text-xs font-semibold text-amber-200 transition hover:bg-amber-500/20"
        >
          Try Again
        </button>
      </div>
    );
  }

  const loading = nextState?.status === "loading";

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onNextChallenge}
        disabled={loading}
        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? "Choosing next challenge..." : "Next Challenge →"}
      </button>
      <button
        type="button"
        onClick={onRunAgain}
        className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
      >
        Run Again
      </button>
    </div>
  );
}

export default function TestResults({
  outcome,
  nextState,
  onRunAgain,
  onNextChallenge,
  onNextRetry,
}) {
  if (!outcome) return null;

  const { error, results, summary } = outcome;
  const allPassed = summary.total > 0 && summary.failed === 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        Test Results
      </h3>

      {error && (
        <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5">
          <p className="text-sm font-semibold text-red-400">
            {ERROR_TITLES[error.type] || "Error"}
          </p>
          <p className="mt-1 break-words text-sm text-red-300/90">{error.message}</p>
        </div>
      )}

      {results.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {results.map((result) => (
            <TestRow key={result.id ?? result.index} result={result} />
          ))}
        </ul>
      )}

      <div className="mt-4 border-t border-slate-800 pt-3">
        <p className="text-sm font-semibold text-slate-300">
          {summary.passed} / {summary.total} tests passed
        </p>

        {allPassed ? (
          <div className="mt-2">
            <p className="text-lg font-bold text-emerald-400">
              ✓ Challenge Passed!
            </p>
            <NextChallengePanel
              nextState={nextState}
              onRunAgain={onRunAgain}
              onNextChallenge={onNextChallenge}
              onNextRetry={onNextRetry}
            />
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-lg font-bold text-red-400">✗ Not quite</p>
            <p className="mt-1 text-sm text-slate-400">
              Review the failing tests above and try again.
            </p>
            <button
              type="button"
              onClick={onRunAgain}
              className="mt-3 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Run Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
