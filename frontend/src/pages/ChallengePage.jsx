import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getNextChallenge,
  getQuestion,
  runQuestion,
} from "../services/api.js";
import {
  formatCall,
  formatValue,
  formatChallengeType,
  isConsoleChallenge,
} from "../utils/format.js";
import CodeEditor from "../components/CodeEditor.jsx";
import TestResults from "../components/TestResults.jsx";
import DifficultyBadge from "../components/DifficultyBadge.jsx";
import LevelBadge from "../components/LevelBadge.jsx";
import { Loading, ErrorState } from "../components/Status.jsx";

// Real-world descriptions are structured with ALL-CAPS section labels
// (SCENARIO:, RULES:, INPUT:, EXPECTED OUTPUT:, EDGE CASES:). Those lines are
// emphasised as small headings; every other line - including single-sentence
// V1 descriptions - renders as plain paragraph text.
const DESCRIPTION_HEADING = /^[A-Z][A-Z0-9 \-/]*:$/;

function renderDescription(text) {
  const lines = String(text ?? "").split("\n");
  return lines.map((line, index) => {
    const trimmed = line.trim();
    if (trimmed && DESCRIPTION_HEADING.test(trimmed)) {
      return (
        <span
          key={index}
          className="mt-3 block text-xs font-semibold uppercase tracking-wider text-slate-400 first:mt-0"
        >
          {trimmed}
        </span>
      );
    }
    if (trimmed === "") {
      return <span key={index} className="block h-2" />;
    }
    return (
      <span key={index} className="block">
        {line}
      </span>
    );
  });
}

