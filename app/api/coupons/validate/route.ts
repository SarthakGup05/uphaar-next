import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { coupons, couponProducts, products } from "@/lib/db/schema";
import { eq, and, gte, lte, or, inArray, sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, cartItems, cartTotal } = body;

    if (!code) {
      return NextResponse.json({ valid: false, message: "No code provided" });
    }

    // 1. Fetch Coupon
    const coupon = await db.query.coupons.findFirst({
      where: eq(coupons.code, code.toUpperCase()),
    });

    if (!coupon) {
      return NextResponse.json({ valid: false, message: "Invalid coupon code" });
    }

    // 2. Basic Checks
    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, message: "Coupon is no longer active" });
    }

    const now = new Date();
    if (coupon.validFrom && new Date(coupon.validFrom) > now) {
      return NextResponse.json({ valid: false, message: "Coupon is not yet valid" });
    }
    if (coupon.validUntil && new Date(coupon.validUntil) < now) {
      return NextResponse.json({ valid: false, message: "Coupon has expired" });
    }

    if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) {
      return NextResponse.json({ valid: false, message: "Coupon usage limit exceeded" });
    }

    if (parseFloat(coupon.minOrderValue || "0") > cartTotal) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order of ₹${coupon.minOrderValue} required`,
      });
    }

    // 3. Product Applicability Check
    const eligibleProductIds = await db
      .select({ productId: couponProducts.productId })
      .from(couponProducts)
      .where(eq(couponProducts.couponId, coupon.id));

    const eligibleIdsSet = new Set(eligibleProductIds.map((p) => p.productId));
    const hasSpecificProducts = eligibleIdsSet.size > 0;

    let discountAmount = 0;
    const discountValue = parseFloat(coupon.discountValue);

    if (hasSpecificProducts) {
      // Calculate discount only on eligible items
      let eligibleTotal = 0;
      let hasEligibleItem = false;

      cartItems.forEach((item: any) => {
        if (eligibleIdsSet.has(parseInt(item.id))) {
          eligibleTotal += item.price * item.quantity;
          hasEligibleItem = true;
        }
      });

      if (!hasEligibleItem) {
        return NextResponse.json({
          valid: false,
          message: "Coupon is not applicable to items in your cart",
        });
      }

      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = (eligibleTotal * discountValue) / 100;
      } else {
        // Fixed amount - applied if at least one eligible item is present
        // (Usually fixed amount is total, not per item, unless specified otherwise)
        discountAmount = discountValue;
      }
    } else {
      // Applies to entire cart
      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = (cartTotal * discountValue) / 100;
      } else {
        discountAmount = discountValue;
      }
    }

    // Cap max discount for percentage
    if (coupon.discountType === "PERCENTAGE" && coupon.maxDiscount) {
      discountAmount = Math.min(discountAmount, parseFloat(coupon.maxDiscount));
    }

    // Ensure discount doesn't exceed total
    discountAmount = Math.min(discountAmount, cartTotal);

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountAmount,
      newTotal: cartTotal - discountAmount,
      message: "Coupon applied successfully",
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json({ valid: false, message: "Validation failed" }, { status: 500 });
  }
}
