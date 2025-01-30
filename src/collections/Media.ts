import type { CollectionConfig } from "payload";
import { isAdminEnabledRoles } from "./lib/access/is-admin-enabled-roles";
import { isAllowed } from "./lib/access/is-allowed";
import { isAdminRoles } from "./lib/access/is-admin-roles";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    create: isAdminEnabledRoles,
    read: isAllowed,
    update: isAdminRoles,
    delete: isAdminRoles,
    readVersions: isAdminEnabledRoles,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
  upload: true,
};
