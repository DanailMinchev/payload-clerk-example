import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/providers/auth-provider";
import Header from "@/components/app/header";
import Footer from "@/components/app/footer";

export const metadata: Metadata = {
  title: "Payload and Clerk example",
  description: "Advanced integration of Payload CMS and Clerk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-neutral-50 text-lg text-neutral-900 antialiased">
        <AuthProvider>
          <div className="min-h-screen">
            <Header />
            <main className="mx-auto mt-10 max-w-7xl pr-4 pl-4">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
