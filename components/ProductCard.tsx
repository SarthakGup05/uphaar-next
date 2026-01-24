"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { useActiveCoupons, getBestCouponForProduct } from "@/lib/hooks/use-coupons";
import imageKitLoader from "@/lib/imagekit-loader";
import { cn } from "@/lib/utils";

interface ProductProps {
  title: string;
  category: string;
  price: number;
  image: string;
  slug: string;
  id: number;
}

export default function ProductCard({ title, category, price, image, slug, id }: ProductProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { data: coupons } = useActiveCoupons();

  // Calculate dynamic pricing
  const { bestCoupon, savings } = getBestCouponForProduct(coupons, price, id);
  const finalPrice = price - savings;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: slug,
      title,
      price: finalPrice, // Add the actual discounted price to cart
      image,
      quantity: 1,
      slug,
    });
    // Add toast notification logic here if needed
  };

  return (
    <Link href={`/shop/${slug}`} className="group block h-full">
      <div className="relative flex flex-col h-full space-y-3">
        
        {/* IMAGE CONTAINER */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-stone-100">
          
          {/* Main Image with Zoom Effect */}
          <Image
            src={image}
            alt={title}
            fill
            loader={imageKitLoader}
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Overlay Gradient (Subtle shadow for text readability if needed) */}
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />

          {/* BADGES (Top Left) */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
            {/* Category Tag - Minimalist */}
            <span className="bg-white/90 backdrop-blur-sm text-stone-900 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm shadow-sm">
              {category}
            </span>
            
            {/* Sale Tag - Only shows if coupon exists */}
            {bestCoupon && (
              <span className="bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm shadow-sm animate-in fade-in slide-in-from-left-2">
                 {bestCoupon.discountType === "PERCENTAGE" 
                   ? `-${bestCoupon.discountValue}%` 
                   : `Save ₹${bestCoupon.discountValue}`}
              </span>
            )}
          </div>

          {/* QUICK ADD ACTION (Slides up from bottom) */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
            <Button
              onClick={handleQuickAdd}
              className="w-full bg-white/95 text-stone-900 hover:bg-stone-900 hover:text-white backdrop-blur-md shadow-lg border border-stone-200 transition-all duration-300 font-medium tracking-wide"
            >
              <Plus className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </div>
        </div>

        {/* TEXT CONTENT */}
        <div className="space-y-1 text-center md:text-left">
          <h3 className="font-serif text-lg leading-tight text-stone-900 group-hover:underline decoration-stone-300 underline-offset-4 transition-all">
            {title}
          </h3>
          
          <div className="flex items-center justify-center md:justify-start gap-2 text-sm">
            {/* Price Logic */}
            {savings > 0 ? (
              <>
                <span className="font-medium text-red-600">₹{finalPrice.toLocaleString()}</span>
                <span className="text-stone-400 line-through text-xs">₹{price.toLocaleString()}</span>
              </>
            ) : (
              <span className="font-medium text-stone-600">₹{price.toLocaleString()}</span>
            )}
          </div>
        </div>
        
      </div>
    </Link>
  );
}