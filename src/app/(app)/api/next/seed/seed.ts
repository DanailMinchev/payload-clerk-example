import { CollectionSlug, Payload, PayloadRequest } from "payload";
import { clerkClient } from "@clerk/nextjs/server";
import { ADMIN_ROLE, EDITOR_ROLE, SUPER_ADMIN_ROLE } from "@/constants/auth";
import { ClerkClient } from "@clerk/backend";
import { Role } from "@/types/globals";

const collections: CollectionSlug[] = ["media", "posts"];

export const seed = async ({
  payload,
  payloadRequest,
}: {
  payload: Payload;
  payloadRequest: PayloadRequest;
}): Promise<void> => {
  payload.logger.info("Seeding database...");

  payload.logger.info("- Deleting collections ...");

  await Promise.all(
    collections.map((collection) =>
      payload.db.deleteMany({ collection, req: payloadRequest, where: {} }),
    ),
  );

  await Promise.all(
    collections
      .filter((collection) =>
        Boolean(payload.collections[collection].config.versions),
      )
      .map((collection) =>
        payload.db.deleteVersions({
          collection,
          req: payloadRequest,
          where: {},
        }),
      ),
  );

  const client = await clerkClient();

  payload.logger.info("- Deleting E2E users ...");

  const foundClerkUsers = (
    await client.users.getUserList({
      emailAddress: [
        process.env.E2E_CLERK_ALL_ROLES_USER_EMAIL!,
        process.env.E2E_CLERK_SUPER_ADMIN_USER_EMAIL!,
        process.env.E2E_CLERK_ADMIN_USER_EMAIL!,
        process.env.E2E_CLERK_EDITOR_USER_EMAIL!,
        process.env.E2E_CLERK_AUTHENTICATED_USER_EMAIL!,
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
    req: payloadRequest,
    depth: 0,
    where: {
      emailAddresses: {
        in: [
          process.env.E2E_CLERK_ALL_ROLES_USER_EMAIL,
          process.env.E2E_CLERK_SUPER_ADMIN_USER_EMAIL,
          process.env.E2E_CLERK_ADMIN_USER_EMAIL,
          process.env.E2E_CLERK_EDITOR_USER_EMAIL,
          process.env.E2E_CLERK_AUTHENTICATED_USER_EMAIL,
        ],
      },
    },
  });

  payload.logger.info("- Creating E2E users ...");

  await createUser({
    payload,
    payloadRequest,
    clerkClient: client,
    userEmailAddress: process.env.E2E_CLERK_ALL_ROLES_USER_EMAIL!,
    userPhoneNumber: process.env.E2E_CLERK_ALL_ROLES_USER_PHONE!,
    userPassword: process.env.E2E_CLERK_ALL_ROLES_USER_PASSWORD!,
    roles: [SUPER_ADMIN_ROLE, ADMIN_ROLE, EDITOR_ROLE],
  });
  await createUser({
    payload,
    payloadRequest,
    clerkClient: client,
    userEmailAddress: process.env.E2E_CLERK_SUPER_ADMIN_USER_EMAIL!,
    userPhoneNumber: process.env.E2E_CLERK_SUPER_ADMIN_USER_PHONE!,
    userPassword: process.env.E2E_CLERK_SUPER_ADMIN_USER_PASSWORD!,
    roles: [SUPER_ADMIN_ROLE],
  });
  await createUser({
    payload,
    payloadRequest,
    clerkClient: client,
    userEmailAddress: process.env.E2E_CLERK_ADMIN_USER_EMAIL!,
    userPhoneNumber: process.env.E2E_CLERK_ADMIN_USER_PHONE!,
    userPassword: process.env.E2E_CLERK_ADMIN_USER_PASSWORD!,
    roles: [ADMIN_ROLE],
  });
  await createUser({
    payload,
    payloadRequest,
    clerkClient: client,
    userEmailAddress: process.env.E2E_CLERK_EDITOR_USER_EMAIL!,
    userPhoneNumber: process.env.E2E_CLERK_EDITOR_USER_PHONE!,
    userPassword: process.env.E2E_CLERK_EDITOR_USER_PASSWORD!,
    roles: [EDITOR_ROLE],
  });
  await createUser({
    payload,
    payloadRequest,
    clerkClient: client,
    userEmailAddress: process.env.E2E_CLERK_AUTHENTICATED_USER_EMAIL!,
    userPhoneNumber: process.env.E2E_CLERK_AUTHENTICATED_USER_PHONE!,
    userPassword: process.env.E2E_CLERK_AUTHENTICATED_USER_PASSWORD!,
    roles: null,
  });
};

async function createUser({
  payload,
  payloadRequest,
  clerkClient,
  userEmailAddress,
  userPhoneNumber,
  userPassword,
  roles,
}: {
  payload: Payload;
  payloadRequest: PayloadRequest;
  clerkClient: ClerkClient;
  userEmailAddress: string;
  userPhoneNumber: string | null;
  userPassword: string;
  roles: Role[] | null;
}) {
  payload.logger.info(`- Creating E2E user - ${userEmailAddress} ...`);
  let user;
  try {
    let firstName = "user";
    if (roles) {
      if (roles.length === 1) {
        firstName = roles[0];
      } else {
        firstName = "all-roles";
      }
    }

    const createUserParams: {
      firstName: string;
      lastName: string;
      emailAddress: string[];
      phoneNumber?: string[];
      password: string;
      publicMetadata?: UserPublicMetadata;
    } = {
      firstName,
      lastName: "Test",
      emailAddress: [userEmailAddress],
      password: userPassword,
    };

    if (userPhoneNumber) {
      createUserParams.phoneNumber = [userPhoneNumber];
    }

    if (roles) {
      createUserParams.publicMetadata = {
        roles,
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
    req: payloadRequest,
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
