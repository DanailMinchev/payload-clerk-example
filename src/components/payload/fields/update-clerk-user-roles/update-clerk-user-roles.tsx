"use client";

import React, { useState } from "react";
import { ALL_ROLES } from "@/constants/auth";
import { Button, toast } from "@payloadcms/ui";
import { updateClerkUserRoles } from "./actions";

interface UpdateClerkUserRolesProps {
  isAuthorised: boolean;
  clerkUserId: string;
  roles: string[];
}

export const UpdateClerkUserRoles: React.FC<UpdateClerkUserRolesProps> = ({
  isAuthorised,
  clerkUserId,
  roles = [],
}) => {
  const [checkedRoles, setCheckedRoles] = useState(roles);

  const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const value = event.target.value;
    setCheckedRoles(
      checked
        ? [...checkedRoles, value]
        : checkedRoles.filter((item) => item !== value),
    );
  };

  const handleSubmit = async () => {
    const updateClerkUserRolesResponse = await updateClerkUserRoles(
      clerkUserId,
      checkedRoles,
    );

    if (updateClerkUserRolesResponse.isError) {
      toast.error(updateClerkUserRolesResponse.message);
    } else {
      toast.success(updateClerkUserRolesResponse.message);
    }
  };

  return (
    <fieldset>
      <legend>Roles:</legend>
      {ALL_ROLES.map((role) => (
        <div key={role}>
          <input
            id={`${clerkUserId}-${role}-role`}
            type="checkbox"
            value={role}
            checked={checkedRoles.includes(role)}
            disabled={!isAuthorised}
            onChange={handleChangeRole}
          />
          <label htmlFor={`${clerkUserId}-${role}-role`}>{role}</label>
        </div>
      ))}
      <Button size="medium" disabled={!isAuthorised} onClick={handleSubmit}>
        Update roles
      </Button>
    </fieldset>
  );
};

export default UpdateClerkUserRoles;
