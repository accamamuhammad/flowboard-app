"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Check, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import type { Board, Task, Subtask } from "@/types/flowboard";
import { TASK_STATUSES } from "@/types/flowboard";
import { deleteTask, updateTask, createSubtask, toggleSubtask, deleteSubtask } from "@/actions/tasks";
import AddTaskModal from "@/app/components/AddTaskModal";
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/app/components/Sidebar"), { ssr: false });

const BOARD_COLORS = ["#c8862a", "#3a7d5c", "#2d5f8a", "#b94040", "#7a5da8"];
function getBoardColor(id: string) {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff;
  return BOARD_COLORS[Math.abs(hash) % BOARD_COLORS.length];
}

export default function BoardDetailClient({ board: initialBoard }: { board: Board }) {
  const [board, setBoard]        = useState<Board>({ ...initialBoard, tasks: (initialBoard.tasks ?? []).map(t => ({ ...t, subtasks: t.subtasks ?? [] })) });
  const [modalOpen, setModal]    = useState(false);
  const [editingTask, setEdit]   = useState<Task | null>(null);
  const [expanded, setExpanded]  = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebar] = useState(false);
  const [, startTransition]      = useTransition();
  const color                    = getBoardColor(board.id);

  const doneCount = board.tasks.filter(t => t.status === "done").length;
  const progress  = board.tasks.length > 0 ? Math.round((doneCount / board.tasks.length) * 100) : 0;

  function updateTasks(fn: (prev: Task[]) => Task[]) {
    setBoard(b => ({ ...b, tasks: fn(b.tasks) }));
  }

  function handleTaskSaved(task: Task) {
    const safe = { ...task, subtasks: task.subtasks ?? [] };
    updateTasks(prev => {
      const exists = prev.find(t => t.id === safe.id);
      return exists ? prev.map(t => t.id === safe.id ? safe : t) : [...prev, safe];
    });
  }

  function handleToggleTask(task: Task) {
    const next = task.status === "done" ? "todo" : "done";
    updateTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: next } : t));
    startTransition(async () => { await updateTask(task.id, { status: next }); });
  }

  function handleDeleteTask(taskId: string) {
    updateTasks(prev => prev.filter(t => t.id !== taskId));
    startTransition(async () => { await deleteTask(taskId); });
  }

  function handleToggleSub(taskId: string, sub: Subtask) {
    updateTasks(prev => prev.map(t => t.id === taskId
      ? { ...t, subtasks: t.subtasks.map(s => s.id === sub.id ? { ...s, completed: !s.completed } : s) }
      : t
    ));
    startTransition(async () => { await toggleSubtask(sub.id, !sub.completed); });
  }

  function handleDeleteSub(taskId: string, subId: string) {
    updateTasks(prev => prev.map(t => t.id === taskId
      ? { ...t, subtasks: t.subtasks.filter(s => s.id !== subId) }
      : t
    ));
    startTransition(async () => { await deleteSubtask(subId); });
  }

  const groupedTasks: Record<string, Task[]> = { todo: [], in_progress: [], done: [] };
  board.tasks.forEach(t => { (groupedTasks[t.status] ?? groupedTasks.todo).push(t); });

  return (
    <div
      suppressHydrationWarning
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "#ede8e0", backgroundImage: "repeating-linear-gradient(transparent,transparent 27px,rgba(26,23,20,0.08) 27px,rgba(26,23,20,0.08) 28px)" }}
    >
      <Sidebar boards={[board]} isOpen={sidebarOpen} onClose={() => setSidebar(false)} />

      <main style={{ flex: 1, overflowY: "auto", minWidth: 0, padding: "40px 48px 60px" }}>

        {/* Back + header */}
        <div style={{ marginBottom: 32 }}>
          <Link href="/boards" className="flex items-center gap-1.5 transition-colors duration-150"
            style={{ fontSize: 12.5, color: "#9c9188", marginBottom: 16, display: "inline-flex", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1714")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9c9188")}
          >
            <ArrowLeft size={14} /> All boards
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              {/* Colour dot + name */}
              <div className="flex items-center gap-3">
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: color, flexShrink: 0 }} />
                <h1 style={{ fontFamily: "'Lora', serif", fontSize: 30, fontWeight: 600, color: "#1a1714", letterSpacing: "-0.5px" }}>
                  {board.name}
                </h1>
              </div>
              <p style={{ fontSize: 13, color: "#9c9188", marginTop: 4, marginLeft: 24 }}>
                {board.tasks.length} task{board.tasks.length !== 1 ? "s" : ""} · {doneCount} done
              </p>
            </div>

            <button
              onClick={() => { setEdit(null); setModal(true); }}
              className="flex items-center gap-1.5 transition-all duration-150 hover:-translate-y-px flex-shrink-0"
              style={{ background: "#1a1714", color: "#f7f3ee", border: "none", borderRadius: 9, padding: "9px 18px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = color; e.currentTarget.style.color = "white"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1714"; e.currentTarget.style.color = "#f7f3ee"; }}
            >
              <Plus size={15} /> Add task
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3" style={{ marginTop: 20, marginLeft: 24 }}>
            <div style={{ flex: 1, maxWidth: 320, height: 6, borderRadius: 99, background: "#ddd8d0", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, width: `${progress}%`, background: color, transition: "width 0.7s ease" }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color }}>{progress}%</span>
          </div>
        </div>

        {/* Status columns */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {TASK_STATUSES.map(({ value, label, color: sColor }) => {
            const colTasks = groupedTasks[value] ?? [];
            return (
              <div key={value} style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(26,23,20,0.07)" }}>
                {/* Column header */}
                <div className="flex items-center justify-between" style={{ padding: "14px 16px", borderBottom: "1px solid rgba(26,23,20,0.06)" }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: sColor }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#5a5148", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
                  </div>
                  <span style={{ fontSize: 11.5, color: "#9c9188", background: "#f0ece6", borderRadius: 20, padding: "1px 8px", fontWeight: 500 }}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Tasks */}
                <div style={{ padding: "8px 0" }}>
                  {colTasks.length === 0 && (
                    <p style={{ fontSize: 12, color: "#b5aea6", padding: "10px 16px", fontStyle: "italic" }}>No tasks</p>
                  )}

                  {colTasks.map(task => {
                    const done      = task.status === "done";
                    const isExpanded = expanded[task.id];
                    const subs       = task.subtasks ?? [];
                    const subDone    = subs.filter(s => s.completed).length;

                    return (
                      <div key={task.id} className="group/task" style={{ borderBottom: "1px solid rgba(26,23,20,0.05)" }}>
                        {/* Task row */}
                        <div
                          className="flex items-start gap-2.5"
                          style={{ padding: "10px 16px", transition: "background 0.1s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#faf8f5")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          {/* Checkbox */}
                          <button
                            onClick={() => handleToggleTask(task)}
                            style={{ width: 17, height: 17, borderRadius: 5, border: `1.5px solid ${done ? color : "#cdc6bc"}`, background: done ? color : "white", color: done ? "white" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, cursor: "pointer", transition: "all 0.15s" }}
                          >
                            <Check size={10} strokeWidth={2.5} />
                          </button>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            {/* Title */}
                            <div className="flex items-center gap-1.5">
                              <span style={{ fontSize: 13.5, color: done ? "#9c9188" : "#1a1714", textDecoration: done ? "line-through" : "none", fontWeight: 500, flex: 1 }}>
                                {task.title}
                              </span>
                              {/* Expand subtasks toggle */}
                              {subs.length > 0 && (
                                <button
                                  onClick={() => setExpanded(e => ({ ...e, [task.id]: !e[task.id] }))}
                                  style={{ border: "none", background: "transparent", cursor: "pointer", color: "#9c9188", padding: 2, display: "flex", alignItems: "center", flexShrink: 0 }}
                                >
                                  {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                                </button>
                              )}
                            </div>

                            {/* Subtask progress pill */}
                            {subs.length > 0 && (
                              <div className="flex items-center gap-1.5" style={{ marginTop: 4 }}>
                                <div style={{ width: 48, height: 3, borderRadius: 99, background: "#ede8e0", overflow: "hidden" }}>
                                  <div style={{ height: "100%", borderRadius: 99, width: `${Math.round((subDone / subs.length) * 100)}%`, background: color }} />
                                </div>
                                <span style={{ fontSize: 10.5, color: "#9c9188" }}>{subDone}/{subs.length} subtasks</span>
                              </div>
                            )}

                            {/* Expanded subtasks */}
                            {isExpanded && subs.length > 0 && (
                              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                                {subs.map(sub => (
                                  <div key={sub.id} className="group/sub flex items-center gap-2" style={{ padding: "4px 0" }}>
                                    <button
                                      onClick={() => handleToggleSub(task.id, sub)}
                                      style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${sub.completed ? color : "#cdc6bc"}`, background: sub.completed ? color : "white", color: sub.completed ? "white" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", transition: "all 0.15s" }}
                                    >
                                      <Check size={8} strokeWidth={2.5} />
                                    </button>
                                    <span style={{ fontSize: 12.5, flex: 1, color: sub.completed ? "#9c9188" : "#3d3730", textDecoration: sub.completed ? "line-through" : "none" }}>
                                      {sub.title}
                                    </span>
                                    <button
                                      onClick={() => handleDeleteSub(task.id, sub.id)}
                                      className="opacity-0 group-hover/sub:opacity-100 transition-opacity"
                                      style={{ border: "none", background: "transparent", cursor: "pointer", color: "#9c9188", display: "flex", padding: 2 }}
                                      onMouseEnter={e => (e.currentTarget.style.color = "#b94040")}
                                      onMouseLeave={e => (e.currentTarget.style.color = "#9c9188")}
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Edit / Delete — hover */}
                          <div className="opacity-0 group-hover/task:opacity-100 flex items-center gap-0.5 flex-shrink-0 transition-opacity">
                            <button
                              onClick={() => { setEdit(task); setModal(true); }}
                              style={{ width: 22, height: 22, borderRadius: 5, border: "none", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#9c9188", cursor: "pointer" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "#ede8e0"; e.currentTarget.style.color = "#1a1714"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9c9188"; }}
                            >
                              <Pencil size={11} />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              style={{ width: 22, height: 22, borderRadius: 5, border: "none", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#9c9188", cursor: "pointer" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "#fce8e8"; e.currentTarget.style.color = "#b94040"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9c9188"; }}
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add task to this column */}
                  <button
                    onClick={() => { setEdit(null); setModal(true); }}
                    className="flex items-center gap-1.5 w-full transition-colors duration-150"
                    style={{ padding: "8px 16px", fontSize: 12, color: "#9c9188", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#f7f3ee"; e.currentTarget.style.color = "#5a5148"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9c9188"; }}
                  >
                    <Plus size={12} /> Add task
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      <AddTaskModal
        key={`${modalOpen}-${editingTask?.id ?? "new"}`}
        open={modalOpen}
        boardId={board.id}
        boardName={board.name}
        boardColor={color}
        task={editingTask}
        onClose={() => { setModal(false); setEdit(null); }}
        onSaved={handleTaskSaved}
      />
    </div>
  );
}