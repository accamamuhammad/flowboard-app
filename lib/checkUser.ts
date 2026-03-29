import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./db";
import { use } from "react";

// src/lib/checkUser.ts
export const checkUser = async () => {
  const user = await currentUser();
  

  if (!user) return null;

  const loggedInUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  // FIX: If the user IS found, return them. 
  // (You had if (!loggedInUser) which returned null and stopped the function)
  if (loggedInUser) {
    return loggedInUser;
  }

  // Now this will actually be reached if loggedInUser is null
  const newUser = await prisma.user.create({
    data: {
      clerkId: user.id,
      name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newUser;
};