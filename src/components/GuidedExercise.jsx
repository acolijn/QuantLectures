import { useState } from 'react';
import MathText from './MathText';
import { useLanguage } from '../contexts/LanguageContext';
import { matchesAnswer, answerMode, expectedAnswers, toleranceFor } from '../lib/answerCheck';

export default function GuidedExercise({ exercise, figures, isTeacher, onFigClick }) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [revealedHints, setRevealedHints] = useState({});
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [notes, setNotes] = useState({});

  const step = exercise.steps[currentStep];
  const totalSteps = exercise.steps.length;
  const mode = answerMode(step);
  const expected = expectedAnswers(step);

  function toggleHint(stepIdx, hintIdx) {
    const key = `${stepIdx}-${hintIdx}`;
    setRevealedHints(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleAnswer(stepIdx, subIdx, value) {
    setAnswers(prev => {
      const current = prev[stepIdx] || {};
      return { ...prev, [stepIdx]: { ...current, [subIdx]: value } };
    });
  }

  function checkStep(stepIdx) {
    setChecked(prev => ({ ...prev, [stepIdx]: true }));
  }

  function given(stepIdx, subIdx) {
    return (answers[stepIdx] || {})[subIdx] || '';
  }

  function isSubCorrect(stepIdx, subIdx) {
    const s = exercise.steps[stepIdx];
    const exp = expectedAnswers(s)[subIdx];
    return matchesAnswer(given(stepIdx, subIdx), exp, toleranceFor(s, subIdx));
  }

  function isCorrect(stepIdx) {
    const s = exercise.steps[stepIdx];
    const exp = expectedAnswers(s);
    if (exp.length === 0) return null;
    return exp.every((_, i) => isSubCorrect(stepIdx, i));
  }

  return (
    <div className="guided-exercise">
      <div className="exercise-header">
        <div className="exercise-label">{exercise.label || t('exercise_label_default')}</div>
        <h3><MathText text={exercise.title} figures={figures} isTeacher={isTeacher} onFigClick={onFigClick} /></h3>
        {exercise.intro && (
          <div className="exercise-intro"><MathText text={exercise.intro} figures={figures} isTeacher={isTeacher} onFigClick={onFigClick} /></div>
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
          <MathText text={step.question} figures={figures} isTeacher={isTeacher} onFigClick={onFigClick} />
        </div>

        {step.hints && step.hints.length > 0 && (
          <div className="step-hints">
            {step.hints.map((hint, hi) => (
              <div key={hi} className="hint-wrapper">
                <button
                  className="hint-toggle"
                  onClick={() => toggleHint(currentStep, hi)}
                >
                  {revealedHints[`${currentStep}-${hi}`] ? '▾' : '▸'} {t('exercise_hint', { n: hi + 1 })}
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

        {mode === 'none' ? (
          <div className="step-answer-input step-scratchpad">
            <div className="scratchpad-label">{t('exercise_scratchpad_label')}</div>
            <textarea
              rows={2}
              placeholder={t('exercise_scratchpad_placeholder')}
              value={notes[currentStep] || ''}
              onChange={e => setNotes(prev => ({ ...prev, [currentStep]: e.target.value }))}
            />
            {notes[currentStep] && (
              <div className="latex-preview">
                <MathText text={`$${notes[currentStep]}$`} />
              </div>
            )}
            <div className="scratchpad-hint">{t('exercise_scratchpad_hint')}</div>
          </div>
        ) : (
          <div className="step-answer-input">
            {expected.map((exp, ai) => {
              const value = given(currentStep, ai);
              const subCorrect = checked[currentStep] ? isSubCorrect(currentStep, ai) : null;
              return (
                <div key={ai} className={mode === 'multi' ? 'multi-answer-row' : 'single-answer-row'}>
                  <input
                    type="text"
                    placeholder={mode === 'multi' ? t('exercise_answer', { n: ai + 1 }) : t('exercise_your_answer')}
                    value={value}
                    onChange={e => handleAnswer(currentStep, ai, e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !checked[currentStep]) checkStep(currentStep); }}
                    disabled={checked[currentStep]}
                    className={checked[currentStep] ? (subCorrect ? 'correct' : 'incorrect') : ''}
                  />
                  {value && (
                    <div className="latex-preview">
                      <MathText text={`$${value}$`} />
                    </div>
                  )}
                  {checked[currentStep] && !subCorrect && mode === 'multi' && (
                    <div className="answer-feedback incorrect">
                      <span>✗ <MathText text={variantText(exp)} /></span>
                    </div>
                  )}
                </div>
              );
            })}

            {!checked[currentStep] && (
              <button className="btn-check" onClick={() => checkStep(currentStep)}>
                {t('exercise_check')}
              </button>
            )}

            {checked[currentStep] && (
              isCorrect(currentStep) ? (
                <div className="answer-feedback correct">{t('exercise_correct')}</div>
              ) : (
                mode === 'single' && (
                  <div className="answer-feedback incorrect">
                    <span>{t('exercise_correct_answer')} <MathText text={variantText(expected[0])} /></span>
                  </div>
                )
              )
            )}
          </div>
        )}

        {step.solution && (
          <SolutionReveal key={currentStep} solution={step.solution} />
        )}

        <div className="step-nav">
          {currentStep > 0 && (
            <button className="btn-secondary" onClick={() => setCurrentStep(currentStep - 1)}>
              {t('exercise_prev')}
            </button>
          )}
          {currentStep < totalSteps - 1 && (
            <button className="btn-primary" onClick={() => setCurrentStep(currentStep + 1)}>
              {t('exercise_next')}
            </button>
          )}
          {currentStep === totalSteps - 1 && (
            <div className="exercise-complete">{t('exercise_complete')}</div>
          )}
        </div>
      </div>
    </div>
  );
}

/** An expected answer may hold several accepted variants; show the first. */
function variantText(expected) {
  return Array.isArray(expected) ? expected[0] : expected;
}

function SolutionReveal({ solution }) {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);
  return (
    <div className="solution-wrapper">
      <button className="solution-toggle" onClick={() => setShow(!show)}>
        {show ? t('exercise_hide_solution') : t('exercise_show_solution')}
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
