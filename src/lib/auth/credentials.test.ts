import { describe, expect, it, vi } from "vitest";

import {
  authenticateCredentials,
  readCredentials,
} from "@/lib/auth/credentials";

const user = {
  id: "user_1",
  email: "keeper@example.com",
  name: "The Keeper",
  passwordHash: "stored-hash",
};

function dependencies(passwordMatches = true) {
  return {
    findUserByEmail: vi.fn().mockResolvedValue(user),
    verifyPassword: vi.fn().mockResolvedValue(passwordMatches),
  };
}

describe("credentials authentication", () => {
  it("normalizes email while preserving the password", () => {
    expect(
      readCredentials({ email: "  Keeper@Example.COM ", password: " secret " }),
    ).toEqual({ email: "keeper@example.com", password: " secret " });
  });

  it.each([
    {},
    { email: "keeper@example.com" },
    { password: "secret" },
    { email: 42, password: "secret" },
  ])("rejects incomplete or invalid credentials: %o", async (input) => {
    const deps = dependencies();

    await expect(authenticateCredentials(input, deps)).resolves.toBeNull();
    expect(deps.findUserByEmail).not.toHaveBeenCalled();
  });

  it("returns the safe user shape for a matching password", async () => {
    const deps = dependencies();

    await expect(
      authenticateCredentials(
        { email: "Keeper@Example.com", password: "correct" },
        deps,
      ),
    ).resolves.toEqual({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    expect(deps.findUserByEmail).toHaveBeenCalledWith(user.email);
    expect(deps.verifyPassword).toHaveBeenCalledWith(
      "correct",
      user.passwordHash,
    );
  });

  it("rejects an unknown user without checking a password", async () => {
    const deps = dependencies();
    deps.findUserByEmail.mockResolvedValue(null);

    await expect(
      authenticateCredentials(
        { email: user.email, password: "anything" },
        deps,
      ),
    ).resolves.toBeNull();
    expect(deps.verifyPassword).not.toHaveBeenCalled();
  });

  it("rejects an incorrect password", async () => {
    const deps = dependencies(false);

    await expect(
      authenticateCredentials(
        { email: user.email, password: "incorrect" },
        deps,
      ),
    ).resolves.toBeNull();
  });
});
