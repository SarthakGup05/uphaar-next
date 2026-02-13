
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AddToCartButtonProps {
    workshop: {
        id: number;
        title: string;
        slug: string;
        price: number | string;
        image: string;
    };
    isSoldOut: boolean;
}

export default function AddToCartButton({ workshop, isSoldOut }: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem);
    const [isPending, startTransition] = React.useTransition();

    const handleBook = () => {
        startTransition(() => {
            addItem({
                id: workshop.slug, // Using slug as ID to avoid collision with product numeric IDs if possible, or just consistency
                title: workshop.title,
                price: Number(workshop.price),
                image: workshop.image,
                quantity: 1,
                slug: workshop.slug,
            });
            toast.success("Workshop added to cart!");
        });
    };

    return (
        <Button
            onClick={handleBook}
            disabled={isSoldOut || isPending}
            className="w-full h-12 text-lg font-medium"
            size="lg"
        >
            {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : isSoldOut ? (
                "Join Waitlist"
            ) : (
                "Book Now"
            )}
        </Button>
    );
}
