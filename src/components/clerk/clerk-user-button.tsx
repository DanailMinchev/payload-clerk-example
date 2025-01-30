"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import React from "react";
import { checkRoles } from "@/lib/auth-utils";
import { Role } from "@/types/globals";
import { ADMIN_ENABLED_ROLES } from "@/constants/auth";
import { AdminIcon } from "@/components/app/icons";

export const ClerkUserButton: React.FC = () => {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return null;
  }

  const isAdminEnabledRole =
    !!user?.publicMetadata?.roles &&
    checkRoles(ADMIN_ENABLED_ROLES, user.publicMetadata.roles as Array<Role>);

  return (
    <>
      <SignedOut>
        <SignInButton>
          <button className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-50">
            Sign in
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton userProfileMode="navigation" userProfileUrl="/profile">
          {isAdminEnabledRole && (
            <UserButton.MenuItems>
              <UserButton.Link
                label="Admin panel"
                labelIcon={<AdminIcon />}
                href="/admin"
              />
            </UserButton.MenuItems>
          )}
        </UserButton>
      </SignedIn>
    </>
  );
};

export default ClerkUserButton;
