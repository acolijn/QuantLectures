import { useEffect, useMemo, useRef, useState } from 'react';
import MathText, { MathBlock } from './MathText';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchFiguresForChapters } from '../lib/api';
import { buildFiguresMap } from '../lib/figures';
import { buildPrintDoc } from '../lib/printDoc';

// A full-screen, chrome-free rendering of the selected chapters, styled for
// paper by print.css. The user saves it with the browser's own Save as PDF —
// see Step 11 in DEVELOPMENTS.md for why this beats a server-side renderer.
export default function PrintView({ course, parts, chapters, scope, options, onClose }) {
  const { t } = useLanguage();
  const [figuresByChapter, setFiguresByChapter] = useState(null);
  const [ready, setReady] = useState(false);
  const docRef = useRef(null);

  const doc = useMemo(
    () => buildPrintDoc(course, parts, chapters, scope, options),
    [course, parts, chapters, scope, options]
  );

  useEffect(() => {
    let cancelled = false;
    fetchFiguresForChapters(doc.chapters.map(ch => ch.pbId))
      .then(map => { if (!cancelled) setFiguresByChapter(map); })
      .catch(err => {
        console.error('Failed to load figures for print:', err);
        // Figures are not worth blocking the print on; render without them.
        if (!cancelled) setFiguresByChapter({});
      });
    return () => { cancelled = true; };
  }, [doc]);

  // Printing before images and KaTeX fonts settle leaves blank boxes on the
  // page, so hold the print action until everything has actually decoded.
  useEffect(() => {
    if (figuresByChapter === null) return;
    let cancelled = false;

    async function waitForPaint() {
      const node = docRef.current;
      const images = node ? Array.from(node.querySelectorAll('img')) : [];
      await Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        ...images.map(img =>
          // A figure that fails to load must not strand the print button.
          img.decode?.().catch(() => {}) ?? Promise.resolve()
        ),
      ]);
      if (!cancelled) setReady(true);
    }

    // One frame first, so the figures just added to the DOM are queryable.
    const raf = requestAnimationFrame(waitForPaint);
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, [figuresByChapter]);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // The @media print rules hide the app around the document, which would turn
  // an ordinary Cmd+P on the reading view into a blank page. Gate them on this
  // class so they only apply while the print view is actually open.
  useEffect(() => {
    document.body.classList.add('print-mode');
    return () => document.body.classList.remove('print-mode');
  }, []);

  const figureMaps = useMemo(() => {
    const maps = {};
    Object.entries(figuresByChapter ?? {}).forEach(([chapterId, figs]) => {
      // full: the 400px thumbnail is far too coarse at print size.
      maps[chapterId] = buildFiguresMap(figs, { full: true });
    });
    return maps;
  }, [figuresByChapter]);

  const formulaChapters = doc.chapters.filter(ch => ch.formulas?.length > 0);

  return (
    <div className="print-root">
      <div className="print-toolbar no-print">
        <button className="btn-secondary" onClick={onClose}>{t('print_back')}</button>
        <span className="print-toolbar-status">
          {ready ? t('print_ready') : t('print_preparing')}
        </span>
        <button className="btn-primary" onClick={() => window.print()} disabled={!ready}>
          {t('print_action')}
        </button>
      </div>

      <article className="print-doc" ref={docRef}>
        <header className="print-titlepage">
          {/* At course scope the title already is the course name. */}
          {doc.title !== course?.name && (
            <div className="print-course">{course?.name}</div>
          )}
          <h1>{doc.title}</h1>
          {course?.subtitle && <p className="print-subtitle">{course.subtitle}</p>}
          <p className="print-date">{new Date().toLocaleDateString()}</p>
        </header>

        {doc.showToc && (
          <nav className="print-toc">
            <h2>{t('print_toc')}</h2>
            {doc.groups.map((group, gi) => (
              <div key={group.part?.id ?? `ungrouped-${gi}`} className="print-toc-group">
                {group.part && <div className="print-toc-part">{group.part.title}</div>}
                {group.chapters.map(ch => (
                  <div key={ch.pbId} className="print-toc-entry">
                    <span className="print-toc-number">{doc.labels.get(ch.pbId) ?? ch.id}</span>
                    <span className="print-toc-title"><MathText text={ch.title} /></span>
                  </div>
                ))}
              </div>
            ))}
          </nav>
        )}

        {doc.groups.map((group, gi) => (
          <section key={group.part?.id ?? `ungrouped-${gi}`} className="print-part">
            {/* With a single group the cover already names it — a part
                heading here would just repeat the title page. */}
            {group.part && doc.groups.length > 1 && (
              <h1 className="print-part-title">{group.part.title}</h1>
            )}
            {group.chapters.map(ch => (
              <PrintChapter
                key={ch.pbId}
                chapter={ch}
                label={doc.labels.get(ch.pbId) ?? ch.id}
                figures={figureMaps[ch.pbId] ?? {}}
                includeFormulas={doc.includeFormulas}
                includeExercises={doc.includeExercises}
              />
            ))}
          </section>
        ))}

        {doc.showCombinedFormulaSheet && (
          <section className="print-chapter print-formula-sheet">
            <h1>{t('print_formula_sheet')}</h1>
            {formulaChapters.map(ch => (
              <div key={ch.pbId} className="print-formula-group">
                <h2>
                  <span className="print-chapter-number">{doc.labels.get(ch.pbId) ?? ch.id}</span>
                  <MathText text={ch.title} />
                </h2>
                <FormulaList formulas={ch.formulas} />
              </div>
            ))}
          </section>
        )}
      </article>
    </div>
  );
}

