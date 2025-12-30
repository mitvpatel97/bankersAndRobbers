// Enhanced Premium SVG Assets for Bankers & Robbers
// Art Deco / Film Noir / Heist Theme

export const BankerIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3">
        {/* Luxury Vault Door - Art Deco Style */}
        {/* Outer vault frame */}
        <circle cx="50" cy="50" r="40" strokeWidth="4" />
        <circle cx="50" cy="50" r="35" strokeWidth="1.5" opacity="0.4" />

        {/* Central locking mechanism */}
        <circle cx="50" cy="50" r="15" strokeWidth="3" fill="currentColor" fillOpacity="0.1" />

        {/* Spoke design */}
        <line x1="50" y1="35" x2="50" y2="20" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="80" x2="50" y2="65" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="35" y1="50" x2="20" y2="50" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="80" y1="50" x2="65" y2="50" strokeWidth="2.5" strokeLinecap="round" />

        {/* Diagonal spokes */}
        <line x1="61" y1="61" x2="71" y2="71" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="39" y1="39" x2="29" y2="29" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="39" y1="61" x2="29" y2="71" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="61" y1="39" x2="71" y2="29" strokeWidth="2.5" strokeLinecap="round" />

        {/* Central hub */}
        <circle cx="50" cy="50" r="6" strokeWidth="2" />
        <circle cx="50" cy="50" r="3" fill="currentColor" />
    </svg>
);

export const RobberIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3">
        {/* Diamond Heist / Broken Glass Effect */}
        {/* Main diamond shape */}
        <path d="M50 10 L70 30 L50 90 L30 30 Z" strokeWidth="3.5" strokeLinejoin="miter" />

        {/* Inner facets */}
        <path d="M30 30 L50 45 L70 30" strokeWidth="2" />
        <path d="M50 45 L50 90" strokeWidth="2" />
        <line x1="50" y1="10" x2="50" y2="45" strokeWidth="2" />

        {/* Side facets */}
        <line x1="30" y1="30" x2="40" y2="60" strokeWidth="1.5" opacity="0.6" />
        <line x1="70" y1="30" x2="60" y2="60" strokeWidth="1.5" opacity="0.6" />

        {/* Shatter effect lines */}
        <path d="M35 35 L25 25" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <path d="M65 35 L75 25" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <path d="M45 20 L40 10" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M55 20 L60 10" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
);

export const MastermindIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
        {/* Puppet Master Crown + Eye Hybrid */}
        {/* Crown base */}
        <path d="M20 65 L30 40 L40 50 L50 30 L60 50 L70 40 L80 65 Z"
              strokeWidth="3" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />

        {/* Crown peaks */}
        <circle cx="30" cy="40" r="4" fill="currentColor" />
        <circle cx="50" cy="30" r="5" fill="currentColor" />
        <circle cx="70" cy="40" r="4" fill="currentColor" />

        {/* All-seeing eye */}
        <ellipse cx="50" cy="60" rx="18" ry="12" strokeWidth="2.5" />
        <circle cx="50" cy="60" r="7" fill="currentColor" fillOpacity="0.8" />
        <circle cx="50" cy="60" r="3" stroke="none" fill="currentColor" />

        {/* Puppet strings */}
        <path d="M30 40 L30 20 M50 30 L50 10 M70 40 L70 20"
              strokeDasharray="3 2" opacity="0.5" strokeWidth="1.5" />
        <circle cx="30" cy="20" r="2" fill="currentColor" opacity="0.6" />
        <circle cx="50" cy="10" r="2" fill="currentColor" opacity="0.6" />
        <circle cx="70" cy="20" r="2" fill="currentColor" opacity="0.6" />
    </svg>
);

