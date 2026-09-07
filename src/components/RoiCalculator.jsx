import React, { useState } from 'react';

export default function RoiCalculator() {
  const [rowsMillions, setRowsMillions] = useState(25); // in Millions of rows
  const [connectorsCount, setConnectorsCount] = useState(8);

  // Cost calculations
  // Datarheo: Transparent predictable pricing (~$249 base + tiered bulk)
  const datarheoCost = Math.round(180 + rowsMillions * 14 + connectorsCount * 12);
  // Legacy / Incumbent pricing (e.g. Fivetran MAR pricing scales steep)
  const competitorCost = Math.round(650 + rowsMillions * 48 + connectorsCount * 35);
  // DIY in-house data engineering maintenance cost (hourly cost of $85/hr for maintaining scripts, debugging API changes)
  const engineerHoursSaved = Math.round(20 + connectorsCount * 4.5 + rowsMillions * 0.4);
  const engineeringLaborCost = Math.round(engineerHoursSaved * 95);
  const annualSavings = Math.round((competitorCost + engineeringLaborCost - datarheoCost) * 12);

  return (
    <section className="roi-calculator-section reveal" aria-labelledby="roi-heading">
      <div className="section-container">
        <div className="section-header text-center">
          <div className="enterprise-badge">
            <span className="badge-pulse" />
            TRANSPARENT VOLUME ROI
          </div>
          <h2 id="roi-heading" className="section-title">
            Calculate your enterprise savings with Datarheo.
          </h2>
          <p className="section-subtitle">
            No punitive MAR overages. No surprise monthly bills. Predictable enterprise data movement at a fraction of the cost.
          </p>
        </div>

        <div className="roi-calculator-card">
          <div className="calculator-inputs-panel">
            {/* Rows Slider */}
            <div className="calc-field">
              <div className="calc-field-header">
                <label htmlFor="mar-slider" className="calc-label">
                  Monthly Active Rows (MAR) / Events:
                </label>
                <span className="calc-value-display">
                  {rowsMillions >= 100 ? `${rowsMillions}M+ rows` : `${rowsMillions} Million rows`}
                </span>
              </div>
              <input
                id="mar-slider"
                type="range"
                min="1"
                max="200"
                step="1"
                value={rowsMillions}
                onChange={(e) => setRowsMillions(Number(e.target.value))}
                className="calc-range-slider"
              />
              <div className="calc-slider-markers">
                <span>1M</span>
                <span>50M</span>
                <span>100M</span>
                <span>200M+</span>
              </div>
            </div>

            {/* Connectors Count Slider */}
            <div className="calc-field">
              <div className="calc-field-header">
                <label htmlFor="connectors-slider" className="calc-label">
                  Active Connected Sources & Destinations:
                </label>
                <span className="calc-value-display">{connectorsCount} connectors</span>
              </div>
              <input
                id="connectors-slider"
                type="range"
                min="2"
                max="40"
                step="1"
                value={connectorsCount}
                onChange={(e) => setConnectorsCount(Number(e.target.value))}
                className="calc-range-slider"
              />
              <div className="calc-slider-markers">
                <span>2</span>
                <span>10</span>
                <span>25</span>
                <span>40+</span>
              </div>
            </div>

            <div className="calc-features-checklist">
              <div className="check-item">
                <span className="icon">✓</span> Unlimited sync frequency (real-time sub-second)
              </div>
              <div className="check-item">
                <span className="icon">✓</span> Zero row overage penalties
              </div>
              <div className="check-item">
                <span className="icon">✓</span> Free initial historical sync backfills
              </div>
              <div className="check-item">
                <span className="icon">✓</span> Dedicated VPC or on-premise agent deployment
              </div>
            </div>
          </div>

          <div className="calculator-results-panel">
            <div className="savings-highlight-box">
              <span className="savings-label">ESTIMATED ANNUAL SAVINGS</span>
              <strong className="savings-amount">${annualSavings.toLocaleString()}</strong>
              <span className="savings-subtext">Compared to incumbent MAR vendors & DIY labor</span>
            </div>

            <div className="comparison-mini-table">
              <div className="comp-row datarheo-comp-row">
                <span className="comp-vendor">
                  <strong>datarheo.io</strong>
                  <small>Predictable Tier</small>
                </span>
                <span className="comp-price">${datarheoCost.toLocaleString()} / mo</span>
              </div>

              <div className="comp-row">
                <span className="comp-vendor">
                  <span>Legacy MAR Platforms</span>
                  <small>Fivetran / Airbyte Cloud tiers</small>
                </span>
                <span className="comp-price comp-price-high">
                  ~${competitorCost.toLocaleString()} / mo
                </span>
              </div>

              <div className="comp-row">
                <span className="comp-vendor">
                  <span>In-House Script Maintenance</span>
                  <small>~{engineerHoursSaved} hrs engineer time/mo</small>
                </span>
                <span className="comp-price comp-price-high">
                  ~${engineeringLaborCost.toLocaleString()} / mo
                </span>
              </div>
            </div>

            <div className="results-cta-wrap">
              <a href="#contact" className="cta w-100 text-center">
                Lock In Volume Pricing <span>→</span>
              </a>
              <p className="roi-disclaimer">
                Estimates based on standard market MAR benchmarks and average data engineering hourly rates ($95/hr).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
