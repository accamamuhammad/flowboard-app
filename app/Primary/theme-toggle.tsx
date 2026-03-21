"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="inline-flex w-[80%] items-center justify-evenly gap-3 px-5 py-3.5 rounded-2xl bg-lighthouse">
      {/* Sun icon */}
      <Sun
        size={20}
        className={`transition-colors duration-300 ${
          !isDark ? "text-[#476e66]" : "text-slate-400"
        }`}
      />

      {/* Toggle pill */}
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label="Toggle theme"
        className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#476e66] focus-visible:ring-offset-2`}
        style={{ backgroundColor: "#476e66" }}
      >
        {/* Knob */}
        <span
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            isDark ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>

      {/* Moon icon */}
      <Moon
        size={20}
        className={`transition-colors duration-300 ${
          isDark ? "text-[#476e66]" : "text-slate-400"
        }`}
      />
    </div>
  )
}