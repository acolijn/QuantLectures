import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { groupChapters } from '../lib/chapterOrder';
import { selectChapters } from '../lib/printDoc';

// Picks what goes into the printable document. Quizzes are never an option:
// they are interactive by nature and meaningless on paper.
export default function PrintDialog({ course, parts, chapters, currentChapter, onClose, onPrint }) {
  const { t } = useLanguage();
  const [kind, setKind] = useState(currentChapter ? 'chapter' : 'course');
  const [partId, setPartId] = useState(parts?.[0]?.id ?? null);
  const [includeFormulas, setIncludeFormulas] = useState(true);
  const [includeExercises, setIncludeExercises] = useState(false);

  const groups = groupChapters(parts, chapters);
  // Only offer parts that would actually print something.
  const printableGroups = groups.filter(g => g.part && g.chapters.length > 0);

  const scope =
    kind === 'chapter' ? { kind: 'chapter', pbId: currentChapter?.pbId }
    : kind === 'part' ? { kind: 'part', partId }
    : { kind: 'course' };

  const count = selectChapters(parts, chapters, scope).flatMap(g => g.chapters).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal printdialog" onClick={e => e.stopPropagation()}>
        <h2>{t('print_dialog_title')}</h2>

        <div className="printdialog-section">
          <div className="printdialog-legend">{t('print_scope')}</div>

          {currentChapter && (
            <label className="printdialog-option">
              <input
                type="radio"
                checked={kind === 'chapter'}
                onChange={() => setKind('chapter')}
              />
              <span>{t('print_scope_chapter', { title: currentChapter.title })}</span>
            </label>
          )}

          {printableGroups.length > 0 && (
            <label className="printdialog-option">
              <input
                type="radio"
                checked={kind === 'part'}
                onChange={() => setKind('part')}
              />
              <span>{t('print_scope_part')}</span>
              <select
                value={partId ?? ''}
                disabled={kind !== 'part'}
                onChange={e => setPartId(e.target.value || null)}
              >
                {printableGroups.map(g => (
                  <option key={g.part.id} value={g.part.id}>{g.part.title}</option>
                ))}
              </select>
            </label>
          )}

          <label className="printdialog-option">
            <input
              type="radio"
              checked={kind === 'course'}
              onChange={() => setKind('course')}
            />
            <span>{t('print_scope_course', { name: course?.name ?? '' })}</span>
          </label>
        </div>

        <div className="printdialog-section">
          <div className="printdialog-legend">{t('print_include')}</div>
          <label className="printdialog-option">
            <input
              type="checkbox"
              checked={includeFormulas}
              onChange={e => setIncludeFormulas(e.target.checked)}
            />
            <span>{t('print_include_formulas')}</span>
          </label>
          <label className="printdialog-option">
            <input
              type="checkbox"
              checked={includeExercises}
              onChange={e => setIncludeExercises(e.target.checked)}
            />
            <span>{t('print_include_exercises')}</span>
          </label>
          <p className="printdialog-note">{t('print_no_quizzes')}</p>
        </div>

        <div className="printdialog-actions">
          <button className="btn-secondary" onClick={onClose}>{t('common_cancel')}</button>
          <button
            className="btn-primary"
            disabled={count === 0}
            onClick={() => onPrint(scope, { includeFormulas, includeExercises })}
          >
            {count === 1 ? t('print_open_one') : t('print_open', { count })}
          </button>
        </div>
      </div>
    </div>
  );
}
