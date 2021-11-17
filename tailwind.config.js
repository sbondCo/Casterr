module.exports = {
  purge: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: {
        100: "#2d2b37"
      },
      secondary: {
        100: "#272530"
      },
      tertiary: {
        100: "#333440"
      },
      quaternary: {
        100: "#1e1e25"
      },
      white: {
        100: "#e1e1e1",
        50: "#4f545c"
      },
      red: {
        100: "#c10000"
      }
    },
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
};
