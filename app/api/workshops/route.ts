import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { workshops } from "@/lib/db/schema";
import { workshopSchema } from "@/lib/schemas";
import { getSession } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(workshops)
      .orderBy(desc(workshops.date));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch workshops" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    // Check if user is admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate request body
    const validatedData = workshopSchema.parse(body);

    const [newWorkshop] = await db
      .insert(workshops)
      .values({
        ...validatedData,
        price: validatedData.price.toString(),
      })
      .returning();

    return NextResponse.json(newWorkshop, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create workshop" },
      { status: 400 },
    );
  }
}
