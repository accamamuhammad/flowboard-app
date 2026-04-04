"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

const TEMP_USER_ID = "temp_user";

export async function createBoard(name: string) {
  const board = await prisma.board.create({
    data: { name, userId: TEMP_USER_ID },
    include: { tasks: { include: { subtasks: true } } },
  });
  revalidatePath("/boards");
  return board;
}

export async function updateBoard(boardId: string, name: string) {
  const board = await prisma.board.update({
    where: { id: boardId },
    data: { name },
    include: { tasks: { include: { subtasks: true } } },
  });
  revalidatePath("/boards");
  return board;
}

export async function deleteBoard(boardId: string) {
  await prisma.board.delete({ where: { id: boardId } });
  revalidatePath("/boards");
}

export async function getBoards() {
  return prisma.board.findMany({
    where: { userId: TEMP_USER_ID },
    include: {
      tasks: {
        orderBy: { order: "asc" },
        include: { subtasks: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBoardById(boardId: string) {
  return prisma.board.findFirst({
    where: { id: boardId },
    include: {
      tasks: {
        orderBy: { order: "asc" },
        include: { subtasks: true },
      },
    },
  });
}