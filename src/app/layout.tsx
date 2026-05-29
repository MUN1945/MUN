import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DiplomatiQ - The Operating System for Model United Nations",
  description: "The premier platform for MUN programs. Train delegates, manage conferences, track achievements, and build the next generation of diplomats.",
  keywords: ["MUN", "Model United Nations", "diplomacy", "delegate training", "conferences", "education"],
  authors: [{ name: "DiplomatiQ" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "DiplomatiQ - The Operating System for Model United Nations",
    description: "Train delegates, manage conferences, and build diplomatic excellence",
    siteName: "DiplomatiQ",
    type: "website",
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
