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
        terracota: {
          DEFAULT: "#E07B4C",
          deep: "#B85A30",
          soft: "#F4A882",
        },
        bg: {
          base: "#1A1A1A",
          elevated: "#242424",
          tertiary: "#2E2E2E",
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
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
