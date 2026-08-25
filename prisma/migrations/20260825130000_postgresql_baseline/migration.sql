-- RiftDweller's application tables are managed by Prisma and queried only by
-- the private Prisma database role. Supabase Data API roles receive no grants.

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rulesText" TEXT NOT NULL,
    "flavorText" TEXT,
    "faction" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "attack" INTEGER,
    "health" INTEGER,
    "setCode" TEXT NOT NULL,
    "collectorNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Deck" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Deck_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DeckCard" (
    "deckId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "DeckCard_pkey" PRIMARY KEY ("deckId", "cardId")
);

CREATE TABLE "CardTag" (
    "cardId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    CONSTRAINT "CardTag_pkey" PRIMARY KEY ("cardId", "tag")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Card_slug_key" ON "Card"("slug");
CREATE INDEX "Card_name_idx" ON "Card"("name");
CREATE INDEX "Card_faction_idx" ON "Card"("faction");
CREATE INDEX "Card_type_idx" ON "Card"("type");
CREATE INDEX "Card_rarity_idx" ON "Card"("rarity");
CREATE INDEX "Card_cost_idx" ON "Card"("cost");
CREATE UNIQUE INDEX "Card_setCode_collectorNumber_key" ON "Card"("setCode", "collectorNumber");
CREATE INDEX "Deck_ownerId_updatedAt_idx" ON "Deck"("ownerId", "updatedAt");
CREATE INDEX "DeckCard_cardId_idx" ON "DeckCard"("cardId");
CREATE INDEX "CardTag_tag_idx" ON "CardTag"("tag");

ALTER TABLE "Deck" ADD CONSTRAINT "Deck_ownerId_fkey"
    FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DeckCard" ADD CONSTRAINT "DeckCard_deckId_fkey"
    FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DeckCard" ADD CONSTRAINT "DeckCard_cardId_fkey"
    FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CardTag" ADD CONSTRAINT "CardTag_cardId_fkey"
    FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Defense in depth for Supabase's public schema. The documented dedicated
-- Prisma role uses BYPASSRLS; anon/authenticated receive no table access.
-- anon/authenticated are Supabase-managed roles that don't exist on a plain
-- Postgres instance (e.g. local Docker dev), so the revoke is guarded to
-- keep this migration portable outside Supabase.
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Card" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Deck" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DeckCard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CardTag" ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        EXECUTE 'REVOKE ALL ON TABLE "User", "Card", "Deck", "DeckCard", "CardTag" FROM anon';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        EXECUTE 'REVOKE ALL ON TABLE "User", "Card", "Deck", "DeckCard", "CardTag" FROM authenticated';
    END IF;
END $$;
