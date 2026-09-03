
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
        color: '#FF9900', // AWS orange
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
        color: '#336791', // PostgreSQL blue
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
    files: {
        color: '#64748B', // neutral gray
        icon: <path d="M4 7.2 h5.4 l1.8 2 h8.6 v8.6 a1.2 1.2 0 0 1 -1.2 1.2 H5.2 a1.2 1.2 0 0 1 -1.2 -1.2 Z" fill="#fff" />,
    },
    databricks: {
        color: '#FF3621', // Databricks red-orange
        icon: (
            <>
                <path d="M12 3.6 L20 8.4 L12 11.6 L4 8.4 Z" fill="#fff" opacity="0.95" />
                <path d="M4 12.6 L12 15.8 L20 12.6 L20 15.2 L12 20.4 L4 15.2 Z" fill="#fff" opacity="0.75" />
            </>
        ),
    },
    snowflake: {
        color: '#29B5E8', // Snowflake blue
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
    bigquery: {
        color: '#4285F4', // Google blue
        icon: (
            <>
                <polygon points="12,3.2 18.8,7.4 18.8,16.6 12,20.8 5.2,16.6 5.2,7.4" fill="none" stroke="#fff" strokeWidth="1.4" />
                <circle cx="12" cy="12" r="2.6" fill="#fff" />
            </>
        ),
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
};

export default function ToolIcon({ tool, size = 48, className = '' }) {
    const entry = TOOL_ICONS[tool];
    if (!entry) return null;
    const scale = size / 24; // our icons are drawn on a 24x24 grid
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={`tool-icon ${className}`}>
            <rect width={size} height={size} rx={size * 0.27} fill={entry.color} />
            <g transform={`scale(${scale})`}>{entry.icon}</g>
        </svg>
    );
}
