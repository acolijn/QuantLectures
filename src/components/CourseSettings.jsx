import { useEffect, useRef, useState } from 'react';
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

export default function CourseSettings({
  course,
  onClose,
  onUpdateCourse,
  onDeleteCourse,
  courseMembers,
  onLoadCourseMembers,
  teachers,
  onLoadTeachers,
  onAddEditor,
  onRemoveEditor,
  courseInvites,
  onLoadCourseInvites,
  onCreateInvite,
  onRevokeInvite,
}) {
  const { t } = useLanguage();
  const [savingCourse, setSavingCourse] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [teacherQuery, setTeacherQuery] = useState('');
  const [showTeacherList, setShowTeacherList] = useState(false);
  const teacherPickerRef = useRef(null);
  const [membersLoading, setMembersLoading] = useState(false);
  const [memberActionLoading, setMemberActionLoading] = useState(false);
  const [memberMessage, setMemberMessage] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteMaxUses, setInviteMaxUses] = useState('');
  const [inviteExpiresAt, setInviteExpiresAt] = useState('');
  const [invitesLoading, setInvitesLoading] = useState(false);
  const [inviteActionLoading, setInviteActionLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');
  const [courseForm, setCourseForm] = useState({
    name: course?.name ?? '',
    subtitle: course?.subtitle ?? '',
    language: course?.language ?? 'nl',
    published: !!course?.published,
    public: !!course?.public,
    subjectPrompt: course?.subjectPrompt ?? '',
  });

  const isCourseOwner = course?.memberRole === 'owner';

  useEffect(() => {
    setCourseForm({
      name: course?.name ?? '',
      subtitle: course?.subtitle ?? '',
      language: course?.language ?? 'nl',
      published: !!course?.published,
      public: !!course?.public,
      subjectPrompt: course?.subjectPrompt ?? '',
    });
    setSaveMessage('');
  }, [course]);

  useEffect(() => {
    if (!isCourseOwner) return;
    onLoadCourseMembers?.().catch(err => {
      console.error('Failed to load course members:', err);
      setMemberMessage(t('sidebar_member_load_failed'));
    });
    onLoadTeachers?.().catch(err => console.error('Failed to load teachers:', err));
    onLoadCourseInvites?.().catch(err => {
      console.error('Failed to load invites:', err);
      setInviteMessage(t('sidebar_invite_load_failed'));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?.id, isCourseOwner]);

  useEffect(() => {
    if (!showTeacherList) return;
    function handleClickOutside(e) {
      if (teacherPickerRef.current && !teacherPickerRef.current.contains(e.target)) {
        setShowTeacherList(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTeacherList]);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose?.(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const memberUserIds = new Set(courseMembers.map(m => m.userId).filter(Boolean));
  const query = teacherQuery.trim().toLowerCase();
  const nonMemberTeachers = (teachers ?? []).filter(teacher => !memberUserIds.has(teacher.id));
  const matchedTeachers = nonMemberTeachers.filter(teacher =>
    !query ||
    teacher.name.toLowerCase().includes(query) ||
    (teacher.email && teacher.email.toLowerCase().includes(query))
  );
  const MAX_VISIBLE = 8;
  const availableTeachers = matchedTeachers.slice(0, MAX_VISIBLE);
  const extraCount = matchedTeachers.length - availableTeachers.length;

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
        public: courseForm.public,
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

  async function handleAddEditor(teacher) {
    if (!onAddEditor || !teacher?.id) return;
    setMemberActionLoading(true);
    setMemberMessage('');
    try {
      await onAddEditor(teacher.id);
      setTeacherQuery('');
      setShowTeacherList(false);
      await onLoadCourseMembers?.();
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
      await onLoadCourseMembers?.();
      setMemberMessage(t('sidebar_member_removed'));
    } catch (err) {
      setMemberMessage(err.message || t('sidebar_member_remove_failed'));
    } finally {
      setMemberActionLoading(false);
    }
  }

  async function handleCreateInvite(e) {
    e.preventDefault();
    if (!onCreateInvite || !inviteCode.trim()) return;
    setInviteActionLoading(true);
    setInviteMessage('');
    try {
      await onCreateInvite({
        code: inviteCode.trim().toUpperCase(),
        maxUses: inviteMaxUses.trim() ? Number(inviteMaxUses) : null,
        expiresAt: inviteExpiresAt || null,
      });
      setInviteCode('');
      setInviteMaxUses('');
      setInviteExpiresAt('');
      setInviteMessage(t('sidebar_invite_created'));
    } catch (err) {
      setInviteMessage(err.message || t('sidebar_invite_create_failed'));
    } finally {
      setInviteActionLoading(false);
    }
  }

  async function handleRevokeInvite(inviteId) {
    if (!onRevokeInvite) return;
    if (!window.confirm(t('sidebar_invite_revoke_confirm'))) return;
    setInviteActionLoading(true);
    setInviteMessage('');
    try {
      await onRevokeInvite(inviteId);
      setInviteMessage(t('sidebar_invite_revoked'));
    } catch (err) {
      setInviteMessage(err.message || t('sidebar_invite_revoke_failed'));
    } finally {
      setInviteActionLoading(false);
    }
  }

  return (
    <div className="course-settings-overlay" onMouseDown={onClose}>
      <div className="course-settings-panel" onMouseDown={e => e.stopPropagation()}>
        <header className="course-settings-header">
          <h2>{t('settings_title')}</h2>
          <button className="course-settings-close" onClick={onClose} aria-label={t('common_cancel')}>✕</button>
        </header>

        <div className="course-settings-body">
          <form className="course-settings-section" onSubmit={handleSaveCourseSettings}>
            <h3 className="course-settings-section-title">{t('settings_general')}</h3>
            <div className="course-settings-grid">
              <label className="course-settings-label">
                {t('sidebar_name')}
                <input
                  className="course-settings-input"
                  type="text"
                  value={courseForm.name}
                  disabled={!isCourseOwner}
                  onChange={e => setCourseForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </label>
              <label className="course-settings-label">
                {t('sidebar_subtitle')}
                <input
                  className="course-settings-input"
                  type="text"
                  value={courseForm.subtitle}
                  disabled={!isCourseOwner}
                  onChange={e => setCourseForm(prev => ({ ...prev, subtitle: e.target.value }))}
                />
              </label>
              <label className="course-settings-label">
                {t('sidebar_language')}
                <select
                  className="course-settings-input"
                  value={courseForm.language}
                  disabled={!isCourseOwner}
                  onChange={e => setCourseForm(prev => ({ ...prev, language: e.target.value }))}
                >
                  {LANGUAGE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <h3 className="course-settings-section-title">{t('settings_visibility')}</h3>
            <label className="course-settings-checkbox">
              <input
                type="checkbox"
                checked={courseForm.published}
                disabled={!isCourseOwner}
                onChange={e => setCourseForm(prev => ({
                  ...prev,
                  published: e.target.checked,
                  public: e.target.checked ? prev.public : false,
                }))}
              />
              {t('sidebar_published')}
            </label>
            <label className="course-settings-checkbox">
              <input
                type="checkbox"
                checked={courseForm.public}
                disabled={!isCourseOwner || !courseForm.published}
                onChange={e => setCourseForm(prev => ({ ...prev, public: e.target.checked }))}
              />
              {t('sidebar_public')}
            </label>

            <h3 className="course-settings-section-title">{t('settings_ai')}</h3>
            <label className="course-settings-label">
              {t('sidebar_subject_prompt')}
              <textarea
                className="course-settings-textarea"
                rows={6}
                placeholder={t('sidebar_subject_prompt_placeholder')}
                value={courseForm.subjectPrompt}
                disabled={!isCourseOwner}
                onChange={e => setCourseForm(prev => ({ ...prev, subjectPrompt: e.target.value }))}
              />
            </label>
            <p className="course-settings-hint">{t('sidebar_prompt_hint')}</p>

            <div className="course-settings-actions">
              <button className="course-settings-btn course-settings-btn--primary" type="submit" disabled={savingCourse || !isCourseOwner}>
                {savingCourse ? t('common_saving') : t('common_save')}
              </button>
              {saveMessage && <span className="course-settings-message">{saveMessage}</span>}
            </div>
            {!isCourseOwner && <p className="course-settings-hint">{t('sidebar_owner_only_settings')}</p>}
          </form>

          {isCourseOwner && (
            <section className="course-settings-section">
              <h3 className="course-settings-section-title">{t('sidebar_members_title')}</h3>
              <div className="sidebar-teacher-picker" ref={teacherPickerRef}>
                <input
                  className="course-settings-input"
                  type="text"
                  placeholder={t('sidebar_teacher_search_placeholder')}
                  value={teacherQuery}
                  onChange={e => { setTeacherQuery(e.target.value); setShowTeacherList(true); }}
                  onFocus={() => setShowTeacherList(true)}
                />
                {showTeacherList && (
                  <ul className="sidebar-teacher-options">
                    {availableTeachers.map(teacher => (
                      <li key={teacher.id}>
                        <button
                          type="button"
                          className="sidebar-teacher-option"
                          disabled={memberActionLoading}
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => handleAddEditor(teacher)}
                        >
                          <span className="sidebar-teacher-name">{teacher.name}</span>
                          {teacher.email && teacher.email !== teacher.name && (
                            <span className="sidebar-teacher-email">{teacher.email}</span>
                          )}
                        </button>
                      </li>
                    ))}
                    {availableTeachers.length === 0 && (
                      <li className="sidebar-course-hint sidebar-teacher-empty">
                        {nonMemberTeachers.length === 0
                          ? t('sidebar_teacher_none_available')
                          : t('sidebar_teacher_no_match')}
                      </li>
                    )}
                    {extraCount > 0 && (
                      <li className="sidebar-course-hint sidebar-teacher-more">
                        {t('sidebar_teacher_more', { count: extraCount })}
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="course-settings-subhead">{t('sidebar_current_members')}</div>
              {membersLoading ? (
                <p className="course-settings-hint">{t('sidebar_loading_members')}</p>
              ) : (
                <ul className="course-settings-list">
                  {courseMembers.map(member => (
                    <li key={member.id} className="course-settings-list-item">
                      <div>
                        <div className="course-settings-list-main">{member.email || member.name || member.userId}</div>
                        <div className="course-settings-list-sub">{member.role === 'owner' ? t('sidebar_owner_label') : t('sidebar_editor_label')}</div>
                      </div>
                      {member.role === 'editor' && (
                        <button
                          className="course-settings-btn course-settings-btn--danger-soft"
                          onClick={() => handleRemoveEditor(member.id)}
                          disabled={memberActionLoading}
                        >
                          {t('sidebar_remove')}
                        </button>
                      )}
                    </li>
                  ))}
                  {courseMembers.length === 0 && (
                    <li className="course-settings-hint">{t('sidebar_no_members')}</li>
                  )}
                </ul>
              )}
              {memberMessage && <p className="course-settings-message">{memberMessage}</p>}
            </section>
          )}

          {isCourseOwner && (
            <section className="course-settings-section">
              <h3 className="course-settings-section-title">{t('sidebar_invites_title')}</h3>
              <form className="course-settings-invite-form" onSubmit={handleCreateInvite}>
                <input
                  className="course-settings-input"
                  type="text"
                  placeholder={t('sidebar_invite_code_placeholder')}
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value.toUpperCase())}
                />
                <input
                  className="course-settings-input"
                  type="number"
                  min="1"
                  placeholder={t('sidebar_invite_max_uses_placeholder')}
                  value={inviteMaxUses}
                  onChange={e => setInviteMaxUses(e.target.value)}
                />
                <input
                  className="course-settings-input"
                  type="datetime-local"
                  value={inviteExpiresAt}
                  onChange={e => setInviteExpiresAt(e.target.value)}
                />
                <button
                  className="course-settings-btn course-settings-btn--primary"
                  type="submit"
                  disabled={inviteActionLoading || !inviteCode.trim()}
                >
                  {t('sidebar_invite_create')}
                </button>
              </form>

              {invitesLoading ? (
                <p className="course-settings-hint">{t('sidebar_loading_invites')}</p>
              ) : (
                <ul className="course-settings-list">
                  {courseInvites.map(invite => (
                    <li key={invite.id} className="course-settings-list-item">
                      <div>
                        <div className="course-settings-list-main">{invite.code}</div>
                        <div className="course-settings-list-sub">
                          {invite.active ? t('sidebar_invite_active') : t('sidebar_invite_inactive')}
                          {' · '}
                          {t('sidebar_invite_usage', { used: invite.usedCount, max: invite.maxUses ?? '∞' })}
                        </div>
                      </div>
                      {invite.active && (
                        <button
                          className="course-settings-btn course-settings-btn--danger-soft"
                          onClick={() => handleRevokeInvite(invite.id)}
                          disabled={inviteActionLoading}
                        >
                          {t('sidebar_invite_revoke')}
                        </button>
                      )}
                    </li>
                  ))}
                  {courseInvites.length === 0 && (
                    <li className="course-settings-hint">{t('sidebar_no_invites')}</li>
                  )}
                </ul>
              )}
              {inviteMessage && <p className="course-settings-message">{inviteMessage}</p>}
            </section>
          )}

          {isCourseOwner && (
            <section className="course-settings-section course-settings-danger">
              <h3 className="course-settings-section-title">{t('settings_danger')}</h3>
              <p className="course-settings-hint">{t('settings_danger_hint')}</p>
              <button
                className="course-settings-btn course-settings-btn--danger"
                type="button"
                onClick={onDeleteCourse}
              >
                {t('sidebar_delete_course')}
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
