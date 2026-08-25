import { randomUUID } from "node:crypto";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import Database from "better-sqlite3";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

let deckModule: typeof import("@/lib/decks");
let prismaModule: typeof import("@/lib/prisma");
let databaseDirectory: string;

const ownerId = `deck-owner-${randomUUID()}`;
const otherUserId = `deck-other-${randomUUID()}`;
const cardId = `deck-card-${randomUUID()}`;
const ownerSession = { user: { id: ownerId } };
const otherSession = { user: { id: otherUserId } };

function createMigratedTestDatabase() {
  databaseDirectory = mkdtempSync(join(tmpdir(), "riftdweller-decks-"));
  const databasePath = join(databaseDirectory, "test.db");
  const database = new Database(databasePath);
  const migrationsRoot = join(process.cwd(), "prisma", "migrations");

  for (const directory of readdirSync(migrationsRoot).sort()) {
    const migrationPath = join(migrationsRoot, directory, "migration.sql");
    if (existsSync(migrationPath)) {
      database.exec(readFileSync(migrationPath, "utf8"));
    }
  }

  database.close();
  process.env.DATABASE_URL = `file:${databasePath.replaceAll("\\", "/")}`;
}

beforeAll(async () => {
  createMigratedTestDatabase();
  deckModule = await import("@/lib/decks");
  prismaModule = await import("@/lib/prisma");

  await prismaModule.prisma.user.createMany({
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
  await prismaModule.prisma.card.create({
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
  await prismaModule?.prisma.$disconnect();
  if (databaseDirectory) {
    rmSync(databaseDirectory, { recursive: true, force: true });
  }
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
      await prismaModule.prisma.deckCard.count({ where: { deckId: deck.id } }),
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
