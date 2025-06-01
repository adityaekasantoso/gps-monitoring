import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "GPS Monitoring",
  description: "GPS Monitoring by Multiintegra Technology Group",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Header */}
        {/* <header className="w-full bg-white-900 text-black p-2">
          <h1 className="text-xl font-bold">My App Header</h1>
        </header> */}

        {/* Main content */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
