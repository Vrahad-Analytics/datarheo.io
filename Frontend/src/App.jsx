import { lazy, Suspense } from 'react';
import { Link, Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Suspense fallback={<main className="route-state" role="status" aria-busy="true">Loading sign-in…</main>}><Login /></Suspense>} />
      <Route path="/register" element={<Suspense fallback={<main className="route-state" role="status" aria-busy="true">Loading account setup…</main>}><Register /></Suspense>} />
      <Route path="*" element={<main className="route-state"><p className="auth-eyebrow">404 · PAGE NOT FOUND</p><h1>Let’s get you back in flow.</h1><p>This page doesn’t exist. Head home to explore Datarheo.</p><Link to="/" className="cta">Back to home →</Link></main>} />
    </Routes>
  );
}
