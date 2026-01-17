"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { columns, HeroSlide } from "./columns";
import api from "@/lib/axios";

// Fetch Function
const fetchSlides = async (): Promise<HeroSlide[]> => {
    const { data } = await api.get("/hero");
    return data;
};

export default function AdminHeroPage() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["hero-slides"],
        queryFn: fetchSlides,
    });

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-bold">Hero Slides</h1>
                    <p className="text-muted-foreground">Manage the main homepage slider</p>
                </div>
                <Link href="/admin/hero/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Add Slide
                    </Button>
                </Link>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex h-64 items-center justify-center rounded-lg border border-stone-200 bg-white">
                    <div className="flex flex-col items-center gap-2 text-stone-500">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p>Loading slides...</p>
                    </div>
                </div>
            ) : isError ? (
                <div className="p-4 text-red-500 bg-red-50 rounded-lg">
                    Error loading slides. Please try again.
                </div>
            ) : (
                <DataTable columns={columns} data={data || []} />
            )}
        </div>
    );
}
