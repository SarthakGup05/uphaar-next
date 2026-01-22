import ProductDetails from "@/components/shop/ProductDetails";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    const product = result[0];

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: `${product.title} | Uphaar`,
        description: product.description.substring(0, 160),
        openGraph: {
            title: product.title,
            description: product.description.substring(0, 160),
            images: [product.image],
            type: 'website',
        },
    };
}

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

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        image: product.image,
        description: product.description,
        sku: product.id.toString(),
        category: product.category,
        offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: Number(product.price),
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetails product={transformedProduct} />
        </>
    );
}