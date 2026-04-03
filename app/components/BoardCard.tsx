"use client";

import { useState, useTransition, useEffect } from "react";
import { MoreHorizontal, Plus, Check, Pencil, Trash2, Loader2, Star } from "lucide-react";
import type { Board, Task } from "@/types/flowboard";
import { TASK_STATUSES } from "@/types/flowboard";
import { deleteBoard } from "@/actions/boards";
import { deleteTask, updateTask } from "@/actions/tasks";
import AddTaskModal from "./AddTaskModal";

const BOARD_COLORS = ["#c8862a", "#3a7d5c", "#2d5f8a", "#b94040", "#7a5da8"];
function getBoardColor(id: string) {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff;
  return BOARD_COLORS[Math.abs(hash) % BOARD_COLORS.length];
}

interface BoardCardProps {
  board: Board;
  onBoardEdit: (board: Board) => void;
  onBoardDeleted: (id: string) => void;
  onTaskSaved: (boardId: string, task: Task) => void;
}

export default function BoardCard({ board, onBoardEdit, onBoardDeleted, onTaskSaved }: BoardCardProps) {
  const [tasks, setTasks]          = useState<Task[]>((board.tasks ?? []).map((t) => ({ ...t, subtasks: t.subtasks ?? [] })));
  const [modalOpen, setModal]      = useState(false);
  const [editingTask, setEditTask] = useState<Task | null>(null);
  const [menuOpen, setMenuOpen]    = useState(false);
  const [deleting, setDeleting]    = useState(false);
  const [starred, setStarred]      = useState(false);
  const [, startTransition]        = useTransition();
  const color                      = getBoardColor(board.id);

  // Sync starred state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fb_starred");
      if (saved) setStarred(new Set(JSON.parse(saved)).has(board.id));
    } catch {}
  }, [board.id]);

  function handleToggleStar(e: React.MouseEvent) {
    e.stopPropagation();
    const next = !starred;
    setStarred(next);
    try {
      const saved = localStorage.getItem("fb_starred");
      const set   = new Set<string>(saved ? JSON.parse(saved) : []);
      next ? set.add(board.id) : set.delete(board.id);
      localStorage.setItem("fb_starred", JSON.stringify([...set]));
    } catch {}
  }

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const progress  = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  // ── Task saved (add or edit) ────────────────────────────────
  function handleTaskSaved(task: Task) {
    const safe = { ...task, subtasks: task.subtasks ?? [] };
    setTasks((prev) => {
      const exists = prev.find((t) => t.id === safe.id);
      return exists ? prev.map((t) => t.id === safe.id ? safe : t) : [...prev, safe];
    });
    onTaskSaved(board.id, safe);
  }

  // ── Toggle task done/todo ───────────────────────────────────
  function handleToggleTask(e: React.MouseEvent, task: Task) {
    e.stopPropagation();
    const next = task.status === "done" ? "todo" : "done";
    // Optimistic
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: next } : t));
    startTransition(async () => {
      try {
        await updateTask(task.id, { status: next });
      } catch {
        // Rollback on failure
        setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: task.status } : t));
      }
    });
  }

  // ── Delete task ─────────────────────────────────────────────
  function handleDeleteTask(e: React.MouseEvent, taskId: string) {
    e.stopPropagation();
    // Optimistic remove
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    startTransition(async () => {
      try {
        await deleteTask(taskId);
      } catch {
        // Rollback: re-fetch would be ideal but just show alert for now
        alert("Failed to delete task. Please refresh.");
      }
    });
  }

  // ── Delete board ────────────────────────────────────────────
  function handleDeleteBoard() {
    if (!confirm(`Delete "${board.name}"? This will permanently remove the board and all its tasks.`)) return;
    setMenuOpen(false);
    setDeleting(true);
    startTransition(async () => {
      try {
        await deleteBoard(board.id);
        onBoardDeleted(board.id);
      } catch {
        setDeleting(false);
        alert("Failed to delete board. Please try again.");
      }
    });
  }

  return (
    <>
      <div
        suppressHydrationWarning
        className="group relative bg-white flex flex-col overflow-visible"
        style={{
          borderRadius: 18,
          boxShadow: "0 2px 16px rgba(26,23,20,0.08), 0 1px 4px rgba(26,23,20,0.05)",
          transition: "box-shadow 0.2s, transform 0.2s, opacity 0.2s",
          opacity: deleting ? 0.5 : 1,
          pointerEvents: deleting ? "none" : "auto",
        }}
        onMouseEnter={(e) => {
          if (deleting) return;
          (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(26,23,20,0.13), 0 2px 8px rgba(26,23,20,0.07)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(26,23,20,0.08), 0 1px 4px rgba(26,23,20,0.05)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        }}
      >
        {/* Deleting overlay */}
        {deleting && (
          <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <Loader2 size={20} style={{ color: "#9c9188", animation: "spin 1s linear infinite" }} />
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Left accent bar */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, borderRadius: "18px 0 0 18px", background: color, pointerEvents: "none" }} />

        {/* Colour wash */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 80, borderRadius: "18px 18px 0 0", background: `linear-gradient(180deg, ${color}10 0%, transparent 100%)`, pointerEvents: "none" }} />

        {/* ── Header ── */}
        <div style={{ padding: "20px 16px 16px 28px", position: "relative" }}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 style={{ fontFamily: "'Lora', serif", fontSize: 15, fontWeight: 600, color: "#1a1714", letterSpacing: "-0.2px", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {board.name}
              </h3>
              <p style={{ fontSize: 11.5, color: "#9c9188", marginTop: 3 }}>
                {tasks.length} task{tasks.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Star + options menu */}
            <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
              {/* Star button — always visible when starred, hover to show when not */}
              <button
                suppressHydrationWarning
                onClick={handleToggleStar}
                className={starred ? "" : "opacity-0 group-hover:opacity-100"}
                style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: "transparent", cursor: "pointer", color: starred ? "#c8862a" : "#9c9188", transition: "opacity 0.15s, color 0.15s, background 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = starred ? "#fdf3e0" : "#ede8e0"; e.currentTarget.style.color = "#c8862a"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = starred ? "#c8862a" : "#9c9188"; }}
                aria-label={starred ? "Unstar board" : "Star board"}
                title={starred ? "Unstar board" : "Star board"}
              >
                <Star size={13} fill={starred ? "#c8862a" : "none"} />
              </button>

              {/* ⋯ options menu */}
              <div style={{ position: "relative" }}>
                <button
                  suppressHydrationWarning
                  onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
                  style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#9c9188", transition: "background 0.15s", border: "none", background: "transparent", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#ede8e0")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <MoreHorizontal size={15} />
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div style={{ position: "absolute", right: 0, top: 32, zIndex: 20, background: "white", borderRadius: 12, border: "1px solid rgba(26,23,20,0.08)", boxShadow: "0 8px 24px rgba(26,23,20,0.14)", width: 140, overflow: "hidden", padding: "4px 0" }}>
                      <button
                        onClick={() => { setMenuOpen(false); onBoardEdit(board); }}
                        className="flex items-center gap-2 w-full"
                        style={{ padding: "8px 12px", fontSize: 13, color: "#5a5148", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f7f3ee")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <Pencil size={13} /> Rename
                      </button>
                      <button
                        onClick={handleDeleteBoard}
                        className="flex items-center gap-2 w-full"
                        style={{ padding: "8px 12px", fontSize: 13, color: "#b94040", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fce8e8")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <Trash2 size={13} /> Delete board
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2.5" style={{ marginTop: 14 }}>
            <div style={{ flex: 1, height: 5, borderRadius: 99, overflow: "hidden", background: "#ede8e0" }}>
              <div style={{ height: "100%", borderRadius: 99, width: `${progress}%`, background: color, transition: "width 0.7s ease" }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color, minWidth: 28, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{progress}%</span>
          </div>
        </div>

        {/* ── Tasks ── */}
        <div style={{ padding: "12px 16px 16px 28px", flex: 1, borderTop: "1px solid rgba(26,23,20,0.06)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {tasks.slice(0, 5).map((task) => {
              const done       = task.status === "done";
              const statusInfo = TASK_STATUSES.find((s) => s.value === task.status) ?? TASK_STATUSES[0];
              const subs       = task.subtasks ?? [];
              const subDone    = subs.filter((s) => s.completed).length;

              return (
                <div
                  key={task.id}
                  suppressHydrationWarning
                  className="group/task flex items-center gap-2"
                  style={{ padding: "5px 8px", borderRadius: 8, minHeight: 30, transition: "background 0.1s", cursor: "default" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f7f3ee")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Checkbox — toggles status in DB */}
                  <button
                    suppressHydrationWarning
                    onClick={(e) => handleToggleTask(e, task)}
                    style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${done ? color : "#cdc6bc"}`, background: done ? color : "white", color: done ? "white" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s", cursor: "pointer" }}
                  >
                    <Check size={9} strokeWidth={2.5} />
                  </button>

                  {/* Title */}
                  <span style={{ flex: 1, fontSize: 12.5, color: done ? "#9c9188" : "#3d3730", textDecoration: done ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {task.title}
                  </span>

                  {/* Subtask count */}
                  {subs.length > 0 && (
                    <span style={{ fontSize: 10, fontWeight: 500, padding: "1px 6px", borderRadius: 6, background: done ? "#f0ece6" : `${color}18`, color: done ? "#9c9188" : color, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
                      {subDone}/{subs.length}
                    </span>
                  )}

                  {/* Status badge — hover only */}
                  <span className="opacity-0 group-hover/task:opacity-100 transition-opacity" style={{ fontSize: 10, fontWeight: 500, padding: "1px 6px", borderRadius: 6, background: `${statusInfo.color}18`, color: statusInfo.color, flexShrink: 0 }}>
                    {statusInfo.label}
                  </span>

                  {/* Edit + Delete — hover only */}
                  <div className="opacity-0 group-hover/task:opacity-100 transition-opacity flex items-center gap-0.5 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditTask(task); setModal(true); }}
                      style={{ width: 20, height: 20, borderRadius: 4, border: "none", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#9c9188", cursor: "pointer", transition: "background 0.1s, color 0.1s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#ede8e0"; e.currentTarget.style.color = "#1a1714"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9c9188"; }}
                      aria-label="Edit task"
                    >
                      <Pencil size={10} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteTask(e, task.id)}
                      style={{ width: 20, height: 20, borderRadius: 4, border: "none", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#9c9188", cursor: "pointer", transition: "background 0.1s, color 0.1s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#fce8e8"; e.currentTarget.style.color = "#b94040"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9c9188"; }}
                      aria-label="Delete task"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
              );
            })}

            {tasks.length > 5 && (
              <p style={{ fontSize: 11, color: "#9c9188", padding: "2px 8px" }}>
                +{tasks.length - 5} more task{tasks.length - 5 !== 1 ? "s" : ""}
              </p>
            )}

            {tasks.length === 0 && (
              <p style={{ fontSize: 12, color: "#b5aea6", padding: "6px 8px", fontStyle: "italic" }}>No tasks yet</p>
            )}
          </div>

          {/* Add task trigger */}
          <button
            suppressHydrationWarning
            onClick={(e) => { e.stopPropagation(); setEditTask(null); setModal(true); }}
            className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 w-full transition-opacity duration-150"
            style={{ marginTop: 6, padding: "6px 8px", borderRadius: 8, border: "none", background: "transparent", fontSize: 12, color: "#9c9188", cursor: "pointer", textAlign: "left" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f7f3ee"; e.currentTarget.style.color = "#5a5148"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9c9188"; }}
          >
            <Plus size={13} />
            Add task
          </button>
        </div>
      </div>

      {/* Add / Edit Task Modal */}
      <AddTaskModal
        key={`${modalOpen}-${editingTask?.id ?? "new"}`}
        open={modalOpen}
        boardId={board.id}
        boardName={board.name}
        boardColor={color}
        task={editingTask}
        onClose={() => { setModal(false); setEditTask(null); }}
        onSaved={handleTaskSaved}
      />
    </>
  );
}

// ── Add-New Board card ──────────────────────────────────────────
interface AddBoardCardProps { onClick: () => void; }

export function AddBoardCard({ onClick }: AddBoardCardProps) {
  return (
    <button
      suppressHydrationWarning
      onClick={onClick}
      className="group flex flex-col items-center justify-center gap-3 w-full cursor-pointer transition-all duration-200"
      style={{ minHeight: 220, borderRadius: 18, border: "1.5px dashed rgba(26,23,20,0.15)", background: "transparent", color: "#9c9188" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c8862a"; e.currentTarget.style.color = "#c8862a"; e.currentTarget.style.background = "#fdf8f0"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(26,23,20,0.15)"; e.currentTarget.style.color = "#9c9188"; e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px dashed currentColor", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.3s ease" }} className="group-hover:rotate-90 group-hover:scale-110">
        <Plus size={20} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>New board</div>
        <div style={{ fontSize: 11.5, opacity: 0.7, marginTop: 2 }}>Start organising</div>
      </div>
    </button>
  );
}