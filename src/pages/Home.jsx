import React, { useState } from 'react';
import SiteNavbar from '../components/SiteNavbar.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import DataFlowAnimation from '../components/DataFlowAnimation.jsx';
import ToolIcon from '../components/ToolIcon.jsx';
import ConnectorCatalog from '../components/ConnectorCatalog.jsx';
import PipelineSimulator from '../components/PipelineSimulator.jsx';
import RoiCalculator from '../components/RoiCalculator.jsx';
import EnterpriseComparison from '../components/EnterpriseComparison.jsx';
import { METRICS_DATA, CAPABILITIES } from '../data/connectorsData.js';
import { useScrollEffects } from '../hooks/useScrollEffects.js';

const ENTERPRISE_FAQS = [
  {
    question: 'How does Datarheo achieve sub-second Change Data Capture (CDC)?',
    answer:
      'Datarheo connects directly to native database transaction logs (such as PostgreSQL WAL via pgoutput, MySQL binary logs, and Oracle Redo logs). Instead of issuing expensive polling SQL SELECT queries that degrade production database performance, Datarheo streams row-level changes asynchronously as they commit with latency under 500ms.',
  },
  {
    question: 'What happens when an upstream schema changes or columns are added?',
    answer:
      'Our engine features automated schema drift healing. When an upstream team executes a DDL change (adding a column, widening a varchar, or altering a field type), Datarheo detects the evolution in-flight, updates the destination schema in Snowflake, BigQuery, or Databricks automatically, and continues streaming without throwing errors or requiring engineer intervention.',
  },
  {
    question: 'Can Datarheo run in our private VPC or on-premises infrastructure?',
    answer:
      'Yes. In addition to our fully managed multi-tenant and single-tenant cloud environments, enterprise customers can deploy the Datarheo Hybrid Agent directly into their AWS VPC, GCP project, Azure VNet, or on-premises Kubernetes cluster. Data never leaves your security boundary, meeting strict SOC 2, HIPAA, and banking compliance standards.',
  },
  {
    question: 'How does Datarheo differ from Fivetran and Airbyte?',
    answer:
      'Unlike Fivetran, Datarheo provides sub-second streaming CDC latency (not 15-minute micro-batches) and transparent pricing without punitive Monthly Active Row (MAR) surprise charges. Unlike Airbyte, our connectors are fully enterprise-managed with auto-healing schema drift and dedicated 99.99% uptime SLAs.',
  },
  {
    question: 'Can we build custom connectors for internal proprietary APIs?',
    answer:
      'Absolutely. Our Connector Development Kit (CDK) allows data engineers to build and deploy custom connectors in under 15 minutes using declarative YAML or Python. Custom connectors inherit all enterprise platform capabilities including checkpointing, schema inference, rate-limit throttling, and backfill.',
  },
  {
    question: 'Does Datarheo support AI vector databases for Generative AI and RAG?',
    answer:
      'Yes! Datarheo provides native destination connectors for Pinecone, Weaviate, Qdrant, Milvus, and pgvector. You can stream relational database tables or unstructured documents, apply automated chunking and embedding transforms, and upsert vectors directly for real-time RAG applications.',
  },
];

const PRICING_TIERS_ENTERPRISE = [
  {
    title: 'Starter',
    price: '$79',
    period: '/ month',
    description: 'Perfect for startups and early-stage data teams building their initial modern data stack.',
    features: [
      'Up to 5 Active Connectors',
      'Continuous 15-minute syncs',
      'Automated schema drift detection',
      'Standard community support',
      'Full destination catalog',
      'Free initial backfill',
    ],
    ctaText: 'Start Starter Plan',
    featured: false,
  },
  {
    title: 'Team & Scale',
    price: '$249',
    period: '/ month',
    description: 'For fast-growing companies requiring sub-second CDC, unlimited syncs, and mission-critical reliability.',
    features: [
      'Up to 25 Active Connectors',
      'Sub-second real-time CDC replication',
      'Automated schema healing & DDL apply',
      'Priority 1-hour support SLA',
      'dbt & Airflow native webhook triggers',
      'Generative AI & Vector DB connectors',
      'Predictable pricing (Zero MAR overages)',
    ],
    ctaText: 'Deploy Team Platform',
    featured: true,
  },
  {
    title: 'Enterprise & Hybrid',
    price: 'Custom',
    period: 'Tailored for scale',
    description: 'For global enterprises requiring self-hosted VPC agents, custom CDKs, and dedicated SLA guarantees.',
    features: [
      'Unlimited Connectors & Rows',
      'Sub-second real-time streaming CDC',
      'Self-Hosted Hybrid VPC Agents',
      'Dedicated Customer Success Architect',
      'Custom Connector CDK support',
      '99.99% Financially-backed Uptime SLA',
      'SOC 2 Type II, HIPAA & BAA agreements',
    ],
    ctaText: 'Talk to Enterprise Architect',
    featured: false,
  },
];

