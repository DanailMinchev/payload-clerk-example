import { getPayload } from "payload";
import config from "@payload-config";
import { checkRoles } from "@/lib/server/auth-utils";
import { SUPER_ADMIN_ROLES } from "@/constants/auth";
import { seed } from "@/app/(app)/api/next/seed/seed";

export async function GET(): Promise<Response> {
  if (
    process.env.NODE_ENV === "production" &&
    !(await checkRoles(SUPER_ADMIN_ROLES))
  ) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await getPayload({ config });
  await seed({ payload });

  return Response.json({ success: true });
}
