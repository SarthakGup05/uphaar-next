import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Coupon {
  id: number;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: string; // numeric string from DB
  minOrderValue: string;
  maxDiscount: string | null;
  productIds: number[];
}

export function useActiveCoupons() {
  return useQuery({
    queryKey: ["active-coupons"],
    queryFn: async () => {
      const { data } = await api.get<Coupon[]>("/active-coupons");
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function getBestCouponForProduct(coupons: Coupon[] = [], price: number, productId?: number) {
  let bestCoupon: Coupon | null = null;
  let maxSavings = 0;

  for (const coupon of coupons) {
    // 1. Check Product Eligibility
    const isSpecific = coupon.productIds.length > 0;
    if (isSpecific && productId && !coupon.productIds.includes(productId)) {
      continue;
    }
    // If specific but no productId provided (e.g. cart level), we might ignore or handle differently.
    // For "Product Card" context, we have a productId.

    // 2. Check Min Order (using single product price as proxy for feasibility)
    const minOrder = parseFloat(coupon.minOrderValue || "0");
    if (price < minOrder) continue;

    // 3. Calculate Savings
    let savings = 0;
    const value = parseFloat(coupon.discountValue);
    
    if (coupon.discountType === "PERCENTAGE") {
      savings = (price * value) / 100;
      if (coupon.maxDiscount) {
        savings = Math.min(savings, parseFloat(coupon.maxDiscount));
      }
    } else {
      savings = value;
    }

    // Ensure savings doesn't exceed price
    savings = Math.min(savings, price);

    if (savings > maxSavings) {
      maxSavings = savings;
      bestCoupon = coupon;
    }
  }

  return { bestCoupon, savings: maxSavings };
}
