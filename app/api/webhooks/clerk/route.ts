import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch (err) {
    console.error("Clerk webhook signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // Extend with persistence (e.g. Payload CMS sync) per event type.
  switch (evt.type) {
    case "user.created":
    case "user.updated":
    case "user.deleted":
      console.log(`[clerk webhook] ${evt.type}`, evt.data.id);
      break;
    default:
      console.log(`[clerk webhook] unhandled ${evt.type}`);
  }

  return new Response("OK", { status: 200 });
}
