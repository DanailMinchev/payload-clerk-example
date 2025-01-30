import { PayloadRequest } from "payload";
import { isAdminRoles } from "./is-admin-roles";

export const isAdminRolesOrSelf = async ({
  req: { user },
}: {
  req: PayloadRequest;
}) => {
  if (await isAdminRoles()) {
    return true;
  }

  if (user) {
    return {
      createdBy: {
        equals: user.id,
      },
    };
  }

  return false;
};
