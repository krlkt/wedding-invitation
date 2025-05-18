import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            fontFamily: {
                cursive: ['Alex Brush', 'cursive'],
                cursive2: ['Tangerine', 'Alex Brush', 'cursive'],
                cursive3: ['Rouge Script', 'Tangerine', 'Alex Brush', 'cursive'],
                serif: ['Cormorant Garamond', 'serif'],
                cursive_nautigal: ['The Nautigal', 'cursive'],
                newYorker: ['NewYorkerFont', 'sans-serif'],
            },
            colors: {
                primary: {
                    main: 'var(--background-primary)',
                    600: '#414b72',
                    700: '#2e3651',
                },
                secondary: {
                    main: 'var(--secondary-main)',
                    light: '#ffeace',
                },
                background: {
                    primary: 'var(--background-primary)',
                },
            },
        },
    },
    plugins: [],
};
export default config;
