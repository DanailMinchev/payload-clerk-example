import { isAdminEnabledRoles } from "./is-admin-enabled-roles";

export const isAdminEnabledRolesOrPublishedStatus = async () => {
  if (await isAdminEnabledRoles()) {
    return true;
  }

  return {
    _status: {
      equals: "published",
    },
  };
};
