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
import { Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { heroSlideSchema, type HeroSlideFormValues } from "@/lib/schemas";

export default function NewSlidePage() {
    const router = useRouter();

    const form = useForm<HeroSlideFormValues>({
        resolver: zodResolver(heroSlideSchema) as any,
        defaultValues: {
            title: "",
            subtitle: "",
            image: "",
            cta: "",
            link: "/shop",
            align: "left",
            order: 0,
            isActive: true,
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (values: HeroSlideFormValues) => {
        try {
            const response = await fetch("/api/hero", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create slide");
            }

            toast.success("Slide created successfully");
            router.refresh();
            router.push("/admin/hero");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create slide");
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold font-serif">Add New Slide</h1>
                <p className="text-muted-foreground">Create a new slide for the homepage hero section.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Resin Artistry"
                                            maxLength={60}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {field.value?.length || 0} / 60
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="subtitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subtitle</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Capture the ocean's depth..."
                                            className="resize-none"
                                            maxLength={160}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {field.value?.length || 0} / 160
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                            folder="/hero"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="cta"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Button Text</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Shop Now"
                                                maxLength={30}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            {field.value?.length || 0} / 30
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="align"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Text Alignment</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select alignment" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="left">Left</SelectItem>
                                                <SelectItem value="center">Center</SelectItem>
                                                <SelectItem value="right">Right</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Active Status</FormLabel>
                            <p className="text-sm text-muted-foreground">
                                Show this slide on the homepage
                            </p>
                        </div>
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="order"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Display Order</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" type="button" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Slide
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}