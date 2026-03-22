"use client";
import { useState } from "react";
import SideBar from "./Primary/sideBar";
import TaskModal, { Task } from "./Primary/taskModal";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [toggleSideBar, setToggleSideBar] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Example Task Data - In a real app, this would come from an API or State
  const demoTask: Task = {
    title: "Build UI for Onboarding Form",
    status: "Doing",
    subTasks: [
      { label: "Sign up page", isCompleted: true },
      { label: "Sign in page", isCompleted: false },
      { label: "Welcome page", isCompleted: false },
    ],
  };

  return (
    <div className="flex flex-row h-[90vh] w-screen overflow-hidden relative bg-lighthouse">
      {/* 1. Mobile Backdrop for Sidebar */}
      {toggleSideBar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setToggleSideBar(false)}
        />
      )}

      {/* 2. Sidebar */}
      <SideBar isActive={toggleSideBar} />

      {/* 3. Mobile Toggle Button */}
      <div
        onClick={() => setToggleSideBar(!toggleSideBar)}
        className="fixed z-50 bottom-16 left-0 cursor-pointer md:hidden bg-heaven border-l-0 border-2 border-newt py-2 pl-4 pr-2 shadow-lg rounded-r-full"
      >
        {toggleSideBar ? <ChevronLeft size={24} className="text-newt" /> : <ChevronRight size={24} className="text-newt" />}
      </div>

      {/* 4. Main Content Area */}
      <main className="flex-1 h-full overflow-x-auto xl:overflow-x-hidden overflow-y-hidden">
        <div className="h-full p-8 flex gap-8 items-start min-w-max">
          
          {/* Reusable Column Logic */}
          {[
            { label: "Todo", count: 5, color: "bg-blue-400" },
            { label: "Doing", count: 7, color: "bg-newt" },
            { label: "Done", count: 10, color: "bg-green-400" },
          ].map((col) => (
            <div key={col.label} className="w-80 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${col.color}`} />
                <p className="font-bold text-xs tracking-[0.2em] text-asphalt uppercase">
                  {col.label} ({col.count})
                </p>
              </div>

              {/* Task Card */}
              <button
                onClick={() => setSelectedTask(demoTask)}
                className="w-full bg-heaven rounded-lg p-6 shadow-sm flex flex-col gap-2 items-start text-left hover:shadow-md transition-all group"
              >
                <h3 className="text-foreground font-bold group-hover:text-newt transition-colors">
                  {demoTask.title}
                </h3>
                <p className="text-asphalt text-xs font-bold">
                  {demoTask.subTasks.filter(s => s.isCompleted).length} of {demoTask.subTasks.length} subtasks
                </p>
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* 5. Task Detail Modal */}
      <TaskModal 
        isOpen={!!selectedTask} 
        task={selectedTask} 
        onClose={() => setSelectedTask(null)} 
      />
    </div>
  );
}