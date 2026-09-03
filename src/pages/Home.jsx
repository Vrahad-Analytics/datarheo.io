import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

import SiteNavbar from '../components/SiteNavbar.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import DataFlowBeams from '../components/DataFlowBeams.jsx';
import BrandIcon from '../components/BrandIcon.jsx';
import { useScrollEffects } from '../hooks/useScrollEffects.js';

const MARQUEE_TOOLS = [
  { name: 'AWS', tool: 'aws' },
  { name: 'Amazon S3', tool: 's3' },
  { name: 'PostgreSQL', tool: 'postgres' },
  { name: 'MySQL', tool: 'mysql' },
  { name: 'MongoDB', tool: 'mongodb' },
  { name: 'Snowflake', tool: 'snowflake' },
  { name: 'Databricks', tool: 'databricks' },
  { name: 'BigQuery', tool: 'bigquery' },
  { name: 'Apache Kafka', tool: 'kafka' },
  { name: 'Flat files', tool: 'files' },
];

const STATS = [
  { value: '10', label: 'Sources and destinations available today' },
  { value: '50+', label: 'Connectors on the delivery roadmap' },
  { value: '5 min', label: 'Fastest sync interval you can schedule' },
  { value: '0', label: 'Pipelines your team has to hand-maintain' },
];

const FEATURE_ROWS = [
  {
    id: 'connect',
    eyebrow: 'AUTOMATED SETUP',
    title: 'Connect a source in minutes, not sprints',
    body: 'Choose a source, authenticate once, and pick a destination. datarheo.io runs the historical backfill for you, then switches to incremental updates on its own schedule.',
    bullets: [
      'Guided setup with no pipeline code to write',
      'Historical load handled before the first sync',
      'Incremental change capture by default',
    ],
    panel: 'setup',
  },
  {
    id: 'schema',
    eyebrow: 'SCHEMA DRIFT',
    title: 'Schema changes stop being your problem',
    body: 'When a column is added, renamed, or retyped upstream, datarheo.io detects the change and carries it through to your destination before a downstream dashboard breaks.',
    bullets: [
      'Drift detected on every sync, not after a failure',
      'New and altered columns propagated automatically',
      'A readable history of what changed and when',
    ],
    panel: 'schema',
  },
  {
    id: 'reliability',
    eyebrow: 'RELIABILITY',
    title: 'Know the state of every pipeline',
    body: 'Freshness, volume, and delivery signals for each dataset, so a delayed sync surfaces as a signal rather than as a question from someone reading a stale report.',
    bullets: [
      'Per-dataset freshness at a glance',
      'Transient failures retried automatically',
      'Alerts routed before stakeholders notice',
    ],
    panel: 'reliability',
  },
];

const CONNECTORS = [
  { name: 'AWS', kind: 'Cloud platform', tool: 'aws' },
  { name: 'Amazon S3', kind: 'Source', tool: 's3' },
  { name: 'MySQL', kind: 'Source', tool: 'mysql' },
  { name: 'MongoDB', kind: 'Source', tool: 'mongodb' },
  { name: 'Flat files', kind: 'Source', tool: 'files' },
  { name: 'Apache Kafka', kind: 'Source', tool: 'kafka' },
  { name: 'PostgreSQL', kind: 'Source and destination', tool: 'postgres' },
  { name: 'Snowflake', kind: 'Destination', tool: 'snowflake' },
  { name: 'Databricks', kind: 'Destination', tool: 'databricks' },
  { name: 'BigQuery', kind: 'Destination', tool: 'bigquery' },
];

const SYNC_PREVIEWS = [
  { name: 'MySQL production', tool: 'mysql', destination: 'Snowflake', destinationTool: 'snowflake', cadence: 'Every 15 minutes', volume: '2.4M rows today' },
  { name: 'MongoDB events', tool: 'mongodb', destination: 'Databricks', destinationTool: 'databricks', cadence: 'Every hour', volume: '860K rows today' },
  { name: 'Amazon S3 exports', tool: 's3', destination: 'PostgreSQL', destinationTool: 'postgres', cadence: 'Every 6 hours', volume: '128 files today' },
];

