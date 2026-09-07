import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

export default function SiteNavbar({ variant = 'home' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="navbar-brand-custom">
      {/* Top micro-announcement bar */}
      <div className="navbar-top-announcement">
        <div className="container-fluid announcement-inner">
          <span className="announcement-badge">NEW</span>
          <span className="announcement-text">
            Datarheo Sub-Second CDC & Pinecone/Weaviate Vector Lakehouse Connectors are now Live!
          </span>
          <a href="#connectors" className="announcement-link">
            Explore Connectors →
          </a>
        </div>
      </div>

      <div className="container-fluid nav-main-row">
        <Link to="/" className="brand-logo">
          <Logo size={36} />
          <div className="brand-text">
            <span>datarheo<em>.io</em></span>
            <span className="brand-sub">Enterprise Data Movement</span>
          </div>
        </Link>

        {variant === 'home' ? (
          <>
            <nav className="nav-links" aria-label="Primary navigation">
              <a href="#connectors" className="nav-link-item">
                Connectors <span className="nav-count-badge">350+</span>
              </a>
              <a href="#simulator" className="nav-link-item">
                Live Studio
              </a>
              <a href="#capabilities" className="nav-link-item">
                Capabilities
              </a>
              <a href="#comparison" className="nav-link-item">
                Benchmark
              </a>
              <a href="#pricing" className="nav-link-item">
                Pricing
              </a>
              <a href="#faq" className="nav-link-item">
                FAQ
              </a>
            </nav>

            <div className="header-actions">
              <a href="#contact" className="demo-btn">
                Talk to Architect
              </a>
              <Link to="/login" className="login-btn">
                Sign In <span>→</span>
              </Link>
              <button
                type="button"
                className={`mobile-menu-toggle ${mobileOpen ? 'is-open' : ''}`}
                aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((isOpen) => !isOpen)}
              >
                <span />
                <span />
                <span />
              </button>
            </div>

            <nav className={`mobile-nav ${mobileOpen ? 'is-open' : ''}`} aria-label="Mobile navigation">
              <a href="#connectors" onClick={closeMobileMenu}>Connectors (350+)</a>
              <a href="#simulator" onClick={closeMobileMenu}>Live Studio</a>
              <a href="#capabilities" onClick={closeMobileMenu}>Capabilities</a>
              <a href="#comparison" onClick={closeMobileMenu}>Benchmark</a>
              <a href="#pricing" onClick={closeMobileMenu}>Pricing</a>
              <a href="#contact" onClick={closeMobileMenu}>Talk to Architect</a>
              <Link to="/login" onClick={closeMobileMenu} className="mobile-login-link">
                Sign In to Workspace →
              </Link>
            </nav>
          </>
        ) : (
          <nav className="nav-links">
            <Link to="/" className="back-link">
              ← Return to Main Platform
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
