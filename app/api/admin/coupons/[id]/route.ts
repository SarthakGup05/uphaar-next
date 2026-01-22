import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { coupons, couponProducts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET: Get single coupon details with associated products
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Params validation for Next.js 15+ needs to be awaited? No, params is a promise in standard definition or direct object depending on version. Wait, in Next 15 params IS A PROMISE sometimes. Safest is to treat it as one if unsure, but standard app router usually passes object. ERROR FIX: In recent Next.js versions params is a Promise.
) {
  try {
    const { id } = await params;
    const couponId = parseInt(id);

    const coupon = await db.query.coupons.findFirst({
      where: eq(coupons.id, couponId),
    });

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    // Get associated products
    const associatedProducts = await db
      .select({ productId: couponProducts.productId })
      .from(couponProducts)
      .where(eq(couponProducts.couponId, couponId));

    return NextResponse.json({
      ...coupon,
      productIds: associatedProducts.map((p) => p.productId),
    });
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return NextResponse.json({ error: "Failed to fetch coupon" }, { status: 500 });
  }
}

// PUT: Update coupon
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const couponId = parseInt(id);
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
      productIds,
    } = body;

    // Update Coupon Fields
    await db
      .update(coupons)
      .set({
        code: code?.toUpperCase(),
        discountType,
        discountValue: discountValue?.toString(),
        minOrderValue: minOrderValue ? minOrderValue.toString() : "0",
        maxDiscount: maxDiscount ? maxDiscount.toString() : null,
        validFrom: validFrom ? new Date(validFrom) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        isActive,
      })
      .where(eq(coupons.id, couponId));

    // Update Product Associations
    // DELETE existing relations first
    await db.delete(couponProducts).where(eq(couponProducts.couponId, couponId));

    // INSERT new relations
    if (productIds && Array.isArray(productIds) && productIds.length > 0) {
      const relationValues = productIds.map((pid: number) => ({
        couponId,
        productId: pid,
      }));
      await db.insert(couponProducts).values(relationValues);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

// DELETE: Delete coupon
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const couponId = parseInt(id);

    await db.delete(coupons).where(eq(coupons.id, couponId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
