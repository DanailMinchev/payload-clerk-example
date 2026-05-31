"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOutIcon } from "@payloadcms/ui";
import React from "react";

export const LogOutButton: React.FC = () => {
  const { signOut } = useClerk();

  const handleOnClick = (event: React.MouseEvent) => {
    event.preventDefault();
    signOut({ redirectUrl: "/" }).finally(() => {
      window.location.href = "/";
    });
  };

  return (
    <a href="#" onClick={handleOnClick}>
      <LogOutIcon />
    </a>
  );
};

export default LogOutButton;
