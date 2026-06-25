/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14211f",
        leaf: "#0f766e",
        mint: "#dff7ef",
        ember: "#f97316",
        saffron: "#f5b642",
        paper: "#f8faf7"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(20, 33, 31, 0.10)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
