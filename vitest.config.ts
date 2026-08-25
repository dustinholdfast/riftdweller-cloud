import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    env: {
      // Pure unit suites import modules that expose the Prisma singleton but do
      // not query it. Persistence tests replace that singleton with pg-mem.
      DATABASE_URL: "postgresql://prisma:prisma@localhost:5432/riftdweller_test",
    },
  },
});
