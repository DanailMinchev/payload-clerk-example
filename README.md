## Payload and Clerk example

[![Payload and Clerk example](https://img.youtube.com/vi/7PNGNqqFlu0/0.jpg)](https://www.youtube.com/watch?v=7PNGNqqFlu0)

YouTube video: [https://www.youtube.com/watch?v=7PNGNqqFlu0](https://www.youtube.com/watch?v=7PNGNqqFlu0)

This is an example for Payload CMS and Clerk integration.

## Getting Started

1. Copy the `env.example` file into `.env.local` or `.env`

2. Set Clerk environment variables [documentation](https://clerk.com/docs/deployments/clerk-environment-variables):

`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

Your Clerk app's Publishable Key, which you can find in the Clerk Dashboard. It will be prefixed with pk*test* in development instances and pk*live* in production instances.

`CLERK_SECRET_KEY`

Your Clerk app's Secret Key, which you can find in the Clerk Dashboard. It will be prefixed with sk*test* in development instances and sk*live* in production instances. Do not expose this on the frontend with a public environment variable.

3. Set Payload environment variables [documentation](https://payloadcms.com/docs/getting-started/installation)

`PAYLOAD_SECRET`

This environmental variable acts as your secret key. It's paramount that you ensure its value is both secure and strong, as it's integral to the encryption and decryption process.

`DATABASE_URI`

This is the database connection string. Uncomment `DATABASE_URI` for `SQLite` or `PostgreSQL`.

4. If you selected the `PostgreSQL` you can use Docker:

```bash
docker compose up
```

and edit the `src/payload.config.ts` file:

Uncomment:

```typescript
import { postgresAdapter } from "@payloadcms/db-postgres";
```

Comment / delete:

```typescript
import { sqliteAdapter } from "@payloadcms/db-sqlite";
```

Uncomment:

```typescript
  // PostgreSQL
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
```

Comment / delete:

```typescript
  // SQLite
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "",
    },
  }),
```

5. For testing purposes, create following users in Clerk:

- super-admin-1+clerk_test@example.com
- admin-1+clerk_test@example.com
- editor-1+clerk_test@example.com
- user-1+clerk_test@example.com

and set the environment variables accordingly with their passwords:

```dotenv
E2E_CLERK_SUPER_ADMIN_USER_EMAIL=super-admin-1+clerk_test@example.com
E2E_CLERK_SUPER_ADMIN_USER_PASSWORD=

E2E_CLERK_ADMIN_USER_EMAIL=admin-1+clerk_test@example.com
E2E_CLERK_ADMIN_USER_PASSWORD=

E2E_CLERK_EDITOR_USER_EMAIL=editor-1+clerk_test@example.com
E2E_CLERK_EDITOR_USER_PASSWORD=

E2E_CLERK_APP_USER_EMAIL=user-1+clerk_test@example.com
E2E_CLERK_APP_USER_PASSWORD=
```

The `super-admin-1+clerk_test@example.com` user should have following [public metadata](https://clerk.com/docs/users/metadata#public-metadata):

```json
{
  "roles": ["super-admin"]
}
```

and you should set the rest of the user roles via the [admin dashboard](http://localhost:3000/admin/clerk-users) as follows:

- admin-1+clerk_test@example.com (admin role)
- editor-1+clerk_test@example.com (editor role)
- user-1+clerk_test@example.com (no role, no changes to user's metadata, used for simulating a website user / registered user)

6. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
