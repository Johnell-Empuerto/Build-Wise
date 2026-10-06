export function formatValue(value) {
  if (value === undefined) return "—";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

// input is stored as an array of arguments, so render it as a real call:
//   formatCall("getNumbers", [[10, 20]])  ->  getNumbers([10, 20])
export function formatCall(functionName, input) {
  const args = (Array.isArray(input) ? input : [input])
    .map(formatValue)
    .join(", ");

  return `${functionName}(${args})`;
}

const CHALLENGE_TYPE_LABELS = {
  write_code: "Write code",
  predict_output: "Predict output",
  fix_code: "Fix the bug",
  complete_code: "Complete the code",
  real_world: "Real world",
};

export function formatChallengeType(type) {
  return CHALLENGE_TYPE_LABELS[type] || "Challenge";
}

export function isConsoleChallenge(type) {
  return type === "predict_output";
}
