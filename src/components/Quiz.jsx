import { useState } from 'react';
import MathText from './MathText';
import { useLanguage } from '../contexts/LanguageContext';

export default function Quiz({ questions, chapterId, onComplete, bestScore }) {
  const { t } = useLanguage();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const question = questions[currentQ];
  const score = answers.filter((a, i) => a === (questions[i].correct ?? questions[i].answer)).length;
  const percentage = (score / questions.length) * 100;

  function handleSelect(optionIndex) {
    if (showExplanation) return;
    setSelected(optionIndex);
    setShowExplanation(true);
    setAnswers([...answers, optionIndex]);
  }

  function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
      onComplete(percentage);
    }
  }

  function handleRestart() {
    setCurrentQ(0);
    setSelected(null);
    setShowExplanation(false);
    setAnswers([]);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="quiz-results">
        <div className="results-card">
          <div className={`results-score ${percentage >= 70 ? 'good' : percentage >= 40 ? 'ok' : 'poor'}`}>
            {Math.round(percentage)}%
          </div>
          <h3>
            {percentage >= 70 ? t('quiz_result_good') : percentage >= 40 ? t('quiz_result_ok') : t('quiz_result_poor')}
          </h3>
          <p>{t('quiz_correct_count', { score, total: questions.length })}</p>
          {bestScore !== undefined && bestScore > percentage && (
            <p className="best-score">{t('quiz_best_score', { score: Math.round(bestScore) })}</p>
          )}
          <button className="btn-primary" onClick={handleRestart}>
            {t('common_retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz-progress">
        <div className="quiz-progress-text">
          {t('quiz_question_progress', { current: currentQ + 1, total: questions.length })}
        </div>
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="quiz-question">
        <h3><MathText text={question.question} /></h3>
      </div>

      <div className="quiz-options">
        {question.options.map((option, i) => {
          let className = 'quiz-option';
          const correctIdx = question.correct ?? question.answer;
          if (showExplanation) {
            if (i === correctIdx) className += ' correct';
            else if (i === selected) className += ' incorrect';
            else className += ' dimmed';
          } else if (i === selected) {
            className += ' selected';
          }
          return (
            <button
              key={i}
              className={className}
              onClick={() => handleSelect(i)}
              disabled={showExplanation}
            >
              <span className="option-letter">{String.fromCharCode(65 + i)}</span>
              <span className="option-text"><MathText text={option} /></span>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className={`quiz-explanation ${selected === (question.correct ?? question.answer) ? 'correct' : 'incorrect'}`}>
          <div className="explanation-header">
            {selected === question.correct ? t('quiz_correct') : t('quiz_incorrect')}
          </div>
          <p><MathText text={question.explanation} /></p>
          <button className="btn-primary" onClick={handleNext}>
            {currentQ < questions.length - 1 ? t('quiz_next_question') : t('quiz_show_result')}
          </button>
        </div>
      )}
    </div>
  );
}
