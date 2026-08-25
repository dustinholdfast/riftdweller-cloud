import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getOwnedDeck } from "@/lib/decks";
import { getDeckRecommendations } from "@/lib/recommendations";
import {
  deleteDeckAction,
  removeDeckCardAction,
  setDeckCardQuantityAction,
  updateDeckAction,
} from "../actions";

export default async function DeckEditorPage({ params }: PageProps<"/decks/[id]">) {
  const session = await auth();
  const { id } = await params;
  if (!session?.user) redirect(`/login?callbackUrl=/decks/${id}`);

  const [deck, catalog, recommendations] = await Promise.all([
    getOwnedDeck(session, id),
    prisma.card.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, faction: true, type: true } }),
    getDeckRecommendations(session, id),
  ]);
  if (!deck || !recommendations) notFound();

  const updateAction = updateDeckAction.bind(null, deck.id);
  const deleteAction = deleteDeckAction.bind(null, deck.id);
  const setCardAction = setDeckCardQuantityAction.bind(null, deck.id);
  const removeCardAction = removeDeckCardAction.bind(null, deck.id);
  const totalCards = deck.cards.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-28 pt-10 md:px-8 md:pt-14">
      <Link
        href="/decks"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--rift-text-primary)] underline decoration-[var(--rift-arcane)] underline-offset-4 focus-visible:outline-none focus-visible:shadow-[var(--glow-arcane)]"
      >
        &larr; My decks
      </Link>

      <header className="mt-4 mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rift-ember)]">Deck editor</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{deck.name}</h1>
        <p className="mt-3 text-sm text-[var(--rift-text-secondary)]">
          <span className="font-mono text-[var(--rift-text-primary)]">{totalCards}</span> card{totalCards === 1 ? "" : "s"}
          {" "}across{" "}
          <span className="font-mono text-[var(--rift-text-primary)]">{deck.cards.length}</span> unique entr{deck.cards.length === 1 ? "y" : "ies"}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[20rem_1fr] lg:items-start">
        {/* Sidebar: deck settings */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <section
            aria-labelledby="details-heading"
            className="rounded-2xl border border-[var(--rift-border)] bg-[var(--rift-surface)] p-6"
          >
            <h2 id="details-heading" className="font-display text-lg font-semibold">Deck details</h2>
            <form action={updateAction} className="mt-4 grid gap-4">
              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--rift-text-tertiary)]">
                <span>Name</span>
                <input
                  name="name"
                  required
                  maxLength={80}
                  defaultValue={deck.name}
                  className="min-h-11 rounded-md border border-[var(--rift-border)] bg-[var(--rift-surface-raised)] px-3 text-sm normal-case tracking-normal text-[var(--rift-text-primary)] outline-none hover:border-[var(--rift-border-strong)] focus:border-[var(--rift-arcane)] focus:shadow-[var(--glow-arcane)]"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--rift-text-tertiary)]">
                <span>Description</span>
                <textarea
                  name="description"
                  maxLength={500}
                  rows={3}
                  defaultValue={deck.description ?? ""}
                  className="rounded-md border border-[var(--rift-border)] bg-[var(--rift-surface-raised)] p-3 text-sm normal-case tracking-normal leading-6 text-[var(--rift-text-primary)] outline-none hover:border-[var(--rift-border-strong)] focus:border-[var(--rift-arcane)] focus:shadow-[var(--glow-arcane)]"
                />
              </label>
              <button
                type="submit"
                className="min-h-11 w-fit rounded-lg border border-transparent bg-[var(--rift-ember-solid)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--rift-ember-hover)] focus-visible:outline-none focus-visible:shadow-[var(--glow-ember)]"
              >
                Save details
              </button>
            </form>
          </section>

          <section
            aria-labelledby="danger-heading"
            className="rounded-2xl border border-[color:var(--rift-danger)]/35 bg-[var(--rift-danger-bg)] p-6"
          >
            <h2 id="danger-heading" className="font-display text-base font-semibold text-[var(--rift-text-primary)]">
              Delete deck
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--rift-text-secondary)]">
              This permanently removes the deck and its card list.
            </p>
            <form action={deleteAction} className="mt-4">
              <button
                type="submit"
                className="min-h-10 rounded-lg border border-[color:var(--rift-danger)]/45 px-5 text-sm font-semibold text-[var(--rift-danger)] transition hover:bg-[color:var(--rift-danger)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rift-danger)]"
              >
                Delete deck
              </button>
            </form>
          </section>
        </div>

        {/* Main: deck contents + catalog picker */}
        <div className="space-y-8">
          <section aria-labelledby="deck-list-heading">
            <div className="mb-4 flex min-h-10 items-center justify-between gap-4 border-b border-[var(--rift-border)] pb-4">
              <h2 id="deck-list-heading" className="font-display text-xl font-semibold">Deck list</h2>
              <p aria-live="polite" className="text-sm text-[var(--rift-text-secondary)]">
                <span className="font-mono text-[var(--rift-text-primary)]">{totalCards}</span> total
              </p>
            </div>

            {deck.cards.length ? (
              <ul className="divide-y divide-[var(--rift-border)] overflow-hidden rounded-2xl border border-[var(--rift-border)] bg-[var(--rift-surface)]">
                {deck.cards.map(({ card, quantity }) => {
                  const nextQuantity = Math.min(quantity + 1, 99);
                  const prevQuantity = quantity - 1;

                  return (
                    <li key={card.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="grid size-9 shrink-0 place-items-center rounded-full border border-[var(--rift-border-strong)] bg-[var(--rift-surface-raised)] font-mono text-sm"
                          aria-label={`${card.cost} cost`}
                        >
                          {card.cost}
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={`/catalog/${card.slug}`}
                            className="font-display text-base font-semibold text-[var(--rift-text-primary)] underline-offset-4 hover:underline"
                          >
                            {card.name}
                          </Link>
                          <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[var(--rift-text-tertiary)]">
                            {card.faction} &middot; {card.type}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-lg border border-[var(--rift-border)] bg-[var(--rift-surface-raised)]">
                          <form action={prevQuantity < 1 ? removeCardAction : setCardAction}>
                            <input type="hidden" name="cardId" value={card.id} />
                            {prevQuantity >= 1 ? <input type="hidden" name="quantity" value={prevQuantity} /> : null}
                            <button
                              type="submit"
                              aria-label={`Remove one ${card.name}`}
                              className="grid size-10 place-items-center text-lg font-semibold text-[var(--rift-text-primary)] transition hover:bg-[var(--rift-surface)] focus-visible:outline-none focus-visible:shadow-[var(--glow-arcane)]"
                            >
                              &minus;
                            </button>
                          </form>
                          <span
                            className="min-w-10 select-none text-center font-mono text-sm text-[var(--rift-text-primary)]"
                            aria-live="polite"
                          >
                            {quantity}
                          </span>
                          <form action={setCardAction}>
                            <input type="hidden" name="cardId" value={card.id} />
                            <input type="hidden" name="quantity" value={nextQuantity} />
                            <button
                              type="submit"
                              disabled={quantity >= 99}
                              aria-label={`Add one more ${card.name}`}
                              className="grid size-10 place-items-center text-lg font-semibold text-[var(--rift-text-primary)] transition hover:bg-[var(--rift-surface)] focus-visible:outline-none focus-visible:shadow-[var(--glow-arcane)] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              +
                            </button>
                          </form>
                        </div>
                        <form action={removeCardAction}>
                          <input type="hidden" name="cardId" value={card.id} />
                          <button
                            type="submit"
                            className="min-h-10 rounded-md px-2 text-sm font-semibold text-[var(--rift-danger)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rift-danger)]"
                          >
                            Remove
                          </button>
                        </form>
                      </div>
                    </li>
                  );
                })}
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
                <h3 className="mt-5 font-display text-2xl font-semibold">This deck is empty</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-[var(--rift-text-secondary)]">
                  Add cards from the catalog picker below to start building.
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

          <section
            aria-labelledby="recommendations-heading"
            className="rounded-2xl border border-[var(--rift-border)] bg-[var(--rift-surface)] p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rift-arcane)]">
              Arcane counsel
            </p>
            <h2 id="recommendations-heading" className="mt-2 font-display text-xl font-semibold">
              Recommended cards
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--rift-text-secondary)]">
              Suggestions adapt to this deck&apos;s factions, tags, card types, and mana curve.
            </p>

            {recommendations.length ? (
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {recommendations.map(({ card, reasons }) => (
                  <li
                    key={card.id}
                    className="flex flex-col rounded-xl border border-[var(--rift-border)] bg-[var(--rift-surface-raised)] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/catalog/${card.slug}`}
                          className="font-display font-semibold text-[var(--rift-text-primary)] underline-offset-4 hover:underline"
                        >
                          {card.name}
                        </Link>
                        <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[var(--rift-text-tertiary)]">
                          {card.faction} &middot; {card.type} &middot; Cost {card.cost}
                        </p>
                      </div>
                      <span className="font-mono text-sm text-[var(--rift-text-primary)]" aria-label={`${card.cost} cost`}>
                        {card.cost}
                      </span>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-[var(--rift-text-secondary)]">
                      {reasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                    <form action={setCardAction} className="mt-auto pt-5">
                      <input type="hidden" name="cardId" value={card.id} />
                      <input type="hidden" name="quantity" value="1" />
                      <button
                        type="submit"
                        className="min-h-10 rounded-lg bg-[var(--rift-arcane-solid)] px-4 text-sm font-semibold text-white hover:bg-[var(--rift-arcane-hover)] focus-visible:outline-none focus-visible:shadow-[var(--glow-arcane)]"
                      >
                        Add to deck
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-[var(--rift-border)] p-6 text-center">
                <h3 className="font-display text-lg font-semibold">No new suggestions</h3>
                <p className="mt-2 text-sm text-[var(--rift-text-secondary)]">
                  Every catalog card is already represented in this deck.
                </p>
              </div>
            )}
          </section>

          <section
            aria-labelledby="add-card-heading"
            className="rounded-2xl border border-[var(--rift-border)] bg-[var(--rift-surface)] p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rift-ember)]">Catalog picker</p>
            <h2 id="add-card-heading" className="mt-2 font-display text-xl font-semibold">Add or update a card</h2>
            <form action={setCardAction} className="mt-4 grid gap-4 sm:grid-cols-[1fr_7rem_auto] sm:items-end">
              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--rift-text-tertiary)]">
                <span>Catalog card</span>
                <select
                  name="cardId"
                  required
                  className="min-h-11 rounded-md border border-[var(--rift-border)] bg-[var(--rift-surface-raised)] px-3 text-sm normal-case tracking-normal text-[var(--rift-text-primary)] outline-none hover:border-[var(--rift-border-strong)] focus:border-[var(--rift-arcane)] focus:shadow-[var(--glow-arcane)]"
                >
                  {catalog.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.name} &mdash; {card.faction} {card.type}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--rift-text-tertiary)]">
                <span>Quantity</span>
                <input
                  name="quantity"
                  type="number"
                  min={1}
                  max={99}
                  defaultValue={1}
                  required
                  className="min-h-11 rounded-md border border-[var(--rift-border)] bg-[var(--rift-surface-raised)] px-3 text-sm normal-case tracking-normal text-[var(--rift-text-primary)] outline-none hover:border-[var(--rift-border-strong)] focus:border-[var(--rift-arcane)] focus:shadow-[var(--glow-arcane)]"
                />
              </label>
              <button
                type="submit"
                className="min-h-11 rounded-lg border border-transparent bg-[var(--rift-ember-solid)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--rift-ember-hover)] focus-visible:outline-none focus-visible:shadow-[var(--glow-ember)]"
              >
                Add to deck
              </button>
            </form>
          </section>
        </div>
      </div>

      {/* Sticky deck-total footer */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-[var(--rift-border)] bg-[color:var(--rift-surface)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3 md:px-8">
          <p className="text-sm text-[var(--rift-text-secondary)]">
            <span className="font-display text-base font-semibold text-[var(--rift-text-primary)]">{deck.name}</span>
          </p>
          <p className="font-mono text-sm text-[var(--rift-text-primary)]">
            {totalCards} card{totalCards === 1 ? "" : "s"}
          </p>
        </div>
      </div>
    </main>
  );
}
