"use client";

import React from "react";
import { refreshClerkData } from "./actions";
import { Button, toast } from "@payloadcms/ui";

interface RefreshClerkButtonClientProps {
  clerkUserId: string;
}

export const RefreshClerkDataButtonClient: React.FC<
  RefreshClerkButtonClientProps
> = ({ clerkUserId }) => {
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

export default RefreshClerkDataButtonClient;
