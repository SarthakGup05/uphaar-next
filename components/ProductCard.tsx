"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Heart, Star, StarHalf } from "lucide-react";
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
  rating?: number;
}

// Helper component for Star Rating
const StarRating = ({ rating = 4.2 }: { rating?: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />;
        }
        if (i === fullStars && hasHalfStar) {
          return <StarHalf key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />;
        }
        return <Star key={i} className="w-3.5 h-3.5 text-stone-200 fill-stone-100" />;
      })}
      <span className="text-[11px] text-stone-500 font-medium ml-1.5 pt-0.5">
        ({rating})
      </span>
    </div>
  );
};

export default function ProductCard({ 
  title, 
  category, 
  price, 
  image, 
  slug, 
  id, 
  rating = 4.2 
}: ProductProps) {
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
      price: finalPrice,
      image,
      quantity: 1,
      slug,
    });
  };

  return (
    <Link href={`/shop/${slug}`} className="group block h-full w-full">
      <div className="relative flex flex-col h-full bg-white rounded-xl overflow-hidden border border-stone-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-stone-200">
        
        {/* IMAGE CONTAINER - CHANGED ASPECT RATIO HERE */}
        {/* aspect-[2/3] makes it taller on mobile vs aspect-[3/4] */}
        <div className="relative aspect-[2/3] md:aspect-[3/4] w-full overflow-hidden bg-stone-50">
          
          {/* Main Image */}
          <Image
            src={image}
            alt={title}
            fill
            loader={imageKitLoader}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority={false}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* TOP ACTIONS */}
          <div className="absolute top-3 inset-x-3 flex justify-between items-start z-10">
            <div className="flex flex-col gap-1.5">
               {/* Sale Tag */}
               {bestCoupon && (
                <span className="bg-red-600 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">
                  {bestCoupon.discountType === "PERCENTAGE" 
                    ? `-${bestCoupon.discountValue}%` 
                    : `Save ₹${bestCoupon.discountValue}`}
                </span>
              )}
               {/* Category Tag */}
               <span className="bg-white/90 backdrop-blur-sm text-stone-900 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                {category}
              </span>
            </div>

            {/* Wishlist Button */}
            <button className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-stone-600 hover:bg-white hover:text-red-500 hover:scale-110 transition-all shadow-sm">
              <Heart className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* QUICK ADD BUTTON (Desktop) */}
          <div className="absolute inset-x-4 bottom-4 translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20 hidden md:block">
            <Button
              onClick={handleQuickAdd}
              className="w-full bg-white text-stone-900 hover:bg-stone-900 hover:text-white shadow-lg border-none font-medium h-11 rounded-lg tracking-wide"
            >
              <Plus className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </div>
          
          {/* Mobile Quick Add (Always Visible/Easy Touch) */}
          <button 
            onClick={handleQuickAdd}
            className="md:hidden absolute bottom-3 right-3 h-10 w-10 bg-white/95 text-stone-900 rounded-full shadow-md flex items-center justify-center border border-stone-100 active:scale-95 transition-transform z-20"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* TEXT CONTENT */}
        <div className="p-4 flex flex-col gap-2 flex-grow">
          {/* Rating */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-stone-400 font-bold tracking-widest uppercase md:hidden truncate max-w-[50%]">{category}</span>
            <StarRating rating={rating} />
          </div>

          {/* Title - Slightly larger on mobile now */}
          <h3 className="font-serif text-lg md:text-xl leading-snug text-stone-900 group-hover:text-stone-600 transition-colors line-clamp-2">
            {title}
          </h3>
          
          {/* Price */}
          <div className="mt-auto pt-2 flex items-baseline gap-2">
            {savings > 0 ? (
              <>
                <span className="text-lg font-bold text-stone-900">₹{finalPrice.toLocaleString()}</span>
                <span className="text-sm text-stone-400 line-through">₹{price.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-stone-900">₹{price.toLocaleString()}</span>
            )}
          </div>
        </div>
        
      </div>
    </Link>
  );
}