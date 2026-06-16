import { useState, useEffect } from 'react';
import MathText, { MathBlock } from './MathText';
import Quiz from './Quiz';
import GuidedExercise from './GuidedExercise';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchChapterFigures } from '../lib/api';
import { pb } from '../lib/pocketbase';

function buildFiguresMap(figures) {
  if (!figures?.length) return {};
  const map = {};
  figures.forEach(fig => {
    if (fig.filename) {
      map[fig.ref] = {
        caption: fig.caption,
        url: pb.files.getURL({ collectionName: 'chapter_figures', id: fig.id }, fig.filename, { thumb: '400x0' }),
        fullUrl: pb.files.getURL({ collectionName: 'chapter_figures', id: fig.id }, fig.filename),
        isPdf: fig.filename.toLowerCase().endsWith('.pdf'),
        filename: fig.filename,
      };
    }
  });
  return map;
}

export default function ChapterView({ chapter, progress, onProgressUpdate }) {
  const [tab, setTab] = useState('concepts');
  const [figures, setFigures] = useState([]);
  const { t } = useLanguage();
  const hasFormulas = chapter.formulas && chapter.formulas.length > 0;
  const hasExercises = chapter.exercises && chapter.exercises.length > 0;
  const hasQuiz = chapter.quiz && chapter.quiz.length > 0;
  const figuresMap = buildFiguresMap(figures);

  useEffect(() => {
    async function loadFigures() {
      const figs = await fetchChapterFigures(chapter.pbId);
      setFigures(figs);
    }
    loadFigures();
  }, [chapter.pbId]);

  return (
    <main className="chapter-view">
      <header className="chapter-header">
        <div className="chapter-header-number">{t('chapter_header', { id: chapter.id })}</div>
        <h2><MathText text={chapter.title} /></h2>
        <p className="chapter-subtitle"><MathText text={chapter.subtitle} /></p>
      </header>

      <div className="tab-bar">
        <button
          className={`tab ${tab === 'concepts' ? 'active' : ''}`}
          onClick={() => setTab('concepts')}
        >
          {t('chapter_tab_concepts')}
        </button>
        {hasFormulas && (
          <button
            className={`tab ${tab === 'formulas' ? 'active' : ''}`}
            onClick={() => setTab('formulas')}
          >
            {t('chapter_tab_formulas')}
          </button>
        )}
        {hasExercises && (
          <button
            className={`tab ${tab === 'exercises' ? 'active' : ''}`}
            onClick={() => setTab('exercises')}
          >
            {t('chapter_tab_exercises')}
          </button>
        )}
        {hasQuiz && (
          <button
            className={`tab ${tab === 'quiz' ? 'active' : ''}`}
            onClick={() => setTab('quiz')}
          >
            {t('chapter_tab_quiz')}
            {progress?.bestScore !== undefined && (
              <span className="tab-badge">{Math.round(progress.bestScore)}%</span>
            )}
          </button>
        )}
      </div>

      <div className="tab-content">
        {tab === 'concepts' && (
          <div className="concepts-grid">
            {chapter.concepts.map((concept, i) => (
              <div key={i} className="concept-card">
                <h3><MathText text={concept.title} figures={figuresMap} /></h3>
                <p><MathText text={concept.content} figures={figuresMap} /></p>
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
              <GuidedExercise key={i} exercise={exercise} figures={figuresMap} />
            ))}
          </div>
        )}

        {tab === 'quiz' && hasQuiz && (
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
