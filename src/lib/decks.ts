import { requireAuthenticatedUserId, requireResourceOwner } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export type DeckSession = Parameters<typeof requireAuthenticatedUserId>[0];

export class DeckValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeckValidationError";
  }
}

function requiredText(value: unknown, field: string, maximum: number) {
  const text = typeof value === "string" ? value.trim() : "";

  if (!text) {
    throw new DeckValidationError(`${field} is required.`);
  }

  if (text.length > maximum) {
    throw new DeckValidationError(`${field} must be ${maximum} characters or fewer.`);
  }

  return text;
}

function optionalText(value: unknown, field: string, maximum: number) {
  if (value == null || value === "") return null;
  const text = typeof value === "string" ? value.trim() : "";

  if (text.length > maximum) {
    throw new DeckValidationError(`${field} must be ${maximum} characters or fewer.`);
  }

  return text || null;
}

function validQuantity(value: unknown) {
  const quantity = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    throw new DeckValidationError("Quantity must be a whole number from 1 to 99.");
  }

  return quantity;
}

async function requireOwnedDeck(session: DeckSession, deckId: string) {
  const userId = requireAuthenticatedUserId(session);
  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    select: { id: true, ownerId: true },
  });

  if (!deck) return null;
  requireResourceOwner({ user: { id: userId } }, deck.ownerId);
  return deck;
}

export async function listOwnedDecks(session: DeckSession) {
  const ownerId = requireAuthenticatedUserId(session);

  return prisma.deck.findMany({
    where: { ownerId },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { cards: true } } },
  });
}

export async function getOwnedDeck(session: DeckSession, deckId: string) {
  const ownedDeck = await requireOwnedDeck(session, deckId);
  if (!ownedDeck) return null;

  return prisma.deck.findUnique({
    where: { id: ownedDeck.id },
    include: {
      cards: {
        orderBy: { card: { name: "asc" } },
        include: { card: true },
      },
    },
  });
}

export async function createDeck(
  session: DeckSession,
  input: { name: unknown; description?: unknown },
) {
  const ownerId = requireAuthenticatedUserId(session);

  return prisma.deck.create({
    data: {
      ownerId,
      name: requiredText(input.name, "Deck name", 80),
      description: optionalText(input.description, "Description", 500),
    },
  });
}

export async function updateDeck(
  session: DeckSession,
  deckId: string,
  input: { name: unknown; description?: unknown },
) {
  const deck = await requireOwnedDeck(session, deckId);
  if (!deck) return null;

  return prisma.deck.update({
    where: { id: deck.id },
    data: {
      name: requiredText(input.name, "Deck name", 80),
      description: optionalText(input.description, "Description", 500),
    },
  });
}

export async function deleteDeck(session: DeckSession, deckId: string) {
  const deck = await requireOwnedDeck(session, deckId);
  if (!deck) return false;

  await prisma.deck.delete({ where: { id: deck.id } });
  return true;
}

export async function setDeckCardQuantity(
  session: DeckSession,
  deckId: string,
  cardId: string,
  quantity: unknown,
) {
  const deck = await requireOwnedDeck(session, deckId);
  if (!deck) return null;
  const parsedQuantity = validQuantity(quantity);

  const cardExists = await prisma.card.findUnique({
    where: { id: cardId },
    select: { id: true },
  });
  if (!cardExists) throw new DeckValidationError("Card does not exist.");

  return prisma.deckCard.upsert({
    where: { deckId_cardId: { deckId: deck.id, cardId } },
    create: { deckId: deck.id, cardId, quantity: parsedQuantity },
    update: { quantity: parsedQuantity },
  });
}

export async function removeDeckCard(
  session: DeckSession,
  deckId: string,
  cardId: string,
) {
  const deck = await requireOwnedDeck(session, deckId);
  if (!deck) return false;

  await prisma.deckCard.deleteMany({ where: { deckId: deck.id, cardId } });
  return true;
}
