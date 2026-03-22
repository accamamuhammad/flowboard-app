"use client";

import { useActionState, useEffect } from "react";
import { createBoard } from "../actions/create-board";

import { AshBtn } from "../UI/ashBtn";
import GreenBtn from "../UI/greenBtn";

const CreateBoard = ({ onClose }: { onClose?: () => void }) => {
  // state will catch the { success, error } returned by your action
  const [state, formAction, isPending] = useActionState(createBoard, null);

  // Close the modal or clear input if creation is successful
  useEffect(() => {
    if (state?.success && onClose) {
      onClose();
    }
  }, [state, onClose]);

  return (
    <form action={formAction} className="z-50 w-96 h-fit flex flex-col justify-between px-5 py-4 space-y-4 rounded-2xl bg-heaven shadow-xl border border-wind/20">
      {/* Title */}
      <h1 className="text-3xl font-serif">Create New Board</h1>

      {/* Input Board Name */}
      <div className="space-y-2">
        <h2 className="opacity-45 font-bold text-foreground font-sans text-xs uppercase tracking-wider">
          Board Name
        </h2>

        <input
          type="text"
          name="name" // Important: Used by FormData
          className="w-full border border-wind pl-3 pb-0.5 h-10 bg-lighthouse rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-green-500 transition-all"
          placeholder="Web Design"
          required
        />
      </div>

      {/* Error Message Display */}
      {state?.error && (
        <p className="text-red-500 text-xs font-medium">{state.error}</p>
      )}

      {/* Buttons */}
      <div className="w-full gap-2.5 flex items-center justify-end">
        <AshBtn 
          title="Cancel" 
          onClick={onClose} 
          type="button" 
        />
        <GreenBtn 
          title={isPending ? "Creating..." : "Create Board"} 
          disabled={isPending}
          type="submit" // Ensure your GreenBtn component passes this type to the <button>
        />
      </div>
    </form>
  );
};

export default CreateBoard;