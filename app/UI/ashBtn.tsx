// ashBtn.tsx
import React from 'react';

type Props = {
  title: string;
  onClick?: () => void;
  // Add 'type' to the props definition
  type?: "button" | "submit" | "reset"; 
};

export const AshBtn = ({ title, onClick, type = "button" }: Props) => (
  <button 
    type={type} // Pass the type to the HTML button
    onClick={onClick} 
    className="text-sm px-4 py-2 text-asphalt shadow-sm border border-wind rounded-md hover:bg-neutral-100 cursor-pointer transition-colors"
  >
    {title}
  </button>
);