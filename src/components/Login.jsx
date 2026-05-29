import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Login({ onClose }) {
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      onClose();
    } catch (err) {
      setError(err.message ?? t('login_failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{t('login_title')}</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            {t('login_email')}
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
            />
          </label>
          <label>
            {t('login_password')}
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">{t('common_cancel')}</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? t('login_loading') : t('login_title')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
