"use client";

// src/app/boards/page.tsx

import { useState } from "react";
import dynamic from "next/dynamic";
import MainContent from "./components/MainContent";
import CreateBoardModal from "./components/CreateBoardModal";
import type { Board, BoardColor } from "@/types/flowboard";

const Sidebar = dynamic(() => import("./components/Sidebar"), { ssr: false });

const SEED_BOARDS: Board[] = [
  {
    id: "1", name: "Product Roadmap", emoji: "🗺️", color: "amber", progress: 42,
    description: "Q3–Q4 features, milestones and release planning.",
    tasks: [
      { id: "t1", label: "User auth refactor",  done: true,  subtaskDone: 4, subtaskCount: 4 },
      { id: "t2", label: "Onboarding redesign", done: false, subtaskDone: 2, subtaskCount: 5 },
      { id: "t3", label: "Analytics dashboard", done: false, subtaskDone: 0, subtaskCount: 3 },
    ],
    members: [
      { id: "m1", initials: "A", color: "#fde9c4" },
      { id: "m2", initials: "K", color: "#c6dff5" },
      { id: "m3", initials: "M", color: "#c8e8d8" },
    ],
  },
  {
    id: "2", name: "Design System", emoji: "🎨", color: "green", progress: 71,
    description: "Component library, tokens, and guidelines.",
    tasks: [
      { id: "t4", label: "Color token audit", done: true,  subtaskDone: 3, subtaskCount: 3 },
      { id: "t5", label: "Button component",  done: true,  subtaskDone: 6, subtaskCount: 6 },
      { id: "t6", label: "Form elements",     done: false, subtaskDone: 1, subtaskCount: 8 },
    ],
    members: [
      { id: "m4", initials: "S", color: "#c8e8d8" },
      { id: "m5", initials: "J", color: "#fde9c4" },
    ],
  },
  {
    id: "3", name: "Marketing Q2", emoji: "📣", color: "blue", progress: 28,
    description: "Campaigns, content calendar, and growth experiments.",
    tasks: [
      { id: "t7", label: "Launch email sequence", done: false, subtaskDone: 3, subtaskCount: 7 },
      { id: "t8", label: "Social media content",  done: false, subtaskDone: 0, subtaskCount: 4 },
      { id: "t9", label: "Brand guidelines",      done: true,  subtaskDone: 5, subtaskCount: 5 },
    ],
    members: [
      { id: "m6", initials: "T", color: "#c6dff5" },
      { id: "m7", initials: "P", color: "#e8c6f5" },
      { id: "m8", initials: "R", color: "#fde9c4" },
    ],
  },
  {
    id: "4", name: "Launch Plan", emoji: "🚀", color: "rose", progress: 85,
    description: "Coordinated go-live checklist and stakeholder comms.",
    tasks: [
      { id: "t10", label: "Staging environment", done: true,  subtaskDone: 4, subtaskCount: 4 },
      { id: "t11", label: "QA sign-off",         done: true,  subtaskDone: 7, subtaskCount: 7 },
      { id: "t12", label: "Announce to users",   done: false, subtaskDone: 0, subtaskCount: 2 },
    ],
    members: [
      { id: "m9",  initials: "N", color: "#f5c6c6" },
      { id: "m10", initials: "C", color: "#c8e8d8" },
    ],
  },
  {
    id: "5", name: "Bug Tracker", emoji: "🐞", color: "purple", progress: 33,
    description: "Active issues and regressions across all environments.",
    tasks: [
      { id: "t13", label: "Login loop on Safari", done: false, subtaskDone: 1, subtaskCount: 2 },
      { id: "t14", label: "Broken image uploads", done: false, subtaskDone: 0, subtaskCount: 3 },
      { id: "t15", label: "API timeout fix",      done: true,  subtaskDone: 2, subtaskCount: 2 },
    ],
    members: [
      { id: "m11", initials: "L", color: "#e8c6f5" },
      { id: "m12", initials: "D", color: "#c6dff5" },
    ],
  },
];

export default function BoardsPage() {
  const [boards, setBoards]     = useState<Board[]>(SEED_BOARDS);
  const [modalOpen, setModal]   = useState(false);
  const [sidebarOpen, setSidebar] = useState(false);

  function handleCreate(data: { name: string; description: string; emoji: string; color: BoardColor }) {
    setBoards((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        emoji: data.emoji,
        color: data.color,
        progress: 0,
        tasks: [],
        members: [],
      },
    ]);
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
        userName="Alex Okafor"
        userInitials="AO"
        isOpen={sidebarOpen}
        onClose={() => setSidebar(false)}
      />

      <MainContent
        boards={boards}
        onNewBoard={() => setModal(true)}
        onToggleSidebar={() => setSidebar((o) => !o)}
        sidebarOpen={sidebarOpen}
      />

      <CreateBoardModal
        open={modalOpen}
        onClose={() => setModal(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}