import { auth, currentUser } from "@clerk/nextjs/server";
import {
  AuthStrategy,
  AuthStrategyFunctionArgs,
  AuthStrategyResult,
  type Payload,
  User,
} from "payload";

export async function getUser({
  payload,
}: {
  payload: Payload;
}): Promise<User | null> {
  const { userId }: { userId: string | null } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return null;
  }

  let currentPayloadUser;
  const findUserQuery = await payload.find({
    collection: "users",
    where: {
      clerkUserId: {
        equals: userId,
      },
    },
  });
  if (findUserQuery.docs.length === 0) {
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

    currentPayloadUser = await payload.create({
      collection: "users",
      data: {
        clerkUserId: userId,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddresses,
        phoneNumbers,
      },
    });
  } else {
    currentPayloadUser = findUserQuery?.docs[0];
  }

  return {
    collection: "users",
    ...currentPayloadUser,
  };
}

async function authenticate({
  payload,
}: AuthStrategyFunctionArgs): Promise<AuthStrategyResult> {
  const user = await getUser({ payload });

  if (!user) {
    return { user: null };
  }

  return {
    user,
  };
}

export const ClerkAuthStrategy: AuthStrategy = {
  name: "clerk-auth-strategy",
  authenticate,
};
