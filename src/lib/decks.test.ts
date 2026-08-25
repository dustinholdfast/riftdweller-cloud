import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { newDb } from "pg-mem";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

let deckModule: typeof import("@/lib/decks");
const users = new Map<string, { id: string; email: string; passwordHash: string }>();
const cards = new Map<string, Record<string, unknown>>();
const decks = new Map<
  string,
  {
    id: string;
    ownerId: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }
>();
const deckCards = new Map<
  string,
  { deckId: string; cardId: string; quantity: number }
>();

const prismaMock = {
  user: {
    createMany: async ({ data }: { data: Array<{ id: string; email: string; passwordHash: string }> }) => {
      data.forEach((user) => users.set(user.id, user));
    },
  },
  card: {
    create: async ({ data }: { data: Record<string, unknown> & { id: string } }) => {
      cards.set(data.id, data);
      return data;
    },
    findUnique: async ({ where }: { where: { id: string } }) => {
      const card = cards.get(where.id);
      return card ? { id: card.id } : null;
    },
  },
  deck: {
    create: async ({ data }: { data: { ownerId: string; name: string; description: string | null } }) => {
      const now = new Date();
      const deck = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
      decks.set(deck.id, deck);
      return deck;
    },
    findUnique: async ({ where, include }: { where: { id: string }; include?: unknown }) => {
      const deck = decks.get(where.id);
      if (!deck) return null;
      if (!include) return { id: deck.id, ownerId: deck.ownerId };

      const entries = [...deckCards.values()]
        .filter((entry) => entry.deckId === deck.id)
        .map((entry) => ({ ...entry, card: cards.get(entry.cardId) }))
        .sort((a, b) => String(a.card?.name).localeCompare(String(b.card?.name)));
      return { ...deck, cards: entries };
    },
    findMany: async ({ where }: { where: { ownerId: string } }) =>
      [...decks.values()]
        .filter((deck) => deck.ownerId === where.ownerId)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .map((deck) => ({
          ...deck,
          _count: {
            cards: [...deckCards.values()].filter(
              (entry) => entry.deckId === deck.id,
            ).length,
          },
        })),
    update: async ({ where, data }: { where: { id: string }; data: { name: string; description: string | null } }) => {
      const deck = decks.get(where.id)!;
      const updated = { ...deck, ...data, updatedAt: new Date() };
      decks.set(updated.id, updated);
      return updated;
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const deck = decks.get(where.id)!;
      decks.delete(where.id);
      for (const [key, entry] of deckCards) {
        if (entry.deckId === where.id) deckCards.delete(key);
      }
      return deck;
    },
  },
  deckCard: {
    upsert: async ({ create, update }: { create: { deckId: string; cardId: string; quantity: number }; update: { quantity: number } }) => {
      const key = `${create.deckId}:${create.cardId}`;
      const entry = deckCards.get(key)
        ? { ...deckCards.get(key)!, ...update }
        : create;
      deckCards.set(key, entry);
      return entry;
    },
    deleteMany: async ({ where }: { where: { deckId: string; cardId: string } }) => {
      deckCards.delete(`${where.deckId}:${where.cardId}`);
    },
    count: async ({ where }: { where: { deckId: string } }) =>
      [...deckCards.values()].filter((entry) => entry.deckId === where.deckId)
        .length,
  },
};

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

const ownerId = `deck-owner-${randomUUID()}`;
const otherUserId = `deck-other-${randomUUID()}`;
const cardId = `deck-card-${randomUUID()}`;
const ownerSession = { user: { id: ownerId } };
const otherSession = { user: { id: otherUserId } };

function createMigratedTestDatabase() {
  const database = newDb({ autoCreateForeignKeyIndices: true });
  const migration = readFileSync(
    join(
      process.cwd(),
      "prisma",
      "migrations",
      "20260825130000_postgresql_baseline",
      "migration.sql",
    ),
    "utf8",
  );

  // pg-mem does not model Supabase roles or RLS. Run the complete relational
  // baseline here; static assertions below cover the Supabase security tail.
  const [relationalSchema, securityStatements = ""] = migration.split(
    "-- Defense in depth",
  );
  database.public.none(relationalSchema);
  expect(securityStatements).toContain("ENABLE ROW LEVEL SECURITY");
  expect(securityStatements).toContain("REVOKE ALL ON TABLE");
  expect(securityStatements).toContain("FROM anon");
  expect(securityStatements).toContain("FROM authenticated");
  database.public.none(`
    INSERT INTO "User" ("id", "email", "passwordHash", "updatedAt")
    VALUES ('migration-check', 'migration@example.com', 'test', NOW());
  `);
  expect(database.public.one(`SELECT COUNT(*) AS count FROM "User"`)).toEqual({
    count: 1,
  });
}

