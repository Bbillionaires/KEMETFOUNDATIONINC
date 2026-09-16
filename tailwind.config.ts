import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kemet: {
          black: "#0a0a0a",
          charcoal: "#161513",
          green: {
            DEFAULT: "#0b3d2e",
            deep: "#082a20",
            light: "#14513c",
          },
          red: {
            DEFAULT: "#a11d1d",
            deep: "#7a1414",
            bright: "#c22626",
          },
          gold: {
            DEFAULT: "#c9a13b",
            light: "#e3c877",
            deep: "#9c7a26",
            foil: "#f0d78c",
          },
          white: "#fdfcf9",
          ivory: "#f7f4ec",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #9c7a26 0%, #e3c877 45%, #c9a13b 100%)",
        "kemet-radial": "radial-gradient(circle at 50% 0%, rgba(201,161,59,0.12), transparent 60%)",
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(201,161,59,0.35), 0 8px 30px -8px rgba(201,161,59,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
