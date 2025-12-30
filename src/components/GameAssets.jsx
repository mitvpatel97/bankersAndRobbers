export const BankerIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4">
        {/* Art Deco Bank/Vault Icon */}
        <path d="M10 90 L90 90" strokeLinecap="round" />
        <path d="M15 90 L15 40 L50 20 L85 40 L85 90" strokeLinejoin="round" />
        <path d="M30 90 L30 40" />
        <path d="M50 90 L50 35" />
        <path d="M70 90 L70 40" />
        <circle cx="50" cy="55" r="8" strokeWidth="3" />
        <path d="M50 20 L50 10 M40 10 L60 10" />
    </svg>
);

export const RobberIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4">
        {/* Shattered / Chaos Icon */}
        <path d="M20 50 L40 20 L60 45 L80 15 L85 50" strokeLinejoin="round" />
        <path d="M20 50 Q50 90 85 50" />
        <path d="M35 45 L40 55" />
        <path d="M65 40 L60 55" />
        <path d="M50 30 L50 45" />
    </svg>
);

export const MastermindIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2">
        {/* Puppet Master Strings */}
        <path d="M50 10 L20 40" strokeDasharray="4 2" />
        <path d="M50 10 L80 40" strokeDasharray="4 2" />
        <path d="M50 10 L50 50" strokeDasharray="4 2" />
        <circle cx="50" cy="10" r="3" fill="currentColor" />
        {/* Crown / Eye */}
        <path d="M20 60 L35 85 L50 65 L65 85 L80 60 L50 40 Z" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="50" cy="65" r="4" fill="currentColor" />
    </svg>
);

export const NoiseOverlay = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
    />
);
