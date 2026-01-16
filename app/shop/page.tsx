"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// MOCK DATA - Replace with Prisma fetch later
const allProducts = [
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
    category: "Candles",
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
  {
    id: 5,
    title: "Geometric Concrete Tray",
    category: "Concrete",
    price: 550,
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 6,
    title: "Rose & Sandalwood Candle",
    category: "Candles",
    price: 900,
    image: "https://images.unsplash.com/photo-1596436081179-8b277b089c25?auto=format&fit=crop&q=80&w=600",
  },
];

const categories = ["All", "Resin", "Candles", "Concrete", "Gifts"];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get category from URL or default to 'All'
  const initialCategory = searchParams.get("category") || "All";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState("newest");

  // Sync state with URL if user clicks Navbar links
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      // Simple capitalization for display matching
      const formatted = categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1);
      setActiveCategory(formatted);
    } else {
      setActiveCategory("All");
    }
  }, [searchParams]);

  // Filtering Logic
  const filteredProducts = allProducts
    .filter((product) => activeCategory === "All" || product.category === activeCategory)
    .sort((a, b) => {
      if (sortOrder === "price-low") return a.price - b.price;
      if (sortOrder === "price-high") return b.price - a.price;
      return 0; // Newest (Default ID sort)
    });

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    // Update URL for shareability
    if (cat === "All") {
      router.push("/shop");
    } else {
      router.push(`/shop?category=${cat.toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-10">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">
            {activeCategory === "All" ? "All Collections" : `${activeCategory} Collection`}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {filteredProducts.length} handcrafted items found
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="sticky top-16 z-30 mb-8 flex flex-col gap-4 border-y border-border bg-background/95 py-4 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
          
          {/* Categories (Desktop: Tabs, Mobile: Scrollable) */}
          <div className="flex w-full items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center justify-between gap-4 md:justify-end">
            <span className="text-sm text-muted-foreground md:hidden">Sort by:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 border-border">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>
                    {sortOrder === "newest" && "Newest"}
                    {sortOrder === "price-low" && "Price: Low to High"}
                    {sortOrder === "price-high" && "Price: High to Low"}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card">
                <DropdownMenuItem onClick={() => setSortOrder("newest")}>Newest Arrivals</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("price-low")}>Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("price-high")}>Price: High to Low</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Product Grid */}
        <motion.div 
          layout 
          className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard
                  title={product.title}
                  category={product.category}
                  price={product.price}
                  image={product.image}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="font-serif text-2xl text-muted-foreground">No products found.</h3>
            <p className="mt-2 text-sm text-muted-foreground">Try selecting a different category.</p>
            <Button 
                variant="link" 
                onClick={() => handleCategoryChange("All")}
                className="mt-4 text-primary"
            >
                View All Products
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}