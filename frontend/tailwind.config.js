/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#5865f2",
        "d-black": "#23272a",
        "d-input-black":
          "hsl(216, calc(var(--saturation-factor, 1) * 7.2%), 13.5%);",
        dark: "hsl(220, calc(var(--saturation-factor, 1) * 7.7%), 22.9%);",
        "d-gray": "#b9bbbe",
        "d-blue": "#00aff4",
        "d-brand-hover":
          "hsl(235, calc(var(--saturation-factor, 1) * 51.4%), 52.4%);",
      },
    },
  },
  plugins: [],
};
