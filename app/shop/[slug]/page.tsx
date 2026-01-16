import ProductDetails from "@/components/shop/ProductDetails";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <ProductDetails slug={slug} />;
}