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
          50: '#e6f4ff',
          100: '#bae0ff',
          200: '#91caff',
          300: '#69b1ff',
          400: '#4096ff',
          500: '#1890ff',
          600: '#0958d9',
          700: '#003eb3',
          800: '#002c8c',
          900: '#001d66',
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
