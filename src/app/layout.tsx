import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bella Cucina RMS — Restaurant Management System",
  description:
    "Production-grade Restaurant Management System with POS, Kitchen Display, Orders, Tables, Inventory, Analytics, Staff & Reservations.",
  keywords: [
    "restaurant management",
    "POS",
    "kitchen display system",
    "inventory tracking",
    "table management",
    "analytics",
  ],
  authors: [{ name: "Subin Samu", url: "https://subinsamu.com" }],
  openGraph: {
    title: "Bella Cucina RMS",
    description: "Professional Restaurant Management System",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
