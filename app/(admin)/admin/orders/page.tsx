"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { columns, Order } from "./columns";
import { AdminTableSkeleton } from "@/components/skeletons/admin-skeletons";
import Link from "next/link";

import api from "@/lib/axios";
import { format } from "date-fns";

// 1. Fetch Function (Real API call)
const fetchOrders = async (): Promise<Order[]> => {
    const { data } = await api.get("/orders");

    // Map DB response to UI model
    return data.map((order: any) => ({
        id: `ORD-#${order.id}`,
        customer: order.customerName,
        date: order.createdAt ? format(new Date(order.createdAt), "yyyy-MM-dd") : "N/A",
        total: parseFloat(order.totalAmount),
        status: order.status,
        items: 1, // Simplified as DB stores summary string, not count
    }));
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
                    <Button variant="outline" className="gap-2" onClick={() => {
                        if (!data) return;
                        const csvContent = "data:text/csv;charset=utf-8,"
                            + "ID,Customer,Date,Status,Total\n"
                            + data.map(o => `${o.id},"${o.customer}",${o.date},${o.status},${o.total}`).join("\n");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", "orders.csv");
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }}>
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
                <AdminTableSkeleton />
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