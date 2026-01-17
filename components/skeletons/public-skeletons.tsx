
import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
    return (
        <div className="w-full h-[60vh] md:h-[80vh] relative overflow-hidden bg-stone-100">
            {/* Text Content Placeholder */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 p-6">
                <Skeleton className="h-4 w-[150px] bg-stone-200" />
                <Skeleton className="h-12 w-[300px] md:w-[600px] bg-stone-200" />
                <Skeleton className="h-6 w-[200px] md:w-[400px] bg-stone-200" />
                <Skeleton className="h-10 w-[140px] rounded-full bg-stone-200 mt-4" />
            </div>
        </div>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="flex flex-col space-y-4">
            <Skeleton className="aspect-square w-full rounded-xl bg-stone-100" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[40%]" />
            </div>
            <Skeleton className="h-10 w-full rounded-full" />
        </div>
    )
}

export function ProductDetailSkeleton() {
    return (
        <div className="container px-4 py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                <Skeleton className="aspect-square w-full rounded-2xl bg-stone-100" />
                <div className="space-y-8">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-10 w-[80%]" />
                        <Skeleton className="h-6 w-[150px]" />
                    </div>
                    <Skeleton className="h-24 w-full" />
                    <div className="space-y-4 pt-8">
                        <Skeleton className="h-12 w-full rounded-full" />
                        <Skeleton className="h-12 w-full rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    )
}