const GOVERNANCE = [
  { title: 'Encrypted end to end', body: 'Data is encrypted in transit and at rest across every leg of the pipeline.' },
  { title: 'Role-based access', body: 'Scope who can create connections, read credentials, and change a schedule.' },
  { title: 'Full audit trail', body: 'Every configuration change and sync run is recorded and reviewable.' },
  { title: 'Your choice of region', body: 'Pin processing to the region your data residency requirements call for.' },
];

const PRICING_TIERS = [
  {
    title: 'Starter',
    price: '$79',
    detail: 'per month',
    blurb: 'For a first pipeline into your warehouse.',
    features: ['3 active connections', 'Daily sync schedule', 'Schema drift handling', 'Email support'],
    cta: 'Start with Starter',
  },
  {
    title: 'Team',
    price: '$249',
    detail: 'per month',
    blurb: 'For teams running production data flows.',
    features: ['15 active connections', 'Sync every 15 minutes', 'Freshness alerting', 'Role-based access', 'Priority support'],
    cta: 'Start with Team',
    featured: true,
  },
  {
    title: 'Enterprise',
    price: 'Custom',
    detail: 'talk to us',
    blurb: 'For regulated stacks and custom scale.',
    features: ['Unlimited connections', 'Sync every 5 minutes', 'Region pinning', 'Audit export', 'Dedicated support'],
    cta: 'Talk to sales',
  },
];

const FAQS = [
  { question: 'What does datarheo.io actually do?', answer: 'It moves data out of the databases, applications, and file stores you already run and lands it in the warehouse or lake your team analyses in — then keeps that copy up to date on a schedule you choose.' },
  { question: 'How long does it take to get a first sync running?', answer: 'Connecting a source is a guided flow: authenticate, choose the tables you care about, pick a destination. The historical backfill starts immediately and incremental syncs follow it automatically.' },
  { question: 'What happens when our source schema changes?', answer: 'Added, renamed, and retyped columns are detected during the sync and propagated to the destination, so downstream models and dashboards keep resolving instead of failing overnight.' },
  { question: 'Our source is not in your connector list. Now what?', answer: 'Tell us the source, the destination, and the shape of the data you need moved. Connector priority is driven by what teams actually ask for.' },
  { question: 'Do we need engineers to maintain this?', answer: 'No. There is no pipeline code to own — setup, backfill, incremental capture, retries, and schema drift are handled by the platform.' },
];

function SetupPanel() {
  return (
    <div className="ui-panel">
      <div className="ui-panel-bar"><i /><i /><i /><span>New connection</span></div>
      <div className="ui-panel-body">
        <div className="setup-step is-done">
          <span className="setup-dot">1</span>
          <div><strong>Choose a source</strong><small>MySQL production</small></div>
          <span className="setup-logo"><BrandIcon tool="mysql" size={20} /></span>
        </div>
        <div className="setup-step is-done">
          <span className="setup-dot">2</span>
          <div><strong>Choose a destination</strong><small>Snowflake</small></div>
          <span className="setup-logo"><BrandIcon tool="snowflake" size={20} /></span>
        </div>
        <div className="setup-step is-active">
          <span className="setup-dot">3</span>
          <div><strong>Historical backfill</strong><small>4.2M of 5.0M rows</small></div>
          <span className="setup-pct">84%</span>
        </div>
        <div className="setup-progress"><i style={{ width: '84%' }} /></div>
        <p className="setup-foot">Incremental syncs begin automatically when the backfill completes.</p>
      </div>
    </div>
  );
}

function SchemaPanel() {
  const rows = [
    { name: 'order_id', type: 'bigint', state: 'ok' },
    { name: 'customer_email', type: 'varchar', state: 'ok' },
    { name: 'discount_code', type: 'varchar', state: 'added' },
    { name: 'total_amount', type: 'numeric(12,2)', state: 'changed' },
    { name: 'created_at', type: 'timestamptz', state: 'ok' },
  ];
  return (
    <div className="ui-panel">
      <div className="ui-panel-bar"><i /><i /><i /><span>public.orders</span></div>
      <div className="ui-panel-body">
        <div className="schema-head"><span>Column</span><span>Type</span><span>Status</span></div>
        {rows.map((row) => (
          <div className={`schema-row schema-row--${row.state}`} key={row.name}>
            <span className="schema-name">{row.name}</span>
            <span className="schema-type">{row.type}</span>
            <span className="schema-tag">
              {row.state === 'added' ? 'New column' : row.state === 'changed' ? 'Type widened' : 'Unchanged'}
            </span>
          </div>
        ))}
        <p className="setup-foot">2 changes propagated to Snowflake at 09:14 — no downstream break.</p>
      </div>
    </div>
  );
}

