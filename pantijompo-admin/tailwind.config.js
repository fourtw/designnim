/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        accent: '#10B981',
        dark: '#0F172A',
      },
      boxShadow: {
        card: '0 20px 45px -15px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
}

