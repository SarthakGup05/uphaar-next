
"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { Loader2, ArrowLeft, Download, CheckCircle, Truck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function OrderDetailsPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();

    const { data: order, isLoading } = useQuery({
        queryKey: ["order", id],
        queryFn: async () => {
            const { data } = await api.get(`/orders/${id}`);
            return data;
        },
    });

    const updateStatus = async (status: string) => {
        try {
            await api.patch(`/orders/${id}`, { status });
            toast.success(`Order marked as ${status}`);
            router.refresh();
            // Since we rely on react-query, we should ideally invalidate queries, but reload works for now or let react-query re-fetch if we use queryClient.
            // A simple way to force re-render is reloading, but let's try just relying on props update or manual re-fetch if we had the handler.
            // For now, simple window reload is robust enough for admin panels.
            window.location.reload();
        } catch (e) {
            console.error(e);
            toast.error("Failed to update status");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
            </div>
        );
    }

    if (!order) {
        return <div className="p-8 text-center">Order not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/orders">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="font-serif text-2xl font-bold">Order #{order.id}</h1>
                    <p className="text-muted-foreground">
                        Placed on {order.createdAt ? format(new Date(order.createdAt), "PPP") : "N/A"}
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Badge className="text-base px-3 py-1">
                        {order.status}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Customer Details */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="font-semibold mb-4">Customer</h3>
                    <div className="space-y-2 text-sm">
                        <p className="font-medium text-base">{order.customerName}</p>
                        <p className="text-muted-foreground">{order.customerPhone}</p>
                        {/* Address would go here if available in the future */}
                    </div>
                </div>

                {/* Status Actions */}
                <div className="col-span-1 md:col-span-2 rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="font-semibold mb-4">Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" className="gap-2" onClick={() => updateStatus("Paid")}>
                            <CheckCircle className="h-4 w-4 text-blue-600" /> Mark Paid
                        </Button>
                        <Button variant="outline" className="gap-2" onClick={() => updateStatus("Shipped")}>
                            <Truck className="h-4 w-4 text-purple-600" /> Mark Shipped
                        </Button>
                        <Button variant="outline" className="gap-2" onClick={() => updateStatus("Delivered")}>
                            <CheckCircle className="h-4 w-4 text-green-600" /> Mark Delivered
                        </Button>
                        <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700" onClick={() => updateStatus("Cancelled")}>
                            <XCircle className="h-4 w-4" /> Cancel Order
                        </Button>
                    </div>
                </div>

                {/* Items Summary (Simple view for now) */}
                <div className="col-span-1 md:col-span-3 rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="font-semibold mb-4">Items Summary</h3>
                    <div className="rounded-md bg-stone-50 p-4 font-mono text-sm whitespace-pre-wrap">
                        {order.itemsSummary || "No items summary provided."}
                    </div>
                    <div className="mt-4 flex justify-end border-t pt-4">
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total Amount</p>
                            <p className="text-2xl font-bold font-serif">₹{parseFloat(order.totalAmount).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
