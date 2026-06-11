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
  isAdmin,
  onSelectCourse,
  onCreateCourse,
  onUpdateCourse,
  courseMembers,
  onLoadCourseMembers,
  onAddEditor,
  onRemoveEditor,
  courseInvites,
  onLoadCourseInvites,
  onCreateInvite,
  onRevokeInvite,
  onRedeemInvite,
  pendingTeachers,
  onLoadPendingTeachers,
  onApproveTeacher,
  onRejectTeacher,
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
  const [inviteCode, setInviteCode] = useState('');
  const [inviteMaxUses, setInviteMaxUses] = useState('');
  const [inviteExpiresAt, setInviteExpiresAt] = useState('');
  const [invitesLoading, setInvitesLoading] = useState(false);
  const [inviteActionLoading, setInviteActionLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemingInvite, setRedeemingInvite] = useState(false);
  const [redeemMessage, setRedeemMessage] = useState('');
  const [pendingActionLoading, setPendingActionLoading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const [pendingLoading, setPendingLoading] = useState(false);
  const [courseForm, setCourseForm] = useState({
    name: '',
    subtitle: '',
    language: 'nl',
    published: false,
    public: false,
    subjectPrompt: '',
  });

  useEffect(() => {
    if (!course) {
      setCourseForm({
        name: '',
        subtitle: '',
        language: 'nl',
        published: false,
        public: false,
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
      public: !!course.public,
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

  useEffect(() => {
    if (!showCourseSettings || !course || course.memberRole !== 'owner') return;
    if (courseInvites.length > 0) return;

    setInvitesLoading(true);
    onLoadCourseInvites?.()
      .catch(err => {
        console.error('Failed to load invites:', err);
        setInviteMessage(t('sidebar_invite_load_failed'));
      })
      .finally(() => setInvitesLoading(false));
  }, [showCourseSettings, course, courseInvites.length, onLoadCourseInvites, t]);

  useEffect(() => {
    if (!isAdmin) return;
    if (pendingTeachers.length > 0) return;

    setPendingLoading(true);
    onLoadPendingTeachers?.()
      .catch(err => {
        console.error('Failed to load pending teachers:', err);
        setPendingMessage(t('sidebar_pending_load_failed'));
      })
      .finally(() => setPendingLoading(false));
  }, [isAdmin, pendingTeachers.length, onLoadPendingTeachers, t]);

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

  async function handleRedeemInvite(e) {
    e.preventDefault();
    if (!onRedeemInvite || !redeemCode.trim()) return;

    setRedeemingInvite(true);
    setRedeemMessage('');
    try {
      await onRedeemInvite(redeemCode.trim());
      setRedeemCode('');
      setRedeemMessage(t('sidebar_redeem_success'));
    } catch (err) {
      setRedeemMessage(err.message || t('sidebar_redeem_failed'));
    } finally {
      setRedeemingInvite(false);
    }
  }

  async function handleApprovePending(userId) {
    if (!onApproveTeacher) return;
    setPendingActionLoading(true);
    setPendingMessage('');
    try {
      await onApproveTeacher(userId);
      setPendingMessage(t('sidebar_pending_approved'));
    } catch (err) {
      setPendingMessage(err.message || t('sidebar_pending_approve_failed'));
    } finally {
      setPendingActionLoading(false);
    }
  }

  async function handleRejectPending(userId) {
    if (!onRejectTeacher) return;
    if (!window.confirm(t('sidebar_pending_reject_confirm'))) return;

    setPendingActionLoading(true);
    setPendingMessage('');
    try {
      await onRejectTeacher(userId, 'delete');
      setPendingMessage(t('sidebar_pending_rejected'));
    } catch (err) {
      setPendingMessage(err.message || t('sidebar_pending_reject_failed'));
    } finally {
      setPendingActionLoading(false);
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>{course?.name ?? 'MiniLectures'}</h1>
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
        {(courses.length > 0 || isTeacher) && (
          <div className="sidebar-course-controls">
            {courses.length > 0 && (
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
            )}
            {isTeacher && (
              <>
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
                          onChange={e => setCourseForm(prev => ({
                            ...prev,
                            published: e.target.checked,
                            public: e.target.checked ? prev.public : false,
                          }))}
                        />
                        {t('sidebar_published')}
                      </label>

                      <label className="sidebar-course-checkbox">
                        <input
                          type="checkbox"
                          checked={courseForm.public}
                          disabled={!isCourseOwner || !courseForm.published}
                          onChange={e => setCourseForm(prev => ({ ...prev, public: e.target.checked }))}
                        />
                        {t('sidebar_public')}
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

                    {isCourseOwner && (
                      <div className="sidebar-members-panel">
                        <h4 className="sidebar-members-title">{t('sidebar_invites_title')}</h4>
                        <form className="sidebar-members-form" onSubmit={handleCreateInvite}>
                          <input
                            className="sidebar-course-input"
                            type="text"
                            placeholder={t('sidebar_invite_code_placeholder')}
                            value={inviteCode}
                            onChange={e => setInviteCode(e.target.value.toUpperCase())}
                          />
                          <input
                            className="sidebar-course-input"
                            type="number"
                            min="1"
                            placeholder={t('sidebar_invite_max_uses_placeholder')}
                            value={inviteMaxUses}
                            onChange={e => setInviteMaxUses(e.target.value)}
                          />
                          <input
                            className="sidebar-course-input"
                            type="datetime-local"
                            value={inviteExpiresAt}
                            onChange={e => setInviteExpiresAt(e.target.value)}
                          />
                          <button
                            className="sidebar-auth-btn sidebar-course-save"
                            type="submit"
                            disabled={inviteActionLoading || !inviteCode.trim()}
                          >
                            {t('sidebar_invite_create')}
                          </button>
                        </form>

                        {invitesLoading ? (
                          <p className="sidebar-course-hint">{t('sidebar_loading_invites')}</p>
                        ) : (
                          <ul className="sidebar-members-list">
                            {courseInvites.map(invite => (
                              <li key={invite.id} className="sidebar-members-item">
                                <div>
                                  <div className="sidebar-members-email">{invite.code}</div>
                                  <div className="sidebar-members-role">
                                    {invite.active ? t('sidebar_invite_active') : t('sidebar_invite_inactive')}
                                    {' · '}
                                    {t('sidebar_invite_usage', { used: invite.usedCount, max: invite.maxUses ?? '∞' })}
                                  </div>
                                </div>
                                {invite.active && (
                                  <button
                                    className="sidebar-auth-btn sidebar-members-remove"
                                    onClick={() => handleRevokeInvite(invite.id)}
                                    disabled={inviteActionLoading}
                                  >
                                    {t('sidebar_invite_revoke')}
                                  </button>
                                )}
                              </li>
                            ))}
                            {courseInvites.length === 0 && (
                              <li className="sidebar-course-hint">{t('sidebar_no_invites')}</li>
                            )}
                          </ul>
                        )}

                        {inviteMessage && <p className="sidebar-course-save-message">{inviteMessage}</p>}
                      </div>
                    )}
                  </div>
                )}
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* Auth section */}
        <div className="sidebar-auth">
          {user ? (
            <div className="sidebar-auth-user">
              <span className="sidebar-auth-role">
                {isAdmin ? t('sidebar_admin_role') : (isTeacher ? t('sidebar_teacher_role') : t('sidebar_student_role'))}
              </span>
              <span className="sidebar-auth-email">{user.email}</span>
              <button className="sidebar-auth-btn" onClick={signOut}>{t('sidebar_sign_out')}</button>

              {!isTeacher && !isAdmin && (
                <form className="sidebar-members-form" onSubmit={handleRedeemInvite}>
                  <input
                    className="sidebar-course-input"
                    type="text"
                    placeholder={t('sidebar_redeem_code_placeholder')}
                    value={redeemCode}
                    onChange={e => setRedeemCode(e.target.value.toUpperCase())}
                  />
                  <button
                    className="sidebar-auth-btn sidebar-course-save"
                    type="submit"
                    disabled={redeemingInvite || !redeemCode.trim()}
                  >
                    {t('sidebar_redeem_code')}
                  </button>
                  {redeemMessage && <p className="sidebar-course-save-message">{redeemMessage}</p>}
                </form>
              )}
            </div>
          ) : (
            <button className="sidebar-auth-btn sidebar-auth-btn--login" onClick={onLoginClick}>
              {t('sidebar_sign_in')}
            </button>
          )}
        </div>

        {isAdmin && (
          <div className="sidebar-members-panel">
            <h4 className="sidebar-members-title">{t('sidebar_pending_title')}</h4>
            {pendingLoading ? (
              <p className="sidebar-course-hint">{t('sidebar_loading_pending')}</p>
            ) : (
              <ul className="sidebar-members-list">
                {pendingTeachers.map(item => (
                  <li key={item.id} className="sidebar-members-item">
                    <div>
                      <div className="sidebar-members-email">{item.email}</div>
                      <div className="sidebar-members-role">{item.name || t('sidebar_no_name')}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="sidebar-auth-btn sidebar-members-remove"
                        onClick={() => handleApprovePending(item.id)}
                        disabled={pendingActionLoading}
                      >
                        {t('sidebar_pending_approve')}
                      </button>
                      <button
                        className="sidebar-auth-btn sidebar-members-remove"
                        onClick={() => handleRejectPending(item.id)}
                        disabled={pendingActionLoading}
                      >
                        {t('sidebar_pending_reject')}
                      </button>
                    </div>
                  </li>
                ))}
                {pendingTeachers.length === 0 && (
                  <li className="sidebar-course-hint">{t('sidebar_no_pending')}</li>
                )}
              </ul>
            )}
            {pendingMessage && <p className="sidebar-course-save-message">{pendingMessage}</p>}
          </div>
        )}

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