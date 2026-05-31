"use client";

import { UserProfile, useUser } from "@clerk/nextjs";
import { checkRoles } from "@/lib/auth-utils";
import { ADMIN_ENABLED_ROLES } from "@/constants/auth";
import { AdminIcon } from "@/components/app/icons";
import React from "react";

export default function Page() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const isAdminEnabledRole =
    !!user?.publicMetadata?.roles &&
    checkRoles(ADMIN_ENABLED_ROLES, user.publicMetadata.roles);

  return (
    <div className="flex justify-center">
      <UserProfile path="/profile" routing="path">
        {isAdminEnabledRole && (
          <UserProfile.Link
            label="Admin account"
            labelIcon={<AdminIcon />}
            url="/admin/account"
          />
        )}
      </UserProfile>
    </div>
  );
}
