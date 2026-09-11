import { createElement, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteNavbar from '../components/SiteNavbar.jsx';

const Form = ({ children, ...props }) => <form {...props}>{children}</form>;
Form.Label = ({ children, ...props }) => <label {...props}>{children}</label>;
Form.Control = ({ as = 'input', className = '', ...props }) => createElement(as, { ...props, className: `form-control ${className}`.trim() });
const Button = ({ children, ...props }) => <button {...props}>{children}</button>;
const Spinner = ({ className = '' }) => <span className={className} aria-hidden="true" />;

export default function Login() {
  const [businessId, setBusinessId] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState('business');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedBusinessId = businessId.trim();

    if (!trimmedBusinessId) {
      setError(authMode === 'email' ? 'Email is required.' : 'Business ID is required.');
      return;
    }

    if (authMode === 'business' && trimmedBusinessId.includes('@')) {
      setError('Please enter a valid Business ID, not an email address.');
      return;
    }

    if (authMode === 'email' && !trimmedBusinessId.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    setError('');
    setSubmitting(true);

    window.setTimeout(() => { window.location.href = 'https://app.datarheo.io/login?' + (authMode === 'email' ? 'email=' : 'business_id=') + encodeURIComponent(trimmedBusinessId); }, 450);
  }

  return (
    <div className="login-page">
      <SiteNavbar variant="login" />
      <div className="split-login">
          <div className="mobile-login-brand">
            <img src="/images/logo.png" alt="" className="mobile-login-logo" />
            <span>datarheo<em>.io</em></span>
          </div>
        <section className="split-login-panel login-story-panel" aria-labelledby="login-story-title">
          <p className="login-story-kicker">CONNECTED DATA, ALWAYS MOVING</p>
          <h2 id="login-story-title">
            <span>Move data with confidence—</span>{' '}
            <span>datarheo.io keeps every source and warehouse in sync.</span>
          </h2>
          <p className="login-story-copy">One reliable flow for the systems your team already uses.</p>
        </section>

        <div className="split-login-form-wrap split-login-form-wrap--animated">
          <span className="login-blob login-blob--1" aria-hidden="true" />
          <span className="login-blob login-blob--2" aria-hidden="true" />
          <span className="login-blob login-blob--3" aria-hidden="true" />
          <div className="login-card login-card--pop">
          <h1>Sign in</h1>
          <p className="login-subtitle">Enter your Business ID and password to continue.</p>
            <Form className="login-form" onSubmit={handleSubmit}>
              <Form.Label htmlFor="business-id">{authMode === 'email' ? 'Work email' : 'Business ID'}</Form.Label>
              <Form.Control type={authMode === 'email' ? 'email' : 'text'} id="business-id" name="business_id" placeholder={authMode === 'email' ? 'you@company.com' : 'e.g. DR-10492'} autoComplete="username" required value={businessId} onChange={(e) => { setBusinessId(e.target.value); setError(''); }} className="login-input" />
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control type="password" id="password" name="password" placeholder="Enter your password" autoComplete="current-password" required value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} className="login-input" />
              {error && <div className="login-error" role="alert">{error}</div>}
              <Button type="submit" className="cta login-submit login-submit--shine" disabled={submitting}>{submitting ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />Signing in…</> : 'Sign in'}</Button>
            </Form>
            <div className="login-divider"><span>Or log in with</span></div>
            <div className="login-provider-actions">
              <a className="login-provider-button login-github-button" href="https://app.datarheo.io/login?provider=github" aria-label="Log in with GitHub">
                <svg className="login-provider-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.46-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.64-1.37-2.22-.26-4.56-1.15-4.56-5.1 0-1.13.4-2.05 1.05-2.77-.1-.26-.45-1.31.1-2.73 0 0 .86-.28 2.75 1.06A9.37 9.37 0 0 1 12 6.8c.85 0 1.7.12 2.5.34 1.9-1.34 2.75-1.06 2.75-1.06.55 1.42.2 2.47.1 2.73.65.72 1.05 1.64 1.05 2.77 0 3.96-2.35 4.83-4.58 5.09.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.24 10.24 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
                </svg>
              </a>
              <a className="login-provider-button login-google-button" href="https://app.datarheo.io/login?provider=google" aria-label="Log in with Google">
                <svg className="login-provider-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.23-.2-1.77H12v3.42h5.52a4.72 4.72 0 0 1-2.04 3.1l2.96 2.3c1.73-1.6 2.72-3.95 2.72-7.05Z" />
                  <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.63-2.44l-2.96-2.3c-.82.55-1.87.88-3.67.88-2.61 0-4.83-1.76-5.62-4.13l-3.06 2.36A10 10 0 0 0 12 22Z" />
                  <path fill="#FBBC05" d="M6.38 14.01A5.98 5.98 0 0 1 6.07 12c0-.7.12-1.37.31-2.01L3.32 7.63A10 10 0 0 0 2 12c0 1.61.39 3.13 1.08 4.37l3.3-2.36Z" />
                  <path fill="#EA4335" d="M12 5.86c1.96 0 3.29.85 4.05 1.56l3.04-2.97C16.96 2.45 14.7 2 12 2a10 10 0 0 0-8.68 5.63l3.06 2.36C7.17 7.62 9.39 5.86 12 5.86Z" />
                </svg>
              </a>
            </div>
            <p className="login-help">Don&apos;t know your Business ID? <a href="mailto:hello@datarheo.io">Contact support</a></p>
            <p className="login-help login-register-link">New to datarheo.io? <Link to="/register">Create an account</Link></p>
          </div>
        </div>
      </div>

      <footer className="simple-footer"><p>&copy; 2026 datarheo.io. All rights reserved.</p></footer>
    </div>
  );
}
