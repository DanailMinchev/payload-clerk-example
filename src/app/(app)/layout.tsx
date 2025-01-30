import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/auth-provider";
import Header from "@/components/app/header";
import Footer from "@/components/app/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-neutral-50 text-lg text-neutral-900 antialiased`}
        >
          <div className="min-h-screen">
            <Header />
            <main className="mx-auto mt-10 max-w-7xl pl-4 pr-4">
              {children}
            </main>
            <Footer />
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
