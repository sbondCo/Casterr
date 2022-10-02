module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
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
        100: "#1e1e25",
        200: "#19181f" // old darkAccentColor
      },
      white: {
        100: "#e1e1e1",
        50: "#e1e1e15A",
        25: "#e1e1e13C"
      },
      red: {
        100: "#c10000"
      },
      transparent: "rgba(0, 0, 0, 0)"
    },
    extend: {}
  }
};
