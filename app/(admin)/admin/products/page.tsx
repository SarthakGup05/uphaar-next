"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table"; // We just created this
import { columns, Product } from "./column"; // We just created this

// 1. Fetch Function (Simulating an API call)
import api from "@/lib/axios";

// 1. Fetch Function (Real API call)
const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await api.get("/products");
  return data;
};

export default function AdminProductsPage() {
  // 2. React Query Hook
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your store inventory</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-stone-200 bg-white">
          <div className="flex flex-col items-center gap-2 text-stone-500">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading products...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="p-4 text-red-500 bg-red-50 rounded-lg">
          Error loading products. Please try again.
        </div>
      ) : (
        // 3. Render the Data Table
        <DataTable columns={columns} data={data || []} />
      )}
    </div>
  );
}