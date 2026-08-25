# RiftDweller Cloud

Project conventions and context for AI coding agents.

This file is the canonical context for every AI coding agent working in
this project. CLAUDE.md and GEMINI.md point here. Keep it current.

Planning artifacts live in .castforge/ (plan.md, research.md, decisions.md, ui-spec.md, verification.md); peer work-logs live in .castforge/roles/; per-phase records (plan slice, completion summary, verification verdict) live in .castforge/phases/<phase>/; investigation notes live in .castforge/debug/. Read them before starting work.

## Conventions

Document the coding conventions, style rules, and patterns the team
should follow here.

## Commands

- `npm run dev` - start the local Next.js development server.
- `npm run build` - create a production build.
- `npm run lint` - run ESLint.
- `npm run db:generate` - regenerate Prisma Client.
- `npm run db:migrate` - create and apply a local SQLite migration.
- `npm run db:seed` - idempotently seed the placeholder card catalog.
- `npm run db:studio` - inspect the local database with Prisma Studio.

## Notes

- The app uses the App Router under `src/app` and the `@/*` import alias.
- Prisma Client is generated into `src/generated/prisma` and should not be
  edited by hand.
- Local SQLite files under `prisma/` are intentionally ignored.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
