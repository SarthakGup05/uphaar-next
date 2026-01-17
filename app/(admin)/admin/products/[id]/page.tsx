
"use client";

import { useProductStore } from "@/lib/store/product-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useEffect, use } from "react";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import { AdminFormSkeleton } from "@/components/skeletons/admin-skeletons";
import { useQuery } from "@tanstack/react-query";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { formData, isLoading, isUploading, setField, setFormData, setLoading, resetForm } = useProductStore();

    // Fetch product data
    const { data: product, isLoading: isFetching } = useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const res = await fetch(`/api/products/${id}`);
            if (!res.ok) throw new Error("Failed to fetch product");
            return res.json();
        },
    });

    // Populate store when data is fetched
    useEffect(() => {
        if (product) {
            setFormData({
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
    }, [product, setFormData]);

    // Cleanup store on unmount
    useEffect(() => {
        return () => resetForm();
    }, [resetForm]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.title || !formData.slug || !formData.imageUrl) {
            toast.error("Please fill in all required fields and upload an image.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    image: formData.imageUrl, // Map imageUrl to image for DB
                    heroImage: formData.heroImageUrl || null,
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
            toast.error("Failed to update product");
        } finally {
            setLoading(false);
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

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Basic Info */}
                <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                        placeholder="Ocean Breeze Coaster"
                        value={formData.title}
                        onChange={(e) => {
                            setField("title", e.target.value);
                            // Auto-generate slug from title if slug is empty or matches old slug (optional, skipped for now to avoid complexity)
                        }}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input
                        placeholder="ocean-breeze-coaster"
                        value={formData.slug}
                        onChange={(e) => setField("slug", e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        placeholder="Product description..."
                        className="resize-none min-h-[100px]"
                        value={formData.description}
                        onChange={(e) => setField("description", e.target.value)}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Price (₹)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="499"
                            value={formData.price}
                            onChange={(e) => setField("price", parseFloat(e.target.value) || 0)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Stock</Label>
                        <Input
                            type="number"
                            placeholder="10"
                            value={formData.stock}
                            onChange={(e) => setField("stock", parseInt(e.target.value) || 0)}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                        value={formData.category}
                        onValueChange={(val) => setField("category", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Resin">Resin</SelectItem>
                            <SelectItem value="Candles">Candles</SelectItem>
                            <SelectItem value="Decor">Decor</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Product Image</Label>
                        <ImageUpload
                            value={formData.imageUrl}
                            onChange={(url) => setField("imageUrl", url)}
                            folder="/products"
                        />
                        <p className="text-xs text-muted-foreground">Main product image.</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Hero Image (Optional)</Label>
                        <ImageUpload
                            value={formData.heroImageUrl || ""}
                            onChange={(url) => setField("heroImageUrl", url)}
                            folder="/products/hero"
                        />
                        <p className="text-xs text-muted-foreground">Displayed in large banners.</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-4">
                    <Button variant="outline" type="button" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading || isUploading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Product
                    </Button>
                </div>
            </form>
        </div>
    );
}
