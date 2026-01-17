"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye, CheckCircle, Truck, Trash2 } from "lucide-react"; // Import Trash2
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator, // Import Separator
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";

// ... (Keep Order type and getStatusColor helper exactly the same)
export type Order = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: "Pending" | "Paid" | "Shipped" | "Delivered" | "Cancelled";
  items: number;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Paid": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "Shipped": return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "Delivered": return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Cancelled": return "bg-red-100 text-red-800 hover:bg-red-100";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const columns: ColumnDef<Order>[] = [
  // ... (Keep existing columns: id, customer, date, status, total)
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => <span className="font-mono text-xs font-medium">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={`${getStatusColor(status)} border-none shadow-none`}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "total",
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
      return <div className="text-right font-medium">₹{amount.toLocaleString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <OrderActions order={row.original} />,
  },
];

function OrderActions({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateStatus = async (status: string) => {
    try {
      await api.patch(`/orders/${order.id.replace("ORD-#", "")}`, { status });
      toast.success(`Order status updated to ${status}`);
      window.location.reload();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status");
    }
  };

  const deleteOrder = async () => {
    setIsLoading(true);
    try {
      await api.delete(`/orders/${order.id.replace("ORD-#", "")}`);
      toast.success("Order deleted successfully");
      window.location.reload();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete order");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete order {order.id} and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                deleteOrder();
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => {
            navigator.clipboard.writeText(order.id);
            toast.success("Order ID copied");
          }}>
            Copy Order ID
          </DropdownMenuItem>

          {/* Link to Detail Page */}
          <DropdownMenuItem asChild>
            <Link href={`/admin/orders/${order.id.replace("ORD-#", "")}`} className="w-full cursor-pointer">
              <Eye className="mr-2 h-4 w-4" /> View Details
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-blue-600 focus:text-blue-600 cursor-pointer" onClick={() => updateStatus("Paid")}>
            <CheckCircle className="mr-2 h-4 w-4" /> Mark Paid
          </DropdownMenuItem>
          <DropdownMenuItem className="text-purple-600 focus:text-purple-600 cursor-pointer" onClick={() => updateStatus("Shipped")}>
            <Truck className="mr-2 h-4 w-4" /> Mark Shipped
          </DropdownMenuItem>
          <DropdownMenuItem className="text-green-600 focus:text-green-600 cursor-pointer" onClick={() => updateStatus("Delivered")}>
            <CheckCircle className="mr-2 h-4 w-4" /> Mark Delivered
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-500 focus:text-red-500 cursor-pointer" onClick={() => updateStatus("Cancelled")}>
            <CheckCircle className="mr-2 h-4 w-4" /> Mark Cancelled
          </DropdownMenuItem> {/* Added Cancelled Option */}

          <DropdownMenuSeparator />

          {/* DELETE ACTION */}
          <DropdownMenuItem
            onSelect={() => setOpen(true)}
            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}