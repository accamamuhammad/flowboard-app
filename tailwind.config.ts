import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Surfaces ──────────────────────────────────────────
        paper: {
          DEFAULT: "#f7f3ee",   // bg-paper
          dark:    "#ede8e0",   // bg-paper-dark
          darker:  "#e8e2d9",   // bg-paper-darker
          wash:    "#faf8f5",   // bg-paper-wash  (footer tints)
        },
        // ── Text ──────────────────────────────────────────────
        ink: {
          DEFAULT: "#1a1714",   // text-ink
          soft:    "#5a5148",   // text-ink-soft
          muted:   "#9c9188",   // text-ink-muted
          faint:   "#b5aea6",   // text-ink-faint  (placeholders)
          deep:    "#3d3730",   // text-ink-deep   (task labels)
        },
        // ── Board accent colours ───────────────────────────────
        amber: {
          fb:   "#c8862a",      // bg-amber-fb / text-amber-fb
          pale: "#fdf3e0",      // bg-amber-pale
        },
        green: {
          fb:   "#3a7d5c",
          pale: "#e6f4ed",
        },
        rose: {
          fb:   "#b94040",
          pale: "#fce8e8",
        },
        blue: {
          fb:   "#2d5f8a",
          pale: "#e4eef7",
        },
        purple: {
          fb:   "#7a5da8",
          pale: "#ede6f7",
        },
        // ── Sidebar (dark surface) ─────────────────────────────
        sidebar: {
          DEFAULT: "#1a1714",   // bg-sidebar
          border:  "rgba(255,255,255,0.08)",
          divider: "rgba(255,255,255,0.07)",
          text:    "rgba(247,243,238,0.55)",
          muted:   "rgba(247,243,238,0.35)",
          label:   "rgba(247,243,238,0.28)",
          board:   "rgba(247,243,238,0.45)",
          user:    "rgba(247,243,238,0.70)",
        },
      },

      // ── Border colours ────────────────────────────────────
      borderColor: {
        subtle:  "rgba(26,23,20,0.08)",   // border-subtle
        soft:    "rgba(26,23,20,0.10)",   // border-soft
        medium:  "rgba(26,23,20,0.12)",   // border-medium
      },

      // ── Fonts ─────────────────────────────────────────────
      fontFamily: {
        display: ["Lora", "Georgia", "serif"],
        body:    ["Karla", "sans-serif"],
      },

      // ── Shadows ───────────────────────────────────────────
      boxShadow: {
        card:       "0 2px 16px rgba(26,23,20,0.08), 0 1px 4px rgba(26,23,20,0.05)",
        "card-hover":"0 12px 36px rgba(26,23,20,0.13), 0 2px 8px rgba(26,23,20,0.07)",
        modal:      "0 32px 80px rgba(26,23,20,0.22), 0 4px 16px rgba(26,23,20,0.08)",
        pill:       "0 2px 8px rgba(26,23,20,0.15)",
      },

      // ── Animations ────────────────────────────────────────
      keyframes: {
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-14px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "card-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "modal-in": {
          from: { opacity: "0", transform: "scale(0.94) translateY(10px)" },
          to:   { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
      },
      animation: {
        "slide-in": "slide-in 0.35s ease both",
        rise:       "rise 0.4s ease both",
        "card-in":  "card-in 0.4s ease both",
        "modal-in": "modal-in 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
        "fade-in":  "fade-in 0.2s ease both",
      },
    },
  },
  plugins: [],
};

export default config;