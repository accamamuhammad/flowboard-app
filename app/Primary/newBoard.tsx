"use client";

import { useEffect, useState } from "react";

import { AshBtn } from "../UI/ashBtn";
import GreenBtn from "../UI/greenBtn";

const CreateBoard = () => {
  const [boardName, setBoardName] = useState<string>("");

  return (
    <div className="z-50 w-96 h-fit flex flex-col justify-between px-5 py-4 space-y-4 rounded-2xl bg-heaven shadow-xl">
      {/* Title */}
      <h1 className="text-3xl font-serif">Create New Board</h1>

      {/* Input Board Name */}
      <div className="space-y-2">
        <h2 className="opacity-45 font-bold text-foreground font-sans text-xs">
          BOARD NAME
        </h2>

        <input
          type="text"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          className="w-full border border-wind pl-3 pb-0.5 h-10 bg-lighthouse rounded-md placeholder:text-sm"
          placeholder="Web Design"
        />
      </div>

      {/* Buttons */}
      <div className="w-full gap-2.5 flex items-center justify-end">
        <AshBtn title="Cancel" />
        <GreenBtn title="Create Board" />
      </div>
    </div>
  );
};

export default CreateBoard;