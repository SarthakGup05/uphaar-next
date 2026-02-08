import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { workshops } from "@/lib/db/schema";
import { workshopSchema } from "@/lib/schemas";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const workshopId = parseInt(id);

    if (isNaN(workshopId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const [workshop] = await db
      .select()
      .from(workshops)
      .where(eq(workshops.id, workshopId));

    if (!workshop) {
      return NextResponse.json(
        { error: "Workshop not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(workshop);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch workshop" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    // Check if user is admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const workshopId = parseInt(id);
    const body = await req.json();

    // Partial validation for updates
    const validatedData = workshopSchema.partial().parse(body);

    const dataToUpdate: any = { ...validatedData };
    if (validatedData.price !== undefined) {
      dataToUpdate.price = validatedData.price.toString();
    }

    const [updatedWorkshop] = await db
      .update(workshops)
      .set(dataToUpdate)
      .where(eq(workshops.id, workshopId))
      .returning();

    if (!updatedWorkshop) {
      return NextResponse.json(
        { error: "Workshop not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedWorkshop);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update workshop" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    // Check if user is admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const workshopId = parseInt(id);

    const [deletedWorkshop] = await db
      .delete(workshops)
      .where(eq(workshops.id, workshopId))
      .returning();

    if (!deletedWorkshop) {
      return NextResponse.json(
        { error: "Workshop not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(deletedWorkshop);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete workshop" },
      { status: 500 },
    );
  }
}
