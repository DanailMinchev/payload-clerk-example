"use client";

import { updateRoles, UpdateUserRolesState } from "./actions";
import React, { useActionState } from "react";
import { ALL_ROLES } from "@/constants/auth";
import { Button } from "@payloadcms/ui";

interface UpdateUserRolesFormProps {
  userId: string;
  roles: string[];
}

export const UpdateUserRolesForm: React.FC<UpdateUserRolesFormProps> = ({
  userId,
  roles = [],
}: UpdateUserRolesFormProps) => {
  const initialState: UpdateUserRolesState = {
    errors: {},
    roles,
    message: null,
  };
  const updateRolesWithUserId = updateRoles.bind(null, userId);
  const [state, formAction, pending] = useActionState(
    updateRolesWithUserId,
    initialState,
  );

  return (
    <form action={formAction}>
      <div aria-live="polite" aria-atomic="true">
        {state.message && <p>{state.message}</p>}
      </div>
      <fieldset>
        <legend aria-describedby="roles-error">Roles:</legend>
        {ALL_ROLES.map((role) => (
          <div key={role}>
            <input
              type="checkbox"
              id={`${userId}-${role}-role`}
              name="roles"
              value={role}
              defaultChecked={roles.includes(role)}
            />
            <label htmlFor={`${userId}-${role}-role`}>{role}</label>
          </div>
        ))}
        <div id="roles-error" aria-live="polite" aria-atomic="true">
          {state.errors?.roles &&
            state.errors.roles.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
        </div>
      </fieldset>
      <Button type="submit" disabled={pending}>
        Update
      </Button>
    </form>
  );
};

export default UpdateUserRolesForm;
