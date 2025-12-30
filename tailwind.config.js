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
                background: '#0a0a0a', // Deepest charcoal
                surface: '#171717', // Rough metal
                banker: '#2563eb', // Security Blue (Cold, Authority)
                robber: '#dc2626', // Blood Red (Danger, Violence)
                gold: '#d97706', // Old Gold (Greed)
                'text-primary': '#e5e5e5', // Off-white
                'text-secondary': '#a3a3a3', // Battleship Grey
                'text-muted': '#525252',
            },
            fontFamily: {
                display: ['"Courier Prime"', 'monospace'], // Typewriter / Classified Dossier style
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
            },
            keyframes: {
                shake: {
                    '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
                    '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
                    '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
                    '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
                }
            }
        },
    },
    plugins: [],
};
