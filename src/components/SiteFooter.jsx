import React from 'react';
import Logo from './Logo.jsx';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand-col">
          <div className="footer-logo">
            <Logo size={32} />
            <span>
              datarheo<em>.io</em>
            </span>
          </div>
          <p className="footer-brand-bio">
            The automated data movement platform for modern engineering teams. Real-time CDC, 350+ connectors, zero-maintenance schema drift healing, and enterprise security.
          </p>
          <div className="footer-status-pill">
            <span className="dot-green" /> All Systems 99.99% Operational
          </div>
          <div className="footer-compliance-badges">
            <span className="compliance-tag">SOC 2 Type II</span>
            <span className="compliance-tag">HIPAA Compliant</span>
            <span className="compliance-tag">GDPR Ready</span>
            <span className="compliance-tag">TLS 1.3 / AES-256</span>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Connectors</h4>
            <ul>
              <li><a href="#connectors">PostgreSQL CDC</a></li>
              <li><a href="#connectors">MySQL Binary Log</a></li>
              <li><a href="#connectors">Salesforce Bulk v2</a></li>
              <li><a href="#connectors">Stripe Ledger</a></li>
              <li><a href="#connectors">Snowflake Streaming</a></li>
              <li><a href="#connectors">Google BigQuery</a></li>
              <li><a href="#connectors">Databricks Delta Lake</a></li>
              <li><a href="#connectors">Pinecone & Weaviate</a></li>
              <li><a href="#connectors">All 350+ Connectors →</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><a href="#simulator">Live Pipeline Studio</a></li>
              <li><a href="#capabilities">Sub-Second CDC Engine</a></li>
              <li><a href="#capabilities">Auto-Schema Healing</a></li>
              <li><a href="#capabilities">Connector Development Kit (CDK)</a></li>
              <li><a href="#capabilities">Hybrid On-Prem VPC Agent</a></li>
              <li><a href="#comparison">Platform Benchmark</a></li>
              <li><a href="#roi">MAR ROI Calculator</a></li>
              <li><a href="#pricing">Transparent Pricing</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Solutions</h4>
            <ul>
              <li><a href="#solutions">Modern Data Stack (MDS)</a></li>
              <li><a href="#solutions">Real-Time Database Replication</a></li>
              <li><a href="#solutions">Generative AI & RAG Pipelines</a></li>
              <li><a href="#solutions">Marketing & Attribution Ingest</a></li>
              <li><a href="#solutions">Financial Ledger Reconciliation</a></li>
              <li><a href="#solutions">Multi-Cloud Data Synchronization</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company & Trust</h4>
            <ul>
              <li><a href="#contact">Contact Sales & Support</a></li>
              <li><a href="#contact">Schedule Architecture Review</a></li>
              <li><a href="#faq">Security & Governance</a></li>
              <li><a href="#faq">Status & Latency Monitors</a></li>
              <li><a href="mailto:hello@datarheo.io">hello@datarheo.io</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} datarheo.io by Vrahad Analytics. All rights reserved.</p>
        <div className="footer-legal-links">
          <a href="#contact">Privacy Policy</a>
          <a href="#contact">Terms of Service</a>
          <a href="#contact">Security Center</a>
          <a href="#contact">Cookie Preferences</a>
        </div>
      </div>
    </footer>
  );
}