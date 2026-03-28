// src/types/flowboard.ts
// Shared TypeScript types used across all Flowboard components.

export type BoardColor = "amber" | "green" | "blue" | "rose" | "purple";

export interface TaskItem {
  id: string;
  label: string;
  done: boolean;
  subtaskCount: number;   // total subtasks
  subtaskDone: number;    // completed subtasks
}

export interface Member {
  id: string;
  initials: string;
  color: string; // tailwind bg color class, e.g. "bg-amber-pale"
}

export interface Board {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: BoardColor;
  progress: number;       // 0–100
  tasks: TaskItem[];
  members: Member[];
}

export interface NavItem {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}