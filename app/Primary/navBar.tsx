"use client";

import React, { useState } from "react";
import { EllipsisVertical, X, Plus } from "lucide-react";
import NewTask from "./newTask";

const NavBar = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <nav className="w-full h-20 flex flex-row items-center justify-end md:justify-between z-50">
      <h1 className="text-xl pt-1 text-newt font-bold hidden md:block">
        Dashboard
      </h1>
      <div className="flex flex-row gap-2.5 items-center justify-center">
        <EllipsisVertical />
        <div
          onClick={() => setShowModal(true)}
          className="flex md:flex-row md:gap-1.5 text-sm border px-1.5 md:pl-2 md:pr-3 py-1 bg-newt rounded-md text-heaven hover:bg-neutral-50 hover:border-green-900 hover:text-green-900 cursor-pointer"
        >
          <Plus size={22} />
          <button className="hidden md:block">Add New Task</button>
        </div>
      </div>

      {showModal && (
        <div
          className="z-50 fixed inset-0 flex items-center justify-center bg-black/50"
          onClick={() => setShowModal(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-7 right-10 z-10 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={22} />
            </button>
            <NewTask onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
