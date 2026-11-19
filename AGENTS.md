<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## What this is

- `salonbook-client`: Next.js 16 (App Router, Turbopack) frontend for a salon-booking assignment app. Package manager is **npm** (`package-lock.json`) — don't introduce yarn/pnpm.
- Sibling folder `../salonbook-server` is a **separate git repo**: a plain Express REST API this client depends on.

## Commands

- `npm run dev` — dev server on :3000 (also (re)writes the block above; commit it with your work).
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`), whole repo, no file args.
- `npx tsc --noEmit` — typecheck (no npm script; `next build` type-checks too).
- Verify in order: `npm run lint` → `npx tsc --noEmit` → `npm run build`.
- Lint exits 0; only remaining warnings are `<img>` vs `next/image` in a few pages. Don't add new errors.
- There are **no tests, no CI, no formatter**. Don't invent test/format commands.

## Running the stack

- Backend: `cd ../salonbook-server && node index.js` → http://localhost:5000. Service/booking pages fail without it.
- Env lives in `.env` at repo root (gitignored, auto-loaded by Next): `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_API_BASE_URL` (client default: `http://localhost:5000`, see `src/lib/api/config.ts`), `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (unset → `next build` warns about Google login).

## Architecture

- Auth is **Better Auth** (not NextAuth): server config `src/lib/auth.ts` (MongoDB adapter, db name `salonbook`), client `src/lib/auth-client.ts`, handler `src/app/api/auth/[...all]/route.ts`. Users carry a custom `role: "customer" | "admin"` field chosen at sign-up.
- `/dashboard` is a server-side role resolver: admin → `/dashboard/admin`, customer → `/dashboard/customer`, signed-out → customer (assignment requirement).
- **No `middleware.ts` and no server-side session checks on admin/customer subpages** — protection is UI-level only (nav/sidebar hide links). Don't assume a route is guarded.
- `src/lib/actions/services.ts` despite the name is **plain `fetch()` wrappers against the Express API, not React Server Actions** (no `"use server"`). Same pattern in `src/components/services/BookingWidget.tsx`.
- Several files keep large commented-out older versions (marked `2nd codes` / `3rd codes` / "should be delete"): the topmost active block is authoritative — don't resurrect commented code.
- Local-dev session gotcha documented in `src/lib/auth.ts`: Better Auth cookies are host-scoped (not port-scoped), so this app can clobber sessions of other apps served from localhost.

## UI stack quirks

- **Tailwind v4, CSS-first**: no `tailwind.config`; tokens live in `src/app/globals.css`, wired through the `@tailwindcss/turbopack` loader rule in `next.config.ts`.
- shadcn/ui style `base-nova` uses **`@base-ui/react`, not Radix**: compose elements with the `render` prop (`render={<Link />}`), **not `asChild`**. `cn` comes from the `cn` package (re-exported by `src/lib/utils.ts`); components import `from "cn"` directly.
- Add/refresh UI primitives with the shadcn CLI: `npx shadcn add <component>` (`components.json` defines aliases `@/components`, `@/lib`, `@/hooks`).
- Path alias: `@/*` → `src/*`.
- Feature components are split between `src/components/<area>/` and `src/app/components/` — follow the neighborhood of the page you're editing.
