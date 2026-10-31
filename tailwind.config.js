/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF7F2",
        sakura: "#F4DDE5",
        rose: "#D9A6B8",
        petal: "#C58FA3",
        sage: "#A8B99C",
        ink: "#66545B",
        muted: "#987D88",
        white: "#FFFFFF",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(102, 84, 91, 0.18)",
      },
      keyframes: {
        "petal-fall": {
          "0%": { transform: "translateY(-12px) translateX(0) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "0.85" },
          "100%": { transform: "translateY(105vh) translateX(var(--drift, 20px)) rotate(340deg)", opacity: "0" },
        },
        "float-soft": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        "petal-fall": "petal-fall 14s linear infinite",
        "float-soft": "float-soft 7s ease-in-out infinite",
        "fade-up": "fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
