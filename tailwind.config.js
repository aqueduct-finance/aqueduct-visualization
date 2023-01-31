/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sfGreen': '#12BB33',
        'aqBlue': '#0160D1',
        'tokenA': '#F97315',
        'tokenB': '#EC4899',
        "aqueductBlue": "#0460CE",
        "warningYellow": "#FDB833",
        "darkBlue": "#0e2138",
        "blueBlack": "#0b1521",
        "blueBlack2": "#060d14",
        "daiYellow": "#F5AC37",
        "usdcBlue": '#2775CA',
        "ethBlue": '#00ABEE',
        "ethPink": '#E7018A'
      }
    },
  },
  plugins: [],
}
