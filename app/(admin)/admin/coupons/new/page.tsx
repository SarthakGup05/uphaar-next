"use client";

import { CouponForm } from "../_components/coupon-form";

export default function NewCouponPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-3xl font-bold">New Coupon</h1>
                <p className="text-muted-foreground">Create a new discount code</p>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <CouponForm />
            </div>
        </div>
    );
}
