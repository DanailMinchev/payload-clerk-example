"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { checkRoles } from "@/lib/server/auth-utils";
import { SUPER_ADMIN_ROLES } from "@/constants/auth";

export interface UpdateClerkUserRolesState {
  isError: boolean;
  message: string;
}

export async function updateClerkUserRoles(
  clerkUserId: string,
  roles: string[] = [],
): Promise<UpdateClerkUserRolesState> {
  if (!(await checkRoles(SUPER_ADMIN_ROLES))) {
    return {
      isError: true,
      message: "Not Authorized",
    };
  }

  if (roles.length === 0) {
    return {
      isError: true,
      message: "You must choose at least one role",
    };
  }

  const client = await clerkClient();

  try {
    await client.users.updateUser(clerkUserId, {
      publicMetadata: { roles },
    });
  } catch (exception) {
    console.error(exception);
    return {
      isError: true,
      message: "Error updating Clerk user",
    };
  }

  revalidatePath(`/admin/account`);
  revalidatePath(`/admin/collections/users/${clerkUserId}`);
  revalidatePath("/admin/clerk-users");

  return {
    isError: false,
    message: "Roles updated successfully.",
  };
}
