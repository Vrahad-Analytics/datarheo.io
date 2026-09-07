import React, { useState, useEffect } from 'react';
import ToolIcon from './ToolIcon.jsx';

const SIMULATOR_SOURCES = [
  { id: 'postgres', name: 'PostgreSQL', tool: 'postgres', type: 'Database CDC', defaultThroughput: '18,400 rows/s', defaultLatency: '380 ms' },
  { id: 'mysql', name: 'MySQL', tool: 'mysql', type: 'Database CDC', defaultThroughput: '15,200 rows/s', defaultLatency: '420 ms' },
  { id: 'salesforce', name: 'Salesforce', tool: 'salesforce', type: 'SaaS CRM', defaultThroughput: '4,800 records/s', defaultLatency: '1.2 s' },
  { id: 'stripe', name: 'Stripe', tool: 'stripe', type: 'Payment Ledger', defaultThroughput: '3,200 events/s', defaultLatency: '450 ms' },
  { id: 'kafka', name: 'Apache Kafka', tool: 'kafka', type: 'Event Stream', defaultThroughput: '42,000 events/s', defaultLatency: '110 ms' },
  { id: 'mongodb', name: 'MongoDB', tool: 'mongodb', type: 'Document Store', defaultThroughput: '12,500 docs/s', defaultLatency: '550 ms' },
];

const SIMULATOR_DESTINATIONS = [
  { id: 'snowflake', name: 'Snowflake', tool: 'snowflake', type: 'Data Cloud', writeMode: 'Snowpipe Streaming' },
  { id: 'bigquery', name: 'BigQuery', tool: 'bigquery', type: 'Lakehouse', writeMode: 'Storage Write API' },
  { id: 'databricks', name: 'Databricks', tool: 'databricks', type: 'Delta Lake', writeMode: 'Unity Catalog MERGE' },
  { id: 'pinecone', name: 'Pinecone', tool: 'pinecone', type: 'Vector Database', writeMode: 'gRPC Embedding Stream' },
  { id: 'clickhouse', name: 'ClickHouse', tool: 'clickhouse', type: 'Real-Time OLAP', writeMode: 'Native Async Buffer' },
];

const SAMPLE_PAYLOADS = {
  postgres: {
    table: 'public.customers_ledger',
    operation: 'UPDATE',
    before: { id: 48219, tier: 'starter', credits: 100 },
    after: { id: 48219, tier: 'enterprise', credits: 15000, updated_at: '2026-09-07T13:21:00Z' },
  },
  salesforce: {
    object: 'Opportunity',
    stage: 'Closed-Won',
    amount: 85000.0,
    lead_source: 'Inbound Organic',
    drift_column: 'contract_duration_months: 24 (Auto-evolved)',
  },
  stripe: {
    event: 'invoice.payment_succeeded',
    customer_id: 'cus_N8x2j9A',
    currency: 'usd',
    amount_paid: 24900,
    status: 'paid',
  },
  kafka: {
    topic: 'telemetry.device.events',
    partition: 4,
    offset: 1984210,
    metrics: { cpu_usage: 41.2, mem_free_mb: 2840, temp_c: 54.1 },
  },
  mysql: {
    table: 'ecommerce.orders',
    operation: 'INSERT',
    order_id: 'ORD-99824',
    total: 349.50,
    items_count: 3,
  },
  mongodb: {
    collection: 'user_activity',
    action: 'checkout_completed',
    session_id: 'sess_9938a0',
    device: 'macOS Chrome 134',
  },
};

