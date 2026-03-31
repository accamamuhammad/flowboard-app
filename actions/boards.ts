"use server";

// src/actions/boards.ts
// Server actions for Board CRUD.
// Requires: @clerk/nextjs, @prisma/client

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

// ── Create ────────────────────────────────────────────────────
export async function createBoard(name: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const board = await prisma.board.create({
    data: { name, userId },
    include: { tasks: { include: { subtasks: true } } },
  });

  revalidatePath("/boards");
  return board;
}

// ── Update ────────────────────────────────────────────────────
export async function updateBoard(boardId: string, name: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const board = await prisma.board.update({
    where: { id: boardId },
    data: { name },
    include: { tasks: { include: { subtasks: true } } },
  });

  revalidatePath("/boards");
  return board;
}

// ── Delete ────────────────────────────────────────────────────
export async function deleteBoard(boardId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.board.delete({ where: { id: boardId } });
  revalidatePath("/boards");
}

// ── Fetch all boards for current user ─────────────────────────
export async function getBoards() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return prisma.board.findMany({
    where: { userId },
    include: {
      tasks: {
        orderBy: { order: "asc" },
        include: { subtasks: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}