import ToolIcon from './ToolIcon.jsx';

const HUB = { x: 400, y: 160 };
const TILE = 56; 
const SOURCES = [
  { id: 'src-aws', x: 70, y: 42, label: 'AWS', tool: 'aws' },
  { id: 'src-s3', x: 58, y: 120, label: 'Amazon S3', tool: 's3' },
  { id: 'src-mysql', x: 58, y: 200, label: 'MySQL', tool: 'mysql' },
  { id: 'src-mongo', x: 70, y: 278, label: 'MongoDB', tool: 'mongodb' },
];

const DESTINATIONS = [
  { id: 'dest-pg', x: 730, y: 42, label: 'PostgreSQL', tool: 'postgres' },
  { id: 'dest-dbx', x: 742, y: 120, label: 'Databricks', tool: 'databricks' },
  { id: 'dest-sf', x: 742, y: 200, label: 'Snowflake', tool: 'snowflake' },
  { id: 'dest-kafka', x: 730, y: 278, label: 'Apache Kafka', tool: 'kafka' },
];

const ROUTES = [
  { source: SOURCES[0], dest: DESTINATIONS[0], delay: '0s' },
  { source: SOURCES[1], dest: DESTINATIONS[1], delay: '-1.5s' },
  { source: SOURCES[2], dest: DESTINATIONS[2], delay: '-3s' },
  { source: SOURCES[3], dest: DESTINATIONS[3], delay: '-4.5s' },
];

const CYCLE = '6s';
function ToolNode({ x, y, label, tool }) {
  const half = TILE / 2;
  return (
    <g className="flow-tool-node">
      <g transform={`translate(${x - half}, ${y - half})`}> <ToolIcon tool={tool} size={TILE} />
      </g>
      <text x={x} y={y + half + 20} textAnchor="middle" className="flow-node-label"> {label}</text>
    </g>
  );
}

function ConnectorHook({ nodeX, nodeY, flip }) {
  const t = 0.72; 
  const cx = HUB.x + (nodeX - HUB.x) * t;
  const cy = HUB.y + (nodeY - HUB.y) * t;
  return (
    <g className="flow-connector-hook" transform={`translate(${cx}, ${cy})`}>
      <circle r="13" className="flow-connector-badge" />
      <path d={flip ? 'M-2 -6 v7 a4 4 0 1 0 4 -4' : 'M2 -6 v7 a4 4 0 1 1 -4 -4'} className="flow-connector-icon" />
    </g>
  );
}

function FlowHook({ route, index }) {
  const { source, dest, delay } = route;
  const toHubX = HUB.x - source.x;
  const toHubY = HUB.y - source.y;
  const toDestX = dest.x - source.x;
  const toDestY = dest.y - source.y;

  return (
    <g style={{ transform: `translate(${source.x}px, ${source.y}px)` }}>
      <g
        className={`flow-hook flow-hook--${index}`}
        style={{ '--to-hub-x': `${toHubX}px`, '--to-hub-y': `${toHubY}px`, '--to-dest-x': `${toDestX}px`, '--to-dest-y': `${toDestY}px`, animationDelay: delay, animationDuration: CYCLE, }}  >
        <circle r="10" className="flow-hook-glow" />
        <path d="M-1.4 -6 v7 a3.6 3.6 0 1 0 3.6 -3.6" className="flow-hook-icon" />
      </g>
    </g>
  );
}

export default function DataFlowAnimation() {
  return (
    <svg viewBox="0 0 800 320" className="flow-svg" role="img"
      aria-label="Animated diagram of datarheo.io pulling data from source connectors and delivering it to destination connectors">
      {SOURCES.map((s) => (<line key={`rail-${s.id}`} x1={HUB.x} y1={HUB.y} x2={s.x} y2={s.y} className="flow-rail" />))}
      {DESTINATIONS.map((d) => (<line key={`rail-${d.id}`} x1={HUB.x} y1={HUB.y} x2={d.x} y2={d.y} className="flow-rail flow-rail--reverse" />))}
      {SOURCES.map((s) => (
        <ConnectorHook key={`hook-${s.id}`} nodeX={s.x} nodeY={s.y} flip={false} />
      ))}
      {DESTINATIONS.map((d) => (
        <ConnectorHook key={`hook-${d.id}`} nodeX={d.x} nodeY={d.y} flip={true} />
      ))}

      <circle cx={HUB.x} cy={HUB.y} r={38} className="flow-hub-circle" />
      <image className="flow-hub-logo" href="/images/logo.png" x={HUB.x - 24} y={HUB.y - 24} width={48} height={48} />
      <text x={HUB.x} y={HUB.y + 58} textAnchor="middle" className="flow-node-label flow-node-label--hub">datarheo.io</text>

      {SOURCES.map((s) => ( <ToolNode key={s.id} {...s} />))}
      {DESTINATIONS.map((d) => ( <ToolNode key={d.id} {...d} /> ))}
      {ROUTES.map((route, i) => ( <FlowHook key={i} route={route} index={i} /> ))}
    </svg>
  );
}
