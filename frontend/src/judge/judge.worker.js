// Judge worker: evaluates learner code off the main thread so an infinite
// loop can never freeze the UI. The main thread terminates this worker when
// the time limit is reached (see runJudge.js).
import { JUDGE_SOURCE } from "./judgeSource.js";

const judge = new Function(JUDGE_SOURCE + "\nreturn judge;")();

self.onmessage = (event) => {
  const { code, functionName, mode, testCases } = event.data;

  try {
    const json = judge(code, functionName, JSON.stringify(testCases), mode);
    self.postMessage({ ok: true, outcome: JSON.parse(json) });
  } catch (err) {
    self.postMessage({
      ok: false,
      error: {
        type: "runtime",
        message: (err && err.message) || String(err),
      },
    });
  }
};
