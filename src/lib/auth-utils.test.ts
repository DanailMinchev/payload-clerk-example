import { describe, expect, test } from "vitest";
import { checkRoles } from "./auth-utils";
import { Role } from "@/types/globals";
import { ADMIN_ROLE, EDITOR_ROLE, SUPER_ADMIN_ROLE } from "@/constants/auth";

describe("auth-utils.ts", () => {
  test("should return true when rolesToCheck includes fully userRoles", () => {
    const rolesToCheck: Role[] = [SUPER_ADMIN_ROLE];
    const userRoles: Role[] = [SUPER_ADMIN_ROLE, ADMIN_ROLE, EDITOR_ROLE];

    const result = checkRoles(rolesToCheck, userRoles);

    expect(result).toEqual(true);
  });

  test("should return true when rolesToCheck includes partially userRoles", () => {
    const rolesToCheck: Role[] = [SUPER_ADMIN_ROLE, ADMIN_ROLE, EDITOR_ROLE];
    const userRoles: Role[] = [SUPER_ADMIN_ROLE];

    const result = checkRoles(rolesToCheck, userRoles);

    expect(result).toEqual(true);
  });

  test("should return false when rolesToCheck does not include userRoles", () => {
    const rolesToCheck: Role[] = [SUPER_ADMIN_ROLE];
    const userRoles: Role[] = [ADMIN_ROLE, EDITOR_ROLE];

    const result = checkRoles(rolesToCheck, userRoles);

    expect(result).toEqual(false);
  });

  test("should return false when rolesToCheck and userRoles are empty", () => {
    const rolesToCheck: Role[] = [];
    const userRoles: Role[] = [];

    const result = checkRoles(rolesToCheck, userRoles);

    expect(result).toEqual(false);
  });
});
