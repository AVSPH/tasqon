import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        display: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#ecfdf9",
          100: "#d1faef",
          200: "#a7f3df",
          300: "#6ee7cf",
          400: "#34d3bf",
          500: "#14b8a6",
          600: "#0f9c95",
          700: "#0c7f78",
          800: "#0c625f",
          900: "#0d4b49",
        },
        surface: {
          50: "#f7faf9",
          100: "#eef4f2",
          200: "#dde7e3",
          300: "#c9d6d1",
          400: "#9fb1ab",
          500: "#768a83",
          600: "#5b6d68",
          700: "#445350",
          800: "#2f3a38",
          900: "#1d2624",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.06), 0 6px 16px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 8px 24px rgba(15, 23, 42, 0.12)",
        modal: "0 30px 80px rgba(15, 23, 42, 0.2)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      animation: {
        "slide-in": "slideIn 0.2s ease-out",
        "fade-in": "fadeIn 0.15s ease-out",
        "scale-in": "scaleIn 0.15s ease-out",
        "fade-up": "fadeUp 0.35s ease-out",
      },
      keyframes: {
        slideIn: {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { transform: "scale(0.96)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        fadeUp: {
          from: { transform: "translateY(8px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
