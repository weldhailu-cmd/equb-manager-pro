/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        amharic: ["'Noto Sans Ethiopic'", "sans-serif"],
      },
      colors: {
        // "Habesha coffee ceremony" palette: deep roast browns, clay, warm
        // brass gold — deliberately avoiding both the cream+terracotta AI
        // default and the literal flag-color cliché.
        roast: {
          950: "#1C1410",
          900: "#2A1F17",
          800: "#3D2D20",
          700: "#54402D",
        },
        clay: {
          500: "#B5652D",
          600: "#9A5323",
        },
        brass: {
          400: "#D3A44A",
          500: "#C4922F",
        },
        parchment: "#F1E9DC",
        sage: "#5C7A5E",
      },
    },
  },
  plugins: [],
};
