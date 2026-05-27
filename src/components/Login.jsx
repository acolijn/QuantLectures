import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login({ onClose }) {
  const { signIn } = useAuth();
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
      setError(err.message ?? 'Inloggen mislukt');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Inloggen</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            E-mailadres
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
            Wachtwoord
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
            <button type="button" onClick={onClose} className="btn-secondary">Annuleren</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Bezig…' : 'Inloggen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
