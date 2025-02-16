import { CollectionSlug, Payload } from "payload";
import { clerkClient } from "@clerk/nextjs/server";
import { ADMIN_ROLE, EDITOR_ROLE, SUPER_ADMIN_ROLE } from "@/constants/auth";
import { ClerkClient } from "@clerk/backend";
import { Role } from "@/types/globals";

const collections: CollectionSlug[] = ["media", "posts"];

export const seed = async ({
  payload,
}: {
  payload: Payload;
}): Promise<void> => {
  payload.logger.info("Seeding database...");

  payload.logger.info("- Deleting collections ...");

  await Promise.all(
    collections.map((collection) =>
      payload.db.deleteMany({ collection, where: {} }),
    ),
  );

  await Promise.all(
    collections
      .filter((collection) =>
        Boolean(payload.collections[collection].config.versions),
      )
      .map((collection) =>
        payload.db.deleteVersions({ collection, where: {} }),
      ),
  );

  const client = await clerkClient();

  payload.logger.info("- Deleting E2E users ...");

  const foundClerkUsers = (
    await client.users.getUserList({
      emailAddress: [
        process.env.E2E_CLERK_SUPER_ADMIN_USER_EMAIL!,
        process.env.E2E_CLERK_ADMIN_USER_EMAIL!,
        process.env.E2E_CLERK_EDITOR_USER_EMAIL!,
        process.env.E2E_CLERK_APP_USER_EMAIL!,
      ],
    })
  ).data;
  await Promise.all(
    foundClerkUsers.map(async (clerkUser) => {
      await client.users.deleteUser(clerkUser.id);
    }),
  );

  await payload.delete({
    collection: "users",
    depth: 0,
    where: {
      emailAddresses: {
        in: [
          process.env.E2E_CLERK_SUPER_ADMIN_USER_EMAIL,
          process.env.E2E_CLERK_ADMIN_USER_EMAIL,
          process.env.E2E_CLERK_EDITOR_USER_EMAIL,
          process.env.E2E_CLERK_APP_USER_EMAIL,
        ],
      },
    },
  });

  payload.logger.info("- Creating E2E users ...");

  await createUser({
    payload,
    clerkClient: client,
    userEmailAddress: process.env.E2E_CLERK_SUPER_ADMIN_USER_EMAIL!,
    userPhoneNumber: process.env.E2E_CLERK_SUPER_ADMIN_USER_PHONE!,
    userPassword: process.env.E2E_CLERK_SUPER_ADMIN_USER_PASSWORD!,
    role: SUPER_ADMIN_ROLE,
  });
  await createUser({
    payload,
    clerkClient: client,
    userEmailAddress: process.env.E2E_CLERK_ADMIN_USER_EMAIL!,
    userPhoneNumber: process.env.E2E_CLERK_ADMIN_USER_PHONE!,
    userPassword: process.env.E2E_CLERK_ADMIN_USER_PASSWORD!,
    role: ADMIN_ROLE,
  });
  await createUser({
    payload,
    clerkClient: client,
    userEmailAddress: process.env.E2E_CLERK_EDITOR_USER_EMAIL!,
    userPhoneNumber: process.env.E2E_CLERK_EDITOR_USER_PHONE!,
    userPassword: process.env.E2E_CLERK_EDITOR_USER_PASSWORD!,
    role: EDITOR_ROLE,
  });
  await createUser({
    payload,
    clerkClient: client,
    userEmailAddress: process.env.E2E_CLERK_APP_USER_EMAIL!,
    userPhoneNumber: process.env.E2E_CLERK_APP_USER_PHONE!,
    userPassword: process.env.E2E_CLERK_APP_USER_PASSWORD!,
    role: null,
  });
};

async function createUser({
  payload,
  clerkClient,
  userEmailAddress,
  userPhoneNumber,
  userPassword,
  role,
}: {
  payload: Payload;
  clerkClient: ClerkClient;
  userEmailAddress: string;
  userPhoneNumber: string | null;
  userPassword: string;
  role: Role | null;
}) {
  payload.logger.info(`- Creating E2E user - ${userEmailAddress} ...`);
  let user;
  try {
    const createUserParams: {
      firstName: string;
      lastName: string;
      emailAddress: string[];
      phoneNumber?: string[];
      password: string;
      publicMetadata?: UserPublicMetadata;
    } = {
      firstName: role || "user",
      lastName: "Test",
      emailAddress: [userEmailAddress],
      password: userPassword,
    };

    if (userPhoneNumber) {
      createUserParams.phoneNumber = [userPhoneNumber];
    }

    if (role) {
      createUserParams.publicMetadata = {
        roles: [role],
      };
    }

    user = await clerkClient.users.createUser(createUserParams);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
  if (!user) {
    return;
  }
  const emailAddresses = [
    ...new Set(
      user.emailAddresses.map(
        (userEmailAddress) => userEmailAddress.emailAddress,
      ),
    ),
  ];
  const phoneNumbers = [
    ...new Set(
      user.phoneNumbers.map((userPhoneNumber) => userPhoneNumber.phoneNumber),
    ),
  ];
  await payload.create({
    collection: "users",
    data: {
      clerkUserId: user.id,
      isDeleted: false,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddresses,
      phoneNumbers,
    },
  });
}
