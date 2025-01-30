import type { AdminViewProps } from "payload";
import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import React from "react";
import { redirect } from "next/navigation";
import { SearchUsers } from "./search-users";
import { clerkClient } from "@clerk/nextjs/server";
import { UpdateUserRolesForm } from "./update-user-roles-form";
import { checkRoles } from "@/lib/server/auth-utils";
import { SUPER_ADMIN_ROLES } from "@/constants/auth";

export const ClerkUsers: React.FC<AdminViewProps> = async ({
  initPageResult,
  params,
  searchParams,
}) => {
  if (!(await checkRoles(SUPER_ADMIN_ROLES))) {
    redirect("/");
  }

  const client = await clerkClient();

  const users = searchParams.search
    ? (await client.users.getUserList({ query: searchParams.search as string }))
        .data
    : [];

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <h1>Users</h1>

        <SearchUsers defaultSearchValue={searchParams.search as string} />

        {users.map((user) => {
          return (
            <div key={user.id} style={{ padding: "10px" }}>
              <div>
                {user.firstName} {user.lastName}
              </div>

              <div>
                {
                  user.emailAddresses.find(
                    (email) => email.id === user.primaryEmailAddressId,
                  )?.emailAddress
                }
              </div>

              <UpdateUserRolesForm
                userId={user.id}
                roles={user.publicMetadata.roles as Array<string>}
              />
            </div>
          );
        })}
      </Gutter>
    </DefaultTemplate>
  );
};

export default ClerkUsers;
