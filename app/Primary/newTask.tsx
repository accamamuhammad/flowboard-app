"use client";

import React, { useState } from "react";
import { AshBtn } from "../UI/ashBtn";
import GreenBtn from "../UI/greenBtn";
import { Plus, ChevronDown } from "lucide-react";

type Task = {
  title: string;
  subTasks: string[];
  status: string;
};

type Props = {
  onClose?: () => void;
};

const NewTask = ({ onClose }: Props) => {
  const [toggleStatusBar, setToggleStatusBar] = useState<boolean>(false);
  const [subTasks, setSubTasks] = useState<string[]>(["", "", ""]);
  const [currentStatus, setCurrentStatus] = useState<string>("Todo");
  const [title, setTitle] = useState<string>("");
  const [boardData, setBoardData] = useState<Task[]>([]);

  const addNewSubtask = () => {
    setSubTasks([...subTasks, ""]);
  };

  const removeSubtask = (indexToRemove: number) => {
    setSubTasks(subTasks.filter((_, index) => index !== indexToRemove));
  };

  const handleNewStatus = (newStatus: string) => {
    setCurrentStatus(newStatus);
    setToggleStatusBar(false);
  };

  const handleToggleStatus = () => {
    setToggleStatusBar(!toggleStatusBar);
  };

  const handleSaveData = () => {
    setBoardData([{ title, subTasks, status: currentStatus }]);
    onClose?.();
  };

  return (
    <div className="w-fit sm:w-96 mx-5 z-40 h-fit flex flex-col justify-between p-5 space-y-6 rounded-2xl bg-heaven shadow-xl">
      <h1 className="text-3xl font-serif">Add New Task</h1>
      <div className="space-y-2">
        <h2 className="opacity-45 font-bold text-foreground font-sans text-xs">TITLE</h2>
        <input
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          className="w-full border border-wind pl-3 pb-0.5 h-10 bg-lighthouse rounded-md placeholder:text-sm"
          placeholder="Make the onboarding questions"
        />
      </div>
      <div className="space-y-2.5">
        <h2 className="opacity-45 font-bold text-foreground font-sans text-xs">SUBTASKS</h2>
        {subTasks.map((value, index) => (
          <div key={index} className="h-10 gap-2.5 flex flex-row">
            <input
              type="text"
              value={value}
              onChange={(e) => {
                const newTasks = [...subTasks];
                newTasks[index] = e.target.value;
                setSubTasks(newTasks);
              }}
              className="w-full border border-wind pl-3 pb-0.5 h-10 bg-lighthouse rounded-md placeholder:text-sm"
              placeholder="Subtask description"
            />
            <button
              onClick={() => removeSubtask(index)}
              className="px-3 text-lg pb-1 rounded-md border-asphalt text-asphalt border h-full flex items-center justify-center"
            >
              x
            </button>
          </div>
        ))}
        <button
          onClick={addNewSubtask}
          className="flex mt-2.5 gap-0.5 text-sm flex-row items-center justify-center text-newt cursor-pointer"
        >
          <Plus size={18} className="mt-0.5" />
          Add subtask
        </button>
      </div>
      <div className="space-y-2 relative">
        <h2 className="opacity-45 font-bold text-foreground font-sans text-xs">STATUS</h2>
        <div
          onClick={handleToggleStatus}
          className="w-full border border-wind px-5 pl-3 pb-0.5 h-10 bg-lighthouse rounded-md flex flex-row justify-between items-center"
        >
          <p className="text-sm text-moor">{currentStatus}</p>
          <ChevronDown size={20} className="text-newt mt-0.5" />
        </div>
        <div
          className={`${toggleStatusBar ? "flex flex-col gap-2 px-1.5 py-2 w-full top-18 absolute border border-wind bg-lighthouse rounded-md z-50 text-sm cursor-pointer" : "hidden"}`}
        >
          {["Todo", "Doing", "Done"].map((status) => (
            <p
              key={status}
              onClick={() => handleNewStatus(status)}
              className="w-full text-newt hover:opacity-55"
            >
              {status}
            </p>
          ))}
        </div>
      </div>
      <div className="w-full gap-2.5 flex items-center justify-end">
        <AshBtn title="Cancel" onClick={onClose} />
        <div onClick={handleSaveData}>
          <GreenBtn title="Create Board" />
        </div>
      </div>
    </div>
  );
};

export default NewTask;