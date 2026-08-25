"use server";

import { AuthError } from "next-auth";
import { Prisma } from "@/generated/prisma/client";

import { signIn, signOut } from "@/auth";
import {
  type RegistrationErrors,
  validateRegistration,
} from "@/lib/auth/registration";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

export type AuthFormState = {
  message?: string;
  errors?: RegistrationErrors;
  values?: {
    name?: string;
    email?: string;
  };
};

export async function loginAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      message: "Enter both your email address and password.",
      values: { email },
    };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: "The email address or password is incorrect.",
        values: { email },
      };
    }

    throw error;
  }

  return {};
}

export async function registerAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  };
  const result = validateRegistration({
    ...values,
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (result.errors) {
    return { errors: result.errors, values };
  }

  try {
    await prisma.user.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        passwordHash: await hashPassword(result.data.password),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        errors: { email: "An account already exists for this email address." },
        values,
      };
    }

    throw error;
  }

  await signIn("credentials", {
    email: result.data.email,
    password: result.data.password,
    redirectTo: "/",
  });

  return {};
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
