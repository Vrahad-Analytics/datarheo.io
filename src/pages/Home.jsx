import { useState } from 'react';

import SiteNavbar from '../components/SiteNavbar.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import DataFlowAnimation from '../components/DataFlowAnimation.jsx';
import ToolIcon from '../components/ToolIcon.jsx';
import { useScrollEffects } from '../hooks/useScrollEffects.js';

const FEATURES = [
  {
    title: 'Data Movement Platform',
    body: 'Move data quickly, reliably, and at scale across the systems your team depends on.',
  },
  {
    title: 'Data Integration',
    body: 'Connect applications and systems to move data seamlessly between them.',
  },
  {
    title: 'Data Pipelines',
    body: 'Build and manage dependable data flows across your technology stack.',
  },
];

const STEPS = [
  {
    number: 1,
    title: 'Choose your systems',
    body: 'Start with the applications, sources, and destinations that need to share data.',
  },
  {
    number: 2,
    title: 'Design the flow',
    body: 'Define how data should move between systems and support the workflows your team relies on.',
  },
  {
    number: 3,
    title: 'Keep it moving',
    body: 'Create a reliable data flow that can grow with the rest of your technology stack.',
  },
];

const USECASES = [
  {
    title: 'Application Data Transfer',
    body: 'Transfer data efficiently between the applications and services your business uses every day.',
  },
  {
    title: 'Connected Data Operations',
    body: 'Bring data together across systems so teams can work from the information they need.',
  },
  {
    title: 'Technology Stack Integration',
    body: 'Create data flows that support the tools, applications, and services already in your stack.',
  },
];

const DIFFERENTIATORS = [
  'One platform for moving data between systems',
  'Integration built around your existing applications',
  'Data flows designed to support growing technology stacks',
  'A clearer path from source data to business use',
];

const ABOUT_PILLARS = [
  ['Fast', 'Accelerate data movement across your technology ecosystem.'],
  ['Reliable', 'Build dependable flows that keep data available where it is needed.'],
  ['Scalable', 'Support growing workloads without adding unnecessary complexity.'],
];

const COMPARISON_ROWS = [
  ['Data movement', 'Separate point-to-point processes', 'A unified platform approach'],
  ['Integration', 'Disconnected systems and handoffs', 'Connected applications and services'],
  ['Pipelines', 'One-off flows across the stack', 'Managed data flows with a common direction'],
  ['Operations', 'Limited visibility across workflows', 'A clearer view of data movement needs'],
];

const PRICING_TIERS = [
  { title: 'Starter', price: '$79', detail: '/ month' },
  { title: 'Team', price: '$249', detail: '/ month', featured: true },
  { title: 'Enterprise', price: 'Custom', detail: 'Pricing for your scale' },
];

const CONNECTORS = [
  { name: 'AWS', kind: 'Cloud', tool: 'aws' },
  { name: 'Amazon S3', kind: 'Source', tool: 's3' },
  { name: 'MySQL', kind: 'Source', tool: 'mysql' },
  { name: 'MongoDB', kind: 'Source', tool: 'mongodb' },
  { name: 'PostgreSQL', kind: 'Source & destination', tool: 'postgres' },
  { name: 'Snowflake', kind: 'Destination', tool: 'snowflake' },
];

const SYNC_PREVIEWS = [
  { name: 'MySQL production', tool: 'mysql', destination: 'Snowflake', destinationTool: 'snowflake', cadence: 'Every 15 minutes', volume: '2.4M rows today' },
  { name: 'MongoDB events', tool: 'mongodb', destination: 'Databricks', destinationTool: 'databricks', cadence: 'Every hour', volume: '860K rows today' },
  { name: 'Amazon S3 exports', tool: 's3', destination: 'PostgreSQL', destinationTool: 'postgres', cadence: 'Every 6 hours', volume: '128 files today' },
];

const OPERATIONS = [
  { title: 'Schema watch', label: 'CHANGES DETECTED', value: '0', detail: 'Field types and table changes are checked before they interrupt a downstream team.', color: 'blue' },
  { title: 'Automatic recovery', label: 'RETRIES RESOLVED', value: '14', detail: 'Temporary delivery issues retry automatically, so your team stays focused on the work that matters.', color: 'yellow' },
  { title: 'Freshness checks', label: 'HEALTHY DATASETS', value: '28', detail: 'Simple freshness signals make it easy to spot a delayed sync before a dashboard goes stale.', color: 'green' },
];

