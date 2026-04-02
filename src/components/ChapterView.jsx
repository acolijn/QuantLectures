import { useState } from 'react';
import MathText, { MathBlock } from './MathText';
import Quiz from './Quiz';
import GuidedExercise from './GuidedExercise';

export default function ChapterView({ chapter, progress, onProgressUpdate }) {
  const [tab, setTab] = useState('concepts');
  const hasExercises = chapter.exercises && chapter.exercises.length > 0;

  return (
    <main className="chapter-view">
      <header className="chapter-header">
        <div className="chapter-header-number">Hoofdstuk {chapter.id}</div>
        <h2><MathText text={chapter.title} /></h2>
        <p className="chapter-subtitle"><MathText text={chapter.subtitle} /></p>
      </header>

      <div className="tab-bar">
        <button
          className={`tab ${tab === 'concepts' ? 'active' : ''}`}
          onClick={() => setTab('concepts')}
        >
          📖 Concepten
        </button>
        <button
          className={`tab ${tab === 'formulas' ? 'active' : ''}`}
          onClick={() => setTab('formulas')}
        >
          📐 Formules
        </button>
        {hasExercises && (
          <button
            className={`tab ${tab === 'exercises' ? 'active' : ''}`}
            onClick={() => setTab('exercises')}
          >
            🧮 Opgaven
          </button>
        )}
        <button
          className={`tab ${tab === 'quiz' ? 'active' : ''}`}
          onClick={() => setTab('quiz')}
        >
          ✏️ Quiz
          {progress?.bestScore !== undefined && (
            <span className="tab-badge">{Math.round(progress.bestScore)}%</span>
          )}
        </button>
      </div>

      <div className="tab-content">
        {tab === 'concepts' && (
          <div className="concepts-grid">
            {chapter.concepts.map((concept, i) => (
              <div key={i} className="concept-card">
                <h3><MathText text={concept.title} /></h3>
                <p><MathText text={concept.content} /></p>
              </div>
            ))}
          </div>
        )}

        {tab === 'formulas' && (
          <div className="formulas-list">
            {chapter.formulas.map((formula, i) => (
              <div key={i} className="formula-card">
                <div className="formula-name"><MathText text={formula.name} /></div>
                <MathBlock latex={formula.latex} />
              </div>
            ))}
          </div>
        )}

        {tab === 'exercises' && hasExercises && (
          <div className="exercises-list">
            {chapter.exercises.map((exercise, i) => (
              <GuidedExercise key={i} exercise={exercise} />
            ))}
          </div>
        )}

        {tab === 'quiz' && (
          <Quiz
            questions={chapter.quiz}
            chapterId={chapter.id}
            onComplete={(score) => onProgressUpdate(chapter.id, score)}
            bestScore={progress?.bestScore}
          />
        )}
      </div>
    </main>
  );
}