function PrintChapter({ chapter, label, figures, includeFormulas, includeExercises }) {
  const { t } = useLanguage();
  const hasFormulas = includeFormulas && chapter.formulas?.length > 0;
  const hasExercises = includeExercises && chapter.exercises?.length > 0;

  return (
    <section className="print-chapter">
      <h1 className="print-chapter-title">
        <span className="print-chapter-number">{label}</span>
        <MathText text={chapter.title} />
      </h1>
      {chapter.subtitle && (
        <p className="print-chapter-subtitle"><MathText text={chapter.subtitle} /></p>
      )}

      {chapter.concepts?.map((concept, i) => (
        <div key={i} className="print-concept">
          <h2><MathText text={concept.title} figures={figures} /></h2>
          <div className="print-concept-body">
            <MathText text={concept.content} figures={figures} />
          </div>
        </div>
      ))}

      {hasFormulas && (
        <div className="print-formulas">
          <h2>{t('print_chapter_formulas')}</h2>
          <FormulaList formulas={chapter.formulas} />
        </div>
      )}

      {hasExercises && (
        <div className="print-exercises">
          <h2>{t('print_chapter_exercises')}</h2>
          {chapter.exercises.map((exercise, i) => (
            <PrintExercise key={i} exercise={exercise} figures={figures} />
          ))}
        </div>
      )}
    </section>
  );
}

function FormulaList({ formulas }) {
  return (
    <>
      {formulas.map((formula, i) => (
        <div key={i} className="print-formula">
          <div className="print-formula-name"><MathText text={formula.name} /></div>
          <MathBlock latex={formula.latex} />
        </div>
      ))}
    </>
  );
}

// The paper version of GuidedExercise: every step laid out at once, with the
// hints and solutions already open — there is nothing to click on paper.
function PrintExercise({ exercise, figures }) {
  const { t } = useLanguage();
  return (
    <div className="print-exercise">
      <h3>
        <span className="print-exercise-label">{exercise.label || t('exercise_label_default')}</span>
        <MathText text={exercise.title} figures={figures} />
      </h3>
      {exercise.intro && (
        <div className="print-exercise-intro"><MathText text={exercise.intro} figures={figures} /></div>
      )}
      {exercise.steps?.map((step, i) => (
        <div key={i} className="print-step">
          <div className="print-step-question">
            <span className="print-step-letter">{String.fromCharCode(97 + i)})</span>
            <MathText text={step.question} figures={figures} />
          </div>
          {step.hints?.map((hint, hi) => (
            <div key={hi} className="print-step-hint">
              <span className="print-step-hint-label">{t('exercise_hint', { n: hi + 1 })}</span>
              <MathText text={hint} />
            </div>
          ))}
          {step.solution && (
            <div className="print-step-solution">
              <span className="print-step-solution-label">{t('print_solution')}</span>
              {Array.isArray(step.solution)
                ? step.solution.map((line, li) => (
                  <div key={li} className="print-solution-line"><MathText text={line} /></div>
                ))
                : <MathText text={step.solution} />}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
