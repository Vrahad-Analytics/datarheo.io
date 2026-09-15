import { createElement, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteNavbar from '../components/SiteNavbar.jsx';

const Form = ({ children, ...props }) => <form {...props}>{children}</form>;
Form.Label = ({ children, ...props }) => <label {...props}>{children}</label>;
Form.Control = ({ as = 'input', className = '', ...props }) => createElement(as, { ...props, className: `form-control ${className}`.trim() });
const Button = ({ children, ...props }) => <button {...props}>{children}</button>;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return setError('Email is required.');
    if (!trimmedEmail.includes('@')) return setError('Please enter a valid email address.');
    if (!password) return setError('Password is required.');
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: trimmedEmail, password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Login failed.');
      localStorage.setItem('authToken', result.token);
      window.location.href = 'https://app.datarheo.io';
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return <div className="login-page"><SiteNavbar variant="login" /><div className="split-login"><section className="split-login-panel login-story-panel" aria-labelledby="login-story-title"><p className="login-story-kicker">CONNECTED DATA, ALWAYS MOVING</p><h2 id="login-story-title"><span>Move data with confidence—</span>{' '}<span>datarheo.io keeps every source and warehouse in sync.</span></h2><p className="login-story-copy">One reliable flow for the systems your team already uses.</p></section><div className="split-login-form-wrap split-login-form-wrap--animated"><div className="login-card login-card--pop"><h1>Sign in</h1><p className="login-subtitle">Enter your email and password to continue.</p><Form className="login-form" onSubmit={handleSubmit}><Form.Label htmlFor="email">Work email</Form.Label><Form.Control type="email" id="email" name="email" autoComplete="username" required value={email} onChange={(event) => { setEmail(event.target.value); setError(''); }} className="login-input" /><Form.Label htmlFor="password">Password</Form.Label><Form.Control type="password" id="password" name="password" autoComplete="current-password" required value={password} onChange={(event) => { setPassword(event.target.value); setError(''); }} className="login-input" />{error && <div className="login-error" role="alert">{error}</div>}<Button type="submit" className="cta login-submit login-submit--shine" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'}</Button></Form><p className="login-help">New to datarheo.io? <Link to="/register">Create an account</Link></p></div></div></div><footer className="simple-footer"><p>&copy; 2026 datarheo.io. All rights reserved.</p></footer></div>;
}
