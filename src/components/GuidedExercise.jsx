import { useState } from 'react';
import MathText, { MathBlock } from './MathText';

export default function GuidedExercise({ exercise }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [revealedHints, setRevealedHints] = useState({});
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});

  const step = exercise.steps[currentStep];
  const totalSteps = exercise.steps.length;

  function toggleHint(stepIdx, hintIdx) {
    const key = `${stepIdx}-${hintIdx}`;
    setRevealedHints(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleAnswer(stepIdx, value, subIdx) {
    if (subIdx !== undefined) {
      setAnswers(prev => {
        const current = prev[stepIdx] || {};
        return { ...prev, [stepIdx]: { ...current, [subIdx]: value } };
      });
    } else {
      setAnswers(prev => ({ ...prev, [stepIdx]: value }));
    }
  }

  function checkAnswer(stepIdx) {
    setChecked(prev => ({ ...prev, [stepIdx]: true }));
  }

  function normalizeLaTeX(str) {
    return str
      .replace(/\s+/g, '')          // strip all whitespace
      .replace(/\{,\}/g, '.')        // {,} (LaTeX decimal comma) → .
      .replace(/\\,/g, '')           // strip \,
      .replace(/\\;/g, '')           // strip \;
      .replace(/\\:/g, '')           // strip \:
      .replace(/\\!/g, '')           // strip \!
      .replace(/\\quad/g, '')        // strip \quad
      .replace(/\\qquad/g, '')       // strip \qquad
      .replace(/\$/g, '')            // strip $ delimiters
      .replace(/\\text\{([^}]*)\}/g, '$1') // \text{eV} → eV
      .replace(/\\left/g, '')        // strip \left
      .replace(/\\right/g, '')       // strip \right
      .replace(/\\cdot/g, '*')       // treat \cdot as *
      .replace(/\\times/g, '*')      // treat \times as *
      .replace(/,/g, '.')             // decimal comma → decimal point
      .replace(/\\approx/g, '=')     // treat ≈ as =
      .toLowerCase();
  }

  function matchesAnswer(given, answer) {
    const normAnswer = normalizeLaTeX(answer);
    if (given === normAnswer) return true;
    // Also accept just the right-hand side of an equation
    const eqParts = normAnswer.split('=');
    if (eqParts.length >= 2) {
      const rhs = eqParts.slice(1).join('=');
      if (given === rhs) return true;
    }
    return false;
  }

  function isCorrect(stepIdx) {
    const s = exercise.steps[stepIdx];
    if (!s.answer) return null;
    if (Array.isArray(s.answer)) {
      // Multiple answers: each must match its corresponding input
      const givenObj = answers[stepIdx] || {};
      return s.answer.every((a, i) => matchesAnswer(normalizeLaTeX(givenObj[i] || ''), a));
    }
    const given = normalizeLaTeX(answers[stepIdx] || '');
    return matchesAnswer(given, s.answer);
  }

  return (
    <div className="guided-exercise">
      <div className="exercise-header">
        <div className="exercise-label">{exercise.label || 'Opgave'}</div>
        <h3><MathText text={exercise.title} /></h3>
        {exercise.intro && (
          <div className="exercise-intro"><MathText text={exercise.intro} /></div>
        )}
      </div>

      <div className="exercise-progress">
        {exercise.steps.map((_, i) => (
          <div
            key={i}
            className={`exercise-step-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`}
            onClick={() => i <= currentStep && setCurrentStep(i)}
          >
            {i < currentStep ? '✓' : String.fromCharCode(97 + i)}
          </div>
        ))}
      </div>

      <div className="exercise-step">
        <div className="step-question">
          <MathText text={step.question} />
        </div>

        {step.hints && step.hints.length > 0 && (
          <div className="step-hints">
            {step.hints.map((hint, hi) => (
              <div key={hi} className="hint-wrapper">
                <button
                  className="hint-toggle"
                  onClick={() => toggleHint(currentStep, hi)}
                >
                  {revealedHints[`${currentStep}-${hi}`] ? '▾' : '▸'} Hint {hi + 1}
                </button>
                {revealedHints[`${currentStep}-${hi}`] && (
                  <div className="hint-content">
                    <MathText text={hint} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {step.answer && !Array.isArray(step.answer) && (
          <div className="step-answer-input">
            <input
              type="text"
              placeholder="Jouw antwoord..."
              value={answers[currentStep] || ''}
              onChange={e => handleAnswer(currentStep, e.target.value)}
              disabled={checked[currentStep]}
              className={checked[currentStep] ? (isCorrect(currentStep) ? 'correct' : 'incorrect') : ''}
            />
            {answers[currentStep] && (
              <div className="latex-preview">
                <MathText text={`$${answers[currentStep]}$`} />
              </div>
            )}
            {!checked[currentStep] && (
              <button className="btn-check" onClick={() => checkAnswer(currentStep)}>
                Controleer
              </button>
            )}
            {checked[currentStep] && (
              <div className={`answer-feedback ${isCorrect(currentStep) ? 'correct' : 'incorrect'}`}>
                {isCorrect(currentStep)
                  ? '✓ Correct!'
                  : <span>✗ Het juiste antwoord is: <MathText text={step.answer} /></span>
                }
              </div>
            )}
          </div>
        )}

        {step.answer && Array.isArray(step.answer) && (
          <div className="step-answer-input">
            {step.answer.map((ans, ai) => {
              const givenObj = answers[currentStep] || {};
              const subCorrect = checked[currentStep] ? matchesAnswer(normalizeLaTeX(givenObj[ai] || ''), ans) : null;
              return (
                <div key={ai} className="multi-answer-row">
                  <input
                    type="text"
                    placeholder={`Antwoord ${ai + 1}...`}
                    value={givenObj[ai] || ''}
                    onChange={e => handleAnswer(currentStep, e.target.value, ai)}
                    disabled={checked[currentStep]}
                    className={checked[currentStep] ? (subCorrect ? 'correct' : 'incorrect') : ''}
                  />
                  {givenObj[ai] && (
                    <div className="latex-preview">
                      <MathText text={`$${givenObj[ai]}$`} />
                    </div>
                  )}
                  {checked[currentStep] && !subCorrect && (
                    <div className="answer-feedback incorrect">
                      <span>✗ <MathText text={ans} /></span>
                    </div>
                  )}
                </div>
              );
            })}
            {!checked[currentStep] && (
              <button className="btn-check" onClick={() => checkAnswer(currentStep)}>
                Controleer
              </button>
            )}
            {checked[currentStep] && isCorrect(currentStep) && (
              <div className="answer-feedback correct">✓ Correct!</div>
            )}
          </div>
        )}

        {step.solution && (
          <SolutionReveal key={currentStep} solution={step.solution} />
        )}

        <div className="step-nav">
          {currentStep > 0 && (
            <button className="btn-secondary" onClick={() => setCurrentStep(currentStep - 1)}>
              ← Vorige
            </button>
          )}
          {currentStep < totalSteps - 1 && (
            <button className="btn-primary" onClick={() => setCurrentStep(currentStep + 1)}>
              Volgende stap →
            </button>
          )}
          {currentStep === totalSteps - 1 && (
            <div className="exercise-complete">Opgave voltooid!</div>
          )}
        </div>
      </div>
    </div>
  );
}

function SolutionReveal({ solution }) {
  const [show, setShow] = useState(false);
  return (
    <div className="solution-wrapper">
      <button className="solution-toggle" onClick={() => setShow(!show)}>
        {show ? '▾ Verberg uitwerking' : '▸ Toon uitwerking'}
      </button>
      {show && (
        <div className="solution-content">
          {Array.isArray(solution)
            ? solution.map((line, i) => (
              <div key={i} className="solution-line">
                <MathText text={line} />
              </div>
            ))
            : <MathText text={solution} />
          }
        </div>
      )}
    </div>
  );
}
