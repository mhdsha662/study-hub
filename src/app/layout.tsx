import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProviderWrapper } from "@/components/providers/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cambridge Study Hub - Free Cambridge Study Resources",
  description: "Access free Cambridge past papers, notes, mark schemes, and syllabi. Controlled access to Cambridge books with unique login credentials.",
  keywords: ["Cambridge", "Study Resources", "Past Papers", "IGCSE", "A-Level", "AS-Level", "Mark Schemes", "Syllabi"],
  authors: [{ name: "Cambridge Study Hub" }],
  openGraph: {
    title: "Cambridge Study Hub",
    description: "Free access to Cambridge study resources with controlled book access",
    url: "https://cambridgestudyhub.com",
    siteName: "Cambridge Study Hub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cambridge Study Hub",
    description: "Free access to Cambridge study resources with controlled book access",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProviderWrapper>
          {children}
          <Toaster />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