export default function Home() {
  useScrollEffects();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="home-wrapper">
      <SiteNavbar variant="home" />

      <main>
        {/* Background ambient lighting */}
        <div className="home-background" aria-hidden="true">
          <span className="home-background-orb home-background-orb--one" />
          <span className="home-background-orb home-background-orb--two" />
          <span className="home-background-orb home-background-orb--three" />
        </div>

        {/* ================= HERO SECTION ================= */}
        <section id="home" className="hero enterprise-hero">
          <div className="hero-content">
            <div className="enterprise-badge-pill hero-badge">
              <span className="badge-pulse" />
              <span>THE ENTERPRISE DATA MOVEMENT & CONNECTOR PLATFORM</span>
            </div>

            <h1 className="hero-headline">
              Move data from <em>any source</em> to <em>any destination</em>. In real-time.
            </h1>

            <p className="hero-subhead">
              The automated ELT and Change Data Capture (CDC) platform built for modern data teams. Connect 350+ databases, SaaS apps, and APIs to your warehouse with sub-second latency, self-healing schema drift, and zero maintenance.
            </p>

            <div className="hero-actions">
              <a href="#simulator" className="cta hero-cta-primary">
                Explore Live Studio <span>→</span>
              </a>
              <a href="#connectors" className="cta-outline hero-cta-secondary">
                Browse 350+ Connectors
              </a>
              <a href="#contact" className="cta-talk">
                Book Architecture Demo
              </a>
            </div>

            <div className="hero-trust-indicators">
              <div className="trust-indicator-item">
                <span className="trust-indicator-icon">⚡</span>
                <span>Sub-second CDC replication</span>
              </div>
              <div className="trust-indicator-item">
                <span className="trust-indicator-icon">🛡️</span>
                <span>Zero-break schema evolution</span>
              </div>
              <div className="trust-indicator-item">
                <span className="trust-indicator-icon">🔒</span>
                <span>SOC 2 Type II & HIPAA</span>
              </div>
              <div className="trust-indicator-item">
                <span className="trust-indicator-icon">🌐</span>
                <span>VPC Peering & Hybrid Agents</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TRUST LOGOS BAR ================= */}
        <section className="trust-bar">
          <div className="section-container">
            <p className="trust-bar-heading">
              BUILT FOR ENTERPRISE WORKLOADS RUNNING ON THE MODERN DATA STACK
            </p>
            <div className="trust-logos-wrap" aria-label="Supported enterprise data platforms">
              <div className="trust-logo-card">
                <ToolIcon tool="snowflake" size={28} />
                <span>Snowflake</span>
              </div>
              <div className="trust-logo-card">
                <ToolIcon tool="databricks" size={28} />
                <span>Databricks</span>
              </div>
              <div className="trust-logo-card">
                <ToolIcon tool="bigquery" size={28} />
                <span>Google BigQuery</span>
              </div>
              <div className="trust-logo-card">
                <ToolIcon tool="postgres" size={28} />
                <span>PostgreSQL CDC</span>
              </div>
              <div className="trust-logo-card">
                <ToolIcon tool="salesforce" size={28} />
                <span>Salesforce</span>
              </div>
              <div className="trust-logo-card">
                <ToolIcon tool="kafka" size={28} />
                <span>Apache Kafka</span>
              </div>
              <div className="trust-logo-card">
                <ToolIcon tool="s3" size={28} />
                <span>Amazon S3</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= KEY METRICS COUNTERS ================= */}
        <section className="metrics-banner reveal">
          <div className="section-container">
            <div className="metrics-grid">
              {METRICS_DATA.map((metric) => (
                <div key={metric.label} className="metric-box">
                  <strong className="metric-val">{metric.value}</strong>
                  <span className="metric-name">{metric.label}</span>
                  <small className="metric-sub">{metric.detail}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= LIVE PIPELINE SIMULATOR STUDIO ================= */}
        <div id="simulator">
          <PipelineSimulator />
        </div>

        {/* ================= CORE CAPABILITIES GRID ================= */}
        <section id="capabilities" className="capabilities-section reveal">
          <div className="section-container">
            <div className="section-header text-center">
              <div className="enterprise-badge">
                <span className="badge-pulse" />
                ENTERPRISE-GRADE ARCHITECTURE
              </div>
              <h2 className="section-title">
                Everything data teams need to scale without breaking.
              </h2>
              <p className="section-subtitle">
                Engineered from the ground up to replace fragile DIY Python scripts and expensive legacy batch synchronization.
              </p>
            </div>

            <div className="capabilities-cards-grid">
              {CAPABILITIES.map((cap) => (
                <div key={cap.title} className="capability-card">
                  <div className="cap-heading-row">
                    <div className="cap-icon-wrap">{cap.icon}</div>
                    <span className="cap-sub">{cap.subtitle}</span>
                  </div>
                  <h3 className="cap-title">{cap.title}</h3>
                  <p className="cap-desc">{cap.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FULL CONNECTOR CATALOG (60+ CONNECTORS) ================= */}
        <ConnectorCatalog />

        {/* ================= DATA FLOW ANIMATED DIAGRAM ================= */}
        <section className="flow-architecture-section reveal">
          <div className="section-container">
            <div className="section-header text-center">
              <div className="enterprise-badge">
                <span className="badge-pulse" />
                HIGH-THROUGHPUT PIPELINE ENGINE
              </div>
              <h2 className="section-title">
                Unified data movement across any multi-cloud topology.
              </h2>
              <p className="section-subtitle">
                Datarheo captures transaction logs, decrypts payloads in memory, normalizes records with zero disk writes, and bulk-streams into warehouse partitions.
              </p>
            </div>

            <div className="flow-canvas-wrapper">
              <DataFlowAnimation />
            </div>

            <div className="architecture-steps-grid">
              <div className="arch-step-box">
                <div className="arch-step-num">01</div>
                <h4>Log-Based Extraction</h4>
                <p>Non-locking logical replication from WAL/binlogs with sub-second commit tracking.</p>
              </div>
              <div className="arch-step-box">
                <div className="arch-step-num">02</div>
                <h4>In-Flight Schema Harmonizer</h4>
                <p>Detects type shifts and new fields, automatically generating compatible DDL mutations.</p>
              </div>
              <div className="arch-step-box">
                <div className="arch-step-num">03</div>
                <h4>Zero-Data-Retention Stream</h4>
                <p>End-to-end memory encryption with zero transient caching, meeting strict HIPAA/SOC2.</p>
              </div>
              <div className="arch-step-box">
                <div className="arch-step-num">04</div>
                <h4>Micro-Batch Warehouse Load</h4>
                <p>Direct insertion via Snowpipe Streaming, BigQuery Storage Write, and Delta Lake ACID.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ENTERPRISE COMPARISON BENCHMARK ================= */}
        <div id="comparison">
          <EnterpriseComparison />
        </div>

        {/* ================= MAR ROI CALCULATOR ================= */}
        <div id="roi">
          <RoiCalculator />
        </div>

        {/* ================= TRANSPARENT PRICING ================= */}
        <section id="pricing" className="pricing-section reveal">
          <div className="section-container">
            <div className="section-header text-center">
              <div className="enterprise-badge">
                <span className="badge-pulse" />
                PREDICTABLE PRICING
              </div>
              <h2 className="section-title">
                Simple, transparent tiers with zero penalty overages.
              </h2>
              <p className="section-subtitle">
                Scale your data volume seamlessly. No exponential MAR penalties that punish your business growth.
              </p>
            </div>

            <div className="pricing-cards-grid">
              {PRICING_TIERS_ENTERPRISE.map((tier) => (
                <div
                  key={tier.title}
                  className={`pricing-card-v2 ${tier.featured ? 'is-featured' : ''}`}
                >
                  {tier.featured && (
                    <div className="featured-banner">MOST POPULAR WITH DATA TEAMS</div>
                  )}
                  <h3 className="tier-name">{tier.title}</h3>
                  <p className="tier-summary">{tier.description}</p>

                  <div className="tier-price-row">
                    <span className="tier-price-val">{tier.price}</span>
                    <span className="tier-price-period">{tier.period}</span>
                  </div>

                  <a
                    href="#contact"
                    className={`cta tier-cta ${tier.featured ? 'tier-cta-featured' : 'tier-cta-standard'}`}
                  >
                    {tier.ctaText} <span>→</span>
                  </a>

                  <div className="tier-features-list">
                    <span className="features-label">INCLUDED CAPABILITIES:</span>
                    <ul>
                      {tier.features.map((feat) => (
                        <li key={feat}>
                          <span className="feat-check">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= ENTERPRISE FAQ SECTION ================= */}
        <section id="faq" className="faq-section reveal" aria-labelledby="faq-title">
          <div className="section-container">
            <div className="faq-intro-column">
              <div className="section-header text-center">
              <div className="enterprise-badge">
                <span className="badge-pulse" />
                TECHNICAL ARCHITECTURE FAQ
              </div>
              <h2 id="faq-title" className="section-title">
                Frequently Asked Questions
              </h2>
              <p className="section-subtitle">
                Everything technical leaders, data architects, and security officers need to know.
              </p>
              </div>

              <div className="faq-support-panel" aria-label="Platform highlights">
              <div className="faq-support-item">
                <span className="faq-support-icon">&#9889;</span>
                <span><strong>Sub-second CDC</strong><small>Low-latency data movement</small></span>
              </div>
              <div className="faq-support-item">
                <span className="faq-support-icon">&#10003;</span>
                <span><strong>Enterprise ready</strong><small>SOC 2, HIPAA, and GDPR aligned</small></span>
              </div>
              <div className="faq-support-item">
                <span className="faq-support-icon">&#8594;</span>
                <span><strong>Talk to an architect</strong><small>Get answers for your data stack</small></span>
              </div>
              </div>
            </div>

            <div className="faq-accordion-wrap">
              {ENTERPRISE_FAQS.map((faq, index) => (
                <div
                  key={faq.question}
                  className={`faq-item-v2 ${openFaq === index ? 'is-expanded' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-toggle-btn"
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    aria-expanded={openFaq === index}
                  >
                    <span className="faq-q-text">{faq.question}</span>
                    <span className="faq-q-indicator">{openFaq === index ? '−' : '+'}</span>
                  </button>
                  {openFaq === index && (
                    <div className="faq-answer-panel">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= HIGH-CONVERSION ENTERPRISE CONTACT & DEMO ================= */}
        <section id="contact" className="contact-section reveal">
          <div className="section-container">
            <div className="contact-card-wrap">
              <div className="contact-left-showcase">
                <div className="enterprise-badge">
                  <span className="badge-pulse" />
                  CONNECT WITH AN ARCHITECT
                </div>
                <h2>Ready to move data without pipeline headaches?</h2>
                <p>
                  Schedule a 1-on-1 architecture review with our data engineering team. We will evaluate your source-destination topology, optimize CDC latency, and provide custom volume benchmarks.
                </p>

                <div className="contact-highlights-list">
                  <div className="highlight-item">
                    <span className="hl-icon">⚡</span>
                    <div>
                      <strong>Free Proof-of-Concept & Backfill</strong>
                      <p>Full historical replication test on your staging database with zero obligation.</p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <span className="hl-icon">🔒</span>
                    <div>
                      <strong>Enterprise Security Review</strong>
                      <p>SOC 2 compliance reports, architecture security whitepapers, and custom BAA.</p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <span className="hl-icon">⏱️</span>
                    <div>
                      <strong>Guaranteed 24h Response</strong>
                      <p>Direct communication with a Senior Solutions Architect.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-right-form">
                <div className="form-card-inner">
                  <h3>Schedule Architecture Review</h3>
                  <p className="form-sub">Tell us what systems you want to sync:</p>

                  <form
                    className="enterprise-contact-form"
                    action="mailto:hello@datarheo.io"
                    method="post"
                  >
                    <div className="form-row-2">
                      <div className="form-group">
                        <label htmlFor="user-name">Your Full Name *</label>
                        <input
                          id="user-name"
                          className="form-control"
                          type="text"
                          name="name"
                          placeholder="e.g. Alex Chen"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="user-email">Work Email *</label>
                        <input
                          id="user-email"
                          className="form-control"
                          type="email"
                          name="email"
                          placeholder="alex@company.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label htmlFor="user-source">Primary Data Source</label>
                        <input
                          id="user-source"
                          className="form-control"
                          type="text"
                          name="source"
                          placeholder="e.g. PostgreSQL, Salesforce, MySQL"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="user-dest">Destination Warehouse</label>
                        <input
                          id="user-dest"
                          className="form-control"
                          type="text"
                          name="destination"
                          placeholder="e.g. Snowflake, BigQuery, Databricks"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="user-message">Pipeline Scale & Requirements</label>
                      <textarea
                        id="user-message"
                        className="form-control"
                        name="message"
                        placeholder="Share your estimated row volume, sync frequency needs, or custom API requirements..."
                        rows={4}
                        required
                      />
                    </div>

                    <button type="submit" className="cta contact-submit-btn">
                      Request Architecture Session <span>→</span>
                    </button>

                    <p className="form-privacy-note">
                      🔒 Your information is confidential. We never sell or share your data.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
