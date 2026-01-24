import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import Providers from "@/components/provider";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'),
  alternates: {
    canonical: './',
  },
  title: {
    default: "Uphaar by Niharika | Handcrafted Resin Art & Aesthetic Gifts",
    template: "%s | Uphaar by Niharika",
  },
  description: "Discover exclusive handcrafted resin art, luxury soy candles, concrete homeware, and curated gift hampers. Shop unique, aesthetic gifts for birthdays, weddings, and corporate events.",
  keywords: [
    "Resin Art",
    "Handmade Gifts",
    "Luxury Soy Candles",
    "Concrete Decor",
    "Gift Hampers India",
    "Personalized Gifts",
    "Corporate Gifting",
    "Aesthetic Home Decor",
    "Resin Clocks",
    "Wedding Favors"
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Uphaar by Niharika",
    title: "Uphaar by Niharika | Handcrafted Resin Art & Aesthetic Gifts",
    description: "Discover exclusive handcrafted resin art, luxury soy candles, concrete homeware, and curated gift hampers.",
    url: './',
    images: [
      {
        url: '/logo.jpeg',
        width: 800,
        height: 600,
        alt: 'Uphaar by Niharika',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uphaar by Niharika | Handcrafted Resin Art & Aesthetic Gifts",
    description: "Discover exclusive handcrafted resin art, luxury soy candles, concrete homeware, and curated gift hampers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${lato.variable} bg-background text-text antialiased overflow-x-hidden`}
      >
        <Providers>{children}</Providers>
        <Toaster />
        <HotToaster position="top-center" />
      </body>
    </html>
  );
}
