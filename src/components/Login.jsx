import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Login({ onClose, link }) {
  const {
    signIn,
    signUp,
    requestPasswordReset,
    confirmPasswordReset,
    requestEmailVerification,
    confirmEmailVerification,
  } = useAuth();
  const { t } = useLanguage();
  const tokenFromUrl = new URLSearchParams(window.location.search).get('token') ?? '';
  // An emailed reset link opens straight into the reset form, token filled in.
  const [mode, setMode] = useState(link?.resetToken ? 'reset' : 'signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [inviteRole, setInviteRole] = useState(tokenFromUrl ? 'teacher' : 'student');
  const [resetToken, setResetToken] = useState(link?.resetToken ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  // Set after a successful signup: the form gives way to a screen that says
  // what happens next, instead of a one-line message under a filled-in form.
  const [signedUp, setSignedUp] = useState(null); // { role, email }

  // An emailed verification link needs no input: confirm it as soon as the
  // modal opens and report the outcome above the sign-in form.
  // A token is single-use, so guard against StrictMode's double effect run:
  // the second call would fail and overwrite the success message.
  const verifyToken = link?.verifyToken;
  const verifySent = useRef(false);
  useEffect(() => {
    if (!verifyToken || verifySent.current) return;
    verifySent.current = true;
    confirmEmailVerification(verifyToken)
      .then(() => setMessage(t('auth_verify_success')))
      .catch(() => setError(t('auth_verify_failed')));
  }, [verifyToken]); // eslint-disable-line react-hooks/exhaustive-deps

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
        setSignedUp({ role, email: email.trim().toLowerCase() });
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
        setMode('signin');
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

  function goToSignIn() {
    setEmail(signedUp?.email ?? email);
    setPassword('');
    setPasswordConfirm('');
    setSignedUp(null);
    resetStatus();
    setMode('signin');
  }

  if (signedUp) {
    const pending = signedUp.role === 'pending';
    const body = pending
      ? t('auth_done_pending_body')
      : signedUp.role === 'teacher'
        ? t('auth_done_teacher_body')
        : t('auth_done_student_body');
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal auth-done" onClick={e => e.stopPropagation()}>
          <div className="auth-done-icon" aria-hidden="true">{pending ? '⏳' : '✉️'}</div>
          <h2>{pending ? t('auth_done_pending_title') : t('auth_done_title')}</h2>
          <p className="auth-done-lead">
            {t('auth_done_sent_to')} <strong>{signedUp.email}</strong>
          </p>
          <p className="auth-done-body">{body}</p>
          <div className="form-actions">
            {pending ? (
              <button type="button" className="btn-primary" onClick={onClose}>{t('auth_done_close')}</button>
            ) : (
              <>
                <button type="button" className="btn-secondary" onClick={onClose}>{t('auth_done_close')}</button>
                <button type="button" className="btn-primary" onClick={goToSignIn}>{t('login_title')}</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
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
          {/* Reset needs the token from the emailed link, which opens this form
              by itself — a tab with an empty token field only confuses. */}
          {mode === 'reset' && (
            <button type="button" className="auth-mode-btn active">
              {t('auth_reset_title')}
            </button>
          )}
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
