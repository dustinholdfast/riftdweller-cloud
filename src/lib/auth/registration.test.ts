import { describe, expect, it } from "vitest";

import { validateRegistration } from "./registration";

describe("validateRegistration", () => {
  it("normalizes valid registration data", () => {
    expect(
      validateRegistration({
        name: "  Mira Vale  ",
        email: "  MIRA@EXAMPLE.COM ",
        password: "riftward",
        confirmPassword: "riftward",
      }),
    ).toEqual({
      data: {
        name: "Mira Vale",
        email: "mira@example.com",
        password: "riftward",
      },
    });
  });

  it("accepts an omitted display name", () => {
    expect(
      validateRegistration({
        email: "mira@example.com",
        password: "riftward",
        confirmPassword: "riftward",
      }),
    ).toMatchObject({ data: { name: null } });
  });

  it("returns field errors for invalid input", () => {
    expect(
      validateRegistration({
        name: "a".repeat(81),
        email: "not-an-email",
        password: "short",
        confirmPassword: "different",
      }),
    ).toEqual({
      errors: {
        name: "Name must be 80 characters or fewer.",
        email: "Enter a valid email address.",
        password: "Password must be at least 8 characters.",
        confirmPassword: "Passwords do not match.",
      },
    });
  });
});
