"use client";

import { ShoppingBag, Trash2, X, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart-store";
import api from "@/lib/axios";
import { toast } from "sonner";

export function CartSheet() {
  // Access state and actions from the store
  const { items, removeItem, total, subtotal, totalItems, applyCoupon, removeCoupon, coupon } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Hydration fix for persistent store
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon" className="relative hover:text-primary">
        <ShoppingBag className="h-5 w-5" />
      </Button>
    )
  }



  const cartTotal = total();
  const cartSubtotal = subtotal();
  const itemCount = totalItems();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    try {
      const { data } = await api.post("/coupons/validate", {
        code: couponCode,
        cartItems: items,
        cartTotal: cartSubtotal
      });

      if (data.valid) {
        applyCoupon({
          code: data.code,
          discountAmount: data.discountAmount,
          discountType: "FIXED" // The API returns calculated amount, so we treat it as fixed reduction for display simplicity or store what API gives. 
          // Actually store expects type. API doesn't return type in my previous code? 
          // Wait, I implemented validate route to return `code`, `discountAmount`. I should probably return type too if needed or just handle amount. 
          // Cart store definition says type is needed. I'll pass "FIXED" since `discountAmount` IS the fixed value to subtract.
        });
        toast.success(data.message);
        setCouponCode("");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error("Failed to apply coupon");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handeRemoveCouponAction = () => {
    removeCoupon();
    toast.success("Coupon removed");
  }

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    const phoneNumber = "917000769656";
    let message = "Hello! I would like to order:\n\n";

    items.forEach((item: any) => {
      message += `▪️ ${item.quantity}x ${item.title} - ₹${item.price * item.quantity}\n`;
    });

    message += `\nSubtotal: ₹${cartSubtotal.toLocaleString()}`;
    if (coupon) {
      message += `\nDiscount (${coupon.code}): -₹${coupon.discountAmount.toLocaleString()}`;
    }
    message += `\n*Total Estimate: ₹${cartTotal.toLocaleString()}*`;
    message += `\n\nPlease confirm availability and shipping details.`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:text-primary">
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white animate-in zoom-in">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-md">
        <SheetHeader className="px-1">
          <SheetTitle className="font-serif text-2xl text-primary">Your Cart</SheetTitle>
        </SheetHeader>

        <Separator className="my-4" />

        {items.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-1 flex-col items-center justify-center text-center p-4 text-muted-foreground">
            <ShoppingBag className="h-12 w-12 opacity-20 mb-4" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm">Looks like you haven't added any unique handcrafted items yet.</p>
          </div>
        ) : (
          // FILLED STATE
          <>
            <ScrollArea className="flex-1 pr-4">
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    {/* Product Image */}
                    <div className="relative h-20 w-20 overflow-hidden rounded-md border border-stone-100 bg-stone-50">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <h4 className="font-serif text-sm font-medium line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          ₹{item.price.toLocaleString()} x {item.quantity}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer with Total & Checkout */}
            <div className="mt-auto pr-6 pt-6 mb-6 bg-background"> {/* Start Footer */}
              <Separator className="mb-4" />

              {/* Coupon Section */}
              <div className="mb-4 space-y-3">
                {coupon ? (
                  <div className="flex items-center justify-between rounded-md border border-green-200 bg-green-50 p-2 text-sm text-green-700">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span className="font-medium">Code: {coupon.code} applied</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handeRemoveCouponAction} className="h-auto p-0 text-green-700 hover:text-green-800 hover:bg-transparent">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Coupon Code"
                      className="h-9"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    />
                    <Button size="sm" variant="secondary" onClick={handleApplyCoupon} disabled={validatingCoupon || !couponCode}>
                      {validatingCoupon ? "..." : "Apply"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cartSubtotal.toLocaleString()}</span>
                </div>

                {coupon && (
                  <div className="flex items-center justify-between text-sm text-green-600">
                    <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> Discount</span>
                    <span>-₹{coupon.discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-base font-medium text-foreground">Total</span>
                  <span className="font-serif text-2xl font-bold text-foreground">
                    ₹{cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleWhatsAppCheckout}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-12 text-base shadow-lg shadow-green-500/20"
              >
                Order via WhatsApp
              </Button>
              <p className="text-[10px] text-center text-muted-foreground mt-3">
                Checkout will open WhatsApp with your pre-filled order details.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}