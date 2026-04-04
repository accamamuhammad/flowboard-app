import { notFound } from "next/navigation";
import { getBoardById } from "@/actions/boards";
import BoardDetailClient from "./BoardDetailClient";

export default async function BoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const board = await getBoardById(id);
  if (!board) notFound();
  return <BoardDetailClient board={board as never} />;
}