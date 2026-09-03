export default function Logo({ size = 34, className = '' }) {
    return (
        <img src="/images/logo.png" alt="datarheo.io logo" height={size} style={{ width: 'auto', height: size }} className={`brand-logo-img ${className}`} />
    );
}