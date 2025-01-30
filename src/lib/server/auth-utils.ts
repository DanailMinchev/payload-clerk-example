import { Role } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";
import { checkRoles as checkRolesUtil } from "@/lib/auth-utils";

export const checkRoles = async (rolesToCheck: Role[] = []) => {
  const { sessionClaims } = await auth();

  return checkRolesUtil(rolesToCheck, sessionClaims?.metadata?.roles);
};
