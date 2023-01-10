/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#5865f2",
        "d-black": "#23272a",
        "d-green": "#2d7d46",
        "d-dark-black": "hsl(216, calc(1 * 7.2%), 13.5%);",
        dark: "hsl(220, calc(1 * 7.7%), 22.9%);",
        "d-input-bg": "hsl(218, calc(1 * 7.9%), 27.3%);",
        secondary: "hsl(223, 6.9%, 19.8%);",
        "secondary-alt": "hsl(220, calc(1 * 6.8%), 17.3%);",
        "d-white": "hsl(0, calc(1 * 0%), 100%);",
        "d-default": "hsl(223, calc(1 * 3.4%), 60.2%);",
        "d-icon-bg": "rgba(79,84,92, 0.6);",
        "d-icon-bg-hover": "rgba(79, 84, 92, 0.4);",
        "d-gray": "#b9bbbe",
        "d-blue": "#00aff4",
        "d-brand-hover": "hsl(235, calc(1 * 51.4%), 52.4%);",
      },
    },
  },
  plugins: [
    require("@headlessui/tailwindcss"),
    require("tailwind-scrollbar"),
    require("tailwind-scrollbar-hide"),
  ],
};
