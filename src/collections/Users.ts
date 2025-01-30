import type { CollectionConfig } from "payload";
import { ClerkAuthStrategy } from "./lib/auth/clerk-strategy";
import { isForbidden } from "./lib/access/is-forbidden";
import { isAllowed } from "./lib/access/is-allowed";
import { isAdminEnabledRoles } from "./lib/access/is-admin-enabled-roles";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "clerkUserId",
    hidden: true,
  },
  access: {
    create: isForbidden,
    read: isAllowed,
    update: isForbidden,
    delete: isForbidden,
    admin: isAdminEnabledRoles,
    unlock: isForbidden,
    readVersions: isForbidden,
  },
  auth: {
    disableLocalStrategy: true,
    strategies: [ClerkAuthStrategy],
  },
  fields: [
    {
      name: "clerkUserId",
      type: "text",
      label: "Clerk userId",
      required: true,
      index: true,
      // unique: true,
    },
  ],
};
