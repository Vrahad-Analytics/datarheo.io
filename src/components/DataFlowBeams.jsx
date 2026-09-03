import { forwardRef, useRef } from 'react';
import AnimatedBeam from './AnimatedBeam.jsx';
import BrandIcon from './BrandIcon.jsx';

const SOURCES = [
  { tool: 'aws', label: 'AWS' },
  { tool: 's3', label: 'Amazon S3' },
  { tool: 'mysql', label: 'MySQL' },
  { tool: 'mongodb', label: 'MongoDB' },
  { tool: 'kafka', label: 'Apache Kafka' },
];

const DESTINATIONS = [
  { tool: 'snowflake', label: 'Snowflake' },
  { tool: 'databricks', label: 'Databricks' },
  { tool: 'bigquery', label: 'BigQuery' },
  { tool: 'postgres', label: 'PostgreSQL' },
];

/* Curvature per row: outer rows bow further so the beams fan out evenly. */
const curveFor = (index, count) => {
  const middle = (count - 1) / 2;
  return (index - middle) * -34;
};

const BeamNode = forwardRef(function BeamNode({ tool, label, size = 30 }, ref) {
  return (
    <div className="beam-node">
      <span className="beam-node-circle" ref={ref}>
        <BrandIcon tool={tool} size={size} />
      </span>
      <span className="beam-node-label">{label}</span>
    </div>
  );
});

export default function DataFlowBeams() {
  const containerRef = useRef(null);
  const hubRef = useRef(null);

  const sourceRefs = useRef(SOURCES.map(() => ({ current: null })));
  const destRefs = useRef(DESTINATIONS.map(() => ({ current: null })));

  return (
    <div className="beam-stage" ref={containerRef}>
      <div className="beam-column beam-column--sources">
        {SOURCES.map((item, index) => (
          <BeamNode key={item.tool} tool={item.tool} label={item.label} ref={sourceRefs.current[index]} />
        ))}
      </div>

      <div className="beam-column beam-column--hub">
        <div className="beam-hub">
          <span className="beam-hub-ring" aria-hidden="true" />
          <span className="beam-hub-ring beam-hub-ring--outer" aria-hidden="true" />
          <span className="beam-hub-core" ref={hubRef}>
            <img src="/images/logo.png" alt="" width={38} height={38} />
          </span>
        </div>
        <span className="beam-hub-label">datarheo.io</span>
      </div>

      <div className="beam-column beam-column--destinations">
        {DESTINATIONS.map((item, index) => (
          <BeamNode key={item.tool} tool={item.tool} label={item.label} ref={destRefs.current[index]} />
        ))}
      </div>

      {/* Sources pull in toward the hub. */}
      {SOURCES.map((item, index) => (
        <AnimatedBeam
          key={`in-${item.tool}`}
          containerRef={containerRef}
          fromRef={sourceRefs.current[index]}
          toRef={hubRef}
          curvature={curveFor(index, SOURCES.length)}
          duration={4.5}
          delay={index * 0.45}
        />
      ))}

      {/* The hub pushes out to each destination. */}
      {DESTINATIONS.map((item, index) => (
        <AnimatedBeam
          key={`out-${item.tool}`}
          containerRef={containerRef}
          fromRef={hubRef}
          toRef={destRefs.current[index]}
          curvature={curveFor(index, DESTINATIONS.length)}
          duration={4.5}
          delay={1.1 + index * 0.45}
        />
      ))}
    </div>
  );
}
