import Logo from './Logo.jsx';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-bottom">
        <div className="footer-logo">
          <Logo size={26} />
          <span>
            datarheo<em>.io</em>
          </span>
        </div>
        <p>&copy; 2026 datarheo.io. All rights reserved.</p>
      </div>
    </footer>
  );
}