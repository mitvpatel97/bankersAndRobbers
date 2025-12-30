/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Midnight LA - 80s Noir Palette
                background: '#0d0221', // Deep midnight purple
                surface: '#1a0a2e', // Dark violet
                'surface-light': '#261447', // Lighter violet

                // Neon Accents
                banker: '#05d9e8', // Electric Cyan (Cold, Tech, Security)
                robber: '#ff2a6d', // Hot Pink/Magenta (Danger, Passion)
                gold: '#ff9d00', // Neon Orange/Gold (Sunset, Greed)
                neon: {
                    pink: '#ff2a6d',
                    cyan: '#05d9e8',
                    orange: '#ff9d00',
                    purple: '#d01257',
                    blue: '#005678',
                },

                // Text
                'text-primary': '#f0e6ff', // Soft lavender white
                'text-secondary': '#9d8cba', // Muted purple
                'text-muted': '#5c4a72',

                // Atmosphere
                midnight: '#0d0221',
                'midnight-blue': '#1a1a3e',
                sunset: '#ff6b35',
            },
            fontFamily: {
                display: ['"Orbitron"', '"Courier Prime"', 'monospace'], // 80s Futuristic
                sans: ['Inter', 'sans-serif'],
                mono: ['"Share Tech Mono"', 'monospace'], // VHS/Terminal style
            },
            animation: {
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
                'flicker': 'flicker 3s linear infinite',
                'scanline': 'scanline 8s linear infinite',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'vhs-glitch': 'vhs-glitch 0.5s infinite',
                'float': 'float 6s ease-in-out infinite',
                'neon-flicker': 'neon-flicker 1.5s infinite alternate',
            },
            keyframes: {
                shake: {
                    '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
                    '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
                    '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
                    '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
                },
                flicker: {
                    '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '0.99' },
                    '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.4' },
                },
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
                'glow-pulse': {
                    '0%, 100%': { boxShadow: '0 0 20px currentColor, 0 0 40px currentColor' },
                    '50%': { boxShadow: '0 0 40px currentColor, 0 0 80px currentColor' },
                },
                'vhs-glitch': {
                    '0%': { transform: 'translate(0)' },
                    '20%': { transform: 'translate(-2px, 2px)' },
                    '40%': { transform: 'translate(-2px, -2px)' },
                    '60%': { transform: 'translate(2px, 2px)' },
                    '80%': { transform: 'translate(2px, -2px)' },
                    '100%': { transform: 'translate(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'neon-flicker': {
                    '0%, 18%, 22%, 25%, 53%, 57%, 100%': {
                        textShadow: '0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px currentColor, 0 0 80px currentColor',
                        opacity: '1'
                    },
                    '20%, 24%, 55%': {
                        textShadow: 'none',
                        opacity: '0.8'
                    },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'grid-lines': 'linear-gradient(rgba(5, 217, 232, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(5, 217, 232, 0.03) 1px, transparent 1px)',
            },
            boxShadow: {
                'neon-cyan': '0 0 5px #05d9e8, 0 0 20px #05d9e8, 0 0 40px #05d9e8',
                'neon-pink': '0 0 5px #ff2a6d, 0 0 20px #ff2a6d, 0 0 40px #ff2a6d',
                'neon-orange': '0 0 5px #ff9d00, 0 0 20px #ff9d00, 0 0 40px #ff9d00',
            },
        },
    },
    plugins: [],
};
