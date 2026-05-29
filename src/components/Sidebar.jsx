import { useEffect, useState } from 'react';
import MathText from './MathText';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

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
  courseMembers,
  onLoadCourseMembers,
  onAddEditor,
  onRemoveEditor,
  chapters,
  activeChapter,
  onSelectChapter,
  progress,
  onResetProgress,
  onLoginClick,
  onReorderChapters,
}) {
  const { user, isTeacher, signOut } = useAuth();
  const { t } = useLanguage();
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [overIndex, setOverIndex]       = useState(null);
  const [showCourseSettings, setShowCourseSettings] = useState(false);
  const [savingCourse, setSavingCourse] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [membersLoading, setMembersLoading] = useState(false);
  const [memberActionLoading, setMemberActionLoading] = useState(false);
  const [memberMessage, setMemberMessage] = useState('');
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

  const isCourseOwner = course?.memberRole === 'owner';

  useEffect(() => {
    if (!showCourseSettings || !course || course.memberRole !== 'owner') return;
    if (courseMembers.length > 0) return;

    setMembersLoading(true);
    onLoadCourseMembers?.()
      .catch(err => {
        console.error('Failed to load course members:', err);
        setMemberMessage(t('sidebar_member_load_failed'));
      })
        .finally(() => setMembersLoading(false));
      }, [showCourseSettings, course, courseMembers.length, t]);

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
    if (!isCourseOwner) {
      setSaveMessage(t('sidebar_owner_only_settings'));
      return;
    }

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
      setSaveMessage(t('sidebar_saved'));
    } catch (err) {
      console.error('Saving course settings failed:', err);
      setSaveMessage(t('sidebar_save_failed'));
    } finally {
      setSavingCourse(false);
    }
  }

  async function handleAddEditor(e) {
    e.preventDefault();
    if (!onAddEditor || !memberEmail.trim()) return;

    setMemberActionLoading(true);
    setMemberMessage('');
    try {
      await onAddEditor(memberEmail.trim());
      setMemberEmail('');
      setMemberMessage(t('sidebar_member_added'));
    } catch (err) {
      setMemberMessage(err.message || t('sidebar_member_add_failed'));
    } finally {
      setMemberActionLoading(false);
    }
  }

  async function handleRemoveEditor(memberId) {
    if (!onRemoveEditor) return;
    if (!window.confirm(t('sidebar_remove_editor_confirm'))) return;

    setMemberActionLoading(true);
    setMemberMessage('');
    try {
      await onRemoveEditor(memberId);
      setMemberMessage(t('sidebar_member_removed'));
    } catch (err) {
      setMemberMessage(err.message || t('sidebar_member_remove_failed'));
    } finally {
      setMemberActionLoading(false);
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>{course?.name ?? 'QuantLectures'}</h1>
        <p className="sidebar-subtitle">{course?.subtitle ?? t('sidebar_default_subtitle')}</p>
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
              {t('sidebar_course')}
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
              {t('sidebar_new_course')}
            </button>
            {course && (
              <>
                <button
                  className="sidebar-auth-btn sidebar-course-settings-toggle"
                  onClick={() => setShowCourseSettings(prev => !prev)}
                >
                  {showCourseSettings ? t('sidebar_close_course_settings') : t('sidebar_open_course_settings')}
                </button>

                {showCourseSettings && (
                  <div className="sidebar-course-settings">
                    <form onSubmit={handleSaveCourseSettings}>
                      <label className="sidebar-course-label">
                        {t('sidebar_name')}
                        <input
                          className="sidebar-course-input"
                          type="text"
                          value={courseForm.name}
                          disabled={!isCourseOwner}
                          onChange={e => setCourseForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </label>

                      <label className="sidebar-course-label">
                        {t('sidebar_subtitle')}
                        <input
                          className="sidebar-course-input"
                          type="text"
                          value={courseForm.subtitle}
                          disabled={!isCourseOwner}
                          onChange={e => setCourseForm(prev => ({ ...prev, subtitle: e.target.value }))}
                        />
                      </label>

                      <label className="sidebar-course-label">
                        {t('sidebar_language')}
                        <select
                          className="sidebar-course-select"
                          value={courseForm.language}
                          disabled={!isCourseOwner}
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
                          disabled={!isCourseOwner}
                          onChange={e => setCourseForm(prev => ({ ...prev, published: e.target.checked }))}
                        />
                        {t('sidebar_published')}
                      </label>

                      <label className="sidebar-course-label">
                        {t('sidebar_subject_prompt')}
                        <textarea
                          className="sidebar-course-textarea"
                          rows={5}
                          placeholder={t('sidebar_subject_prompt_placeholder')}
                          value={courseForm.subjectPrompt}
                          disabled={!isCourseOwner}
                          onChange={e => setCourseForm(prev => ({ ...prev, subjectPrompt: e.target.value }))}
                        />
                      </label>

                      <p className="sidebar-course-hint">
                        {t('sidebar_prompt_hint')}
                      </p>

                      <button className="sidebar-auth-btn sidebar-course-save" type="submit" disabled={savingCourse}>
                        {savingCourse ? t('common_saving') : t('common_save')}
                      </button>

                      {!isCourseOwner && (
                        <p className="sidebar-course-hint">{t('sidebar_owner_only_settings')}</p>
                      )}

                      {saveMessage && <p className="sidebar-course-save-message">{saveMessage}</p>}
                    </form>

                    {isCourseOwner && (
                      <div className="sidebar-members-panel">
                        <h4 className="sidebar-members-title">{t('sidebar_members_title')}</h4>
                        <form className="sidebar-members-form" onSubmit={handleAddEditor}>
                          <input
                            className="sidebar-course-input"
                            type="email"
                            placeholder={t('sidebar_member_email_placeholder')}
                            value={memberEmail}
                            onChange={e => setMemberEmail(e.target.value)}
                          />
                          <button
                            className="sidebar-auth-btn sidebar-course-save"
                            type="submit"
                            disabled={memberActionLoading || !memberEmail.trim()}
                          >
                            {t('sidebar_add_editor')}
                          </button>
                        </form>

                        {membersLoading ? (
                          <p className="sidebar-course-hint">{t('sidebar_loading_members')}</p>
                        ) : (
                          <ul className="sidebar-members-list">
                            {courseMembers.map(member => (
                              <li key={member.id} className="sidebar-members-item">
                                <div>
                                  <div className="sidebar-members-email">{member.email || member.name || member.userId}</div>
                                  <div className="sidebar-members-role">{member.role === 'owner' ? t('sidebar_owner_label') : t('sidebar_editor_label')}</div>
                                </div>
                                {member.role === 'editor' && (
                                  <button
                                    className="sidebar-auth-btn sidebar-members-remove"
                                    onClick={() => handleRemoveEditor(member.id)}
                                    disabled={memberActionLoading}
                                  >
                                    {t('sidebar_remove')}
                                  </button>
                                )}
                              </li>
                            ))}
                            {courseMembers.length === 0 && (
                              <li className="sidebar-course-hint">{t('sidebar_no_members')}</li>
                            )}
                          </ul>
                        )}

                        {memberMessage && <p className="sidebar-course-save-message">{memberMessage}</p>}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Auth section */}
        <div className="sidebar-auth">
          {user ? (
            <div className="sidebar-auth-user">
              <span className="sidebar-auth-role">{isTeacher ? t('sidebar_teacher_role') : t('sidebar_student_role')}</span>
              <span className="sidebar-auth-email">{user.email}</span>
              <button className="sidebar-auth-btn" onClick={signOut}>{t('sidebar_sign_out')}</button>
            </div>
          ) : (
            <button className="sidebar-auth-btn sidebar-auth-btn--login" onClick={onLoginClick}>
              {t('sidebar_sign_in')}
            </button>
          )}
        </div>

        <div className="overall-progress">
          <div className="progress-header">
            <span className="progress-label">
              {t('sidebar_progress', {
                done: Object.values(progress).filter(p => p.quizCompleted).length,
                total: chapters.length,
              })}
            </span>
            {Object.keys(progress).length > 0 && (
              <button
                className="reset-progress-btn"
                onClick={() => {
                  if (window.confirm(t('sidebar_reset_confirm'))) {
                    onResetProgress();
                  }
                }}
                title={t('sidebar_reset_title')}
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