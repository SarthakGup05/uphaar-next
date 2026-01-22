import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { coupons, couponProducts } from "@/lib/db/schema";
import { eq, and, or, gte, lte, isNull } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();

    // 1. Fetch active coupons
    // Logic: isActive AND (validFrom IS NULL OR validFrom <= now) AND (validUntil IS NULL OR validUntil >= now)
    const activeCoupons = await db.select().from(coupons).where(
      and(
        eq(coupons.isActive, true),
        or(isNull(coupons.validFrom), lte(coupons.validFrom, now)),
        or(isNull(coupons.validUntil), gte(coupons.validUntil, now))
      )
    );

    // 2. Attach product IDs for targeting
    const result = await Promise.all(activeCoupons.map(async (coupon) => {
      const products = await db
        .select({ productId: couponProducts.productId })
        .from(couponProducts)
        .where(eq(couponProducts.couponId, coupon.id));
      
      return {
        ...coupon,
        productIds: products.map(p => p.productId)
      };
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching active coupons:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}
