import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SiteNavbar from '../components/SiteNavbar.jsx';
import { authRequest } from '../api.js';

export default function Login() {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [signedIn, setSignedIn] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return setError('Email is required.');
    if (!trimmedEmail.includes('@')) return setError('Please enter a valid email address.');
    if (!password) return setError('Password is required.');
    setSubmitting(true);
    setError('');
    try {
      const result = await authRequest('/login', { email: trimmedEmail, password });
      if (typeof result.token !== 'string' || !result.token) {
        throw new Error('Sign-in could not be completed. Please try again.');
      }
      sessionStorage.setItem('authToken', result.token);
      setPassword('');
      setSignedIn(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <SiteNavbar variant="login" />
      <main id="main-content" className="split-login">
        <section className="split-login-panel login-story-panel" aria-labelledby="login-story-title">
          <p className="login-story-kicker">LESS FRICTION. MORE FLOW.</p>
          <h2 id="login-story-title">Your data.<br />Better connected.</h2>
          <p className="login-story-copy">Bring your sources, applications, and warehouses together in one reliable flow.</p>
          <div className="auth-flow" aria-label="Connect, sync, and build">
            <span>01 <strong>Connect</strong></span>
            <span>02 <strong>Sync</strong></span>
            <span>03 <strong>Build</strong></span>
          </div>
          <Link to="/#simulator" className="auth-story-link">Explore the pipeline demo →</Link>
        </section>
        <div className="split-login-form-wrap">
          <div className="login-card">
            {signedIn ? (
              <>
                <div className="auth-success-icon" aria-hidden="true">✓</div>
                <h1>You're signed in</h1>
                <p className="login-subtitle" role="status">Successfully signed in as {email.trim()}.</p>
                <p>Your account is ready. Explore our interactive demo to see how data moves between systems.</p>
                <a href="/#simulator" className="cta login-submit">Explore pipeline demo →</a>
                <button type="button" className="auth-text-button" onClick={() => {
                  sessionStorage.removeItem('authToken');
                  setSignedIn(false);
                }}>Sign out</button>
              </>
            ) : (
              <>
                <p className="auth-eyebrow">WELCOME BACK</p>
                <h1>Sign in to Datarheo</h1>
                <p className="login-subtitle">Good data starts with a connection.</p>
                {location.state?.registered && <p className="auth-notice" role="status">Account created. Sign in with your new password.</p>}
                <form className="login-form" onSubmit={handleSubmit} aria-busy={submitting}>
                  <fieldset disabled={submitting}>
                    <label htmlFor="email">Work email</label>
                    <input type="email" id="email" name="email" autoComplete="username" placeholder="you@company.com" required value={email} onChange={(event) => { setEmail(event.target.value); setError(''); }} className="form-control" />
                    <label htmlFor="password">Password</label>
                    <div className="auth-password-field">
                      <input type={showPassword ? 'text' : 'password'} id="password" name="password" autoComplete="current-password" placeholder="Enter your password" required value={password} onChange={(event) => { setPassword(event.target.value); setError(''); }} className="form-control" />
                      <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
                    </div>
                    {error && <div className="login-error" role="alert">{error}</div>}
                    <button type="submit" className="cta login-submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in →'}</button>
                  </fieldset>
                </form>
                <p className="login-help">New to Datarheo? <Link to="/register">Create an account</Link></p>
              </>
            )}
          </div>
        </div>
      </main>
      <footer className="simple-footer"><p>&copy; {new Date().getFullYear()} datarheo.io · Connected data, always moving.</p></footer>
    </div>
  );
}