function ReliabilityPanel() {
  const datasets = [
    { name: 'orders', fresh: '2 min ago', pct: 96, state: 'ok' },
    { name: 'customers', fresh: '11 min ago', pct: 88, state: 'ok' },
    { name: 'events_raw', fresh: '38 min ago', pct: 54, state: 'warn' },
    { name: 'invoices', fresh: '4 min ago', pct: 93, state: 'ok' },
  ];
  return (
    <div className="ui-panel">
      <div className="ui-panel-bar"><i /><i /><i /><span>Dataset freshness</span></div>
      <div className="ui-panel-body">
        {datasets.map((d) => (
          <div className="freshness-row" key={d.name}>
            <span className={`freshness-dot freshness-dot--${d.state}`} />
            <strong>{d.name}</strong>
            <span className="freshness-meter"><i className={`freshness-meter--${d.state}`} style={{ width: `${d.pct}%` }} /></span>
            <small>{d.fresh}</small>
          </div>
        ))}
        <div className="freshness-foot">
          <span><b>14</b> retries resolved automatically</span>
          <span><b>0</b> alerts open</span>
        </div>
      </div>
    </div>
  );
}

const PANELS = { setup: SetupPanel, schema: SchemaPanel, reliability: ReliabilityPanel };

export default function Home() {
  useScrollEffects();
  const [selectedSync, setSelectedSync] = useState(0);
  const [syncRunning, setSyncRunning] = useState(true);
  const [connectorQuery, setConnectorQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(0);
  const activeSync = SYNC_PREVIEWS[selectedSync];
  const visibleConnectors = CONNECTORS.filter((connector) =>
    connector.name.toLowerCase().includes(connectorQuery.trim().toLowerCase())
  );

  function handleContactSubmit() {}

  return (
    <>
      <SiteNavbar variant="home" />

      <main>
        {/* ============ Hero ============ */}
        <section id="home" className="hero">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="shell hero-inner">
            <div className="hero-copy">
              <span className="hero-badge">Automated data movement</span>
              <h1>Every system you run, kept in sync</h1>
              <p>
                datarheo.io connects your databases, applications, and file stores to
                the warehouse your team works in — then keeps that data current, with
                no pipelines for anyone to babysit.
              </p>
              <div className="hero-actions">
                <a href="#contact" className="cta">Start for free</a>
                <a href="#contact" className="cta-outline">Talk to sales</a>
              </div>
              <p className="hero-note">
                Connect your first source in minutes · No pipeline code to maintain
              </p>
            </div>
            <div className="hero-visual">
              <ReliabilityPanel />
              <div className="hero-live-pulse">
                <span className="hero-live-dot" aria-hidden="true" />
                <span>Live data flow</span>
                <b>256 records delivered</b>
              </div>
            </div>
          </div>
        </section>

        {/* ============ Logo marquee ============ */}
        <section className="logo-strip">
          <p>WORKS WITH THE SYSTEMS YOU ALREADY RUN</p>
          <div className="logo-marquee">
            <div className="logo-track">
              {[...MARQUEE_TOOLS, ...MARQUEE_TOOLS].map((item, index) => (
                <span className="logo-chip" key={`${item.tool}-${index}`} aria-hidden={index >= MARQUEE_TOOLS.length}>
                  <BrandIcon tool={item.tool} size={22} /> {item.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ============ Stat band ============ */}
        <section className="stat-band reveal">
          <div className="shell stat-grid">
            {STATS.map((stat) => (
              <div className="stat-item" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ============ Feature rows ============ */}
        <section id="platform" className="feature-rows">
          <div className="shell section-head reveal">
            <span className="eyebrow">THE PLATFORM</span>
            <h2>Pipelines that run themselves</h2>
            <p className="section-lede">
              Three things every data team ends up building by hand. datarheo.io ships them.
            </p>
          </div>
          {FEATURE_ROWS.map((row, index) => {
            const Panel = PANELS[row.panel];
            return (
              <div
                className={index % 2 === 1 ? 'shell feature-row is-reversed reveal' : 'shell feature-row reveal'}
                id={row.id}
                key={row.id}
              >
                <div className="feature-copy">
                  <span className="eyebrow">{row.eyebrow}</span>
                  <h3>{row.title}</h3>
                  <p>{row.body}</p>
                  <ul className="feature-bullets">
                    {row.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                  <a href="#contact" className="link-arrow">See how it works <span aria-hidden="true">→</span></a>
                </div>
                <div className="feature-visual"><Panel /></div>
              </div>
            );
          })}
        </section>

        {/* ============ Flow illustration (dark) ============ */}
        <section className="flow-illustration reveal">
          <div className="shell">
            <span className="eyebrow eyebrow--on-dark">ONE PLATFORM</span>
            <h2>Every source, every destination, one path</h2>
            <p className="section-lede section-lede--on-dark">
              Connect the systems that need to exchange data, then let datarheo.io keep the flow running.
            </p>
            <DataFlowBeams />
          </div>
        </section>

        {/* ============ Sync control centre ============ */}
        <section className="sync-command-center reveal" aria-labelledby="sync-preview-title">
          <div className="shell sync-layout">
            <div className="sync-command-copy">
              <span className="eyebrow">PIPELINE CONTROL CENTER</span>
              <h2 id="sync-preview-title">See every sync at a glance</h2>
              <p>Pick a pipeline to see the route it takes, the schedule it runs on, and how much it has moved today.</p>
              <div className="sync-picker" role="tablist" aria-label="Select a sample sync">
                {SYNC_PREVIEWS.map((sync, index) => (
                  <button
                    key={sync.name}
                    className={selectedSync === index ? 'sync-picker-button is-active' : 'sync-picker-button'}
                    onClick={() => setSelectedSync(index)}
                    role="tab"
                    aria-selected={selectedSync === index}
                    type="button"
                  >
                    <BrandIcon tool={sync.tool} size={20} /> {sync.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="sync-monitor" aria-live="polite">
              <div className="sync-monitor-top">
                <span className={syncRunning ? 'sync-status is-running' : 'sync-status is-paused'}>
                  {syncRunning ? 'Syncing' : 'Paused'}
                </span>
                <button className="sync-toggle" type="button" onClick={() => setSyncRunning((current) => !current)}>
                  {syncRunning ? 'Pause sync' : 'Resume sync'}
                </button>
              </div>
              <div className="sync-route">
                <div className="sync-platform"><span className="sync-platform-icon"><BrandIcon tool={activeSync.tool} size={30} /></span><strong>{activeSync.name}</strong></div>
                <div className={syncRunning ? 'sync-route-line is-active' : 'sync-route-line'}><i /></div>
                <div className="sync-platform"><span className="sync-platform-icon"><BrandIcon tool={activeSync.destinationTool} size={30} /></span><strong>{activeSync.destination}</strong></div>
              </div>
              <div className="sync-metrics">
                <span><b>Schedule</b>{activeSync.cadence}</span>
                <span><b>Volume</b>{activeSync.volume}</span>
                <span><b>Last check</b>{syncRunning ? 'Just now' : 'Waiting for resume'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============ Connectors ============ */}
        <section id="connectors" className="connectors-section reveal">
          <div className="shell">
            <div className="section-head">
              <span className="eyebrow">CONNECTORS</span>
              <h2>Connect the systems that matter to your business</h2>
              <p className="section-lede">
                The sources and destinations available today, with more added based on what teams ask for.
              </p>
            </div>
            <Form.Control
              className="connector-search"
              type="search"
              value={connectorQuery}
              onChange={(event) => setConnectorQuery(event.target.value)}
              placeholder="Search connectors, e.g. MySQL"
              aria-label="Search connectors"
            />
            <div className="connector-grid">
              {visibleConnectors.map((connector) => (
                <div className="connector-card" key={connector.name}>
                  <span className="connector-icon"><BrandIcon tool={connector.tool} size={30} /></span>
                  <strong>{connector.name}</strong>
                  <span className="connectors-note">{connector.kind}</span>
                </div>
              ))}
              {visibleConnectors.length === 0 && (
                <p className="connector-empty">No connector matches that search yet — request it and we&apos;ll add it to the roadmap.</p>
              )}
              <div className="connector-card connector-card--more">
                <span className="more-badge">+50</span>
                <p className="more-text">More connectors on the roadmap</p>
                <a href="#contact" className="link-arrow">Request a connector <span aria-hidden="true">→</span></a>
              </div>
            </div>
          </div>
        </section>

        {/* ============ Governance ============ */}
        <section className="governance-section reveal">
          <div className="shell">
            <div className="section-head">
              <span className="eyebrow">GOVERNANCE</span>
              <h2>Built to satisfy the people who ask hard questions</h2>
              <p className="section-lede">
                Moving data across systems means moving responsibility with it. These controls are part of the platform.
              </p>
            </div>
            <div className="governance-grid">
              {GOVERNANCE.map((item) => (
                <div className="governance-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ Pricing ============ */}
        <section id="pricing" className="pricing-section reveal">
          <div className="shell">
            <div className="section-head">
              <span className="eyebrow">PRICING</span>
              <h2>Simple pricing for connected data</h2>
              <p className="section-lede">Start with one pipeline and grow when your workflows do.</p>
            </div>
            <div className="pricing-grid">
              {PRICING_TIERS.map((tier) => (
                <div className={tier.featured ? 'pricing-card pricing-card--featured' : 'pricing-card'} key={tier.title}>
                  {tier.featured && <span className="pricing-badge">Most popular</span>}
                  <h3>{tier.title}</h3>
                  <p className="pricing-blurb">{tier.blurb}</p>
                  <p className="price">{tier.price}<span className="price-detail">{tier.detail}</span></p>
                  <ul className="pricing-features">
                    {tier.features.map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                  <a href="#contact" className={tier.featured ? 'cta pricing-cta' : 'cta-soft pricing-cta'}>{tier.cta}</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="faq-section reveal" aria-labelledby="faq-title">
          <div className="shell faq-layout">
            <div className="faq-intro">
              <span className="eyebrow">COMMON QUESTIONS</span>
              <h2 id="faq-title">Answers before you ask</h2>
              <p>Still unsure about something? The team replies within a day.</p>
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
          </div>
        </section>

        {/* ============ Closing CTA ============ */}
        <section className="closing-cta">
          <div className="shell">
            <h2>Start moving your data today</h2>
            <p>Connect a source, pick a destination, and let the pipeline run itself.</p>
            <div className="hero-actions">
              <a href="#contact" className="cta">Start for free</a>
              <a href="#contact" className="cta-outline">Talk to sales</a>
            </div>
          </div>
        </section>

        {/* ============ Contact ============ */}
        <section id="contact" className="contact-section reveal">
          <div className="shell contact-layout">
            <div className="contact-showcase">
              <span className="eyebrow">LET&apos;S BUILD YOUR DATA FLOW</span>
              <h2>Tell us what you want to move next</h2>
              <p>Whether you are planning a first sync or scaling an existing stack, the team is ready to help.</p>
              <div className="contact-beacon" aria-hidden="true">
                <span className="contact-beacon-ring contact-beacon-ring--one" />
                <span className="contact-beacon-ring contact-beacon-ring--two" />
                <div className="contact-beacon-core"><strong>24h</strong><span>reply time</span></div>
              </div>
            </div>
            <div className="contact-content">
              <h3>Contact us</h3>
              <p>
                Prefer email? Reach us at <a href="mailto:hello@datarheo.io">hello@datarheo.io</a>
              </p>
              <Form className="contact-form" action="mailto:hello@datarheo.io" method="post" onSubmit={handleContactSubmit}>
                <Form.Control type="text" name="name" placeholder="Your name" required />
                <Form.Control type="email" name="email" placeholder="Your work email" required />
                <Form.Control as="textarea" name="message" placeholder="What are you trying to move?" rows={4} required />
                <Button type="submit" className="cta contact-submit">
                  Send message <span aria-hidden="true">→</span>
                </Button>
              </Form>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
