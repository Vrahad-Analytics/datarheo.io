import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

function MenuTrigger({ name, openMenu, setOpenMenu, children }) {
  const isOpen = openMenu === name;
  const menuId = `${name.toLowerCase()}-menu`;

  return (
    <div className="nav-mega-wrap" onMouseEnter={() => setOpenMenu(name)} onMouseLeave={() => setOpenMenu(null)}>
      <button className={isOpen ? 'nav-mega-trigger is-open' : 'nav-mega-trigger'} type="button" onClick={() => setOpenMenu(isOpen ? null : name)} aria-expanded={isOpen} aria-controls={menuId}>
        {name} <span className="nav-chevron" aria-hidden="true" />
      </button>
      {isOpen && <div id={menuId} className="platform-mega-menu">{children}</div>}
    </div>
  );
}

function FeatureLink({ href, title, children, onClick }) {
  return (
    <a className="mega-feature" href={href} onClick={onClick}>
      <span className="mega-feature-icon" aria-hidden="true" />
      <span><strong>{title}</strong><small>{children}</small></span>
      <i className="mega-link-arrow" aria-hidden="true" />
    </a>
  );
}

export default function SiteNavbar({ variant = 'home' }) {
  const [openMenu, setOpenMenu] = useState(null);
  const closeMenu = () => setOpenMenu(null);

  return (
    <header className="navbar-brand-custom">
      <div className="container-fluid d-flex align-items-center">
        <Link to="/" className="brand-logo"><Logo size={34} /><span>datarheo<em>.io</em></span></Link>

        {variant === 'home' ? (
          <>
            <nav className="nav-links d-none d-md-block" aria-label="Primary navigation">
              <MenuTrigger name="Products" openMenu={openMenu} setOpenMenu={setOpenMenu}>
                <div className="platform-mega-main">
                  <p className="mega-menu-label">DATARHEO.IO PRODUCTS</p>
                  <FeatureLink href="#sync-preview-title" icon="↔" title="Data Movement Platform" onClick={closeMenu}>Move data quickly, reliably, and at scale across different systems.</FeatureLink>
                  <FeatureLink href="#connectors" icon="⌘" title="Data Integration" onClick={closeMenu}>Connect applications and systems to move data seamlessly between them.</FeatureLink>
                  <FeatureLink href="#how-it-works" icon="~" title="Data Pipelines" onClick={closeMenu}>Build and manage reliable data flows across your technology stack.</FeatureLink>
                  <FeatureLink href="#sync-preview-title" icon="→" title="Application Data Transfer" onClick={closeMenu}>Transfer data efficiently between applications and services.</FeatureLink>
                  <FeatureLink href="#contact" icon="API" title="API Platform" onClick={closeMenu}>Connect applications and automate data movement through APIs. Proposed service area.</FeatureLink>
                  <FeatureLink href="#sync-preview-title" icon="O" title="Monitoring & Reliability" onClick={closeMenu}>Monitor data movement and identify issues across data workflows. Proposed service area.</FeatureLink>
                </div>
              </MenuTrigger>

              <a href="#connectors">Connectors</a>
              <a href="#pricing">Pricing</a>
              <a href="#contact">Contact</a>
            </nav>
            <Link to="/login" className="login-btn">Login</Link>
          </>
        ) : <nav className="nav-links"><Link to="/">Back to site</Link></nav>}
      </div>
    </header>
  );
}
