"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Minus,
    Plus,
    ShoppingBag,
    Star,
    StarHalf,
    Share2,
    ArrowLeft,
    ShieldCheck,
    Truck,
    RotateCcw,
    X,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    Copy,
    Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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

// --- Types ---
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

// --- Helper: Confetti Animation ---
const triggerConfetti = () => {
    const end = Date.now() + 1000;
    const colors = ['#a786df', '#fd86a9', '#fdb68c', '#ebf875'];

    (function frame() {
        confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
};

export default function ProductDetails({ product }: ProductDetailsProps) {
    const [activeImage, setActiveImage] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
    const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; value: number; type: "PERCENTAGE" | "FIXED" } | null>(null);
    const { items, addItem, updateQuantity, removeItem } = useCartStore();
    const { data: coupons } = useActiveCoupons();

    // Calculate Final Price
    const finalPrice = appliedDiscount
        ? appliedDiscount.type === "PERCENTAGE"
            ? product.price - (product.price * appliedDiscount.value / 100)
            : Math.max(0, product.price - appliedDiscount.value)
        : product.price;

    // --- Handlers ---

    const handleApplyLocal = (code: string, value: number, type: "PERCENTAGE" | "FIXED") => {
        if (appliedDiscount?.code === code) {
            setAppliedDiscount(null); // Toggle off
            return;
        }
        setAppliedDiscount({ code, value, type });
        toast.success(`Coupon ${code} applied!`);
        triggerConfetti();
    };

    const handleCopyCoupon = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCoupon(code);
        toast.success("Coupon code copied!");
        triggerConfetti();
        setTimeout(() => setCopiedCoupon(null), 2000);
    };

    // Cart Logic
    const cartItem = items.find(item => item.id === product.id.toString());
    const cartQty = cartItem ? cartItem.quantity : 0;

    const applicableCoupons = useMemo(() => {
        return coupons?.filter(c =>
            c.productIds.length === 0 || c.productIds.includes(product.id)
        ) || [];
    }, [coupons, product.id]);

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
            if (navigator.share) {
                await navigator.share({
                    title: product.title,
                    text: `Check out this ${product.title} on Uphaar!`,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard");
            }
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    // Helper to render stars
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => {
                    if (i < fullStars) {
                        return <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />;
                    }
                    if (i === fullStars && hasHalfStar) {
                        return <StarHalf key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />;
                    }
                    return <Star key={i} className="w-4 h-4 text-stone-200 fill-stone-100" />;
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-stone-50/30 text-stone-950 pb-24 md:pb-20">
            {/* Breadcrumb Header */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center text-sm text-stone-500 overflow-hidden">
                    <Link href="/shop" className="hover:text-stone-900 transition-colors flex items-center gap-1 shrink-0">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Back</span>
                    </Link>
                    <span className="mx-2 text-stone-300">/</span>
                    <span className="text-stone-900 font-medium truncate">{product.title}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 md:py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr] gap-8 xl:gap-16">

                    {/* LEFT COLUMN - GALLERY */}
                    <div className="space-y-4">
                        <div className="relative aspect-square w-full ml-auto mr-auto max-w-xl overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm group">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeImage}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative w-full h-full cursor-zoom-in"
                                    onClick={() => setIsLightboxOpen(true)}
                                >
                                    <Image
                                        src={product.images[activeImage]}
                                        alt={product.title}
                                        fill
                                        loader={imageKitLoader}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover object-center"
                                        priority
                                    />
                                    {/* Hover hint */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/90 backdrop-blur text-stone-900 rounded-full p-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                            <ZoomIn className="h-6 w-6" />
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Overlay Tags */}
                            <div className="absolute left-0 top-0 p-4 flex flex-col gap-2 pointer-events-none">
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
                                        aria-label={`View image ${idx + 1}`}
                                        className={cn(
                                            "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                                            activeImage === idx
                                                ? "border-stone-900 opacity-100"
                                                : "border-transparent opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
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
                                <span className="text-xs font-semibold text-stone-600">Shipping ₹71</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - DETAILS */}
                    <div className="space-y-6">

                        {/* Title Header */}
                        <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <h1 className="text-2xl md:text-3xl font-bold font-serif text-stone-900 leading-tight">
                                        {product.title}
                                    </h1>
                                    
                                    {/* --- UPDATED RATING SECTION (Stars Only) --- */}
                                    <div className="flex items-center gap-2 pb-1">
                                        {renderStars(product.rating)}
                                    </div>
                                    {/* ------------------------------------------- */}

                                    <p className="text-sm text-stone-500 font-medium pt-1">1 Unit</p>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Share product"
                                        className="h-10 w-10 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-3">
                                        <AnimatePresence mode="popLayout">
                                            {appliedDiscount ? (
                                                <motion.div
                                                    key="discounted"
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="flex items-baseline gap-3"
                                                >
                                                    <span className="text-3xl font-bold text-green-700 block">
                                                        ₹{finalPrice.toLocaleString()}
                                                    </span>
                                                    <span className="text-lg text-stone-400 line-through decoration-stone-400/50">
                                                        ₹{product.price.toLocaleString()}
                                                    </span>
                                                </motion.div>
                                            ) : (
                                                <motion.span
                                                    key="regular"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="text-3xl font-bold text-stone-900 block"
                                                >
                                                    ₹{product.price.toLocaleString()}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <span className="text-xs text-stone-500 block">(Incl. of all taxes)</span>
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
                                                aria-label="Decrease quantity"
                                                className="p-1 hover:bg-green-800 rounded transition"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span>{cartQty}</span>
                                            <button
                                                onClick={handleIncrement}
                                                aria-label="Increase quantity"
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
                                        <div key={coupon.id} className="flex gap-3 items-center justify-between border border-dashed border-stone-200 bg-stone-50/50 p-3 rounded-lg group hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                                            <div className="flex gap-3 items-start">
                                                <div className="h-8 w-8 shrink-0 flex items-center justify-center bg-white rounded-full border border-stone-100 shadow-sm text-blue-600 font-bold text-xs">
                                                    <Star className="h-4 w-4 fill-current" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-stone-900">
                                                        Code: <span className="font-mono">{coupon.code}</span>
                                                    </p>
                                                    <p className="text-xs text-stone-500 mt-0.5">
                                                        Get <span className="text-green-700 font-bold">{coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}</span>
                                                        {' '}on orders above ₹{coupon.minOrderValue || 0}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApplyLocal(coupon.code, parseFloat(coupon.discountValue), coupon.discountType)}
                                                    className={cn(
                                                        "text-xs font-semibold px-3 py-1.5 rounded-md transition-all border",
                                                        appliedDiscount?.code === coupon.code
                                                            ? "bg-stone-900 text-white border-stone-900 hover:bg-stone-800"
                                                            : "bg-white text-stone-900 border-stone-200 hover:border-stone-900"
                                                    )}
                                                >
                                                    {appliedDiscount?.code === coupon.code ? "Remove" : "Apply"}
                                                </button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleCopyCoupon(coupon.code)}
                                                    aria-label="Copy coupon code"
                                                    className="h-8 w-8 flex items-center justify-center bg-white border border-stone-200 rounded-md text-stone-500 hover:text-blue-600 hover:border-blue-200 transition-colors"
                                                    title="Copy Code"
                                                >
                                                    {copiedCoupon === coupon.code ? (
                                                        <Check className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Product Info Section */}
                        <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wide">Product Details</h3>

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
                        {product.stock === 0 ? "Out of Stock" : `ADD FOR ₹${finalPrice.toLocaleString()}`}
                    </Button>
                ) : (
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center justify-between h-12 w-32 rounded-xl bg-stone-100 px-2 font-bold text-stone-900">
                            <button onClick={handleDecrement} aria-label="Decrease quantity" className="p-2 bg-white rounded-lg shadow-sm"><Minus className="h-4 w-4" /></button>
                            <span>{cartQty}</span>
                            <button onClick={handleIncrement} aria-label="Increase quantity" className="p-2 bg-white rounded-lg shadow-sm"><Plus className="h-4 w-4" /></button>
                        </div>
                        <Link href="/cart" className="flex-1">
                            <Button className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl">
                                View Cart <span className="ml-2 bg-green-900/40 px-2 py-0.5 rounded text-xs">₹{(finalPrice * cartQty).toLocaleString()}</span>
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Lightbox Dialog */}
            <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full md:w-auto md:h-auto md:aspect-square p-0 bg-transparent border-none shadow-none flex items-center justify-center overflow-hidden focus:outline-none">
                    <div className="relative w-full h-full md:w-[80vh] md:h-[80vh] bg-transparent">
                        <DialogTitle className="sr-only">{product.title} Image View</DialogTitle>
                        
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            aria-label="Close lightbox"
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {/* Navigation Buttons */}
                        {product.images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
                                    }}
                                    aria-label="Previous image"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // SYNTAX FIXED: Used '?' instead of ':' for ternary operator
                                        setActiveImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
                                    }}
                                    aria-label="Next image"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}

                        <motion.div
                            key={activeImage}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src={product.images[activeImage]}
                                alt={product.title}
                                fill
                                loader={imageKitLoader}
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}