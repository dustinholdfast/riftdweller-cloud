import Link from "next/link";

export default function DeckNotFound() {
  return (
    <main className="mx-auto grid w-full max-w-3xl flex-1 place-items-center px-6 py-16">
      <section className="flex w-full flex-col items-center rounded-2xl border border-[var(--rift-border)] bg-[var(--rift-surface)] px-6 py-14 text-center">
        <span
          className="grid size-12 place-items-center rounded-full bg-[color:var(--rift-ember-solid)]/15 font-display text-xl text-[var(--rift-ember)]"
          aria-hidden="true"
        >
          ?
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold">This deck is lost beyond the rift</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--rift-text-secondary)]">
          This deck does not exist or is not available to your account.
        </p>
        <Link
          href="/decks"
          className="mt-6 inline-flex min-h-10 items-center rounded-lg bg-[var(--rift-ember-solid)] px-5 text-sm font-semibold text-white hover:bg-[var(--rift-ember-hover)] focus-visible:outline-none focus-visible:shadow-[var(--glow-ember)]"
        >
          Return to my decks
        </Link>
      </section>
    </main>
  );
}
