/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f3f8',
          100: '#b8d9e8',
          200: '#8abfd8',
          300: '#5ca5c8',
          400: '#2e8bb8',
          500: '#0071a8',
          600: '#005a86',
          700: '#00425f',
          800: '#002a3d',
          900: '#00131c',
        },
        success: {
          50: '#f6ffed',
          100: '#d9f7be',
          500: '#52c41a',
          600: '#389e0d',
        },
        warning: {
          50: '#fffbe6',
          100: '#fff1b8',
          500: '#faad14',
          600: '#d48806',
        },
        error: {
          50: '#fff2f0',
          100: '#ffccc7',
          500: '#ff4d4f',
          600: '#cf1322',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
