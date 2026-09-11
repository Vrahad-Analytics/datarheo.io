import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Suspense fallback={<main aria-busy="true" />}><Login /></Suspense>} />
      <Route path="/register" element={<Suspense fallback={<main aria-busy="true" />}><Register /></Suspense>} />
    </Routes>
  );
}
