import { createLocalReq, getPayload } from "payload";
import config from "@payload-config";
import { seed } from "@/app/(app)/api/app/seed/seed";

export async function GET(): Promise<Response> {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
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
