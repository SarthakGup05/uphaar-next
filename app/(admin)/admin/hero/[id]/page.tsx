
"use client";

import { useHeroStore } from "@/lib/store/hero-store";
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
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditHeroPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { formData, isLoading, isUploading, setField, setFormData, setLoading, resetForm } = useHeroStore();

    // Fetch slide data
    const { data: slide, isLoading: isFetching } = useQuery({
        queryKey: ["hero-slide", id],
        queryFn: async () => {
            const res = await fetch(`/api/hero/${id}`);
            if (!res.ok) throw new Error("Failed to fetch slide");
            return res.json();
        },
    });

    // Populate store
    useEffect(() => {
        if (slide) {
            setFormData({
                title: slide.title,
                subtitle: slide.subtitle || "",
                image: slide.image,
                cta: slide.cta || "Shop Now",
                align: slide.align || "center",
                order: slide.order || 0,
                isActive: slide.isActive,
            });
        }
    }, [slide, setFormData]);

    useEffect(() => {
        return () => resetForm();
    }, [resetForm]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.image || !formData.cta) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/hero/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to update slide");
            }

            toast.success("Slide updated successfully");
            router.refresh();
            router.push("/admin/hero");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update slide");
        } finally {
            setLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!slide && !isFetching) {
        return <div>Slide not found</div>;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold font-serif">Edit Slide</h1>
                <p className="text-muted-foreground">Update hero slide details.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                        placeholder="Resin Artistry"
                        value={formData.title}
                        onChange={(e) => setField("title", e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Textarea
                        placeholder="Capture the ocean's depth..."
                        className="resize-none"
                        value={formData.subtitle}
                        onChange={(e) => setField("subtitle", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Image</Label>
                    <ImageUpload
                        value={formData.image}
                        onChange={(url) => setField("image", url)}
                        folder="/hero"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Button Text</Label>
                        <Input
                            placeholder="Shop Now"
                            value={formData.cta}
                            onChange={(e) => setField("cta", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Text Alignment</Label>
                        <Select
                            value={formData.align}
                            onValueChange={(val) => setField("align", val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select alignment" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="left">Left</SelectItem>
                                <SelectItem value="center">Center</SelectItem>
                                <SelectItem value="right">Right</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">Active Status</Label>
                        <p className="text-sm text-muted-foreground">
                            Show this slide on the homepage
                        </p>
                    </div>
                    <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setField("isActive", checked)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Display Order</Label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={formData.order}
                        onChange={(e) => setField("order", Number(e.target.value))}
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" type="button" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading || isUploading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Slide
                    </Button>
                </div>
            </form>
        </div>
    );
}
