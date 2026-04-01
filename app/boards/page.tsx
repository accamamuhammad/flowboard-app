import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getBoards } from "@/actions/boards";
import BoardsClient from "./BoardsClient";

export default async function BoardsPage() {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const boards = await getBoards();
  return <BoardsClient initialBoards={boards as never} />;
}