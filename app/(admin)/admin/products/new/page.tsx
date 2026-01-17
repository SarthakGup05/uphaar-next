"use client";

import { useProductStore } from "@/lib/store/product-store"; // Import Zustand store
import { Button } from "@/components/ui/button";
import {
    Label
} from "@/components/ui/label";
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
import { ImageUpload } from "@/components/admin/image-upload"; // Import new component
import { useEffect } from "react";
import { toast } from "sonner"; // Assuming sonner is installed/used for toasts

export default function AddProductPage() {
    const router = useRouter();
    // Destructure store state and actions
    const { formData, isLoading, isUploading, setField, setLoading, resetForm } = useProductStore();

    // Reset form on mount
    useEffect(() => {
        resetForm();
    }, [resetForm]);

    // Handle Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.title || !formData.slug || !formData.imageUrl) {
            toast.error("Please fill in all required fields and upload an image.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    image: formData.imageUrl, // Map imageUrl to image for DB
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create product");
            }

            toast.success("Product created successfully!");
            router.push("/admin/products");
            router.refresh(); // Refresh Next.js cache
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
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

            <form onSubmit={handleSubmit} className="space-y-8">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Details Card */}
                        <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-6">
                            <div className="space-y-1">
                                <h2 className="font-semibold text-lg">Product Details</h2>
                                <p className="text-sm text-muted-foreground">Title, description and URL settings.</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Product Title</Label>
                                <Input
                                    placeholder="e.g. Ocean Blue Resin Tray"
                                    value={formData.title}
                                    onChange={(e) => setField('title', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Slug</Label>
                                <Input
                                    placeholder="ocean-blue-resin-tray"
                                    value={formData.slug}
                                    onChange={(e) => setField('slug', e.target.value)}
                                    required
                                />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    The URL-friendly version of the name.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="Describe the product details, materials used, etc."
                                    className="min-h-[150px]"
                                    value={formData.description}
                                    onChange={(e) => setField('description', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Media Card */}
                        <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-6">
                            <h2 className="font-semibold text-lg">Product Images</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Main Image *</Label>
                                    <ImageUpload
                                        value={formData.imageUrl}
                                        onChange={(url) => setField("imageUrl", url)} // Mapped to 'image' in DB eventually
                                        folder="/products/main"
                                    />
                                    {/* Sync to 'image' field expected by DB schema */}
                                    {/* Actually schema expects 'image'. Store has 'imageUrl'. 
                                        We need to make sure we send 'image': formData.imageUrl 
                                        Need to fix store to match schema or map it in submit. 
                                        Let's update store to match schema 'image' or map it. 
                                        Plan: Store uses 'imageUrl', submit maps to 'image'. 
                                        Wait, checking previous step... Schema has 'image'. API expects 'image'.
                                        Store has 'imageUrl'. 
                                        I will map in submit, but wait... 
                                        The previous API edit expected body.image. 
                                        I am sending JSON.stringify(formData). 
                                        So formData MUST have 'image' property OR I construct body manually.
                                        I will update setField calls to map correctly? 
                                        Actually, better to rename store key to 'image' to match schema? 
                                        Too late for store file, I'll just map in `handleSubmit` or use `setField('image'...)` if I change the mapped key. 
                                        Let's assume I fix the mapping in handleSubmit.
                                     */}
                                </div>

                                <div className="space-y-2">
                                    <Label>Hero/Banner Image (Optional)</Label>
                                    <ImageUpload
                                        value={formData.heroImageUrl}
                                        onChange={(url) => setField("heroImageUrl", url)}
                                        folder="/products/hero"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Settings */}
                    <div className="space-y-8">
                        <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-6">
                            <h2 className="font-semibold text-lg">Status & Inventory</h2>

                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(val) => setField('category', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Resin">Resin Art</SelectItem>
                                        <SelectItem value="Candles">Candles</SelectItem>
                                        <SelectItem value="Concrete">Concrete</SelectItem>
                                        <SelectItem value="Gifts">Gift Hampers</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Price (₹)</Label>
                                    <Input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setField('price', Number(e.target.value))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Stock</Label>
                                    <Input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setField('stock', Number(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sticky Actions */}
                        <div className="flex flex-col gap-3">
                            <Button type="submit" size="lg" disabled={isLoading || isUploading} className="w-full">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLoading ? "Saving..." : "Create Product"}
                            </Button>
                            <Link href="/admin/products" className="w-full">
                                <Button variant="outline" type="button" className="w-full">Discard</Button>
                            </Link>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}