import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authenticateCredentials } from "@/lib/auth/credentials";
import {
  exposeUserIdInSession,
  persistUserIdInToken,
} from "@/lib/auth/session";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        return authenticateCredentials(credentials);
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      return persistUserIdInToken(token, user);
    },
    session({ session, token }) {
      return exposeUserIdInSession(session, token);
    },
  },
});
