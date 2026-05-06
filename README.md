# payload-clerk-example

Next.js 16 (App Router) example with [Clerk](https://clerk.com) authentication and [Payload CMS](https://payloadcms.com) on SQLite. Both are wired up; the Clerk → Payload user-sync bridge is the remaining work — see [Roadmap](#roadmap).

## Stack

- Next.js 16 (Turbopack on by default)
- React 19, TypeScript 6
- Tailwind CSS v4
- Clerk (`@clerk/nextjs`)
- Payload CMS 3 (`@payloadcms/db-sqlite`, `@payloadcms/richtext-lexical`)

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the env template and fill it in:

   ```bash
   cp env.example .env.local
   ```

   - **Clerk**: grab your Publishable key and Secret key from the [Clerk dashboard → API keys](https://dashboard.clerk.com/~/api-keys). The webhook signing secret is added in the Webhooks step below.
   - **Payload**: set `PAYLOAD_SECRET` to any random string and keep `DATABASE_URL=file:./payload-clerk-example.db` for the SQLite default.

3. Start the dev server:
   ```bash
   npm run dev
   ```
   Payload's first-run admin user is created at `/admin` (Clerk login is required first — see Routes below).

## What's wired up

| Path                      | Type                  | Notes                                                    |
| ------------------------- | --------------------- | -------------------------------------------------------- |
| `/`                       | Public                | Landing page                                             |
| `/login/*`                | Public                | Custom catch-all hosting `<SignIn />`                    |
| `/registration/*`         | Public                | Custom catch-all hosting `<SignUp />`                    |
| `/profile/*`              | **Protected** (Clerk) | Catch-all hosting `<UserProfile />`                      |
| `/admin/*`                | **Protected** (Clerk) | Payload admin catch-all (`@payloadcms/next/views`)       |
| `/api/[...slug]`          | Public                | Payload REST API; access control enforced per-collection |
| `/api/graphql`            | Public                | Payload GraphQL endpoint                                 |
| `/api/graphql-playground` | Public                | GraphiQL playground                                      |
| `/api/webhooks/clerk`     | Public POST           | Clerk webhook receiver (see Webhooks)                    |

Clerk protection is enforced in `src/proxy.ts` (Next.js 16's renamed `middleware.ts`) via `createRouteMatcher` for `/admin(.*)` and `/profile(.*)`. Unauthenticated requests are redirected to `/login` because of `NEXT_PUBLIC_CLERK_SIGN_IN_URL`. Once past the Clerk gate, Payload's admin enforces its **own** Users-collection auth (today: a second login form). Bridging the two so the Clerk session becomes the Payload session is the open work — see [Roadmap](#roadmap).

`<ClerkProvider>` is wrapped in `src/providers/auth-provider.tsx` and configured with `localization={enUS}` from `@clerk/localizations`. The header in `src/app/(frontend)/layout.tsx` uses Clerk's `<Show when="signed-in/-out">` plus `<SignInButton>`, `<SignUpButton>`, and `<UserButton>`.

Payload's config lives at `src/payload.config.ts`; collections at `src/collections/`. Auto-generated files (`src/payload-types.ts`, `src/app/(payload)/admin/importMap.js`) regenerate via `npm run payload:generate:types` and `npm run payload:generate:importmap` — don't hand-edit them.

## Webhooks

The handler at `src/app/(frontend)/api/webhooks/clerk/route.ts` verifies signatures with `verifyWebhook` and currently logs events. Once the auth bridge lands, this is where the Clerk → Payload user sync happens.

1. In the Clerk dashboard, go to **Webhooks → Endpoints → Add endpoint**.
2. Endpoint URL: `https://<your-tunnel-or-prod-host>/api/webhooks/clerk`. For local dev, expose your machine with `ngrok http 3000` (or similar) and use that URL.
3. Subscribe to at least `user.created`, `user.updated`, `user.deleted`.
4. Copy the endpoint's **Signing secret** into `.env.local` as `CLERK_WEBHOOK_SIGNING_SECRET`.
5. Trigger a test event from the dashboard to verify signature handling.

## Scripts

```bash
npm run dev                          # next dev (Turbopack)
npm run build                        # next build
npm run start                        # next start
npm run lint                         # eslint
npm run format                       # prettier --write
npm run format:ci                    # prettier --check
npm run payload:generate:types       # regen src/payload-types.ts
npm run payload:generate:importmap   # regen src/app/(payload)/admin/importMap.js
```

## Roadmap

- **Clerk × Payload auth bridge** — replace Payload's Users-collection password auth with a strategy that trusts the Clerk session, and sync Clerk user records into the Users collection via the `/api/webhooks/clerk` handler. The reference implementation lives on `main`'s `src/collections/lib/auth/clerk-strategy.ts`.
