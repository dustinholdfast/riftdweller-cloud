import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getOwnedDeck } from "@/lib/decks";
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

  const [deck, catalog] = await Promise.all([
    getOwnedDeck(session, id),
    prisma.card.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, faction: true, type: true } }),
  ]);
  if (!deck) notFound();

  const updateAction = updateDeckAction.bind(null, deck.id);
  const deleteAction = deleteDeckAction.bind(null, deck.id);
  const setCardAction = setDeckCardQuantityAction.bind(null, deck.id);
  const removeCardAction = removeDeckCardAction.bind(null, deck.id);
  const totalCards = deck.cards.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-10 px-6 py-12">
      <header>
        <Link href="/decks" className="text-sm underline">Back to my decks</Link>
        <h1 className="mt-4 text-3xl font-semibold">{deck.name}</h1>
        <p className="mt-2 text-zinc-400">{totalCards} card{totalCards === 1 ? "" : "s"} across {deck.cards.length} unique entries</p>
      </header>

      <section aria-labelledby="details-heading" className="rounded-lg border border-zinc-800 p-6">
        <h2 id="details-heading" className="text-xl font-semibold">Deck details</h2>
        <form action={updateAction} className="mt-4 grid gap-4">
          <label className="grid gap-2"><span>Name</span><input name="name" required maxLength={80} defaultValue={deck.name} className="min-h-11 rounded border border-zinc-700 bg-zinc-950 px-3" /></label>
          <label className="grid gap-2"><span>Description</span><textarea name="description" maxLength={500} rows={3} defaultValue={deck.description ?? ""} className="rounded border border-zinc-700 bg-zinc-950 p-3" /></label>
          <button type="submit" className="min-h-11 w-fit rounded border border-zinc-600 px-5">Save details</button>
        </form>
      </section>

      <section aria-labelledby="add-card-heading" className="rounded-lg border border-zinc-800 p-6">
        <h2 id="add-card-heading" className="text-xl font-semibold">Add or update a card</h2>
        <form action={setCardAction} className="mt-4 grid gap-4 sm:grid-cols-[1fr_7rem_auto]">
          <label className="grid gap-2"><span>Catalog card</span><select name="cardId" required className="min-h-11 rounded border border-zinc-700 bg-zinc-950 px-3">{catalog.map((card) => <option key={card.id} value={card.id}>{card.name} — {card.faction} {card.type}</option>)}</select></label>
          <label className="grid gap-2"><span>Quantity</span><input name="quantity" type="number" min={1} max={99} defaultValue={1} required className="min-h-11 rounded border border-zinc-700 bg-zinc-950 px-3" /></label>
          <button type="submit" className="min-h-11 self-end rounded border border-zinc-600 px-5">Save card</button>
        </form>
      </section>

      <section aria-labelledby="deck-list-heading">
        <h2 id="deck-list-heading" className="text-xl font-semibold">Deck list</h2>
        {deck.cards.length ? (
          <ul className="mt-4 divide-y divide-zinc-800 rounded-lg border border-zinc-800">
            {deck.cards.map(({ card, quantity }) => (
              <li key={card.id} className="flex flex-wrap items-end justify-between gap-4 p-4">
                <div><Link href={`/catalog/${card.slug}`} className="font-semibold underline-offset-4 hover:underline">{card.name}</Link><p className="text-sm text-zinc-400">{card.faction} · {card.type} · cost {card.cost}</p></div>
                <div className="flex items-end gap-2">
                  <form action={setCardAction} className="flex items-end gap-2"><input type="hidden" name="cardId" value={card.id} /><label className="grid gap-1 text-sm"><span>Quantity</span><input name="quantity" type="number" min={1} max={99} defaultValue={quantity} className="min-h-10 w-20 rounded border border-zinc-700 bg-zinc-950 px-3" /></label><button className="min-h-10 underline" type="submit">Update</button></form>
                  <form action={removeCardAction}><input type="hidden" name="cardId" value={card.id} /><button className="min-h-10 text-red-300 underline" type="submit">Remove</button></form>
                </div>
              </li>
            ))}
          </ul>
        ) : <p className="mt-4 rounded-lg border border-dashed border-zinc-700 p-8 text-zinc-400">This deck is empty. Add a catalog card above.</p>}
      </section>

      <section aria-labelledby="danger-heading" className="border-t border-zinc-800 pt-8">
        <h2 id="danger-heading" className="text-lg font-semibold">Delete deck</h2>
        <p className="mt-2 text-sm text-zinc-400">This permanently removes the deck and its card list.</p>
        <form action={deleteAction} className="mt-4"><button type="submit" className="min-h-11 rounded border border-red-900 px-5 text-red-300">Delete deck</button></form>
      </section>
    </main>
  );
}
