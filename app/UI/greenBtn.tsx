import React from 'react'

type Props = {
  title: string;
  disabled?: boolean; // Added optional disabled prop
  type?: "submit" | "button" | "reset"; // Added optional type prop
}

const GreenBtn = ({ title, disabled, type = "button" }: Props) => {
  return (
    <button 
      type={type}
      disabled={disabled}
      className={`text-sm border px-4 py-2 rounded-md transition-all duration-200
        ${disabled 
          ? "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed" 
          : "bg-newt text-heaven border-transparent hover:bg-neutral-50 hover:border-green-900 hover:text-green-900 cursor-pointer"
        }`}
    >
      {title}
    </button>
  );
}

export default GreenBtn;