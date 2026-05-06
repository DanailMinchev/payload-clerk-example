"use client";

import { SignUpButton as ClerkSignUpButton } from "@clerk/nextjs";

export function SignUpButton() {
  return (
    <ClerkSignUpButton>
      <button className="h-10 cursor-pointer rounded-full bg-purple-700 px-4 text-sm font-medium text-white sm:h-12 sm:px-5 sm:text-base">
        Register
      </button>
    </ClerkSignUpButton>
  );
}
