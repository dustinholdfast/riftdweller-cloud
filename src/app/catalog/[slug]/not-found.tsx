import Link from "next/link";

export default function CardNotFound() {
  return (
    <main className="mx-auto grid w-full max-w-3xl flex-1 place-items-center px-6 py-16">
      <section className="w-full rounded-lg border border-dashed border-zinc-700 px-6 py-16 text-center">
        <h1 className="text-3xl font-semibold">This card is lost beyond the rift</h1>
        <p className="mx-auto mt-3 max-w-md text-zinc-400">
          It may have moved or never belonged to this archive.
        </p>
        <Link
          href="/catalog"
          className="mt-6 inline-flex min-h-11 items-center rounded-md border border-zinc-600 px-5"
        >
          Return to the catalog
        </Link>
      </section>
    </main>
  );
}
