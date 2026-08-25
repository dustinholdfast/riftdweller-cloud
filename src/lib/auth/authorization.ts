/**
 * The smallest session shape needed by authorization checks.
 * Auth.js sessions can be passed here once their user type includes `id`.
 */
export type SessionIdentity = {
  user?: {
    id?: string | null;
  } | null;
} | null;

export class AuthenticationError extends Error {
  readonly code = "UNAUTHENTICATED";
  readonly status = 401;

  constructor() {
    super("Authentication is required.");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  readonly code = "FORBIDDEN";
  readonly status = 403;

  constructor() {
    super("You do not have access to this resource.");
    this.name = "AuthorizationError";
  }
}

/** Returns the authenticated user's stable ID or rejects the request. */
export function requireAuthenticatedUserId(
  session: SessionIdentity | undefined,
): string {
  const userId = session?.user?.id;

  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw new AuthenticationError();
  }

  return userId;
}

/**
 * Authorizes access to a private resource and returns its owning user ID.
 * IDs are deliberately compared exactly: database identifiers are opaque and
 * must never be normalized or matched by a prefix.
 */
export function requireResourceOwner(
  session: SessionIdentity | undefined,
  ownerId: string,
): string {
  const actorId = requireAuthenticatedUserId(session);

  if (actorId !== ownerId) {
    throw new AuthorizationError();
  }

  return actorId;
}
