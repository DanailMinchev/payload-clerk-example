<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:clerk-rsc-rule -->

# Clerk components in server-component layouts

Clerk's `<SignInButton>`, `<SignUpButton>`, `<SignOutButton>`, `<UserButton>` validate their JSX children with `React.Children.only` / `React.isValidElement`. Children created in a server component (e.g. `app/layout.tsx`) cross the RSC boundary as `React.lazy` references and **fail those checks** — `SignUpButton` crashes 500, `UserButton.MenuItems` silently disappear.

**Rule:** When a Clerk component needs JSX children, wrap it in a `"use client"` component under `src/components/clerk/<kebab-name>.tsx` and construct the children _inside_ that client boundary. Do the same when the component needs Clerk hooks (`useUser`, `useAuth`, etc.).

Bare usages with no children (`<UserButton />`, `<SignInButton />`) are fine in server components — extract only when adding children or hooks.

<!-- END:clerk-rsc-rule -->

<!-- BEGIN:components-convention -->

# Components folder convention

`src/components/` is grouped by domain (`app/`, `clerk/`, `ui/`, …). Inside a domain, components are **flat kebab-case files by default** (`clerk/sign-up-button.tsx`). Promote to a folder _only_ when a second colocated file is added (server actions, sub-components, hooks, types) — `clerk/sign-up-button/` containing `index.tsx` plus the extra file(s). File names: kebab-case. Component exports: PascalCase, named exports.

Do not create barrel `index.ts` re-exports for flat domain folders — import the file path directly. Empty domain folders are kept under git via `.gitkeep`; delete it when the first real file lands.

<!-- END:components-convention -->
