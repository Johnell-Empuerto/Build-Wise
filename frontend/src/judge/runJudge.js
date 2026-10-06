// Main-thread judge runner.
//
// Spawns a fresh module worker per run (the judge replaces globalThis.console
// while executing learner code, so workers are never reused) and enforces the
// time limit by terminating the worker from the main thread - the same
// 3s budget the backend VM uses. On timeout the returned promise rejects with
// the same message the backend sends on HTTP 408, so the UI surfaces it as a
// run error exactly as before.
const SCRIPT_TIMEOUT_MS = 3000;
// Worker boot + module parse time happens outside learner code, so the
// terminate deadline gets a small grace window on top of the 3s budget.
const STARTUP_GRACE_MS = 300;

export function runJudge({ code, functionName, mode, testCases }) {
  const cases = (Array.isArray(testCases) ? testCases : []).map((testCase) => ({
    id: testCase.id,
    input: testCase.input,
    expected_output: testCase.expected_output,
    is_hidden: testCase.is_hidden ? true : false,
  }));

  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./judge.worker.js", import.meta.url), {
      type: "module",
    });

    const timer = setTimeout(() => {
      worker.terminate();
      reject(
        new Error(
          `Time limit exceeded (${SCRIPT_TIMEOUT_MS / 1000}s). Check your code for an infinite loop.`
        )
      );
    }, SCRIPT_TIMEOUT_MS + STARTUP_GRACE_MS);

    worker.onmessage = (event) => {
      clearTimeout(timer);
      worker.terminate();
      const data = event.data;
      if (data && data.ok) {
        resolve(data.outcome);
      } else {
        resolve({
          error: (data && data.error) || {
            type: "runtime",
            message: "The judge returned no result.",
          },
          results: [],
          summary: { total: cases.length, passed: 0, failed: cases.length },
        });
      }
    };

    worker.onerror = (event) => {
      clearTimeout(timer);
      worker.terminate();
      reject(new Error(event.message || "The judge crashed while running your code."));
    };

    worker.postMessage({ code, functionName, mode, testCases: cases });
  });
}
