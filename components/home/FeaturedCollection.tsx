"use client";

import ProductCard from "@/components/ProductCard"; // Your existing component
import { Button } from "@/components/ui/button";

// Mock Data
const featuredProducts = [
  {
    id: 1,
    title: "Ocean Blue Resin Tray",
    category: "Resin",
    price: 1200,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2,
    title: "Minimalist Concrete Planter",
    category: "Concrete",
    price: 450,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    title: "Lavender Soy Candle",
    category: "Candle",
    price: 850,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 4,
    title: "Gold Flake Coaster Set",
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
            />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button variant="outline" size="lg" className="px-8 border-primary text-primary hover:bg-primary hover:text-white">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}