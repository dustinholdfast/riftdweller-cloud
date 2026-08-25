import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { listOwnedDecks } from "@/lib/decks";
import { createDeckAction } from "./actions";

export const metadata = { title: "My decks | RiftDweller Cloud" };

export default async function DecksPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/decks");
  const decks = await listOwnedDecks(session);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 md:px-8 md:py-14">
      <header className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rift-ember)]">
          Private collection
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          My decks
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--rift-text-secondary)]">
          Only you can view and change these decks.
        </p>
      </header>

      <section
        aria-labelledby="create-deck-heading"
        className="mb-10 rounded-2xl border border-[var(--rift-border)] bg-[var(--rift-surface)] p-6"
      >
        <h2 id="create-deck-heading" className="font-display text-xl font-semibold">
          Create a deck
        </h2>
        <form action={createDeckAction} className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
          <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--rift-text-tertiary)]">
            <span>Deck name</span>
            <input
              name="name"
              required
              maxLength={80}
              placeholder="Ashen Vanguard"
              className="min-h-11 w-full rounded-md border border-[var(--rift-border)] bg-[var(--rift-surface-raised)] px-3 text-sm normal-case tracking-normal text-[var(--rift-text-primary)] outline-none placeholder:text-[var(--rift-text-tertiary)] hover:border-[var(--rift-border-strong)] focus:border-[var(--rift-arcane)] focus:shadow-[var(--glow-arcane)]"
            />
          </label>
          <button
            type="submit"
            className="min-h-11 self-end rounded-lg border border-transparent bg-[var(--rift-ember-solid)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--rift-ember-hover)] focus-visible:outline-none focus-visible:shadow-[var(--glow-ember)]"
          >
            Create deck
          </button>
        </form>
      </section>

      <section aria-labelledby="saved-decks-heading">
        <div className="mb-4 flex min-h-10 items-center justify-between gap-4 border-b border-[var(--rift-border)] pb-4">
          <h2 id="saved-decks-heading" className="font-display text-xl font-semibold">
            Saved decks
          </h2>
          <p aria-live="polite" className="text-sm text-[var(--rift-text-secondary)]">
            <span className="font-mono text-[var(--rift-text-primary)]">{decks.length}</span>{" "}
            {decks.length === 1 ? "deck" : "decks"}
          </p>
        </div>

        {decks.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <li key={deck.id}>
                <Link
                  href={`/decks/${deck.id}`}
                  className="group flex h-full flex-col rounded-2xl border border-[var(--rift-border)] bg-[var(--rift-surface)] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--rift-border-strong)] hover:bg-[var(--rift-surface-raised)] focus-visible:outline-none focus-visible:shadow-[var(--glow-arcane)]"
                >
                  <h3 className="font-display text-lg font-semibold leading-snug text-[var(--rift-text-primary)]">
                    {deck.name}
                  </h3>
                  <p className="mt-2 font-mono text-xs text-[var(--rift-text-tertiary)]">
                    {deck._count.cards} unique card{deck._count.cards === 1 ? "" : "s"}
                  </p>
                  {deck.description ? (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--rift-text-secondary)]">
                      {deck.description}
                    </p>
                  ) : null}
                  <span className="mt-auto pt-4 text-xs text-[var(--rift-text-tertiary)]">
                    Open deck
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-[var(--rift-border)] bg-[var(--rift-surface)] px-6 py-14 text-center">
            <span
              className="grid size-12 place-items-center rounded-full bg-[color:var(--rift-ember-solid)]/15 text-[var(--rift-ember)]"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-6">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold">No decks yet</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--rift-text-secondary)]">
              Name your first deck above to start drawing cards from the archive.
            </p>
            <Link
              href="/catalog"
              className="mt-6 inline-flex min-h-10 items-center rounded-lg bg-[var(--rift-ember-solid)] px-5 text-sm font-semibold text-white hover:bg-[var(--rift-ember-hover)] focus-visible:outline-none focus-visible:shadow-[var(--glow-ember)]"
            >
              Browse the catalog
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
