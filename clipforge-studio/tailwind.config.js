/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#16171A',
        panel: '#0C0D0F',
        raise: '#1E2024',
        line: '#2A2C31',
        ink: '#ECE9E2',
        mute: '#8D8F94',
        amber: { DEFAULT: '#F0B23E', dim: '#3A2D12' },
        danger: '#E5675A',
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
