"use client";

// src/components/AddTaskModal.tsx
// Create OR edit a task (pass `task` prop to edit).

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
  task?: Task | null;   // if set → edit mode
}

export default function AddTaskModal({ open, boardId, boardName, boardColor, onClose, onSaved, task }: AddTaskModalProps) {
  const [title, setTitle]           = useState("");
  const [status, setStatus]         = useState<TaskStatus>("todo");
  const [subtasks, setSubtasks]     = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [error, setError]           = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const isEdit   = !!task;

  // Populate when editing
  useEffect(() => {
    if (open) {
      setTitle(task?.title ?? "");
      setStatus((task?.status as TaskStatus) ?? "todo");
      setSubtasks(task?.subtasks ?? []);
      setError("");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open, task]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function handleAddSubtask() {
    const trimmed = newSubtask.trim();
    if (!trimmed) return;
    // Optimistic local add — will be saved when task is saved (create mode)
    // or immediately via server action (edit mode)
    if (isEdit && task) {
      startTransition(async () => {
        const saved = await createSubtask(task.id, trimmed);
        setSubtasks((prev) => [...prev, saved as unknown as Subtask]);
        setNewSubtask("");
      });
    } else {
      // Store locally, saved when main form submits
      setSubtasks((prev) => [...prev, { id: crypto.randomUUID(), title: trimmed, completed: false, taskId: "" }]);
      setNewSubtask("");
    }
  }

  function handleToggleSubtask(subtaskId: string, completed: boolean) {
    setSubtasks((prev) => prev.map((s) => s.id === subtaskId ? { ...s, completed } : s));
    if (isEdit) {
      startTransition(async () => { await toggleSubtask(subtaskId, completed); });
    }
  }

  function handleDeleteSubtask(subtaskId: string) {
    setSubtasks((prev) => prev.filter((s) => s.id !== subtaskId));
    if (isEdit) {
      startTransition(async () => { await deleteSubtask(subtaskId); });
    }
  }

  function handleSubmit() {
    if (!title.trim()) { setError("Task title is required."); return; }

    startTransition(async () => {
      try {
        let saved: Task;
        if (isEdit) {
          saved = await updateTask(task!.id, { title: title.trim(), status }) as unknown as Task;
        } else {
          saved = await createTask(boardId, { title: title.trim(), status }) as unknown as Task;
          // Create subtasks that were added before save
          for (const sub of subtasks) {
            await createSubtask(saved.id, sub.title);
          }
          // Re-fetch task with subtasks
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
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-ink/45 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-[480px] rounded-[20px] overflow-hidden flex flex-col bg-white shadow-modal animate-modal-in">

        {/* Colour strip */}
        <div className="h-1.5" style={{ background: boardColor }} />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-start justify-between border-b border-subtle">
          <div>
            <p className="text-[10.5px] uppercase tracking-widest font-medium" style={{ color: boardColor }}>
              {boardName}
            </p>
            <h2 className="font-display text-[19px] font-semibold tracking-tight text-ink mt-0.5">
              {isEdit ? "Edit task" : "Add a task"}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 text-ink-muted hover:bg-paper-dark hover:text-ink transition-colors duration-150" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">

          {/* Title */}
          <div>
            <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5 tracking-wide uppercase">
              Title <span style={{ color: boardColor }}>*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              placeholder="What needs to be done?"
              className="w-full rounded-[10px] px-3.5 py-2.5 text-[14px] text-ink bg-paper border border-soft outline-none transition-all duration-150 placeholder:text-ink-faint focus:bg-white focus:border-amber-fb focus:ring-2 focus:ring-amber-fb/10"
            />
            {error && <p className="text-[12px] text-rose-fb mt-1.5">{error}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5 tracking-wide uppercase">
              Status
            </label>
            <div className="flex gap-2">
              {TASK_STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12.5px] font-medium transition-all duration-150 border-[1.5px]"
                  style={
                    status === s.value
                      ? { background: `${s.color}18`, borderColor: s.color, color: s.color }
                      : { background: "transparent", borderColor: "rgba(26,23,20,0.1)", color: "#9c9188" }
                  }
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5 tracking-wide uppercase">
              Subtasks {subtasks.length > 0 && <span className="text-ink-faint font-normal normal-case">({doneCount}/{subtasks.length} done)</span>}
            </label>

            {subtasks.length > 0 && (
              <div className="mb-2 space-y-1">
                {subtasks.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-2 px-3 py-2 rounded-[8px] bg-paper group/sub">
                    <button
                      onClick={() => handleToggleSubtask(sub.id, !sub.completed)}
                      className="w-4 h-4 rounded-[4px] border-[1.5px] flex-shrink-0 flex items-center justify-center transition-all duration-150"
                      style={sub.completed ? { background: boardColor, borderColor: boardColor, color: "white" } : { borderColor: "#cdc6bc", color: "transparent" }}
                    >
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3L3 5L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <span className={`text-[12.5px] flex-1 ${sub.completed ? "line-through text-ink-muted" : "text-ink-deep"}`}>
                      {sub.title}
                    </span>
                    <button onClick={() => handleDeleteSubtask(sub.id)} className="text-ink-muted hover:text-rose-fb flex items-center justify-center opacity-0 group-hover/sub:opacity-100 transition-all duration-150" aria-label="Remove subtask">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 rounded-[10px] px-3 py-2 bg-paper border border-dashed border-medium">
              <Plus size={14} className="text-ink-muted flex-shrink-0" />
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSubtask(); } }}
                placeholder="Add a subtask… (press Enter)"
                className="bg-transparent border-none outline-none text-[13px] text-ink w-full placeholder:text-ink-faint"
              />
              {newSubtask.trim() && (
                <button onClick={handleAddSubtask} className="text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors" style={{ background: `${boardColor}20`, color: boardColor }}>
                  Add
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between gap-3 border-t border-subtle bg-paper-wash">
          <span className="text-[11.5px] text-ink-muted">
            {isEdit ? `Last updated ${new Date(task!.updatedAt).toLocaleDateString()}` : ""}
          </span>
          <div className="flex gap-2.5">
            <button onClick={onClose} className="px-4 py-2 rounded-[9px] text-[13px] text-ink-soft border border-soft hover:border-ink-muted transition-all duration-150">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending || !title.trim()}
              className="px-5 py-2 rounded-[9px] text-[13px] font-semibold text-white transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
              style={{ background: title.trim() ? boardColor : "#9c9188" }}
            >
              {isPending ? "Saving…" : isEdit ? "Save changes" : "Add Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}