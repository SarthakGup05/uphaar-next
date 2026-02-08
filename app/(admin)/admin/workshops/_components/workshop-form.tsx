
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
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import { workshopSchema, type WorkshopFormValues } from "@/lib/schemas";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface WorkshopFormProps {
    initialData?: WorkshopFormValues & { id: number };
}

export default function WorkshopForm({ initialData }: WorkshopFormProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const form = useForm<WorkshopFormValues>({
        resolver: zodResolver(workshopSchema) as any,
        defaultValues: initialData ? {
            ...initialData,
            date: new Date(initialData.date), // Ensure Date object
            price: Number(initialData.price),
            totalSeats: Number(initialData.totalSeats),
        } : {
            title: "",
            slug: "",
            description: "",
            date: new Date(),
            location: "",
            price: 0,
            totalSeats: 20,
            image: "",
            images: [],
            instructor: "",
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (values: WorkshopFormValues) => {
        try {
            const url = initialData
                ? `/api/workshops/${initialData.id}`
                : "/api/workshops";
            const method = initialData ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to save workshop");
            }

            toast.success(initialData ? "Workshop updated!" : "Workshop created!");
            router.push("/admin/workshops");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Something went wrong.");
        }
    };

    const onDelete = async () => {
        if (!initialData) return;
        try {
            setIsDeleting(true);
            const response = await fetch(`/api/workshops/${initialData.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete");
            }

            toast.success("Workshop deleted");
            router.push("/admin/workshops");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong with deletion");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-6">
                            <h2 className="font-semibold text-lg">Workshop Details</h2>

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Resin Art Workshop"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    if (!initialData) {
                                                        const slug = e.target.value
                                                            .toLowerCase()
                                                            .replace(/[^a-z0-9]+/g, '-')
                                                            .replace(/^-+|-+$/g, '');
                                                        form.setValue("slug", slug, { shouldValidate: true });
                                                    }
                                                }}
                                            />
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
                                            <Input placeholder="resin-art-workshop" {...field} />
                                        </FormControl>
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
                                                placeholder="Workshop details..."
                                                className="min-h-[150px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-6">
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Main Image</FormLabel>
                                        <FormControl>
                                            <ImageUpload
                                                value={field.value}
                                                onChange={field.onChange}
                                                folder="/workshops"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Settings */}
                    <div className="space-y-8">
                        <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-6">
                            <h2 className="font-semibold text-lg">Logistics</h2>

                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date()
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Studio A, Delhi" {...field} />
                                        </FormControl>
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
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="totalSeats"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Seats</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="instructor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Instructor (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jane Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSubmitting ? "Saving..." : initialData ? "Update Workshop" : "Create Workshop"}
                            </Button>

                            {initialData && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="w-full"
                                    disabled={isDeleting}
                                    onClick={onDelete}
                                >
                                    {isDeleting ? "Deleting..." : "Delete Workshop"}
                                </Button>
                            )}

                            <Button variant="outline" type="button" className="w-full" onClick={() => router.push("/admin/workshops")}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
