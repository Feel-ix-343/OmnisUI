/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        "primary": "#3A3A3A",
        "secondary": "#B7B7B7",
        "highlight": "#84EEBC",
        "background-primary": "#FFFFFF",
        "background-secondary": "#F2F6F4"
      },
      fontFamily: {
        sans: [ "Montserrat" ]
      }
    }
  },
  plugins: [],
}
