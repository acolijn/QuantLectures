import { useState } from 'react';
import { updateChapter } from '../../lib/api';
import { MathBlock } from '../MathText';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ChapterEditor({ chapter, courseId, onClose, onSaved }) {
  const { t } = useLanguage();
  const [title, setTitle] = useState(chapter.title);
  const [subtitle, setSubtitle] = useState(chapter.subtitle);
  const [concepts, setConcepts] = useState(chapter.concepts ?? []);
  const [formulas, setFormulas] = useState(chapter.formulas ?? []);
  const [quiz, setQuiz] = useState(chapter.quiz ?? []);
  const [tab, setTab] = useState('concepts');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateChapter(chapter.id, { title, subtitle, concepts, formulas, quiz }, courseId);
      onSaved(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
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
        {['concepts', 'formulas', 'quiz'].map(tabName => (
          <button key={tabName} className={`tab ${tab === tabName ? 'active' : ''}`} onClick={() => setTab(tabName)}>
            {tabName === 'concepts' ? t('editor_concepts_tab', { count: concepts.length })
              : tabName === 'formulas' ? t('editor_formulas_tab', { count: formulas.length })
              : t('editor_quiz_tab', { count: quiz.length })}
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

      </div>
    </div>
  );
}