const FAQS = [
  { question: 'What does Datarheo help with?', answer: 'Datarheo is focused on moving data across systems, pipelines, applications, and services.' },
  { question: 'How do we get started?', answer: 'Start by identifying the systems that need to exchange data and the workflow you want to support.' },
  { question: 'What if our systems are not listed?', answer: 'Contact the team with your source, destination, and data-movement needs to discuss the right approach.' },
];

export default function Home() {
  useScrollEffects();
  const [selectedSync, setSelectedSync] = useState(0);
  const [syncRunning, setSyncRunning] = useState(true);
  const [connectorQuery, setConnectorQuery] = useState('');
  const [activeOperation, setActiveOperation] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const activeSync = SYNC_PREVIEWS[selectedSync];
  const visibleConnectors = CONNECTORS.filter((connector) => connector.name.toLowerCase().includes(connectorQuery.trim().toLowerCase()));

  return (
    <>
      <SiteNavbar variant="home" />

      <main>
        <div className="home-background" aria-hidden="true">
          <span className="home-background-orb home-background-orb--one" />
          <span className="home-background-orb home-background-orb--two" />
          <span className="home-background-orb home-background-orb--three" />
        </div>

        {/* Hero */}
        <section id="home" className="hero">
          <div className="hero-network" aria-hidden="true">
            <span className="hero-network-orbit hero-network-orbit--one" />
            <span className="hero-network-orbit hero-network-orbit--two" />
            <span className="hero-network-signal hero-network-signal--one" />
            <span className="hero-network-signal hero-network-signal--two" />
          </div>
          <h1>Move data across your systems, pipelines, and applications</h1>
          <p>
            Datarheo helps teams connect applications, build data flows, and
            move information where it is needed across their technology stack.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="cta"> Discuss your data flow</a>
            <a href="#contact" className="cta-outline"> Explore the platform </a>
          </div>
          <div className="hero-live-pulse" aria-label="Example live pipeline activity">
            <span className="hero-live-dot" aria-hidden="true" />
            <span>Live data flow</span>
            <b>256 records delivered</b>
          </div>
        </section>

        {/* Trust bar */}
        <section className="trust-bar">
          <p>BUILT FOR TEAMS ALREADY RUNNING ON</p>
          <div className="trust-logos" aria-label="Supported data platforms">
            {CONNECTORS.slice(0, 3).map((connector) => (
              <span className="trust-logo" key={connector.name}>
                <ToolIcon tool={connector.tool} size={25} /> {connector.name}
              </span>
            ))}
          </div>
        </section>

        {/* Animated flow illustration */}
        <section className="flow-illustration reveal">
          <h2>One platform for data movement across your stack.</h2>
          <p className="section-lede">
            Connect the systems, applications, and services that need to
            exchange data, then create the flows that keep work moving.
          </p>
          <DataFlowAnimation />
        </section>

        {/* Interactive sync preview */}
        <section className="sync-command-center reveal" aria-labelledby="sync-preview-title">
          <div className="sync-command-copy">
            <p className="sync-eyebrow">PIPELINE CONTROL CENTER</p>
            <h2 id="sync-preview-title">See every sync at a glance.</h2>
            <p>Explore a live-style view of how datarheo.io keeps your sources moving into the right destination.</p>
            <div className="sync-picker" role="tablist" aria-label="Select a sample sync">
              {SYNC_PREVIEWS.map((sync, index) => (
                <button key={sync.name} className={selectedSync === index ? 'sync-picker-button is-active' : 'sync-picker-button'} onClick={() => setSelectedSync(index)} role="tab" aria-selected={selectedSync === index}>
                  <ToolIcon tool={sync.tool} size={25} /> {sync.name}
                </button>
              ))}
            </div>
          </div>
          <div className="sync-monitor" aria-live="polite">
            <div className="sync-monitor-top">
              <span className={syncRunning ? 'sync-status is-running' : 'sync-status is-paused'}>{syncRunning ? 'Syncing' : 'Paused'}</span>
              <button className="sync-toggle" type="button" onClick={() => setSyncRunning((current) => !current)}>{syncRunning ? 'Pause sync' : 'Resume sync'}</button>
            </div>
            <div className="sync-route">
              <div className="sync-platform"><ToolIcon tool={activeSync.tool} size={52} /><strong>{activeSync.name}</strong></div>
              <div className={syncRunning ? 'sync-route-line is-active' : 'sync-route-line'}><i /></div>
              <div className="sync-platform"><ToolIcon tool={activeSync.destinationTool} size={52} /><strong>{activeSync.destination}</strong></div>
            </div>
            <div className="sync-metrics">
              <span><b>Schedule</b>{activeSync.cadence}</span>
              <span><b>Volume</b>{activeSync.volume}</span>
              <span><b>Last check</b>{syncRunning ? 'Just now' : 'Waiting for resume'}</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="section-narrow reveal">
          <h2>Data movement for connected systems</h2>
          <div className="card-grid">
            {FEATURES.map((f) => (
              <div className="brand-card" key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="section-narrow reveal">
          <h2>How it Works</h2>
          <div className="card-grid">
            {STEPS.map((s) => (
              <div className="brand-card" key={s.title}>
                <div className="step-number">{s.number}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Connector directory */}
        <section id="connectors" className="section-narrow reveal">
          <h2>Connect the systems that matter to your business.</h2>
          <p className="section-lede">Explore examples of the applications, data sources, and destinations that can form part of a connected data flow.</p>
          <input className="form-control connector-search" type="search" value={connectorQuery} onChange={(event) => setConnectorQuery(event.target.value)} placeholder="Search connectors, e.g. MySQL" aria-label="Search connectors" />
          <div className="card-grid connector-grid">
            {visibleConnectors.map((connector) => (
              <div className="brand-card connector-card" key={connector.name}>
                <ToolIcon tool={connector.tool} size={54} className="connector-icon" />
                <strong>{connector.name}</strong>
                <span className="connectors-note">{connector.kind}</span>
              </div>
            ))}
            {visibleConnectors.length === 0 && <p className="connector-empty">No connector found yet. Request it and we&apos;ll add it to the roadmap.</p>}
            <div className="brand-card connector-card more">
              <span className="more-badge">+50</span>
              <p className="more-text">More connectors in the works</p>
              <a href="#contact" className="more-link">
                Request a connector <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="usecases reveal">
          <h2>Built for how connected businesses move data</h2>
          <p className="section-lede">
            Three ways a data-movement platform can support your technology stack.
          </p>
          <div className="card-grid">
            {USECASES.map((u) => (
              <div className="brand-card usecase-card" key={u.title}>
                <h3>{u.title}</h3><p>{u.body}</p></div>))}
          </div>
        </section>

        {/* Differentiators */}
        <section className="differentiators reveal">
          <div className="differentiators-inner">
            <div className="differentiators-copy">
              <h2>Give your data a clearer path</h2>
              <p>
                Datarheo is designed for teams that need data to move between
                systems, applications, and workflows with more clarity.
              </p>
            </div>
            <ul className="diff-list">{DIFFERENTIATORS.map((d) => (<li key={d}>{d}</li>))}
            </ul>
          </div>
        </section>

        {/* About */}
        <section className="about-datarheo reveal" aria-labelledby="about-datarheo-title">
          <div className="about-datarheo-copy">
            <p className="sync-eyebrow">ABOUT DATARHEO</p>
            <h2 id="about-datarheo-title">Data movement for modern teams.</h2>
            <p>Datarheo is a modern data movement platform designed to help organizations move data quickly, reliably, and at scale across systems, applications, and pipelines.</p>
            <div className="about-teams">
              <span>Built for the teams behind connected products</span>
              <p>From analytics and customer experiences to automated operations and internal tools, Datarheo helps keep the data each team depends on moving in the right direction.</p>
              <div className="about-team-tags" aria-label="Teams Datarheo supports">
                <span>Data teams</span>
                <span>Engineering teams</span>
                <span>Operations teams</span>
              </div>
            </div>
          </div>
          <div className="about-pillars" aria-label="Datarheo principles">
            {ABOUT_PILLARS.map(([title, description], index) => (
              <article key={title} className="about-pillar">
                <span className="about-pillar-number">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Mission and vision */}
        <section className="mission-vision reveal" aria-labelledby="mission-vision-title">
          <div className="mission-vision-heading">
            <p className="sync-eyebrow">OUR DIRECTION</p>
            <h2 id="mission-vision-title">Built with a clear purpose.</h2>
            <p>The principles that guide how Datarheo helps teams build more connected data environments.</p>
          </div>
          <div className="mission-vision-grid">
            <article className="mission-vision-card mission-vision-card--mission">
              <span>Our mission</span>
              <h3>Make data movement simpler.</h3>
              <p>To provide fast, reliable, and scalable solutions that help organizations connect their data across systems and applications.</p>
            </article>
            <article className="mission-vision-card mission-vision-card--vision">
              <span>Our vision</span>
              <h3>Data that moves without boundaries.</h3>
              <p>To become the trusted foundation for seamless data movement across modern digital ecosystems.</p>
            </article>
          </div>
        </section>

        {/* Operations intelligence */}
        <section className="operations-section reveal" aria-labelledby="operations-title">
          <div className="operations-heading">
            <p className="sync-eyebrow">DATA DELIVERY INTELLIGENCE</p>
            <h2 id="operations-title">Pipeline operations without the guesswork.</h2>
            <p>Stay ahead of change with clear signals that show what is moving, what recovered, and what needs attention.</p>
          </div>
          <div className="operations-layout">
            <div className="operations-tabs" role="tablist" aria-label="Data delivery capabilities">
              {OPERATIONS.map((operation, index) => (
                <button key={operation.title} type="button" role="tab" aria-selected={activeOperation === index} onClick={() => setActiveOperation(index)} className={activeOperation === index ? 'operation-tab is-active' : 'operation-tab'}>
                  <span className={`operation-tab-dot operation-tab-dot--${operation.color}`} />
                  <span><strong>{operation.title}</strong><small>{operation.label}</small></span>
                  <i aria-hidden="true" />
                </button>
              ))}
            </div>
            <div className={`operations-display operations-display--${OPERATIONS[activeOperation].color}`} aria-live="polite">
              <span className="operations-display-label">{OPERATIONS[activeOperation].label}</span>
              <strong>{OPERATIONS[activeOperation].value}</strong>
              <div className="operations-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
              <p>{OPERATIONS[activeOperation].detail}</p>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="section-narrow reveal">
          <h2>A better direction for connected data</h2>
          <p className="section-lede">
            Bring data movement, integration, and pipelines into a more
            connected approach.
          </p>
          <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th></th>
                <th>Legacy / DIY pipelines</th>
                <th>datarheo.io</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row[0]}>{row.map((cell, i) => (<td key={i}>{cell}</td>))}</tr>))}
            </tbody>
          </table>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="section-narrow reveal">
          <h2>Simple pricing for connected data</h2>
          <p>Choose a starting point for your data-movement needs, then grow when your workflows do.</p>
          <div className="card-grid">
            {PRICING_TIERS.map((tier) => (
              <div className={`brand-card pricing-card${tier.featured ? ' pricing-card--featured' : ''}`} key={tier.title}>
                {tier.featured && <span className="pricing-badge">Most popular</span>}
                <h3>{tier.title}</h3>
                <p className="price">{tier.price}</p>
                <span className="price-detail">{tier.detail}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-section reveal" aria-labelledby="faq-title">
          <div className="faq-intro">
            <p className="sync-eyebrow">COMMON QUESTIONS</p>
            <h2 id="faq-title">Built to make data movement feel simpler.</h2>
            <p>Everything your team needs to understand the first steps.</p>
          </div>
          <div className="faq-list">
            {FAQS.map((faq, index) => (
              <div className={openFaq === index ? 'faq-item is-open' : 'faq-item'} key={faq.question}>
                <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}>
                  <span>{faq.question}</span><i aria-hidden="true" />
                </button>
                <div className="faq-answer"><p>{faq.answer}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="contact-section reveal">
          <div className="contact-layout">
            <div className="contact-showcase">
              <p className="contact-kicker">LET&apos;S BUILD YOUR DATA FLOW</p>
              <h2>Tell us what you want to move next.</h2>
              <p>Whether you&apos;re planning your first sync or scaling an existing stack, our team is ready to help.</p>
              <div className="contact-beacon" aria-hidden="true">
                <span className="contact-beacon-ring contact-beacon-ring--one" />
                <span className="contact-beacon-ring contact-beacon-ring--two" />
                <span className="contact-beacon-ring contact-beacon-ring--three" />
                <div className="contact-beacon-core"><strong>24h</strong><span>reply time</span></div>
              </div>
            </div>
            <div className="contact-content">
              <h2>Contact Us</h2>
              <p>
                Have questions? Reach us at{' '}
                <a href="mailto:hello@datarheo.io">hello@datarheo.io</a>
              </p>
              <form className="contact-form" action="mailto:hello@datarheo.io" method="post">
                <input className="form-control" type="text" name="name" placeholder="Your name" required />
                <input className="form-control" type="email" name="email" placeholder="Your email" required />
                <textarea className="form-control" name="message" placeholder="How can we help?" rows={4} required />
                <button type="submit" className="cta contact-submit">
                  Send message <span aria-hidden="true">→</span>
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
