import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { heroSlides } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

/**
 * GET /api/hero
 * Public: Fetches all active slides ordered by 'order' field.
 */
export async function GET(request: Request) {
  try {
    const slides = await db
      .select()
      .from(heroSlides)
      .where(eq(heroSlides.isActive, true))
      .orderBy(asc(heroSlides.order));
    
    return NextResponse.json(slides);
  } catch (error) {
    console.error("Fetch Slides Error:", error);
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
  }
}

/**
 * POST /api/hero
 * Admin: Create a new slide.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    const [newSlide] = await db
      .insert(heroSlides)
      .values({
        title: body.title,
        subtitle: body.subtitle,
        image: body.image,
        cta: body.cta,
        align: body.align,
        order: body.order,
        isActive: body.isActive !== undefined ? body.isActive : true,
      })
      .returning();

    return NextResponse.json(newSlide, { status: 201 });
  } catch (error) {
    console.error("Create Slide Error:", error);
    return NextResponse.json({ error: "Failed to create slide" }, { status: 500 });
  }
}
