import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ADMIN_ROLE, SUPER_ADMIN_ROLE } from "@/constants/auth";
import { checkRoles } from "@/lib/server/auth-utils";
import { updateClerkUserRoles } from "./actions";
import type { Role } from "@/types/globals";

vi.mock("@/lib/server/auth-utils", () => ({
  checkRoles: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  clerkClient: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const mockedCheckRoles = vi.mocked(checkRoles);
const mockedClerkClient = vi.mocked(clerkClient);
const mockedRevalidatePath = vi.mocked(revalidatePath);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("updateClerkUserRoles", () => {
  test("rejects unauthorized callers before Clerk mutation", async () => {
    mockedCheckRoles.mockResolvedValue(false);

    const result = await updateClerkUserRoles("user_1", [ADMIN_ROLE]);

    expect(result).toEqual({
      isError: true,
      message: "Not Authorized",
    });
    expect(mockedClerkClient).not.toHaveBeenCalled();
  });

  test("rejects invalid role values before Clerk mutation", async () => {
    mockedCheckRoles.mockResolvedValue(true);

    const result = await updateClerkUserRoles("user_1", ["owner" as Role]);

    expect(result).toEqual({
      isError: true,
      message: "Invalid roles.",
    });
    expect(mockedClerkClient).not.toHaveBeenCalled();
  });

  test("updates Clerk public metadata for valid super-admin requests", async () => {
    const updateUserMetadata = vi.fn().mockResolvedValue({});

    mockedCheckRoles.mockResolvedValue(true);
    mockedClerkClient.mockResolvedValue({
      users: {
        updateUserMetadata,
      },
    } as unknown as Awaited<ReturnType<typeof clerkClient>>);

    const result = await updateClerkUserRoles("user_1", [
      SUPER_ADMIN_ROLE,
      ADMIN_ROLE,
    ]);

    expect(result).toEqual({
      isError: false,
      message: "Roles updated successfully.",
    });
    expect(updateUserMetadata).toHaveBeenCalledWith("user_1", {
      publicMetadata: { roles: [SUPER_ADMIN_ROLE, ADMIN_ROLE] },
    });
    expect(mockedRevalidatePath).toHaveBeenCalledWith("/admin/account");
    expect(mockedRevalidatePath).toHaveBeenCalledWith(
      "/admin/collections/users",
    );
    expect(mockedRevalidatePath).toHaveBeenCalledWith("/admin/clerk-users");
  });
});
