"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Validation Schema
const orderFormSchema = z.object({
    customerName: z.string().min(2, { message: "Name is required." }),
    customerPhone: z.string().min(10, { message: "Valid phone number required." }),
    totalAmount: z.coerce.number().min(1, { message: "Amount must be greater than 0." }),
    status: z.string().min(1, { message: "Select a status." }),
    itemsSummary: z.string().optional(), // Just a text summary for the ledger (e.g. "2x Trays")
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export default function NewOrderPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
            customerName: "",
            customerPhone: "",
            totalAmount: 0,
            status: "Pending",
            itemsSummary: "",
        },
    });

    function onSubmit(values: OrderFormValues) {
        setIsSubmitting(true);
        // Simulate API Call
        console.log("Recording Manual Order:", values);
        setTimeout(() => {
            setIsSubmitting(false);
            alert("Order Recorded Successfully!");
            router.push("/admin/orders");
        }, 1000);
    }

    return (
        <div className="max-w-2xl mx-auto pb-20">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/orders">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="font-serif text-2xl font-bold">Record Manual Order</h1>
                    <p className="text-sm text-muted-foreground">Log a sale from WhatsApp.</p>
                </div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Customer Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="customerName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Customer Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Aditi Sharma" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="customerPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>WhatsApp Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+91 98765 43210" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Order Details */}
                        <FormField
                            control={form.control}
                            name="itemsSummary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Items Summary</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 1x Blue Tray, 2x Candles" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="totalAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Amount (₹)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} value={field.value as number} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Pending">Pending Payment</SelectItem>
                                                <SelectItem value="Paid">Paid (Screenshot Recv)</SelectItem>
                                                <SelectItem value="Shipped">Shipped</SelectItem>
                                                <SelectItem value="Delivered">Delivered</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSubmitting ? "Saving..." : "Save to Ledger"}
                            </Button>
                        </div>

                    </form>
                </Form>
            </div>
        </div>
    );
}