export default function PipelineSimulator() {
  const [selectedSource, setSelectedSource] = useState(SIMULATOR_SOURCES[0]);
  const [selectedDest, setSelectedDest] = useState(SIMULATOR_DESTINATIONS[0]);
  const [syncMode, setSyncMode] = useState('cdc'); // cdc, batch
  const [isStreaming, setIsStreaming] = useState(true);
  const [rowCount, setRowCount] = useState(3842109);
  const [schemaDriftActive, setSchemaDriftActive] = useState(false);
  const [driftNotification, setDriftNotification] = useState('');

  // Live row counter simulation
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      const increment = syncMode === 'cdc' ? Math.floor(Math.random() * 28) + 12 : 5;
      setRowCount((prev) => prev + increment);
    }, 180);
    return () => clearInterval(interval);
  }, [isStreaming, syncMode]);

  // Handle simulate schema drift
  const triggerSchemaDrift = () => {
    setSchemaDriftActive(true);
    setDriftNotification('New column `subscription_tier_v2 VARCHAR` detected upstream. Auto-evolving destination schema without pipeline pause...');
    setTimeout(() => {
      setDriftNotification('Destination schema evolved successfully! 0 failed records, exactly-once delivery guaranteed.');
    }, 2800);
  };

  const payload = SAMPLE_PAYLOADS[selectedSource.id] || SAMPLE_PAYLOADS.postgres;

  return (
    <section className="pipeline-simulator-section reveal" aria-labelledby="simulator-heading">
      <div className="section-container">
        <div className="section-header text-center">
          <div className="enterprise-badge">
            <span className="badge-pulse" />
            LIVE PIPELINE STUDIO
          </div>
          <h2 id="simulator-heading" className="section-title">
            Watch sub-second data replication in action.
          </h2>
          <p className="section-subtitle">
            Configure any source and destination below to preview real-time Change Data Capture, continuous schema healing, and streaming latency.
          </p>
        </div>

        <div className="simulator-card">
          {/* Top Configuration Controls */}
          <div className="simulator-config-grid">
            {/* Source Selector */}
            <div className="config-group">
              <label htmlFor="sim-source-select" className="config-label">
                <span className="label-dot dot-source" /> 1. Select Source
              </label>
              <div className="selector-pills">
                {SIMULATOR_SOURCES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`selector-pill ${selectedSource.id === s.id ? 'is-active' : ''}`}
                    onClick={() => setSelectedSource(s)}
                  >
                    <ToolIcon tool={s.tool} size={20} />
                    <span>{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Destination Selector */}
            <div className="config-group">
              <label htmlFor="sim-dest-select" className="config-label">
                <span className="label-dot dot-dest" /> 2. Select Destination
              </label>
              <div className="selector-pills">
                {SIMULATOR_DESTINATIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className={`selector-pill ${selectedDest.id === d.id ? 'is-active' : ''}`}
                    onClick={() => setSelectedDest(d)}
                  >
                    <ToolIcon tool={d.tool} size={20} />
                    <span>{d.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sync Mode Selector */}
            <div className="config-group config-group-mode">
              <label className="config-label">
                <span className="label-dot dot-mode" /> 3. Sync Mode
              </label>
              <div className="mode-toggle-group">
                <button
                  type="button"
                  className={`mode-btn ${syncMode === 'cdc' ? 'is-active' : ''}`}
                  onClick={() => setSyncMode('cdc')}
                >
                  ⚡ Real-time CDC (Sub-second)
                </button>
                <button
                  type="button"
                  className={`mode-btn ${syncMode === 'batch' ? 'is-active' : ''}`}
                  onClick={() => setSyncMode('batch')}
                >
                  ⏱️ 5-Min Micro-Batch
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Pipeline Visualization */}
          <div className="simulator-stage">
            {/* Status Bar */}
            <div className="stage-status-bar">
              <div className="stage-status-left">
                <span className={`status-indicator ${isStreaming ? 'is-running' : 'is-paused'}`}>
                  <span className="status-ping" />
                  {isStreaming ? 'Streaming Pipeline Active' : 'Pipeline Paused'}
                </span>
                <span className="stage-encryption-tag">🔒 End-to-End TLS 1.3 / KMS</span>
              </div>
              <div className="stage-status-actions">
                <button
                  type="button"
                  className="stage-action-btn"
                  onClick={() => setIsStreaming(!isStreaming)}
                >
                  {isStreaming ? '⏸ Pause Pipeline' : '▶ Resume Pipeline'}
                </button>
                <button
                  type="button"
                  className="stage-action-btn stage-action-drift"
                  onClick={triggerSchemaDrift}
                >
                  ⚡ Simulate Upstream Schema Drift
                </button>
              </div>
            </div>

            {/* Live Visual Flow Diagram */}
            <div className="pipeline-flow-track">
              {/* Source Node */}
              <div className="pipeline-node source-node">
                <ToolIcon tool={selectedSource.tool} size={56} className="node-icon" />
                <strong>{selectedSource.name}</strong>
                <span className="node-meta">{selectedSource.type}</span>
                <span className="node-status-pill">LOG-BASED EXTRACT</span>
              </div>

              {/* Data Stream Channel */}
              <div className={`pipeline-channel ${isStreaming ? 'is-active' : ''}`}>
                <div className="channel-line">
                  <div className="channel-stream-particles" />
                </div>
                <div className="channel-hub">
                  <div className="hub-core">
                    <img src="/images/logo.png" alt="datarheo.io" className="hub-logo" />
                    <span className="hub-pulse" />
                  </div>
                  <strong className="hub-title">Datarheo ELT Engine</strong>
                  <span className="hub-detail">Auto-Deduplication & Schema Healer</span>
                </div>
                <div className="channel-line">
                  <div className="channel-stream-particles" />
                </div>
              </div>

              {/* Destination Node */}
              <div className="pipeline-node dest-node">
                <ToolIcon tool={selectedDest.tool} size={56} className="node-icon" />
                <strong>{selectedDest.name}</strong>
                <span className="node-meta">{selectedDest.type}</span>
                <span className="node-status-pill">{selectedDest.writeMode}</span>
              </div>
            </div>

            {/* Schema Drift Alert Banner if active */}
            {driftNotification && (
              <div className="drift-alert-box" role="alert">
                <span className="drift-icon">⚡</span>
                <div className="drift-text">
                  <strong>Schema Evolution Auto-Triggered:</strong>
                  <p>{driftNotification}</p>
                </div>
                <button
                  type="button"
                  className="drift-dismiss-btn"
                  onClick={() => setDriftNotification('')}
                  aria-label="Dismiss notification"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Real-time Telemetry Metrics */}
            <div className="stage-telemetry-grid">
              <div className="telemetry-box">
                <span className="telemetry-label">RECORDS REPLICATED TODAY</span>
                <strong className="telemetry-value text-accent">
                  {rowCount.toLocaleString()}
                </strong>
                <span className="telemetry-trend">↑ Continuous exactly-once delivery</span>
              </div>
              <div className="telemetry-box">
                <span className="telemetry-label">REPLICATION LATENCY</span>
                <strong className="telemetry-value text-success">
                  {syncMode === 'cdc' ? selectedSource.defaultLatency : '4.8 mins'}
                </strong>
                <span className="telemetry-trend">Sub-second transaction commit</span>
              </div>
              <div className="telemetry-box">
                <span className="telemetry-label">STREAM THROUGHPUT</span>
                <strong className="telemetry-value">
                  {syncMode === 'cdc' ? selectedSource.defaultThroughput : 'Batch Micro-load'}
                </strong>
                <span className="telemetry-trend">Zero production DB CPU lock</span>
              </div>
              <div className="telemetry-box">
                <span className="telemetry-label">SCHEMA DRIFT STATUS</span>
                <strong className="telemetry-value text-green">
                  {schemaDriftActive ? 'Self-Healed (100%)' : 'Synchronized'}
                </strong>
                <span className="telemetry-trend">0 pipeline downtime hours</span>
              </div>
            </div>

            {/* Live Raw Event Inspector */}
            <div className="payload-inspector">
              <div className="inspector-header">
                <span className="inspector-title">
                  <span className="code-dot dot-red" />
                  <span className="code-dot dot-yellow" />
                  <span className="code-dot dot-green" />
                  Live Replicated CDC Record Payload ({selectedSource.name} → {selectedDest.name})
                </span>
                <span className="inspector-badge">JSON Format</span>
              </div>
              <pre className="inspector-code">
                <code>{JSON.stringify(payload, null, 2)}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
