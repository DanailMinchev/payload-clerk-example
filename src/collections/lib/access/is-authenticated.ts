import { Access, PayloadRequest } from "payload";

export const isAuthenticated: Access = ({
  req: { user },
}: {
  req: PayloadRequest;
}) => Boolean(user);
