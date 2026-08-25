# Decisions

## 2026-08-24

- lead: Repo was a bare scaffold with no code and no card data, despite the brief referencing 'existing card data from the repo' and leaving two open questions unanswered. Asked the user via AskUserQuestion: (1) rule-based vs ML/LLM recommendations — chose rule-based for explainability/cost per the v1 spirit; (2) private vs public decks by default — chose private, consistent with social/sharing features being explicitly out of v1 scope; (3) card data source — chose to generate a placeholder dark-fantasy TCG seed dataset since none exists in-repo. Selected stack: Next.js App Router + TypeScript + Tailwind + Prisma/SQLite + Auth.js credentials + Vitest, per the LOCAL ONLY deploy-mode override (no Supabase/Vercel). Decomposed into 5 phases as one new milestone: foundation/design system + seed data, accounts/auth, catalog browse/search, deck builder (CRUD, private, owned), and rule-based recommendations, with Designer restyle tasks wired after each Coder view task and Tester tasks wired after each Coder task that writes tests for correctness-critical behavior (auth, ownership, recommendation determinism).
- system: {"kind":"state_digest_seed_applied","phase_title":"","section_count":2}
- system: {"kind":"state_digest_seed_applied","phase_title":"","section_count":1}

## 2026-08-25

- system: {"kind":"state_digest_seed_applied","phase_title":"","section_count":2}
- coder: Created the Next.js App Router project with TypeScript and Tailwind, added Prisma 7 SQLite configuration and driver adapter, a reusable cached Prisma client, environment and database scripts, product metadata, starter content, documentation, and ignore rules. Used Prisma 7's adapter-based SQLite structure because that is the current supported configuration. Type checking, linting, Prisma validation/database sync, and the production build all pass. The unresolved npm audit finding is upstream in Prisma CLI and only offers a breaking Prisma 6 downgrade.
