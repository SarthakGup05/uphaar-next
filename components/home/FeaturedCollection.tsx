"use client";

import Link from "next/link"; // Import Link
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

// Updated Mock Data with slugs
const featuredProducts = [
  {
    id: 1,
    title: "Ocean Blue Resin Tray",
    slug: "ocean-blue-resin-tray", // Added slug
    category: "Resin",
    price: 1200,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2,
    title: "Minimalist Concrete Planter",
    slug: "minimalist-concrete-planter", // Added slug
    category: "Concrete",
    price: 450,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    title: "Lavender Soy Candle",
    slug: "lavender-soy-candle", // Added slug
    category: "Candle",
    price: 850,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 4,
    title: "Gold Flake Coaster Set",
    slug: "gold-flake-coaster-set", // Added slug
    category: "Resin",
    price: 600,
    image: "https://images.unsplash.com/photo-1615485925763-867862f80d52?auto=format&fit=crop&q=80&w=600",
  },
];

export default function FeaturedCollection() {
  return (
    <section className="bg-secondary/5 py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">Handpicked Favorites</span>
          <h2 className="mt-3 font-serif text-3xl font-bold md:text-4xl text-foreground">Weekly Best Sellers</h2>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              category={product.category}
              price={product.price}
              image={product.image}
              slug={product.slug} // Pass slug prop here
            />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link href="/shop">
            <Button variant="outline" size="lg" className="px-8 border-primary text-primary hover:bg-primary hover:text-white">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}