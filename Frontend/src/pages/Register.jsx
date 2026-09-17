import { createElement, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteNavbar from '../components/SiteNavbar.jsx';
import { API_URL } from '../api.js';

const Form = ({ children, ...props }) => <form {...props}>{children}</form>;
Form.Label = ({ children, ...props }) => <label {...props}>{children}</label>;
Form.Control = ({ className = '', ...props }) => createElement('input', { ...props, className: `form-control ${className}`.trim() });
const Button = ({ children, ...props }) => <button {...props}>{children}</button>;
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ businessId: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [qrCode, setQrCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (step === 1 && (!form.businessId.includes('@') || !form.businessId.includes('.'))) {
      setError('Please enter a valid business email address.');
      return;
    }
    setSubmitting(true);
    try {
      const endpoint = step === 1 ? '/register/start' : step === 2 ? '/register/verify-authenticator' : '/register/set-password';
      const body = step === 1 ? { businessId: form.businessId } : step === 2 ? { businessId: form.businessId, otp } : form;
      const response = await fetch(`${API_URL}/api/auth${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Registration failed.');
      if (step === 1) {
        setQrCode(result.qrCode);
        setStep(2);
      } else if (step === 2) {
        setStep(3);
      }
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
            <h1>Create account</h1><p className="login-subtitle">Set up secure access with your business email.</p>
            <Form className="login-form register-form" onSubmit={handleSubmit}>
              <Form.Label htmlFor="business-id">Business email</Form.Label>
              <Form.Control type="email" id="business-id" name="businessId" autoComplete="email" placeholder="you@company.com" required value={form.businessId} readOnly={step > 1} onChange={updateField} />
              {step === 2 && <div className="authenticator-enrollment"><p>Scan this QR code in Google Authenticator, Microsoft Authenticator, or another TOTP app.</p>{qrCode && <img src={qrCode} alt="Authenticator setup QR code" className="authenticator-qr" />}<Form.Label htmlFor="registration-otp">6-digit authenticator code</Form.Label><Form.Control type="text" id="registration-otp" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" required value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }} /></div>}
              {step === 3 && <><Form.Label htmlFor="register-password">Enter password</Form.Label><Form.Control type="password" id="register-password" name="password" autoComplete="new-password" required value={form.password} onChange={updateField} /><Form.Label htmlFor="confirm-password">Confirm password</Form.Label><Form.Control type="password" id="confirm-password" name="confirmPassword" autoComplete="new-password" required value={form.confirmPassword} onChange={updateField} /></>}
              {error && <div className="login-error" role="alert">{error}</div>}
              <Button type="submit" className="cta login-submit login-submit--shine" disabled={submitting}>{submitting ? 'Please wait...' : step === 1 ? 'Set up authenticator' : step === 2 ? 'Verify authenticator' : 'Create account'}</Button>
            </Form>
            <p className="login-help">Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
      <footer className="simple-footer"><p>&copy; 2026 datarheo.io. All rights reserved.</p></footer>
    </div>
  );
}
