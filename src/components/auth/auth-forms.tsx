"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  type AuthFormState,
  loginAction,
  registerAction,
} from "@/app/auth-actions";

const initialState: AuthFormState = {};

function ErrorMessage({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="text-sm text-red-400">
      {message}
    </p>
  );
}

function SubmitButton({ children, pending }: { children: string; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-10 rounded-md bg-zinc-100 px-4 py-2 font-medium text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Working…" : children}
    </button>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="flex flex-col gap-4">
      <ErrorMessage id="login-error" message={state.message} />
      <label className="flex flex-col gap-2">
        <span>Email address</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.values?.email}
          aria-describedby={state.message ? "login-error" : undefined}
          className="min-h-10 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span>Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-describedby={state.message ? "login-error" : undefined}
          className="min-h-10 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
        />
      </label>
      <SubmitButton pending={pending}>Sign in</SubmitButton>
      <p className="text-sm text-zinc-300">
        New to the rift? <Link href="/register" className="underline">Create an account</Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initialState);

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span>Display name <span className="text-zinc-400">(optional)</span></span>
        <input
          name="name"
          type="text"
          autoComplete="name"
          maxLength={80}
          defaultValue={state.values?.name}
          aria-invalid={Boolean(state.errors?.name)}
          aria-describedby={state.errors?.name ? "name-error" : undefined}
          className="min-h-10 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
        />
        <ErrorMessage id="name-error" message={state.errors?.name} />
      </label>
      <label className="flex flex-col gap-2">
        <span>Email address</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.values?.email}
          aria-invalid={Boolean(state.errors?.email)}
          aria-describedby={state.errors?.email ? "email-error" : undefined}
          className="min-h-10 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
        />
        <ErrorMessage id="email-error" message={state.errors?.email} />
      </label>
      <label className="flex flex-col gap-2">
        <span>Password</span>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          aria-invalid={Boolean(state.errors?.password)}
          aria-describedby="password-help password-error"
          className="min-h-10 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
        />
        <p id="password-help" className="text-sm text-zinc-400">Use 8–72 characters.</p>
        <ErrorMessage id="password-error" message={state.errors?.password} />
      </label>
      <label className="flex flex-col gap-2">
        <span>Confirm password</span>
        <input
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          aria-invalid={Boolean(state.errors?.confirmPassword)}
          aria-describedby={state.errors?.confirmPassword ? "confirm-password-error" : undefined}
          className="min-h-10 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
        />
        <ErrorMessage id="confirm-password-error" message={state.errors?.confirmPassword} />
      </label>
      <SubmitButton pending={pending}>Create account</SubmitButton>
      <p className="text-sm text-zinc-300">
        Already have an account? <Link href="/login" className="underline">Sign in</Link>
      </p>
    </form>
  );
}
