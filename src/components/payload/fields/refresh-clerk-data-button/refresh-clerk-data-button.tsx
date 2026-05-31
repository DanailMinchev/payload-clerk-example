"use client";

import React from "react";
import { refreshClerkData } from "./actions";
import { Button, toast } from "@payloadcms/ui";

interface RefreshClerkDataButtonProps {
  clerkUserId: string;
}

export const RefreshClerkDataButton: React.FC<RefreshClerkDataButtonProps> = ({
  clerkUserId,
}) => {
  const handleOnClick = async () => {
    const refreshClerkDataResponse = await refreshClerkData(clerkUserId);

    if (refreshClerkDataResponse.isError) {
      toast.error(refreshClerkDataResponse.message);
    } else {
      toast.success(refreshClerkDataResponse.message);
    }
  };

  return (
    <Button size="large" onClick={handleOnClick}>
      Refresh Clerk Data
    </Button>
  );
};

export default RefreshClerkDataButton;
