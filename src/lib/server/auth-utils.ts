import { checkRoles as checkRolesUtil } from "@/lib/auth-utils";
import type { Role } from "@/types/globals";

export const checkRoles = async (rolesToCheck: readonly Role[] = []) => {
  const { auth } = await import("@clerk/nextjs/server");
  const { sessionClaims } = await auth();

  return checkRolesUtil(rolesToCheck, sessionClaims?.metadata?.roles);
};
