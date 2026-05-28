import { useEffect, useState } from 'react';
import MathText from './MathText';
import { useAuth } from '../contexts/AuthContext';

const LANGUAGE_OPTIONS = [
  { value: 'nl', label: 'Nederlands (NL)' },
  { value: 'en', label: 'English (EN)' },
  { value: 'de', label: 'Deutsch (DE)' },
  { value: 'fr', label: 'Français (FR)' },
  { value: 'es', label: 'Español (ES)' },
  { value: 'it', label: 'Italiano (IT)' },
  { value: 'pt', label: 'Português (PT)' },
  { value: 'pl', label: 'Polski (PL)' },
];

export default function Sidebar({
  course,
  courses,
  activeCourseId,
  onSelectCourse,
  onCreateCourse,
  onUpdateCourse,
  chapters,
  activeChapter,
  onSelectChapter,
  progress,
  onResetProgress,
  onLoginClick,
  onReorderChapters,
}) {
  const { user, isTeacher, signOut } = useAuth();
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [overIndex, setOverIndex]       = useState(null);
  const [showCourseSettings, setShowCourseSettings] = useState(false);
  const [savingCourse, setSavingCourse] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [courseForm, setCourseForm] = useState({
    name: '',
    subtitle: '',
    language: 'nl',
    published: false,
    subjectPrompt: '',
  });

  useEffect(() => {
    if (!course) {
      setCourseForm({
        name: '',
        subtitle: '',
        language: 'nl',
        published: false,
        subjectPrompt: '',
      });
      setShowCourseSettings(false);
      setSaveMessage('');
      return;
    }

    setCourseForm({
      name: course.name ?? '',
      subtitle: course.subtitle ?? '',
      language: course.language ?? 'nl',
      published: !!course.published,
      subjectPrompt: course.subjectPrompt ?? '',
    });
    setSaveMessage('');
  }, [course]);

  function handleDragStart(e, index) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (index !== overIndex) setOverIndex(index);
  }

  function handleDrop(e, index) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setOverIndex(null);
      return;
    }
    const newOrder = [...chapters];
    const [moved] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, moved);
    onReorderChapters?.(newOrder);
    setDraggedIndex(null);
    setOverIndex(null);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
    setOverIndex(null);
  }

  async function handleSaveCourseSettings(e) {
    e.preventDefault();
    if (!course || !onUpdateCourse) return;

    setSavingCourse(true);
    setSaveMessage('');
    try {
      await onUpdateCourse({
        name: courseForm.name.trim() || course.name,
        subtitle: courseForm.subtitle.trim(),
        language: courseForm.language,
        published: courseForm.published,
        subjectPrompt: courseForm.subjectPrompt.trim(),
      });
      setSaveMessage('Opgeslagen');
    } catch (err) {
      console.error('Saving course settings failed:', err);
      setSaveMessage('Opslaan mislukt');
    } finally {
      setSavingCourse(false);
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>{course?.name ?? 'QuantLectures'}</h1>
        <p className="sidebar-subtitle">{course?.subtitle ?? 'Leeromgeving'}</p>
      </div>
      <nav className="chapter-list">
        {chapters.map((ch, i) => {
          const chProgress = progress[ch.id] || {};
          const quizDone = chProgress.quizCompleted;
          const bestScore = chProgress.bestScore;
          return (
            <button
              key={ch.pbId ?? ch.id}
              className={[
                'chapter-item',
                activeChapter === ch.id ? 'active' : '',
                draggedIndex === i      ? 'dragging' : '',
                overIndex === i         ? 'drag-over' : '',
              ].join(' ')}
              onClick={() => onSelectChapter(ch.id)}
              draggable={!!isTeacher}
              onDragStart={isTeacher ? e => handleDragStart(e, i) : undefined}
              onDragOver={isTeacher  ? e => handleDragOver(e, i)  : undefined}
              onDrop={isTeacher      ? e => handleDrop(e, i)      : undefined}
              onDragEnd={isTeacher   ? handleDragEnd               : undefined}
            >
              {isTeacher && <span className="drag-handle">⠿</span>}
              <span className="chapter-number">{ch.id}</span>
              <span className="chapter-info">
                <span className="chapter-title">
                  <MathText text={ch.title} />
                </span>
                {quizDone && (
                  <span className="chapter-score">
                    {bestScore !== undefined ? `${Math.round(bestScore)}%` : '✓'}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        {isTeacher && (
          <div className="sidebar-course-controls">
            <label className="sidebar-course-label">
              Cursus
              <select
                className="sidebar-course-select"
                value={activeCourseId ?? ''}
                onChange={e => onSelectCourse?.(e.target.value)}
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <button className="sidebar-auth-btn sidebar-course-create" onClick={onCreateCourse}>
              + Nieuwe cursus
            </button>
            {course && (
              <>
                <button
                  className="sidebar-auth-btn sidebar-course-settings-toggle"
                  onClick={() => setShowCourseSettings(prev => !prev)}
                >
                  {showCourseSettings ? '− Sluit cursusinstellingen' : '⚙️ Cursusinstellingen'}
                </button>

                {showCourseSettings && (
                  <form className="sidebar-course-settings" onSubmit={handleSaveCourseSettings}>
                    <label className="sidebar-course-label">
                      Naam
                      <input
                        className="sidebar-course-input"
                        type="text"
                        value={courseForm.name}
                        onChange={e => setCourseForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </label>

                    <label className="sidebar-course-label">
                      Subtitel
                      <input
                        className="sidebar-course-input"
                        type="text"
                        value={courseForm.subtitle}
                        onChange={e => setCourseForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      />
                    </label>

                    <label className="sidebar-course-label">
                      Taal
                      <select
                        className="sidebar-course-select"
                        value={courseForm.language}
                        onChange={e => setCourseForm(prev => ({ ...prev, language: e.target.value }))}
                      >
                        {LANGUAGE_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </label>

                    <label className="sidebar-course-checkbox">
                      <input
                        type="checkbox"
                        checked={courseForm.published}
                        onChange={e => setCourseForm(prev => ({ ...prev, published: e.target.checked }))}
                      />
                      Gepubliceerd (zichtbaar voor studenten)
                    </label>

                    <label className="sidebar-course-label">
                      Subject prompt
                      <textarea
                        className="sidebar-course-textarea"
                        rows={5}
                        placeholder="Bijv. Write in English. The subject is classical mechanics..."
                        value={courseForm.subjectPrompt}
                        onChange={e => setCourseForm(prev => ({ ...prev, subjectPrompt: e.target.value }))}
                      />
                    </label>

                    <p className="sidebar-course-hint">
                      De vaste JSON- en formatteringsregels worden automatisch toegevoegd aan de prompt.
                    </p>

                    <button className="sidebar-auth-btn sidebar-course-save" type="submit" disabled={savingCourse}>
                      {savingCourse ? 'Opslaan…' : 'Opslaan'}
                    </button>

                    {saveMessage && <p className="sidebar-course-save-message">{saveMessage}</p>}
                  </form>
                )}
              </>
            )}
          </div>
        )}

        {/* Auth section */}
        <div className="sidebar-auth">
          {user ? (
            <div className="sidebar-auth-user">
              <span className="sidebar-auth-role">{isTeacher ? '🎓 Docent' : '📚 Student'}</span>
              <span className="sidebar-auth-email">{user.email}</span>
              <button className="sidebar-auth-btn" onClick={signOut}>Uitloggen</button>
            </div>
          ) : (
            <button className="sidebar-auth-btn sidebar-auth-btn--login" onClick={onLoginClick}>
              Inloggen
            </button>
          )}
        </div>

        <div className="overall-progress">
          <div className="progress-header">
            <span className="progress-label">
              Voortgang: {Object.values(progress).filter(p => p.quizCompleted).length}/{chapters.length}
            </span>
            {Object.keys(progress).length > 0 && (
              <button
                className="reset-progress-btn"
                onClick={() => {
                  if (window.confirm('Weet je zeker dat je alle voortgang wilt resetten?')) {
                    onResetProgress();
                  }
                }}
                title="Reset voortgang"
              >
                ↺
              </button>
            )}
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{
                width: `${(Object.values(progress).filter(p => p.quizCompleted).length / chapters.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}