"use client";
import React from "react";

interface Active {
  isActive: boolean;
}

const SideBar = ({ isActive }: Active) => {
  return (
    <div
      className={`
        bg-heaven overflow-hidden transition-all duration-300 ease-in-out
        ${isActive 
          ? "fixed z-50 w-[90%] h-72 rounded-xl left-1/2 -translate-x-1/2 top-20 shadow-2xl" 
          : "hidden md:block md:static w-72 h-full"
        }
      `}
    >
      <div className="p-6">
        <h2 className="font-bold text-lg">Menu</h2>
        <p className="text-gray-600">Your sidebar content goes here.</p>
      </div>
    </div>
  );
};

export default SideBar;