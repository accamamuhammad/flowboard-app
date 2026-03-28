"use client";

// src/components/MainContent.tsx

import { useState } from "react";
import type { Board } from "@/types/flowboard";
import BoardCard, { AddBoardCard } from "./BoardCard";

interface MainContentProps {
  boards: Board[];
  onNewBoard: () => void;
  onToggleSidebar: () => void;
  onBoardClick?: (board: Board) => void;
}

export default function MainContent({
  boards,
  onNewBoard,
  onToggleSidebar,
  onBoardClick,
}: MainContentProps) {
  const [query, setQuery] = useState("");

  const filtered = boards.filter(
    (b) =>
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="flex-1 px-6 lg:px-12 py-11 overflow-y-auto min-w-0">

      {/* ── Page header ── */}
      <div className="flex items-end justify-between mb-10">
        <div className="flex items-center gap-3">
          {/* Tablet only */}
          <div
            onClick={onToggleSidebar}
            className="w-16 h-12 rounded-r-full bg-[#f7f3ee] shadow-lg absolute left-0 bottom-10 z-50 flex items-center justify-center pr-1.5 text-sm font-bold cursor-pointer"
            aria-label="Toggle sidebar"
          >
            Open
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.1em] text-[#9c9188]">
              Workspace
            </p>
            <h1 className="font-display text-[28px] lg:text-[34px] font-semibold tracking-tight leading-tight text-[#1a1714]">
              Your <em className="not-italic" style={{ color: "#c8862a" }}>Boards</em>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search */}
          <div
            className="flex items-center gap-2 border rounded-[9px] px-3.5 py-2
              focus-within:ring-2 transition-all duration-200
              w-[150px] lg:w-[190px] focus-within:lg:w-[220px]"
            style={{
              background: "rgba(26,23,20,0.06)",
              borderColor: "rgba(26,23,20,0.08)",
            }}
          >
            <span className="text-[#9c9188] text-sm flex-shrink-0">⌕</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="bg-transparent border-none outline-none text-[13px] text-[#1a1714] w-full placeholder:text-[#9c9188]"
            />
          </div>

          {/* New Board button — full text on desktop, icon only on tablet */}
          <button
            onClick={onNewBoard}
            className="flex items-center justify-center gap-1.5 font-semibold
              rounded-[9px] transition-all duration-150 hover:-translate-y-px
              text-[#f7f3ee] hover:text-[#1a1714]
              /* tablet: square icon button */
              w-10 h-10 lg:w-auto lg:h-auto lg:px-4 lg:py-2.5"
            style={{ background: "#1a1714" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#c8862a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a1714")}
            aria-label="New board"
          >
            {/* Plus icon — always visible */}
            <span className="text-lg leading-none">+</span>
            {/* Label — desktop only */}
            <span className="hidden lg:inline text-[13.5px]">New Board</span>
          </button>
        </div>
      </div>

      {/* ── Section label ── */}
      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-[10.5px] uppercase tracking-[0.1em] text-[#9c9188] whitespace-nowrap">
          {filtered.length} board{filtered.length !== 1 ? "s" : ""}
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(26,23,20,0.08)" }} />
      </div>

      {/* ── Boards grid ── */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(264px,1fr))] gap-[18px] mb-12">
        {filtered.map((board) => (
          <div key={board.id} className="group">
            <BoardCard board={board} onClick={() => onBoardClick?.(board)} />
          </div>
        ))}
        <AddBoardCard onClick={onNewBoard} />
      </div>

    </main>
  );
}