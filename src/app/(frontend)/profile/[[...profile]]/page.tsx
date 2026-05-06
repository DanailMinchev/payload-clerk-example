import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <main className="flex justify-center py-12">
      <UserProfile path="/profile" />
    </main>
  );
}
