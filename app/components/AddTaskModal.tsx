"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { X, Plus } from "lucide-react";
import { createTask, updateTask, createSubtask, toggleSubtask, deleteSubtask } from "@/actions/tasks";
import type { Task, Subtask, TaskStatus } from "@/types/flowboard";
import { TASK_STATUSES } from "@/types/flowboard";

interface AddTaskModalProps {
  open: boolean;
  boardId: string;
  boardName: string;
  boardColor: string;
  onClose: () => void;
  onSaved: (task: Task) => void;
  task?: Task | null;
}

export default function AddTaskModal({ open, boardId, boardName, boardColor, onClose, onSaved, task }: AddTaskModalProps) {
  // Initialise directly from props — the modal gets a new `key` each time
  // it opens (see usage in BoardCard), so state resets automatically.
  const [title, setTitle]            = useState(task?.title ?? "");
  const [status, setStatus]          = useState<TaskStatus>((task?.status as TaskStatus) ?? "todo");
  const [subtasks, setSubtasks]      = useState<Subtask[]>(task?.subtasks ?? []);
  const [newSubtask, setNewSubtask]  = useState("");
  const [error, setError]            = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef                     = useRef<HTMLInputElement>(null);
  const isEdit                       = !!task;

  // Auto-focus input on open
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function handleAddSubtask() {
    const trimmed = newSubtask.trim();
    if (!trimmed) return;
    if (isEdit && task) {
      startTransition(async () => {
        const saved = await createSubtask(task.id, trimmed);
        setSubtasks((prev) => [...prev, saved as unknown as Subtask]);
        setNewSubtask("");
      });
    } else {
      setSubtasks((prev) => [...prev, { id: crypto.randomUUID(), title: trimmed, completed: false, taskId: "" }]);
      setNewSubtask("");
    }
  }

  function handleToggleSubtask(subtaskId: string, completed: boolean) {
    setSubtasks((prev) => prev.map((s) => s.id === subtaskId ? { ...s, completed } : s));
    if (isEdit) startTransition(async () => { await toggleSubtask(subtaskId, completed); });
  }

  function handleDeleteSubtask(subtaskId: string) {
    setSubtasks((prev) => prev.filter((s) => s.id !== subtaskId));
    if (isEdit) startTransition(async () => { await deleteSubtask(subtaskId); });
  }

  function handleSubmit() {
    if (!title.trim()) { setError("Task title is required."); return; }
    startTransition(async () => {
      try {
        let saved: Task;
        if (isEdit) {
          saved = await updateTask(task!.id, { title: title.trim(), status }) as unknown as Task;
          saved = { ...saved, subtasks };
        } else {
          saved = await createTask(boardId, { title: title.trim(), status }) as unknown as Task;
          for (const sub of subtasks) {
            await createSubtask(saved.id, sub.title);
          }
          saved = { ...saved, subtasks };
        }
        onSaved(saved);
        onClose();
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  if (!open) return null;

  const doneCount = subtasks.filter((s) => s.completed).length;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(26,23,20,0.45)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width: "100%", maxWidth: 480, borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", background: "white", boxShadow: "0 32px 80px rgba(26,23,20,0.22), 0 4px 16px rgba(26,23,20,0.08)", animation: "modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.94) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>

        {/* Colour strip */}
        <div style={{ height: 6, background: boardColor }} />

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", borderBottom: "1px solid rgba(26,23,20,0.07)" }}>
          <div>
            <p style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500, color: boardColor }}>{boardName}</p>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 19, fontWeight: 600, letterSpacing: "-0.3px", color: "#1a1714", marginTop: 2 }}>
              {isEdit ? "Edit task" : "Add a task"}
            </h2>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#9c9188", cursor: "pointer", marginTop: 2 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#ede8e0"; e.currentTarget.style.color = "#1a1714"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9c9188"; }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto", maxHeight: "60vh" }}>

          {/* Title */}
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "#5a5148", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Title <span style={{ color: boardColor }}>*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              placeholder="What needs to be done?"
              style={{ width: "100%", borderRadius: 10, padding: "10px 14px", fontSize: 14, color: "#1a1714", background: "#f7f3ee", border: "1.5px solid rgba(26,23,20,0.10)", outline: "none", fontFamily: "inherit" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = boardColor; e.currentTarget.style.background = "white"; e.currentTarget.style.boxShadow = `0 0 0 3px ${boardColor}18`; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(26,23,20,0.10)"; e.currentTarget.style.background = "#f7f3ee"; e.currentTarget.style.boxShadow = "none"; }}
            />
            {error && <p style={{ fontSize: 12, color: "#b94040", marginTop: 6 }}>{error}</p>}
          </div>

          {/* Status */}
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "#5a5148", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Status</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TASK_STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 12px", borderRadius: 8, fontSize: 12.5, fontWeight: 500, cursor: "pointer", border: "1.5px solid", fontFamily: "inherit",
                    ...(status === s.value
                      ? { background: `${s.color}18`, borderColor: s.color, color: s.color }
                      : { background: "transparent", borderColor: "rgba(26,23,20,0.10)", color: "#9c9188" })
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "#5a5148", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Subtasks {subtasks.length > 0 && <span style={{ fontSize: 11, color: "#9c9188", fontWeight: 400, textTransform: "none" }}>({doneCount}/{subtasks.length} done)</span>}
            </label>

            {subtasks.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
                {subtasks.map((sub) => (
                  <div key={sub.id} className="group/sub" style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 8, background: "#f7f3ee" }}>
                    <button
                      onClick={() => handleToggleSubtask(sub.id, !sub.completed)}
                      style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${sub.completed ? boardColor : "#cdc6bc"}`, background: sub.completed ? boardColor : "white", color: sub.completed ? "white" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}
                    >
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <span style={{ fontSize: 12.5, flex: 1, color: sub.completed ? "#9c9188" : "#3d3730", textDecoration: sub.completed ? "line-through" : "none" }}>
                      {sub.title}
                    </span>
                    <button
                      onClick={() => handleDeleteSubtask(sub.id)}
                      className="opacity-0 group-hover/sub:opacity-100"
                      style={{ border: "none", background: "transparent", cursor: "pointer", color: "#9c9188", display: "flex", alignItems: "center", transition: "color 0.15s, opacity 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#b94040")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#9c9188")}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 10, padding: "8px 12px", background: "#f7f3ee", border: "1.5px dashed rgba(26,23,20,0.12)" }}>
              <Plus size={14} style={{ color: "#9c9188", flexShrink: 0 }} />
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSubtask(); } }}
                placeholder="Add a subtask… (press Enter)"
                style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#1a1714", width: "100%", fontFamily: "inherit" }}
              />
              {newSubtask.trim() && (
                <button onClick={handleAddSubtask} style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6, border: "none", background: `${boardColor}20`, color: boardColor, cursor: "pointer", fontFamily: "inherit" }}>
                  Add
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderTop: "1px solid rgba(26,23,20,0.07)", background: "#faf8f5" }}>
          <span style={{ fontSize: 11.5, color: "#9c9188" }}>
            {isEdit && task ? `Updated ${new Date(task.updatedAt).toLocaleDateString()}` : ""}
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{ padding: "8px 16px", borderRadius: 9, fontSize: 13, color: "#5a5148", border: "1.5px solid rgba(26,23,20,0.10)", background: "transparent", cursor: "pointer", fontFamily: "inherit" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#9c9188")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(26,23,20,0.10)")}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending || !title.trim()}
              style={{ padding: "8px 20px", borderRadius: 9, fontSize: 13, fontWeight: 600, color: "white", border: "none", background: title.trim() ? boardColor : "#9c9188", cursor: title.trim() ? "pointer" : "not-allowed", opacity: isPending ? 0.7 : 1, fontFamily: "inherit", transition: "filter 0.15s" }}
              onMouseEnter={(e) => { if (title.trim()) e.currentTarget.style.filter = "brightness(1.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
            >
              {isPending ? "Saving…" : isEdit ? "Save changes" : "Add Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}