import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth"; // For securing the POST route

/**
 * GET /api/products
 * Fetches all products, optionally filtered by category.
 * Query Params: ?category=Resin
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  try {
    let query = db.select().from(products).orderBy(desc(products.createdAt));

    if (category && category !== "All") {
      // @ts-ignore - Drizzle dynamic query type workaround
      query = db
        .select()
        .from(products)
        .where(eq(products.category, category))
        .orderBy(desc(products.createdAt));
    }

    const allProducts = await query;
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error("Fetch Products Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// POST: Create a product (Admin Only)
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Insert into DB
    const [newProduct] = await db
      .insert(products)
      .values({
        title: body.title,
        slug: body.slug,
        description: body.description,
        price: body.price.toString(),
        stock: Number(body.stock),
        category: body.category,
        image: body.image,
        heroImage: body.heroImage,
        images: body.images,
      })
      .returning();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Create Product Error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
