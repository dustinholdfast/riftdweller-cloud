import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { RegisterForm } from "@/components/auth/auth-forms";

export default async function RegisterPage() {
  if (await auth()) redirect("/");

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-12">
      <section className="rounded-lg border border-zinc-800 bg-zinc-950 p-6" aria-labelledby="register-title">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-400">Enter the rift</p>
        <h1 id="register-title" className="mb-2 text-3xl font-semibold tracking-tight">Create your account</h1>
        <p className="mb-6 text-sm text-zinc-300">Save private decks and carry your collection between visits.</p>
        <RegisterForm />
      </section>
    </main>
  );
}
