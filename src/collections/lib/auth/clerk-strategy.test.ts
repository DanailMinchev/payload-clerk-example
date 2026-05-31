import { auth, currentUser } from "@clerk/nextjs/server";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getUser } from "./clerk-strategy";
import type { Payload } from "payload";
import type { User as PayloadUser } from "@/payload-types";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));

const mockedAuth = vi.mocked(auth);
const mockedCurrentUser = vi.mocked(currentUser);

const payloadUser: PayloadUser = {
  id: 1,
  clerkUserId: "user_1",
  isDeleted: false,
  firstName: "Test",
  lastName: "User",
  emailAddresses: ["test@example.com"],
  phoneNumbers: [],
  createdAt: "2026-05-31T00:00:00.000Z",
  updatedAt: "2026-05-31T00:00:00.000Z",
  collection: "users",
};

function createMockPayload({
  create,
  find,
}: {
  create: ReturnType<typeof vi.fn>;
  find: ReturnType<typeof vi.fn>;
}) {
  return {
    create,
    find,
  } as unknown as Payload;
}

beforeEach(() => {
  vi.resetAllMocks();

  mockedAuth.mockResolvedValue({
    userId: "user_1",
  } as Awaited<ReturnType<typeof auth>>);
  mockedCurrentUser.mockResolvedValue({
    firstName: "Test",
    lastName: "User",
    emailAddresses: [{ emailAddress: "test@example.com" }],
    phoneNumbers: [],
  } as unknown as Awaited<ReturnType<typeof currentUser>>);
});

describe("ClerkAuthStrategy getUser", () => {
  test("returns an existing Payload user", async () => {
    const find = vi.fn().mockResolvedValue({ docs: [payloadUser] });
    const create = vi.fn();

    const result = await getUser({
      payload: createMockPayload({ create, find }),
    });

    expect(result).toEqual(payloadUser);
    expect(create).not.toHaveBeenCalled();
  });

  test("creates the Payload user when no mirror row exists", async () => {
    const find = vi.fn().mockResolvedValue({ docs: [] });
    const create = vi.fn().mockResolvedValue(payloadUser);

    const result = await getUser({
      payload: createMockPayload({ create, find }),
    });

    expect(result).toEqual(payloadUser);
    expect(create).toHaveBeenCalledWith({
      collection: "users",
      data: {
        clerkUserId: "user_1",
        isDeleted: false,
        firstName: "Test",
        lastName: "User",
        emailAddresses: ["test@example.com"],
        phoneNumbers: [],
      },
    });
  });

  test("recovers when concurrent provisioning creates the mirror row first", async () => {
    const find = vi
      .fn()
      .mockResolvedValueOnce({ docs: [] })
      .mockResolvedValueOnce({ docs: [payloadUser] });
    const create = vi
      .fn()
      .mockRejectedValue(
        new Error("UNIQUE constraint failed: users.clerk_user_id"),
      );

    const result = await getUser({
      payload: createMockPayload({ create, find }),
    });

    expect(result).toEqual(payloadUser);
    expect(find).toHaveBeenCalledTimes(2);
  });

  test("rethrows create failures when no concurrent row is found", async () => {
    const error = new Error("database unavailable");
    const find = vi
      .fn()
      .mockResolvedValueOnce({ docs: [] })
      .mockResolvedValueOnce({ docs: [] });
    const create = vi.fn().mockRejectedValue(error);

    await expect(
      getUser({
        payload: createMockPayload({ create, find }),
      }),
    ).rejects.toThrow(error);
  });
});
