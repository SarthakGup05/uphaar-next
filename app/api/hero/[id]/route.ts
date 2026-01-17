import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { heroSlides } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

/**
 * PUT /api/hero/[id]
 * Admin: Update an existing slide.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // In Next.js 15+, params is a Promise
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();

    const [updatedSlide] = await db
      .update(heroSlides)
      .set({
        title: body.title,
        subtitle: body.subtitle,
        image: body.image,
        cta: body.cta,
        align: body.align,
        order: body.order,
        isActive: body.isActive,
      })
      .where(eq(heroSlides.id, Number(id)))
      .returning();

    return NextResponse.json(updatedSlide);
  } catch (error) {
    console.error("Update Slide Error:", error);
    return NextResponse.json({ error: "Failed to update slide" }, { status: 500 });
  }
}

/**
 * DELETE /api/hero/[id]
 * Admin: Delete a slide.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;

    await db.delete(heroSlides).where(eq(heroSlides.id, Number(id)));

    return NextResponse.json({ message: "Slide deleted successfully" });
  } catch (error) {
    console.error("Delete Slide Error:", error);
    return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 });
  }
}
