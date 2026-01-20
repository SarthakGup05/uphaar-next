"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck, Star, Share2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useCartStore } from "@/lib/store/cart-store";
// import { toast } from "sonner"; // Optional: For nice notifications

// Define type based on DB schema + UI needs
interface Product {
    id: number;
    title: string;
    slug: string;
    category: string;
    price: number;
    description: string;
    images: string[];
    rating: number;
    reviews: number;
    stock: number;
}

interface ProductDetailsProps {
    product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        addItem({
            id: product.id.toString(),
            title: product.title,
            price: product.price,
            image: product.images[0],
            quantity: quantity,
            slug: product.slug,
        });
        alert(`Added ${quantity} ${product.title} to cart!`);
    };

    return (
        <div className="min-h-screen bg-background pb-32 pt-4 md:pt-10">
            <div className="container mx-auto px-4">

                {/* Breadcrumb / Back Button */}
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Shop
                    </Link>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">

                    {/* LEFT: Immersive Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-stone-100 shadow-sm">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0 h-full w-full"
                                >
                                    <Image
                                        src={product.images[activeImage]}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>

                            <div className="absolute left-4 top-4">
                                <Badge className="bg-stone-900/90 text-white backdrop-blur-md hover:bg-black">Handmade</Badge>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${activeImage === idx ? "border-primary opacity-100 ring-2 ring-primary ring-offset-2" : "border-transparent opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        <Image src={img} alt="Thumbnail" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Product Details */}
                    <div className="flex flex-col pt-2">
                        <div className="mb-2 flex items-center gap-2">
                            <Badge className="bg-stone-900 text-white hover:bg-black">{product.category}</Badge>
                            {product.stock < 5 && <span className="text-xs font-medium text-red-500">Only {product.stock} left!</span>}
                        </div>

                        <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl leading-tight">{product.title}</h1>

                        <div className="mt-4 flex items-center gap-4 border-b border-border pb-6">
                            <span className="text-3xl font-medium text-primary">₹{product.price.toLocaleString()}</span>
                            <div className="flex items-center gap-1 text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">
                                <Star className="h-3.5 w-3.5 fill-current" />
                                <span className="font-bold">{product.rating}</span>
                                <span className="text-muted-foreground ml-1">({product.reviews} reviews)</span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-8">
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                {product.description}
                            </p>

                            {/* Action Area (Desktop) */}
                            <div className="hidden md:flex flex-col gap-4 p-6 bg-stone-50 rounded-xl border border-border">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-foreground">Quantity</span>
                                    <div className="flex h-10 w-32 items-center justify-between rounded-full border border-border bg-white px-2">
                                        <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="h-8 w-8 rounded-full hover:bg-stone-100">
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="text-sm font-medium">{quantity}</span>
                                        <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="h-8 w-8 rounded-full hover:bg-stone-100">
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>

                                <Button size="lg" onClick={handleAddToCart} className="w-full h-12 rounded-lg gap-2 text-base shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]">
                                    <ShoppingBag className="h-5 w-5" /> Add to Cart - ₹{(product.price * quantity).toLocaleString()}
                                </Button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 rounded-xl border border-border p-4 bg-background/50">
                                    <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                        <Truck className="h-5 w-5" />
                                    </div>
                                    <div className="text-xs">
                                        <span className="block font-bold text-foreground text-sm">Fast Shipping</span>
                                        <span className="text-muted-foreground">Dispatched in 24h</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-xl border border-border p-4 bg-background/50">
                                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div className="text-xs">
                                        <span className="block font-bold text-foreground text-sm">Secure Checkout</span>
                                        <span className="text-muted-foreground">UPI & Cards Accepted</span>
                                    </div>
                                </div>
                            </div>

                            {/* Accordions */}
                            <Accordion type="single" collapsible className="w-full border-t border-border">
                                <AccordionItem value="item-1" className="border-b border-border">
                                    <AccordionTrigger className="text-foreground hover:no-underline">Care Instructions</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                        Do not soak in water. Wipe clean with a damp cloth. Keep away from direct sunlight to prevent yellowing over time. Not dishwasher safe.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2" className="border-b border-border">
                                    <AccordionTrigger className="text-foreground hover:no-underline">Shipping & Returns</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                        We ship all over India via BlueDart/Delhivery. Delivery takes 5-7 business days. Returns accepted only for damaged products (video proof required).
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE STICKY BOTTOM BAR */}
            <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-border bg-background p-4 shadow-2xl md:hidden">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Total Price</span>
                    <span className="text-lg font-bold text-primary">₹{(product.price * quantity).toLocaleString()}</span>
                </div>
                <div className="flex gap-3">
                    <div className="flex h-12 items-center rounded-lg border border-border bg-stone-50 px-2">
                        <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="h-8 w-8">
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{quantity}</span>
                        <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="h-8 w-8">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button onClick={handleAddToCart} className="h-12 px-6 rounded-lg shadow-lg shadow-primary/25">
                        Add to Cart
                    </Button>
                </div>
            </div>

        </div>
    );
}
