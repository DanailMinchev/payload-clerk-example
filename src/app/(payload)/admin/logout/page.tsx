"use client";

import { MinimalTemplate } from "@payloadcms/next/templates";
import { LoadingOverlay, useTranslation } from "@payloadcms/ui";
import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

export default function Page() {
  const { t } = useTranslation();
  const { signOut } = useClerk();

  useEffect(() => {
    signOut({ redirectUrl: "/" }).finally(() => {
      window.location.href = "/";
    });
  }, [signOut]);

  return (
    <MinimalTemplate>
      <LoadingOverlay
        animationDuration={"0ms"}
        loadingText={t("authentication:loggingOut")}
      />
    </MinimalTemplate>
  );
}
