"use client";

// src/components/CreateBoardModal.tsx

import { useState, useEffect, useRef } from "react";
import type { BoardColor } from "@/types/flowboard";
import { boardColors } from "@/lib/boardColors";

interface CreateBoardModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    description: string;
    emoji: string;
    color: BoardColor;
  }) => void;
}

const EMOJIS = ["📋", "🗺️", "🎨", "🚀", "💡", "⚡", "🐞", "📊", "🧪", "📌", "🏁", "🔧"];

const COLORS: { value: BoardColor; hex: string; label: string }[] = [
  { value: "amber",  hex: "#c8862a", label: "Amber"  },
  { value: "green",  hex: "#3a7d5c", label: "Green"  },
  { value: "blue",   hex: "#2d5f8a", label: "Blue"   },
  { value: "rose",   hex: "#b94040", label: "Rose"   },
  { value: "purple", hex: "#7a5da8", label: "Purple" },
];

export default function CreateBoardModal({ open, onClose, onCreate }: CreateBoardModalProps) {
  const [name, setName]        = useState("");
  const [description, setDesc] = useState("");
  const [emoji, setEmoji]      = useState("📋");
  const [color, setColor]      = useState<BoardColor>("amber");
  const inputRef               = useRef<HTMLInputElement>(null);

  const activeColor = COLORS.find((c) => c.value === color)!.hex;

  // Auto-focus on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function handleSubmit() {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), description: description.trim(), emoji, color });
    setName(""); setDesc(""); setEmoji("📋"); setColor("amber");
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(26,23,20,0.45)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[480px] rounded-[20px] overflow-hidden flex flex-col"
        style={{
          background: "white",
          boxShadow: "0 32px 80px rgba(26,23,20,0.22), 0 4px 16px rgba(26,23,20,0.08)",
          animation: "cbModalIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <style>{`
          @keyframes cbModalIn {
            from { opacity: 0; transform: scale(0.94) translateY(10px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* Coloured top strip — updates live as color changes */}
        <div
          className="h-1.5 transition-colors duration-300"
          style={{ background: activeColor }}
        />

        {/* ── Header ── */}
        <div
          className="px-6 pt-5 pb-4 flex items-start justify-between"
          style={{ borderBottom: "1px solid rgba(26,23,20,0.07)" }}
        >
          <div>
            <p
              className="text-[10.5px] uppercase tracking-widest font-medium transition-colors duration-300"
              style={{ color: activeColor }}
            >
              New board
            </p>
            <h2 className="font-display text-[19px] font-semibold tracking-tight text-[#1a1714] mt-0.5">
              Create a board
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center
              text-[#9c9188] hover:bg-[#f0ece6] hover:text-[#1a1714]
              transition-colors duration-150 text-lg mt-0.5"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto max-h-[60vh]">

          {/* Board name */}
          <div>
            <label className="block text-[11.5px] font-semibold text-[#5a5148] mb-1.5 tracking-wide uppercase">
              Board name <span style={{ color: activeColor }}>*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              placeholder="e.g. Sprint Planning, Research…"
              className="w-full rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1a1714]
                outline-none transition-all duration-150 placeholder:text-[#b5aea6]"
              style={{ background: "#f7f3ee", border: "1.5px solid rgba(26,23,20,0.1)" }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = activeColor;
                e.currentTarget.style.background = "white";
                e.currentTarget.style.boxShadow = `0 0 0 3px ${activeColor}18`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(26,23,20,0.1)";
                e.currentTarget.style.background = "#f7f3ee";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11.5px] font-semibold text-[#5a5148] mb-1.5 tracking-wide uppercase">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What is this board for?"
              rows={2}
              className="w-full rounded-[10px] px-3.5 py-2.5 text-[13.5px] text-[#1a1714]
                outline-none transition-all duration-150 resize-none leading-relaxed
                placeholder:text-[#b5aea6]"
              style={{ background: "#f7f3ee", border: "1.5px solid rgba(26,23,20,0.1)" }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = activeColor;
                e.currentTarget.style.background = "white";
                e.currentTarget.style.boxShadow = `0 0 0 3px ${activeColor}18`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(26,23,20,0.1)";
                e.currentTarget.style.background = "#f7f3ee";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-[11.5px] font-semibold text-[#5a5148] mb-2 tracking-wide uppercase">
              Color
            </label>
            <div className="flex gap-2.5">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  title={c.label}
                  className="relative w-8 h-8 rounded-full transition-all duration-200"
                  style={{
                    background: c.hex,
                    transform: color === c.value ? "scale(1.2)" : "scale(1)",
                    boxShadow: color === c.value
                      ? `0 0 0 2px white, 0 0 0 4px ${c.hex}`
                      : "none",
                  }}
                  aria-label={c.label}
                >
                  {color === c.value && (
                    <svg
                      className="absolute inset-0 m-auto"
                      width="12" height="10" viewBox="0 0 12 10" fill="none"
                    >
                      <path
                        d="M1 5L4.5 8.5L11 1"
                        stroke="white" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Emoji / icon picker */}
          <div>
            <label className="block text-[11.5px] font-semibold text-[#5a5148] mb-2 tracking-wide uppercase">
              Icon
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className="h-10 rounded-xl flex items-center justify-center text-xl
                    border-[1.5px] transition-all duration-150"
                  style={
                    emoji === e
                      ? {
                          background: `${activeColor}18`,
                          borderColor: activeColor,
                          transform: "scale(1.08)",
                        }
                      : {
                          background: "#f7f3ee",
                          borderColor: "rgba(26,23,20,0.08)",
                        }
                  }
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Live preview */}
          <div>
            <label className="block text-[11.5px] font-semibold text-[#5a5148] mb-2 tracking-wide uppercase">
              Preview
            </label>
            <div
              className="relative rounded-[14px] overflow-hidden border"
              style={{ borderColor: "rgba(26,23,20,0.08)" }}
            >
              {/* Left accent */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300"
                style={{ background: activeColor }}
              />
              {/* Color wash */}
              <div
                className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
                style={{ background: `linear-gradient(180deg, ${activeColor}12 0%, transparent 100%)` }}
              />
              <div className="pl-5 pr-4 py-4 flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${activeColor}18` }}
                >
                  {emoji}
                </span>
                <div className="min-w-0">
                  <div className="font-display text-[14px] font-semibold text-[#1a1714] truncate">
                    {name || <span className="text-[#b5aea6] font-normal">Board name</span>}
                  </div>
                  <div className="text-[11.5px] text-[#9c9188] truncate mt-0.5">
                    {description || <span className="italic">No description</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div
          className="px-6 py-4 flex items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(26,23,20,0.07)", background: "#faf8f5" }}
        >
          <span className="text-[11.5px] text-[#9c9188]">
            {name.trim() ? `"${name.trim()}"` : "Enter a board name to continue"}
          </span>

          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-[9px] text-[13px] text-[#5a5148]
                border-[1.5px] transition-all duration-150"
              style={{ borderColor: "rgba(26,23,20,0.1)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#9c9188")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(26,23,20,0.1)")}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="px-5 py-2 rounded-[9px] text-[13px] font-semibold text-white
                transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: name.trim() ? activeColor : "#9c9188" }}
              onMouseEnter={(e) => {
                if (name.trim()) e.currentTarget.style.filter = "brightness(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "none";
              }}
            >
              Create Board
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}