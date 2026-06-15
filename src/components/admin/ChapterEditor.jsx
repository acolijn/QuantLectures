import { useState, useRef, useEffect } from 'react';
import { updateChapter, fetchChapterFigures, uploadChapterFigure, updateChapterFigure, deleteChapterFigure } from '../../lib/api';
import { MathBlock } from '../MathText';
import { useLanguage } from '../../contexts/LanguageContext';
import { pb } from '../../lib/pocketbase';

export default function ChapterEditor({ chapter, courseId, onClose, onSaved }) {
  const { t } = useLanguage();
  const [title, setTitle] = useState(chapter.title);
  const [subtitle, setSubtitle] = useState(chapter.subtitle);
  const [concepts, setConcepts] = useState(chapter.concepts ?? []);
  const [formulas, setFormulas] = useState(chapter.formulas ?? []);
  const [exercises, setExercises] = useState(chapter.exercises ?? []);
  const [quiz, setQuiz] = useState(chapter.quiz ?? []);
  const [figures, setFigures] = useState([]);
  const [figuresLoading, setFiguresLoading] = useState(true);
  const [tab, setTab] = useState('concepts');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingFig, setUploadingFig] = useState(null);
  const [editingFigIdx, setEditingFigIdx] = useState(null);
  const [editingFigRef, setEditingFigRef] = useState('');
  const [editingFigCaption, setEditingFigCaption] = useState('');
  const fileInputRefs = useRef({});

  useEffect(() => {
    async function loadFigures() {
      setFiguresLoading(true);
      try {
        const figs = await fetchChapterFigures(chapter.pbId);
        setFigures(figs || []);
      } catch (err) {
        setError(err.message);
        setFigures([]);
      } finally {
        setFiguresLoading(false);
      }
    }
    loadFigures();
  }, [chapter.pbId, chapter.id]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateChapter(chapter.id, { title, subtitle, concepts, formulas, exercises, quiz }, courseId);
      onSaved(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ── Figure helpers ────────────────────────────────────────
  async function handleFigureUpload(i, file) {
    setUploadingFig(i);
    setError(null);
    try {
      const fig = figures[i];
      // Pass figure ID only if it's a real DB record (not temp placeholder)
      const figureId = fig.id?.startsWith('temp-') ? null : fig.id;
      const uploaded = await uploadChapterFigure(chapter.pbId, fig.ref, fig.caption, file, figureId);
      setFigures(prev => prev.map((f, idx) => idx === i ? uploaded : f));
      // Re-fetch all figures to ensure UI is in sync with DB
      const refreshed = await fetchChapterFigures(chapter.pbId);
      setFigures(refreshed || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingFig(null);
    }
  }
  async function startEditFigure(i) {
    const fig = figures[i];
    setEditingFigIdx(i);
    setEditingFigRef(fig.ref);
    setEditingFigCaption(fig.caption);
  }
  async function saveFigureEdit() {
    if (editingFigIdx === null) return;
    const fig = figures[editingFigIdx];
    try {
      const updated = await updateChapterFigure(fig.id, editingFigRef, editingFigCaption);
      setFigures(prev => prev.map((f, idx) => idx === editingFigIdx ? updated : f));
      setEditingFigIdx(null);
      // Re-fetch all figures to ensure UI is in sync
      const refreshed = await fetchChapterFigures(chapter.pbId);
      setFigures(refreshed || []);
    } catch (err) {
      setError(err.message);
    }
  }
  async function handleFigureDelete(i) {
    const fig = figures[i];
    setUploadingFig(i);
    setError(null);
    try {
      // Only delete from DB if it has a real ID (not temp placeholder)
      if (!fig.id?.startsWith('temp-')) {
        await deleteChapterFigure(fig.id);
      }
      setFigures(prev => prev.filter((_, idx) => idx !== i));
      // Re-fetch all figures to ensure UI is in sync
      const refreshed = await fetchChapterFigures(chapter.pbId);
      setFigures(refreshed || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingFig(null);
    }
  }
  async function addFigurePlaceholder() {
    const ref = `fig${figures.length + 1}`;
    // Add placeholder to UI - will be saved to DB on first upload
    const placeholder = { id: `temp-${Date.now()}`, ref, caption: '', filename: null };
    setFigures(prev => [...prev, placeholder]);
  }

  // ── Concept helpers ────────────────────────────────────────
  function updateConcept(i, field, value) {
    setConcepts(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c));
  }
  function deleteConcept(i) {
    setConcepts(prev => prev.filter((_, idx) => idx !== i));
  }
  function addConcept() {
    setConcepts(prev => [...prev, { title: 'Nieuw concept', content: '' }]);
  }
  function moveConcept(i, dir) {
    setConcepts(prev => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  // ── Formula helpers ────────────────────────────────────────
  function updateFormula(i, field, value) {
    setFormulas(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: value } : f));
  }
  function deleteFormula(i) {
    setFormulas(prev => prev.filter((_, idx) => idx !== i));
  }
  function addFormula() {
    setFormulas(prev => [...prev, { name: 'Nieuwe formule', latex: '' }]);
  }

  // ── Exercise helpers ───────────────────────────────────────
  function updateExercise(i, field, value) {
    setExercises(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
  }
  function updateExerciseStep(ei, si, field, value) {
    setExercises(prev => prev.map((e, idx) => {
      if (idx !== ei) return e;
      const steps = [...e.steps];
      steps[si] = { ...steps[si], [field]: value };
      return { ...e, steps };
    }));
  }
  function addExerciseStep(ei) {
    setExercises(prev => prev.map((e, idx) => {
      if (idx !== ei) return e;
      return {
        ...e,
        steps: [...(e.steps ?? []), { question: 'Nieuwe stap', hints: [], answer: '', solution: '' }],
      };
    }));
  }
  function deleteExerciseStep(ei, si) {
    setExercises(prev => prev.map((e, idx) => {
      if (idx !== ei) return e;
      return { ...e, steps: e.steps.filter((_, i) => i !== si) };
    }));
  }
  function deleteExercise(i) {
    setExercises(prev => prev.filter((_, idx) => idx !== i));
  }
  function addExercise() {
    setExercises(prev => [...prev, { title: 'Nieuwe opgave', label: '', intro: '', steps: [] }]);
  }

  // ── Quiz helpers ───────────────────────────────────────────
  function updateQuiz(i, field, value) {
    setQuiz(prev => prev.map((q, idx) => idx === i ? { ...q, [field]: value } : q));
  }
  function updateQuizOption(qi, oi, value) {
    setQuiz(prev => prev.map((q, idx) => {
      if (idx !== qi) return q;
      const options = [...q.options];
      options[oi] = value;
      return { ...q, options };
    }));
  }
  function deleteQuiz(i) {
    setQuiz(prev => prev.filter((_, idx) => idx !== i));
  }
  function addQuiz() {
    setQuiz(prev => [...prev, {
      question: 'Nieuwe vraag?',
      options: ['Optie A', 'Optie B', 'Optie C', 'Optie D'],
      correct: 0,
      explanation: '',
    }]);
  }

  return (
    <div className="chapter-editor">
      {/* ── Header ── */}
      <div className="editor-header">
        <h2>{t('editor_title', { id: chapter.id })}</h2>
        <div className="editor-header-actions">
          {error && <span className="editor-error">{error}</span>}
          <button onClick={onClose} className="btn-secondary">{t('common_cancel')}</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? t('common_saving') : t('common_save')}
          </button>
        </div>
      </div>

      {/* ── Metadata ── */}
      <div className="editor-meta">
        <label>
          {t('editor_title_field')}
          <input value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        <label>
          {t('editor_subtitle_field')}
          <input value={subtitle} onChange={e => setSubtitle(e.target.value)} />
        </label>
      </div>

      {/* ── Tabs ── */}
      <div className="tab-bar">
        {['concepts', 'formulas', 'exercises', 'quiz', 'figures'].map(tabName => (
          <button key={tabName} className={`tab ${tab === tabName ? 'active' : ''}`} onClick={() => setTab(tabName)}>
            {tabName === 'concepts' ? t('editor_concepts_tab', { count: concepts.length })
              : tabName === 'formulas' ? t('editor_formulas_tab', { count: formulas.length })
              : tabName === 'exercises' ? t('editor_exercises_tab', { count: exercises.length })
              : tabName === 'quiz' ? t('editor_quiz_tab', { count: quiz.length })
              : t('editor_figures_tab', { count: figures.length })}
          </button>
        ))}
      </div>

      <div className="editor-content">

        {/* ── Concepts ── */}
        {tab === 'concepts' && (
          <div className="editor-list">
            {concepts.map((c, i) => (
              <div key={i} className="editor-item">
                <div className="editor-item-header">
                  <span className="editor-item-number">{i + 1}</span>
                  <div className="editor-item-controls">
                    <button onClick={() => moveConcept(i, -1)} disabled={i === 0} className="btn-icon" title={t('editor_move_up')}>↑</button>
                    <button onClick={() => moveConcept(i, 1)} disabled={i === concepts.length - 1} className="btn-icon" title={t('editor_move_down')}>↓</button>
                    <button onClick={() => deleteConcept(i)} className="btn-icon btn-delete" title={t('editor_delete')}>✕</button>
                  </div>
                </div>
                <label>
                  {t('editor_title_field')}
                  <input value={c.title} onChange={e => updateConcept(i, 'title', e.target.value)} />
                </label>
                <label>
                  {t('editor_content_field')} <span className="label-hint">{t('editor_latex_hint')}</span>
                  <textarea rows={5} value={c.content} onChange={e => updateConcept(i, 'content', e.target.value)} />
                </label>
              </div>
            ))}
            <button onClick={addConcept} className="btn-add">{t('editor_add_concept')}</button>
          </div>
        )}

        {/* ── Formulas ── */}
        {tab === 'formulas' && (
          <div className="editor-list">
            {formulas.map((f, i) => (
              <div key={i} className="editor-item editor-item-formula">
                <div className="editor-item-header">
                  <span className="editor-item-number">{i + 1}</span>
                  <button onClick={() => deleteFormula(i)} className="btn-icon btn-delete" title={t('editor_delete')}>✕</button>
                </div>
                <label>
                  {t('editor_name_field')}
                  <input value={f.name} onChange={e => updateFormula(i, 'name', e.target.value)} />
                </label>
                <label>
                  {t('editor_latex_field')}
                  <input
                    value={f.latex}
                    onChange={e => updateFormula(i, 'latex', e.target.value)}
                    className="latex-input"
                    spellCheck={false}
                  />
                </label>
                {f.latex && (
                  <div className="formula-preview">
                    <span className="formula-preview-label">{t('editor_preview')}</span>
                    <MathBlock latex={f.latex} />
                  </div>
                )}
              </div>
            ))}
            <button onClick={addFormula} className="btn-add">{t('editor_add_formula')}</button>
          </div>
        )}

        {/* ── Exercises ── */}
        {tab === 'exercises' && (
          <div className="editor-list">
            {exercises.map((ex, ei) => (
              <div key={ei} className="editor-item editor-item-exercise">
                <div className="editor-item-header">
                  <span className="editor-item-number">O{ei + 1}</span>
                  <button onClick={() => deleteExercise(ei)} className="btn-icon btn-delete" title={t('editor_delete')}>✕</button>
                </div>
                <label>
                  {t('editor_title_field')}
                  <input value={ex.title} onChange={e => updateExercise(ei, 'title', e.target.value)} />
                </label>
                <label>
                  {t('editor_label_field')}
                  <input value={ex.label ?? ''} onChange={e => updateExercise(ei, 'label', e.target.value)} placeholder="e.g., Exercise 1.1" />
                </label>
                <label>
                  {t('editor_intro_field')}
                  <textarea rows={2} value={ex.intro ?? ''} onChange={e => updateExercise(ei, 'intro', e.target.value)} />
                </label>
                <div className="exercise-steps">
                  <h4>{t('editor_steps_label')}</h4>
                  {(ex.steps ?? []).map((step, si) => (
                    <div key={si} className="editor-item-step">
                      <div className="step-header">
                        <span className="step-number">{t('editor_step')} {si + 1}</span>
                        <button onClick={() => deleteExerciseStep(ei, si)} className="btn-icon btn-delete" title={t('editor_delete')}>✕</button>
                      </div>
                      <label>
                        {t('editor_question_field')}
                        <textarea rows={2} value={step.question} onChange={e => updateExerciseStep(ei, si, 'question', e.target.value)} />
                      </label>
                      <label>
                        {t('editor_answer_field')}
                        <input value={step.answer ?? ''} onChange={e => updateExerciseStep(ei, si, 'answer', e.target.value)} placeholder="e.g., $2x + 3$" />
                      </label>
                      <label>
                        {t('editor_solution_field')}
                        <textarea rows={2} value={step.solution ?? ''} onChange={e => updateExerciseStep(ei, si, 'solution', e.target.value)} />
                      </label>
                    </div>
                  ))}
                  <button onClick={() => addExerciseStep(ei)} className="btn-add btn-add-step">{t('editor_add_step')}</button>
                </div>
              </div>
            ))}
            <button onClick={addExercise} className="btn-add">{t('editor_add_exercise')}</button>
          </div>
        )}

        {/* ── Quiz ── */}
        {tab === 'quiz' && (
          <div className="editor-list">
            {quiz.map((q, qi) => (
              <div key={qi} className="editor-item">
                <div className="editor-item-header">
                  <span className="editor-item-number">V{qi + 1}</span>
                  <button onClick={() => deleteQuiz(qi)} className="btn-icon btn-delete" title={t('editor_delete')}>✕</button>
                </div>
                <label>
                  {t('editor_question_field')} <span className="label-hint">{t('editor_question_hint')}</span>
                  <textarea rows={2} value={q.question} onChange={e => updateQuiz(qi, 'question', e.target.value)} />
                </label>
                <div className="editor-options-label">{t('editor_options_label')} <span className="label-hint">{t('editor_options_hint')}</span></div>
                <div className="editor-options">
                  {(q.options ?? []).map((opt, oi) => (
                    <label key={oi} className={`editor-option ${q.correct === oi ? 'correct' : ''}`}>
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={q.correct === oi}
                        onChange={() => updateQuiz(qi, 'correct', oi)}
                      />
                      <input
                        value={opt}
                        onChange={e => updateQuizOption(qi, oi, e.target.value)}
                      />
                    </label>
                  ))}
                </div>
                <label>
                  {t('editor_explanation_field')}
                  <textarea rows={2} value={q.explanation} onChange={e => updateQuiz(qi, 'explanation', e.target.value)} />
                </label>
              </div>
            ))}
            <button onClick={addQuiz} className="btn-add">{t('editor_add_question')}</button>
          </div>
        )}

        {/* ── Figures ── */}
        {tab === 'figures' && (
          <div className="editor-list">
            <p className="editor-hint">{t('editor_figures_hint')}</p>
            {figuresLoading ? (
              <p>{t('common_loading')}</p>
            ) : (
              <>
                {figures.map((fig, i) => {
                  const isEditing = editingFigIdx === i;
                  const thumbUrl = fig.filename
                    ? pb.files.getURL({ collectionName: 'chapter_figures', id: fig.id }, fig.filename, { thumb: '400x0' })
                    : null;
                  const isPdf = fig.filename?.toLowerCase().endsWith('.pdf');
                  return (
                    <div key={fig.id} className="editor-item editor-item-figure">
                      <div className="editor-item-header">
                        <span className="editor-item-number">[fig:{isEditing ? editingFigRef : fig.ref}]</span>
                        <div>
                          {isEditing && (
                            <button onClick={saveFigureEdit} className="btn-icon" title={t('common_save')}>✓</button>
                          )}
                          <button onClick={() => isEditing ? setEditingFigIdx(null) : startEditFigure(i)} className="btn-icon" title={isEditing ? t('common_cancel') : t('editor_edit')}>
                            {isEditing ? '✕' : '✏️'}
                          </button>
                          <button onClick={() => handleFigureDelete(i)} className="btn-icon btn-delete" title={t('editor_delete')} disabled={uploadingFig === i}>🗑️</button>
                        </div>
                      </div>
                      {isEditing ? (
                        <>
                          <label>
                            {t('editor_figure_ref')}
                            <input value={editingFigRef} onChange={e => setEditingFigRef(e.target.value)} />
                          </label>
                          <label>
                            {t('editor_figure_caption')}
                            <input value={editingFigCaption} onChange={e => setEditingFigCaption(e.target.value)} />
                          </label>
                        </>
                      ) : (
                        <>
                          <label>
                            {t('editor_figure_ref')}
                            <input value={fig.ref} disabled />
                          </label>
                          <label>
                            {t('editor_figure_caption')}
                            <input value={fig.caption} disabled />
                          </label>
                        </>
                      )}
                      <div className="figure-upload-row">
                        {thumbUrl && !isPdf && (
                          <img src={thumbUrl} alt={fig.caption || fig.ref} className="figure-thumb-preview" />
                        )}
                        {isPdf && (
                          <span className="figure-pdf-badge">📄 PDF</span>
                        )}
                        {!fig.filename && (
                          <span className="figure-pending-badge">{t('editor_figure_pending')}</span>
                        )}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml,application/pdf"
                          style={{ display: 'none' }}
                          ref={el => { fileInputRefs.current[i] = el; }}
                          onChange={e => { if (e.target.files[0]) handleFigureUpload(i, e.target.files[0]); }}
                        />
                        <button
                          className="btn-secondary"
                          disabled={uploadingFig === i}
                          onClick={() => fileInputRefs.current[i]?.click()}
                        >
                          {uploadingFig === i ? t('editor_figure_uploading') : (fig.filename ? t('editor_figure_replace') : t('editor_figure_upload'))}
                        </button>
                      </div>
                    </div>
                  );
                })}
                <button onClick={addFigurePlaceholder} className="btn-add">{t('editor_add_figure')}</button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
