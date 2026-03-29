import React from "react";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const AuthCard = () => {
  return (
    <header className="flex justify-end items-center p-3 gap-3 h-14">
      <Show when="signed-out">
        <SignInButton>
          <button className="bg-amber-50 text-black rounded-lg font-medium text-xs sm:text-sm h-8 sm:h-10 px-3 sm:px-4 cursor-pointer">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton>
          <button className="bg-white text-black shadow-2xl rounded-lg font-medium text-xs sm:text-sm h-8 sm:h-10 px-3 sm:px-4 cursor-pointer">
            Sign Up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </header>
  );
};

export default AuthCard;
