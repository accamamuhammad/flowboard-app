/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heaven: "var(--heaven)",
        lighthouse: "var(--lighthouse)",
        wind: "var(--wind)",
        asphalt: "var(--asphalt)",
        moor: "var(--moor)",
        newt: "var(--newt)",
      },
    },
  },
  plugins: [],
};