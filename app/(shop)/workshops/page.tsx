
import React from "react";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { workshops } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import WorkshopCard from "@/components/WorkshopCard";

export const metadata: Metadata = {
    title: "Workshops | Uphaar",
    description: "Join our creative workshops and learn new skills.",
};

export const dynamic = "force-dynamic";

export default async function WorkshopsPage() {
    const allWorkshops = await db
        .select()
        .from(workshops)
        .orderBy(desc(workshops.date));

    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="font-serif text-4xl md:text-5xl font-medium text-stone-900 mb-4">
                    Creative Workshops
                </h1>
                <p className="text-stone-500 text-lg">
                    Join us for hands-on sessions where you can learn the art of resin, candle making, and more from expert instructors.
                </p>
            </div>

            {/* Grid */}
            {allWorkshops.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allWorkshops.map((workshop) => (
                        <WorkshopCard
                            key={workshop.id}
                            {...workshop}
                        // Converting Date object to string if needed or passing as is if WorkshopCard handles it
                        // My WorkshopCard expects Date | string for date
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-stone-50 rounded-2xl">
                    <h3 className="text-xl font-medium text-stone-900 mb-2">No workshops scheduled</h3>
                    <p className="text-stone-500">Check back later for upcoming events!</p>
                </div>
            )}
        </div>
    );
}
