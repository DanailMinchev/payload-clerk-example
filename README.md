# payload-clerk-example

Next.js 16 (App Router) example wired up with [Clerk](https://clerk.com) authentication. Payload CMS integration is planned as a follow-up.

## Stack

- Next.js 16 (Turbopack on by default)
- React 19, TypeScript 6
- Tailwind CSS v4
- Clerk (`@clerk/nextjs`)

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the env template and fill it in:
   ```bash
   cp env.example .env.local
   ```
   Grab your **Publishable key** and **Secret key** from the [Clerk dashboard → API keys](https://dashboard.clerk.com/~/api-keys). The webhook signing secret is added in step 5.
3. Start the dev server:
   ```bash
   npm run dev
   ```

## What's wired up

| Path                  | Type          | Notes                                             |
| --------------------- | ------------- | ------------------------------------------------- |
| `/`                   | Public        | Landing page                                      |
| `/login/*`            | Public        | Custom catch-all hosting `<SignIn />`             |
| `/registration/*`     | Public        | Custom catch-all hosting `<SignUp />`             |
| `/profile/*`          | **Protected** | Catch-all hosting `<UserProfile />`               |
| `/admin`              | **Protected** | Server component using `auth()` + `currentUser()` |
| `/api/webhooks/clerk` | Public POST   | Clerk webhook receiver                            |

Protection is enforced in `src/proxy.ts` (Next.js 16's renamed `middleware.ts`) via `createRouteMatcher` for `/admin(.*)` and `/profile(.*)`. Unauthenticated requests are redirected to `/login` because of `NEXT_PUBLIC_CLERK_SIGN_IN_URL`.

`<ClerkProvider>` is wrapped in `src/providers/auth-provider.tsx` and configured with `localization={enUS}` from `@clerk/localizations`. The header in `src/app/(app)/layout.tsx` uses Clerk's `<Show when="signed-in/-out">` plus `<SignInButton>`, `<SignUpButton>`, and `<UserButton>`.

## Webhooks

To sync Clerk users to a backend (the future Payload integration):

1. In the Clerk dashboard, go to **Webhooks → Endpoints → Add endpoint**.
2. Endpoint URL: `https://<your-tunnel-or-prod-host>/api/webhooks/clerk`. For local dev, expose your machine with `ngrok http 3000` (or similar) and use that URL.
3. Subscribe to at least `user.created`, `user.updated`, `user.deleted`.
4. Copy the endpoint's **Signing secret** into `.env.local` as `CLERK_WEBHOOK_SIGNING_SECRET`.
5. Trigger a test event from the dashboard. The handler in `src/app/(app)/api/webhooks/clerk/route.ts` verifies the signature with `verifyWebhook` and logs the event - extend it to write into your database.

## Scripts

```bash
npm run dev        # next dev (Turbopack)
npm run build      # next build
npm run start      # next start
npm run lint       # eslint
npm run format     # prettier --write
npm run format:ci  # prettier --check
```

## Roadmap

- Payload CMS integration: bring `payload` in as a Next.js plugin and use the Clerk webhook to sync `users` collection records.
