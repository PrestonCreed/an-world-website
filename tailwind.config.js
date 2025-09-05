/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Suisse Intl", "system-ui", "sans-serif"] },
      colors: {
        an: {
          bg: "#000000",
          fg: "#FFFFFF",
          red: "#FF0000",
          blue: { light: "#0f7edd", mid: "#073991", dark: "#021647" }
        }
      },
      boxShadow: { mist: "0 0 80px 0 rgba(15,126,221,0.25)" },
      maxWidth: { 'screen-2xl': '1440px' }
    }
  },
  plugins: [],
};
