import { getBoards } from "@/actions/boards";
import StarredClient from "./StarredClient";

export default async function StarredPage() {
  const boards = await getBoards();
  return <StarredClient allBoards={boards as never} />;
}