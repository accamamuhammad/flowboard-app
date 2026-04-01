import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getBoards } from "@/actions/boards";
import StarredClient from "./StarredClient";

export default async function StarredPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const boards = await getBoards();
  return <StarredClient allBoards={boards as never} />;
}