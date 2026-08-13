module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: { sans: ["Nunito Sans", "sans-serif"] },
      colors: { rose: { 50: "#fff1f2", 500: "#f43f5e", 600: "#e11d48" } },
    },
  },
  variants: { extend: { visibility: ["group-hover"] } },
  plugins: [],
};
