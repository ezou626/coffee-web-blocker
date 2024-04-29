/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,tsx,ts}'],
  theme: {
    colors: {
      cream: '#ece0d1',
      tan: '#dbc1ac',
      toast: '#967259',
      brown: '#634832',
      espresso: '#38220f'
    },
    extend: {
      
    },
  },
  plugins: [require("daisyui")],
}

