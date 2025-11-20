/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9',
          600: '#0ba7e0',
          700: '#0a8ec0',
        },
        accent: {
          DEFAULT: '#7c3aed',
        },
      },
      borderRadius: {
        xl: '1rem',
      },
      boxShadow: {
        'lg-soft': '0 10px 30px rgba(14,165,233,0.12)',
      },
    },
  },
  plugins: [],
};
