export const boardColors = {
  amber:  { hex: "#c8862a", palehex: "#fdf3e0" },
  green:  { hex: "#3a7d5c", palehex: "#e6f4ed" },
  blue:   { hex: "#2d5f8a", palehex: "#e4eef7" },
  rose:   { hex: "#b94040", palehex: "#fce8e8" },
  purple: { hex: "#7a5da8", palehex: "#ede6f7" },
} as const;

export type BoardColor = keyof typeof boardColors;