import { createElement, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteNavbar from '../components/SiteNavbar.jsx';
import { apiFetch } from '../api.js';

const Form = ({ children, ...props }) => <form {...props}>{children}</form>;
Form.Label = ({ children, ...props }) => <label {...props}>{children}</label>;
Form.Control = ({ as = 'input', className = '', ...props }) => createElement(as, { ...props, className: `form-control ${className}`.trim() });
const Button = ({ children, ...props }) => <button {...props}>{children}</button>;

export default function Login() {
  const [businessId, setBusinessId] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loginChallenge, setLoginChallenge] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      const response = await apiFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mfaRequired ? { loginChallenge, otp } : { businessId: trimmedBusinessId, password })
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
      window.location.href = 'https://app.datarheo.io';
    } catch (requestError) {
      const message = requestError instanceof TypeError
        ? 'Unable to reach the server. Please check the connection or API configuration.'
        : requestError.message;
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return <div className="login-page"><SiteNavbar variant="login" /><div className="split-login"><section className="split-login-panel login-story-panel" aria-labelledby="login-story-title"><p className="login-story-kicker">CONNECTED DATA, ALWAYS MOVING</p><h2 id="login-story-title"><span>Move data with confidence—</span>{' '}<span>datarheo.io keeps every source and warehouse in sync.</span></h2><p className="login-story-copy">One reliable flow for the systems your team already uses.</p></section><div className="split-login-form-wrap split-login-form-wrap--animated"><div className="login-card login-card--pop"><h1>Sign in</h1><p className="login-subtitle">{mfaRequired ? 'Enter the code from your authenticator app.' : 'Enter your business email and password to continue.'}</p><Form className="login-form" onSubmit={handleSubmit}><Form.Label htmlFor="business-id">Business email</Form.Label><Form.Control type="email" id="business-id" name="businessId" autoComplete="username" placeholder="you@company.com" required value={businessId} readOnly={mfaRequired} onChange={(event) => { setBusinessId(event.target.value); setError(''); }} className="login-input" /><Form.Label htmlFor="password">Password</Form.Label><Form.Control type="password" id="password" name="password" autoComplete="current-password" required value={password} readOnly={mfaRequired} onChange={(event) => { setPassword(event.target.value); setError(''); }} className="login-input" />{mfaRequired && <><Form.Label htmlFor="login-otp">Authenticator code</Form.Label><Form.Control type="text" id="login-otp" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" autoComplete="one-time-code" required value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }} className="login-input" /></>}{error && <div className="login-error" role="alert">{error}</div>}<Button type="submit" className="cta login-submit login-submit--shine" disabled={submitting}>{submitting ? 'Signing in...' : mfaRequired ? 'Verify and sign in' : 'Continue'}</Button></Form><p className="login-help">New to datarheo.io? <Link to="/register">Create an account</Link></p></div></div></div><footer className="simple-footer"><p>&copy; 2026 datarheo.io. All rights reserved.</p></footer></div>;
}
