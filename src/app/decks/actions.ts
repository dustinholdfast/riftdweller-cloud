"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  createDeck,
  deleteDeck,
  removeDeckCard,
  setDeckCardQuantity,
  updateDeck,
} from "@/lib/decks";

export async function createDeckAction(formData: FormData) {
  const deck = await createDeck(await auth(), {
    name: formData.get("name"),
    description: formData.get("description"),
  });
  redirect(`/decks/${deck.id}`);
}

export async function updateDeckAction(deckId: string, formData: FormData) {
  await updateDeck(await auth(), deckId, {
    name: formData.get("name"),
    description: formData.get("description"),
  });
  revalidatePath(`/decks/${deckId}`);
  revalidatePath("/decks");
}

export async function deleteDeckAction(deckId: string) {
  await deleteDeck(await auth(), deckId);
  revalidatePath("/decks");
  redirect("/decks");
}

export async function setDeckCardQuantityAction(deckId: string, formData: FormData) {
  await setDeckCardQuantity(
    await auth(),
    deckId,
    String(formData.get("cardId") ?? ""),
    formData.get("quantity"),
  );
  revalidatePath(`/decks/${deckId}`);
  revalidatePath("/decks");
}

export async function removeDeckCardAction(deckId: string, formData: FormData) {
  await removeDeckCard(
    await auth(),
    deckId,
    String(formData.get("cardId") ?? ""),
  );
  revalidatePath(`/decks/${deckId}`);
  revalidatePath("/decks");
}
