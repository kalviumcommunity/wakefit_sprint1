import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wakefit: {
          blue: '#2563EB',
          'blue-hover': '#1D4ED8',
          'blue-light': '#EFF6FF',
          'blue-border': '#BFDBFE',
          dark: '#0F172A',
          'dark-card': '#1E293B',
          gray: '#F8FAFC',
          'gray-dark': '#334155',
        },
      },
    },
  },
  plugins: [],
};
export default config;
