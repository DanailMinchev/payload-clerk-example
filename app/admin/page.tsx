import { auth, currentUser } from "@clerk/nextjs/server";

export default async function AdminPage() {
  const { userId, sessionId } = await auth();
  const user = await currentUser();

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-3xl font-semibold">Admin</h1>
      <p className="mb-6 text-zinc-600 dark:text-zinc-400">
        This route is protected by <code>proxy.ts</code>. Unauthenticated users
        are redirected to <code>/login</code> before reaching this component.
      </p>

      <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 text-xl font-medium">
          Server-side auth() + currentUser()
        </h2>
        <pre className="overflow-auto rounded bg-zinc-50 p-4 text-sm dark:bg-zinc-900">
          {JSON.stringify(
            {
              userId,
              sessionId,
              email: user?.primaryEmailAddress?.emailAddress ?? null,
              fullName: user?.fullName ?? null,
              imageUrl: user?.imageUrl ?? null,
            },
            null,
            2,
          )}
        </pre>
      </section>
    </main>
  );
}
