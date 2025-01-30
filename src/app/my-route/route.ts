import configPromise from "@payload-config";
import { getPayload } from "payload";
import { checkRoles } from "@/lib/server/auth-utils";
import { SUPER_ADMIN_ROLES } from "@/constants/auth";

export const GET = async () => {
  if (!(await checkRoles(SUPER_ADMIN_ROLES))) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "users",
  });

  return Response.json(data);
};
