"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Board, Task } from "@/types/flowboard";
import BoardCard, { AddBoardCard } from "../components/BoardCard";

const Sidebar = dynamic(() => import("../components/Sidebar"), { ssr: false });

export default function StarredClient({ allBoards }: { allBoards: Board[] }) {
  const [starred, setStarred]   = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebar] = useState(false);
  const [boards]                 = useState<Board[]>(
    (allBoards ?? []).map(b => ({ ...b, tasks: (b.tasks ?? []).map(t => ({ ...t, subtasks: t.subtasks ?? [] })) }))
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem("fb_starred");
      if (saved) setStarred(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  const starredBoards = boards.filter(b => starred.has(b.id));

  return (
    <div
      suppressHydrationWarning
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "#ede8e0", backgroundImage: "repeating-linear-gradient(transparent,transparent 27px,rgba(26,23,20,0.08) 27px,rgba(26,23,20,0.08) 28px)" }}
    >
      <Sidebar boards={boards} isOpen={sidebarOpen} onClose={() => setSidebar(false)} />

      <main style={{ flex: 1, overflowY: "auto", minWidth: 0, padding: "44px 48px 60px" }}>
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9c9188", marginBottom: 6 }}>Workspace</p>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 34, fontWeight: 600, color: "#1a1714", letterSpacing: "-0.6px" }}>
            Starred <em style={{ fontStyle: "italic", color: "#c8862a" }}>Boards</em>
          </h1>
        </div>

        {starredBoards.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9c9188" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>☆</div>
            <p style={{ fontSize: 15, fontWeight: 500, color: "#5a5148", marginBottom: 4 }}>No starred boards yet</p>
            <p style={{ fontSize: 13 }}>Hover a board in the sidebar and click the star to add it here.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5" style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9c9188" }}>
                {starredBoards.length} board{starredBoards.length !== 1 ? "s" : ""}
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(26,23,20,0.08)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(264px, 1fr))", gap: 18 }}>
              {starredBoards.map(board => (
                <BoardCard
                  key={board.id}
                  board={board}
                  onBoardEdit={() => {}}
                  onBoardDeleted={() => {}}
                  onTaskSaved={() => {}}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}