"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function createTask(boardId: string, data: { title: string; status?: string }) {
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

export async function updateTask(taskId: string, data: { title?: string; status?: string; order?: number }) {
  const task = await prisma.task.update({
    where: { id: taskId },
    data,
    include: { subtasks: true },
  });
  revalidatePath("/boards");
  return task;
}

export async function deleteTask(taskId: string) {
  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath("/boards");
}

export async function createSubtask(taskId: string, title: string) {
  const subtask = await prisma.subtask.create({
    data: { title, taskId },
  });
  revalidatePath("/boards");
  return subtask;
}

export async function toggleSubtask(subtaskId: string, completed: boolean) {
  const subtask = await prisma.subtask.update({
    where: { id: subtaskId },
    data: { completed },
  });
  revalidatePath("/boards");
  return subtask;
}

export async function deleteSubtask(subtaskId: string) {
  await prisma.subtask.delete({ where: { id: subtaskId } });
  revalidatePath("/boards");
}