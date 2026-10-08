import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "GrowBroo - Dynamic QR Review Card Platform",
    template: "%s | GrowBroo",
  },
  description:
    "Smart, pre-printed dynamic QR and NFC review cards for local businesses. Easily assign, reassign, and accelerate real Google reviews with GrowBroo.",
  keywords: [
    "GrowBroo",
    "Google Review QR Card",
    "Dynamic QR Reviews",
    "NFC Review Card",
    "Google Business Profile Reviews",
    "Customer Review Management",
  ],
  authors: [{ name: "GrowBroo Inc." }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className={`${inter.className} min-h-full bg-[#F7FBF7] text-[#050505] selection:bg-[#006B21] selection:text-white`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
