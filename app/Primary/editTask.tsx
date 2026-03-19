"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

// Components
import AshBtn from "../UI/ashBtn";
import GreenBtn from "../UI/greenBtn";

interface Subtask {
  id: number;
  title: string;
  completed: boolean;
}

const options = ["Todo", "Doing", "Done"] as const;
type Option = (typeof options)[number];

// This structure is ready for a DB row
interface TaskData {
  id: string;
  title: string;
  status: Option;
  subtasks: Subtask[];
}

const EditTask: React.FC = () => {
  // EVERYTHING in one state for easy DB syncing later
  const [task, setTask] = useState<TaskData>({
    id: "task-001",
    title: "Build Remaining Components",
    status: "Todo",
    subtasks: [
      { id: 1, title: "Design mockups", completed: true },
      { id: 2, title: "Implement screens", completed: false },
      { id: 3, title: "Write tests", completed: false },
    ],
  });

  // Handler for Subtasks
  const toggleSubtask = (id: number): void => {
    setTask((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    }));
  };

  // Handler for Status (Move To)
  const setStatus = (newStatus: Option): void => {
    setTask((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  const doneCount = task.subtasks.filter((t) => t.completed).length;

  return (
    <section className="w-fit sm:w-96 mx-5 z-40 h-fit flex flex-col p-5 space-y-5 rounded-2xl bg-heaven shadow-xl border border-black/5">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${task.status === "Done" ? "bg-green-500" : "bg-newt"}`}
          />
          <p className="text-xs font-bold text-newt uppercase">{task.status}</p>
        </div>
        <h1 className="text-2xl font-bold text-foreground leading-tight">
          {task.title}
        </h1>
      </div>

      {/* Subtasks Section */}
      <div className="space-y-3">
        <h2 className="opacity-45 font-bold text-foreground font-sans text-xs">
          SUBTASKS ({doneCount}/{task.subtasks.length})
        </h2>

        <div className="space-y-1.5">
          {task.subtasks.map((sub) => (
            <button
              key={sub.id}
              onClick={() => toggleSubtask(sub.id)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all 
                ${sub.completed ? "bg-asphalt/20" : "bg-lighthouse hover:bg-asphalt/30"}`}
            >
              <div
                className={`shrink-0 w-4.5 h-4.5 rounded-md flex items-center justify-center border-2 transition-all
                ${sub.completed ? "bg-newt border-newt" : "bg-transparent border-newt/20"}`}
              >
                {sub.completed && (
                  <Check size={12} className="text-white stroke-[4px]" />
                )}
              </div>

              <span
                className={`text-xs font-semibold truncate
                ${sub.completed ? "line-through opacity-30 italic" : "opacity-80"}`}
              >
                {sub.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Move To Section */}
      <div className="space-y-2">
        <h3 className="opacity-45 font-bold text-foreground font-sans text-xs">
          MOVE TO
        </h3>

        <div className="flex flex-row flex-wrap items-center gap-2">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => setStatus(option)}
              className={`
                px-4 py-2 rounded-lg text-xs font-bold border transition-all
                ${
                  task.status === option
                    ? "bg-lighthouse border-[#4A635D] text-newt shadow-sm"
                    : "bg-heaven text-asphalt border-gray-100 hover:border-gray-300"
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="w-full gap-2.5 flex items-center justify-end pt-2">
        <AshBtn title="Delete" />
        <AshBtn title="Close" />
        <div onClick={() => console.log("Save this to DB:", task)}>
          <GreenBtn title="Edit" />
        </div>
      </div>
    </section>
  );
};

export default EditTask;
