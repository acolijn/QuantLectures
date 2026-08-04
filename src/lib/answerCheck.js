// Answer checking for guided exercises.
//
// Three layers, tried in order:
//   1. numeric  — both sides parse to a number → compare with relative tolerance
//   2. unit     — units extracted separately, only compared when both sides have one
//   3. symbolic — normalized LaTeX string equality, against a list of accepted variants
//
// An expected answer may be a plain string ("$2x+3$") or an array of accepted
// variants (["2x+3", "3+2x"]). A step's `answer` field being an array means one
// entry per input box; a nested array means one input box with several accepted forms.

const DEFAULT_REL_TOL = 0.01; // 1%
const ABS_TOL_NEAR_ZERO = 1e-12;

/** Strip LaTeX decoration that never carries meaning for an answer. */
export function normalizeLaTeX(str) {
  return String(str ?? '')
    .replace(/\$/g, '')
    .replace(/\\left|\\right/g, '')
    .replace(/\\[,;:!]/g, '')
    .replace(/\\q?quad/g, '')
    .replace(/\{,\}/g, '.')
    .replace(/\\cdot|\\times/g, '*')
    .replace(/\\approx|\\simeq/g, '=')
    .replace(/(\d),(\d)/g, '$1.$2') // decimal comma, but keep list commas alone
    .replace(/\s+/g, '')
    .toLowerCase();
}

/** Everything after the last '=' — students often answer "x = 42" or just "42". */
function rightHandSide(s) {
  const parts = s.split('=');
  return parts[parts.length - 1];
}

/**
 * Split a normalized answer into a numeric expression and a unit.
 * The unit is whatever \text{}/\mathrm{} wraps, plus any trailing letter run
 * that prevents the rest from parsing as a number.
 */
function splitUnit(normalized) {
  let unit = '';
  let expr = normalized.replace(/\\(?:text|mathrm|rm|mbox)\{([^}]*)\}/g, (_, u) => {
    unit += u;
    return '';
  });

  // Peel trailing letters (eV, m/s, kg) until the remainder parses as a number.
  while (expr && evaluate(expr) === null) {
    const m = expr.match(/(\\?[a-zµμ°]+(?:\/\\?[a-zµμ°]+)*)$/);
    if (!m || m.index === 0) break;
    unit = m[0] + unit;
    expr = expr.slice(0, m.index);
  }

  return { expr, unit: unit.replace(/[\\{}\s]/g, '') };
}

/** Rewrite LaTeX numeric notation into a JS expression, or null if not numeric. */
function toEvaluable(s) {
  let out = s;

  // \frac{a}{b} → ((a)/(b)), innermost first
  for (let i = 0; i < 4; i++) {
    const next = out.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))');
    if (next === out) break;
    out = next;
  }
  out = out.replace(/\\sqrt\{([^{}]*)\}/g, '(($1)**0.5)');
  out = out.replace(/\\pi/g, String(Math.PI));
  out = out.replace(/\^\{([^{}]*)\}/g, '**($1)'); // 10^{-19}
  out = out.replace(/\^(-?[\d.]+)/g, '**($1)');   // 10^-19

  // Only bare arithmetic survives; anything else (symbols, stray macros) is rejected.
  if (!/^[\d.+\-*/()e ]*$/.test(out)) return null;
  return out;
}

/** Evaluate a normalized expression to a number, or null. */
function evaluate(s) {
  if (!s) return null;
  const expr = toEvaluable(s);
  if (expr === null || !/\d/.test(expr)) return null;
  try {
    // Safe: `expr` is whitelisted to digits and arithmetic operators above.
    const v = Function(`"use strict";return (${expr});`)();
    return Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

/** Parse an answer string into { value, unit, symbol }. */
export function parseAnswer(raw) {
  const normalized = rightHandSide(normalizeLaTeX(raw));
  const { expr, unit } = splitUnit(normalized);
  return { value: evaluate(expr), unit, symbol: normalized };
}

function unitsCompatible(givenUnit, expectedUnit) {
  if (!expectedUnit || !givenUnit) return true; // lenient: only compare when both stated
  return givenUnit === expectedUnit;
}

function numbersClose(given, expected, tol) {
  const relTol = typeof tol === 'number' && tol >= 0 ? tol : DEFAULT_REL_TOL;
  if (expected === 0) return Math.abs(given) <= Math.max(ABS_TOL_NEAR_ZERO, relTol);
  return Math.abs(given - expected) / Math.abs(expected) <= relTol;
}

/** Check a student answer against one expected variant. */
function matchesVariant(given, expected, tol) {
  const g = parseAnswer(given);
  const e = parseAnswer(expected);

  if (g.value !== null && e.value !== null) {
    return numbersClose(g.value, e.value, tol) && unitsCompatible(g.unit, e.unit);
  }

  // Symbolic: compare the whole thing, and also allow the student to have
  // written only the right-hand side of an equation.
  const expectedFull = normalizeLaTeX(expected);
  return g.symbol !== '' && (g.symbol === expectedFull || g.symbol === e.symbol);
}

/**
 * Check a student answer against an expected answer, which may be a string or
 * an array of accepted variants. Returns true/false.
 */
export function matchesAnswer(given, expected, tol) {
  if (given === undefined || given === null || String(given).trim() === '') return false;
  const variants = Array.isArray(expected) ? expected : [expected];
  return variants.some(v => hasContent(v) && matchesVariant(given, v, tol));
}

/** True when a value is a non-empty answer specification. */
export function hasContent(answer) {
  if (Array.isArray(answer)) return answer.some(hasContent);
  return typeof answer === 'string' ? answer.trim() !== '' : answer != null;
}

/**
 * How a step should render its answer area:
 *   'none'   — no expected answer, input is a scratchpad
 *   'single' — one checked input
 *   'multi'  — one checked input per entry
 */
export function answerMode(step) {
  const a = step?.answer;
  if (!hasContent(a)) return 'none';
  // Nested arrays mean "one input, several accepted forms".
  if (Array.isArray(a) && !a.every(Array.isArray)) return 'multi';
  if (Array.isArray(a) && a.length === 1) return 'single';
  if (Array.isArray(a)) return 'multi';
  return 'single';
}

/** The expected answer(s) for a step, always as an array of one entry per input. */
export function expectedAnswers(step) {
  const a = step?.answer;
  if (!hasContent(a)) return [];
  if (answerMode(step) === 'single') return [Array.isArray(a) ? a[0] : a];
  return a;
}

/** Per-input tolerance: step.tol may be a number or an array. */
export function toleranceFor(step, index) {
  const tol = step?.tol;
  if (Array.isArray(tol)) return tol[index];
  return tol;
}
