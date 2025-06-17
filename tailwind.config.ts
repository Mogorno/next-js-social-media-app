import type { Config } from 'tailwindcss';
import { colorScheme } from './helpers/Theme';

const colors = colorScheme.tailwindColorScheme;
export default {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors,
        },
    },
    plugins: [],
} satisfies Config;
