import { ALL_ROLES } from "@/constants/auth";

export {};

export type Role = (typeof ALL_ROLES)[number];

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      roles?: Role[];
    };
  }
}
