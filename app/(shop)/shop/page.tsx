import { Metadata } from 'next';
import ShopClient from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: 'Shop Collection | Uphaar by Niharika',
  description: 'Explore our curated collection of handcrafted resin art, scented candles, and unique decor.',
  alternates: {
    canonical: 'https://www.uphaarbyniharika.in/shop',
  },
}

export default function ShopPage() {
  return <ShopClient />;
}