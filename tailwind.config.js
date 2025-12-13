import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          primary: '#3B82F6',
          dark: '#1E3A8A',
          accent: '#0EA5E9',
        },
        success: '#10B981',
        muted: '#F3F4F6',
      },
      boxShadow: {
        glow: '0 10px 40px rgba(59, 130, 246, 0.2)',
      },
    },
  },
  plugins: [],
}

