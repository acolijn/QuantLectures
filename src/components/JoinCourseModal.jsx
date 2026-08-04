import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Maps the `reason` keys returned by the /api/redeem-invite hook to translations.
const REASON_KEYS = {
  not_authenticated: 'join_error_not_authenticated',
  staff_cannot_redeem: 'join_error_staff',
  empty_code: 'join_error_empty',
  unknown_code: 'join_error_unknown',
  expired: 'join_error_expired',
  exhausted: 'join_error_exhausted',
  already_enrolled: 'join_error_already_enrolled',
};

export default function JoinCourseModal({ initialCode = '', onRedeem, onClose, onJoined }) {
  const { t } = useLanguage();
  const [code, setCode] = useState(initialCode.toUpperCase());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose?.(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!code.trim() || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const courseId = await onRedeem(code.trim());
      onJoined?.(courseId);
    } catch (err) {
      setError(t(REASON_KEYS[err?.reason] ?? 'join_error_generic'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal join-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('join_title')}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="join-intro">{t('join_intro')}</p>

        <form onSubmit={handleSubmit}>
          <input
            className="join-code-input"
            type="text"
            autoFocus
            spellCheck={false}
            placeholder={t('join_code_placeholder')}
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
          />

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {t('common_cancel')}
            </button>
            <button type="submit" className="btn-primary" disabled={submitting || !code.trim()}>
              {submitting ? t('join_submitting') : t('join_submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
