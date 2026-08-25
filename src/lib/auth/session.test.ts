import { describe, expect, it } from "vitest";

import {
  AuthorizationError,
  exposeUserIdInSession,
  persistUserIdInToken,
  requireAuthenticatedUserId,
  requireResourceOwner,
} from "@/lib/auth/session";

describe("session identity", () => {
  it("persists the stable user ID into a JWT at sign in", () => {
    expect(persistUserIdInToken({ sub: "subject" }, { id: "user_1" })).toEqual({
      sub: "subject",
      userId: "user_1",
    });
  });

  it("keeps the existing JWT identity when no user is supplied", () => {
    const token = { userId: "user_1" };

    expect(persistUserIdInToken(token, undefined)).toBe(token);
    expect(token.userId).toBe("user_1");
  });

  it("exposes the JWT user ID on the session", () => {
    const session = { user: { email: "keeper@example.com" } };

    expect(exposeUserIdInSession(session, { userId: "user_1" })).toEqual({
      user: { email: "keeper@example.com", id: "user_1" },
    });
  });
});

describe("authorization and ownership", () => {
  it.each([null, {}, { user: null }, { user: {} }, { user: { id: "  " } }])(
    "returns the 401 contract for an invalid session: %o",
    (session) => {
      expect(() => requireAuthenticatedUserId(session)).toThrowError(
        expect.objectContaining<Partial<AuthorizationError>>({
          status: 401,
          code: "UNAUTHENTICATED",
        }),
      );
    },
  );

  it("returns the stable ID for an authenticated session", () => {
    expect(requireAuthenticatedUserId({ user: { id: "user_1" } })).toBe(
      "user_1",
    );
  });

  it("allows only an exact owner ID match", () => {
    expect(requireResourceOwner({ user: { id: "user_1" } }, "user_1")).toBe(
      "user_1",
    );
  });

  it("returns the 403 contract for a different authenticated user", () => {
    expect(() =>
      requireResourceOwner({ user: { id: "user_2" } }, "user_1"),
    ).toThrowError(
      expect.objectContaining<Partial<AuthorizationError>>({
        status: 403,
        code: "FORBIDDEN",
      }),
    );
  });
});
