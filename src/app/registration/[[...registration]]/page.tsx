import { SignUp } from "@clerk/nextjs";

export default function RegistrationPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <SignUp />
    </main>
  );
}
