import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { getPayload } from "payload";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "./route";
import type { NextRequest } from "next/server";
import type { WebhookEvent } from "@clerk/nextjs/server";

vi.mock("@payload-config", () => ({
  default: {},
}));

vi.mock("@clerk/nextjs/webhooks", () => ({
  verifyWebhook: vi.fn(),
}));

vi.mock("payload", () => ({
  getPayload: vi.fn(),
}));

const mockedGetPayload = vi.mocked(getPayload);
const mockedVerifyWebhook = vi.mocked(verifyWebhook);

const request = new Request("http://localhost/api/webhooks/clerk", {
  method: "POST",
}) as unknown as NextRequest;

const userData = {
  id: "user_1",
  first_name: "Test",
  last_name: "User",
  email_addresses: [
    { email_address: "test@example.com" },
    { email_address: "test@example.com" },
  ],
  phone_numbers: [{ phone_number: "+15555550100" }],
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("/api/webhooks/clerk", () => {
  test("rejects invalid signatures", async () => {
    mockedVerifyWebhook.mockRejectedValue(new Error("invalid signature"));

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(mockedGetPayload).not.toHaveBeenCalled();
  });

  test("creates a Payload user for user.created when no mirror row exists", async () => {
    const create = vi.fn();
    const update = vi.fn();
    const find = vi.fn().mockResolvedValue({ docs: [] });

    mockedVerifyWebhook.mockResolvedValue({
      type: "user.created",
      data: userData,
    } as WebhookEvent);
    mockedGetPayload.mockResolvedValue({
      create,
      find,
      update,
    } as unknown as Awaited<ReturnType<typeof getPayload>>);

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(create).toHaveBeenCalledWith({
      collection: "users",
      data: {
        clerkUserId: "user_1",
        isDeleted: false,
        firstName: "Test",
        lastName: "User",
        emailAddresses: ["test@example.com"],
        phoneNumbers: ["+15555550100"],
      },
    });
    expect(update).not.toHaveBeenCalled();
  });

  test("updates the existing Payload user for user.updated", async () => {
    const create = vi.fn();
    const update = vi.fn();
    const find = vi.fn().mockResolvedValue({ docs: [{ id: 7 }] });

    mockedVerifyWebhook.mockResolvedValue({
      type: "user.updated",
      data: userData,
    } as WebhookEvent);
    mockedGetPayload.mockResolvedValue({
      create,
      find,
      update,
    } as unknown as Awaited<ReturnType<typeof getPayload>>);

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledWith({
      collection: "users",
      id: 7,
      data: {
        clerkUserId: "user_1",
        isDeleted: false,
        firstName: "Test",
        lastName: "User",
        emailAddresses: ["test@example.com"],
        phoneNumbers: ["+15555550100"],
      },
    });
    expect(create).not.toHaveBeenCalled();
  });

  test("soft-deletes the Payload user for user.deleted", async () => {
    const update = vi.fn();
    const find = vi.fn().mockResolvedValue({ docs: [{ id: 7 }] });

    mockedVerifyWebhook.mockResolvedValue({
      type: "user.deleted",
      data: {
        id: "user_1",
      },
    } as WebhookEvent);
    mockedGetPayload.mockResolvedValue({
      find,
      update,
    } as unknown as Awaited<ReturnType<typeof getPayload>>);

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledWith({
      collection: "users",
      id: 7,
      data: {
        isDeleted: true,
      },
    });
  });
});
