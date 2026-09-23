import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import './home.css';
import './enterprise.css';
import './home-effects.css';
import './login.css';
import './animations.css';

import App from './App.jsx';

function removeLegacyAuthTokens() {
  try {
    window.localStorage.removeItem('authToken');
    window.localStorage.removeItem('authtoken');
    window.sessionStorage.removeItem('authToken');
    window.sessionStorage.removeItem('authtoken');
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
}

removeLegacyAuthTokens();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
