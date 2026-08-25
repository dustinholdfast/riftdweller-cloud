import { describe, expect, it } from "vitest";

import {
  AuthenticationError,
  AuthorizationError,
  requireAuthenticatedUserId,
  requireResourceOwner,
  type SessionIdentity,
} from "./authorization";

describe("authentication invariants", () => {
  it.each<SessionIdentity | undefined>([
    undefined,
    null,
    {},
    { user: null },
    { user: {} },
    { user: { id: null } },
    { user: { id: "" } },
    { user: { id: "   " } },
  ])("rejects a session without a stable user ID", (session) => {
    expect(() => requireAuthenticatedUserId(session)).toThrowError(
      AuthenticationError,
    );
  });

  it("returns the authenticated user's stable ID", () => {
    expect(requireAuthenticatedUserId({ user: { id: "user_1" } })).toBe(
      "user_1",
    );
  });

  it("exposes a transport-neutral 401 error contract", () => {
    try {
      requireAuthenticatedUserId(null);
      expect.unreachable("an unauthenticated session must be rejected");
    } catch (error) {
      expect(error).toMatchObject({
        code: "UNAUTHENTICATED",
        status: 401,
      });
    }
  });
});

describe("ownership invariants", () => {
  it("allows the resource owner and returns their ID", () => {
    expect(
      requireResourceOwner({ user: { id: "user_1" } }, "user_1"),
    ).toBe("user_1");
  });

  it("rejects authenticated users who do not own the resource", () => {
    expect(() =>
      requireResourceOwner({ user: { id: "user_2" } }, "user_1"),
    ).toThrowError(AuthorizationError);
  });

  it("compares opaque IDs exactly, including case and full length", () => {
    expect(() =>
      requireResourceOwner({ user: { id: "USER_1" } }, "user_1"),
    ).toThrowError(AuthorizationError);
    expect(() =>
      requireResourceOwner({ user: { id: "user_1" } }, "user_10"),
    ).toThrowError(AuthorizationError);
  });

  it("checks authentication before ownership", () => {
    expect(() => requireResourceOwner(null, "user_1")).toThrowError(
      AuthenticationError,
    );
  });

  it("exposes a transport-neutral 403 error contract", () => {
    try {
      requireResourceOwner({ user: { id: "user_2" } }, "user_1");
      expect.unreachable("a non-owner must be rejected");
    } catch (error) {
      expect(error).toMatchObject({ code: "FORBIDDEN", status: 403 });
    }
  });
});
