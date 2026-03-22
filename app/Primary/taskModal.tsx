"use client";
import React, { useState, useEffect, useRef } from "react";
import { MoreVertical, ChevronDown } from "lucide-react";

type SubTask = {
  label: string;
  isCompleted: boolean;
};

export type Task = {
  title: string;
  subTasks: SubTask[];
  status: string;
};

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const TaskModal = ({ isOpen, onClose, task }: TaskModalProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  if (!isOpen || !task) return null;

  const completedCount = task.subTasks.filter((s) => s.isCompleted).length;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={() => {
          setShowMenu(false);
          onClose();
        }} 
      />
      
      {/* Modal Content */}
      <div className="relative bg-heaven w-full max-w-md p-8 rounded-lg shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start gap-4 mb-6">
          <h2 className="text-xl font-bold text-foreground leading-tight">{task.title}</h2>
          
          {/* Options Menu Container */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-asphalt hover:text-newt transition-colors pt-1 p-1 cursor-pointer"
            >
              <MoreVertical size={20} />
            </button>

            {/* Dropdown Box */}
            {showMenu && (
              <div className="absolute top-10 right-0 w-40 bg-heaven shadow-md  rounded-lg py-4 z-110 animate-in fade-in slide-in-from-top-2">
                <button 
                  className="w-full text-left px-4 py-1 text-sm font-medium text-asphalt hover:text-newt transition-colors"
                  onClick={() => { console.log("Edit Task"); setShowMenu(false); }}
                >
                  Edit Task
                </button>
                <button 
                  className="w-full text-left px-4 py-1 mt-2 text-sm font-medium text-red-500 hover:opacity-70 transition-colors"
                  onClick={() => { console.log("Delete Task"); setShowMenu(false); }}
                >
                  Delete Task
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-asphalt text-xs font-bold tracking-widest uppercase mb-2.5">
          Subtasks ({completedCount} of {task.subTasks.length})
        </p>

        {/* Subtask List */}
        <div className="space-y-3 mb-6">
          {task.subTasks.map((sub, i) => (
            <label 
              key={i} 
              className="flex items-center gap-4 p-3 bg-lighthouse rounded-md cursor-pointer hover:bg-newt/10 transition-colors group"
            >
              <input 
                type="checkbox" 
                checked={sub.isCompleted}
                readOnly
                className="w-4 h-4 accent-newt cursor-pointer" 
              />
              <span className={`text-sm font-bold transition-all ${
                sub.isCompleted ? "line-through opacity-50 text-asphalt" : "text-foreground"
              }`}>
                {sub.label}
              </span>
            </label>
          ))}
        </div>

        {/* Status Section */}
        <div className="space-y-2.5">
          <p className="text-asphalt text-xs font-bold tracking-widest uppercase">Current Status</p>
          <div className="relative">
            <select 
              defaultValue={task.status}
              className="w-full px-3 py-2.5 bg-heaven border border-asphalt rounded-md appearance-none font-bold text-sm focus:outline-none focus:border-newt cursor-pointer"
            >
              <option value="Todo">Todo</option>
              <option value="Doing">Doing</option>
              <option value="Done">Done</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-newt pointer-events-none" size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;