import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Logo from './Logo.jsx';

const PRODUCT_MENU = [
  { icon: '↔', title: 'Automated setup', href: '#connect', body: 'Connect a source, pick a destination, and let the backfill run itself.' },
  { icon: '⌥', title: 'Schema drift', href: '#schema', body: 'Upstream column changes propagate before anything downstream breaks.' },
  { icon: '◎', title: 'Reliability', href: '#reliability', body: 'Freshness signals, automatic retries, and alerts on every dataset.' },
  { icon: '⌘', title: 'Connectors', href: '#connectors', body: 'The sources and destinations available today, and what is next.' },
];

function MenuTrigger({ name, openMenu, setOpenMenu, children }) {
  const isOpen = openMenu === name;
  const menuId = `${name.toLowerCase()}-menu`;

  return (
    <div className="nav-mega-wrap" onMouseEnter={() => setOpenMenu(name)} onMouseLeave={() => setOpenMenu(null)}>
      <button
        className={isOpen ? 'nav-mega-trigger is-open' : 'nav-mega-trigger'}
        type="button"
        onClick={() => setOpenMenu(isOpen ? null : name)}
        aria-expanded={isOpen}
        aria-controls={menuId}
      >
        {name} <span className="nav-chevron" aria-hidden="true" />
      </button>
      {isOpen && <div id={menuId} className="platform-mega-menu">{children}</div>}
    </div>
  );
}

export default function SiteNavbar({ variant = 'home' }) {
  const [openMenu, setOpenMenu] = useState(null);
  const closeMenu = () => setOpenMenu(null);

  return (
    <header className="navbar-brand-custom">
      <Container fluid className="d-flex align-items-center">
        <Link to="/" className="brand-logo">
          <Logo size={32} />
          <span>datarheo<em>.io</em></span>
        </Link>

        {variant === 'home' ? (
          <>
            <nav className="nav-links d-none d-md-flex" aria-label="Primary navigation">
              <MenuTrigger name="Platform" openMenu={openMenu} setOpenMenu={setOpenMenu}>
                <p className="mega-menu-label">DATARHEO.IO PLATFORM</p>
                {PRODUCT_MENU.map((item) => (
                  <a className="mega-feature" href={item.href} key={item.title} onClick={closeMenu}>
                    <span className="mega-feature-icon" aria-hidden="true">{item.icon}</span>
                    <span><strong>{item.title}</strong><small>{item.body}</small></span>
                  </a>
                ))}
              </MenuTrigger>

              <a href="#connectors">Connectors</a>
              <a href="#pricing">Pricing</a>
              <a href="#contact">Contact</a>
            </nav>
            <div className="nav-actions">
              <Link to="/login" className="nav-signin d-none d-sm-inline">Sign in</Link>
              <a href="#contact" className="login-btn">Start for free</a>
            </div>
          </>
        ) : (
          <nav className="nav-links"><Link to="/">Back to site</Link></nav>
        )}
      </Container>
    </header>
  );
}
