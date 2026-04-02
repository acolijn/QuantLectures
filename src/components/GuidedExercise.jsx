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

  function handleAnswer(stepIdx, value) {
    setAnswers(prev => ({ ...prev, [stepIdx]: value }));
  }

  function checkAnswer(stepIdx) {
    setChecked(prev => ({ ...prev, [stepIdx]: true }));
  }

  function isCorrect(stepIdx) {
    const s = exercise.steps[stepIdx];
    if (!s.answer) return null;
    const given = (answers[stepIdx] || '').trim().toLowerCase();
    if (Array.isArray(s.answer)) {
      return s.answer.some(a => given === a.toLowerCase());
    }
    return given === s.answer.toLowerCase();
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

        {step.answer && (
          <div className="step-answer-input">
            <input
              type="text"
              placeholder="Jouw antwoord..."
              value={answers[currentStep] || ''}
              onChange={e => handleAnswer(currentStep, e.target.value)}
              disabled={checked[currentStep]}
              className={checked[currentStep] ? (isCorrect(currentStep) ? 'correct' : 'incorrect') : ''}
            />
            {!checked[currentStep] && (
              <button className="btn-check" onClick={() => checkAnswer(currentStep)}>
                Controleer
              </button>
            )}
            {checked[currentStep] && (
              <div className={`answer-feedback ${isCorrect(currentStep) ? 'correct' : 'incorrect'}`}>
                {isCorrect(currentStep)
                  ? '✓ Correct!'
                  : `✗ Het juiste antwoord is: ${Array.isArray(step.answer) ? step.answer[0] : step.answer}`
                }
              </div>
            )}
          </div>
        )}

        {step.solution && (
          <SolutionReveal solution={step.solution} />
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
