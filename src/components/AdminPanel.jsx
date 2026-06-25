import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function AdminPanel({
  onClose,
  pendingTeachers,
  onLoadPendingTeachers,
  onApproveTeacher,
  onRejectTeacher,
}) {
  const { t } = useLanguage();
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingActionLoading, setPendingActionLoading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');

  useEffect(() => {
    setPendingLoading(true);
    onLoadPendingTeachers?.()
      .catch(err => {
        console.error('Failed to load pending teachers:', err);
        setPendingMessage(t('sidebar_pending_load_failed'));
      })
      .finally(() => setPendingLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose?.(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

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
    <div className="course-settings-overlay" onMouseDown={onClose}>
      <div className="course-settings-panel" onMouseDown={e => e.stopPropagation()}>
        <header className="course-settings-header">
          <h2>{t('admin_title')}</h2>
          <button className="course-settings-close" onClick={onClose} aria-label={t('common_cancel')}>✕</button>
        </header>

        <div className="course-settings-body">
          <section className="course-settings-section">
            <h3 className="course-settings-section-title">{t('sidebar_pending_title')}</h3>
            {pendingLoading ? (
              <p className="course-settings-hint">{t('sidebar_loading_pending')}</p>
            ) : (
              <ul className="course-settings-list">
                {pendingTeachers.map(item => (
                  <li key={item.id} className="course-settings-list-item">
                    <div>
                      <div className="course-settings-list-main">{item.email}</div>
                      <div className="course-settings-list-sub">{item.name || t('sidebar_no_name')}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="course-settings-btn course-settings-btn--primary"
                        onClick={() => handleApprovePending(item.id)}
                        disabled={pendingActionLoading}
                      >
                        {t('sidebar_pending_approve')}
                      </button>
                      <button
                        className="course-settings-btn course-settings-btn--danger-soft"
                        onClick={() => handleRejectPending(item.id)}
                        disabled={pendingActionLoading}
                      >
                        {t('sidebar_pending_reject')}
                      </button>
                    </div>
                  </li>
                ))}
                {pendingTeachers.length === 0 && (
                  <li className="course-settings-hint">{t('sidebar_no_pending')}</li>
                )}
              </ul>
            )}
            {pendingMessage && <p className="course-settings-message">{pendingMessage}</p>}
          </section>
        </div>
      </div>
    </div>
  );
}
