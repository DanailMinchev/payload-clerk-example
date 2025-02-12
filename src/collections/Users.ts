import type { CollectionConfig } from "payload";
import { ClerkAuthStrategy } from "./lib/auth/clerk-strategy";
import { isForbidden } from "./lib/access/is-forbidden";
import { isAdminEnabledRoles } from "./lib/access/is-admin-enabled-roles";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "clerkUserId",
    hidden: false,
  },
  access: {
    create: isForbidden,
    read: isAdminEnabledRoles,
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
      unique: true,
    },
    {
      name: "firstName",
      type: "text",
      label: "First name",
    },
    {
      name: "lastName",
      type: "text",
      label: "Last name",
    },
    {
      name: "emailAddresses",
      type: "text",
      label: "Email addresses",
      hasMany: true,
    },
    {
      name: "phoneNumbers",
      type: "text",
      label: "Phone numbers",
      hasMany: true,
    },
    {
      name: "refreshClerkDataButton",
      type: "ui",
      admin: {
        components: {
          Field: {
            path: "@/components/payload/fields/refresh-clerk-data-button/refresh-clerk-data-button#RefreshClerkDataButton",
          },
        },
        position: "sidebar",
      },
    },
  ],
};
