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
      <section className="flex-1 pt-2 overflow-auto bg-lighthouse">
        <div className="w-fit lg:w-full min-h-[90vh] max-h-[500vh] p-8 flex gap-10 flex-row items-start justify-center">
          {/* Todo Column */}
          <div className="xl:w-[33%] flex gap-5 flex-col items-start justify-center">
            <p className="font-medium text-base tracking-widest text-asphalt">
              Todo (5)
            </p>
            <div className="w-72 xl:w-full bg-heaven rounded-md flex flex-col p-5 gap-2.5 items-start justify-center">
              <h1 className="text-foreground font-bold">
                Build UI for Onboarding Form
              </h1>
              <span className="text-neutral-500 text-sm font-bold">
                1 of 3 substacks
              </span>
            </div>
          </div>
          {/* Doing Column */}
          <div className="xl:w-[33%] flex gap-5 flex-col items-start justify-center">
            <p className="font-medium text-base tracking-widest text-asphalt">
              Doing (7)
            </p>
            <div className="w-72 xl:w-full bg-heaven rounded-md flex flex-col p-5 gap-2.5 items-start justify-center">
              <h1 className="text-foreground font-bold">
                Build UI for Onboarding Form
              </h1>
              <span className="text-neutral-500 text-sm font-bold">
                1 of 3 substacks
              </span>
            </div>
          </div>
          {/* Done Column */}
          <div className="xl:w-[33%] flex gap-5 flex-col items-start justify-center">
            <p className="font-medium text-base tracking-widest text-asphalt">
              Done (10)
            </p>
            <div className="w-72 xl:w-full bg-heaven rounded-md flex flex-col p-5 gap-2.5 items-start justify-center">
              <h1 className="text-foreground font-bold">
                Build UI for Onboarding Form
              </h1>
              <span className="text-neutral-500 text-sm font-bold">
                1 of 3 substacks
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
