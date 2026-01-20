"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
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
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import { productSchema, type ProductFormValues } from "@/lib/schemas";

export default function AddProductPage() {
    const router = useRouter();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            title: "",
            slug: "",
            description: "",
            price: 0,
            stock: 0,
            category: "Resin", // Default valid category
            imageUrl: "",
            heroImageUrl: "",
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (values: ProductFormValues) => {
        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...values,
                    image: values.imageUrl, // Map for API
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create product");
            }

            toast.success("Product created successfully!");
            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Something went wrong.");
        }
    };

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
                                                <Input
                                                    placeholder="e.g. Ocean Blue Resin Tray"
                                                    maxLength={100}
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        // Auto-generate slug
                                                        const slug = e.target.value
                                                            .toLowerCase()
                                                            .replace(/[^a-z0-9]+/g, '-')
                                                            .replace(/^-+|-+$/g, '');
                                                        form.setValue("slug", slug, { shouldValidate: true });
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Min 15 chars. ({field.value?.length || 0} / 100)
                                            </FormDescription>
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
                                            <FormDescription>URL-friendly name.</FormDescription>
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
                                                    maxLength={2000}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Min 200 chars. ({field.value?.length || 0} / 2000)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Media Card */}
                            <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-6">
                                <h2 className="font-semibold text-lg">Product Images</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="imageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Main Image *</FormLabel>
                                                <FormControl>
                                                    <ImageUpload
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        folder="/products/main"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="heroImageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Hero/Banner Image (Optional)</FormLabel>
                                                <FormControl>
                                                    <ImageUpload
                                                        value={field.value || ""}
                                                        onChange={field.onChange}
                                                        folder="/products/hero"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                                                    <SelectItem value="Resin">Resin</SelectItem>
                                                    <SelectItem value="Candles">Candles</SelectItem>
                                                    <SelectItem value="Concrete Decor">Concrete Decor</SelectItem>
                                                    <SelectItem value="Gift Hampers">Gift Hampers</SelectItem>
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
                                                    <Input type="number" {...field} />
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
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Sticky Actions */}
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