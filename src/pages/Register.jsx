import { createElement, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteNavbar from '../components/SiteNavbar.jsx';

const Form = ({ children, ...props }) => <form {...props}>{children}</form>;
Form.Label = ({ children, ...props }) => <label {...props}>{children}</label>;
Form.Control = ({ className = '', ...props }) => createElement('input', { ...props, className: `form-control ${className}`.trim() });
const Button = ({ children, ...props }) => <button {...props}>{children}</button>;

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('Registration details are ready to submit.');
  }

  return (
    <div className="login-page register-page">
      <SiteNavbar variant="login" />
      <div className="split-login register-layout">
        <section className="split-login-panel login-story-panel" aria-labelledby="register-story-title">
          <p className="login-story-kicker">CONNECTED DATA, ALWAYS MOVING</p>
          <h2 id="register-story-title">
            <span>Build your connected</span>{' '}
            <span>data workspace.</span>
          </h2>
          <p className="login-story-copy">Create your account and move data with confidence from day one.</p>
        </section>

        <div className="split-login-form-wrap split-login-form-wrap--animated">
          <span className="login-blob login-blob--1" aria-hidden="true" />
          <span className="login-blob login-blob--2" aria-hidden="true" />
          <span className="login-blob login-blob--3" aria-hidden="true" />
          <div className="login-card login-card--pop register-card">
            <img src="/images/logo.png" alt="datarheo.io" className="login-logo login-logo--float" />
            <h1>Create account</h1>
            <p className="login-subtitle">Start building your data workspace.</p>
            <Form className="login-form register-form" onSubmit={handleSubmit}>
              <div className="register-name-fields">
                <div>
                  <Form.Label htmlFor="first-name">First name</Form.Label>
                  <Form.Control type="text" id="first-name" name="firstName" autoComplete="given-name" required value={form.firstName} onChange={updateField} />
                </div>
                <div>
                  <Form.Label htmlFor="last-name">Last name</Form.Label>
                  <Form.Control type="text" id="last-name" name="lastName" autoComplete="family-name" required value={form.lastName} onChange={updateField} />
                </div>
              </div>
              <Form.Label htmlFor="work-email">Work email</Form.Label>
              <Form.Control type="email" id="work-email" name="email" autoComplete="email" required value={form.email} onChange={updateField} />
              <Form.Label htmlFor="register-password">Enter password</Form.Label>
              <Form.Control type="password" id="register-password" name="password" autoComplete="new-password" required value={form.password} onChange={updateField} />
              <Form.Label htmlFor="confirm-password">Confirm password</Form.Label>
              <Form.Control type="password" id="confirm-password" name="confirmPassword" autoComplete="new-password" required value={form.confirmPassword} onChange={updateField} />
              {error && <div className={`login-error ${error.includes('ready') ? 'register-success' : ''}`} role="alert">{error}</div>}
              <Button type="submit" className="cta login-submit login-submit--shine">Create account</Button>
            </Form>
            <p className="login-help">Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
      <footer className="simple-footer"><p>&copy; 2026 datarheo.io. All rights reserved.</p></footer>
    </div>
  );
}
