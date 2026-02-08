
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CellAction } from "./cell-action";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import imageKitLoader from "@/lib/imagekit-loader";

// This type matches the schema we defined
export type Workshop = {
    id: number;
    title: string;
    slug: string;
    date: Date | string;
    price: number; // numeric in DB comes as string sometimes, but we cast it or use number in type if handled
    seatsFilled: number;
    totalSeats: number;
    image: string;
};

export const columns: ColumnDef<Workshop>[] = [
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            const image = row.getValue("image") as string;
            return (
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-stone-100">
                    <Image
                        src={image}
                        alt={row.getValue("title")}
                        fill
                        loader={imageKitLoader}
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
        cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("date"));
            return <div>{format(date, "MMM d, yyyy")}</div>;
        },
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"));
            return <div className="font-medium">₹{price.toLocaleString()}</div>;
        },
    },
    {
        accessorKey: "capacity",
        header: "Capacity",
        cell: ({ row }) => {
            const filled = row.original.seatsFilled;
            const total = row.original.totalSeats;
            return (
                <div className="text-sm">
                    {filled} / {total}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
