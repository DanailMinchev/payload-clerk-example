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

<!-- BEGIN:payload-skill -->

# Payload skill reference

When touching Payload (`src/payload.config.ts`, `src/collections/**`, hooks, access control, REST/GraphQL endpoints, custom admin components), consult the in-repo Payload skill at `.agents/skills/payload/` (also surfaced via the symlink `.claude/skills/payload`). Start with `SKILL.md` for the Quick Reference table, then drill into `reference/` for the relevant deep-dive: `COLLECTIONS.md`, `FIELDS.md`, `HOOKS.md`, `ACCESS-CONTROL.md` (+`-ADVANCED`), `QUERIES.md`, `ADAPTERS.md`, `ENDPOINTS.md`, `PLUGIN-DEVELOPMENT.md`, `ADVANCED.md`, `FIELD-TYPE-GUARDS.md`.

Auto-generated `src/payload-types.ts` and `src/app/(payload)/admin/importMap.js` must not be hand-edited — regenerate via `npm run payload:generate:types` / `npm run payload:generate:importmap`. Both files are already in `.prettierignore` and the ESLint `globalIgnores`.

**Project-specific overrides** when reading the skill:

- **DB adapter**: skill's `SKILL.md` Quick Start defaults to MongoDB (`mongooseAdapter`). This project uses Postgres (`postgresAdapter` from `@payloadcms/db-postgres`); see actual config at `src/payload.config.ts`. Go to `reference/ADAPTERS.md` for Postgres details rather than the SKILL.md example.
- **Package manager**: skill examples use `pnpm` (`pnpm dev`, `pnpm install`). This project uses npm (`npm run dev`, `npm install`). Translate `pnpm` → `npm run` mentally when reading the skill. `reference/PLUGIN-DEVELOPMENT.md` leans heavily on Mongo + pnpm — only relevant if/when authoring Payload plugins.

<!-- END:payload-skill -->
