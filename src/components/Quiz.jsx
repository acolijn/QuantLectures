import { useState } from 'react';
import MathText from './MathText';

export default function Quiz({ questions, chapterId, onComplete, bestScore }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const question = questions[currentQ];
  const score = answers.filter((a, i) => a === questions[i].correct).length;
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
            {percentage >= 70 ? 'Goed gedaan! 🎉' : percentage >= 40 ? 'Redelijk, oefen nog even 📚' : 'Herhaal de stof nog eens 💪'}
          </h3>
          <p>{score} van {questions.length} vragen correct</p>
          {bestScore !== undefined && bestScore > percentage && (
            <p className="best-score">Je beste score: {Math.round(bestScore)}%</p>
          )}
          <button className="btn-primary" onClick={handleRestart}>
            Opnieuw proberen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz-progress">
        <div className="quiz-progress-text">
          Vraag {currentQ + 1} van {questions.length}
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
          if (showExplanation) {
            if (i === question.correct) className += ' correct';
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
        <div className={`quiz-explanation ${selected === question.correct ? 'correct' : 'incorrect'}`}>
          <div className="explanation-header">
            {selected === question.correct ? '✓ Correct!' : '✗ Helaas, dat is niet juist.'}
          </div>
          <p><MathText text={question.explanation} /></p>
          <button className="btn-primary" onClick={handleNext}>
            {currentQ < questions.length - 1 ? 'Volgende vraag →' : 'Bekijk resultaat'}
          </button>
        </div>
      )}
    </div>
  );
}
