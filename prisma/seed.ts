import "dotenv/config";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { CARD_CATALOG } from "../src/data/card-catalog";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const { tags, ...card } of CARD_CATALOG) {
    await prisma.card.upsert({
      where: { slug: card.slug },
      create: {
        ...card,
        tags: { create: tags.map((tag) => ({ tag })) },
      },
      update: {
        ...card,
        tags: {
          deleteMany: {},
          create: tags.map((tag) => ({ tag })),
        },
      },
    });
  }

  console.log(`Seeded ${CARD_CATALOG.length} RiftDweller cards.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
