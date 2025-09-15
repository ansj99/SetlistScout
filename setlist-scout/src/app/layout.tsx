import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Setlist Scout - Discover Concert Setlists",
  description: "Search and explore concert setlists from your favorite artists. Find what songs they played at specific shows and venues.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#121212] min-h-screen text-[#B3B3B3]`}
      >
        <header className="bg-[#191414] shadow-lg border-b border-[#282828]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-white hover:text-[#1DB954] transition-colors">
                  Setlist Scout
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
