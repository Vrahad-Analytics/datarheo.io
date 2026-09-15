import React from 'react';

const MATRIX_ROWS = [
  {
    feature: 'Change Data Capture (CDC) Latency',
    datarheo: 'Sub-second (< 500ms continuous log replication)',
    fivetran: '5 to 15 minutes micro-batch',
    airbyte: 'Scheduled polling / 15m intervals',
    diy: 'Batched SQL scripts (1h to 24h lag)',
  },
  {
    feature: 'Automated Schema Drift Healing',
    datarheo: 'Instant DDL detection & auto-migration without job failure',
    fivetran: 'Supported (standard column additions)',
    airbyte: 'Partial schema detection',
    diy: 'Manual debugging & broken downstream tables',
  },
  {
    feature: 'AI & Vector Database Streaming',
    datarheo: 'Native chunking & direct sync into Pinecone/Weaviate/Qdrant',
    fivetran: 'Limited / Third-party connector add-ons',
    airbyte: 'Community experimental vector sinks',
    diy: 'Custom LangChain / LlamaIndex pipelines',
  },
  {
    feature: 'Pricing Predictability',
    datarheo: 'Flat, transparent tiers with zero row-overage penalties',
    fivetran: 'Steep MAR-based overages that multiply with scale',
    airbyte: 'Usage-based credit consumption',
    diy: 'Heavy full-time engineering salary overhead',
  },
  {
    feature: 'Connector Development Kit (CDK)',
    datarheo: '15-min low-code YAML & Python framework for internal APIs',
    fivetran: 'Custom connector enterprise add-on fee',
    airbyte: 'Open-source CDK',
    diy: 'Zero standardization, fragile point-to-point scripts',
  },
  {
    feature: 'Deployment Flexibility',
    datarheo: 'Fully Managed Cloud OR Hybrid On-Prem VPC Agent',
    fivetran: 'Primarily SaaS cloud-managed',
    airbyte: 'Self-hosted or Cloud',
    diy: 'Self-hosted cron/Airflow cluster maintenance',
  },
  {
    feature: 'dbt & Orchestration Native Webhooks',
    datarheo: 'Instant post-sync triggers for dbt Cloud, Airflow & Dagster',
    fivetran: 'Supported via Transformations',
    airbyte: 'Basic webhook integration',
    diy: 'Manual task sensors in Airflow DAGs',
  },
  {
    feature: 'Enterprise Compliance & Security',
    datarheo: 'SOC 2 Type II, HIPAA, GDPR, customer-managed KMS',
    fivetran: 'Enterprise certified',
    airbyte: 'Cloud certified only',
    diy: 'Security posture depends on custom auditing',
  },
];

export default function EnterpriseComparison() {
  return (
    <section className="enterprise-comparison-section reveal" aria-labelledby="matrix-heading">
      <div className="section-container">
        <div className="section-header text-center">
          <div className="enterprise-badge">
            <span className="badge-pulse" />
            MARKET BENCHMARK
          </div>
          <h2 id="matrix-heading" className="section-title">
            How Datarheo stacks up against industry alternatives.
          </h2>
          <p className="section-subtitle">
            Built for modern engineering teams who need sub-second CDC data pipelines without punitive volume pricing.
          </p>
        </div>

        <div className="matrix-table-wrap">
          <table className="enterprise-matrix-table">
            <thead>
              <tr>
                <th className="th-feature">Platform Capability</th>
                <th className="th-datarheo">
                  <div className="th-brand-header">
                    <span className="th-pill">RECOMMENDED</span>
                    <div className="th-brand-title">datarheo.io</div>
                  </div>
                </th>
                <th className="th-competitor">Fivetran</th>
                <th className="th-competitor">Airbyte</th>
                <th className="th-competitor">DIY In-House Scripts</th>
              </tr>
            </thead>
            <tbody>
              {MATRIX_ROWS.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'row-even' : 'row-odd'}>
                  <td className="td-feature">
                    <strong>{row.feature}</strong>
                  </td>
                  <td className="td-datarheo">
                    <div className="cell-content">
                      <span className="check-bullet">✓</span>
                      <span>{row.datarheo}</span>
                    </div>
                  </td>
                  <td className="td-competitor">{row.fivetran}</td>
                  <td className="td-competitor">{row.airbyte}</td>
                  <td className="td-competitor td-diy">{row.diy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
