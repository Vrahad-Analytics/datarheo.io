import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteNavbar from '../components/SiteNavbar.jsx';
import { apiFetch } from '../api.js';

export default function ResetPassword() {
  const [token] = useState(() => window.__datarheoPasswordResetToken || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    delete window.__datarheoPasswordResetToken;
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (password.length < 12) return setError('Password must be at least 12 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');

    setSubmitting(true);
    setError('');
    try {
      const response = await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Could not reset your password.');
      setComplete(true);
    } catch (requestError) {
      const message = requestError instanceof TypeError
        ? 'Unable to reach the server. Please check the connection or API configuration.'
        : requestError.message;
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <SiteNavbar variant="login" />
      <div className="split-login">
        <section className="split-login-panel login-story-panel" aria-labelledby="reset-story-title">
          <p className="login-story-kicker">CONNECTED DATA, ALWAYS MOVING</p>
          <h2 id="reset-story-title"><span>Secure your</span>{' '}<span>data workspace.</span></h2>
          <p className="login-story-copy">Choose a new password to get back to your workspace.</p>
        </section>
        <div className="split-login-form-wrap split-login-form-wrap--animated">
          <div className="login-card login-card--pop">
            <h1>Reset password</h1>
            {complete ? (
              <>
                <p className="login-success" role="status">Your password has been reset. You can now sign in.</p>
                <p className="login-help"><Link to="/login">Return to sign in</Link></p>
              </>
            ) : !token ? (
              <>
                <p className="login-error" role="alert">This password reset link is invalid or has expired.</p>
                <p className="login-help"><Link to="/login">Return to sign in</Link></p>
              </>
            ) : (
              <>
                <p className="login-subtitle">Choose a new password with at least 12 characters.</p>
                <form className="login-form" onSubmit={handleSubmit}>
                  <label htmlFor="new-password">New password</label>
                  <input className="form-control login-input" type="password" id="new-password" autoComplete="new-password" minLength={12} maxLength={128} required value={password} onChange={(event) => { setPassword(event.target.value); setError(''); }} />
                  <label htmlFor="confirm-new-password">Confirm new password</label>
                  <input className="form-control login-input" type="password" id="confirm-new-password" autoComplete="new-password" minLength={12} maxLength={128} required value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value); setError(''); }} />
                  {error && <div className="login-error" role="alert">{error}</div>}
                  <button type="submit" className="cta login-submit login-submit--shine" disabled={submitting}>
                    {submitting ? 'Resetting...' : 'Reset password'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <footer className="simple-footer"><p>&copy; 2026 datarheo.io. All rights reserved.</p></footer>
    </div>
  );
}
