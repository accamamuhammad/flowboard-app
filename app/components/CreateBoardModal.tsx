"use client";

// src/components/CreateBoardModal.tsx
// Create OR edit a board (pass `board` prop to edit).

import { useState, useEffect, useRef, useTransition } from "react";
import { X } from "lucide-react";
import { createBoard, updateBoard } from "@/actions/boards";
import type { Board } from "@/types/flowboard";

interface CreateBoardModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (board: Board) => void;
  board?: Board | null;   // if set → edit mode
}

export default function CreateBoardModal({ open, onClose, onSaved, board }: CreateBoardModalProps) {
  const [name, setName]       = useState("");
  const [error, setError]     = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const isEdit   = !!board;

  // Populate when editing
  useEffect(() => {
    if (open) {
      setName(board?.name ?? "");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open, board]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function handleSubmit() {
    if (!name.trim()) { setError("Board name is required."); return; }

    startTransition(async () => {
      try {
        const saved = isEdit
          ? await updateBoard(board!.id, name.trim())
          : await createBoard(name.trim());
        onSaved(saved as unknown as Board);
        onClose();
      } catch (e) {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ink/45 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-[440px] rounded-[20px] overflow-hidden flex flex-col bg-white shadow-modal animate-modal-in">

        {/* Colour strip */}
        <div className="h-1.5 bg-amber-fb" />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-start justify-between border-b border-subtle">
          <div>
            <p className="text-[10.5px] uppercase tracking-widest font-medium text-amber-fb">
              {isEdit ? "Edit board" : "New board"}
            </p>
            <h2 className="font-display text-[19px] font-semibold tracking-tight text-ink mt-0.5">
              {isEdit ? "Rename board" : "Create a board"}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 text-ink-muted hover:bg-paper-dark hover:text-ink transition-colors duration-150" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5 tracking-wide uppercase">
            Board name <span className="text-amber-fb">*</span>
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            placeholder="e.g. Sprint Planning, Research…"
            className="w-full rounded-[10px] px-3.5 py-2.5 text-[14px] text-ink bg-paper border border-soft outline-none transition-all duration-150 placeholder:text-ink-faint focus:bg-white focus:border-amber-fb focus:ring-2 focus:ring-amber-fb/10"
          />
          {error && <p className="text-[12px] text-rose-fb mt-2">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-2.5 border-t border-subtle bg-paper-wash">
          <button onClick={onClose} className="px-4 py-2 rounded-[9px] text-[13px] text-ink-soft border border-soft hover:border-ink-muted transition-all duration-150">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || !name.trim()}
            className="px-5 py-2 rounded-[9px] text-[13px] font-semibold text-white bg-amber-500 hover:bg-amber-fb hover:text-ink transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving…" : isEdit ? "Save changes" : "Create Board"}
          </button>
        </div>

      </div>
    </div>
  );
}