import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { coupons, couponProducts, products } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// GET: List all coupons
export async function GET() {
  try {
    const allCoupons = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
    return NextResponse.json(allCoupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

// POST: Create a new coupon
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      validFrom,
      validUntil,
      usageLimit,
      isActive,
      productIds, // Array of product IDs for specific targeting
    } = body;

    // 1. Basic Validation
    if (!code || !discountType || !discountValue) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Create Coupon
    const [newCoupon] = await db
      .insert(coupons)
      .values({
        code: code.toUpperCase(),
        discountType,
        discountValue: discountValue.toString(),
        minOrderValue: minOrderValue ? minOrderValue.toString() : "0",
        maxDiscount: maxDiscount ? maxDiscount.toString() : null,
        validFrom: validFrom ? new Date(validFrom) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();

    // 3. Associate Products (if any)
    if (productIds && Array.isArray(productIds) && productIds.length > 0) {
      const relationValues = productIds.map((pid: number) => ({
        couponId: newCoupon.id,
        productId: pid,
      }));
      await db.insert(couponProducts).values(relationValues);
    }

    return NextResponse.json(newCoupon, { status: 201 });
  } catch (error: any) {
    console.error("Error creating coupon:", error);
    // Unique constraint violation for code
    if (error.code === "23505") {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
