"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, Loader2, TicketPercent, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table"; // We'll need to define columns locally or separate file
import { AdminTableSkeleton } from "@/components/skeletons/admin-skeletons";
import api from "@/lib/axios";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Coupon = {
    id: number;
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: string;
    count: number;
    isActive: boolean;
    validUntil: string | null;
    usageLimit: number | null;
    usedCount: number;
};

// Define Columns locally for speed
const columns: ColumnDef<Coupon>[] = [
    {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => <span className="font-mono font-bold text-primary">{row.getValue("code")}</span>,
    },
    {
        accessorKey: "discountValue",
        header: "Discount",
        cell: ({ row }) => {
            const type = row.original.discountType;
            const val = parseFloat(row.getValue("discountValue"));
            return (
                <Badge variant="outline">
                    {type === "PERCENTAGE" ? `${val}% OFF` : `₹${val} OFF`}
                </Badge>
            )
        },
    },
    {
        accessorKey: "validUntil",
        header: "Expires",
        cell: ({ row }) => {
            const date = row.original.validUntil;
            return date ? format(new Date(date), "MMM d, yyyy") : "Never";
        }
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
            return row.original.isActive ?
                <Badge className="bg-green-600">Active</Badge> :
                <Badge variant="destructive">Inactive</Badge>
        }
    },
    {
        accessorKey: "usage",
        header: "Usage",
        cell: ({ row }) => {
            const limit = row.original.usageLimit;
            const used = row.original.usedCount || 0;
            return <span className="text-muted-foreground">{used} {limit ? `/ ${limit}` : ''}</span>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <CouponActions coupon={row.original} />
    }
];

function CouponActions({ coupon }: { coupon: Coupon }) {
    const [open, setOpen] = useState(false);

    const deleteCoupon = async () => {
        try {
            await api.delete(`/admin/coupons/${coupon.id}`);
            toast.success("Coupon deleted");
            window.location.reload();
        } catch (e) {
            toast.error("Failed to delete");
        }
    }

    return (
        <div className="flex gap-2">
            <Link href={`/admin/coupons/${coupon.id}`}>
                <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
            </Link>
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => setOpen(true)}>
                <Trash2 className="h-4 w-4" />
            </Button>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Coupon?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteCoupon} className="bg-red-600">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

const fetchCoupons = async () => {
    const { data } = await api.get("/admin/coupons");
    return data;
};

export default function AdminCouponsPage() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["coupons"],
        queryFn: fetchCoupons,
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-bold">Coupons</h1>
                    <p className="text-muted-foreground">Manage discounts and offers</p>
                </div>
                <Link href="/admin/coupons/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Create Coupon
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <AdminTableSkeleton />
            ) : isError ? (
                <div className="p-4 text-red-500 bg-red-50 rounded-lg">Error loading coupons.</div>
            ) : (
                <DataTable columns={columns} data={data || []} />
            )}
        </div>
    );
}
