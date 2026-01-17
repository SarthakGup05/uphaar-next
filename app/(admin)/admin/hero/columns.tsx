"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import api from "@/lib/axios";

// This type definition must match your API response
export type HeroSlide = {
    id: number;
    title: string;
    subtitle: string;
    image: string;
    cta: string;
    align: "left" | "center" | "right";
    isActive: boolean;
    order: number;
};

export const columns: ColumnDef<HeroSlide>[] = [
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            const slide = row.original;
            return (
                <div className="relative h-12 w-20 overflow-hidden rounded-md border border-stone-200">
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover"
                    />
                </div>
            );
        },
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "subtitle",
        header: "Subtitle",
        cell: ({ row }) => <div className="truncate max-w-[200px]">{row.getValue("subtitle")}</div>,
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.getValue("isActive");
            return (
                <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? "Active" : "Inactive"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "order",
        header: "Order",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const slide = row.original;
            const deleteSlide = async () => {
                if (!confirm("Are you sure you want to delete this slide?")) return;
                try {
                    await api.delete(`/hero/${slide.id}`);
                    window.location.reload(); // Simple reload for now
                } catch (e) {
                    alert("Failed to delete slide");
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(slide.title)}
                        >
                            Copy title
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/hero/${slide.id}`} className="w-full cursor-pointer">
                                Edit Slide
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={deleteSlide} className="text-red-600 focus:text-red-600">
                            Delete Slide
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
