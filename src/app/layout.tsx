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
  title: "Verbos English - Aprende Verbos en Inglés",
  description: "¡Aprende verbos en inglés con 70+ juegos divertidos! Memoria, concentración, crucigramas y más.",
  keywords: ["verbos inglés", "aprender inglés", "juegos educativos", "English verbs", "learning games"],
  authors: [{ name: "Verbos English Team" }],
  openGraph: {
    title: "Verbos English - Aprende Verbos en Inglés",
    description: "¡Aprende verbos en inglés con 70+ juegos divertidos!",
    url: "https://verbos-english.netlify.app",
    siteName: "Verbos English",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verbos English",
    description: "¡Aprende verbos en inglés con 70+ juegos divertidos!",
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
