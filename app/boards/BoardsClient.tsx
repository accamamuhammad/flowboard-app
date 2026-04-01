"use client";

// app/boards/BoardsClient.tsx
// Client shell — NO seed data. Uses only what the server passes in.

import { useState } from "react";
import dynamic from "next/dynamic";
import MainContent from "../components/MainContent";
import CreateBoardModal from "../components/CreateBoardModal";
import type { Board, Task } from "@/types/flowboard";

const Sidebar = dynamic(() => import("../components/Sidebar"), { ssr: false });

interface BoardsClientProps {
  initialBoards: Board[];
}

export default function BoardsClient({ initialBoards }: BoardsClientProps) {
  const [boards, setBoards]          = useState<Board[]>(
    (initialBoards ?? []).map((b) => ({
      ...b,
      tasks: (b.tasks ?? []).map((t) => ({ ...t, subtasks: t.subtasks ?? [] })),
    }))
  );
  const [modalOpen, setModal]        = useState(false);
  const [editingBoard, setEditBoard] = useState<Board | null>(null);
  const [sidebarOpen, setSidebar]    = useState(false);

  function handleBoardSaved(saved: Board) {
    setBoards((prev) => {
      const exists = prev.find((b) => b.id === saved.id);
      return exists
        ? prev.map((b) => b.id === saved.id ? { ...b, name: saved.name } : b)
        : [{ ...saved, tasks: [] }, ...prev];
    });
  }

  function handleBoardDeleted(id: string) {
    setBoards((prev) => prev.filter((b) => b.id !== id));
  }

  function handleTaskSaved(boardId: string, task: Task) {
    setBoards((prev) =>
      prev.map((b) => {
        if (b.id !== boardId) return b;
        const exists = b.tasks.find((t) => t.id === task.id);
        return {
          ...b,
          tasks: exists
            ? b.tasks.map((t) => t.id === task.id ? task : t)
            : [...b.tasks, task],
        };
      })
    );
  }

  return (
    <div
      suppressHydrationWarning
      className="flex h-screen overflow-hidden"
      style={{
        backgroundColor: "#ede8e0",
        backgroundImage:
          "repeating-linear-gradient(transparent,transparent 27px,rgba(26,23,20,0.08) 27px,rgba(26,23,20,0.08) 28px)",
      }}
    >
      <Sidebar
        boards={boards}
        isOpen={sidebarOpen}
        onClose={() => setSidebar(false)}
        onNewBoard={() => { setEditBoard(null); setModal(true); }}
      />

      <MainContent
        boards={boards}
        onNewBoard={() => { setEditBoard(null); setModal(true); }}
        onBoardEdit={(board) => { setEditBoard(board); setModal(true); }}
        onBoardDeleted={handleBoardDeleted}
        onTaskSaved={handleTaskSaved}
        onToggleSidebar={() => setSidebar((o) => !o)}
        sidebarOpen={sidebarOpen}
      />

      <CreateBoardModal
        open={modalOpen}
        board={editingBoard}
        onClose={() => { setModal(false); setEditBoard(null); }}
        onSaved={handleBoardSaved}
      />
    </div>
  );
}