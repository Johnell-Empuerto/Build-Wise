// Browser port of backend/src/judge/judge.js (JUDGE_SOURCE).
//
// Same judging logic as the backend: null-prototype-safe comparisons via
// captured intrinsics, console capture for predict_output challenges,
// syntax/setup/runtime error classification, JSON result envelope.
//
// One honest difference: the backend withholds `expected` / `actual` for
// hidden tests before submission. In the browser-only build every test
// travels with the app (see spec - hidden tests are PRACTICE tests, never
// advertised as secure), so both values are always rendered and learners
// can inspect every case.
export const JUDGE_SOURCE = `
function judge(userCode, functionName, casesJson, mode) {
  const reflectApply = Reflect.apply;
  const FunctionCtor = Function;
  const ObjectKeys = Object.keys;
  const hasOwn = Object.prototype.hasOwnProperty;
  const ArrayIsArray = Array.isArray;
  const NumberIsNaN = Number.isNaN;
  const jsonStringify = JSON.stringify;
  const jsonParse = JSON.parse;
  const StringCtor = String;
  const SAFE_NAME = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
  const regexTest = SAFE_NAME.test;
  const arrayJoin = Array.prototype.join;

  const cases = jsonParse(casesJson);
  const results = [];
  let firstError = null;

  function messageOf(err) {
    try {
      if (err && typeof err.message === "string") return err.message;
      return StringCtor(err);
    } catch (e) {
      return "Unknown error";
    }
  }

  function errorTypeOf(err) {
    try {
      return err && err.name === "SyntaxError" ? "syntax" : "runtime";
    } catch (e) {
      return "runtime";
    }
  }

  function render(value) {
    if (typeof value === "string") return value;
    if (value === undefined) return "undefined";
    if (typeof value === "number") {
      if (value !== value) return "NaN";
      if (value === Infinity) return "Infinity";
      if (value === -Infinity) return "-Infinity";
    }
    try {
      const text = jsonStringify(value);
      if (text !== undefined) return text;
    } catch (e) {
      // fall through to String(value)
    }
    try {
      return StringCtor(value);
    } catch (e) {
      return "Unprintable value";
    }
  }

  function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a === "number" && typeof b === "number") {
      if (NumberIsNaN(a) && NumberIsNaN(b)) return true;
    }
    if (a === null || b === null) return false;
    if (typeof a !== typeof b) return false;

    if (ArrayIsArray(a) || ArrayIsArray(b)) {
      if (!ArrayIsArray(a) || !ArrayIsArray(b)) return false;
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i += 1) {
        if (!deepEqual(a[i], b[i])) return false;
      }
      return true;
    }

    if (typeof a === "object") {
      const keysA = ObjectKeys(a);
      const keysB = ObjectKeys(b);
      if (keysA.length !== keysB.length) return false;
      for (let i = 0; i < keysA.length; i += 1) {
        const key = keysA[i];
        if (!reflectApply(hasOwn, b, [key])) return false;
        if (!deepEqual(a[key], b[key])) return false;
      }
      return true;
    }

    return false;
  }

  let capturedLines = null;

  function capture() {
    const parts = [];
    for (let i = 0; i < arguments.length; i += 1) parts[i] = render(arguments[i]);
    let text = parts.length > 0 ? parts[0] : "";
    for (let i = 1; i < parts.length; i += 1) text += " " + parts[i];
    if (capturedLines !== null) {
      capturedLines[capturedLines.length] = text;
    }
  }

  const consoleForLearner = {
    log: capture,
    info: capture,
    warn: capture,
    error: capture,
    debug: capture,
    trace: capture,
  };
  globalThis.console = consoleForLearner;

  function record(entry) {
    results[entry.index - 1] = entry;
  }

  function pack(error) {
    let passedCount = 0;
    for (let i = 0; i < results.length; i += 1) {
      if (results[i] && results[i].passed) passedCount += 1;
    }
    const total = results.length === cases.length ? results.length : cases.length;
    return jsonStringify({
      error: error || null,
      results: results,
      summary: { total: total, passed: passedCount, failed: total - passedCount },
    });
  }

  function compareAndRecord(index, testCase, value, runError) {
    const hidden = testCase.is_hidden ? true : false;
    let passed = false;
    let error = runError;
    if (error === null) {
      try {
        passed = deepEqual(value, testCase.expected_output);
      } catch (err) {
        error = messageOf(err);
        if (!firstError) firstError = error;
      }
    }
    record({
      index: index,
      id: testCase.id,
      hidden: hidden,
      passed: passed,
      expected: render(testCase.expected_output),
      actual: error !== null ? undefined : render(value),
      error: error === null ? null : error,
    });
  }

  if (mode === "console") {
    for (let i = 0; i < cases.length; i += 1) {
      const testCase = cases[i];
      const lines = [];
      capturedLines = lines;
      let error = null;
      try {
        const scriptFn = reflectApply(FunctionCtor, undefined, [userCode]);
        reflectApply(scriptFn, undefined, []);
      } catch (err) {
        error = messageOf(err);
        if (!firstError) firstError = error;
      }
      capturedLines = null;
      const actual = reflectApply(arrayJoin, lines, ["\\n"]);
      compareAndRecord(i + 1, testCase, actual, error);
    }
    return pack(firstError ? { type: "runtime", message: firstError } : null);
  }

  if (!reflectApply(regexTest, SAFE_NAME, [functionName])) {
    return pack({ type: "setup", message: "Invalid function name." });
  }

  let fn = null;
  try {
    const wrapper = reflectApply(FunctionCtor, undefined, [
      userCode +
        "\\n;return typeof " +
        functionName +
        ' === "function" ? ' +
        functionName +
        " : null;",
    ]);
    fn = reflectApply(wrapper, undefined, []);
  } catch (err) {
    return pack({ type: errorTypeOf(err), message: messageOf(err) });
  }

  if (typeof fn !== "function") {
    return pack({
      type: "setup",
      message:
        'Function "' +
        functionName +
        '" was not found. Keep the function name exactly as given.',
    });
  }

  for (let i = 0; i < cases.length; i += 1) {
    const testCase = cases[i];
    const args = ArrayIsArray(testCase.input) ? testCase.input : [testCase.input];

    let value;
    let error = null;
    try {
      value = reflectApply(fn, undefined, args);
      if (value && typeof value.then === "function") {
        error =
          "Promises are not supported: the function must return its result directly.";
        value = undefined;
      }
    } catch (err) {
      error = messageOf(err);
      if (!firstError) firstError = error;
    }

    compareAndRecord(i + 1, testCase, value, error);
  }

  return pack(firstError ? { type: "runtime", message: firstError } : null);
}
`;
