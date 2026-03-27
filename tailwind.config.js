/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'never',
  theme: {
    extend: {
      colors: {
        'soft-pink': '#f8c8dc',
        'soft-white': '#fefefe',
        'soft-gray': '#4a4a4a',
        'rose': '#f8d0dc',
        'lavender': '#e8d5f0',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) rotate(360deg)', opacity: '0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
}
