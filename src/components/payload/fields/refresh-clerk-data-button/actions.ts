"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { checkRoles } from "@/lib/server/auth-utils";
import { SUPER_ADMIN_ROLES } from "@/constants/auth";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export interface RefreshClerkDataState {
  isError: boolean;
  message: string;
}

export async function refreshClerkData(
  clerkUserId: string,
): Promise<RefreshClerkDataState> {
  const { userId } = await auth();

  if (userId !== clerkUserId && !(await checkRoles(SUPER_ADMIN_ROLES))) {
    return {
      isError: true,
      message: "Not Authorized",
    };
  }

  const payload = await getPayload({
    config: configPromise,
  });

  const foundPayloadUser =
    (
      await payload.find({
        collection: "users",
        where: {
          clerkUserId: {
            equals: clerkUserId,
          },
        },
      })
    ).docs[0] ?? null;
  if (!foundPayloadUser) {
    return {
      isError: true,
      message: "Payload user not found",
    };
  }

  const client = await clerkClient();

  try {
    const foundClerkUser = await client.users.getUser(clerkUserId);

    const emailAddresses = [
      ...new Set(
        foundClerkUser.emailAddresses.map(
          (userEmailAddress) => userEmailAddress.emailAddress,
        ),
      ),
    ];
    const phoneNumbers = [
      ...new Set(
        foundClerkUser.phoneNumbers.map(
          (userPhoneNumber) => userPhoneNumber.phoneNumber,
        ),
      ),
    ];

    await payload.update({
      collection: "users",
      id: foundPayloadUser.id,
      data: {
        firstName: foundClerkUser.firstName,
        lastName: foundClerkUser.lastName,
        emailAddresses,
        phoneNumbers,
      },
    });

    revalidatePath(`/admin/account`);
    revalidatePath(`/admin/collections/users/${foundPayloadUser.id}`);

    return {
      isError: false,
      message: "Refreshed successfully",
    };
  } catch (exception) {
    return {
      isError: true,
      message: exception as string,
    };
  }
}
