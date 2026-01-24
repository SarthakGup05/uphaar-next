"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Minus,
    Plus,
    ShoppingBag,
    Star,
    Share2,
    Heart,
    ArrowLeft,
    Clock,
    ShieldCheck,
    Truck,
    RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useCartStore } from "@/lib/store/cart-store";
import { useActiveCoupons } from "@/lib/hooks/use-coupons";
import { cn } from "@/lib/utils";
import imageKitLoader from "@/lib/imagekit-loader";
import { toast } from "sonner";

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
    const [activeImage, setActiveImage] = useState(0);
    const { items, addItem, updateQuantity, removeItem } = useCartStore();
    const { data: coupons } = useActiveCoupons();

    // Check if item is in cart
    const cartItem = items.find(item => item.id === product.id.toString());
    const cartQty = cartItem ? cartItem.quantity : 0;

    const applicableCoupons = useMemo(() => {
        return coupons?.filter(c =>
            c.productIds.length === 0 || c.productIds.includes(product.id)
        ) || [];
    }, [coupons, product.id]);

    // Blinkit-style Add Logic
    const handleAdd = () => {
        addItem({
            id: product.id.toString(),
            title: product.title,
            price: product.price,
            image: product.images[0],
            quantity: 1,
            slug: product.slug,
        });
        toast.success("Added to cart");
    };

    const handleIncrement = () => {
        if (cartQty >= product.stock) {
            toast.error("Max stock reached");
            return;
        }
        updateQuantity(product.id.toString(), 1);
    };

    const handleDecrement = () => {
        if (cartQty === 1) {
            removeItem(product.id.toString());
        } else {
            updateQuantity(product.id.toString(), -1);
        }
    };



    const handleShare = async () => {
        try {
            const shareUrl = `${window.location.origin}/shop/${product.slug}`;
            if (navigator.share) {
                await navigator.share({
                    title: product.title,
                    text: `Check out ${product.title} on Uphaar! \n\n${shareUrl}`,
                    url: shareUrl,
                });
            } else {
                await navigator.clipboard.writeText(shareUrl);
                toast.success("Link copied to clipboard");
            }
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50/30 text-stone-950 pb-24 md:pb-20">
            {/* Breadcrumb Header */}
            <div className="sticky top-0 z-40 border-b border-stone-200 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center text-sm text-stone-500 overflow-hidden">
                        <Link href="/shop" className="hover:text-stone-900 transition-colors flex items-center gap-1 shrink-0">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Back</span>
                        </Link>
                        <span className="mx-2 text-stone-300">/</span>
                        <span className="text-stone-900 font-medium truncate">{product.title}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-stone-500 cursor-pointer hover:bg-stone-100 hover:text-stone-900"
                            onClick={handleShare}
                        >
                            <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-stone-500">
                            <Heart className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 md:py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr] gap-8 xl:gap-16">

                    {/* LEFT COLUMN - GALLERY */}
                    <div className="space-y-4">
                        <div className="relative aspect-square w-full ml-auto mr-auto max-w-xl overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm">
                            <Image
                                src={product.images[activeImage]}
                                alt={product.title}
                                fill
                                loader={imageKitLoader}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover object-center"
                                priority
                            />
                            {/* Overlay Tags */}
                            <div className="absolute left-0 top-0 p-4 flex flex-col gap-2">
                                <Badge className="bg-stone-900 text-white hover:bg-stone-800 shadow-md">
                                    {product.category}
                                </Badge>
                                {product.stock < 5 && product.stock > 0 && (
                                    <Badge variant="destructive" className="animate-pulse shadow-md">
                                        Only {product.stock} left
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide max-w-xl mx-auto">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={cn(
                                            "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                                            activeImage === idx
                                                ? "border-stone-900 opacity-100"
                                                : "border-transparent opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        <Image
                                            src={img}
                                            alt={`View ${idx + 1}`}
                                            fill
                                            loader={imageKitLoader}
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Trust Signals (Desktop) */}
                        <div className="hidden md:grid grid-cols-3 gap-4 mt-8">
                            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-white border border-stone-100">
                                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-semibold text-stone-600">100% Authentic</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-white border border-stone-100">
                                <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                    <RotateCcw className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-semibold text-stone-600">Easy Returns</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-white border border-stone-100">
                                <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                                    <Truck className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-semibold text-stone-600">Safe Delivery</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - DETAILS */}
                    <div className="space-y-6">

                        {/* Title Header */}
                        <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm space-y-4">
                            <div className="space-y-1">
                                <h1 className="text-2xl md:text-3xl font-bold font-serif text-stone-900 leading-tight">
                                    {product.title}
                                </h1>
                                <p className="text-sm text-stone-500 font-medium">1 Unit</p>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-3xl font-bold text-stone-900 block">
                                        ₹{product.price.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-stone-500">(Incl. of all taxes)</span>
                                </div>

                                {/* Add Button / Counter */}
                                <div className="w-32">
                                    {cartQty === 0 ? (
                                        <Button
                                            size="lg"
                                            onClick={handleAdd}
                                            disabled={product.stock === 0}
                                            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold shadow-sm transition-all active:scale-95"
                                        >
                                            {product.stock === 0 ? "Out of Stock" : "ADD"}
                                        </Button>
                                    ) : (
                                        <div className="flex items-center justify-between h-10 w-full rounded-md bg-green-700 text-white font-bold px-2 shadow-sm">
                                            <button
                                                onClick={handleDecrement}
                                                className="p-1 hover:bg-green-800 rounded transition"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span>{cartQty}</span>
                                            <button
                                                onClick={handleIncrement}
                                                className="p-1 hover:bg-green-800 rounded transition"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Offers / Coupons */}
                        {applicableCoupons.length > 0 && (
                            <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm space-y-3">
                                <h3 className="font-bold text-stone-900 flex items-center gap-2 text-sm uppercase tracking-wide">
                                    <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-blue-600 text-white">%</Badge>
                                    Offers for you
                                </h3>
                                <div className="space-y-3">
                                    {applicableCoupons.map((coupon) => (
                                        <div key={coupon.id} className="flex gap-3 items-start border border-dashed border-stone-200 bg-stone-50/50 p-3 rounded-lg">
                                            <div className="h-8 w-8 shrink-0 flex items-center justify-center bg-white rounded-full border border-stone-100 shadow-sm text-blue-600 font-bold text-xs">
                                                <Star className="h-4 w-4 fill-current" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-stone-900">
                                                    Code: {coupon.code}
                                                </p>
                                                <p className="text-xs text-stone-500 mt-0.5">
                                                    Get <span className="text-green-700 font-bold">{coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}</span>
                                                    {' '}on orders above ₹{coupon.minOrderValue || 0}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}



                        {/* Product Info Section */}
                        <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wide">Product Details</h3>

                            {/* Key Features / Schema Data */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-stone-50 rounded-lg">
                                    <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Category</span>
                                    <p className="text-sm font-medium text-stone-900 mt-1">{product.category}</p>
                                </div>
                                <div className="p-3 bg-stone-50 rounded-lg">
                                    <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Material</span>
                                    <p className="text-sm font-medium text-stone-900 mt-1">Premium Quality</p>
                                </div>
                            </div>

                            <div className="text-sm leading-relaxed text-stone-600 space-y-2">
                                <p>{product.description}</p>
                            </div>

                            <Accordion type="single" collapsible className="w-full border-t border-stone-100">
                                <AccordionItem value="shipping" className="border-b-0">
                                    <AccordionTrigger className="text-sm font-medium hover:no-underline py-3 text-stone-900">
                                        Shipping & Returns Policy
                                    </AccordionTrigger>
                                    <AccordionContent className="text-stone-500 text-sm pb-2">
                                        Flat shipping rate of ₹71 on all orders. Easy returns within 7 days of delivery.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                    </div>
                </div>
            </div>

            {/* Mobile Fixed Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 p-3 md:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                {cartQty === 0 ? (
                    <Button
                        size="lg"
                        onClick={handleAdd}
                        disabled={product.stock === 0}
                        className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl shadow-sm"
                    >
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        {product.stock === 0 ? "Out of Stock" : `ADD FOR ₹${product.price}`}
                    </Button>
                ) : (
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center justify-between h-12 w-32 rounded-xl bg-stone-100 px-2 font-bold text-stone-900">
                            <button onClick={handleDecrement} className="p-2 bg-white rounded-lg shadow-sm"><Minus className="h-4 w-4" /></button>
                            <span>{cartQty}</span>
                            <button onClick={handleIncrement} className="p-2 bg-white rounded-lg shadow-sm"><Plus className="h-4 w-4" /></button>
                        </div>
                        <Link href="/cart" className="flex-1">
                            <Button className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl">
                                View Cart <span className="ml-2 bg-green-900/40 px-2 py-0.5 rounded text-xs">₹{(product.price * cartQty).toLocaleString()}</span>
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
