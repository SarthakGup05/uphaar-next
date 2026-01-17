import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

// PATCH: Update Order Status (e.g. Pending -> Paid)
// PATCH: Update Order Status (e.g. Pending -> Paid)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    const body = await request.json(); // Expecting { status: "Paid" }

    const [updatedOrder] = await db
      .update(orders)
      .set({ status: body.status })
      .where(eq(orders.id, id))
      .returning();

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

// DELETE: Remove an order
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
    try {
      const { id: paramId } = await params;
      const id = parseInt(paramId);
      await db.delete(orders).where(eq(orders.id, id));
      return NextResponse.json({ message: "Order deleted" });
    } catch (error) {
      return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
    }
  }