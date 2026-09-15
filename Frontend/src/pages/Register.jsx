import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteNavbar from '../components/SiteNavbar.jsx';
import { authRequest } from '../api.js';

const STEPS = ['Your details', 'Verify email', 'Set password'];

export default function Register() {
  const navigate = useNavigate();
  const heading = useRef(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    heading.current?.focus();
  }, [step]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    setError('');
    if (step === 1 && (!form.firstName.trim() || !form.lastName.trim())) {
      return setError('Please enter your first and last name.');
    }
    if (step === 3 && form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }
    setSubmitting(true);
    try {
      const email = form.email.trim().toLowerCase();
      const endpoint = step === 1 ? '/register/request-otp' : step === 2 ? '/register/verify-otp' : '/register/set-password';
      const body = step === 1
        ? { firstName: form.firstName.trim(), lastName: form.lastName.trim(), email }
        : step === 2 ? { email, otp }
        : { email, password: form.password, confirmPassword: form.confirmPassword };
      await authRequest(endpoint, body);
      if (step < 3) setStep((current) => current + 1);
      else navigate('/login', { replace: true, state: { registered: true } });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page register-page">
      <SiteNavbar variant="login" />
      <main id="main-content" className="split-login register-layout">
        <section className="split-login-panel login-story-panel" aria-labelledby="register-story-title">
          <p className="login-story-kicker">MAKE YOUR NEXT CONNECTION</p>
          <h2 id="register-story-title">Great things start<br />with better data.</h2>
          <p className="login-story-copy">Create your Datarheo account in three simple steps. Use your work email to get started.</p>
          <div className="auth-flow" aria-label="Registration steps">
            <span>01 <strong>Join</strong></span>
            <span>02 <strong>Verify</strong></span>
            <span>03 <strong>Explore</strong></span>
          </div>
          <Link to="/#connectors" className="auth-story-link">Find your next connector →</Link>
        </section>
        <div className="split-login-form-wrap">
          <div className="login-card register-card">
            <p className="auth-eyebrow">GET STARTED</p>
            <ol className="auth-steps" aria-label="Account setup progress">
              {STEPS.map((label, index) => <li key={label} aria-current={step === index + 1 ? 'step' : undefined} className={step > index + 1 ? 'is-complete' : ''}><span aria-hidden="true">{step > index + 1 ? '✓' : index + 1}</span>{label}</li>)}
            </ol>
            <h1 ref={heading} tabIndex={-1}>{step === 1 ? 'Create your account' : step === 2 ? 'Check your inbox' : 'Make it secure'}</h1>
            <p className="login-subtitle">{step === 1 ? 'A few details, and you’re on your way.' : step === 2 ? `Enter the 6-digit code sent to ${form.email.trim()}.` : `Choose a password for ${form.email.trim()}.`}</p>
            <form className="login-form register-form" onSubmit={handleSubmit} aria-busy={submitting}>
              <fieldset disabled={submitting}>
                {step === 1 && <>
                  <div className="register-name-fields">
                    <div><label htmlFor="first-name">First name</label><input className="form-control" type="text" id="first-name" name="firstName" autoComplete="given-name" placeholder="Alex" required value={form.firstName} onChange={updateField} /></div>
                    <div><label htmlFor="last-name">Last name</label><input className="form-control" type="text" id="last-name" name="lastName" autoComplete="family-name" placeholder="Morgan" required value={form.lastName} onChange={updateField} /></div>
                  </div>
                  <label htmlFor="work-email">Work email</label><input className="form-control" type="email" id="work-email" name="email" autoComplete="email" placeholder="you@company.com" required value={form.email} onChange={updateField} />
                </>}
                {step === 2 && <>
                  <label htmlFor="registration-otp">Verification code</label>
                  <input className="form-control auth-otp" type="text" id="registration-otp" name="otp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="000000" aria-describedby="otp-help" required value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }} />
                  <p id="otp-help" className="auth-field-hint">The code expires in 10 minutes. Check your spam folder if it hasn’t arrived.</p>
                </>}
                {step === 3 && <>
                  <label htmlFor="register-password">Password</label><input className="form-control" type="password" id="register-password" name="password" autoComplete="new-password" minLength={8} aria-describedby="password-help" required value={form.password} onChange={updateField} />
                  <p id="password-help" className="auth-field-hint">Use at least 8 characters.</p>
                  <label htmlFor="confirm-password">Confirm password</label><input className="form-control" type="password" id="confirm-password" name="confirmPassword" autoComplete="new-password" minLength={8} required value={form.confirmPassword} onChange={updateField} />
                </>}
                {error && <div className="login-error" role="alert">{error}</div>}
                <button type="submit" className="cta login-submit" disabled={submitting}>{submitting ? 'Please wait…' : step === 1 ? 'Send verification code →' : step === 2 ? 'Verify email →' : 'Create account →'}</button>
                {step > 1 && <button type="button" className="auth-text-button" onClick={() => {
                  setStep(1);
                  setOtp('');
                  setError('');
                  setForm((current) => ({ ...current, password: '', confirmPassword: '' }));
                }}>Start over or request a new code</button>}
              </fieldset>
            </form>
            <p className="login-help">Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </main>
      <footer className="simple-footer"><p>&copy; {new Date().getFullYear()} datarheo.io · Connected data, always moving.</p></footer>
    </div>
  );
}
