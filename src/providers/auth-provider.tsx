import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { enUS } from "@clerk/localizations";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <ClerkProvider localization={enUS}>{children}</ClerkProvider>;
};

export default AuthProvider;