beforeAll(async () => {
  createMigratedTestDatabase();
  deckModule = await import("@/lib/decks");

  await prismaMock.user.createMany({
    data: [
      {
        id: ownerId,
        email: `${ownerId}@example.com`,
        passwordHash: "test-only",
      },
      {
        id: otherUserId,
        email: `${otherUserId}@example.com`,
        passwordHash: "test-only",
      },
    ],
  });
  await prismaMock.card.create({
    data: {
      id: cardId,
      slug: cardId,
      name: "Persistence Sentinel",
      rulesText: "Verifies saved deck cards.",
      faction: "Riftborn",
      type: "Unit",
      rarity: "Common",
      cost: 1,
      attack: 1,
      health: 1,
      setCode: "TST",
      collectorNumber: 1,
    },
  });
});

afterAll(async () => {
  users.clear();
  cards.clear();
  decks.clear();
  deckCards.clear();
});

describe("deck ownership and persistence", () => {
  it("persists the owning user's complete deck lifecycle", async () => {
    const deck = await deckModule.createDeck(ownerSession, {
      name: "  First Breach  ",
      description: "  Saved between visits.  ",
    });

    expect(deck).toMatchObject({
      ownerId,
      name: "First Breach",
      description: "Saved between visits.",
    });
    await deckModule.setDeckCardQuantity(ownerSession, deck.id, cardId, 3);
    await deckModule.updateDeck(ownerSession, deck.id, {
      name: "Second Breach",
      description: "Updated and persisted.",
    });

    const persisted = await deckModule.getOwnedDeck(ownerSession, deck.id);
    expect(persisted).toMatchObject({
      id: deck.id,
      ownerId,
      name: "Second Breach",
      description: "Updated and persisted.",
      cards: [{ cardId, quantity: 3 }],
    });
    expect(await deckModule.listOwnedDecks(ownerSession)).toEqual([
      expect.objectContaining({
        id: deck.id,
        ownerId,
        _count: { cards: 1 },
      }),
    ]);

    await deckModule.removeDeckCard(ownerSession, deck.id, cardId);
    expect((await deckModule.getOwnedDeck(ownerSession, deck.id))?.cards).toEqual(
      [],
    );
    expect(await deckModule.deleteDeck(ownerSession, deck.id)).toBe(true);
    expect(await deckModule.getOwnedDeck(ownerSession, deck.id)).toBeNull();
    expect(
      await prismaMock.deckCard.count({ where: { deckId: deck.id } }),
    ).toBe(0);
  });

  it("isolates listings and rejects every cross-owner access path", async () => {
    const deck = await deckModule.createDeck(ownerSession, {
      name: "Owner Only",
    });

    expect(await deckModule.listOwnedDecks(otherSession)).toEqual([]);

    const deniedOperations = [
      () => deckModule.getOwnedDeck(otherSession, deck.id),
      () =>
        deckModule.updateDeck(otherSession, deck.id, {
          name: "Stolen",
        }),
      () => deckModule.setDeckCardQuantity(otherSession, deck.id, cardId, 2),
      () => deckModule.removeDeckCard(otherSession, deck.id, cardId),
      () => deckModule.deleteDeck(otherSession, deck.id),
    ];

    for (const operation of deniedOperations) {
      await expect(operation()).rejects.toMatchObject({
        status: 403,
        code: "FORBIDDEN",
      });
    }

    expect(await deckModule.getOwnedDeck(ownerSession, deck.id)).toMatchObject({
      id: deck.id,
      name: "Owner Only",
      cards: [],
    });
  });

  it("requires authentication before deck reads or writes", async () => {
    await expect(deckModule.listOwnedDecks(null)).rejects.toMatchObject({
      status: 401,
      code: "UNAUTHENTICATED",
    });
    await expect(
      deckModule.createDeck(null, { name: "Anonymous" }),
    ).rejects.toMatchObject({
      status: 401,
      code: "UNAUTHENTICATED",
    });
  });
});
