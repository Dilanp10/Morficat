import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware tokens (varían con .dark en <html>)
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",

        // Identidad de marca (no varía con tema)
        terracota: {
          DEFAULT: "#E07B4C",
          deep: "#B85A30",
          soft: "#F4A882",
        },
        success: "#4CAF82",
        danger: "#E05252",
      },
      borderRadius: {
        card: "12px",
        button: "8px",
        pill: "20px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
      spacing: {
        bottom: "var(--bottom-nav-height, 64px)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "soft-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(76, 175, 130, 0.55)",
          },
          "50%": {
            boxShadow: "0 0 0 6px rgba(76, 175, 130, 0)",
          },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 350ms ease-out both",
        "soft-pulse": "soft-pulse 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
