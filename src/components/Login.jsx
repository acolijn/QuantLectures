import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Login({ onClose }) {
  const {
    signIn,
    signUp,
    requestPasswordReset,
    confirmPasswordReset,
    requestEmailVerification,
  } = useAuth();
  const { t } = useLanguage();
  const tokenFromUrl = new URLSearchParams(window.location.search).get('token') ?? '';
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [inviteRole, setInviteRole] = useState(tokenFromUrl ? 'teacher' : 'student');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === 'signin') {
      try {
        await signIn(email, password);
        onClose();
      } catch (err) {
        setError(err.message ?? t('login_failed'));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === 'signup') {
      if (password.length < 8) {
        setLoading(false);
        setError(t('auth_password_too_short'));
        return;
      }
      if (password !== passwordConfirm) {
        setLoading(false);
        setError(t('auth_password_mismatch'));
        return;
      }

      const hasTeacherToken = Boolean(tokenFromUrl);
      const role = hasTeacherToken && inviteRole === 'teacher' ? 'teacher' : (inviteRole === 'teacher' ? 'pending' : 'student');

      try {
        await signUp({
          name,
          email,
          password,
          role,
          signupToken: hasTeacherToken ? tokenFromUrl : '',
        });
        await requestEmailVerification(email);

        if (role === 'teacher') {
          setMessage(t('auth_signup_teacher_success'));
        } else if (role === 'pending') {
          setMessage(t('auth_signup_pending_success'));
        } else {
          setMessage(t('auth_signup_student_success'));
        }
      } catch (err) {
        setError(err.message ?? t('auth_signup_failed'));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === 'forgot') {
      try {
        await requestPasswordReset(email);
        setMessage(t('auth_forgot_success'));
      } catch (err) {
        setError(err.message ?? t('auth_forgot_failed'));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === 'reset') {
      if (newPassword.length < 8) {
        setLoading(false);
        setError(t('auth_password_too_short'));
        return;
      }
      if (newPassword !== passwordConfirm) {
        setLoading(false);
        setError(t('auth_password_mismatch'));
        return;
      }

      try {
        await confirmPasswordReset(resetToken, newPassword);
        setMessage(t('auth_reset_success'));
      } catch (err) {
        setError(err.message ?? t('auth_reset_failed'));
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(false);
  }

  function renderTitle() {
    if (mode === 'signup') return t('auth_signup_title');
    if (mode === 'forgot') return t('auth_forgot_title');
    if (mode === 'reset') return t('auth_reset_title');
    return t('login_title');
  }

  function renderSubmitLabel() {
    if (loading) return t('login_loading');
    if (mode === 'signup') return t('auth_signup_submit');
    if (mode === 'forgot') return t('auth_forgot_submit');
    if (mode === 'reset') return t('auth_reset_submit');
    return t('login_title');
  }

  function resetStatus() {
    setError(null);
    setMessage(null);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{renderTitle()}</h2>

        <div className="auth-mode-switch">
          <button type="button" className={`auth-mode-btn ${mode === 'signin' ? 'active' : ''}`} onClick={() => { setMode('signin'); resetStatus(); }}>
            {t('login_title')}
          </button>
          <button type="button" className={`auth-mode-btn ${mode === 'signup' ? 'active' : ''}`} onClick={() => { setMode('signup'); resetStatus(); }}>
            {t('auth_signup_title')}
          </button>
          <button type="button" className={`auth-mode-btn ${mode === 'forgot' ? 'active' : ''}`} onClick={() => { setMode('forgot'); resetStatus(); }}>
            {t('auth_forgot_title')}
          </button>
          <button type="button" className={`auth-mode-btn ${mode === 'reset' ? 'active' : ''}`} onClick={() => { setMode('reset'); resetStatus(); }}>
            {t('auth_reset_title')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {mode === 'signup' && (
            <label>
              {t('auth_name')}
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
              />
            </label>
          )}

          {(mode === 'signin' || mode === 'signup' || mode === 'forgot') && (
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
          )}

          {(mode === 'signin' || mode === 'signup') && (
            <label>
              {t('login_password')}
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
            </label>
          )}

          {mode === 'signup' && (
            <>
              <label>
                {t('auth_password_confirm')}
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={e => setPasswordConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </label>

              <label>
                {t('auth_account_type')}
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                  <option value="student">{t('auth_account_student')}</option>
                  <option value="teacher">{t('auth_account_teacher')}</option>
                </select>
              </label>

              {tokenFromUrl && inviteRole === 'teacher' && (
                <p className="form-message">{t('auth_teacher_token_detected')}</p>
              )}

              {!tokenFromUrl && inviteRole === 'teacher' && (
                <p className="form-message">{t('auth_teacher_without_token')}</p>
              )}
            </>
          )}

          {mode === 'reset' && (
            <>
              <label>
                {t('auth_reset_token')}
                <input
                  type="text"
                  value={resetToken}
                  onChange={e => setResetToken(e.target.value)}
                  required
                />
              </label>
              <label>
                {t('auth_new_password')}
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </label>
              <label>
                {t('auth_password_confirm')}
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={e => setPasswordConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </label>
            </>
          )}

          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-message">{message}</p>}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">{t('common_cancel')}</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {renderSubmitLabel()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
