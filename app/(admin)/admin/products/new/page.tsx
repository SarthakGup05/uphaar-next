"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

// 1. Define the Validation Schema
const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    slug: z.string().min(2, {
        message: "Slug is required for the URL.",
    }).regex(/^[a-z0-9-]+$/, {
        message: "Slug must contain only lowercase letters, numbers, and dashes.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    // z.coerce handles string "100" -> number 100 conversion automatically
    price: z.coerce.number().min(1, {
        message: "Price must be greater than 0.",
    }),
    stock: z.coerce.number().min(0, {
        message: "Stock cannot be negative.",
    }),
    // Fixed: using .min(1) instead of required_error to prevent type conflicts
    category: z.string().min(1, {
        message: "Please select a category.",
    }),
    imageUrl: z.string().optional(),
});

// Infer the type for use in onSubmit
type ProductFormValues = z.infer<typeof formSchema>;

export default function AddProductPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 2. Define the Form
    // FIX: Removed <z.infer<typeof formSchema>> generic to allow resolver to handle type inference
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            slug: "",
            description: "",
            price: 0,
            stock: 0,
            category: "", // Default empty string for Select
        },
    });

    // 3. Handle Submission
    function onSubmit(values: ProductFormValues) {
        setIsSubmitting(true);

        // Simulate API Call
        console.log("Submitting:", values);

        setTimeout(() => {
            setIsSubmitting(false);
            alert("Product Created Successfully!");
            router.push("/admin/products");
        }, 1000);
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="font-serif text-2xl font-bold">Add New Product</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN: Main Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Basic Details Card */}
                            <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-6">
                                <div className="space-y-1">
                                    <h2 className="font-semibold text-lg">Product Details</h2>
                                    <p className="text-sm text-muted-foreground">Title, description and URL settings.</p>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Ocean Blue Resin Tray" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input placeholder="ocean-blue-resin-tray" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                The URL-friendly version of the name.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe the product details, materials used, etc."
                                                    className="min-h-[150px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Media Card */}
                            <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-6">
                                <h2 className="font-semibold text-lg">Product Images</h2>
                                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-200 bg-stone-50 py-12 hover:bg-stone-100 transition-colors cursor-pointer">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm mb-4">
                                        <UploadCloud className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium text-sm">Click to upload image</p>
                                        <p className="mt-1 text-xs text-muted-foreground">SVG, PNG, JPG (max 800x800px)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Settings */}
                        <div className="space-y-8">
                            <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-6">
                                <h2 className="font-semibold text-lg">Status & Inventory</h2>

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Resin">Resin Art</SelectItem>
                                                    <SelectItem value="Candles">Candles</SelectItem>
                                                    <SelectItem value="Concrete">Concrete</SelectItem>
                                                    <SelectItem value="Gifts">Gift Hampers</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price (₹)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} value={field.value as number} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="stock"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Stock</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} value={field.value as number} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Sticky Actions on Mobile, static on Desktop */}
                            <div className="flex flex-col gap-3">
                                <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isSubmitting ? "Saving..." : "Create Product"}
                                </Button>
                                <Link href="/admin/products" className="w-full">
                                    <Button variant="outline" type="button" className="w-full">Discard</Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                </form>
            </Form>
        </div>
    );
}