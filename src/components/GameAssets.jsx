// GameAssets.jsx - 80s Midnight LA Noir Theme

export const BankerIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3">
        {/* Neon Vault/Safe Icon */}
        <rect x="15" y="25" width="70" height="60" rx="3" strokeLinejoin="round" />
        <rect x="20" y="30" width="60" height="50" rx="2" strokeWidth="1.5" opacity="0.5" />
        <circle cx="50" cy="55" r="15" strokeWidth="2" />
        <circle cx="50" cy="55" r="10" strokeWidth="1.5" />
        <circle cx="50" cy="55" r="4" fill="currentColor" />
        {/* Vault Handle */}
        <line x1="65" y1="55" x2="75" y2="55" strokeWidth="4" strokeLinecap="round" />
        {/* Digital Lock Display */}
        <rect x="30" y="35" width="40" height="8" rx="1" strokeWidth="1" opacity="0.7" />
        <line x1="35" y1="39" x2="38" y2="39" strokeWidth="2" />
        <line x1="42" y1="39" x2="45" y2="39" strokeWidth="2" />
        <line x1="49" y1="39" x2="52" y2="39" strokeWidth="2" />
        <line x1="56" y1="39" x2="59" y2="39" strokeWidth="2" />
    </svg>
);

export const RobberIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3">
        {/* Ski Mask / Robber Face */}
        <circle cx="50" cy="45" r="25" />
        {/* Eye Holes */}
        <ellipse cx="40" cy="42" rx="6" ry="4" fill="currentColor" />
        <ellipse cx="60" cy="42" rx="6" ry="4" fill="currentColor" />
        {/* Mask Lines */}
        <path d="M30 35 Q50 25 70 35" strokeWidth="2" opacity="0.5" />
        {/* Money Bag Below */}
        <path d="M35 75 Q35 85 50 85 Q65 85 65 75 L65 65 Q65 60 50 60 Q35 60 35 65 Z" />
        <path d="M45 60 L45 55 Q50 50 55 55 L55 60" strokeWidth="2" />
        {/* Dollar Sign */}
        <text x="50" y="78" textAnchor="middle" fontSize="14" fill="currentColor" stroke="none" fontWeight="bold">$</text>
    </svg>
);

export const MastermindIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2">
        {/* All-Seeing Eye / Illuminati Style */}
        <polygon points="50,15 85,80 15,80" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Eye */}
        <ellipse cx="50" cy="55" rx="15" ry="10" strokeWidth="2" />
        <circle cx="50" cy="55" r="5" fill="currentColor" />
        {/* Rays */}
        <line x1="50" y1="5" x2="50" y2="12" strokeWidth="1.5" />
        <line x1="30" y1="12" x2="35" y2="18" strokeWidth="1.5" />
        <line x1="70" y1="12" x2="65" y2="18" strokeWidth="1.5" />
        <line x1="20" y1="25" x2="28" y2="30" strokeWidth="1.5" />
        <line x1="80" y1="25" x2="72" y2="30" strokeWidth="1.5" />
        {/* Inner triangle */}
        <polygon points="50,30 70,70 30,70" strokeWidth="1" opacity="0.3" />
    </svg>
);

// LA City Skyline Background
export const CitySkyline = ({ className }) => (
    <svg viewBox="0 0 1200 400" className={className} preserveAspectRatio="xMidYMax slice">
        <defs>
            {/* Gradient for sky */}
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0d0221" />
                <stop offset="40%" stopColor="#1a0a2e" />
                <stop offset="70%" stopColor="#261447" />
                <stop offset="100%" stopColor="#3d1a5c" />
            </linearGradient>
            {/* Neon glow filter */}
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            {/* Sun/Moon gradient */}
            <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff9d00" />
                <stop offset="50%" stopColor="#ff6b35" />
                <stop offset="100%" stopColor="#ff2a6d" stopOpacity="0" />
            </radialGradient>
        </defs>

        {/* Background */}
        <rect width="100%" height="100%" fill="url(#skyGradient)" />

        {/* Setting Sun/Moon */}
        <circle cx="600" cy="350" r="80" fill="url(#sunGradient)" opacity="0.8" />
        <ellipse cx="600" cy="400" rx="200" ry="30" fill="#ff9d00" opacity="0.1" />

        {/* Stars */}
        {[...Array(30)].map((_, i) => (
            <circle
                key={i}
                cx={Math.random() * 1200}
                cy={Math.random() * 200}
                r={Math.random() * 1.5 + 0.5}
                fill="#f0e6ff"
                opacity={Math.random() * 0.5 + 0.3}
            />
        ))}

        {/* Far buildings - silhouettes */}
        <g fill="#0d0221" opacity="0.9">
            <rect x="0" y="280" width="60" height="120" />
            <rect x="70" y="250" width="40" height="150" />
            <rect x="120" y="300" width="50" height="100" />
            <rect x="180" y="220" width="70" height="180" />
            <rect x="260" y="270" width="45" height="130" />
            <rect x="320" y="200" width="80" height="200" />
            <rect x="410" y="260" width="55" height="140" />
            <rect x="480" y="180" width="100" height="220" />
            <rect x="590" y="240" width="60" height="160" />
            <rect x="660" y="210" width="90" height="190" />
            <rect x="760" y="280" width="50" height="120" />
            <rect x="820" y="230" width="70" height="170" />
            <rect x="900" y="260" width="55" height="140" />
            <rect x="970" y="290" width="40" height="110" />
            <rect x="1020" y="250" width="80" height="150" />
            <rect x="1110" y="270" width="60" height="130" />
            <rect x="1170" y="300" width="40" height="100" />
        </g>

        {/* Building windows - neon lights */}
        <g filter="url(#neonGlow)">
            {/* Random lit windows */}
            {[...Array(50)].map((_, i) => {
                const colors = ['#ff2a6d', '#05d9e8', '#ff9d00', '#d01257'];
                return (
                    <rect
                        key={i}
                        x={Math.random() * 1100 + 50}
                        y={Math.random() * 150 + 220}
                        width={4}
                        height={6}
                        fill={colors[Math.floor(Math.random() * colors.length)]}
                        opacity={Math.random() * 0.6 + 0.4}
                    />
                );
            })}
        </g>

        {/* Neon signs on buildings */}
        <g filter="url(#neonGlow)">
            <rect x="195" y="230" width="40" height="15" fill="none" stroke="#ff2a6d" strokeWidth="2" opacity="0.8" />
            <rect x="495" y="190" width="50" height="12" fill="none" stroke="#05d9e8" strokeWidth="2" opacity="0.8" />
            <rect x="830" y="240" width="45" height="14" fill="none" stroke="#ff9d00" strokeWidth="2" opacity="0.8" />
        </g>

        {/* Grid floor effect */}
        <g stroke="#05d9e8" strokeWidth="0.5" opacity="0.15">
            {[...Array(20)].map((_, i) => (
                <line key={i} x1="0" y1={350 + i * 5} x2="1200" y2={350 + i * (5 + i * 0.5)} />
            ))}
            {[...Array(25)].map((_, i) => (
                <line key={i} x1={i * 50} y1="350" x2={i * 50 - 200 + 600} y2="400" />
            ))}
        </g>
    </svg>
);

