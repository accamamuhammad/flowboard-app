// app/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";
import ThemeToggle from "./Primary/theme-toggle";
import CreateBoard from "./Primary/newBoard";

export default async function Home() {
  // 1. Get the authenticated user from Clerk
  const { userId } = await auth();
  const user = await currentUser();

  // 2. Sync with Prisma if the user is logged in
  if (userId && user) {
    await db.user.upsert({
      where: { clerkId: userId },
      update: {
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        imageUrl: user.imageUrl,
      },
      create: {
        clerkId: userId,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        imageUrl: user.imageUrl,
      },
    });
  }

  return (
    <div className="w-screen h-screen flex flex-col gap-6 items-center border-8 border-newt-500 justify-center bg-lighthouse">
      <CreateBoard />
      <ThemeToggle />
      
      {/* Show who is logged in */}
      {user && <p className="text-sm font-sans">Logged in as {user.firstName}</p>}
    </div>
  );
}