type SessionLike = {
  user?: {
    id?: unknown;
  } | null;
} | null;

export class AuthorizationError extends Error {
  constructor(
    message: string,
    readonly status: 401 | 403,
    readonly code: "UNAUTHENTICATED" | "FORBIDDEN",
  ) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function requireAuthenticatedUserId(session: SessionLike) {
  const userId = session?.user?.id;

  if (typeof userId !== "string" || !userId.trim()) {
    throw new AuthorizationError(
      "Authentication is required.",
      401,
      "UNAUTHENTICATED",
    );
  }

  return userId;
}

export function requireResourceOwner(session: SessionLike, ownerId: string) {
  const userId = requireAuthenticatedUserId(session);

  if (userId !== ownerId) {
    throw new AuthorizationError(
      "You do not have access to this resource.",
      403,
      "FORBIDDEN",
    );
  }

  return userId;
}

export function persistUserIdInToken<
  TToken extends Record<string, unknown>,
  TUser extends { id?: string } | undefined,
>(token: TToken, user: TUser) {
  if (user?.id) {
    (token as Record<string, unknown>).userId = user.id;
  }

  return token;
}

export function exposeUserIdInSession<
  TSession extends { user?: object },
  TToken extends object,
>(session: TSession, token: TToken) {
  const userId = (token as { userId?: unknown }).userId;

  if (session.user && typeof userId === "string") {
    (session.user as { id?: string }).id = userId;
  }

  return session;
}
