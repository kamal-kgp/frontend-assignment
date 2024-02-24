/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'Logbox': '0px 20px 40px 0px rgba(0, 52, 102, 0.15)',
      },
    },
  },
  plugins: [], 
}

