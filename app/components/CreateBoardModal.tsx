"use client";

import { useState, useEffect, useRef } from "react";
import type { BoardColor } from "@/types/flowboard";
import { boardColors } from "@/lib/boardColors";

interface CreateBoardModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; description: string; emoji: string; color: BoardColor }) => void;
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

  const activeHex = COLORS.find((c) => c.value === color)!.hex;

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 80); }, [open]);

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
      className="fixed inset-0 z-[200] flex items-center justify-center p-4
        bg-ink/45 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-[480px] rounded-[20px] overflow-hidden flex flex-col
        bg-white shadow-modal animate-modal-in">

        {/* Colour strip — updates as colour changes */}
        <div className="h-1.5 transition-colors duration-300" style={{ background: activeHex }} />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-start justify-between border-b border-subtle">
          <div>
            <p className="text-[10.5px] uppercase tracking-widest font-medium transition-colors duration-300"
              style={{ color: activeHex }}>
              New board
            </p>
            <h2 className="font-display text-[19px] font-semibold tracking-tight text-ink mt-0.5">
              Create a board
            </h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center mt-0.5
              text-ink-muted hover:bg-paper-dark hover:text-ink transition-colors duration-150 text-lg"
            aria-label="Close">
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto max-h-[60vh]">

          {/* Board name */}
          <div>
            <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5 tracking-wide uppercase">
              Board name <span style={{ color: activeHex }}>*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              placeholder="e.g. Sprint Planning, Research…"
              className="w-full rounded-[10px] px-3.5 py-2.5 text-[14px] text-ink
                bg-paper border border-soft outline-none transition-all duration-150
                placeholder:text-ink-faint
                focus:bg-white focus:border-amber-fb focus:ring-2 focus:ring-amber-fb/10"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5 tracking-wide uppercase">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What is this board for?"
              rows={2}
              className="w-full rounded-[10px] px-3.5 py-2.5 text-[13.5px] text-ink
                bg-paper border border-soft outline-none transition-all duration-150
                resize-none leading-relaxed placeholder:text-ink-faint
                focus:bg-white focus:border-amber-fb focus:ring-2 focus:ring-amber-fb/10"
            />
          </div>

          {/* Colour picker */}
          <div>
            <label className="block text-[11.5px] font-semibold text-ink-soft mb-2 tracking-wide uppercase">
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
                    boxShadow: color === c.value ? `0 0 0 2px white, 0 0 0 4px ${c.hex}` : "none",
                  }}
                  aria-label={c.label}
                >
                  {color === c.value && (
                    <svg className="absolute inset-0 m-auto" width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Emoji picker */}
          <div>
            <label className="block text-[11.5px] font-semibold text-ink-soft mb-2 tracking-wide uppercase">
              Icon
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className="h-10 rounded-xl flex items-center justify-center text-xl
                    border-[1.5px] transition-all duration-150 bg-paper border-subtle
                    hover:bg-paper-dark"
                  style={
                    emoji === e
                      ? { background: `${activeHex}18`, borderColor: activeHex, transform: "scale(1.08)" }
                      : {}
                  }
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Live preview */}
          <div>
            <label className="block text-[11.5px] font-semibold text-ink-soft mb-2 tracking-wide uppercase">
              Preview
            </label>
            <div className="relative rounded-[14px] overflow-hidden border border-subtle">
              <div className="absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300"
                style={{ background: activeHex }} />
              <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
                style={{ background: `linear-gradient(180deg, ${activeHex}12 0%, transparent 100%)` }} />
              <div className="pl-5 pr-4 py-4 flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${activeHex}18` }}>
                  {emoji}
                </span>
                <div className="min-w-0">
                  <div className="font-display text-[14px] font-semibold text-ink truncate">
                    {name || <span className="text-ink-faint font-normal">Board name</span>}
                  </div>
                  <div className="text-[11.5px] text-ink-muted truncate mt-0.5">
                    {description || <span className="italic">No description</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between gap-3
          border-t border-subtle bg-paper-wash">
          <span className="text-[11.5px] text-ink-muted">
            {name.trim() ? `"${name.trim()}"` : "Enter a board name to continue"}
          </span>
          <div className="flex gap-2.5">
            <button onClick={onClose}
              className="px-4 py-2 rounded-[9px] text-[13px] text-ink-soft
                border border-soft hover:border-ink-muted transition-all duration-150">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="px-5 py-2 rounded-[9px] text-[13px] font-semibold text-white
                transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed
                hover:brightness-110"
              style={{ background: name.trim() ? activeHex : "#9c9188" }}
            >
              Create Board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}