import { createElement, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteNavbar from '../components/SiteNavbar.jsx';
import { apiFetch } from '../api.js';

const Form = ({ children, ...props }) => <form {...props}>{children}</form>;
Form.Label = ({ children, ...props }) => <label {...props}>{children}</label>;
Form.Control = ({ as = 'input', className = '', ...props }) => createElement(as, { ...props, className: `form-control ${className}`.trim() });
const Button = ({ children, ...props }) => <button {...props}>{children}</button>;

function getSafeReturnUrl() {
  const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const fallback = isLocalhost ? 'http://localhost:3000/' : 'https://app.datarheo.io/';
  const requested = new URLSearchParams(window.location.search).get('returnTo');
  if (!requested) return fallback;

  try {
    const target = new URL(requested);
    if (target.username || target.password) return fallback;
    if (target.origin === 'https://app.datarheo.io') return target.href;
    if (target.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(target.hostname)) return target.href;
  } catch {
    return fallback;
  }
  return fallback;
}

function usesTabSession(returnUrl) {
  const target = new URL(returnUrl);
  return target.origin === 'https://app.datarheo.io'
    || (target.protocol === 'http:'
      && ['localhost', '127.0.0.1'].includes(target.hostname)
      && target.port === '3000');
}

export default function Login() {
  const [businessId, setBusinessId] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loginChallenge, setLoginChallenge] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetRequestSent, setResetRequestSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function showLogin() {
    setForgotPassword(false);
    setResetRequestSent(false);
    setError('');
  }

  async function handleForgotPassword(event) {
    event.preventDefault();
    const trimmedBusinessId = businessId.trim();
    if (!trimmedBusinessId) return setError('Business email is required.');
    if (!trimmedBusinessId.includes('@') || !trimmedBusinessId.includes('.')) {
      return setError('Please enter a valid business email address.');
    }

    setSubmitting(true);
    setError('');
    try {
      const response = await apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: trimmedBusinessId })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Could not request a password reset.');
      setResetRequestSent(true);
    } catch (requestError) {
      const message = requestError instanceof TypeError
        ? 'Unable to reach the server. Please check the connection or API configuration.'
        : requestError.message;
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedBusinessId = businessId.trim();
    if (!trimmedBusinessId) return setError('Business email is required.');
    if (!trimmedBusinessId.includes('@') || !trimmedBusinessId.includes('.')) return setError('Please enter a valid business email address.');
    if (!mfaRequired && !password) return setError('Password is required.');
    if (mfaRequired && !/^\d{6}$/.test(otp)) return setError('Enter the 6-digit authenticator code.');
    setSubmitting(true);
    setError('');
    try {
      const endpoint = mfaRequired ? '/api/auth/login/verify-mfa' : '/api/auth/login';
      const returnUrl = getSafeReturnUrl();
      const tabSession = mfaRequired && usesTabSession(returnUrl);
      const response = await apiFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mfaRequired
          ? { loginChallenge, otp, ...(tabSession ? { tabSession: true } : {}) }
          : { businessId: trimmedBusinessId, password })
      });
      const result = await response.json();
      if (!response.ok) {
        if (mfaRequired && response.status === 401) {
          setMfaRequired(false);
          setLoginChallenge('');
          setOtp('');
        }
        throw new Error(result.message || 'Login failed.');
      }
      if (result.mfaRequired) {
        setMfaRequired(true);
        setLoginChallenge(result.loginChallenge);
        return;
      }
      if (tabSession) {
        if (typeof result.tabSessionHandoff !== 'string') {
          throw new Error('Could not establish a tab-specific session.');
        }
        const target = new URL(returnUrl);
        target.hash = new URLSearchParams({ tabSession: result.tabSessionHandoff }).toString();
        window.location.assign(target.href);
      } else {
        window.location.assign(returnUrl);
      }
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
        <section className="split-login-panel login-story-panel" aria-labelledby="login-story-title">
          <p className="login-story-kicker">CONNECTED DATA, ALWAYS MOVING</p>
          <h2 id="login-story-title"><span>Move data with confidence—</span>{' '}<span>datarheo.io keeps every source and warehouse in sync.</span></h2>
          <p className="login-story-copy">One reliable flow for the systems your team already uses.</p>
        </section>
        <div className="split-login-form-wrap split-login-form-wrap--animated">
          <div className="login-card login-card--pop">
            <h1>{forgotPassword ? 'Forgot password?' : 'Sign in'}</h1>
            <p className="login-subtitle">
              {forgotPassword
                ? 'Enter your business email and we’ll send a password reset link if an account exists.'
                : mfaRequired
                  ? 'Enter the code from your authenticator app.'
                  : 'Enter your business email and password to continue.'}
            </p>
            {resetRequestSent ? (
              <>
                <p className="login-success" role="status">If an account exists for that email, a password reset link has been sent.</p>
                <p className="login-help"><button type="button" className="login-text-button" onClick={showLogin}>Return to sign in</button></p>
              </>
            ) : (
              <Form className="login-form" onSubmit={forgotPassword ? handleForgotPassword : handleSubmit}>
                <Form.Label htmlFor="business-id">Business email</Form.Label>
                <Form.Control type="email" id="business-id" name="businessId" autoComplete="username" placeholder="you@company.com" required value={businessId} readOnly={mfaRequired} onChange={(event) => { setBusinessId(event.target.value); setError(''); }} className="login-input" />
                {!forgotPassword && <>
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <Form.Control type="password" id="password" name="password" autoComplete="current-password" required value={password} readOnly={mfaRequired} onChange={(event) => { setPassword(event.target.value); setError(''); }} className="login-input" />
                  {mfaRequired && <>
                    <Form.Label htmlFor="login-otp">Authenticator code</Form.Label>
                    <Form.Control type="text" id="login-otp" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" autoComplete="one-time-code" required value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }} className="login-input" />
                  </>}
                </>}
                {error && <div className="login-error" role="alert">{error}</div>}
                <Button type="submit" className="cta login-submit login-submit--shine" disabled={submitting}>
                  {submitting ? 'Please wait...' : forgotPassword ? 'Send reset link' : mfaRequired ? 'Verify and sign in' : 'Continue'}
                </Button>
              </Form>
            )}
            {!mfaRequired && !resetRequestSent && (
              <p className="login-help">
                {forgotPassword
                  ? <>Remember your password? <button type="button" className="login-text-button" onClick={showLogin}>Sign in</button></>
                  : <><button type="button" className="login-text-button" onClick={() => { setForgotPassword(true); setError(''); }}>Forgot password?</button><br />New to datarheo.io? <Link to="/register">Create an account</Link></>}
              </p>
            )}
          </div>
        </div>
      </div>
      <footer className="simple-footer"><p>&copy; 2026 datarheo.io. All rights reserved.</p></footer>
    </div>
  );
}
