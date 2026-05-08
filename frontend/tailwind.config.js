/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nuit: '#111827',
        verre: 'rgba(255,255,255,0.12)'
      },
      boxShadow: {
        glow: '0 0 35px rgba(99,102,241,.35)',
        glass: '0 18px 60px rgba(0,0,0,.28)'
      },
      backdropBlur: {
        glass: '20px'
      },
      animation: {
        fond: 'fond 14s ease-in-out infinite alternate',
        pulseVerre: 'pulseVerre 1.4s ease-in-out infinite'
      },
      keyframes: {
        fond: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' }
        },
        pulseVerre: {
          '0%,100%': { opacity: '.45', transform: 'scale(.98)' },
          '50%': { opacity: '1', transform: 'scale(1)' }
        }
      }
    }
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities({
        '.bg-glass': {
          background: 'rgba(255,255,255,.12)',
          border: '1px solid rgba(255,255,255,.2)',
          backdropFilter: 'blur(20px)'
        },
        '.bouton-glass': {
          background: 'rgba(99,102,241,.42)',
          border: '1px solid rgba(255,255,255,.22)',
          boxShadow: '0 0 24px rgba(99,102,241,.28)'
        }
      });
    }
  ]
};
