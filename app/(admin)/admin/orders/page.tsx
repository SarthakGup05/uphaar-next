"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { columns, Order } from "./columns";
import Link from "next/link";

// 1. Fetch Function (Mocking your manual ledger)
const fetchOrders = async (): Promise<Order[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

    return [
        {
            id: "ORD-001",
            customer: "Aditi Sharma",
            date: "2024-03-10",
            total: 2450,
            status: "Pending", // Just received WhatsApp msg
            items: 3,
        },
        {
            id: "ORD-002",
            customer: "Rahul Verma",
            date: "2024-03-09",
            total: 850,
            status: "Paid", // Sent screenshot
            items: 1,
        },
        {
            id: "ORD-003",
            customer: "Priya Singh",
            date: "2024-03-08",
            total: 4200,
            status: "Shipped", // Courier booked
            items: 5,
        },
        {
            id: "ORD-004",
            customer: "Amit Patel",
            date: "2024-03-08",
            total: 1200,
            status: "Delivered",
            items: 1,
        },
        {
            id: "ORD-005",
            customer: "Sneha Gupta",
            date: "2024-03-05",
            total: 0,
            status: "Cancelled",
            items: 0,
        },
    ];
};

export default function AdminOrdersPage() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["orders"],
        queryFn: fetchOrders,
    });

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-bold">Orders</h1>
                    <p className="text-muted-foreground">Track WhatsApp orders and payments manually.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" /> Export CSV
                    </Button>
                    {/* Opens a manual entry form (Future Feature) */}
                    <Link href="/admin/orders/new">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Record New Order
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex h-64 items-center justify-center rounded-lg border border-stone-200 bg-white">
                    <div className="flex flex-col items-center gap-2 text-stone-500">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p>Loading ledger...</p>
                    </div>
                </div>
            ) : isError ? (
                <div className="p-4 text-red-500 bg-red-50 rounded-lg">
                    Error loading orders.
                </div>
            ) : (
                <DataTable columns={columns} data={data || []} />
            )}
        </div>
    );
}