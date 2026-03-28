// src/lib/boardColors.ts
// Uses raw hex values for dynamic colors (avoids Tailwind purging dynamic class names).
// Pass these as style={{ background: colors.hex }} or style={{ color: colors.hex }}

import type { BoardColor } from "@/types/flowboard";

interface ColorSet {
  hex: string;       // raw hex — use with style={{ background/color }}
  palehex: string;   // pale variant hex
}

export const boardColors: Record<BoardColor, ColorSet> = {
  amber:  { hex: "#c8862a", palehex: "#fdf3e0" },
  green:  { hex: "#3a7d5c", palehex: "#e6f4ed" },
  blue:   { hex: "#2d5f8a", palehex: "#e4eef7" },
  rose:   { hex: "#b94040", palehex: "#fce8e8" },
  purple: { hex: "#7a5da8", palehex: "#ede6f7" },
};