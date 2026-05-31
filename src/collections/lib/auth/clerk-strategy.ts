import type {
  AuthStrategy,
  AuthStrategyFunctionArgs,
  AuthStrategyResult,
  Payload,
} from "payload";

async function findPayloadUserByClerkUserId({
  payload,
  userId,
}: {
  payload: Payload;
  userId: string;
}) {
  return (
    await payload.find({
      collection: "users",
      where: {
        clerkUserId: {
          equals: userId,
        },
      },
      limit: 1,
    })
  ).docs.at(0);
}

export async function getUser({
  payload,
}: {
  payload: Payload;
}): Promise<AuthStrategyResult["user"]> {
  const { auth, currentUser } = await import("@clerk/nextjs/server");
  const { userId }: { userId: string | null } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return null;
  }

  let currentPayloadUser = await findPayloadUserByClerkUserId({
    payload,
    userId,
  });

  if (!currentPayloadUser) {
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

    try {
      currentPayloadUser = await payload.create({
        collection: "users",
        data: {
          clerkUserId: userId,
          isDeleted: false,
          firstName: user.firstName,
          lastName: user.lastName,
          emailAddresses,
          phoneNumbers,
        },
      });
    } catch (error) {
      const existingPayloadUser = await findPayloadUserByClerkUserId({
        payload,
        userId,
      });

      if (!existingPayloadUser) {
        throw error;
      }

      currentPayloadUser = existingPayloadUser;
    }
  }

  return {
    ...currentPayloadUser,
    collection: "users",
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
