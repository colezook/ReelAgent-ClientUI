module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        orange: {
          600: '#EA580C',
          700: '#C2410C',
        },
        blue: {
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        green: {
          500: '#10B981',
          600: '#059669',
        },
        gray: {
          800: '#1F2937',
          900: '#111827',
        },
      },
      keyframes: {
        'pop-up': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'pop-up': 'pop-up 0.1s ease-out forwards',
        'fadeIn': 'fadeIn 0.3s ease-out',
        'scaleIn': 'scaleIn 0.3s ease-out',
      },
      boxShadow: {
        'blue-glow': '0 0 15px 5px rgba(96, 165, 250, 0.3)',
      },
      borderWidth: {
        '3': '3px',
        '1.5': '1.5px',
      },
      scale: {
        '102': '1.02',
      },
      maxWidth: {
        '4xl': '56rem', // Adjusted to better fit the popup
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