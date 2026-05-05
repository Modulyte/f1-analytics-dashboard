/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#08090d',
        surface: '#0f1117',
        card: '#161922',
        border: '#242836',
        accent: '#00c9a7',
        'accent-2': '#6366f1',
        'accent-3': '#f59e0b',
        'accent-danger': '#ef4444',
        'text-primary': '#f0f2f8',
        'text-secondary': '#7c8299',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