export default function ChallengePage() {
  const { questionId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [exampleTests, setExampleTests] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [code, setCode] = useState("");
  const [starterCode, setStarterCode] = useState("");
  // Which question the current `code`/`starterCode` belong to. Until the
  // freshly requested question reports its starter, the editor is forced to
  // an empty string, so the previous question's code can never appear under
  // the new URL - not even for one frame.
  const [loadedForId, setLoadedForId] = useState(null);
  const [running, setRunning] = useState(false);
  const [outcome, setOutcome] = useState(null);
  const [runError, setRunError] = useState(null);
  const [nextState, setNextState] = useState({ status: "idle", error: null });

  // Every question change starts a new state epoch. Async work started for
  // an older question (a run still being judged, a next-challenge fetch)
  // checks this ref before touching state, so a previous question's result
  // can never land on the current question.
  const epochRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    epochRef.current += 1;

    setQuestion(null);
    setExampleTests([]);
    setLoadError(null);
    setOutcome(null);
    setRunError(null);
    setRunning(false);
    setNextState({ status: "idle", error: null });
    setStarterCode("");
    setLoadedForId(null);
    setCode("");

    getQuestion(questionId)
      .then((questionData) => {
        if (cancelled) return;
        setQuestion(questionData.question);
        setExampleTests(questionData.testCases || []);
        setStarterCode(questionData.question.starter_code || "");
        setCode(questionData.question.starter_code || "");
        setLoadedForId(questionId);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [questionId, reloadKey]);

  // Only the current question's working copy is ever shown or treated as
  // dirty; anything else is an in-flight swap between questions.
  const editorCode = loadedForId === questionId ? code : "";
  const dirty =
    Boolean(question) && loadedForId === questionId && code !== starterCode;

  useEffect(() => {
    if (!dirty) return undefined;

    const handler = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const confirmLeave = useCallback(
    (event) => {
      if (
        dirty &&
        !window.confirm("Leave this challenge? Your unsaved code will be lost.")
      ) {
        event.preventDefault();
      }
    },
    [dirty]
  );

  async function handleRun() {
    if (code.trim() === "") {
      setOutcome(null);
      setNextState({ status: "idle", error: null });
      setRunError("Your code is empty. Write your solution before running.");
      return;
    }

    const epoch = epochRef.current;
    setRunning(true);
    setRunError(null);
    setOutcome(null);
    setNextState({ status: "idle", error: null });

    try {
      const data = await runQuestion(questionId, code);
      if (epochRef.current !== epoch) return;
      setOutcome(data.outcome);
    } catch (err) {
      if (epochRef.current !== epoch) return;
      setRunError(err.message);
    } finally {
      if (epochRef.current === epoch) setRunning(false);
    }
  }

  async function handleNextChallenge() {
    const epoch = epochRef.current;
    setNextState({ status: "loading", error: null });

    try {
      // Step 7.2: tell the backend which challenge was just passed so it
      // continues the current lesson/concept instead of jumping elsewhere.
      const data = await getNextChallenge(questionId);
      if (epochRef.current !== epoch) return;

      if (data.question) {
        navigate(`/questions/${data.question.id}`);
      } else {
        setNextState({ status: "complete", error: null });
      }
    } catch (err) {
      if (epochRef.current !== epoch) return;
      setNextState({ status: "error", error: err.message });
    }
  }

  if (loadError) {
    return (
      <ErrorState
        message={loadError}
        onRetry={() => setReloadKey((key) => key + 1)}
      />
    );
  }

  if (!question) {
    return <Loading label="Loading challenge..." />;
  }

  const consoleMode = isConsoleChallenge(question.challenge_type);

  return (
    <div>
      <nav className="mb-4 text-sm text-slate-500">
        <Link to="/topics" onClick={confirmLeave} className="hover:text-emerald-400">
          Topics
        </Link>
        <span className="mx-2">/</span>
        <Link
          to={`/topics/${question.topic_id}`}
          onClick={confirmLeave}
          className="hover:text-emerald-400"
        >
          {question.topic_name}
        </Link>
        {question.section_id && (
          <>
            <span className="mx-2">/</span>
            <Link
              to={`/sections/${question.section_id}`}
              onClick={confirmLeave}
              className="hover:text-emerald-400"
            >
              {question.section_name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <Link
          to={`/concepts/${question.concept_id}`}
          onClick={confirmLeave}
          className="hover:text-emerald-400"
        >
          {question.concept_name}
        </Link>
        {question.lesson_id && (
          <>
            <span className="mx-2">/</span>
            <Link
              to={`/lessons/${question.lesson_id}`}
              onClick={confirmLeave}
              className="hover:text-emerald-400"
            >
              {question.lesson_title}
            </Link>
          </>
        )}
      </nav>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{question.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={question.difficulty} />
            <LevelBadge level={question.level} />
            <span className="rounded-full border border-slate-700 px-2.5 py-0.5 text-xs text-slate-400">
              {formatChallengeType(question.challenge_type)}
            </span>
            <span className="rounded-full border border-slate-700 px-2.5 py-0.5 text-xs text-slate-400">
              {question.topic_name}
            </span>
            <span className="rounded-full border border-slate-700 px-2.5 py-0.5 text-xs text-slate-400">
              {question.concept_name}
            </span>
          </div>
        </div>
        <span className="shrink-0 text-sm font-medium text-slate-500">
          Challenge {question.id}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <aside className="flex flex-col gap-4">
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Description
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
              {renderDescription(question.description)}
            </p>
            <p className="mt-3 text-xs text-slate-500">
              {consoleMode ? (
                <>
                  Edit the code on the right and run it to see the console
                  output.
                </>
              ) : (
                <>
                  Function to implement:{" "}
                  <code className="text-emerald-400">{question.function_name}</code>
                </>
              )}
            </p>
          </section>

          {exampleTests.length > 0 && (
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Example
              </h2>
              <div className="mt-3 flex flex-col gap-4">
                {exampleTests.map((test) => (
                  <div key={test.id} className="text-sm">
                    {!consoleMode && (
                      <>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Input
                        </p>
                        <code className="mt-1 block break-words text-slate-200">
                          {formatCall(question.function_name, test.input)}
                        </code>
                      </>
                    )}
                    <p
                      className={`text-xs uppercase tracking-wide text-slate-500 ${
                        consoleMode ? "" : "mt-2"
                      }`}
                    >
                      {consoleMode ? "Expected console output" : "Expected"}
                    </p>
                    <pre className="mt-1 whitespace-pre-wrap break-words text-emerald-400">
                      <code>{formatValue(test.expected_output)}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              JavaScript Editor
            </h2>
            <button
              type="button"
              onClick={handleRun}
              disabled={running}
              className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {running ? "Running..." : "Run Code"}
            </button>
          </div>

          {/* Remount the editor per question so Monaco's model, undo stack,
              and scroll position can never carry over between questions. */}
          <CodeEditor
            key={questionId}
            value={editorCode}
            onChange={setCode}
          />

          {runError && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
              {runError}
            </div>
          )}

          {running && (
            <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-400">
              Running tests...
            </div>
          )}

          <TestResults
            outcome={outcome}
            nextState={nextState}
            onRunAgain={handleRun}
            onNextChallenge={handleNextChallenge}
            onNextRetry={handleNextChallenge}
          />
        </section>
      </div>
    </div>
  );
}
