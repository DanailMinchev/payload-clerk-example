import { ClerkProvider } from "@clerk/nextjs";
import { enUS } from "@clerk/localizations";
import React from "react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <ClerkProvider localization={enUS}>{children}</ClerkProvider>;
};

export default AuthProvider;
