import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/auth-forms";

export default async function LoginPage() {
  if (await auth()) redirect("/");

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-12">
      <section className="rounded-lg border border-zinc-800 bg-zinc-950 p-6" aria-labelledby="login-title">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-400">Return to the rift</p>
        <h1 id="login-title" className="mb-6 text-3xl font-semibold tracking-tight">Sign in</h1>
        <LoginForm />
      </section>
    </main>
  );
}
