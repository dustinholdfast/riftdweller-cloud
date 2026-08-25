import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { CARD_CATALOG } from "../src/data/card-catalog";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL or DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaPg({
  connectionString,
  max: 1,
  connectionTimeoutMillis: 5_000,
});
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
