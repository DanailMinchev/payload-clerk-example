import { createLocalReq, getPayload } from "payload";
import config from "@payload-config";
import { seed } from "@/app/(frontend)/api/app/seed/seed";
import { auth } from "@clerk/nextjs/server";
import { checkRoles } from "@/lib/auth-utils";
import { SUPER_ADMIN_ROLES } from "@/constants/auth";

export function GET(): Response {
  return Response.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function POST(): Promise<Response> {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { isAuthenticated, sessionClaims } = await auth();

  if (!isAuthenticated) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!checkRoles(SUPER_ADMIN_ROLES, sessionClaims?.metadata?.roles)) {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }

  const payload = await getPayload({ config });

  try {
    // Create a Payload request object to pass to the Local API for transactions
    // At this point you should pass in a user, locale, and any other context you need for the Local API
    const payloadRequest = await createLocalReq({}, payload);

    await seed({ payload, payloadRequest });

    return Response.json({ success: true });
  } catch (error) {
    payload.logger.error({ err: error, message: "Error seeding data" });
    return new Response("Error seeding data.", { status: 500 });
  }
}
