import { verifyWebhook } from "@clerk/nextjs/webhooks";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

const getUniqueEmails = (user: UserJSON) => [
  ...new Set(
    user.email_addresses.map(
      (userEmailAddress) => userEmailAddress.email_address,
    ),
  ),
];

const getUniquePhoneNumbers = (user: UserJSON) => [
  ...new Set(
    user.phone_numbers.map((userPhoneNumber) => userPhoneNumber.phone_number),
  ),
];

async function handleUserCreatedOrUpdated(
  evt: Extract<WebhookEvent, { type: "user.created" | "user.updated" }>,
) {
  const payload = await getPayload({ config: configPromise });
  const existingUser = (
    await payload.find({
      collection: "users",
      where: {
        clerkUserId: {
          equals: evt.data.id,
        },
      },
      limit: 1,
    })
  ).docs.at(0);

  const data = {
    clerkUserId: evt.data.id,
    isDeleted: false,
    firstName: evt.data.first_name,
    lastName: evt.data.last_name,
    emailAddresses: getUniqueEmails(evt.data),
    phoneNumbers: getUniquePhoneNumbers(evt.data),
  };

  if (existingUser) {
    await payload.update({
      collection: "users",
      id: existingUser.id,
      data,
    });

    return;
  }

  await payload.create({
    collection: "users",
    data,
  });
}

async function handleUserDeleted(
  evt: Extract<WebhookEvent, { type: "user.deleted" }>,
) {
  if (!evt.data.id) {
    return;
  }

  const payload = await getPayload({ config: configPromise });
  const existingUser = (
    await payload.find({
      collection: "users",
      where: {
        clerkUserId: {
          equals: evt.data.id,
        },
      },
      limit: 1,
    })
  ).docs.at(0);

  if (!existingUser) {
    return;
  }

  await payload.update({
    collection: "users",
    id: existingUser.id,
    data: {
      isDeleted: true,
    },
  });
}

export async function POST(req: NextRequest) {
  let evt: WebhookEvent;

  try {
    evt = await verifyWebhook(req);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (evt.type) {
    case "user.created":
    case "user.updated":
      await handleUserCreatedOrUpdated(evt);
      break;
    case "user.deleted":
      await handleUserDeleted(evt);
      break;
    default:
      break;
  }

  return new Response("OK", { status: 200 });
}
