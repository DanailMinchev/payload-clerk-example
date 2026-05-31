import type { UIFieldServerComponent, UIFieldServerProps } from "payload";
import UpdateClerkUserRoles from "./update-clerk-user-roles";
import { checkRoles } from "@/lib/server/auth-utils";
import { SUPER_ADMIN_ROLES } from "@/constants/auth";

export const UpdateClerkUserRolesField: UIFieldServerComponent = async ({
  data,
}: UIFieldServerProps) => {
  const isAuthorised = await checkRoles(SUPER_ADMIN_ROLES);

  if (typeof data?.clerkUserId !== "string") {
    return null;
  }

  const { clerkClient } = await import("@clerk/nextjs/server");
  const client = await clerkClient();

  let foundClerkUser;
  try {
    foundClerkUser = await client.users.getUser(data.clerkUserId);
  } catch {
    return null;
  }

  return (
    <UpdateClerkUserRoles
      isAuthorised={isAuthorised}
      clerkUserId={foundClerkUser.id}
      roles={foundClerkUser.publicMetadata.roles ?? []}
    />
  );
};

export default UpdateClerkUserRolesField;