export const VaultIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
        {/* Full vault illustration */}
        {/* Vault body */}
        <rect x="10" y="25" width="80" height="65" rx="2" strokeWidth="3" />
        <rect x="15" y="30" width="70" height="55" rx="1" strokeWidth="1.5" opacity="0.3" />

        {/* Vault door */}
        <circle cx="50" cy="57.5" r="20" strokeWidth="3" />
        <circle cx="50" cy="57.5" r="15" strokeWidth="2" opacity="0.4" />
        <circle cx="50" cy="57.5" r="8" strokeWidth="2" />

        {/* Locking bolts */}
        <rect x="4" y="45" width="6" height="20" rx="1" fill="currentColor" />
        <rect x="90" y="45" width="6" height="20" rx="1" fill="currentColor" />

        {/* Handle */}
        <line x1="70" y1="57.5" x2="85" y2="57.5" strokeWidth="3" strokeLinecap="round" />
        <circle cx="85" cy="57.5" r="3" fill="currentColor" />

        {/* Base */}
        <line x1="10" y1="90" x2="90" y2="90" strokeWidth="4" strokeLinecap="round" />
    </svg>
);

export const HeistIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
        {/* Money bag with dollar sign */}
        {/* Bag shape */}
        <path d="M35 35 Q30 50 30 60 Q30 80 50 85 Q70 80 70 60 Q70 50 65 35 L35 35 Z"
              strokeWidth="3" fill="currentColor" fillOpacity="0.1" />

        {/* Bag tie */}
        <path d="M40 25 Q45 20 50 22 Q55 20 60 25" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="40" y1="25" x2="40" y2="35" strokeWidth="2" />
        <line x1="60" y1="25" x2="60" y2="35" strokeWidth="2" />

        {/* Dollar sign */}
        <path d="M50 45 Q42 48 42 55 Q42 60 50 62 Q58 64 58 70 Q58 76 50 78"
              strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="42" x2="50" y2="81" strokeWidth="2.5" />

        {/* Sparkles */}
        <path d="M20 40 L22 42 L20 44 L18 42 Z" fill="currentColor" />
        <path d="M75 50 L77 52 L75 54 L73 52 Z" fill="currentColor" />
        <path d="M25 70 L27 72 L25 74 L23 72 Z" fill="currentColor" />
    </svg>
);

export const NoiseOverlay = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
    />
);

export const GoldBars = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" stroke="currentColor" strokeWidth="1">
        {/* Stack of gold bars */}
        {/* Bottom layer */}
        <path d="M15 70 L40 65 L40 75 L15 80 Z" opacity="0.9" />
        <path d="M42 65 L67 60 L67 70 L42 75 Z" opacity="0.9" />

        {/* Middle layer */}
        <path d="M20 55 L45 50 L45 60 L20 65 Z" opacity="0.95" />
        <path d="M47 50 L72 45 L72 55 L47 60 Z" opacity="0.95" />

        {/* Top layer */}
        <path d="M25 40 L50 35 L50 45 L25 50 Z" />
        <path d="M52 35 L77 30 L77 40 L52 45" />

        {/* Shine effects */}
        <line x1="30" y1="37" x2="35" y2="36" stroke="white" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
        <line x1="60" y1="32" x2="65" y2="31" stroke="white" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
    </svg>
);

// Animated loading spinner for game state transitions
export const LoadingSpinner = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="8">
        <circle cx="50" cy="50" r="40" opacity="0.2" />
        <path d="M50 10 A40 40 0 0 1 90 50" strokeLinecap="round">
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="1s"
                repeatCount="indefinite"
            />
        </path>
    </svg>
);

// Policy card back design
export const PolicyCardBack = ({ className }) => (
    <svg viewBox="0 0 100 150" className={className} fill="none" stroke="currentColor" strokeWidth="2">
        {/* Card border */}
        <rect x="5" y="5" width="90" height="140" rx="3" strokeWidth="3" />

        {/* Art deco pattern */}
        <path d="M50 20 L35 40 L50 40 L65 40 Z" opacity="0.3" />
        <path d="M50 130 L35 110 L50 110 L65 110 Z" opacity="0.3" />

        {/* Central seal */}
        <circle cx="50" cy="75" r="20" strokeWidth="2.5" />
        <circle cx="50" cy="75" r="15" strokeWidth="1.5" opacity="0.5" />
        <text x="50" y="82" textAnchor="middle" fontSize="16" fill="currentColor" fontFamily="serif">?</text>
    </svg>
);
