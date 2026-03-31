// app/boards/page.tsx
// Server component — fetches real boards from DB for the current user.

import { getBoards } from "@/actions/boards";
import BoardsClient from "./BoardsClient";

export default async function BoardsPage() {
  const boards = await getBoards();
  return <BoardsClient initialBoards={boards as never} />;
}