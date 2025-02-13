import { UIFieldServerComponent, UIFieldServerProps } from "payload";
import UpdateClerkUserRoles from "./update-clerk-user-roles";
import { checkRoles } from "@/lib/server/auth-utils";
import { SUPER_ADMIN_ROLES } from "@/constants/auth";
import { clerkClient } from "@clerk/nextjs/server";

export const UpdateClerkUserRolesField: UIFieldServerComponent = async ({
  data,
}: UIFieldServerProps) => {
  const isAuthorised = await checkRoles(SUPER_ADMIN_ROLES);

  const client = await clerkClient();

  let foundClerkUser;
  try {
    foundClerkUser = await client.users.getUser(data.clerkUserId);
  } catch (exception) {
    console.error(exception);
    return null;
  }

  return (
    <UpdateClerkUserRoles
      isAuthorised={isAuthorised}
      clerkUserId={foundClerkUser.id}
      roles={foundClerkUser.publicMetadata.roles as Array<string>}
    />
  );
};

export default UpdateClerkUserRolesField;
