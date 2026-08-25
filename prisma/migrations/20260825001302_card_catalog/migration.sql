-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CardTag" (
    "cardId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    PRIMARY KEY ("cardId", "tag"),
    CONSTRAINT "CardTag_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_slug_key" ON "Card"("slug");

-- CreateIndex
CREATE INDEX "Card_name_idx" ON "Card"("name");

-- CreateIndex
CREATE INDEX "Card_faction_idx" ON "Card"("faction");

-- CreateIndex
CREATE INDEX "Card_type_idx" ON "Card"("type");

-- CreateIndex
CREATE INDEX "Card_rarity_idx" ON "Card"("rarity");

-- CreateIndex
CREATE INDEX "Card_cost_idx" ON "Card"("cost");

-- CreateIndex
CREATE UNIQUE INDEX "Card_setCode_collectorNumber_key" ON "Card"("setCode", "collectorNumber");

-- CreateIndex
CREATE INDEX "CardTag_tag_idx" ON "CardTag"("tag");
