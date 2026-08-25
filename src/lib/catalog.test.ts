import { describe, expect, it } from "vitest";

import { buildCatalogWhere, parseCatalogFilters } from "@/lib/catalog";

describe("catalog filters", () => {
  it("normalizes search text and accepts known filter values", () => {
    expect(
      parseCatalogFilters({
        q: "  undead  ",
        faction: "Umbral Court",
        type: "Unit",
        rarity: "Legendary",
      }),
    ).toEqual({
      query: "undead",
      faction: "Umbral Court",
      type: "Unit",
      rarity: "Legendary",
    });
  });

  it("ignores unknown and duplicate filter values", () => {
    expect(
      parseCatalogFilters({
        q: ["first", "second"],
        faction: "Unknown",
        type: ["Spell", "Unit"],
      }),
    ).toEqual({ query: "first", type: "Spell" });
  });

  it("searches card copy and tags while combining exact filters", () => {
    expect(
      buildCatalogWhere({
        query: "guard",
        faction: "Ironclad",
        type: "Unit",
      }),
    ).toEqual({
      faction: "Ironclad",
      type: "Unit",
      OR: [
        { name: { contains: "guard" } },
        { rulesText: { contains: "guard" } },
        { flavorText: { contains: "guard" } },
        { tags: { some: { tag: { contains: "guard" } } } },
      ],
    });
  });
});
