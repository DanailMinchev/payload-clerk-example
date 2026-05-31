import { auth } from "@clerk/nextjs/server";
import { createLocalReq, getPayload } from "payload";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { SUPER_ADMIN_ROLE } from "@/constants/auth";
import { GET, POST } from "./route";
import { seed } from "./seed";

vi.mock("@payload-config", () => ({
  default: {},
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("payload", () => ({
  createLocalReq: vi.fn(),
  getPayload: vi.fn(),
}));

vi.mock("./seed", () => ({
  seed: vi.fn(),
}));

const mockedAuth = vi.mocked(auth);
const mockedCreateLocalReq = vi.mocked(createLocalReq);
const mockedGetPayload = vi.mocked(getPayload);
const mockedSeed = vi.mocked(seed);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("/api/app/seed", () => {
  test("rejects GET requests", () => {
    const response = GET();

    expect(response.status).toBe(405);
  });

  test("rejects unauthenticated POST requests", async () => {
    mockedAuth.mockResolvedValue({
      isAuthenticated: false,
      sessionClaims: null,
    } as Awaited<ReturnType<typeof auth>>);

    const response = await POST();

    expect(response.status).toBe(401);
    expect(mockedGetPayload).not.toHaveBeenCalled();
  });

  test("rejects POST requests without the super-admin role", async () => {
    mockedAuth.mockResolvedValue({
      isAuthenticated: true,
      sessionClaims: {
        metadata: {
          roles: [],
        },
      },
    } as unknown as Awaited<ReturnType<typeof auth>>);

    const response = await POST();

    expect(response.status).toBe(403);
    expect(mockedGetPayload).not.toHaveBeenCalled();
  });

  test("allows super-admin POST requests", async () => {
    const payload = { logger: { error: vi.fn() } };
    const payloadRequest = {};

    mockedAuth.mockResolvedValue({
      isAuthenticated: true,
      sessionClaims: {
        metadata: {
          roles: [SUPER_ADMIN_ROLE],
        },
      },
    } as unknown as Awaited<ReturnType<typeof auth>>);
    mockedGetPayload.mockResolvedValue(
      payload as unknown as Awaited<ReturnType<typeof getPayload>>,
    );
    mockedCreateLocalReq.mockResolvedValue(
      payloadRequest as Awaited<ReturnType<typeof createLocalReq>>,
    );
    mockedSeed.mockResolvedValue(undefined);

    const response = await POST();

    await expect(response.json()).resolves.toEqual({ success: true });
    expect(response.status).toBe(200);
    expect(mockedSeed).toHaveBeenCalledWith({ payload, payloadRequest });
  });
});
