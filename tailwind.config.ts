// tailwind.config.ts
// Add these colors + font families to your existing Tailwind config.
// Merge the `theme.extend` block into your project's tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Flowboard design tokens ──────────────────────────────
      colors: {
        paper: {
          DEFAULT: "#f7f3ee",
          dark: "#ede8e0",
        },
        ink: {
          DEFAULT: "#1a1714",
          soft: "#5a5148",
          muted: "#9c9188",
        },
        amber: {
          fb: "#c8862a",        // use as text-amber-fb / bg-amber-fb
          pale: "#fdf3e0",
        },
        green: {
          fb: "#3a7d5c",
          pale: "#e6f4ed",
        },
        rose: {
          fb: "#b94040",
          pale: "#fce8e8",
        },
        blue: {
          fb: "#2d5f8a",
          pale: "#e4eef7",
        },
        purple: {
          fb: "#7a5da8",
          pale: "#ede6f7",
        },
      },

      fontFamily: {
        // Add to <head>:
        // <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Karla:wght@400;500;600&display=swap" rel="stylesheet">
        display: ["Lora", "Georgia", "serif"],
        body: ["Karla", "sans-serif"],
      },

      boxShadow: {
        card: "0 2px 12px rgba(26,23,20,0.10), 0 1px 3px rgba(26,23,20,0.06)",
        "card-hover": "0 8px 28px rgba(26,23,20,0.14), 0 2px 6px rgba(26,23,20,0.08)",
        modal: "0 24px 60px rgba(26,23,20,0.22)",
      },

      keyframes: {
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-14px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "rise": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "card-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "modal-in": {
          from: { opacity: "0", transform: "scale(0.96) translateY(8px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },

      animation: {
        "slide-in": "slide-in 0.35s ease both",
        "rise": "rise 0.4s ease both",
        "card-in": "card-in 0.4s ease both",
        "modal-in": "modal-in 0.22s ease both",
        "fade-in": "fade-in 0.2s ease both",
      },
    },
  },
  plugins: [],
};

export default config;