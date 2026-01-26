"use client";

import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Minus, Plus, ShoppingBag, Tag, Trash2, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, subtotal, shipping, totalItems, applyCoupon, removeCoupon, coupon } = useCartStore();
    const [couponCode, setCouponCode] = useState("");
    const [validatingCoupon, setValidatingCoupon] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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
                    discountType: "FIXED"
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

    const handleRemoveCouponAction = () => {
        removeCoupon();
        toast.success("Coupon removed");
    };

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

    if (!isMounted) return null;

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 bg-stone-50/30">
                <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="h-10 w-10 text-stone-300" />
                </div>
                <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">Your cart is empty</h1>
                <p className="text-stone-500 mb-8 max-w-sm text-center">
                    Looks like you haven't added any unique handcrafted items yet.
                </p>
                <Link href="/shop">
                    <Button size="lg" className="bg-stone-900 text-white hover:bg-stone-800 rounded-xl px-8">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50/30 text-stone-950 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link href="/shop" className="mr-4 lg:hidden">
                        <ArrowLeft className="h-6 w-6 text-stone-600" />
                    </Link>
                    <h1 className="text-xl md:text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
                        Shopping Cart
                        <span className="text-sm font-sans font-normal text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                            {itemCount} items
                        </span>
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 xl:gap-12">

                    {/* Cart Items List */}
                    <div className="space-y-6">
                        {items.map((item) => (
                            <div key={item.id} className="group bg-white rounded-2xl p-4 sm:p-6 border border-stone-100 shadow-sm flex gap-4 sm:gap-6 items-start">
                                {/* Image */}
                                <div className="relative h-24 w-24 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-xl bg-stone-50 border border-stone-100">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between h-24 sm:h-32 py-1">
                                    <div>
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-serif font-semibold text-stone-900 text-base sm:text-lg line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-stone-400 hover:text-red-500 transition-colors p-1 -mr-2"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-stone-500 font-medium mt-1">
                                            ₹{item.price.toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-3 bg-stone-100 rounded-lg p-1">
                                            <button
                                                onClick={() => {
                                                    if (item.quantity === 1) removeItem(item.id);
                                                    else updateQuantity(item.id, -1);
                                                }}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-stone-600 hover:text-stone-900 active:scale-95 transition-all"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="font-semibold text-stone-900 w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-stone-600 hover:text-stone-900 active:scale-95 transition-all"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-lg font-bold text-stone-900">
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Trust Signals Inline (Mobile only) */}
                        <div className="lg:hidden grid grid-cols-3 gap-2 mt-6">
                            <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-white border border-stone-100 shadow-sm">
                                <ShieldCheck className="h-5 w-5 text-stone-400 mb-1" />
                                <span className="text-[10px] font-semibold text-stone-600">Secure</span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-white border border-stone-100 shadow-sm">
                                <Truck className="h-5 w-5 text-stone-400 mb-1" />
                                <span className="text-[10px] font-semibold text-stone-600">Fast Ship</span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-white border border-stone-100 shadow-sm">
                                <RotateCcw className="h-5 w-5 text-stone-400 mb-1" />
                                <span className="text-[10px] font-semibold text-stone-600">Returns</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:sticky lg:top-24 h-fit space-y-6">
                        <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                            <h2 className="text-lg font-serif font-bold text-stone-900 mb-6">Order Summary</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-stone-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-stone-900">₹{cartSubtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-stone-600">
                                    <span>Shipping</span>
                                    <span className={cn("font-medium", shipping() === 0 ? "text-green-600" : "text-stone-900")}>
                                        {shipping() === 0 ? "Free" : `₹${shipping()}`}
                                    </span>
                                </div>
                                {shipping() > 0 && (
                                    <p className="text-xs text-stone-400 mt-[-12px] mb-2 text-right">
                                        Add items worth <span className="text-stone-700 font-semibold">₹{(1999 - cartSubtotal).toLocaleString()}</span> more for free shipping
                                    </p>
                                )}

                                {coupon && (
                                    <div className="flex justify-between text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <Tag className="h-4 w-4" />
                                            Code: {coupon.code}
                                        </span>
                                        <span className="font-bold">-₹{coupon.discountAmount.toLocaleString()}</span>
                                    </div>
                                )}

                                <Separator />

                                <div className="flex justify-between items-end">
                                    <span className="text-base font-semibold text-stone-900">Total</span>
                                    <div className="text-right">
                                        <span className="block text-2xl font-bold text-stone-900 font-serif">
                                            ₹{cartTotal.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-stone-500">Including all taxes</span>
                                    </div>
                                </div>
                            </div>

                            {/* Coupon Input */}
                            <div className="mt-8 pt-6 border-t border-stone-100">
                                <label className="text-sm font-medium text-stone-700 mb-2 block">Have a coupon?</label>
                                {coupon ? (
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                        onClick={handleRemoveCouponAction}
                                    >
                                        Remove Coupon <Trash2 className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Enter code"
                                            className="bg-stone-50 border-stone-200"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                                        />
                                        <Button
                                            variant="secondary"
                                            onClick={handleApplyCoupon}
                                            disabled={validatingCoupon || !couponCode}
                                            className="bg-stone-900 text-white hover:bg-stone-800"
                                        >
                                            {validatingCoupon ? "..." : "Apply"}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={handleWhatsAppCheckout}
                                className="w-full mt-8 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-14 text-lg rounded-xl shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all"
                            >
                                Checkout on WhatsApp
                            </Button>
                            <p className="text-[11px] text-center text-stone-400 mt-3 px-4">
                                We'll redirect you to WhatsApp with your order details pre-filled.
                            </p>
                        </div>

                        {/* Trust Signals (Desktop) */}
                        <div className="hidden lg:grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center text-center gap-1">
                                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-bold text-stone-700">100% Authentic</span>
                                <span className="text-[10px] text-stone-500 leading-tight">Handcrafted with love</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-1">
                                <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-2">
                                    <RotateCcw className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-bold text-stone-700">Easy Returns</span>
                                <span className="text-[10px] text-stone-500 leading-tight">7-day policy</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-1">
                                <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-2">
                                    <Truck className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-bold text-stone-700">Safe Delivery</span>
                                <span className="text-[10px] text-stone-500 leading-tight">All across India</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
