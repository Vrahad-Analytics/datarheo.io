import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

export default function SiteNavbar({ variant = 'home' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="navbar-brand-custom">
      <div className="container-fluid d-flex align-items-center">
        <Link to="/" className="brand-logo"><Logo size={34} /><span>datarheo<em>.io</em></span></Link>

        {variant === 'home' ? (
          <>
            <div className="header-actions">
            <nav className="nav-links" aria-label="Primary navigation">
              <a href="#connectors">Connectors</a>
              <a href="#pricing">Pricing</a>
              <a href="#contact">Contact</a>
            </nav>
            <Link to="/login" className="login-btn">Login</Link>
              <button
                type="button"
                className={`mobile-menu-toggle${mobileOpen ? ' is-open' : ''}`}
                aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((isOpen) => !isOpen)}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
            <nav className={`mobile-nav${mobileOpen ? ' is-open' : ''}`} aria-label="Mobile navigation">
              <a href="#connectors" onClick={closeMobileMenu}>Connectors</a>
              <a href="#pricing" onClick={closeMobileMenu}>Pricing</a>
              <a href="#contact" onClick={closeMobileMenu}>Contact</a>
            </nav>
          </>
        ) : (
          <nav className="nav-links"><Link to="/">Back to site</Link></nav>
        )}
      </div>
    </header>
  );
}