// Palm Tree Silhouette
export const PalmTree = ({ className, flip = false }) => (
    <svg viewBox="0 0 100 200" className={className} style={{ transform: flip ? 'scaleX(-1)' : 'none' }}>
        <defs>
            <linearGradient id="palmGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1a0a2e" />
                <stop offset="100%" stopColor="#0d0221" />
            </linearGradient>
        </defs>
        {/* Trunk */}
        <path
            d="M48 200 Q50 150 45 100 Q48 80 50 60"
            stroke="url(#palmGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
        />
        {/* Fronds */}
        <g fill="#0d0221">
            <path d="M50 60 Q30 40 5 50 Q35 45 50 60" />
            <path d="M50 60 Q70 40 95 50 Q65 45 50 60" />
            <path d="M50 60 Q40 30 20 20 Q45 35 50 60" />
            <path d="M50 60 Q60 30 80 20 Q55 35 50 60" />
            <path d="M50 60 Q50 25 50 5 Q50 35 50 60" />
            <path d="M50 60 Q35 35 15 35 Q40 40 50 60" />
            <path d="M50 60 Q65 35 85 35 Q60 40 50 60" />
        </g>
    </svg>
);

// Neon Sign Component
export const NeonSign = ({ text, color = 'pink', className }) => {
    const colorClass = {
        pink: 'text-neon-pink',
        cyan: 'text-neon-cyan',
        orange: 'text-neon-orange',
    }[color] || 'text-neon-pink';

    return (
        <div className={`font-display font-bold tracking-widest ${colorClass} animate-flicker ${className}`}
            style={{
                textShadow: `0 0 5px currentColor, 0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor`
            }}>
            {text}
        </div>
    );
};

// VHS Overlay Effect
export const VHSOverlay = () => (
    <>
        <div className="vhs-overlay" />
        <div className="film-grain" />
    </>
);

// Noise Overlay (Legacy + Enhanced)
export const NoiseOverlay = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay z-0"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
    />
);

// Animated Neon Border
export const NeonBorder = ({ children, color = 'pink', className }) => {
    const borderClass = {
        pink: 'neon-border-pink',
        cyan: 'neon-border-cyan',
        orange: 'neon-border-orange',
    }[color] || 'neon-border-pink';

    return (
        <div className={`border-2 ${borderClass} ${className}`}>
            {children}
        </div>
    );
};

// Glowing Orb (for ambient effects)
export const GlowingOrb = ({ color = 'pink', size = 'md', className }) => {
    const sizeClass = {
        sm: 'w-32 h-32',
        md: 'w-64 h-64',
        lg: 'w-96 h-96',
        xl: 'w-[500px] h-[500px]',
    }[size] || 'w-64 h-64';

    const colorClass = {
        pink: 'bg-neon-pink/20',
        cyan: 'bg-banker/20',
        orange: 'bg-gold/20',
        purple: 'bg-neon-purple/20',
    }[color] || 'bg-neon-pink/20';

    return (
        <div className={`${sizeClass} ${colorClass} rounded-full blur-[100px] ${className}`} />
    );
};

// Money/Dollar Icon for Policy Cards
export const MoneyIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3">
        <circle cx="50" cy="50" r="40" />
        <path d="M50 20 L50 80" strokeWidth="2" />
        <path d="M35 35 Q35 25 50 25 Q65 25 65 35 Q65 45 50 45 Q35 45 35 55 Q35 65 50 65 Q65 65 65 75 Q65 75 50 75" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

// Shield Icon for Security Policies
export const ShieldIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M50 10 L85 25 L85 55 Q85 80 50 95 Q15 80 15 55 L15 25 Z" strokeLinejoin="round" />
        <path d="M50 25 L70 35 L70 55 Q70 70 50 80 Q30 70 30 55 L30 35 Z" strokeWidth="2" opacity="0.5" />
        <path d="M40 50 L47 57 L62 42" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
