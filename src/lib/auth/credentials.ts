import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

type CredentialsInput = Partial<Record<"email" | "password", unknown>>;

type CredentialUser = {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string;
};

type CredentialDependencies = {
  findUserByEmail(email: string): Promise<CredentialUser | null>;
  verifyPassword(password: string, passwordHash: string): Promise<boolean>;
};

const defaultDependencies: CredentialDependencies = {
  findUserByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },
  verifyPassword,
};

export function readCredentials(credentials: CredentialsInput) {
  const email =
    typeof credentials.email === "string"
      ? credentials.email.trim().toLowerCase()
      : "";
  const password =
    typeof credentials.password === "string" ? credentials.password : "";

  if (!email || !password) {
    return null;
  }

  return { email, password };
}

export async function authenticateCredentials(
  credentials: CredentialsInput,
  dependencies: CredentialDependencies = defaultDependencies,
) {
  const input = readCredentials(credentials);

  if (!input) {
    return null;
  }

  const user = await dependencies.findUserByEmail(input.email);

  if (
    !user ||
    !(await dependencies.verifyPassword(input.password, user.passwordHash))
  ) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
