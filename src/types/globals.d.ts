import type { ALL_ROLES } from "@/constants/auth";

export {};

export type Role = (typeof ALL_ROLES)[number];

declare global {
  interface UserPublicMetadata {
    roles?: Role[];
  }

  interface CustomJwtSessionClaims {
    metadata?: {
      roles?: Role[];
    };
  }
}
