"use client";

// src/components/AddTaskModal.tsx
// Modal for adding a new task to a specific board.
//
// Props:
//   open        — visibility
//   boardName   — name of the board this task belongs to
//   boardColor  — hex accent color for the board
//   onClose     — dismiss handler
//   onAdd       — called with the new TaskItem on submit

import { useState, useEffect, useRef } from "react";
import type { TaskItem } from "@/types/flowboard";

interface AddTaskModalProps {
  open: boolean;
  boardName: string;
  boardColor: string;
  onClose: () => void;
  onAdd: (task: TaskItem) => void;
}

const PRIORITIES = [
  { value: "none",   label: "None",   color: "#cdc6bc" },
  { value: "low",    label: "Low",    color: "#3a7d5c" },
  { value: "medium", label: "Medium", color: "#c8862a" },
  { value: "high",   label: "High",   color: "#b94040" },
] as const;

type Priority = (typeof PRIORITIES)[number]["value"];

interface Subtask {
  id: string;
  label: string;
}

export default function AddTaskModal({
  open,
  boardName,
  boardColor,
  onClose,
  onAdd,
}: AddTaskModalProps) {
  const [label, setLabel]           = useState("");
  const [notes, setNotes]           = useState("");
  const [priority, setPriority]     = useState<Priority>("none");
  const [subtasks, setSubtasks]     = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus name input when opening
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function addSubtask() {
    const trimmed = newSubtask.trim();
    if (!trimmed) return;
    setSubtasks((prev) => [...prev, { id: crypto.randomUUID(), label: trimmed }]);
    setNewSubtask("");
  }

  function removeSubtask(id: string) {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  }

  function handleSubmit() {
    if (!label.trim()) return;
    const task: TaskItem = {
      id: crypto.randomUUID(),
      label: label.trim(),
      done: false,
      subtaskCount: subtasks.length,
      subtaskDone: 0,
    };
    onAdd(task);
    // reset
    setLabel(""); setNotes(""); setPriority("none"); setSubtasks([]); setNewSubtask("");
    onClose();
  }

  if (!open) return null;

  const selectedPriority = PRIORITIES.find((p) => p.value === priority)!;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(26,23,20,0.45)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[480px] rounded-[20px] overflow-hidden flex flex-col"
        style={{
          background: "white",
          boxShadow: "0 32px 80px rgba(26,23,20,0.22), 0 4px 16px rgba(26,23,20,0.08)",
          animation: "taskModalIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <style>{`
          @keyframes taskModalIn {
            from { opacity: 0; transform: scale(0.94) translateY(10px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* ── Coloured header strip ── */}
        <div className="h-1.5" style={{ background: boardColor }} />

        {/* ── Header ── */}
        <div className="px-6 pt-5 pb-4 flex items-start justify-between"
          style={{ borderBottom: "1px solid rgba(26,23,20,0.07)" }}>
          <div>
            <p className="text-[10.5px] uppercase tracking-widest font-medium"
              style={{ color: boardColor }}>
              {boardName}
            </p>
            <h2 className="font-display text-[19px] font-semibold tracking-tight text-[#1a1714] mt-0.5">
              Add a task
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
        <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">

          {/* Task name */}
          <div>
            <label className="block text-[11.5px] font-semibold text-[#5a5148] mb-1.5 tracking-wide uppercase">
              Task name <span style={{ color: boardColor }}>*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              placeholder="What needs to be done?"
              className="w-full rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1a1714]
                outline-none transition-all duration-150 placeholder:text-[#b5aea6]"
              style={{
                background: "#f7f3ee",
                border: "1.5px solid rgba(26,23,20,0.1)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = boardColor;
                e.currentTarget.style.background = "white";
                e.currentTarget.style.boxShadow = `0 0 0 3px ${boardColor}18`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(26,23,20,0.1)";
                e.currentTarget.style.background = "#f7f3ee";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11.5px] font-semibold text-[#5a5148] mb-1.5 tracking-wide uppercase">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details…"
              rows={2}
              className="w-full rounded-[10px] px-3.5 py-2.5 text-[13.5px] text-[#1a1714]
                outline-none transition-all duration-150 resize-none leading-relaxed
                placeholder:text-[#b5aea6]"
              style={{
                background: "#f7f3ee",
                border: "1.5px solid rgba(26,23,20,0.1)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = boardColor;
                e.currentTarget.style.background = "white";
                e.currentTarget.style.boxShadow = `0 0 0 3px ${boardColor}18`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(26,23,20,0.1)";
                e.currentTarget.style.background = "#f7f3ee";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[11.5px] font-semibold text-[#5a5148] mb-1.5 tracking-wide uppercase">
              Priority
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12.5px]
                    font-medium transition-all duration-150 border-[1.5px]"
                  style={
                    priority === p.value
                      ? {
                          background: `${p.color}18`,
                          borderColor: p.color,
                          color: p.color,
                        }
                      : {
                          background: "transparent",
                          borderColor: "rgba(26,23,20,0.1)",
                          color: "#9c9188",
                        }
                  }
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: p.color }}
                  />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <label className="block text-[11.5px] font-semibold text-[#5a5148] mb-1.5 tracking-wide uppercase">
              Subtasks
            </label>

            {/* Existing subtasks */}
            {subtasks.length > 0 && (
              <div className="mb-2 space-y-1">
                {subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-[8px] group/sub"
                    style={{ background: "#f7f3ee" }}
                  >
                    <span
                      className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                      style={{ background: boardColor }}
                    />
                    <span className="text-[12.5px] text-[#3d3730] flex-1">{sub.label}</span>
                    <button
                      onClick={() => removeSubtask(sub.id)}
                      className="text-[#9c9188] hover:text-[#b94040] text-base
                        opacity-0 group-hover/sub:opacity-100 transition-all duration-150"
                      aria-label="Remove subtask"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add subtask input */}
            <div
              className="flex items-center gap-2 rounded-[10px] px-3 py-2"
              style={{ background: "#f7f3ee", border: "1.5px dashed rgba(26,23,20,0.12)" }}
            >
              <span className="text-[#9c9188] text-sm">+</span>
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSubtask(); } }}
                placeholder="Add a subtask… (press Enter)"
                className="bg-transparent border-none outline-none text-[13px]
                  text-[#1a1714] w-full placeholder:text-[#b5aea6]"
              />
              {newSubtask.trim() && (
                <button
                  onClick={addSubtask}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors"
                  style={{ background: `${boardColor}20`, color: boardColor }}
                >
                  Add
                </button>
              )}
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div
          className="px-6 py-4 flex items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(26,23,20,0.07)", background: "#faf8f5" }}
        >
          <span className="text-[11.5px] text-[#9c9188]">
            {subtasks.length > 0 && `${subtasks.length} subtask${subtasks.length !== 1 ? "s" : ""}`}
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
              disabled={!label.trim()}
              className="px-5 py-2 rounded-[9px] text-[13px] font-semibold text-white
                transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: label.trim() ? boardColor : "#9c9188" }}
              onMouseEnter={(e) => {
                if (label.trim()) e.currentTarget.style.filter = "brightness(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "none";
              }}
            >
              Add Task
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}