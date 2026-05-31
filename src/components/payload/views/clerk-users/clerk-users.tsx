import type { AdminViewServerProps } from "payload";
import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import React from "react";
import { redirect } from "next/navigation";
import { SearchUsers } from "./search-users";
import { UpdateUserRolesForm } from "./update-user-roles-form";
import { checkRoles } from "@/lib/server/auth-utils";
import { SUPER_ADMIN_ROLES } from "@/constants/auth";

const getSearchValue = (searchParams: AdminViewServerProps["searchParams"]) => {
  const search = searchParams?.search;

  if (Array.isArray(search)) {
    return search.at(0) ?? "";
  }

  return search ?? "";
};

export const ClerkUsers: React.FC<AdminViewServerProps> = async ({
  initPageResult,
  params,
  searchParams,
}) => {
  if (!(await checkRoles(SUPER_ADMIN_ROLES))) {
    redirect("/");
  }

  const { clerkClient } = await import("@clerk/nextjs/server");
  const client = await clerkClient();
  const search = getSearchValue(searchParams);

  const users = search
    ? (await client.users.getUserList({ query: search })).data
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
        <h1>Clerk users</h1>

        <SearchUsers defaultSearchValue={search} />

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
                roles={user.publicMetadata.roles ?? []}
              />
            </div>
          );
        })}
      </Gutter>
    </DefaultTemplate>
  );
};

export default ClerkUsers;
