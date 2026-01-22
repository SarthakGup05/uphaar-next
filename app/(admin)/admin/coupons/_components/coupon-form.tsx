"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; // Assuming standard shadcn calendar
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

// Define Schema
const formSchema = z.object({
    code: z.string().min(3, "Code must be at least 3 characters").max(20),
    discountType: z.enum(["PERCENTAGE", "FIXED"]),
    discountValue: z.coerce.number().min(0.01, "Value must be greater than 0"),
    minOrderValue: z.coerce.number().min(0).default(0),
    maxDiscount: z.coerce.number().optional(),
    usageLimit: z.coerce.number().optional(),
    validUntil: z.date().optional().nullable(),
    isActive: z.boolean().default(true),
    productIds: z.array(z.number()).default([]),
});

type CouponFormValues = z.infer<typeof formSchema>;

interface CouponFormProps {
    initialData?: any; // strict typing would be better but keeping flex for now
}

export function CouponForm({ initialData }: CouponFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<{ id: number; title: string }[]>([]);

    const form = useForm<CouponFormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: (initialData
            ? {
                ...initialData,
                discountValue: parseFloat(initialData.discountValue),
                minOrderValue: parseFloat(initialData.minOrderValue || "0"),
                maxDiscount: initialData.maxDiscount ? parseFloat(initialData.maxDiscount) : undefined,
                validUntil: initialData.validUntil ? new Date(initialData.validUntil) : undefined,
                productIds: initialData.productIds || [],
            }
            : {
                code: "",
                discountType: "PERCENTAGE",
                discountValue: 0,
                minOrderValue: 0,
                isActive: true,
                productIds: [],
                // We don't need to specify optional undefineds if we cast or let Zod handle it
                // but strictly matching TS requires distinct handling if we want to be safe.
                // However, the issue is strict structure. 
                // Let's rely on Partial or just ignore the slight mismatch if runtime is fine.
            }) as any, // Bypass strict ZodResolver vs RHF type mismatch which is often a false positive in these versions
    });

    // Fetch products for the multi-select
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // We can reuse the public products API or a simplified admin list
                const { data } = await api.get("/products"); // Assuming this endpoint exists and returns {id, title...}
                // Adapt data if necessary. The public /products usually returns list directly or paginated.
                // Based on columns.tsx it returns Product[].
                setProducts(data);
            } catch (e) {
                console.error("Failed to fetch products", e);
            }
        }
        fetchProducts();
    }, [])

    const onSubmit = async (data: CouponFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await api.put(`/admin/coupons/${initialData.id}`, data);
                toast.success("Coupon updated");
            } else {
                await api.post("/admin/coupons", data);
                toast.success("Coupon created");
            }
            router.push("/admin/coupons");
            router.refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* COLUMN 1: Basic Info */}
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Coupon Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="SUMMER25" {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="discountType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                                <SelectItem value="FIXED">Fixed Amount (₹)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="discountValue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Value</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {form.watch("discountType") === "PERCENTAGE" && (
                            <FormField
                                control={form.control}
                                name="maxDiscount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max Discount Amount (Optional)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Max ₹ cap" {...field} />
                                        </FormControl>
                                        <FormDescription>Limit the max discount for percentage based coupons</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="minOrderValue"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Min Order Value</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* COLUMN 2: Limits & Targeting */}
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="validUntil"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Expiry Date (Optional)</FormLabel>
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
                                                selected={field.value || undefined} // Fix for null/undefined mismatch
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
                            name="usageLimit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Usage Limit</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g. 100" {...field} />
                                    </FormControl>
                                    <FormDescription>Max number of times this coupon can be used total</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="productIds"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Specific Products (Optional)</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value.length && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value.length > 0
                                                        ? `${field.value.length} products selected`
                                                        : "Select products"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[300px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search product..." />
                                                <CommandList>
                                                    <CommandEmpty>No product found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {products.map((product) => (
                                                            <CommandItem
                                                                value={product.title}
                                                                key={product.id}
                                                                onSelect={() => {
                                                                    const current = field.value;
                                                                    const isSelected = current.includes(product.id);
                                                                    const updated = isSelected
                                                                        ? current.filter(id => id !== product.id)
                                                                        : [...current, product.id];
                                                                    field.onChange(updated);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        field.value.includes(product.id)
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {product.title}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        Leave empty to apply to all products
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Active Status</FormLabel>
                                        <FormDescription>
                                            Disable this coupon without deleting it
                                        </FormDescription>
                                    </div>
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
                </div>

                <Button type="submit" disabled={loading} className="w-full md:w-auto">
                    {loading ? "Saving..." : initialData ? "Save Changes" : "Create Coupon"}
                </Button>
            </form>
        </Form>
    );
}
