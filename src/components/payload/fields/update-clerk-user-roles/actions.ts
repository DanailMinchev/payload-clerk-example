"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { checkRoles } from "@/lib/server/auth-utils";
import { ALL_ROLES, SUPER_ADMIN_ROLES } from "@/constants/auth";
import type { Role } from "@/types/globals";

const updateClerkUserRolesSchema = z.object({
  roles: z.enum(ALL_ROLES).array(),
});

export interface UpdateClerkUserRolesState {
  isError: boolean;
  message: string;
}

export async function updateClerkUserRoles(
  clerkUserId: string,
  roles: Role[] = [],
): Promise<UpdateClerkUserRolesState> {
  if (!(await checkRoles(SUPER_ADMIN_ROLES))) {
    return {
      isError: true,
      message: "Not Authorized",
    };
  }

  const validatedFields = updateClerkUserRolesSchema.safeParse({ roles });

  if (!validatedFields.success) {
    return {
      isError: true,
      message: "Invalid roles.",
    };
  }

  const { clerkClient } = await import("@clerk/nextjs/server");
  const client = await clerkClient();

  try {
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: { roles: validatedFields.data.roles },
    });
  } catch {
    return {
      isError: true,
      message: "Error updating Clerk user",
    };
  }

  revalidatePath(`/admin/account`);
  revalidatePath("/admin/collections/users");
  revalidatePath("/admin/clerk-users");

  return {
    isError: false,
    message: "Roles updated successfully.",
  };
}
