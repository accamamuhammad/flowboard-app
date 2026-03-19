"use client"

import { useTheme } from "next-themes"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-4 py-2 hover:bg-gray-700 rounded bg-gray-200 dark:bg-gray-800"
    >
      {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
    </button>
  )
}