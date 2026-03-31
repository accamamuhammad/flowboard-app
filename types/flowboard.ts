// src/types/flowboard.ts
// Mirrors schema.prisma exactly — no extra UI-only fields.

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  taskId: string;
}

export interface Task {
  id: string;
  title: string;
  status: string; 
  label: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  boardId: string;
  subtasks: Subtask[];
}

export interface Board {
  id: string;
  name: string;
  description: string;
  progress: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  color: string;
  tasks: Task[];
}

// Lightweight version used in sidebar board list
export type BoardSummary = Pick<Board, "id" | "name">;

export type TaskStatus = "todo" | "in_progress" | "done";

export const TASK_STATUSES: {
  value: TaskStatus;
  label: string;
  color: string;
}[] = [
  { value: "todo", label: "To Do", color: "#9c9188" },
  { value: "in_progress", label: "In Progress", color: "#c8862a" },
  { value: "done", label: "Done", color: "#3a7d5c" },
];
