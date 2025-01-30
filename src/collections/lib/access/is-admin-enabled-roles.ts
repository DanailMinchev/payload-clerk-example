import { checkRoles } from "@/lib/server/auth-utils";
import { ADMIN_ENABLED_ROLES } from "@/constants/auth";

export const isAdminEnabledRoles = () => checkRoles(ADMIN_ENABLED_ROLES);
