import { createElement, useState } from 'react';
import SiteNavbar from '../components/SiteNavbar.jsx';

const Form = ({ children, ...props }) => <form {...props}>{children}</form>;
Form.Label = ({ children, ...props }) => <label {...props}>{children}</label>;
Form.Control = ({ as = 'input', className = '', ...props }) => createElement(as, { ...props, className: `form-control ${className}`.trim() });
const Button = ({ children, ...props }) => <button {...props}>{children}</button>;
const Spinner = ({ className = '' }) => <span className={className} aria-hidden="true" />;

export default function Login() {
  const [businessId, setBusinessId] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedBusinessId = businessId.trim();

    if (!trimmedBusinessId) {
      setError('Business ID is required.');
      return;
    }

    if (trimmedBusinessId.includes('@')) {
      setError('Please enter a valid Business ID, not an email address.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    setError('');
    setSubmitting(true);

    window.setTimeout(() => { window.location.href = 'https://app.datarheo.io/login?business_id=' + encodeURIComponent(trimmedBusinessId); }, 450);
  }

  return (
    <div className="login-page">
      <SiteNavbar variant="login" />
      <div className="split-login">
        <section className="split-login-panel login-story-panel" aria-labelledby="login-story-title">
          <div className="login-story-orbit" aria-hidden="true">
            <span className="login-story-dot login-story-dot--one" />
            <span className="login-story-dot login-story-dot--two" />
            <span className="login-story-dot login-story-dot--three" />
          </div>
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
          <img src="/images/logo.png" alt="datarheo.io" className="login-logo login-logo--float" />
          <h1>Sign in</h1>
          <p className="login-subtitle">Enter your Business ID and password to continue.</p>
            <Form className="login-form" onSubmit={handleSubmit}>
              <Form.Label htmlFor="business-id">Business ID</Form.Label>
              <Form.Control type="text" id="business-id" name="business_id" placeholder="e.g. DR-10492" autoComplete="username" required value={businessId} onChange={(e) => { setBusinessId(e.target.value); setError(''); }} className="login-input" />
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control type="password" id="password" name="password" placeholder="Enter your password" autoComplete="current-password" required value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} className="login-input" />
              {error && <div className="login-error" role="alert">{error}</div>}
              <Button type="submit" className="cta login-submit login-submit--shine" disabled={submitting}>{submitting ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />Signing in…</> : 'Sign in'}</Button>
            </Form>
            <p className="login-help">Don&apos;t know your Business ID? <a href="mailto:hello@datarheo.io">Contact support</a></p>
          </div>
        </div>
      </div>

      <footer className="simple-footer"><p>&copy; 2026 datarheo.io. All rights reserved.</p></footer>
    </div>
  );
}
