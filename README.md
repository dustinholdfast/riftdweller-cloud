# RiftDweller Cloud

A deck building and card discovery app built with Next.js, TypeScript,
Tailwind CSS, Prisma, and Supabase Postgres.

## Local development

The app requires a real Postgres connection — there is no in-memory or
file-based fallback, so `DATABASE_URL`/`DIRECT_URL` must point at a live
database before running `npm run dev`. Pick one of the two paths below.

### Option A: local Postgres via Docker (no cloud account needed)

1. Start a local database with `docker compose up -d`. It publishes on host
   port 5435 (not the default 5432) to avoid clashing with any Postgres
   already running on your machine.
2. Copy `.env.example` to `.env` and replace `DATABASE_URL`/`DIRECT_URL` with
   the local values shown in the comment at the top of that file
   (`postgresql://prisma:prisma@localhost:5435/riftdweller`). Generate
   `AUTH_SECRET` with `npx auth secret`.
3. Install dependencies with `npm install`.
4. Apply the schema with `npm run db:migrate`.
5. Load the placeholder card catalog with `npm run db:seed`.
6. Start the app with `npm run dev`.

### Option B: Supabase project

1. Create a Supabase project and follow Supabase's Prisma guide to create a
   dedicated `prisma` database role with `BYPASSRLS` and access to `public`.
2. Copy `.env.example` to `.env`. Set `DATABASE_URL` to the Supavisor
   transaction-pooler URL (port 6543), `DIRECT_URL` to the session/direct URL
   (port 5432), and generate `AUTH_SECRET` with `npx auth secret`. Percent-encode
   reserved characters in the database password when placing it in either URL.
   Keep `pgbouncer=true` on the transaction URL so Prisma does not rely on
   prepared statements that transaction pooling cannot preserve.
3. Install dependencies with `npm install`.
4. Apply the schema with `npm run db:migrate`.
5. Load the placeholder card catalog with `npm run db:seed`.
6. Start the app with `npm run dev`.

Prisma Client is generated automatically after dependency installation. Use
`npm run db:migrate` after adding or changing data models. The catalog seed is
idempotent, so `npm run db:seed` is safe to run again after catalog updates.

Authentication uses Auth.js credentials sessions. User email addresses are
stored normalized to lowercase, passwords are stored only as bcrypt hashes,
and the stable Prisma user ID is exposed as `session.user.id` for ownership
checks.

## Vercel deployment

Configure `DATABASE_URL`, `DIRECT_URL`, and `AUTH_SECRET` as encrypted Vercel
environment variables for Production and Preview. Do not prefix any of them
with `NEXT_PUBLIC_`. Preview deployments should use a separate Supabase
project or branch so migrations and test data cannot affect production.

Before deploying application code, apply committed migrations from a trusted
CI/release environment with `npm run db:deploy`, then run `npm run db:seed` if
the catalog has not been loaded. Migrations intentionally do not run inside
`npm run build`, avoiding concurrent migration attempts across Vercel builds.
The app explicitly targets the Node.js runtime and uses the Supavisor pooled
URL with one connection per function instance. Vercel is pinned to Node.js 22
through `package.json` so local, build, and function runtimes stay aligned.

## Validation

- `npm test`
- `npm run lint`
- `npm run build`
- `npx tsc --noEmit`
- `npx prisma validate`
