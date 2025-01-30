import { GitHubIcon } from "@/components/app/icons";

export default function Footer() {
  return (
    <header>
      <section className="mx-auto mb-20 mt-40 flex max-w-7xl justify-center p-4">
        <a href="https://github.com/DanailMinchev/payload-clerk-example">
          <GitHubIcon />
        </a>
      </section>
    </header>
  );
}
