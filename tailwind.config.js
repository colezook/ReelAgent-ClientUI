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
          '100%': { transform: 'scale(1.02)' }, // Reduced scale by 60%
        }
      },
      animation: {
        'pop-up': 'pop-up 0.1s ease-out forwards', // Faster animation (0.1s instead of 0.3s)
      },
      boxShadow: {
        'purple-glow': '0 0 15px 5px rgba(167, 139, 250, 0.3)',
      },
      borderWidth: {
        '3': '3px',
        '1.5': '1.5px',
      },
      scale: {
        '102': '1.02',
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