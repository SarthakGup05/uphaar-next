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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CalendarIcon, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import { workshopSchema, type WorkshopFormValues } from "@/lib/schemas";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format, set } from "date-fns";

interface WorkshopFormProps {
  initialData?: WorkshopFormValues & { id: number };
}

export default function WorkshopForm({ initialData }: WorkshopFormProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<WorkshopFormValues>({
    resolver: zodResolver(workshopSchema) as any,
    defaultValues: initialData
      ? {
          ...initialData,
          date: new Date(initialData.date),
          price: Number(initialData.price),
          totalSeats: Number(initialData.totalSeats),
        }
      : {
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

      toast.success(
        initialData ? "Workshop updated successfully" : "Workshop created"
      );
      router.push("/admin/workshops");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const onDelete = async () => {
    if (!initialData) return;
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/workshops/${initialData.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast.success("Workshop deleted");
      router.push("/admin/workshops");
      router.refresh();
    } catch {
      toast.error("Failed to delete workshop");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Form {...form}>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          {initialData ? "Edit Workshop" : "Create Workshop"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage workshop information and logistics
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6"
      >
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Workshop Info */}
          <div className="rounded-xl border bg-white p-6 space-y-6">
            <h2 className="text-lg font-semibold">Workshop Information</h2>

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
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "");
                          form.setValue("slug", slug);
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
                      className="min-h-[150px]"
                      placeholder="Describe the workshop..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Media */}
          <div className="rounded-xl border bg-white p-6 space-y-4">
            <h2 className="text-lg font-semibold">Media</h2>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
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

        {/* RIGHT COLUMN */}
        <div className="space-y-6 lg:sticky lg:top-6 h-fit">
          {/* Schedule */}
          <div className="rounded-xl border bg-white p-6 space-y-4">
            <h2 className="text-lg font-semibold">Schedule</h2>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Date & Time</FormLabel>

                  {/* Date Picker */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(newDate) => {
                          if (!newDate) return;
                          const current = field.value || new Date();
                          field.onChange(
                            set(newDate, {
                              hours: current.getHours(),
                              minutes: current.getMinutes(),
                            })
                          );
                        }}
                        disabled={(date) =>
                          date <
                          new Date(
                            new Date().setHours(0, 0, 0, 0)
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Time Picker – NEXT LINE */}
                  <div className="relative w-full">
                    <Input
                      type="time"
                      value={field.value ? format(field.value, "HH:mm") : ""}
                      onChange={(e) => {
                        const [hours, minutes] =
                          e.target.value.split(":").map(Number);
                        const current = field.value || new Date();
                        field.onChange(
                          set(current, { hours, minutes })
                        );
                      }}
                      className="pl-10"
                    />
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Logistics */}
          <div className="rounded-xl border bg-white p-6 space-y-4">
            <h2 className="text-lg font-semibold">Logistics</h2>

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

          {/* Actions */}
          <div className="rounded-xl border bg-white p-4 space-y-3">
            <Button size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {initialData ? "Update Workshop" : "Create Workshop"}
            </Button>

            {initialData && (
              <Button
                variant="destructive"
                disabled={isDeleting}
                className="w-full"
                onClick={onDelete}
              >
                Delete Workshop
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/admin/workshops")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
