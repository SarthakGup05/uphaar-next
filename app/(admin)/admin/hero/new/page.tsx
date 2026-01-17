"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

// 1. Define Schema
const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    subtitle: z.string().optional(),
    image: z.string().url("Must be a valid URL"),
    cta: z.string().min(2, "CTA text is required"),
    align: z.enum(["left", "center", "right"]),
    // z.coerce allows the input to be a string (from HTML), but transforms it to a number
    order: z.coerce.number().min(0, "Order must be 0 or greater"),
    isActive: z.boolean().default(true),
});

// 2. Define Type for the Submit Handler only
type FormValues = z.infer<typeof formSchema>;

export default function NewSlidePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // 3. FIXED: Remove "<FormValues>" from here. 
    // Let useForm infer the complex types directly from the resolver.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            subtitle: "",
            image: "",
            cta: "Shop Now",
            align: "center",
            order: 0,
            isActive: true,
        },
    });

    // 4. Use the type here for safety
    async function onSubmit(values: FormValues) {
        setLoading(true);
        try {
            await api.post("/hero", values);
            router.refresh();
            router.push("/admin/hero");
        } catch (error) {
            console.error(error);
            alert("Failed to create slide");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold font-serif">Add New Slide</h1>
                <p className="text-muted-foreground">Create a new slide for the homepage hero section.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Resin Artistry" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="cta"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Button Text</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Shop Now" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="align"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Text Alignment</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                        value={field.value as string | number}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" type="button" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Slide
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}