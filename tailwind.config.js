module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Add this line
  theme: {
    extend: {
      keyframes: {
        'pop-up': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        }
      },
      animation: {
        'pop-up': 'pop-up 0.3s ease-out forwards',
      },
      boxShadow: {
        'purple-glow': '0 0 15px 5px rgba(167, 139, 250, 0.3)',
      },
      borderWidth: {
        '3': '3px',
        '1.5': '1.5px',
      }
    },
  },
  variants: {
    extend: {
      animation: ['hover', 'focus'],
      boxShadow: ['hover', 'focus'],
    },
  },
  plugins: [],
}