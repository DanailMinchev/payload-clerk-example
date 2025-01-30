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

Run the development server:

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
