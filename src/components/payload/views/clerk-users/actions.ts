"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ALL_ROLES, SUPER_ADMIN_ROLES } from "@/constants/auth";
import { checkRoles } from "@/lib/server/auth-utils";
import type { Role } from "@/types/globals";

const updateRolesSchema = z.object({
  roles: z.enum(ALL_ROLES).array(),
});

export interface UpdateUserRolesState {
  errors: {
    roles?: string[];
  };
  roles: Role[] | null;
  message: string | null;
}

export async function updateRoles(
  userId: string,
  _prevState: UpdateUserRolesState,
  formData: FormData,
): Promise<UpdateUserRolesState> {
  if (!(await checkRoles(SUPER_ADMIN_ROLES))) {
    return {
      errors: {},
      roles: null,
      message: "Not Authorized",
    };
  }

  // Validate form fields using Zod
  const validatedFields = updateRolesSchema.safeParse({
    roles: formData.getAll("roles"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
      roles: null,
      message: "Error. Failed to update roles.",
    };
  }

  // Prepare data
  const { roles } = validatedFields.data;

  const { clerkClient } = await import("@clerk/nextjs/server");
  const client = await clerkClient();

  try {
    const result = await client.users.updateUserMetadata(userId, {
      publicMetadata: { roles },
    });

    revalidatePath("/admin/clerk-users");

    return {
      errors: {},
      roles: result.publicMetadata.roles ?? [],
      message: "Updated successfully.",
    };
  } catch (error) {
    return {
      errors: {},
      roles: null,
      message:
        error instanceof Error
          ? error.message
          : "Error. Failed to update roles.",
    };
  }
}
