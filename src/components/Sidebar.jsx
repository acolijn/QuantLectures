import { useState } from 'react';
import MathText from './MathText';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Sidebar({
  course,
  isAdmin,
  onGoHome,
  onRedeemInvite,
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
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemingInvite, setRedeemingInvite] = useState(false);
  const [redeemMessage, setRedeemMessage] = useState('');

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

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {onGoHome && (
          <button className="sidebar-home-btn" onClick={onGoHome}>
            {t('sidebar_all_courses')}
          </button>
        )}
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

      {user && chapters.length > 0 && (
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
      )}

      <div className="sidebar-footer">
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
      </div>
    </aside>
  );
}
