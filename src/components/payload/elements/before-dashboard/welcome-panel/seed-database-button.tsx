"use client";

import React, { useState } from "react";
import { Button, toast } from "@payloadcms/ui";
import { useUser } from "@clerk/nextjs";

const SuccessMessage: React.FC = () => <>Database seeded.</>;

export const SeedDatabaseButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeded, setIsSeeded] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  const handleClick = async () => {
    if (isSeeded) {
      toast.info("Database already seeded.");
      return;
    }
    if (isLoading) {
      toast.info("Seeding already in progress.");
      return;
    }
    if (error) {
      toast.error("An error occurred, please refresh and try again.");
      return;
    }

    setIsLoading(true);

    try {
      toast.promise(
        new Promise((resolve, reject) => {
          try {
            fetch("/api/app/seed", { method: "GET" })
              .then((response) => {
                if (response.ok) {
                  resolve(true);
                  setIsSeeded(true);
                } else {
                  reject("An error occurred while seeding.");
                }
                setIsLoading(false);
              })
              .catch((error) => {
                reject(error);
                setIsLoading(false);
              });
          } catch (error) {
            reject(error);
          }
        }),
        {
          loading: "Seeding database ...",
          success: <SuccessMessage />,
          error: "An error occurred while seeding.",
        },
      );
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      setError(error);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Button size="medium" onClick={handleClick} disabled={isLoading}>
        Seed your database
      </Button>
    </div>
  );
};

export default SeedDatabaseButton;
