"use client";

import { Plus } from "lucide-react";
import type { Board, Task } from "@/types/flowboard";
import BoardCard, { AddBoardCard } from "./BoardCard";

interface MainContentProps {
  boards: Board[];
  onNewBoard: () => void;
  onBoardEdit: (board: Board) => void;
  onBoardDeleted: (id: string) => void;
  onTaskSaved: (boardId: string, task: Task) => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function MainContent({ boards, onNewBoard, onBoardEdit, onBoardDeleted, onTaskSaved, onToggleSidebar, sidebarOpen }: MainContentProps) {
  return (
    <main style={{ flex: 1, overflowY: "auto", minWidth: 0, padding: "44px 48px 60px" }}>

      {/* Page header */}
      <div className="flex items-end justify-between" style={{ marginBottom: 40 }}>
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <>
              <style>{`
                @media (min-width: 1024px) { .sidebar-toggle-pill { display: none !important; } }
              `}</style>
              <div
                onClick={onToggleSidebar}
                className="sidebar-toggle-pill"
                style={{
                  position: "fixed",
                  left: 0,
                  bottom: 32,
                  zIndex: 50,
                  width: 52,
                  height: 44,
                  borderRadius: "0 22px 22px 0",
                  background: "#1a1714",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "2px 2px 12px rgba(26,23,20,0.25)",
                }}
                aria-label="Toggle sidebar"
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ display: "block", width: 16, height: 1.5, borderRadius: 2, background: "#f7f3ee" }} />
                  <span style={{ display: "block", width: 12, height: 1.5, borderRadius: 2, background: "#f7f3ee" }} />
                  <span style={{ display: "block", width: 16, height: 1.5, borderRadius: 2, background: "#f7f3ee" }} />
                </div>
              </div>
            </>
          )}
          <div>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9c9188", marginBottom: 6 }}>Workspace</p>
            <h1 style={{ fontFamily: "'Lora', serif", fontSize: 34, fontWeight: 600, letterSpacing: "-0.6px", lineHeight: 1.1, color: "#1a1714" }}>
              Your <em style={{ fontStyle: "italic", color: "#c8862a" }}>Boards</em>
            </h1>
          </div>
        </div>

        <button
          suppressHydrationWarning
          onClick={onNewBoard}
          className="flex items-center justify-center gap-1.5 transition-all duration-150 hover:-translate-y-px"
          style={{ background: "#1a1714", color: "#f7f3ee", border: "none", borderRadius: 9, padding: "9px 18px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#c8862a"; e.currentTarget.style.color = "#1a1714"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1714"; e.currentTarget.style.color = "#f7f3ee"; }}
        >
          <Plus size={16} />
          <span>New Board</span>
        </button>
      </div>

      {/* Section label */}
      <div className="flex items-center gap-2.5" style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9c9188", whiteSpace: "nowrap" }}>
          {boards.length} board{boards.length !== 1 ? "s" : ""}
        </span>
        <div style={{ flex: 1, height: 1, background: "rgba(26,23,20,0.08)" }} />
      </div>

      {/* Boards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(264px, 1fr))", gap: 18, marginBottom: 48 }}>
        {boards.map((board) => (
          <BoardCard
            key={board.id}
            board={board}
            onBoardEdit={onBoardEdit}
            onBoardDeleted={onBoardDeleted}
            onTaskSaved={onTaskSaved}
          />
        ))}
        <AddBoardCard onClick={onNewBoard} />
      </div>
    </main>
  );
}