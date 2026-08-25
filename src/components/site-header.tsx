import Link from "next/link";

import { logoutAction } from "@/app/auth-actions";
import { auth } from "@/auth";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="border-b border-zinc-800">
      <nav className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-6" aria-label="Primary navigation">
        <Link href="/" className="font-semibold">RiftDweller Cloud</Link>
        <div className="flex items-center gap-4">
          <Link href="/catalog">Catalog</Link>
          {session?.user ? (
            <>
              <span className="hidden text-sm text-zinc-400 sm:inline">
                {session.user.name || session.user.email}
              </span>
              <form action={logoutAction}>
                <button type="submit" className="min-h-10 underline">Sign out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="min-h-10 content-center">Sign in</Link>
              <Link href="/register" className="min-h-10 content-center rounded-md border border-zinc-700 px-3">Create account</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
