"use client";

import { Plus } from "lucide-react";
import type { Board } from "@/types/flowboard";
import BoardCard, { AddBoardCard } from "./BoardCard";
import AuthCard from "./AuthCard";

interface MainContentProps {
  boards: Board[];
  onNewBoard: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  onBoardClick?: (board: Board) => void;
}

export default function MainContent({
  boards,
  onNewBoard,
  onToggleSidebar,
  sidebarOpen,
  onBoardClick,
}: MainContentProps) {
  return (
    <main className="flex-1 px-6 lg:px-12 py-11 overflow-y-auto min-w-0 animate-rise">
      {/* Page header */}
      <div className="flex items-end justify-between mb-10">
        <div className="flex items-center gap-3">
          {/* Sidebar toggle — tablet only, hidden when sidebar is open */}
          {!sidebarOpen && (
            <div
              onClick={onToggleSidebar}
              className="w-16 h-12 rounded-r-full bg-paper shadow-pill absolute left-0 bottom-10 z-50 flex items-center justify-center pr-1.5 text-sm font-bold cursor-pointer lg:hidden text-ink hover:bg-paper-dark transition-colors duration-150"
              aria-label="Toggle sidebar"
            >
              Open
            </div>
          )}

          <div>
            <p className="text-[11px] uppercase tracking-[0.1em] text-ink-muted mb-1.5">
              Workspace
            </p>
            <h1 className="font-display text-3xl lg:text-[34px] font-semibold tracking-tight leading-tight text-ink">
              Your <em className="not-italic text-amber-fb">Boards</em>
            </h1>
          </div>
        </div>

        <div className="flex flex-row items-center justify-center gap-2.5">
          {/* New Board button */}
          <button
            suppressHydrationWarning
            onClick={onNewBoard}
            className="flex items-center justify-center gap-1.5 font-semibold font-body rounded-lg transition-all duration-150 hover:-translate-y-px bg-ink text-paper hover:bg-amber-fb hover:text-ink w-10 h-10 lg:w-auto lg:h-auto lg:px-4 lg:py-2.5 bg-amber-50"
            aria-label="New board"
          >
            <Plus size={16} />
            <span className="hidden lg:inline text-[13.5px]">New Board</span>
          </button>
                  {/* Auth Card */}
        <AuthCard />
        </div>
      </div>

      {/* Section label */}
      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-[10.5px] uppercase tracking-[0.1em] text-ink-muted whitespace-nowrap">
          {boards.length} board{boards.length !== 1 ? "s" : ""}
        </span>
        <div className="flex-1 h-px bg-ink/[0.08]" />
      </div>

      {/* Boards grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(264px,1fr))] gap-[18px] mb-12">
        {boards.map((board) => (
          <div key={board.id} className="group">
            <BoardCard board={board} onClick={() => onBoardClick?.(board)} />
          </div>
        ))}
        <AddBoardCard onClick={onNewBoard} />
      </div>
    </main>
  );
}
