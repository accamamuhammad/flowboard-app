"use server";

import { prisma } from "../../lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
// 1. Define the shape of your state
export type FormState = {
  success?: boolean;
  error?: string | null;
} | null;

// 2. Apply the type to the prevState argument
export async function createBoard(prevState: FormState, formData: FormData): Promise<FormState> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Authentication required." };
  }

  const name = formData.get("name") as string;

  if (!name || name.length < 2) {
    return { error: "Please enter a valid board name (min 2 chars)." };
  }

  try {
    await prisma.board.create({
      data: {
        name,
        userId, 
      },
    });

    revalidatePath("/dashboard");
    return { success: true, error: null };
  } catch (error) {
    return { error: "Something went wrong on our end." };
  }
}