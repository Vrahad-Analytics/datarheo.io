import React from 'react';

export const TOOL_ICONS = {
  aws: {
    color: '#232F3E',
    icon: (
      <>
        <text x="12" y="13.5" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="Arial, sans-serif">aws</text>
        <path d="M6 16.5 Q12 20 18 16.5" fill="none" stroke="#FF9900" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M16 15.8 l2.2 .7 -1.4 1.8" fill="#FF9900" />
      </>
    ),
  },
  s3: {
    color: '#E05326',
    icon: (
      <>
        <path d="M4 6 L20 6 L18 19 Q18 20 17 20 L7 20 Q6 20 6 19 Z" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M4 6 Q12 8.4 20 6" fill="none" stroke="#fff" strokeWidth="1.6" />
        <line x1="8" y1="9.2" x2="8.6" y2="17" stroke="#fff" strokeWidth="1.1" />
        <line x1="16" y1="9.2" x2="15.4" y2="17" stroke="#fff" strokeWidth="1.1" />
        <line x1="12" y1="9.4" x2="12" y2="17.2" stroke="#fff" strokeWidth="1.1" />
      </>
    ),
  },
  postgres: {
    color: '#336791',
    icon: (
      <>
        <ellipse cx="12" cy="6" rx="7" ry="2.4" fill="#fff" />
        <path d="M5 6 v10.2 c0 1.4 3.1 2.6 7 2.6 s7 -1.2 7 -2.6 V6" fill="none" stroke="#fff" strokeWidth="1.5" />
        <path d="M5 10.8c0 1.4 3.1 2.6 7 2.6s7 -1.2 7 -2.6" fill="none" stroke="#fff" strokeWidth="1.2" />
      </>
    ),
  },
  mysql: {
    color: '#00758F',
    icon: (
      <>
        <path d="M5 15.5c2.8-4.8 5.8-7.5 10.6-7.4 1.5 0 2.7.7 3.4 1.9-2.1-.5-4 .1-5.5 1.8 1.7-.2 3.2.1 4.5.8-2.4.2-4.3 1.1-5.6 2.8-1.4 1.8-3.7 2.1-7.4 0Z" fill="#fff" />
        <circle cx="15.9" cy="9.8" r=".75" fill="#00758F" />
        <path d="M5.5 16.8c2.6 2.2 6.1 2.6 9.8 1" fill="none" stroke="#F29111" strokeWidth="1.3" strokeLinecap="round" />
      </>
    ),
  },
  mongodb: {
    color: '#13AA52',
    icon: (
      <>
        <path d="M12 3.2c-3.3 3.7-4.2 6.5-3.4 10 .5 2.3 1.8 4.2 3.4 5.5 1.7-1.3 2.9-3.2 3.4-5.5.8-3.5-.1-6.3-3.4-10Z" fill="#fff" />
        <path d="M12 5.2v13.2" stroke="#13AA52" strokeWidth="1.05" strokeLinecap="round" />
      </>
    ),
  },
  oracle: {
    color: '#C74634',
    icon: (
      <>
        <ellipse cx="12" cy="12" rx="7.5" ry="4.5" fill="none" stroke="#fff" strokeWidth="1.8" />
        <path d="M7 10h10v4H7z" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.3" />
      </>
    ),
  },
  sqlserver: {
    color: '#0078D4',
    icon: (
      <>
        <rect x="5" y="4" width="6" height="6" fill="#fff" rx="0.5" />
        <rect x="13" y="4" width="6" height="6" fill="#fff" rx="0.5" />
        <rect x="5" y="12" width="6" height="6" fill="#fff" rx="0.5" />
        <rect x="13" y="12" width="6" height="6" fill="#fff" rx="0.5" />
      </>
    ),
  },
  dynamodb: {
    color: '#4B5EAA',
    icon: (
      <>
        <ellipse cx="12" cy="6" rx="6.5" ry="2.2" fill="#fff" />
        <path d="M5.5 6v4c0 1.2 2.9 2.2 6.5 2.2s6.5-1 6.5-2.2V6" fill="none" stroke="#fff" strokeWidth="1.2" />
        <path d="M5.5 10v4c0 1.2 2.9 2.2 6.5 2.2s6.5-1 6.5-2.2V10" fill="none" stroke="#fff" strokeWidth="1.2" />
      </>
    ),
  },
  redis: {
    color: '#DC382D',
    icon: (
      <>
        <polygon points="12,4 19,8 12,12 5,8" fill="#fff" />
        <polygon points="5,9 12,13 19,9 19,13 12,17 5,13" fill="#fff" opacity="0.85" />
        <polygon points="5,14 12,18 19,14 19,17 12,21 5,17" fill="#fff" opacity="0.7" />
      </>
    ),
  },
  cockroachdb: {
    color: '#6933FF',
    icon: (
      <>
        <rect x="6" y="5" width="12" height="14" rx="2" fill="none" stroke="#fff" strokeWidth="1.6" />
        <path d="M9 10h6M9 14h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="7" r="1" fill="#fff" />
      </>
    ),
  },
  salesforce: {
    color: '#00A1E0',
    icon: (
      <>
        <path d="M7 16a3.5 3.5 0 0 1 0-7 4.5 4.5 0 0 1 8-2 4 4 0 0 1 3.5 5.5 3.5 3.5 0 0 1-1.5 6.5H7Z" fill="#fff" />
        <text x="12" y="14" textAnchor="middle" fill="#00A1E0" fontSize="4.2" fontWeight="900" fontFamily="sans-serif">SF</text>
      </>
    ),
  },
  hubspot: {
    color: '#FF7A59',
    icon: (
      <>
        <circle cx="12" cy="12" r="3.2" fill="#fff" />
        <circle cx="17.5" cy="8" r="1.8" fill="#fff" />
        <line x1="14" y1="10.2" x2="16" y2="8.8" stroke="#fff" strokeWidth="1.4" />
        <circle cx="12" cy="4.5" r="1.5" fill="#fff" />
        <line x1="12" y1="6" x2="12" y2="8.8" stroke="#fff" strokeWidth="1.4" />
        <circle cx="6.5" cy="12" r="1.8" fill="#fff" />
        <line x1="8.3" y1="12" x2="8.8" y2="12" stroke="#fff" strokeWidth="1.4" />
      </>
    ),
  },
  stripe: {
    color: '#635BFF',
    icon: (
      <>
        <path d="M14.5 8.2c-.3-.2-.8-.4-1.5-.4-1.3 0-2.2.6-2.2 1.8 0 1.7 2.4 1.5 2.4 2.3 0 .4-.4.6-1 .6-.7 0-1.6-.3-2.1-.6v1.8c.6.3 1.4.5 2.1.5 1.4 0 2.4-.7 2.4-1.9 0-1.8-2.4-1.6-2.4-2.3 0-.4.3-.5.9-.5.6 0 1.3.2 1.8.5V8.2Z" fill="#fff" transform="scale(1.3) translate(-3, -2)" />
      </>
    ),
  },
  shopify: {
    color: '#95BF47',
    icon: (
      <>
        <path d="M15.5 6L14 4h-4l-1.5 2H5l2.5 13h9L19 6h-3.5Z" fill="#fff" />
        <text x="12" y="15" textAnchor="middle" fill="#95BF47" fontSize="7" fontWeight="900" fontFamily="sans-serif">S</text>
      </>
    ),
  },
  zendesk: {
    color: '#03363D',
    icon: (
      <>
        <circle cx="8" cy="8" r="3" fill="#fff" />
        <polygon points="12,11 18,11 12,17" fill="#fff" />
        <polygon points="12,5 6,11 12,11" fill="#fff" />
        <circle cx="16" cy="14" r="3" fill="#fff" />
      </>
    ),
  },
  netsuite: {
    color: '#2A4B7C',
    icon: (
      <>
        <polygon points="6,6 10,6 18,18 14,18" fill="#fff" />
        <polygon points="14,6 18,6 10,18 6,18" fill="#fff" opacity="0.6" />
      </>
    ),
  },
  jira: {
    color: '#0052CC',
    icon: (
      <>
        <polygon points="12,5 12,11 15,8" fill="#fff" />
        <polygon points="9,8 12,11 9,14" fill="#fff" opacity="0.8" />
        <polygon points="12,11 12,17 15,14" fill="#fff" />
      </>
    ),
  },
  github: {
    color: '#24292E',
    icon: (
      <>
        <circle cx="12" cy="12" r="7.5" fill="none" stroke="#fff" strokeWidth="1.6" />
        <path d="M9 16c1-1 1.5-2 1.5-4 0-1-.3-1.6-.7-2.2 1 0 2 .5 2 1.5.8-.3 1.5-.3 2.2 0 0-1 1-1.5 2-1.5-.4.6-.7 1.2-.7 2.2 0 2 .5 3 1.5 4" fill="none" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" />
      </>
    ),
  },
  snowflake: {
    color: '#29B5E8',
    icon: (
      <g stroke="#fff" strokeWidth="1.4" strokeLinecap="round">
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="4.8" y1="7.5" x2="19.2" y2="16.5" />
        <line x1="19.2" y1="7.5" x2="4.8" y2="16.5" />
        <line x1="12" y1="3" x2="9.6" y2="5.8" />
        <line x1="12" y1="3" x2="14.4" y2="5.8" />
        <line x1="12" y1="21" x2="9.6" y2="18.2" />
        <line x1="12" y1="21" x2="14.4" y2="18.2" />
      </g>
    ),
  },
  databricks: {
    color: '#FF3621',
    icon: (
      <>
        <path d="M12 3.6 L20 8.4 L12 11.6 L4 8.4 Z" fill="#fff" opacity="0.95" />
        <path d="M4 12.6 L12 15.8 L20 12.6 L20 15.2 L12 20.4 L4 15.2 Z" fill="#fff" opacity="0.75" />
      </>
    ),
  },
  bigquery: {
    color: '#4285F4',
    icon: (
      <>
        <polygon points="12,3.2 18.8,7.4 18.8,16.6 12,20.8 5.2,16.6 5.2,7.4" fill="none" stroke="#fff" strokeWidth="1.4" />
        <circle cx="12" cy="12" r="2.6" fill="#fff" />
        <line x1="14" y1="14" x2="17.5" y2="17.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  redshift: {
    color: '#8C4FFF',
    icon: (
      <>
        <polygon points="12,4 19,8 19,16 12,20 5,16 5,8" fill="none" stroke="#fff" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="3" fill="#fff" />
      </>
    ),
  },
  clickhouse: {
    color: '#FAFF00',
    icon: (
      <>
        <g fill="#1F2937">
          <rect x="5" y="6" width="2" height="12" rx="0.5" />
          <rect x="8.5" y="8" width="2" height="8" rx="0.5" />
          <rect x="12" y="4" width="2" height="16" rx="0.5" />
          <rect x="15.5" y="9" width="2" height="6" rx="0.5" />
          <rect x="19" y="7" width="2" height="10" rx="0.5" />
        </g>
      </>
    ),
  },
  iceberg: {
    color: '#0075A2',
    icon: (
      <>
        <polygon points="12,4 18,10 16,19 8,19 6,10" fill="none" stroke="#fff" strokeWidth="1.5" />
        <line x1="12" y1="4" x2="12" y2="19" stroke="#fff" strokeWidth="1.2" />
        <line x1="6" y1="10" x2="18" y2="10" stroke="#fff" strokeWidth="1.2" />
      </>
    ),
  },
  gcs: {
    color: '#4285F4',
    icon: (
      <>
        <rect x="5" y="6" width="14" height="12" rx="2" fill="none" stroke="#fff" strokeWidth="1.5" />
        <circle cx="9" cy="12" r="1.5" fill="#fff" />
        <circle cx="15" cy="12" r="1.5" fill="#fff" />
      </>
    ),
  },
  azureblob: {
    color: '#0089D6',
    icon: (
      <>
        <path d="M7 16l3-6 4 3 3-5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="17" cy="8" r="1.5" fill="#fff" />
      </>
    ),
  },
  files: {
    color: '#64748B',
    icon: <path d="M4 7.2 h5.4 l1.8 2 h8.6 v8.6 a1.2 1.2 0 0 1 -1.2 1.2 H5.2 a1.2 1.2 0 0 1 -1.2 -1.2 Z" fill="#fff" />,
  },
  kafka: {
    color: '#231F20',
    icon: (
      <g fill="#fff">
        <circle cx="12" cy="5.2" r="2" /><circle cx="6.2" cy="11.8" r="2" /><circle cx="17.8" cy="11.8" r="2" /><circle cx="12" cy="18.6" r="2" />
        <path d="M11.1 6.8 7.1 10M12.9 6.8 16.9 10M7.5 13.5l3.7 3.6M16.5 13.5l-3.7 3.6" stroke="#fff" strokeWidth="1.5" />
      </g>
    ),
  },
  segment: {
    color: '#52BD95',
    icon: (
      <>
        <circle cx="12" cy="12" r="6" fill="none" stroke="#fff" strokeWidth="1.6" strokeDasharray="3 2" />
        <circle cx="12" cy="12" r="2.5" fill="#fff" />
      </>
    ),
  },
  mixpanel: {
    color: '#7856FF',
    icon: (
      <>
        <circle cx="7" cy="15" r="2" fill="#fff" />
        <circle cx="12" cy="9" r="2.5" fill="#fff" />
        <circle cx="17" cy="6" r="2" fill="#fff" />
      </>
    ),
  },
  googleads: {
    color: '#FABB05',
    icon: (
      <>
        <ellipse cx="9" cy="12" rx="3" ry="5.5" transform="rotate(-30 9 12)" fill="#4285F4" />
        <ellipse cx="15" cy="12" rx="3" ry="5.5" transform="rotate(30 15 12)" fill="#34A853" />
        <circle cx="16" cy="15" r="2.5" fill="#EA4335" />
      </>
    ),
  },
  metaads: {
    color: '#0668E1',
    icon: (
      <>
        <path d="M12 14c-1.5-2.5-3-3.5-4.5-3.5C5.5 10.5 4 12 4 13.5S5.5 16.5 7.5 16.5c1.8 0 3-1.2 4.5-2.5 1.5 1.3 2.7 2.5 4.5 2.5 2 0 3.5-1.5 3.5-3s-1.5-3-3.5-3c-1.5 0-3 1-4.5 3.5Z" fill="none" stroke="#fff" strokeWidth="1.6" />
      </>
    ),
  },
  ga4: {
    color: '#E37400',
    icon: (
      <>
        <rect x="6" y="13" width="3" height="6" rx="1.5" fill="#fff" />
        <rect x="10.5" y="9" width="3" height="10" rx="1.5" fill="#fff" />
        <rect x="15" y="5" width="3" height="14" rx="1.5" fill="#fff" />
      </>
    ),
  },
  linkedinads: {
    color: '#0A66C2',
    icon: (
      <>
        <text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="800" fontFamily="sans-serif">in</text>
      </>
    ),
  },
  pinecone: {
    color: '#000000',
    icon: (
      <>
        <path d="M12 4l5 4v8l-5 4-5-4V8z" fill="none" stroke="#00E599" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="2.5" fill="#00E599" />
      </>
    ),
  },
  weaviate: {
    color: '#00A878',
    icon: (
      <>
        <polygon points="6,6 12,18 18,6" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="1.8" fill="#fff" />
      </>
    ),
  },
  qdrant: {
    color: '#DC2626',
    icon: (
      <>
        <rect x="6" y="6" width="12" height="12" rx="3" fill="none" stroke="#fff" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="2.5" fill="#fff" />
      </>
    ),
  },
  milvus: {
    color: '#0EA5E9',
    icon: (
      <>
        <circle cx="8" cy="8" r="2.2" fill="#fff" />
        <circle cx="16" cy="8" r="2.2" fill="#fff" />
        <circle cx="12" cy="16" r="2.2" fill="#fff" />
        <line x1="8" y1="8" x2="16" y2="8" stroke="#fff" strokeWidth="1.2" />
        <line x1="8" y1="8" x2="12" y2="16" stroke="#fff" strokeWidth="1.2" />
        <line x1="16" y1="8" x2="12" y2="16" stroke="#fff" strokeWidth="1.2" />
      </>
    ),
  },
};

export default function ToolIcon({ tool, size = 48, className = '' }) {
  const entry = TOOL_ICONS[tool] || TOOL_ICONS.files;
  const scale = size / 24;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`tool-icon ${className}`.trim()}
      role="img"
      aria-label={tool}
    >
      <rect width={size} height={size} rx={size * 0.26} fill={entry.color} />
      <g transform={`scale(${scale})`}>{entry.icon}</g>
    </svg>
  );
}
