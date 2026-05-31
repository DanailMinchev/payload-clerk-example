import type { Role } from "@/types/globals";

export const checkRoles = (
  rolesToCheck: readonly Role[] = [],
  userRoles: readonly Role[] = [],
) => {
  if (Array.isArray(userRoles) && userRoles.length > 0) {
    if (
      rolesToCheck.some((checkRole) => {
        return userRoles.some((userRole) => userRole === checkRole);
      })
    ) {
      return true;
    }
  }

  return false;
};
