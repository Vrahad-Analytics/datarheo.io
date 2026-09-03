import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
const Login = lazy(() => import('./pages/Login.jsx'));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Suspense fallback={<main aria-busy="true" />}><Login /></Suspense>} />
    </Routes>
  );
}
