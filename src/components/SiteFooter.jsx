import Logo from './Logo.jsx';

const FOOTER_COLUMNS = [
  {
    heading: 'Platform',
    links: [
      { label: 'Automated setup', href: '#connect' },
      { label: 'Schema drift', href: '#schema' },
      { label: 'Reliability', href: '#reliability' },
      { label: 'Connectors', href: '#connectors' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Pricing', href: '#pricing' },
      { label: 'Contact', href: '#contact' },
      { label: 'Request a connector', href: '#contact' },
    ],
  },
  {
    heading: 'Get in touch',
    links: [
      { label: 'hello@datarheo.io', href: 'mailto:hello@datarheo.io' },
      { label: 'Talk to sales', href: '#contact' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <Logo size={26} />
              <span>datarheo<em>.io</em></span>
            </div>
            <p className="footer-blurb">
              Automated data movement between the systems you already run and the
              warehouse your team works in.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div className="footer-col" key={column.heading}>
              <h4>{column.heading}</h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 datarheo.io. All rights reserved.</p>
          <p>Built for teams that would rather not maintain pipelines.</p>
        </div>
      </div>
    </footer>
  );
}
