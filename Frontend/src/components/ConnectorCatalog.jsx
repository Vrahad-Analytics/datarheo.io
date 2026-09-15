import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import ToolIcon from './ToolIcon.jsx';
import { CONNECTOR_CATEGORIES, CONNECTORS_DATA } from '../data/connectorsData.js';

export default function ConnectorCatalog() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // all, source, destination
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalConnector, setActiveModalConnector] = useState(null);

  const filteredConnectors = useMemo(() => {
    return CONNECTORS_DATA.filter((connector) => {
      const matchesCategory =
        selectedCategory === 'all' || connector.category === selectedCategory;
      const matchesType =
        typeFilter === 'all' ||
        connector.type === 'both' ||
        connector.type === typeFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        connector.name.toLowerCase().includes(q) ||
        connector.description.toLowerCase().includes(q) ||
        connector.badge.toLowerCase().includes(q) ||
        connector.protocol.toLowerCase().includes(q);

      return matchesCategory && matchesType && matchesSearch;
    });
  }, [selectedCategory, typeFilter, searchQuery]);

  return (
    <section id="connectors" className="connector-catalog-section reveal is-visible">
      <div className="section-container">
        <div className="section-header text-center">
          <div className="enterprise-badge">
            <span className="badge-pulse" />
            350+ ENTERPRISE CONNECTORS & COUNTING
          </div>
          <h2 className="section-title">
            Connect any source to any warehouse in minutes.
          </h2>
          <p className="section-subtitle">
            Zero-maintenance connectors with sub-second CDC, automatic schema drift healing, and enterprise encryption.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="catalog-controls">
          {/* Search */}
          <div className="catalog-search-wrap">
            <svg
              className="search-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              className="catalog-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, protocol (e.g. Postgres, CDC, Salesforce, Snowflake)..."
              aria-label="Search connectors"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="catalog-type-pills" role="radiogroup" aria-label="Filter by connector type">
            <button
              type="button"
              role="radio"
              aria-checked={typeFilter === 'all'}
              className={`type-pill ${typeFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => setTypeFilter('all')}
            >
              All Types
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={typeFilter === 'source'}
              className={`type-pill ${typeFilter === 'source' ? 'is-active' : ''}`}
              onClick={() => setTypeFilter('source')}
            >
              Sources
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={typeFilter === 'destination'}
              className={`type-pill ${typeFilter === 'destination' ? 'is-active' : ''}`}
              onClick={() => setTypeFilter('destination')}
            >
              Destinations
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="catalog-categories-bar" role="tablist" aria-label="Connector categories">
          {CONNECTOR_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={selectedCategory === cat.id}
              className={`cat-tab ${selectedCategory === cat.id ? 'is-active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count & status */}
        <div className="catalog-status-bar">
          <span>
            Showing <strong>{filteredConnectors.length}</strong> enterprise connectors
          </span>
          <span className="live-verified-pill">
            <span className="dot-green" /> Production Verified SLA
          </span>
        </div>

        {/* Connector Cards Grid */}
        <div className="connector-cards-grid">
          {filteredConnectors.map((connector) => (
            <article
              key={connector.id}
              className="connector-card-v2"
              onClick={() => setActiveModalConnector(connector)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveModalConnector(connector);
                }
              }}
            >
              <div className="connector-card-top">
                <ToolIcon tool={connector.tool} size={48} className="connector-avatar" />
                <div className="connector-pills">
                  <span className="connector-badge-pill">{connector.badge}</span>
                  <span className="connector-type-pill">
                    {connector.type === 'both'
                      ? 'Source & Dest'
                      : connector.type === 'source'
                      ? 'Source'
                      : 'Destination'}
                  </span>
                </div>
              </div>

              <h3 className="connector-name">{connector.name}</h3>
              <p className="connector-desc">{connector.description}</p>

              <div className="connector-card-footer">
                <span className="connector-latency">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {connector.latency}
                </span>
                <span className="connector-inspect-link">
                  Specs <span>→</span>
                </span>
              </div>
            </article>
          ))}

          {/* Request / Custom Connector Card */}
          <div className="connector-card-v2 connector-card-custom">
            <div className="custom-card-icon">
              <span className="plus-symbol">+</span>
            </div>
            <h3>Custom API Connector</h3>
            <p>
              Build, test, and publish custom internal connectors in 15 minutes using our open Connector Development Kit (CDK).
            </p>
            <a href="#contact" className="custom-connector-action">
              Request or Build Custom <span>→</span>
            </a>
          </div>
        </div>

        {filteredConnectors.length === 0 && (
          <div className="catalog-empty-state">
            <p>No connectors match &quot;{searchQuery}&quot; in this category.</p>
            <button
              type="button"
              className="cta-outline btn-sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setTypeFilter('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* CDK Enterprise Banner */}
        <div className="cdk-banner">
          <div className="cdk-content">
            <span className="cdk-kicker">CONNECTOR DEVELOPMENT KIT (CDK)</span>
            <h3>Have proprietary or legacy internal databases?</h3>
            <p>
              Use the Datarheo CDK to generate certified connectors with built-in checkpointing, schema drift auto-repair, and rate limiting in pure Python or declarative YAML.
            </p>
          </div>
          <div className="cdk-actions">
            <a href="#contact" className="cta cdk-cta">
              Explore Connector SDK
            </a>
          </div>
        </div>
      </div>

      {/* Modal for Connector Specs */}
      {activeModalConnector && createPortal((
        <div
          className="connector-modal-backdrop"
          onClick={() => setActiveModalConnector(null)}
          role="presentation"
        >
          <div
            className="connector-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-connector-title"
          >
            <div className="connector-modal-header">
              <div className="modal-header-left">
                <ToolIcon tool={activeModalConnector.tool} size={54} />
                <div>
                  <h3 id="modal-connector-title">{activeModalConnector.name} Connector</h3>
                  <div className="modal-badges">
                    <span className="connector-badge-pill">{activeModalConnector.badge}</span>
                    <span className="modal-category-tag">{activeModalConnector.category.toUpperCase()}</span>
                    <span className="modal-verified-tag">✔ 99.99% Enterprise SLA</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveModalConnector(null)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="connector-modal-body">
              <p className="modal-connector-description">
                {activeModalConnector.description}
              </p>

              <div className="modal-specs-grid">
                <div className="spec-box">
                  <span className="spec-label">Replication Protocol</span>
                  <strong>{activeModalConnector.protocol}</strong>
                </div>
                <div className="spec-box">
                  <span className="spec-label">Sync Latency</span>
                  <strong className="text-success">{activeModalConnector.latency}</strong>
                </div>
                <div className="spec-box">
                  <span className="spec-label">Schema Evolution</span>
                  <strong>{activeModalConnector.schemaDrift}</strong>
                </div>
                <div className="spec-box">
                  <span className="spec-label">Connector Type</span>
                  <strong>
                    {activeModalConnector.type === 'both'
                      ? 'Bidirectional (Source & Destination)'
                      : activeModalConnector.type === 'source'
                      ? 'Source Connector'
                      : 'Destination Connector'}
                  </strong>
                </div>
              </div>

              <div className="modal-section">
                <h4>Supported Sync Modes</h4>
                <ul className="modal-sync-modes">
                  {activeModalConnector.syncModes.map((mode) => (
                    <li key={mode}>
                      <span className="check-icon">✓</span> {mode}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-section">
                <h4>Enterprise Compliance & Security</h4>
                <div className="modal-security-tags">
                  <span>TLS 1.3 In-Transit</span>
                  <span>AES-256 / KMS At-Rest</span>
                  <span>SOC 2 Type II</span>
                  <span>Zero Data Retention Cache</span>
                  <span>VPC Peering Ready</span>
                </div>
              </div>
            </div>

            <div className="connector-modal-footer">
              <a href="#contact" className="cta" onClick={() => setActiveModalConnector(null)}>
                Deploy {activeModalConnector.name} Pipeline
              </a>
              <button
                type="button"
                className="cta-outline"
                onClick={() => setActiveModalConnector(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ), document.body)}
    </section>
  );
}
