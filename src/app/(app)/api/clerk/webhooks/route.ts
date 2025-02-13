import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const handleUserCreatedOrUpdated = async (
  webhookEvent: WebhookEvent,
) => {
  if (
    webhookEvent.type === "user.created" ||
    webhookEvent.type === "user.updated"
  ) {
    const clerkUserId = webhookEvent.data.id;
    const firstName = webhookEvent.data.first_name;
    const lastName = webhookEvent.data.last_name;
    const emailAddresses = [
      ...new Set(
        webhookEvent.data.email_addresses.map(
          (userEmailAddress) => userEmailAddress.email_address,
        ),
      ),
    ];
    const phoneNumbers = [
      ...new Set(
        webhookEvent.data.phone_numbers.map(
          (userPhoneNumber) => userPhoneNumber.phone_number,
        ),
      ),
    ];

    console.log("clerkUserId:", clerkUserId);
    console.log("firstName:", firstName);
    console.log("lastName:", lastName);
    console.log("emailAddresses:", emailAddresses);
    console.log("phoneNumbers:", phoneNumbers);

    const payload = await getPayload({
      config: configPromise,
    });
    const findUserQuery = await payload.find({
      collection: "users",
      where: {
        clerkUserId: {
          equals: clerkUserId,
        },
      },
    });
    if (findUserQuery.docs.length === 0) {
      await payload.create({
        collection: "users",
        data: {
          clerkUserId,
          isDeleted: false,
          firstName,
          lastName,
          emailAddresses,
          phoneNumbers,
        },
      });
    } else {
      await payload.update({
        collection: "users",
        id: findUserQuery?.docs[0].id,
        data: {
          firstName,
          lastName,
          emailAddresses,
          phoneNumbers,
        },
      });
    }
  }
};

export const handleUserDeleted = async (webhookEvent: WebhookEvent) => {
  if (webhookEvent.type === "user.deleted") {
    const clerkUserId = webhookEvent.data.id;

    console.log("clerkUserId:", clerkUserId);

    const payload = await getPayload({
      config: configPromise,
    });
    const findUserQuery = await payload.find({
      collection: "users",
      where: {
        clerkUserId: {
          equals: clerkUserId,
        },
      },
    });

    if (findUserQuery.docs.length === 1) {
      await payload.update({
        collection: "users",
        id: findUserQuery?.docs[0].id,
        data: {
          isDeleted: true,
        },
      });
    }
  }
};

export async function POST(req: Request) {
  const signingSecret = process.env.SIGNING_SECRET;

  if (!signingSecret) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Create new Svix instance with secret
  const webhook = new Webhook(signingSecret);

  // Get headers
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const requestPayload = await req.json();
  const requestBody = JSON.stringify(requestPayload);

  let webhookEvent: WebhookEvent;

  // Verify payload with headers
  try {
    webhookEvent = webhook.verify(requestBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (error) {
    console.error("Error: Could not verify webhook:", error);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  const { id } = webhookEvent.data;
  const eventType = webhookEvent.type;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log("Webhook requestBody:", requestBody);

  await handleUserCreatedOrUpdated(webhookEvent);
  await handleUserDeleted(webhookEvent);

  return new Response("Webhook received", { status: 200 });
}
