import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',    // App directory in Next.js
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Components folder
    './src/**/*.{js,ts,jsx,tsx,mdx}',   // Src folder (including subdirectories)
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
};

export default config;
