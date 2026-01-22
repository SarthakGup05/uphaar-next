"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Star, Share2, Heart, ArrowLeft, Check, Truck, ShieldCheck, RefreshCw } from "lucide-react";
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

// Minimalist Standard Layout
// Left: Thumbnail Gallery (Desktop) / Carousel (Mobile)
// Right: Sticky Details Content

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
    const { data: coupons } = useActiveCoupons();

    const applicableCoupons = coupons?.filter(c =>
        c.productIds.length === 0 || c.productIds.includes(product.id)
    ) || [];

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
        <div className="min-h-screen bg-white text-stone-950 pb-20">
            {/* Breadcrumb Header */}
            <div className="border-b border-stone-100 bg-white">
                <div className="container mx-auto px-4 h-14 flex items-center text-sm text-stone-500">
                    <Link href="/shop" className="hover:text-stone-900 transition-colors flex items-center gap-1">
                        <ArrowLeft className="h-4 w-4" /> Shop
                    </Link>
                    <span className="mx-2 text-stone-300">/</span>
                    <span className="text-stone-900 font-medium truncate">{product.title}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

                    {/* LEFT COLUMN - GALLERY */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <div className="relative aspect-square w-full overflow-hidden bg-stone-50 rounded-lg border border-stone-100">
                            <Image
                                src={product.images[activeImage]}
                                alt={product.title}
                                fill
                                loader={imageKitLoader}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover object-center"
                                priority
                            />
                            {/* Tags */}
                            <div className="absolute left-4 top-4 flex flex-col gap-2">
                                {product.stock < 5 && (
                                    <Badge variant="destructive" className="rounded-sm px-2.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm">
                                        Low Stock
                                    </Badge>
                                )}
                                <Badge variant="secondary" className="w-fit rounded-sm bg-white/90 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-stone-900 shadow-sm backdrop-blur-sm">
                                    {product.category}
                                </Badge>
                            </div>
                        </div>

                        {/* Thumbnails (Grid) */}
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-5 gap-3">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={cn(
                                            "relative aspect-square overflow-hidden rounded-md border bg-stone-50 transition-all",
                                            activeImage === idx
                                                ? "border-stone-900 ring-1 ring-stone-900"
                                                : "border-transparent opacity-70 hover:opacity-100 hover:border-stone-300"
                                        )}
                                    >
                                        <Image
                                            src={img}
                                            alt={`View ${idx + 1}`}
                                            fill
                                            loader={imageKitLoader}
                                            sizes="(max-width: 768px) 20vw, 10vw"
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN - DETAILS (Sticky) */}
                    <div className="lg:sticky lg:top-24 h-fit space-y-8">

                        {/* Title & Price Header */}
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl font-sans">
                                {product.title}
                            </h1>
                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-3xl font-bold text-stone-900">
                                        ₹{product.price.toLocaleString()}
                                    </span>
                                    {/* Placeholder for MRP if we had it */}
                                    {/* <span className="text-lg text-stone-400 line-through">₹{(product.price * 1.2).toLocaleString()}</span> */}
                                </div>

                                {/* Rating Badge */}
                                {product.reviews > 0 && (
                                    <div className="flex items-center gap-1 rounded bg-stone-100 px-2 py-1 text-sm font-medium text-stone-900">
                                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        <span>{product.rating}</span>
                                        <span className="text-stone-400 mx-1">|</span>
                                        <span className="text-stone-500 underline decoration-stone-300 underline-offset-4">
                                            {product.reviews} Reviews
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Available Offers */}
                        {applicableCoupons.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="font-semibold text-stone-900 flex items-center gap-2 text-sm">
                                    <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-green-600 text-white">%</Badge>
                                    Available Offers
                                </h4>
                                <ul className="space-y-2.5">
                                    {applicableCoupons.map((coupon) => (
                                        <li key={coupon.id} className="flex items-start gap-3 text-sm text-stone-600 group">
                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-stone-300 group-hover:bg-green-500 transition-colors" />
                                            <span>
                                                Get
                                                <span className="font-bold text-green-700 mx-1">
                                                    {coupon.discountType === "PERCENTAGE"
                                                        ? `${coupon.discountValue}% OFF`
                                                        : `₹${coupon.discountValue} OFF`}
                                                </span>
                                                upto ₹{coupon.maxDiscount || coupon.discountValue} on orders above ₹{coupon.minOrderValue || '0'}.
                                                Code: <span className="font-mono font-medium text-stone-800 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">{coupon.code}</span>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Description */}
                        <div className="space-y-4">
                            {/* Selector for size/variant would go here */}
                            <p className="text-base leading-relaxed text-stone-600">
                                {product.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-32 items-center justify-between rounded-md border border-stone-200 bg-white px-3 shadow-sm">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="text-stone-400 hover:text-stone-900 disabled:opacity-50"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="font-semibold text-stone-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                        className="text-stone-400 hover:text-stone-900 disabled:opacity-50"
                                        disabled={quantity >= product.stock}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-md border-stone-200">
                                        <Heart className="h-5 w-5 text-stone-500" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-md border-stone-200">
                                        <Share2 className="h-5 w-5 text-stone-500" />
                                    </Button>
                                </div>
                            </div>

                            <Button
                                size="lg"
                                onClick={handleAddToCart}
                                className="w-full h-14 rounded-md text-base font-bold tracking-wide shadow-none hover:translate-y-0 active:scale-[0.99] transition-all"
                            >
                                <ShoppingBag className="mr-2 h-5 w-5" /> ADD TO CART — ₹{(product.price * quantity).toLocaleString()}
                            </Button>
                        </div>

                        {/* Information Sections */}
                        <Accordion type="single" collapsible className="w-full border-t border-stone-200">
                            <AccordionItem value="details" className="border-b border-stone-200">
                                <AccordionTrigger className="text-stone-900 font-medium hover:no-underline">
                                    Product Details
                                </AccordionTrigger>
                                <AccordionContent className="text-stone-500">
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Premium quality materials</li>
                                        <li>Hand-finished details</li>
                                        <li>Designed in-house</li>
                                        <li>Eco-friendly packaging</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="shipping" className="border-b border-stone-200">
                                <AccordionTrigger className="text-stone-900 font-medium hover:no-underline">
                                    Shipping & Returns
                                </AccordionTrigger>
                                <AccordionContent className="text-stone-500">
                                    Free standard shipping on all orders above ₹999. Orders below ₹999 will be charged a flat rate of ₹49. Returns are accepted within 7 days of delivery.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                    </div>
                </div>
            </div>

            {/* Sticky Action Bar (Mobile Only) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200 bg-white p-4 lg:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <Button
                    size="lg"
                    onClick={handleAddToCart}
                    className="w-full h-12 rounded-md font-bold shadow-none"
                >
                    Add to Cart — ₹{(product.price * quantity).toLocaleString()}
                </Button>
            </div>
        </div>
    );
}
