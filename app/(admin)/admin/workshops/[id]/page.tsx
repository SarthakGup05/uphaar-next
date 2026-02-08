
"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import WorkshopForm from "../_components/workshop-form";
import api from "@/lib/axios";
import { useParams } from "next/navigation";

export default function EditWorkshopPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: workshop, isLoading, isError } = useQuery({
        queryKey: ["workshop", id],
        queryFn: async () => {
            const { data } = await api.get(`/workshops/${id}`);
            return data;
        },
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError || !workshop) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
                <p className="text-red-500">Failed to load workshop data</p>
                <Link href="/admin/workshops">
                    <Button variant="outline">Go Back</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/workshops">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="font-serif text-2xl font-bold">Edit Workshop</h1>
            </div>

            <WorkshopForm initialData={workshop} />
        </div>
    );
}
