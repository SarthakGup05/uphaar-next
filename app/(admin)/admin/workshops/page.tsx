
"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { columns, Workshop } from "./columns";
import { AdminTableSkeleton } from "@/components/skeletons/admin-skeletons";
import api from "@/lib/axios";

const fetchWorkshops = async (): Promise<Workshop[]> => {
    const { data } = await api.get("/workshops"); // Our GET /api/workshops is public but works for admin too
    return data;
};

export default function AdminWorkshopsPage() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["workshops"],
        queryFn: fetchWorkshops,
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-bold">Workshops</h1>
                    <p className="text-muted-foreground">Manage your workshop events</p>
                </div>
                <Link href="/admin/workshops/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Add Workshop
                    </Button>
                </Link>
            </div>

            {/* Content */}
            {isLoading ? (
                <AdminTableSkeleton />
            ) : isError ? (
                <div className="p-4 text-red-500 bg-red-50 rounded-lg">
                    Error loading workshops. Please try again.
                </div>
            ) : (
                <DataTable columns={columns} data={data || []} />
            )}
        </div>
    );
}
