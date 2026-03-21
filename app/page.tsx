"use client";
import { useState } from "react";
import SideBar from "./Primary/sideBar";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [toggleSideBar, setToggleSideBar] = useState<boolean>(false);

  return (
    <div className="flex flex-row h-[90vh] w-screen overflow-hidden relative">
      {/* 1. THE OVERLAY/BACKDROP */}
      {toggleSideBar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setToggleSideBar(false)}
        />
      )}

      {/* 2. THE SIDEBAR (Higher Z-index than overlay) */}
      <SideBar isActive={toggleSideBar} />

      {/* Toggle Button */}
      <div
        onClick={() => setToggleSideBar(!toggleSideBar)}
        className="absolute z-50 bottom-16 left-0 cursor-pointer md:hidden bg-heaven border-l-0 border-2 border-newt py-1.5 pl-3 pr-1.5 shadow-lg rounded-r-full"
      >
        {toggleSideBar ? <ChevronLeft size={25} /> : <ChevronRight size={25} />}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-lighthouse">
        <div className="w-250 h-[500vh] p-8">
          <h1 className="text-newt text-2xl">Scrollable Content</h1>
        </div>
      </div>
    </div>
  );
}
