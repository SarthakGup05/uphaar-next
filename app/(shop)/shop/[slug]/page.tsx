import ProductDetails from "@/components/shop/ProductDetails";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const result = await db
        .select()
        .from(products)
        .where(eq(products.slug, slug))
        .limit(1);

    const product = result[0];

    if (!product) {
        return notFound();
    }

    // Transform DB product to Component Product
    const transformedProduct = {
        ...product,
        id: product.id,
        // Convert decimal string to number
        price: Number(product.price),
        // Create array from single image
        images: [product.image],
        // Default values for missing fields
        rating: 4.5,
        reviews: 0,
        // Ensure other fields match
        title: product.title,
        slug: product.slug,
        description: product.description,
        category: product.category,
        stock: product.stock,
    };

    return <ProductDetails product={transformedProduct} />;
}