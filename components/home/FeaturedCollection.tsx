"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { ProductGridSkeleton } from "@/components/skeletons/public-skeletons";

interface Product {
  id: number;
  title: string;
  slug: string;
  category: string;
  price: string | number;
  image: string;
}

export default function FeaturedCollection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Fetch all products and slice the first 4 for "Featured"
        // In a real app, you'd have a ?featured=true query param
        const { data } = await api.get("/products");
        if (Array.isArray(data)) {
          setProducts(data.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="bg-secondary/5 py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">Handpicked Favorites</span>
          <h2 className="mt-3 font-serif text-3xl font-bold md:text-4xl text-foreground">Weekly Best Sellers</h2>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                category={product.category}
                price={Number(product.price)}
                image={product.image}
                slug={product.slug}
              />
            ))}
          </div>
        )}

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