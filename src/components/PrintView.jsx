import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MathText, { MathBlock } from './MathText';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchFiguresForChapters } from '../lib/api';
import { buildFiguresMap } from '../lib/figures';
import { buildPrintDoc, referencedFigureRefs } from '../lib/printDoc';

// A full-screen, chrome-free rendering of the selected chapters, styled for
// paper by print.css. The user saves it with the browser's own Save as PDF —
// see Step 11 in DEVELOPMENTS.md for why this beats a server-side renderer.
export default function PrintView({ course, parts, chapters, scope, options, isTeacher, onClose }) {
  const { t } = useLanguage();
  const [figuresByChapter, setFiguresByChapter] = useState(null);
  const [ready, setReady] = useState(false);
  // 'off' | 'working' | 'on' | 'failed'
  const [paged, setPaged] = useState('off');
  const docRef = useRef(null);
  const pagedRef = useRef(null);

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

  // Chrome prints document.title in its own running head, and CSS cannot turn
  // that off. If the reader leaves it on, at least let it name the document.
  useEffect(() => {
    const previous = document.title;
    document.title = course?.name && doc.title !== course.name
      ? `${course.name} — ${doc.title}`
      : (doc.title || previous);
    return () => { document.title = previous; };
  }, [course?.name, doc.title]);

  // Paged.js turns the flow document into real pages: running heads, folios
  // and a contents list with page references — none of which plain print CSS
  // can produce. ~250KB, so it loads only when asked for, and never for a
  // student reading on screen.
  const runPaged = useCallback(async () => {
    if (!docRef.current || !pagedRef.current) return;
    setPaged('working');
    try {
      // print-paged.css styles the preview inside the document; the page
      // geometry has to reach Paged.js instead, because it honours only the
      // stylesheets it is handed — an empty list means no @page, no breaks
      // and no running heads.
      //
      // It arrives as raw text wrapped in a blob URL rather than as a file
      // URL: in dev Vite serves a .css?url import as a JavaScript module, so
      // Paged.js would fetch JS and quietly parse no rules at all.
      const [{ Previewer }, { default: pageCss }] = await Promise.all([
        import('pagedjs'),
        import('../print-pages.css?raw'),
        import('../print-paged.css'),
      ]);
      const cssUrl = URL.createObjectURL(new Blob([pageCss], { type: 'text/css' }));
      try {
        pagedRef.current.innerHTML = '';
        // Paged.js flows the *children* of what it is given, so handing it the
        // <article> directly drops that element — and with it every rule
        // scoped under .print-doc. Wrapping keeps the article in the content.
        const source = document.createElement('div');
        source.appendChild(docRef.current.cloneNode(true));
        await new Previewer().preview(source, [cssUrl], pagedRef.current);
      } finally {
        URL.revokeObjectURL(cssUrl);
      }
      setPaged('on');
    } catch (err) {
      console.error('Paged.js layout failed:', err);
      setPaged('failed');
    }
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

  // Print hides unresolved [fig:ref] placeholders, which silently leaves
  // sentences like "zoals in ." on the page. Teachers should hear about it
  // here — printing is when anyone notices.
  const missingFigures = useMemo(() => {
    if (figuresByChapter === null) return [];
    return doc.chapters.flatMap(ch => {
      const available = new Set(Object.keys(figureMaps[ch.pbId] ?? {}));
      return referencedFigureRefs(ch)
        .filter(ref => !available.has(ref))
        .map(ref => ({ chapter: doc.labels.get(ch.pbId) ?? ch.id, ref }));
    });
  }, [doc, figureMaps, figuresByChapter]);

  return (
    <div className={`print-root ${paged === 'on' ? 'is-paged' : ''}`}>
      <div className="print-toolbar no-print">
        <button className="btn-secondary" onClick={onClose}>{t('print_back')}</button>

        {paged === 'on' ? (
          <span className="print-hint">{t('print_disable_browser_headers')}</span>
        ) : (
          <button className="btn-secondary" onClick={runPaged} disabled={!ready || paged === 'working'}>
            {paged === 'working' ? t('print_paginating') : t('print_book_layout')}
          </button>
        )}
        {paged === 'failed' && <span className="print-hint">{t('print_book_failed')}</span>}

        <span className="print-toolbar-status">
          {ready ? t('print_ready') : t('print_preparing')}
        </span>
        <button className="btn-primary" onClick={() => window.print()} disabled={!ready}>
          {t('print_action')}
        </button>
      </div>

      {isTeacher && missingFigures.length > 0 && (
        <div className="print-warning no-print">
          <strong>{t('print_missing_figures', { count: missingFigures.length })}</strong>
          <span>{missingFigures.map(m => `${m.chapter} · [fig:${m.ref}]`).join(', ')}</span>
        </div>
      )}

      <div ref={pagedRef} className="print-paged-output" />

      <article
        className={`print-doc ${paged === 'on' ? 'print-doc-source' : ''}`}
        ref={docRef}
        lang={course?.language ?? 'nl'}
      >
        {/* Carries the course name into the running head via string-set;
            it must exist on every print, so it cannot be the cover's own
            .print-course element. */}
        <div className="print-running-meta" aria-hidden="true">{course?.name}</div>

        <header className="print-titlepage">
          {/* At course scope the title already is the course name. */}
          {doc.title !== course?.name && (
            <div className="print-course">{course?.name}</div>
          )}
          <h1>{doc.title}</h1>
          {course?.subtitle && <p className="print-subtitle">{course.subtitle}</p>}
          <div className="print-titlepage-rule" />
          <p className="print-date">{longDate(course?.language)}</p>
          <p className="print-origin">minilectures.app</p>
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
                    {/* A real anchor: Paged.js resolves the page number with
                        target-counter(attr(href url), page). */}
                    <a className="print-toc-title" href={`#${chapterAnchor(ch)}`}>
                      <MathText text={ch.title} />
                    </a>
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
                includeFormulas={doc.showChapterFormulas}
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
                <h2 className="print-formula-group-title">
                  <span className="print-formula-group-number">{doc.labels.get(ch.pbId) ?? ch.id}</span>
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

const chapterAnchor = chapter => `ch-${chapter.pbId}`;

// "9/6/2026" is ambiguous across locales and looks like a log line on a cover.
function longDate(language) {
  const locale = language === 'nl' ? 'nl-NL' : language || 'en-GB';
  try {
    return new Date().toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return new Date().toLocaleDateString();
  }
}

function PrintChapter({ chapter, label, figures, includeFormulas, includeExercises }) {
  const { t } = useLanguage();
  const hasFormulas = includeFormulas && chapter.formulas?.length > 0;
  const hasExercises = includeExercises && chapter.exercises?.length > 0;

  return (
    <section className="print-chapter" id={chapterAnchor(chapter)}>
      <header className="print-chapter-opener">
        <div className="print-chapter-number">{label}</div>
        <h1 className="print-chapter-title"><MathText text={chapter.title} /></h1>
      </header>
      {chapter.subtitle && (
        <p className="print-chapter-subtitle"><MathText text={chapter.subtitle} /></p>
      )}

      {chapter.concepts?.map((concept, i) => (
        <div key={i} className="print-concept">
          <h2><MathText text={concept.title} figures={figures} /></h2>
          <div className="print-concept-body">
            <MathText text={concept.content} figures={figures} blocks />
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
        <div className="print-exercise-intro"><MathText text={exercise.intro} figures={figures} blocks /></div>
      )}
      {exercise.steps?.map((step, i) => (
        <div key={i} className="print-step">
          <div className="print-step-question">
            <span className="print-step-letter">{String.fromCharCode(97 + i)})</span>
            <MathText text={step.question} figures={figures} blocks />
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
