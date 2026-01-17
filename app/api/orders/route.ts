import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

/**
 * GET /api/orders
 * Admin-only route to list all orders.
 */
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return NextResponse.json(allOrders);
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST: Create a new manual order (Admin Only)
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    const [newOrder] = await db.insert(orders).values({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      totalAmount: body.totalAmount.toString(),
      status: body.status || "Pending",
      itemsSummary: body.itemsSummary,
    }).returning();

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}