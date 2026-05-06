"use client";

import { SignInButton as ClerkSignInButton } from "@clerk/nextjs";

export function SignInButton() {
  return (
    <ClerkSignInButton>
      <button className="h-10 cursor-pointer rounded-full border border-black/[.08] px-4 text-sm font-medium text-zinc-900 transition-colors hover:border-transparent hover:bg-black/[.04] sm:h-12 sm:px-5 sm:text-base">
        Login
      </button>
    </ClerkSignInButton>
  );
}
