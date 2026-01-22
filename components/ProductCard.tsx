"use client";

import Image from "next/image";
import Link from "next/link"; // 1. Import Link
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store"; // Optional: if you want the button to work immediately
import { useActiveCoupons, getBestCouponForProduct } from "@/lib/hooks/use-coupons";
import { Loader2 } from "lucide-react";
import imageKitLoader from "@/lib/imagekit-loader";

interface ProductProps {
  title: string;
  category: string;
  price: number;
  image: string;
  slug: string; // 2. Added slug prop
  id: number; // Added numeric ID for coupon targeting
}

export default function ProductCard({ title, category, price, image, slug, id }: ProductProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { data: coupons, isLoading } = useActiveCoupons();

  const { bestCoupon, savings } = getBestCouponForProduct(coupons, price, id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents navigation to the product page
    e.stopPropagation();

    addItem({
      id: slug, // Using slug as ID for simplicity, or pass actual ID if available
      title,
      price,
      image,
      quantity: 1,
      slug,
    });
    // Optional: Add a toast/alert here
  };

  return (
    // 3. Wrap everything in Link
    <Link href={`/shop/${slug}`} className="group block h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-lg bg-card transition-all hover:shadow-lg border border-border/50">

        {/* Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
          <Image
            src={image}
            alt={title}
            fill
            loader={imageKitLoader}
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Quick Add Button */}
          <Button
            size="icon"
            className="absolute bottom-4 right-4 translate-y-12 shadow-md transition-all duration-300 group-hover:translate-y-0 rounded-full z-10"
            onClick={handleQuickAdd} // 4. Hooked up the click event
          >
            <Plus className="h-5 w-5" />
          </Button>

          <Badge variant="secondary" className="absolute left-3 top-3 bg-stone-900/90 text-white text-xs backdrop-blur-md hover:bg-black">
            {category}
          </Badge>

          {bestCoupon && (
            <Badge className="absolute left-3 top-10 bg-red-600 text-white text-xs z-10 animate-in fade-in zoom-in">
              {bestCoupon.discountType === "PERCENTAGE"
                ? `${bestCoupon.discountValue}% OFF`
                : `SAVE ₹${bestCoupon.discountValue}`}
            </Badge>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-1 p-4">
          <h3 className="font-serif text-lg text-foreground truncate group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm font-medium text-secondary">₹{price.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
}