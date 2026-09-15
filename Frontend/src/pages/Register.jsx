import { createElement, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteNavbar from '../components/SiteNavbar.jsx';

const Form = ({ children, ...props }) => <form {...props}>{children}</form>;
Form.Label = ({ children, ...props }) => <label {...props}>{children}</label>;
Form.Control = ({ className = '', ...props }) => createElement('input', { ...props, className: `form-control ${className}`.trim() });
const Button = ({ children, ...props }) => <button {...props}>{children}</button>;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const endpoint = step === 1 ? '/register/request-otp' : step === 2 ? '/register/verify-otp' : '/register/set-password';
      const body = step === 1 ? { firstName: form.firstName, lastName: form.lastName, email: form.email } : step === 2 ? { email: form.email, otp } : form;
      const response = await fetch(`${API_URL}/api/auth${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Registration failed.');
      if (step < 3) setStep((current) => current + 1);
      else navigate('/login');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page register-page">
      <SiteNavbar variant="login" />
      <div className="split-login register-layout">
        <section className="split-login-panel login-story-panel" aria-labelledby="register-story-title">
          <p className="login-story-kicker">CONNECTED DATA, ALWAYS MOVING</p>
          <h2 id="register-story-title"><span>Build your connected</span>{' '}<span>data workspace.</span></h2>
          <p className="login-story-copy">Create your account and move data with confidence from day one.</p>
        </section>
        <div className="split-login-form-wrap split-login-form-wrap--animated">
          <span className="login-blob login-blob--1" aria-hidden="true" /><span className="login-blob login-blob--2" aria-hidden="true" /><span className="login-blob login-blob--3" aria-hidden="true" />
          <div className="login-card login-card--pop register-card">
            <img src="/images/logo.png" alt="datarheo.io" className="login-logo login-logo--float" />
            <h1>Create account</h1><p className="login-subtitle">Start building your data workspace.</p>
            <Form className="login-form register-form" onSubmit={handleSubmit}>
              <div className="register-name-fields"><div><Form.Label htmlFor="first-name">First name</Form.Label><Form.Control type="text" id="first-name" name="firstName" autoComplete="given-name" required value={form.firstName} onChange={updateField} /></div><div><Form.Label htmlFor="last-name">Last name</Form.Label><Form.Control type="text" id="last-name" name="lastName" autoComplete="family-name" required value={form.lastName} onChange={updateField} /></div></div>
              <Form.Label htmlFor="work-email">Work email</Form.Label><Form.Control type="email" id="work-email" name="email" autoComplete="email" required value={form.email} onChange={updateField} />
              {step === 2 && <><Form.Label htmlFor="registration-otp">Verification code</Form.Label><Form.Control type="text" id="registration-otp" inputMode="numeric" required value={otp} onChange={(event) => { setOtp(event.target.value); setError(''); }} /></>}
              {step === 3 && <><Form.Label htmlFor="register-password">Enter password</Form.Label><Form.Control type="password" id="register-password" name="password" autoComplete="new-password" required value={form.password} onChange={updateField} /><Form.Label htmlFor="confirm-password">Confirm password</Form.Label><Form.Control type="password" id="confirm-password" name="confirmPassword" autoComplete="new-password" required value={form.confirmPassword} onChange={updateField} /></>}
              {error && <div className="login-error" role="alert">{error}</div>}
              <Button type="submit" className="cta login-submit login-submit--shine" disabled={submitting}>{submitting ? 'Please wait...' : step === 1 ? 'Send verification code' : step === 2 ? 'Verify email' : 'Create account'}</Button>
            </Form>
            <p className="login-help">Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
      <footer className="simple-footer"><p>&copy; 2026 datarheo.io. All rights reserved.</p></footer>
    </div>
  );
}
