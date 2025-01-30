import Link from "next/link";
import ClerkUserButton from "@/components/clerk/clerk-user-button";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-neutral-50 text-lg text-neutral-900 shadow-md">
      <section className="mx-auto flex max-w-7xl justify-between p-4">
        <Link className="text-xl" href="/">
          <strong>Demo</strong>
        </Link>
        <ClerkUserButton />
      </section>
    </header>
  );
}
