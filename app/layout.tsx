import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import Providers from "@/components/provider";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Uphaar by Niharika | Handcrafted Aesthetic Goods",
  description: "Handcrafted aesthetic goods.",
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
