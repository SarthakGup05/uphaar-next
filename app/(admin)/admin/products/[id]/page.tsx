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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import { AdminFormSkeleton } from "@/components/skeletons/admin-skeletons";
import { useQuery } from "@tanstack/react-query";
import { productSchema, type ProductFormValues } from "@/lib/schemas";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();

    // Fetch product data
    const { data: product, isLoading: isFetching } = useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const res = await fetch(`/api/products/${id}`);
            if (!res.ok) throw new Error("Failed to fetch product");
            return res.json();
        },
    });

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            title: "",
            slug: "",
            description: "",
            price: 0,
            stock: 0,
            category: "Resin",
            imageUrl: "",
            heroImageUrl: "",
        },
    });

    // Populate form when data is fetched
    useEffect(() => {
        if (product) {
            form.reset({
                title: product.title,
                slug: product.slug,
                description: product.description,
                category: product.category,
                price: Number(product.price),
                stock: Number(product.stock),
                imageUrl: product.image,
                heroImageUrl: product.heroImage || "",
            });
        }
    }, [product, form]);

    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (values: ProductFormValues) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...values,
                    image: values.imageUrl, // Map imageUrl to image for DB
                    heroImage: values.heroImageUrl || null,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update product");
            }

            toast.success("Product updated successfully");
            router.refresh();
            router.push("/admin/products");
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Failed to update product");
        }
    };

    if (isFetching) {
        return <AdminFormSkeleton />;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold font-serif">Edit Product</h1>
                <p className="text-muted-foreground">Update product details and images.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Basic Info */}
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ocean Breeze Coaster"
                                            maxLength={100}
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                // Optional: Generate slug on title change if slug is untouched?
                                                // For edit, we typically don't auto-update slug to preserve URLs unless requested.
                                                // User can manually edit slug if needed.
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
                    </div>

                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ocean-breeze-coaster" {...field} />
                                    </FormControl>
                                    <FormDescription>URL-friendly name.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Product description..."
                                            className="resize-none min-h-[100px]"
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price (₹)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="499"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="10"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value} // Use value from field, controlled
                                    >
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
                    </div>

                    {/* Images */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Image</FormLabel>
                                        <FormControl>
                                            <ImageUpload
                                                value={field.value}
                                                onChange={field.onChange}
                                                folder="/products"
                                            />
                                        </FormControl>
                                        <FormDescription>Main product image.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="heroImageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hero Image (Optional)</FormLabel>
                                        <FormControl>
                                            <ImageUpload
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                                folder="/products/hero"
                                            />
                                        </FormControl>
                                        <FormDescription>Displayed in large banners.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-4">
                        <Button variant="outline" type="button" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Product
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
