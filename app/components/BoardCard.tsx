"use client";

import { useState } from "react";
import { MoreHorizontal, Plus, Check } from "lucide-react";
import type { Board, TaskItem } from "@/types/flowboard";
import { boardColors } from "@/lib/boardColors";
import AddTaskModal from "./AddTaskModal";

interface BoardCardProps {
  board: Board;
  onToggleTask?: (boardId: string, taskId: string, done: boolean) => void;
  onAddTask?: (boardId: string, task: TaskItem) => void;
  onClick?: () => void;
}

export default function BoardCard({ board, onToggleTask, onAddTask, onClick }: BoardCardProps) {
  const [tasks, setTasks]         = useState<TaskItem[]>(board.tasks);
  const [taskModalOpen, setModal] = useState(false);
  const colors                    = boardColors[board.color];

  const doneCount = tasks.filter((t) => t.done).length;

  function toggleTask(taskId: string) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)));
    const task = tasks.find((t) => t.id === taskId);
    if (task) onToggleTask?.(board.id, taskId, !task.done);
  }

  function handleAddTask(task: TaskItem) {
    setTasks((prev) => [...prev, task]);
    onAddTask?.(board.id, task);
  }

  return (
    <>
      <div
        suppressHydrationWarning
        onClick={onClick}
        className="group relative bg-white rounded-[18px] overflow-hidden cursor-pointer flex flex-col shadow-card hover:shadow-card-hover transition-all duration-250 hover:-translate-y-1"
      >
        {/* Left accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[18px]" style={{ background: colors.hex }} />

        {/* Colour wash */}
        <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none" style={{ background: `linear-gradient(180deg, ${colors.hex}12 0%, transparent 100%)` }} />

        {/* Header */}
        <div className="pl-7 pr-4 pt-5 pb-4 relative">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${colors.hex}18` }}>
                {board.emoji}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink leading-tight truncate">
                  {board.name}
                </h3>
                <p className="text-[11.5px] text-ink-muted mt-0.5 leading-snug line-clamp-1">
                  {board.description}
                </p>
              </div>
            </div>
            <button
              suppressHydrationWarning
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-ink-muted opacity-0 group-hover:opacity-100 hover:bg-paper-dark transition-all duration-150"
              aria-label="Board options"
            >
              <MoreHorizontal size={15} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2.5 mt-3.5">
            <div className="flex-1 h-[5px] rounded-full overflow-hidden bg-paper-dark">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${board.progress}%`, background: colors.hex }} />
            </div>
            <span className="text-[11px] font-semibold tabular-nums" style={{ color: colors.hex }}>
              {board.progress}%
            </span>
          </div>
        </div>

        {/* Task list */}
        <div className="pl-7 pr-4 pb-3 flex-1 border-t border-subtle">
          <div className="pt-3 space-y-[3px]">
            {tasks.slice(0, 4).map((task) => (
              <div key={task.id} suppressHydrationWarning className="flex items-center gap-2.5 py-[5px] px-2 rounded-lg hover:bg-paper transition-colors duration-100">
                <button
                  suppressHydrationWarning
                  onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                  className="w-4 h-4 rounded-[4px] border-[1.5px] flex-shrink-0 flex items-center justify-center transition-all duration-150"
                  style={task.done ? { background: colors.hex, borderColor: colors.hex, color: "white" } : { borderColor: "#cdc6bc", color: "transparent" }}
                  aria-label={task.done ? "Mark incomplete" : "Mark complete"}
                >
                  <Check size={9} strokeWidth={2.5} />
                </button>
                <span className={`text-[12.5px] flex-1 truncate transition-colors duration-150 ${task.done ? "line-through text-ink-muted" : "text-ink-deep"}`}>
                  {task.label}
                </span>
                {task.subtaskCount > 0 && (
                  <span className="text-[10px] font-medium px-1.5 py-px rounded-md flex-shrink-0 tabular-nums" style={{ background: task.done ? "#f0ece6" : `${colors.hex}18`, color: task.done ? "#9c9188" : colors.hex }}>
                    {task.subtaskDone}/{task.subtaskCount}
                  </span>
                )}
              </div>
            ))}

            {tasks.length > 4 && (
              <p className="text-[11px] text-ink-muted pl-2 pt-1">
                +{tasks.length - 4} more task{tasks.length - 4 !== 1 ? "s" : ""}
              </p>
            )}

            {tasks.length === 0 && (
              <p className="text-[12px] text-ink-faint pl-2 py-2 italic">No tasks yet</p>
            )}
          </div>

          {/* Add task trigger */}
          <button
            suppressHydrationWarning
            onClick={(e) => { e.stopPropagation(); setModal(true); }}
            className="mt-2 flex items-center gap-1.5 py-1.5 px-2 rounded-lg w-full text-[12px] text-ink-muted hover:text-ink-soft hover:bg-paper transition-all duration-150 opacity-0 group-hover:opacity-100"
          >
            <Plus size={13} />
            Add task
          </button>
        </div>
      </div>

      <AddTaskModal
        open={taskModalOpen}
        boardName={board.name}
        boardColor={colors.hex}
        onClose={() => setModal(false)}
        onAdd={handleAddTask}
      />
    </>
  );
}

// Add-New Board card
interface AddBoardCardProps { onClick: () => void; }

export function AddBoardCard({ onClick }: AddBoardCardProps) {
  return (
    <button
      suppressHydrationWarning
      onClick={onClick}
      className="group border-[1.5px] border-dashed border-medium rounded-[18px] min-h-[220px] w-full flex flex-col items-center justify-center gap-3 text-ink-muted hover:border-amber-fb hover:text-amber-fb hover:bg-amber-pale transition-all duration-200 cursor-pointer"
    >
      <div suppressHydrationWarning className="w-11 h-11 rounded-full border-[1.5px] border-dashed border-current flex items-center justify-center transition-transform duration-300 ease-out group-hover:rotate-90 group-hover:scale-110">
        <Plus size={20} />
      </div>
      <div className="text-center">
        <div className="text-[13.5px] font-semibold">New board</div>
        <div className="text-[11.5px] opacity-70 mt-0.5">Start organising</div>
      </div>
    </button>
  );
}