import type { Metadata, Viewport } from "next";
import "./globals.css";

/* ── Viewport (exported separately in Next.js 14+) ── */
export const viewport: Viewport = {
  themeColor: "#F59E0B",        // Amber brand color shown in mobile browser chrome
  width: "device-width",
  initialScale: 1,
};

/* ── Metadata — controls SEO, social sharing, and browser tab appearance ── */
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

  /* Favicon & app icons — browsers pick the best format automatically */
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",       // iOS home screen icon
  },

  /* PWA manifest — enables "Add to Home Screen" on mobile */
  manifest: "/site.webmanifest",

  /* Open Graph — displayed when link is shared on LinkedIn, Facebook, etc. */
  openGraph: {
    title: "Bella Cucina RMS",
    description: "Professional Restaurant Management System — POS, KDS, Orders, Tables, Inventory & Analytics",
    type: "website",
    siteName: "Bella Cucina RMS",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Bella Cucina Restaurant Management System",
      },
    ],
  },

  /* Twitter card — displayed when link is shared on X/Twitter */
  twitter: {
    card: "summary_large_image",
    title: "Bella Cucina RMS",
    description: "Professional Restaurant Management System",
    images: ["/images/og-image.svg"],
  },

  /* Robots — same rules as robots.txt but as meta tags */
  robots: {
    index: true,
    follow: true,
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
