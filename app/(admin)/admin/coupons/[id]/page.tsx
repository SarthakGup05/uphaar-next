"use client";

import { useQuery } from "@tanstack/react-query";
import { CouponForm } from "../_components/coupon-form";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";
import { use } from "react";

const getCoupon = async (id: string) => {
    const { data } = await api.get(`/admin/coupons/${id}`);
    return data;
};

export default function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const { data, isLoading } = useQuery({
        queryKey: ["coupon", id],
        queryFn: () => getCoupon(id),
    });

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-3xl font-bold">Edit Coupon</h1>
                <p className="text-muted-foreground">Modify coupon details</p>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <CouponForm initialData={data} />
            </div>
        </div>
    );
}
