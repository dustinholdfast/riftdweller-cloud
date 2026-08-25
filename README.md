# RiftDweller Cloud

A local-first deck building and card discovery app built with Next.js,
TypeScript, Tailwind CSS, Prisma, and SQLite.

## Local development

1. Copy `.env.example` to `.env` if you want to override the default database
   location.
2. Install dependencies with `npm install`.
3. Create the local database with `npm run db:migrate`.
4. Load the placeholder card catalog with `npm run db:seed`.
5. Start the app with `npm run dev`.

Prisma Client is generated automatically after dependency installation. Use
`npm run db:migrate` after adding or changing data models. The catalog seed is
idempotent, so `npm run db:seed` is safe to run again after catalog updates.

## Validation

- `npm run lint`
- `npm run build`
- `npx tsc --noEmit`
- `npx prisma validate`
