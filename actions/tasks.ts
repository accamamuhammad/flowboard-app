"use server";

// src/actions/tasks.ts
// Server actions for Task + Subtask CRUD.

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

// ── Create task ───────────────────────────────────────────────
export async function createTask(
  boardId: string,
  data: { title: string; status?: string }
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Verify board belongs to user
  const board = await prisma.board.findFirst({ where: { id: boardId, userId } });
  if (!board) throw new Error("Board not found");

  // Get max order
  const last = await prisma.task.findFirst({
    where: { boardId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const task = await prisma.task.create({
    data: {
      title: data.title,
      status: data.status ?? "todo",
      order: (last?.order ?? -1) + 1,
      boardId,
    },
    include: { subtasks: true },
  });

  revalidatePath("/boards");
  return task;
}

// ── Update task ───────────────────────────────────────────────
export async function updateTask(
  taskId: string,
  data: { title?: string; status?: string; order?: number }
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const task = await prisma.task.update({
    where: { id: taskId },
    data,
    include: { subtasks: true },
  });

  revalidatePath("/boards");
  return task;
}

// ── Delete task ───────────────────────────────────────────────
export async function deleteTask(taskId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath("/boards");
}

// ── Create subtask ────────────────────────────────────────────
export async function createSubtask(taskId: string, title: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const subtask = await prisma.subtask.create({
    data: { title, taskId },
  });

  revalidatePath("/boards");
  return subtask;
}

// ── Toggle subtask ────────────────────────────────────────────
export async function toggleSubtask(subtaskId: string, completed: boolean) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const subtask = await prisma.subtask.update({
    where: { id: subtaskId },
    data: { completed },
  });

  revalidatePath("/boards");
  return subtask;
}

// ── Delete subtask ────────────────────────────────────────────
export async function deleteSubtask(subtaskId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.subtask.delete({ where: { id: subtaskId } });
  revalidatePath("/boards");
}