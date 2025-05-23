/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,tsx,ts}'],
  theme: {
    // colors: {
    //   cream: '#ece0d1',
    //   tan: '#dbc1ac',
    //   toast: '#967259',
    //   brown: '#634832',
    //   espresso: '#38220f'
    // },
    extend: {
      colors: {
        pink: '#ef9995',
        mocha: '#ccb5a6',
        biege: '#ebe2ca',
        darkbrown: '#976c58',
        espresso: '#38220f'
      },
    },
  },
  plugins: [require("daisyui")],

  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#976c58",
          "secondary": "#ebe2ca",
          "accent": "#967259",
          "neutral": "#3d4451",
          "base-100": "#ece3ca",
          "base-200": "#d1c4a7",
          "base-300": "#b6a58a",
          "base-400": "#9b866d",
          "base-500": "#806752",
          "base-600": "#654e37",
          "base-700": "#4a351c",
        },
      },
        "coffee"], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "myTheme", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
}

