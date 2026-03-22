"use client";
import React, { useState } from "react";
import ThemeToggle from "./theme-toggle";
import NewBoard from "./newBoard";
import { EyeOff, ChevronRight, LayoutDashboard, X } from "lucide-react";

interface SidebarProps {
  isActive: boolean;
  onClose?: () => void;
}

const SideBar = ({ isActive, onClose }: SidebarProps) => {
  const [status, setStatus] = useState<boolean>(false); // Sidebar hidden/shown state
  const [isNewBoardOpen, setIsNewBoardOpen] = useState<boolean>(false); // Modal state

  return (
    <>
      {/* 1. Sidebar Backdrop (Mobile Only) */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isActive
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* 2. Main Sidebar */}
      <aside
        className={`
          transition-all duration-500 ease-in-out overflow-hidden flex flex-col bg-heaven
          ${
            isActive
              ? "fixed z-50 w-[90%] h-auto max-h-[80vh] rounded-xl left-[5%] -translate-x-1/2 top-20 shadow-2xl"
              : "relative h-full hidden md:flex border-r-2 border-lighthouse"
          }
          /* Desktop Toggle Logic: width 0 + translate */
          ${!isActive && status ? "w-0 opacity-0 -translate-x-full border-none" : "w-72 opacity-100 translate-x-0"}
        `}
      >
        {/* INNER WRAPPER: This prevents content from 'squishing' while the width animates to 0 */}
        <div className="min-w-[288px] h-full flex flex-col">
          <nav className="w-full pt-9 flex flex-col h-full justify-between pb-5">
            <div className="flex flex-col">
              <h2 className="font-bold text-sm tracking-widest text-asphalt pl-5 mb-5 uppercase">
                All Boards (3)
              </h2>

              <ul className="w-full flex flex-col gap-1">
                <li className="w-[90%] flex items-center gap-3 bg-newt text-white py-3.5 pl-5 rounded-r-full cursor-pointer">
                  <LayoutDashboard size={20} />
                  <span className="font-bold">Agency Launch</span>
                </li>

                {["Marketing Plan", "Roadmap"].map((board) => (
                  <li
                    key={board}
                    className="w-[90%] flex items-center gap-3 text-asphalt hover:bg-green-50 hover:text-newt py-3.5 pl-5 rounded-r-full cursor-pointer transition-all"
                  >
                    <LayoutDashboard size={20} />
                    <span className="font-bold">{board}</span>
                  </li>
                ))}

                <li className="w-[90%] py-3.5 pl-5">
                  <button
                    onClick={() => setIsNewBoardOpen(true)}
                    className="flex items-center gap-3 text-newt font-bold hover:opacity-70 transition-opacity"
                  >
                    <LayoutDashboard size={20} />+ Create New Board
                  </button>
                </li>
              </ul>
            </div>

            <footer className="space-y-6 flex flex-col items-center mt-auto">
              <ThemeToggle />
              <button
                onClick={() => setStatus(true)}
                className="hidden md:flex w-full pl-18 gap-3 items-center text-asphalt font-bold hover:text-newt transition-colors"
              >
                <EyeOff size={20} />
                <span>Hide Sidebar</span>
              </button>
            </footer>
          </nav>
        </div>
      </aside>

      {/* 3. Re-open Sidebar Button (Desktop) */}
      <button
        onClick={() => setStatus(false)}
        className={`fixed left-0 bottom-12 z-40 bg-newt w-14 h-12 rounded-r-full text-white hidden md:flex items-center justify-center shadow-md transition-all duration-500 ${
          status ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ChevronRight size={24} />
      </button>

      {/* 4. NEW BOARD MODAL OVERLAY */}
      <div
        className={`fixed inset-0 z-60 flex items-center justify-center transition-all duration-300 ${
          isNewBoardOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Modal Backdrop (dark blur) */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsNewBoardOpen(false)}
        />

        {/* Modal Content Container */}
        <div
          className={`relative bg-heaven w-fit rounded-lg shadow-2xl transition-transform duration-300 ${
            isNewBoardOpen
              ? "scale-100 translate-y-0"
              : "scale-95 translate-y-10"
          }`}
        >
          {/* Close "X" Mark */}
          <button
            onClick={() => setIsNewBoardOpen(false)}
            className="absolute top-6 cursor-pointer right-5 text-asphalt hover:text-newt transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          <NewBoard />
        </div>
      </div>
    </>
  );
};

export default SideBar;
