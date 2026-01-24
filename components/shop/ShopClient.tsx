"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/axios";
import { ProductGridSkeleton } from "@/components/skeletons/public-skeletons";
import { cn } from "@/lib/utils";

// Types
interface Product {
    id: number;
    title: string;
    slug: string;
    category: string;
    price: string | number;
    image: string;
}

const CATEGORIES = ["All", "Resin", "Candles", "Concrete Decor", "Gift Hampers"];

// --- 1. Main Logic Component ---
function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filter & Sort State
    const initialCategory = searchParams.get("category");
    const matchedCategory = CATEGORIES.find(c => c.toLowerCase() === initialCategory?.toLowerCase()) || "All";

    const [activeCategory, setActiveCategory] = useState(matchedCategory);
    const [sortOrder, setSortOrder] = useState("newest");

    // Sync URL -> State
    useEffect(() => {
        const categoryFromUrl = searchParams.get("category");
        const match = CATEGORIES.find(c => c.toLowerCase() === categoryFromUrl?.toLowerCase());
        setActiveCategory(match || "All");
    }, [searchParams]);

    // Data Fetching
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await api.get("/products");
                setProducts(response.data);
            } catch (err: any) {
                console.error("Failed to fetch products:", err);
                setError("Unable to load the collection.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Filtering Logic
    const filteredProducts = products
        .filter((product) => activeCategory === "All" || product.category === activeCategory)
        .sort((a, b) => {
            const priceA = Number(a.price);
            const priceB = Number(b.price);
            if (sortOrder === "price-low") return priceA - priceB;
            if (sortOrder === "price-high") return priceB - priceA;
            return 0; // Default / Newest
        });

    const handleCategoryChange = (cat: string) => {
        setActiveCategory(cat);
        if (cat === "All") router.push("/shop");
        else router.push(`/shop?category=${encodeURIComponent(cat.toLowerCase())}`);
    };

    if (loading) return <ShopLoadingSkeleton />;
    if (error) return <ErrorState message={error} retry={() => window.location.reload()} />;

    return (
        <div className="min-h-screen bg-stone-50/50">

            {/* Editorial Header */}
            <div className="pt-24 pb-12 text-center container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <span className="text-xs font-bold tracking-[0.2em] text-stone-400 uppercase">
                        Curated Collections
                    </span>
                    <h1 className="font-serif text-4xl md:text-6xl text-stone-900 tracking-tight">
                        {activeCategory === "All" ? "The Atelier" : activeCategory}
                    </h1>
                    <p className="text-stone-500 font-light max-w-md mx-auto">
                        Explore {filteredProducts.length} unique handcrafted pieces designed to elevate your space.
                    </p>
                </motion.div>
            </div>

            {/* Sticky Filter Bar */}
            <div className=" z-30 w-full border-b border-stone-200/60 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

                    {/* Scrollable Categories with "Sliding Pill" Animation */}
                    <div className="flex-1 overflow-x-auto no-scrollbar mask-gradient-right">
                        <div className="flex items-center gap-1 w-max">
                            {CATEGORIES.map((cat) => {
                                const isActive = activeCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryChange(cat)}
                                        className={cn(
                                            "relative px-4 py-1.5 text-sm font-medium transition-colors duration-200 rounded-full",
                                            isActive ? "text-white" : "text-stone-600 hover:text-stone-900"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeCategory"
                                                className="absolute inset-0 bg-stone-900 rounded-full"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">{cat}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sort Dropdown - Minimalist */}
                    <div className="flex-shrink-0 pl-4 border-l border-stone-200">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="gap-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100/50">
                                    <span className="text-xs font-bold uppercase tracking-wider hidden md:inline-block">Sort</span>
                                    <SlidersHorizontal className="h-4 w-4 md:hidden" />
                                    <ChevronDown className="h-3 w-3 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-xl border-stone-100 shadow-xl p-1">
                                <SortOption label="Newest Arrivals" active={sortOrder === "newest"} onClick={() => setSortOrder("newest")} />
                                <DropdownMenuSeparator className="bg-stone-100" />
                                <SortOption label="Price: Low to High" active={sortOrder === "price-low"} onClick={() => setSortOrder("price-low")} />
                                <SortOption label="Price: High to Low" active={sortOrder === "price-high"} onClick={() => setSortOrder("price-high")} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="container mx-auto px-4 py-12">
                <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                            <motion.div
                                layout
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                {/* Note: Ensure ProductCard has 'w-full h-full' */}
                                <ProductCard {...product} price={Number(product.price)} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Modern Empty State */}
                {filteredProducts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-32 text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                            <SlidersHorizontal className="w-6 h-6 text-stone-400" />
                        </div>
                        <h3 className="font-serif text-2xl text-stone-900 mb-2">Collection Empty</h3>
                        <p className="text-stone-500 max-w-xs mx-auto mb-6">
                            We couldn't find any items in this category right now.
                        </p>
                        <Button
                            onClick={() => handleCategoryChange("All")}
                            variant="outline"
                            className="border-stone-200 hover:bg-stone-50 text-stone-900"
                        >
                            Clear Filters
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// --- 2. Helper Components ---

const SortOption = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <DropdownMenuItem
        onClick={onClick}
        className={cn(
            "flex items-center justify-between px-3 py-2 cursor-pointer text-sm focus:bg-stone-50 rounded-sm",
            active ? "text-stone-900 font-medium bg-stone-50" : "text-stone-500"
        )}
    >
        {label}
        {active && <Check className="w-3 h-3 ml-2" />}
    </DropdownMenuItem>
);

const ErrorState = ({ message, retry }: { message: string, retry: () => void }) => (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-stone-500 mb-4">{message}</p>
        <Button onClick={retry} variant="outline">Try Again</Button>
    </div>
);

// --- 3. Loading Skeleton ---
export function ShopLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-stone-50/50 pt-24 px-4 container mx-auto">
            <div className="flex flex-col items-center gap-4 mb-16">
                <div className="h-4 w-32 bg-stone-200 rounded-full animate-pulse" />
                <div className="h-12 w-64 md:w-96 bg-stone-200 rounded-lg animate-pulse" />
                <div className="h-4 w-48 bg-stone-100 rounded animate-pulse" />
            </div>
            <div className="sticky top-[72px] h-16 mb-12 flex items-center gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-8 w-24 bg-stone-200 rounded-full animate-pulse" />
                ))}
            </div>
            <ProductGridSkeleton count={8} />
        </div>
    );
}

// --- 4. Main Export ---
export default function ShopClient() {
    return (
        <Suspense fallback={<ShopLoadingSkeleton />}>
            <ShopContent />
        </Suspense>
    );
}
