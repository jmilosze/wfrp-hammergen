/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        hammergen: ["hammergen", "serif"],
      },
      width: {
        192: "48rem",
      },
    },
  },
  plugins: [],
};
